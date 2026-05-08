require("dotenv").config({ path: "./.env" });
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { cloudinary, assertCloudinaryConfigured } = require("./config/cloudinary");
const { handleComplaintsApi } = require("./api/complaints");
const { handleQuizResultsApi } = require("./api/quizResults");
const { initComplaintStore } = require("./services/complaintStore");
const { initDocumentStore, readDocumentStore, writeDocumentStore } = require("./services/documentStore");
const { ensureQuizResultsFile } = require("./services/quizExcelStore");
const {
  initMediaStore,
  normalizeMedia,
  readMedia,
  removeDocumentMedia,
  removeMediaById,
  upsertMedia
} = require("./services/mediaStore");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DOCUMENTS_DIR = path.join(ROOT_DIR, "documents");
const MANIFEST_PATH = path.join(DOCUMENTS_DIR, "document-manifest.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Quality0Defects";
const ADMIN_COOKIE_NAME = "sc_training_admin";
const ADMIN_SESSION_SECONDS = 8 * 60 * 60;
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || ADMIN_PASSWORD;
const MAX_REQUEST_BODY_BYTES = 150 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const AUTO_MIGRATE_DOCUMENTS = process.env.AUTO_MIGRATE_DOCUMENTS !== "false";
const TEMP_UPLOAD_DIR = path.join(ROOT_DIR, "temp");

fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });

const upload = multer({
  dest: TEMP_UPLOAD_DIR,
  limits: {
    fileSize: MAX_VIDEO_BYTES
  },
  fileFilter(request, file, callback) {
    const mimeType = String(file.mimetype || "").toLowerCase();
    const isAllowedImage = mimeType.startsWith("image/");
    const isAllowedVideo = mimeType === "video/mp4";

    if (!isAllowedImage && !isAllowedVideo) {
      callback(new Error("Only images and mp4 videos are allowed"));
      return;
    }

    callback(null, true);
  }
});

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg"
};

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    return {
      documents: [],
      deletedPaths: []
    };
  }
}

function writeManifest(manifest) {
  fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

function dedupeManifestDocuments(manifest) {
  const nextManifest = {
    ...manifest,
    documents: [],
    deletedPaths: Array.from(new Set(manifest.deletedPaths || []))
  };
  const documentsByIdentity = new Map();
  const identityAliases = new Map();

  (manifest.documents || []).forEach((documentItem) => {
    const scope = `${documentItem.client || "stellantis"}:${documentItem.section || "quality"}`;
    const identityKeys = documentIdentityKeys(documentItem).map((identityKey) => `${scope}:${identityKey}`);
    const matchedKey = identityKeys.find((identityKey) => identityAliases.has(identityKey));
    const primaryKey = matchedKey
      ? identityAliases.get(matchedKey)
      : identityKeys[0] || `${scope}:${documentItem.id || documentItem.path || documentItem.title}`;
    const existingDocument = documentsByIdentity.get(primaryKey);

    if (!existingDocument || (documentItem.migratedToCloudinary && !existingDocument.migratedToCloudinary)) {
      documentsByIdentity.set(primaryKey, documentItem);
    }

    identityKeys.forEach((identityKey) => {
      identityAliases.set(identityKey, primaryKey);
    });
  });

  nextManifest.documents = Array.from(documentsByIdentity.values());
  return nextManifest;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  });
  response.end(JSON.stringify(payload));
}

function readCookies(request) {
  const rawCookie = request.headers.cookie || "";
  return rawCookie.split(";").reduce((cookies, cookiePart) => {
    const [name, ...valueParts] = cookiePart.trim().split("=");
    if (!name) {
      return cookies;
    }

    cookies[name] = decodeURIComponent(valueParts.join("=") || "");
    return cookies;
  }, {});
}

function signAdminCookiePayload(payload) {
  return crypto
    .createHmac("sha256", ADMIN_SESSION_SECRET)
    .update(payload)
    .digest("base64url");
}

