const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

function assertCloudinaryConfigured() {
  if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
    throw new Error("Cloudinary environment variables are required");
  }
}

module.exports = {
  cloudinary,
  assertCloudinaryConfigured
};
