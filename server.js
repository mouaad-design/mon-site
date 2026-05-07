require("dotenv").config({ path: "./.env" });
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { cloudinary, assertCloudinaryConfigured } = require("./config/cloudinary");
const { handleComplaintsApi } = require("./api/complaints");
const { handleQuizResultsApi } = require("./api/quizResults");
const { readJsonFile, writeJsonFile } = require("./services/fileStore");
const { ensureQuizResultsFile } = require("./services/quizExcelStore");

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
const DASHBOARD_MEDIA_FILE = "dashboard-media.json";

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

  (manifest.documents || []).forEach((documentItem) => {
    const key = [
      documentItem.client || "stellantis",
      documentItem.section || "quality",
      documentIdentity(documentItem)
    ].join(":");
    const existingDocument = documentsByIdentity.get(key);

    if (!existingDocument || (documentItem.migratedToCloudinary && !existingDocument.migratedToCloudinary)) {
      documentsByIdentity.set(key, documentItem);
    }
  });

  nextManifest.documents = Array.from(documentsByIdentity.values());
  return nextManifest;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
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
  const title = documentItem.id || documentItem.title || path.basename(documentItem.path || "");
  return normalizeDocumentIdentity(title);
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

function getClientDocuments(url) {
  const client = safeSegment(url.searchParams.get("client"), "stellantis");
  const section = safeSegment(url.searchParams.get("section"), "quality");
  const manifest = dedupeManifestDocuments(readManifest());
  const documents = manifest.documents.filter(
    (documentItem) => documentItem.client === client && documentItem.section === section
  );

  sendJsonResponse(url.response, 200, {
    documents,
    deletedPaths: manifest.deletedPaths || []
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
    const identity = documentIdentity(newDocument);
    const manifest = dedupeManifestDocuments(readManifest());
    const replacedDocuments = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      return sameLibrary && documentIdentity(documentItem) === identity;
    });

    manifest.documents = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      return !sameLibrary || documentIdentity(documentItem) !== identity;
    });
    manifest.documents.push(newDocument);
    manifest.deletedPaths = (manifest.deletedPaths || []).filter((deletedPath) => deletedPath !== projectPath);
    writeManifest(manifest);
    await Promise.allSettled(replacedDocuments.map((documentItem) => destroyDocumentCloudinaryMedia(documentItem)));

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
    const manifest = dedupeManifestDocuments(readManifest());
    const identity = normalizeDocumentIdentity(title);
    const matchingDocument = manifest.documents.find((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      const sameDocument = documentItem.path === documentPath || documentIdentity(documentItem) === identity;
      return sameLibrary && sameDocument;
    });
    const deletionPaths = Array.from(
      new Set([
        documentPath,
        ...((matchingDocument && matchingDocument.sourcePaths) || []),
        ...((matchingDocument && matchingDocument.gallery) || []),
        ...(Array.isArray(payload.gallery) ? payload.gallery : [])
      ].filter(Boolean))
    );

    await destroyDocumentCloudinaryMedia(matchingDocument || payload);
    deletionPaths.forEach((projectPath) => {
      deleteLocalDocumentFile(projectPath);
    });

    manifest.documents = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      const sameDocument = documentItem.path === documentPath || documentIdentity(documentItem) === identity;
      return !(sameLibrary && sameDocument);
    });
    manifest.deletedPaths = matchingDocument && !matchingDocument.sourcePaths
      ? (manifest.deletedPaths || []).filter((deletedPath) => !deletionPaths.includes(deletedPath))
      : Array.from(new Set([...(manifest.deletedPaths || []), ...deletionPaths.filter((itemPath) => !isRemoteUrl(itemPath))]));
    writeManifest(manifest);

    sendJson(response, 200, { ok: true, deletedPaths: manifest.deletedPaths });
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
  const manifest = dedupeManifestDocuments(readManifest());
  const migratedDocuments = [];
  let skippedDocuments = 0;

  for (const definition of getMigrationDocumentDefinitions()) {
    const folder = `sc-training/documents/${definition.client}/${definition.section}`;
    const sourcePaths = definition.gallery || [definition.path];
    const uploadedItems = [];
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

function serializeDashboardMedia(media) {
  return {
    id: media.id,
    url: media.url,
    secure_url: media.url,
    publicId: media.publicId,
    resourceType: media.resourceType,
    mimeType: media.mimeType,
    originalName: media.originalName,
    size: media.size,
    createdAt: media.createdAt
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
    const mediaItems = await readJsonFile(DASHBOARD_MEDIA_FILE, []);
    const media = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type === "video" ? "video" : "image",
      mimeType,
      originalName: request.file.originalname || "dashboard-media",
      size: request.file.size,
      createdAt: new Date().toISOString()
    };

    const nextMediaItems = Array.isArray(mediaItems) ? mediaItems : [];
    nextMediaItems.push(media);
    await writeJsonFile(DASHBOARD_MEDIA_FILE, nextMediaItems);

    sendJson(response, 200, {
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      media: serializeDashboardMedia(media)
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
    const mediaItems = await readJsonFile(DASHBOARD_MEDIA_FILE, []);
    const sortedMediaItems = (Array.isArray(mediaItems) ? mediaItems : []).sort((first, second) => {
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

    const mediaItems = await readJsonFile(DASHBOARD_MEDIA_FILE, []);
    const safeMediaItems = Array.isArray(mediaItems) ? mediaItems : [];
    const media = safeMediaItems.find((item) => item.id === mediaId);

    if (!media) {
      sendJson(response, 404, { error: "Media not found" });
      return;
    }

    await destroyCloudinaryMedia(media.publicId, media.resourceType === "video" ? "video" : "image");
    await writeJsonFile(DASHBOARD_MEDIA_FILE, safeMediaItems.filter((item) => item.id !== mediaId));

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
    getClientDocuments(url);
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

server.listen(PORT, () => {
  console.log(`SC Training running on http://localhost:${PORT}`);
  autoMigrateLocalDocuments();
  ensureQuizResultsFile()
    .then((filePath) => {
      console.log(`Quiz results Excel ready: ${path.relative(ROOT_DIR, filePath)}`);
    })
    .catch((error) => {
      console.error(`Quiz results Excel unavailable: ${error.message}`);
    });
});
