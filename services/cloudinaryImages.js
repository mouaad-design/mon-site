const { cloudinary, assertCloudinaryConfigured } = require("../config/cloudinary");

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

function parseDataUrl(dataUrl = "") {
  const match = String(dataUrl).match(/^data:(image\/(?:jpeg|png));base64,([a-z0-9+/=\s]+)$/i);

  if (!match) {
    throw new Error("Only JPG and PNG images are allowed");
  }

  const mimeType = match[1].toLowerCase();
  const base64 = match[2].replace(/\s/g, "");
  const byteLength = Buffer.from(base64, "base64").length;

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    throw new Error("Only JPG and PNG images are allowed");
  }

  if (byteLength > MAX_IMAGE_BYTES) {
    throw new Error("Each image must be 2MB or smaller");
  }

  return {
    dataUrl: `data:${mimeType};base64,${base64}`,
    mimeType,
    byteLength
  };
}

function normalizeImagePayload(rawImages) {
  const images = Array.isArray(rawImages) ? rawImages : [];

  if (images.length > MAX_IMAGES) {
    throw new Error("Maximum 3 images per complaint");
  }

  return images.map((image) => {
    if (typeof image === "string") {
      return parseDataUrl(image);
    }

    return parseDataUrl(image && image.dataUrl);
  });
}

async function uploadComplaintImages(rawImages) {
  const images = normalizeImagePayload(rawImages);

  if (!images.length) {
    return [];
  }

  assertCloudinaryConfigured();

  const uploadedImages = [];

  for (const image of images) {
    const result = await cloudinary.uploader.upload(image.dataUrl, {
      folder: "sc-training/complaints",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png"]
    });

    uploadedImages.push({
      url: result.secure_url,
      publicId: result.public_id
    });
  }

  return uploadedImages;
}

async function cleanupUploadedImages(uploadedImages = []) {
  await Promise.allSettled(
    uploadedImages
      .filter((image) => image && image.publicId)
      .map((image) => cloudinary.uploader.destroy(image.publicId))
  );
}

function getPublicIdFromCloudinaryUrl(imageUrl = "") {
  try {
    const url = new URL(imageUrl);
    const uploadMarker = "/upload/";
    const uploadIndex = url.pathname.indexOf(uploadMarker);

    if (uploadIndex === -1) {
      return "";
    }

    const pathAfterUpload = url.pathname.slice(uploadIndex + uploadMarker.length);
    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[a-z0-9]+$/i, "");
  } catch {
    return "";
  }
}

async function deleteImagesByUrl(imageUrls = []) {
  assertCloudinaryConfigured();
  const publicIds = imageUrls.map(getPublicIdFromCloudinaryUrl).filter(Boolean);

  if (!publicIds.length) {
    return;
  }

  await Promise.allSettled(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));
}

module.exports = {
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
  ALLOWED_IMAGE_TYPES,
  normalizeImagePayload,
  uploadComplaintImages,
  cleanupUploadedImages,
  deleteImagesByUrl
};
