const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DOCUMENTS_DIR = path.join(ROOT_DIR, "documents");
const MANIFEST_PATH = path.join(DOCUMENTS_DIR, "document-manifest.json");
const ADMIN_PASSWORD = "Quality0Defects";
const ADMIN_COOKIE_NAME = "sc_training_admin";
const ADMIN_COOKIE_VALUE = "active";

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

function isAdminRequest(request) {
  const cookies = readCookies(request);
  return cookies[ADMIN_COOKIE_NAME] === ADMIN_COOKIE_VALUE;
}

function requireAdmin(request, response) {
  if (isAdminRequest(request)) {
    return true;
  }

  sendJson(response, 403, { error: "Admin access required" });
  return false;
}

function setAdminCookie(response) {
  response.setHeader("Set-Cookie", `${ADMIN_COOKIE_NAME}=${ADMIN_COOKIE_VALUE}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`);
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 80 * 1024 * 1024) {
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
  const title = documentItem.title || path.basename(documentItem.path || "");
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

function getClientDocuments(url) {
  const client = safeSegment(url.searchParams.get("client"), "stellantis");
  const section = safeSegment(url.searchParams.get("section"), "quality");
  const manifest = readManifest();
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
    const fileName = safeFileName(title);
    const clientDir = path.join(DOCUMENTS_DIR, client);
    const savedPath = path.join(clientDir, fileName);
    const projectPath = `./documents/${client}/${fileName}`;
    const newDocument = {
      id: safeSegment(path.parse(fileName).name, "document"),
      title,
      path: projectPath,
      mediaType,
      client,
      section,
      isServerSaved: true
    };
    const identity = documentIdentity(newDocument);
    const manifest = readManifest();

    fs.mkdirSync(clientDir, { recursive: true });
    fs.writeFileSync(savedPath, buffer);

    manifest.documents = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      return !sameLibrary || documentIdentity(documentItem) !== identity;
    });
    manifest.documents.push(newDocument);
    manifest.deletedPaths = (manifest.deletedPaths || []).filter((deletedPath) => deletedPath !== projectPath);
    writeManifest(manifest);

    sendJson(response, 200, { document: newDocument });
  } catch (error) {
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
    const manifest = readManifest();
    const identity = normalizeDocumentIdentity(title);

    if (!documentPath.startsWith("./documents/")) {
      throw new Error("Invalid document path");
    }

    const diskPath = resolveProjectPath(documentPath);
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }

    manifest.documents = manifest.documents.filter((documentItem) => {
      const sameLibrary = documentItem.client === client && documentItem.section === section;
      const sameDocument = documentItem.path === documentPath || documentIdentity(documentItem) === identity;
      return !(sameLibrary && sameDocument);
    });
    manifest.deletedPaths = Array.from(new Set([...(manifest.deletedPaths || []), documentPath]));
    writeManifest(manifest);

    sendJson(response, 200, { ok: true, deletedPaths: manifest.deletedPaths });
  } catch (error) {
    sendJson(response, 400, { error: "Unable to delete document" });
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

function serveStatic(request, response, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
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

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

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

  try {
    serveStatic(request, response, url);
  } catch {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Access denied");
  }
});

server.listen(PORT, () => {
  console.log(`SC Training running on http://localhost:${PORT}`);
});