function createAdminCookieValue() {
  const expiresAt = Date.now() + ADMIN_SESSION_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${signAdminCookiePayload(payload)}`;
}

function isValidAdminCookieValue(cookieValue = "") {
  const [payload, signature] = String(cookieValue).split(".");
  const expiresAt = Number(payload);

  if (!payload || !signature || !expiresAt || Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const expectedSignature = signAdminCookiePayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  return signatureBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

function isAdminRequest(request) {
  const cookies = readCookies(request);
  return isValidAdminCookieValue(cookies[ADMIN_COOKIE_NAME]);
}

function requireAdmin(request, response) {
  if (isAdminRequest(request)) {
    return true;
  }

  sendJson(response, 403, { error: "Admin access required" });
  return false;
}

function setAdminCookie(response) {
  response.setHeader("Set-Cookie", `${ADMIN_COOKIE_NAME}=${encodeURIComponent(createAdminCookieValue())}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ADMIN_SESSION_SECONDS}`);
}

function clearAdminCookie(response) {
  response.setHeader("Set-Cookie", `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > MAX_REQUEST_BODY_BYTES) {
        reject(new Error("Request too large"));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function safeSegment(value, fallback) {
  return String(value || fallback)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || fallback;
}

function safeFileName(fileName) {
  const parsed = path.parse(fileName || "document.pdf");
  const extension = safeSegment(parsed.ext.replace(".", ""), "pdf");
  const baseName = safeSegment(parsed.name, "document");
  return `${baseName}.${extension}`;
}

function isVideoUpload(mediaType, fileName) {
  return String(mediaType || "").toLowerCase().startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(fileName || "");
}

function isPhotoUpload(mediaType, fileName) {
  return String(mediaType || "").toLowerCase().startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileName || "");
}

function isRemoteUrl(value = "") {
  return /^https?:\/\//i.test(String(value || ""));
}

function getUploadByteLimit(mediaType, fileName) {
  if (isVideoUpload(mediaType, fileName)) {
    return MAX_VIDEO_BYTES;
  }

  if (isPhotoUpload(mediaType, fileName)) {
    return MAX_PHOTO_BYTES;
  }

  return MAX_DOCUMENT_BYTES;
}

function normalizeDocumentIdentity(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function documentIdentity(documentItem) {
  return documentIdentityKeys(documentItem)[0] || "";
}

function documentIdentityKeys(documentItem = {}) {
  const rawValues = [
    documentItem.id,
    documentItem.title,
    path.basename(documentItem.path || ""),
    ...((documentItem.sourcePaths || []).map((sourcePath) => path.basename(sourcePath || "")))
  ];

  return Array.from(
    new Set(
      rawValues
        .map((value) => normalizeDocumentIdentity(value))
        .filter(Boolean)
    )
  );
}

function documentSharesIdentity(firstDocument = {}, secondDocument = {}) {
  const firstKeys = new Set(documentIdentityKeys(firstDocument));
  return documentIdentityKeys(secondDocument).some((identityKey) => firstKeys.has(identityKey));
}

function documentHasDeletedPath(documentItem = {}, deletedPaths = []) {
  const deletedPathSet = new Set(deletedPaths || []);
  const documentPaths = [
    documentItem.path,
    ...((documentItem.sourcePaths || [])),
    ...((documentItem.gallery || []))
  ].filter(Boolean);

  return documentPaths.some((documentPath) => deletedPathSet.has(documentPath));
}

function documentIsDeleted(documentItem = {}, manifest = {}) {
  if (documentHasDeletedPath(documentItem, manifest.deletedPaths || [])) {
    return true;
  }

  return (manifest.deletedDocuments || []).some((deletedDocument) => {
    const sameLibrary =
      (deletedDocument.client || "stellantis") === (documentItem.client || "stellantis") &&
      (deletedDocument.section || "quality") === (documentItem.section || "quality");
    return sameLibrary && documentSharesIdentity(deletedDocument, documentItem);
  });
}

function createDeletedDocumentRecord(documentItem = {}, fallback = {}) {
  return {
    id: documentItem.id || fallback.id || "",
    title: documentItem.title || fallback.title || "",
    path: documentItem.path || fallback.path || "",
    client: documentItem.client || fallback.client || "stellantis",
    section: documentItem.section || fallback.section || "quality",
    sourcePaths: Array.from(new Set([
      ...((documentItem.sourcePaths || [])),
      ...((fallback.sourcePaths || []))
    ].filter(Boolean))),
    deletedAt: new Date().toISOString()
  };
}

function resolveProjectPath(projectPath) {
  const cleanPath = String(projectPath || "").replace(/^\.?\//, "");
  const resolvedPath = path.resolve(ROOT_DIR, cleanPath);

  if (!resolvedPath.startsWith(ROOT_DIR)) {
    throw new Error("Invalid path");
  }

  return resolvedPath;
}

function canDeleteLocalDocumentPath(projectPath = "") {
  return String(projectPath).startsWith("./documents/") || String(projectPath).startsWith("./video/");
}

function getCloudinaryPublicIdFromUrl(assetUrl = "") {
  try {
    const parsedUrl = new URL(assetUrl);
    const uploadMarker = "/upload/";
    const uploadIndex = parsedUrl.pathname.indexOf(uploadMarker);

    if (uploadIndex === -1) {
      return "";
    }

    const pathAfterUpload = parsedUrl.pathname.slice(uploadIndex + uploadMarker.length);
    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[a-z0-9]+$/i, "");
  } catch {
    return "";
  }
}

function getResourceTypeFromDocument(documentItem = {}) {
  if (documentItem.cloudinaryResourceType) {
    return documentItem.cloudinaryResourceType;
  }

  if (isVideoUpload(documentItem.mediaType, documentItem.title || documentItem.path)) {
    return "video";
  }

  return "image";
}

async function destroyCloudinaryMedia(publicId, resourceType = "image") {
  if (!publicId) {
    return;
  }

  assertCloudinaryConfigured();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType || "image",
    invalidate: true
  });
}

async function destroyDocumentCloudinaryMedia(documentItem = {}) {
  const targets = [];

  if (documentItem.cloudinaryPublicId) {
    targets.push({
      publicId: documentItem.cloudinaryPublicId,
      resourceType: getResourceTypeFromDocument(documentItem)
    });
  }

  (documentItem.cloudinaryGallery || []).forEach((galleryItem) => {
    targets.push({
      publicId: galleryItem.publicId,
      resourceType: galleryItem.resourceType || "image"
    });
  });

  if (isRemoteUrl(documentItem.path)) {
    targets.push({
      publicId: getCloudinaryPublicIdFromUrl(documentItem.path),
      resourceType: getResourceTypeFromDocument(documentItem)
    });
  }

  (documentItem.gallery || []).forEach((galleryPath) => {
    if (!isRemoteUrl(galleryPath)) {
      return;
    }

    targets.push({
      publicId: getCloudinaryPublicIdFromUrl(galleryPath),
      resourceType: "image"
    });
  });

  const seenTargets = new Set();
  const uniqueTargets = targets.filter((target) => {
    const key = `${target.resourceType}:${target.publicId}`;
    if (!target.publicId || seenTargets.has(key)) {
      return false;
    }

    seenTargets.add(key);
    return true;
  });

  await Promise.allSettled(uniqueTargets.map((target) => destroyCloudinaryMedia(target.publicId, target.resourceType)));
}

function deleteLocalDocumentFile(projectPath = "") {
  if (!projectPath || isRemoteUrl(projectPath)) {
    return;
  }

  if (!canDeleteLocalDocumentPath(projectPath)) {
    throw new Error("Invalid document path");
  }

  const diskPath = resolveProjectPath(projectPath);
  if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
    fs.unlinkSync(diskPath);
  }
}

function getMigrationDocumentDefinitions() {
  const presentationSlides = Array.from({ length: 18 }, (_, index) => {
    return `./documents/stellantis/presentation-operateur/Diapositive${index + 1}.PNG`;
  });

  return [
    {
      id: "caracteres-speciaux-arabe",
      title: "CARACTÈRES SPÉCIAUX arabe",
      path: "./documents/stellantis/caracteres-speciaux-arabe.png",
      mediaType: "image/png",
      client: "stellantis",
      section: "quality"
    },
    {
      id: "cs-operateur",
      title: "Fichier CS operateur",
      path: "./documents/stellantis/fichier-cs-operateur.png",
      mediaType: "image/png",
      client: "stellantis",
      section: "quality"
    },
    {
      id: "mapping-charge-ar-v2",
      title: "Mapping charge AR version 2",
      path: "./documents/stellantis/mapping-charge-ar-version-2.PNG",
      mediaType: "image/png",
      client: "stellantis",
      section: "quality"
    },
    {
      id: "presentation-operateur",
      title: "Présentation opérateur",
      path: presentationSlides[0],
      mediaType: "image/gallery",
      gallery: presentationSlides,
      client: "stellantis",
      section: "training"
    },
    {
      id: "cdpo-training-module",
      title: "CDPO Training Module",
      path: "./video/stellantis/CDPO _ Training Module..mp4",
      mediaType: "video/mp4",
      client: "stellantis",
      section: "tutorials"
    }
  ];
}

async function getClientDocuments(url) {
  const client = safeSegment(url.searchParams.get("client"), "stellantis");
  const section = safeSegment(url.searchParams.get("section"), "quality");
  const manifest = dedupeManifestDocuments(await readDocumentStore());
  const manifestDocuments = manifest.documents.filter(
    (documentItem) =>
      documentItem.client === client &&
      documentItem.section === section &&
      !documentIsDeleted(documentItem, manifest)
  );
  const persistedDocuments = (await readMedia())
    .filter((mediaItem) => mediaItem.kind === "document" && mediaItem.client === client && mediaItem.section === section)
    .map((mediaItem) => mediaToDocument(mediaItem))
    .filter((documentItem) => !documentIsDeleted(documentItem, manifest));
  const documentsByIdentity = new Map();
  const identityAliases = new Map();

  function upsertDocument(documentItem) {
    const identityKeys = documentIdentityKeys(documentItem);
    const matchedKey = identityKeys.find((identityKey) => identityAliases.has(identityKey));
    const primaryKey = matchedKey
      ? identityAliases.get(matchedKey)
      : identityKeys[0] || documentItem.id || documentItem.path || documentItem.title;

    documentsByIdentity.set(primaryKey, documentItem);
    identityKeys.forEach((identityKey) => {
      identityAliases.set(identityKey, primaryKey);
    });
  }

  [...persistedDocuments, ...manifestDocuments].forEach(upsertDocument);

  sendJsonResponse(url.response, 200, {
    documents: Array.from(documentsByIdentity.values()),
    deletedPaths: manifest.deletedPaths || [],
    deletedDocuments: manifest.deletedDocuments || []
  });
}

