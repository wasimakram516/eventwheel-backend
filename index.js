require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Load environment variables
const env = require("./src/config/env");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // ✅ Parse JSON body
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Fix CORS setup
app.use(
  cors({
    origin: env.client.client_url, // ✅ Ensure this matches frontend URL
    credentials: true, // ✅ Allow cookies (for authentication)
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);

// ✅ Handle Preflight Requests (Important for CORS)
app.options("*", cors());

// ✅ Connect to MongoDB before handling requests
mongoose
  .connect(env.database.url)
  .then(() => {
    console.log("✅ MongoDB connected successfully.");

    // ✅ Register routes AFTER MongoDB is connected
    app.use("/api/auth", require("./src/routes/authRoutes"));
    app.use("/api/events", require("./src/routes/eventRoutes"));
    app.use("/api/participants", require("./src/routes/participantRoutes"));

    // ✅ Start server AFTER MongoDB is ready
    const PORT = env.server.port || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });
