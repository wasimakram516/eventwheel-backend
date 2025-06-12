require("dotenv").config({ path: ".env.local" });

// Function to validate required environment variables
const validateEnv = (key) => {
  if (!process.env[key]) {
    throw new Error(
      `Environment variable "${key}" is not set. Please define it in your .env.local file.`
    );
  }
  return process.env[key];
};

const env = {
  database: {
    url: validateEnv("MONGO_URI"),
  },
  jwt: {
    secret: validateEnv("JWT_SECRET"),
    accessExpiry: validateEnv("JWT_ACCESS_EXPIRY"),
    refreshExpiry: validateEnv("JWT_REFRESH_EXPIRY"),
  },
  server: {
    port: validateEnv("PORT"),
  },
  node_env: validateEnv("NODE_ENV"),

  masterKey: validateEnv("MASTER_KEY"),

  cloudinary: {
    cloudName: validateEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: validateEnv("CLOUDINARY_API_KEY"),
    apiSecret: validateEnv("CLOUDINARY_API_SECRET"),
    folder: validateEnv("CLOUDINARY_FOLDER"),
  },
};

module.exports = env;