function sendJsonResponse(response, statusCode, payload) {
  sendJson(response, statusCode, payload);
}

async function saveDocument(request, response) {
  let uploadedResult = null;

  try {
    if (!requireAdmin(request, response)) {
      return;
    }

    const payload = JSON.parse(await readRequestBody(request));
    const client = safeSegment(payload.client, "stellantis");
    const section = safeSegment(payload.section, "quality");
    const title = String(payload.title || "document.pdf");
    const mediaType = String(payload.mediaType || "");
    const dataUrl = String(payload.dataUrl || "");
    const base64 = dataUrl.includes(",") ? dataUrl.split(",").pop() : dataUrl;
    const buffer = Buffer.from(base64, "base64");
    const maxBytes = getUploadByteLimit(mediaType, title);

    if (buffer.length > maxBytes) {
      sendJson(response, 413, { error: "File too large" });
      return;
    }

    const fileName = safeFileName(title);
    const cloudinaryDataUrl = dataUrl.startsWith("data:")
      ? dataUrl
      : `data:${mediaType || "application/octet-stream"};base64,${base64}`;
    const result = await uploadToCloudinary(cloudinaryDataUrl, `sc-training/documents/${client}/${section}`);
    uploadedResult = result;
    const projectPath = result.secure_url;
    const newDocument = {
      id: safeSegment(path.parse(fileName).name, "document"),
      title,
      path: projectPath,
      mediaType,
      client,
      section,
      isServerSaved: true,
      cloudinaryPublicId: result.public_id,
      cloudinaryResourceType: result.resource_type || (isVideoUpload(mediaType, title) ? "video" : "image")
    };
    const persistedMedia = await upsertMedia({
      kind: "document",
      id: newDocument.id,
      title,
      client,
      section,
      secure_url: result.secure_url,
      public_id: result.public_id,
      file_type: mediaType,
      resource_type: newDocument.cloudinaryResourceType,
      original_name: title,
      size: buffer.length,
      uploaded_at: new Date().toISOString()
    });
    const manifest = dedupeManifestDocuments(await readDocumentStore());
    const replacedDocuments = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      return sameLibrary && documentSharesIdentity(documentItem, newDocument);
    });

    manifest.documents = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      return !sameLibrary || !documentSharesIdentity(documentItem, newDocument);
    });
    manifest.documents.push(newDocument);
    manifest.deletedPaths = (manifest.deletedPaths || []).filter((deletedPath) => deletedPath !== projectPath);
    manifest.deletedDocuments = (manifest.deletedDocuments || []).filter((deletedDocument) => {
      const sameLibrary = (deletedDocument.client || "stellantis") === client && (deletedDocument.section || "quality") === section;
      return !sameLibrary || !documentSharesIdentity(deletedDocument, newDocument);
    });
    await writeDocumentStore(manifest);
    writeManifest(manifest);
    await Promise.allSettled([
      ...replacedDocuments.map((documentItem) => destroyDocumentCloudinaryMedia(documentItem)),
      ...persistedMedia.replaced
        .filter((mediaItem) => mediaItem.public_id !== result.public_id)
        .map((mediaItem) => destroyCloudinaryMedia(mediaItem.public_id, mediaItem.resource_type || "image"))
    ]);

    sendJson(response, 200, { document: newDocument });
  } catch (error) {
    if (uploadedResult && uploadedResult.public_id) {
      await Promise.allSettled([
        destroyCloudinaryMedia(uploadedResult.public_id, uploadedResult.resource_type || "image")
      ]);
    }

    sendJson(response, 400, { error: "Unable to save document" });
  }
}

