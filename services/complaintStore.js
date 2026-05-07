const fs = require("fs/promises");
const https = require("https");
const path = require("path");
const { DATA_DIR } = require("./fileStore");
const { cloudinary, assertCloudinaryConfigured } = require("../config/cloudinary");

const COMPLAINTS_FILE_NAME = "complaints.json";
const COMPLAINTS_FILE = path.join(DATA_DIR, COMPLAINTS_FILE_NAME);
const COMPLAINTS_CLOUDINARY_PUBLIC_ID = "sc-training/data/complaints-library";

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function downloadText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        downloadText(response.headers.location).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Cloudinary complaints download failed with status ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.setEncoding("utf8");
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(chunks.join("")));
    });

    request.on("error", reject);
  });
}

function normalizeComplaintList(value) {
  return Array.isArray(value) ? value : [];
}

async function readLocalComplaints() {
  try {
    const content = await fs.readFile(COMPLAINTS_FILE, "utf8");
    return normalizeComplaintList(JSON.parse(content));
  } catch {
    return null;
  }

  return null;
}

async function restoreComplaintsFromCloudinary() {
  const candidatePublicIds = [
    COMPLAINTS_CLOUDINARY_PUBLIC_ID,
    `${COMPLAINTS_CLOUDINARY_PUBLIC_ID}.json`
  ];

  try {
    assertCloudinaryConfigured();

    for (const publicId of candidatePublicIds) {
      try {
        const resource = await cloudinary.api.resource(publicId, {
          resource_type: "raw"
        });

        if (resource && resource.secure_url) {
          return normalizeComplaintList(JSON.parse(await downloadText(resource.secure_url)));
        }
      } catch {
        // Try the next possible raw public id.
      }
    }
  } catch {
    return [];
  }
}

async function syncComplaintsToCloudinary() {
  try {
    assertCloudinaryConfigured();
    await cloudinary.uploader.upload(COMPLAINTS_FILE, {
      resource_type: "raw",
      public_id: COMPLAINTS_CLOUDINARY_PUBLIC_ID,
      overwrite: true,
      invalidate: true
    });
  } catch (error) {
    console.error(`Complaints Cloudinary sync failed: ${error.message}`);
  }
}

async function writeComplaints(complaints, options = {}) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const normalized = normalizeComplaintList(complaints);
  await fs.writeFile(COMPLAINTS_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");

  if (options.sync !== false) {
    await syncComplaintsToCloudinary();
  }

  return normalized;
}

async function readComplaints() {
  if (await pathExists(COMPLAINTS_FILE)) {
    const localComplaints = await readLocalComplaints();
    if (localComplaints.length) {
      return localComplaints;
    }
  }

  const restored = await restoreComplaintsFromCloudinary();
  if (restored) {
    await writeComplaints(restored, { sync: false });
    return restored;
  }

  await writeComplaints([], { sync: false });
  return [];
}

async function initComplaintStore() {
  const restored = await restoreComplaintsFromCloudinary();
  if (restored || !(await pathExists(COMPLAINTS_FILE))) {
    await writeComplaints(restored, { sync: false });
  }

  return COMPLAINTS_FILE;
}

module.exports = {
  COMPLAINTS_CLOUDINARY_PUBLIC_ID,
  COMPLAINTS_FILE,
  initComplaintStore,
  readComplaints,
  writeComplaints
};
