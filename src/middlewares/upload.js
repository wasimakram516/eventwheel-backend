const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../utils/cloudinary");
const env = require("../config/env");

// Function to determine folder dynamically
const getFolder = (req) => {
  if (req.baseUrl.includes("events")) return "events";
  return "general"; // Default folder for other uploads
};

// Configure Multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: `${env.cloudinary.folder}/${getFolder(req)}`,
    format: file.mimetype.split("/")[1], // Auto-detect file format
  }),
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPG, JPEG, and PNG allowed."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
  fileFilter,
});

module.exports = upload;