async function deleteDocument(request, response) {
  try {
    if (!requireAdmin(request, response)) {
      return;
    }

    const payload = JSON.parse(await readRequestBody(request));
    const client = safeSegment(payload.client, "stellantis");
    const section = safeSegment(payload.section, "quality");
    const documentPath = String(payload.path || "");
    const title = String(payload.title || path.basename(documentPath));
    const manifest = dedupeManifestDocuments(await readDocumentStore());
    const deleteIdentity = {
      id: payload.id || "",
      title,
      path: documentPath,
      sourcePaths: Array.isArray(payload.sourcePaths) ? payload.sourcePaths : []
    };
    const matchingDocument = manifest.documents.find((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      const sameDocument = documentItem.path === documentPath || documentSharesIdentity(documentItem, deleteIdentity);
      return sameLibrary && sameDocument;
    });
    const deletionPaths = Array.from(
      new Set([
        documentPath,
        ...(Array.isArray(payload.sourcePaths) ? payload.sourcePaths : []),
        ...((matchingDocument && matchingDocument.sourcePaths) || []),
        ...((matchingDocument && matchingDocument.gallery) || []),
        ...(Array.isArray(payload.gallery) ? payload.gallery : []),
        ...((matchingDocument && matchingDocument.cloudinaryGallery) || []).map((galleryItem) => galleryItem && galleryItem.url),
        ...(Array.isArray(payload.cloudinaryGallery)
          ? payload.cloudinaryGallery.map((galleryItem) => galleryItem && galleryItem.url)
          : [])
      ].filter(Boolean))
    );

    const removedMedia = await removeDocumentMedia({
      ...payload,
      client,
      section,
      path: documentPath,
      title,
      cloudinaryPublicId: payload.cloudinaryPublicId || matchingDocument?.cloudinaryPublicId || "",
      cloudinaryResourceType: payload.cloudinaryResourceType || matchingDocument?.cloudinaryResourceType || ""
    });

    await Promise.allSettled([
      destroyDocumentCloudinaryMedia(matchingDocument || payload),
      ...removedMedia.map((mediaItem) => destroyCloudinaryMedia(mediaItem.public_id, mediaItem.resource_type || "image"))
    ]);
    const staticSourcePaths = new Set([
      ...(Array.isArray(payload.sourcePaths) ? payload.sourcePaths : []),
      ...((matchingDocument && matchingDocument.sourcePaths) || [])
    ]);
    deletionPaths
      .filter((projectPath) => !staticSourcePaths.has(projectPath))
      .forEach((projectPath) => {
        deleteLocalDocumentFile(projectPath);
      });

    manifest.documents = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      const sameDocument = documentItem.path === documentPath || documentSharesIdentity(documentItem, deleteIdentity);
      return !(sameLibrary && sameDocument);
    });
    manifest.deletedPaths = Array.from(
      new Set([
        ...(manifest.deletedPaths || []),
        ...deletionPaths.filter((itemPath) => !isRemoteUrl(itemPath))
      ])
    );
    const deletedRecord = createDeletedDocumentRecord(matchingDocument || payload, {
      ...deleteIdentity,
      client,
      section
    });
    manifest.deletedDocuments = [
      ...(manifest.deletedDocuments || []).filter((deletedDocument) => {
        const sameLibrary =
          (deletedDocument.client || "stellantis") === client &&
          (deletedDocument.section || "quality") === section;
        return !sameLibrary || !documentSharesIdentity(deletedDocument, deletedRecord);
      }),
      deletedRecord
    ];
    await writeDocumentStore(manifest);
    writeManifest(manifest);

    sendJson(response, 200, {
      ok: true,
      deletedPaths: manifest.deletedPaths,
      deletedDocuments: manifest.deletedDocuments
    });
  } catch (error) {
    sendJson(response, 400, { error: "Unable to delete document" });
  }
}

async function migrateExistingDocumentsToCloudinary(request, response) {
  try {
    if (!requireAdmin(request, response)) {
      return;
    }

    const result = await migrateLocalDocumentsToCloudinary();
    sendJson(response, 200, {
      ok: true,
      migrated: result.migrated,
      skipped: result.skipped,
      documents: result.documents
    });
  } catch (error) {
    sendJson(response, 500, { error: "Unable to migrate documents" });
  }
}

