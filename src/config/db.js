const mongoose = require("mongoose");
const env = require("./env");

const DATABASE_URL = env.database.url;

// ✅ Function to initialize MongoDB connection
const initDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected.");
      return;
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

// ✅ Export Mongoose Connection
module.exports = { initDatabase, mongoose };
