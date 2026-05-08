const fs = require("fs/promises");
const https = require("https");
const path = require("path");
const { DATA_DIR } = require("./fileStore");
const { cloudinary, assertCloudinaryConfigured } = require("../config/cloudinary");

const DOCUMENT_STORE_FILE_NAME = "document-library.json";
const DOCUMENT_STORE_FILE = path.join(DATA_DIR, DOCUMENT_STORE_FILE_NAME);
const DOCUMENT_STORE_CLOUDINARY_PUBLIC_ID = "sc-training/data/document-library";

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function normalizeDocumentState(value = {}) {
  const documents = Array.isArray(value.documents) ? value.documents : [];
  const deletedPaths = Array.isArray(value.deletedPaths) ? value.deletedPaths : [];

  return {
    documents,
    deletedPaths: Array.from(new Set(deletedPaths.filter(Boolean)))
  };
}

function hasDocumentStateContent(state = {}) {
  return Boolean((state.documents || []).length || (state.deletedPaths || []).length);
}

function downloadText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`Document metadata download failed with status ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

async function readLocalDocumentStore() {
  try {
    const content = await fs.readFile(DOCUMENT_STORE_FILE, "utf8");
    return normalizeDocumentState(JSON.parse(content));
  } catch {
    return { documents: [], deletedPaths: [] };
  }
}

async function restoreDocumentStoreFromCloudinary() {
  try {
    assertCloudinaryConfigured();
    const resource = await cloudinary.api.resource(DOCUMENT_STORE_CLOUDINARY_PUBLIC_ID, {
      resource_type: "raw"
    });

    if (!resource || !resource.secure_url) {
      return null;
    }

    return normalizeDocumentState(JSON.parse(await downloadText(resource.secure_url)));
  } catch {
    return null;
  }
}

async function syncDocumentStoreToCloudinary() {
  try {
    assertCloudinaryConfigured();
    await cloudinary.uploader.upload(DOCUMENT_STORE_FILE, {
      resource_type: "raw",
      public_id: DOCUMENT_STORE_CLOUDINARY_PUBLIC_ID,
      overwrite: true,
      invalidate: true
    });
  } catch (error) {
    console.error(`Document metadata Cloudinary sync failed: ${error.message}`);
  }
}

async function writeDocumentStore(state, options = {}) {
  await ensureDataDir();
  const normalized = normalizeDocumentState(state);
  await fs.writeFile(DOCUMENT_STORE_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");

  if (options.sync !== false) {
    await syncDocumentStoreToCloudinary();
  }

  return normalized;
}

async function readDocumentStore() {
  await ensureDataDir();

  const localState = await readLocalDocumentStore();
  if (hasDocumentStateContent(localState)) {
    return localState;
  }

  const cloudState = await restoreDocumentStoreFromCloudinary();
  if (cloudState) {
    await writeDocumentStore(cloudState, { sync: false });
    return cloudState;
  }

  await writeDocumentStore({ documents: [], deletedPaths: [] }, { sync: false });
  return { documents: [], deletedPaths: [] };
}

async function initDocumentStore(seedState = {}) {
  await ensureDataDir();

  const cloudState = await restoreDocumentStoreFromCloudinary();
  if (cloudState && hasDocumentStateContent(cloudState)) {
    await writeDocumentStore(cloudState, { sync: false });
    return DOCUMENT_STORE_FILE;
  }

  const localState = await readLocalDocumentStore();
  if (hasDocumentStateContent(localState)) {
    await writeDocumentStore(localState);
    return DOCUMENT_STORE_FILE;
  }

  await writeDocumentStore(normalizeDocumentState(seedState));
  return DOCUMENT_STORE_FILE;
}

module.exports = {
  DOCUMENT_STORE_CLOUDINARY_PUBLIC_ID,
  DOCUMENT_STORE_FILE,
  initDocumentStore,
  readDocumentStore,
  writeDocumentStore
};