async function migrateLocalDocumentsToCloudinary() {
  const manifest = dedupeManifestDocuments(await readDocumentStore());
  const migratedDocuments = [];
  let skippedDocuments = 0;

  for (const definition of getMigrationDocumentDefinitions()) {
    const folder = `sc-training/documents/${definition.client}/${definition.section}`;
    const sourcePaths = definition.gallery || [definition.path];
    const uploadedItems = [];

    if (documentIsDeleted({ ...definition, sourcePaths }, manifest)) {
      skippedDocuments += 1;
      continue;
    }

    const existingMigratedDocument = manifest.documents.find((documentItem) => {
      const sameLibrary = documentItem.client === definition.client && documentItem.section === definition.section;
      return sameLibrary && documentIdentity(documentItem) === documentIdentity(definition) && documentItem.migratedToCloudinary && isRemoteUrl(documentItem.path);
    });

    if (existingMigratedDocument) {
      skippedDocuments += 1;
      continue;
    }

    for (const sourcePath of sourcePaths) {
      const diskPath = resolveProjectPath(sourcePath);
      if (!fs.existsSync(diskPath) || !fs.statSync(diskPath).isFile()) {
        continue;
      }

      const result = await uploadToCloudinary(diskPath, folder);
      uploadedItems.push({
        sourcePath,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type || (definition.mediaType.startsWith("video/") ? "video" : "image")
      });
    }

    if (!uploadedItems.length) {
      continue;
    }

    const firstUpload = uploadedItems[0];
    const migratedDocument = {
      ...definition,
      path: firstUpload.url,
      sourcePaths,
      isServerSaved: true,
      migratedToCloudinary: true,
      cloudinaryPublicId: firstUpload.publicId,
      cloudinaryResourceType: firstUpload.resourceType
    };

    if (definition.gallery) {
      migratedDocument.gallery = uploadedItems.map((item) => item.url);
      migratedDocument.cloudinaryGallery = uploadedItems.map((item) => ({
        publicId: item.publicId,
        resourceType: item.resourceType,
        url: item.url
      }));
    }

    manifest.documents = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === migratedDocument.client && documentItem.section === migratedDocument.section;
      return !sameLibrary || documentIdentity(documentItem) !== documentIdentity(migratedDocument);
    });
    manifest.documents.push(migratedDocument);
    manifest.deletedPaths = (manifest.deletedPaths || []).filter((deletedPath) => !sourcePaths.includes(deletedPath));
    migratedDocuments.push(migratedDocument);
  }

  await writeDocumentStore(manifest);
  writeManifest(manifest);
  return {
    migrated: migratedDocuments.length,
    skipped: skippedDocuments,
    documents: migratedDocuments
  };
}

async function autoMigrateLocalDocuments() {
  if (!AUTO_MIGRATE_DOCUMENTS) {
    return;
  }

  try {
    const result = await migrateLocalDocumentsToCloudinary();
    if (result.migrated || result.skipped) {
      console.log(`Cloudinary document migration: ${result.migrated} migrated, ${result.skipped} already migrated`);
    }
  } catch (error) {
    console.error(`Cloudinary document migration failed: ${error.message}`);
  }
}

async function syncManifestDocumentsToMediaStore() {
  const manifest = dedupeManifestDocuments(await readDocumentStore());
  const deletedPaths = manifest.deletedPaths || [];
  const cloudinaryDocuments = (manifest.documents || []).filter((documentItem) => {
    return documentItem.cloudinaryPublicId && isRemoteUrl(documentItem.path) && !documentHasDeletedPath(documentItem, deletedPaths);
  });

  for (const documentItem of cloudinaryDocuments) {
    await upsertMedia({
      kind: "document",
      id: documentItem.id,
      title: documentItem.title,
      client: documentItem.client || "stellantis",
      section: documentItem.section || "quality",
      secure_url: documentItem.path,
      public_id: documentItem.cloudinaryPublicId,
      file_type: documentItem.mediaType || "",
      resource_type: documentItem.cloudinaryResourceType || getResourceTypeFromDocument(documentItem),
      original_name: documentItem.title,
      uploaded_at: documentItem.createdAt || new Date().toISOString(),
      sourcePaths: documentItem.sourcePaths || [],
      gallery: documentItem.gallery || [],
      cloudinaryGallery: documentItem.cloudinaryGallery || []
    });
  }
}

async function handleAdminLogin(request, response) {
  try {
    const payload = JSON.parse(await readRequestBody(request));
    const password = String(payload.password || "");

    if (password !== ADMIN_PASSWORD) {
      sendJson(response, 401, { ok: false });
      return;
    }

    setAdminCookie(response);
    sendJson(response, 200, { ok: true, isAdmin: true });
  } catch {
    sendJson(response, 400, { ok: false });
  }
}

function handleAdminStatus(request, response) {
  sendJson(response, 200, { isAdmin: isAdminRequest(request) });
}

function handleAdminLogout(request, response) {
  clearAdminCookie(response);
  sendJson(response, 200, { ok: true, isAdmin: false });
}

