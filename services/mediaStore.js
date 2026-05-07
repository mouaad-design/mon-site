const fs = require("fs/promises");
const https = require("https");
const path = require("path");
const { DATA_DIR } = require("./fileStore");
const { cloudinary, assertCloudinaryConfigured } = require("../config/cloudinary");

const MEDIA_FILE_NAME = "media.json";
const LEGACY_DASHBOARD_MEDIA_FILE_NAME = "dashboard-media.json";
const MEDIA_FILE = path.join(DATA_DIR, MEDIA_FILE_NAME);
const LEGACY_DASHBOARD_MEDIA_FILE = path.join(DATA_DIR, LEGACY_DASHBOARD_MEDIA_FILE_NAME);
const MEDIA_CLOUDINARY_PUBLIC_ID = "sc-training/data/media-library";

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function normalizeIdentity(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMediaIdentity(media = {}) {
  return normalizeIdentity(media.title || media.originalName || media.original_name || media.secure_url || media.url);
}

function normalizeMedia(media = {}, fallbackKind = "dashboard") {
  const secureUrl = media.secure_url || media.url || media.path || "";
  const publicId = media.public_id || media.publicId || media.cloudinaryPublicId || "";
  const resourceType = media.resource_type || media.resourceType || media.cloudinaryResourceType || "image";
  const mimeType = media.mime_type || media.mimeType || media.file_type || media.mediaType || "";
  const uploadedAt = media.uploaded_at || media.createdAt || media.created_at || new Date().toISOString();
  const title = media.title || media.originalName || media.original_name || "Uploaded media";
  const kind = media.kind || fallbackKind;

  return {
    id: media.id || publicId || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind,
    title,
    client: media.client || "stellantis",
    section: media.section || (kind === "document" ? "quality" : "dashboard"),
    secure_url: secureUrl,
    url: secureUrl,
    public_id: publicId,
    publicId,
    file_type: mimeType,
    mimeType,
    resource_type: resourceType,
    resourceType,
    original_name: media.original_name || media.originalName || title,
    originalName: media.originalName || media.original_name || title,
    size: Number(media.size) || 0,
    uploaded_at: uploadedAt,
    createdAt: uploadedAt,
    gallery: Array.isArray(media.gallery) ? media.gallery : [],
    cloudinaryGallery: Array.isArray(media.cloudinaryGallery) ? media.cloudinaryGallery : []
  };
}

function normalizeMediaList(value) {
  const media = Array.isArray(value) ? value : value && Array.isArray(value.media) ? value.media : [];
  return media
    .map((item) => normalizeMedia(item, item.kind || "dashboard"))
    .filter((item) => item.secure_url && item.public_id);
}

function downloadText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`Media metadata download failed with status ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

async function readLocalMediaFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return normalizeMediaList(JSON.parse(content));
  } catch {
    return [];
  }
}

async function restoreMediaFromCloudinary() {
  try {
    assertCloudinaryConfigured();
    const resource = await cloudinary.api.resource(MEDIA_CLOUDINARY_PUBLIC_ID, {
      resource_type: "raw"
    });

    if (!resource || !resource.secure_url) {
      return [];
    }

    return normalizeMediaList(JSON.parse(await downloadText(resource.secure_url)));
  } catch {
    return [];
  }
}

async function syncMediaToCloudinary() {
  try {
    assertCloudinaryConfigured();
    await cloudinary.uploader.upload(MEDIA_FILE, {
      resource_type: "raw",
      public_id: MEDIA_CLOUDINARY_PUBLIC_ID,
      overwrite: true,
      invalidate: true
    });
  } catch (error) {
    console.error(`Media metadata Cloudinary sync failed: ${error.message}`);
  }
}

async function writeMedia(mediaItems, options = {}) {
  await ensureDataDir();
  const normalized = normalizeMediaList(mediaItems);
  await fs.writeFile(MEDIA_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");

  if (options.sync !== false) {
    await syncMediaToCloudinary();
  }

  return normalized;
}

async function readMedia() {
  await ensureDataDir();

  let mediaItems = await readLocalMediaFile(MEDIA_FILE);
  if (mediaItems.length) {
    return mediaItems;
  }

  mediaItems = await restoreMediaFromCloudinary();
  if (mediaItems.length) {
    await writeMedia(mediaItems, { sync: false });
    return mediaItems;
  }

  const legacyMediaItems = await readLocalMediaFile(LEGACY_DASHBOARD_MEDIA_FILE);
  if (legacyMediaItems.length) {
    await writeMedia(legacyMediaItems);
    return legacyMediaItems;
  }

  await writeMedia([], { sync: false });
  return [];
}

function isSameMedia(first, second) {
  if (first.public_id && second.public_id && first.public_id === second.public_id) {
    return true;
  }

  return (
    first.kind === second.kind &&
    first.client === second.client &&
    first.section === second.section &&
    getMediaIdentity(first) === getMediaIdentity(second)
  );
}

async function upsertMedia(media) {
  const nextMedia = normalizeMedia(media, media.kind || "dashboard");
  const mediaItems = await readMedia();
  const replaced = mediaItems.filter((item) => isSameMedia(item, nextMedia));
  const retained = mediaItems.filter((item) => !isSameMedia(item, nextMedia));
  retained.push(nextMedia);
  await writeMedia(retained);

  return {
    media: nextMedia,
    replaced
  };
}

async function removeMediaById(mediaId) {
  const mediaItems = await readMedia();
  const media = mediaItems.find((item) => item.id === mediaId || item.public_id === mediaId || item.publicId === mediaId);

  if (!media) {
    return null;
  }

  await writeMedia(mediaItems.filter((item) => item.id !== media.id && item.public_id !== media.public_id));
  return media;
}

async function removeDocumentMedia(documentItem = {}) {
  const publicId = documentItem.public_id || documentItem.publicId || documentItem.cloudinaryPublicId || "";
  const mediaItems = await readMedia();
  const identity = getMediaIdentity({
    title: documentItem.title,
    secure_url: documentItem.path || documentItem.secure_url || documentItem.url
  });
  const client = documentItem.client || "stellantis";
  const section = documentItem.section || "quality";
  const removed = [];
  const retained = mediaItems.filter((item) => {
    const matchesPublicId = publicId && item.public_id === publicId;
    const matchesDocument =
      item.kind === "document" &&
      item.client === client &&
      item.section === section &&
      (item.secure_url === documentItem.path || getMediaIdentity(item) === identity);

    if (matchesPublicId || matchesDocument) {
      removed.push(item);
      return false;
    }

    return true;
  });

  if (removed.length) {
    await writeMedia(retained);
  }

  return removed;
}

async function initMediaStore() {
  const mediaItems = await readMedia();
  await writeMedia(mediaItems, { sync: false });
  return MEDIA_FILE;
}

module.exports = {
  MEDIA_FILE,
  MEDIA_CLOUDINARY_PUBLIC_ID,
  initMediaStore,
  normalizeMedia,
  readMedia,
  removeDocumentMedia,
  removeMediaById,
  upsertMedia
};