function isSensitiveStaticPath(requestedPath = "") {
  const normalizedPath = requestedPath.replace(/\\/g, "/").toLowerCase();
  const blockedPrefixes = [
    "/api/",
    "/config/",
    "/data/",
    "/services/",
    "/node_modules/"
  ];
  const blockedFiles = new Set([
    "/.env",
    "/package.json",
    "/package-lock.json",
    "/server.js",
    "/server-verify.log",
    "/server-verify.err.log",
    "/documents/document-manifest.json"
  ]);

  return (
    normalizedPath.startsWith("/.") ||
    blockedFiles.has(normalizedPath) ||
    blockedPrefixes.some((prefix) => normalizedPath.startsWith(prefix))
  );
}

function serveStatic(request, response, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);

  if (isSensitiveStaticPath(requestedPath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const filePath = resolveProjectPath(`.${requestedPath}`);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const headers = {
    "Content-Type": mimeTypes[extension] || "application/octet-stream"
  };

  if (requestedPath.startsWith("/documents/")) {
    headers["Content-Disposition"] = `inline; filename="${path.basename(filePath)}"`;
    headers["X-Content-Type-Options"] = "nosniff";
  }

  response.writeHead(200, headers);
  fs.createReadStream(filePath).pipe(response);
}

async function uploadToCloudinary(filePath, folder = "sc-training/dashboard") {
  assertCloudinaryConfigured();

  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto"
  });
}

function runSingleFileUpload(request, response) {
  return new Promise((resolve, reject) => {
    upload.single("file")(request, response, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function mediaToDocument(media) {
  const normalizedMedia = normalizeMedia(media, "document");

  return {
    id: normalizedMedia.id || safeSegment(path.parse(normalizedMedia.originalName || normalizedMedia.title || "document").name, "document"),
    title: normalizedMedia.title || normalizedMedia.originalName || "Document",
    path: normalizedMedia.secure_url,
    mediaType: normalizedMedia.file_type || normalizedMedia.mimeType || "",
    client: normalizedMedia.client || "stellantis",
    section: normalizedMedia.section || "quality",
    isServerSaved: true,
    cloudinaryPublicId: normalizedMedia.public_id,
    cloudinaryResourceType: normalizedMedia.resource_type,
    sourcePaths: normalizedMedia.sourcePaths || [],
    gallery: normalizedMedia.gallery || [],
    cloudinaryGallery: normalizedMedia.cloudinaryGallery || []
  };
}

function serializeDashboardMedia(media) {
  const normalizedMedia = normalizeMedia(media, "dashboard");

  return {
    id: normalizedMedia.id,
    title: normalizedMedia.title,
    client: normalizedMedia.client,
    section: normalizedMedia.section,
    url: normalizedMedia.secure_url,
    secure_url: normalizedMedia.secure_url,
    public_id: normalizedMedia.public_id,
    publicId: normalizedMedia.public_id,
    resource_type: normalizedMedia.resource_type,
    resourceType: normalizedMedia.resource_type,
    file_type: normalizedMedia.file_type,
    mimeType: normalizedMedia.mimeType,
    originalName: normalizedMedia.originalName,
    size: normalizedMedia.size,
    uploaded_at: normalizedMedia.uploaded_at,
    createdAt: normalizedMedia.createdAt
  };
}

async function handleUpload(request, response) {
  let tempPath = "";
  let uploadedResult = null;

  try {
    if (!requireAdmin(request, response)) {
      return;
    }

    await runSingleFileUpload(request, response);

    if (!request.file) {
      sendJson(response, 400, { error: "File is required" });
      return;
    }

    tempPath = request.file.path;
    const mimeType = String(request.file.mimetype || "").toLowerCase();
    const isImage = mimeType.startsWith("image/");
    const isMp4Video = mimeType === "video/mp4";

    if (!isImage && !isMp4Video) {
      sendJson(response, 400, { error: "Only images and mp4 videos are allowed" });
      return;
    }

    const maxBytes = isMp4Video ? MAX_VIDEO_BYTES : MAX_PHOTO_BYTES;
    if (request.file.size > maxBytes) {
      sendJson(response, 413, { error: "File too large" });
      return;
    }

    const result = await uploadToCloudinary(tempPath);
    uploadedResult = result;
    const uploadedAt = new Date().toISOString();
    const title = String(request.body?.title || request.file.originalname || "dashboard-media");
    const client = safeSegment(request.body?.client, "stellantis");
    const section = safeSegment(request.body?.section, "dashboard");
    const media = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      kind: "dashboard",
      title,
      client,
      section,
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type === "video" ? "video" : "image",
      file_type: mimeType,
      original_name: request.file.originalname || title,
      size: request.file.size,
      uploaded_at: uploadedAt
    };
    const persistedMedia = await upsertMedia(media);

    sendJson(response, 200, {
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      media: serializeDashboardMedia(persistedMedia.media)
    });
  } catch (error) {
    if (uploadedResult && uploadedResult.public_id) {
      await Promise.allSettled([
        destroyCloudinaryMedia(uploadedResult.public_id, uploadedResult.resource_type === "video" ? "video" : "image")
      ]);
    }

    sendJson(response, error.code === "LIMIT_FILE_SIZE" ? 413 : 500, {
      error: error.message || "Upload error"
    });
  } finally {
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlink(tempPath, () => {});
    }
  }
}

async function listDashboardMedia(request, response) {
  try {
    const mediaItems = (await readMedia()).filter((mediaItem) => mediaItem.kind === "dashboard");
    const sortedMediaItems = mediaItems.sort((first, second) => {
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });

    sendJson(response, 200, {
      media: sortedMediaItems.map(serializeDashboardMedia)
    });
  } catch (error) {
    sendJson(response, 500, { error: "Unable to load dashboard media" });
  }
}

async function deleteDashboardMedia(request, response, mediaId) {
  try {
    if (!requireAdmin(request, response)) {
      return;
    }

    const media = await removeMediaById(mediaId);

    if (!media) {
      sendJson(response, 404, { error: "Media not found" });
      return;
    }

    await destroyCloudinaryMedia(media.public_id, media.resource_type === "video" ? "video" : "image");

    sendJson(response, 200, { ok: true });
  } catch (error) {
    sendJson(response, 500, { error: "Unable to delete dashboard media" });
  }
}
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const handledComplaintRequest = await handleComplaintsApi(request, response, url, {
    readRequestBody,
    requireAdmin,
    sendJson
  });

  if (handledComplaintRequest) {
    return;
  }

  const handledQuizResultsRequest = await handleQuizResultsApi(request, response, url, {
    readRequestBody,
    requireAdmin,
    sendJson
  });

  if (handledQuizResultsRequest) {
    return;
  }

  if (url.pathname === "/api/documents" && request.method === "GET") {
    url.response = response;
    await getClientDocuments(url);
    return;
  }

  if (url.pathname === "/api/admin/login" && request.method === "POST") {
    await handleAdminLogin(request, response);
    return;
  }

  if (url.pathname === "/api/admin/status" && request.method === "GET") {
    handleAdminStatus(request, response);
    return;
  }

  if (url.pathname === "/api/admin/logout" && request.method === "POST") {
    handleAdminLogout(request, response);
    return;
  }

  if (url.pathname === "/api/documents" && request.method === "POST") {
    await saveDocument(request, response);
    return;
  }

  if (url.pathname === "/api/documents" && request.method === "DELETE") {
    await deleteDocument(request, response);
    return;
  }

  if (url.pathname === "/api/documents/migrate-cloudinary" && request.method === "POST") {
    await migrateExistingDocumentsToCloudinary(request, response);
    return;
  }

  if (url.pathname === "/api/upload" && request.method === "POST") {
    await handleUpload(request, response);
    return;
  }

  if (url.pathname === "/api/dashboard-media" && request.method === "GET") {
    await listDashboardMedia(request, response);
    return;
  }

  const dashboardMediaDeleteMatch = url.pathname.match(/^\/api\/dashboard-media\/([^/]+)$/i);
  if (dashboardMediaDeleteMatch && request.method === "DELETE") {
    await deleteDashboardMedia(request, response, dashboardMediaDeleteMatch[1]);
    return;
  }

  try {
    serveStatic(request, response, url);
  } catch {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Access denied");
  }
});

server.listen(PORT, async () => {
  console.log(`SC Training running on http://localhost:${PORT}`);

  try {
    const documentStorePath = await initDocumentStore(dedupeManifestDocuments(readManifest()));
    await autoMigrateLocalDocuments();
    writeManifest(dedupeManifestDocuments(await readDocumentStore()));
    console.log(`Document metadata ready: ${path.relative(ROOT_DIR, documentStorePath)}`);
  } catch (error) {
    console.error(`Document metadata unavailable: ${error.message}`);
  }

  try {
    const mediaFilePath = await initMediaStore();
    await syncManifestDocumentsToMediaStore();
    console.log(`Media metadata ready: ${path.relative(ROOT_DIR, mediaFilePath)}`);
  } catch (error) {
    console.error(`Media metadata unavailable: ${error.message}`);
  }

  ensureQuizResultsFile()
    .then((filePath) => {
      console.log(`Quiz results Excel ready: ${path.relative(ROOT_DIR, filePath)}`);
    })
    .catch((error) => {
      console.error(`Quiz results Excel unavailable: ${error.message}`);
    });

  initComplaintStore()
    .then((filePath) => {
      console.log(`Complaints metadata ready: ${path.relative(ROOT_DIR, filePath)}`);
    })
    .catch((error) => {
      console.error(`Complaints metadata unavailable: ${error.message}`);
    });
});
