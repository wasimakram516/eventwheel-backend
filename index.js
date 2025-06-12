require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const seedAdmin = require("./src/seeder/adminSeeder");
const env = require("./src/config/env");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://eventwheel.whitewall.om", "https://eventwheel-whitewall.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);

app.options("*", cors());

// Health Check
app.get("/", (req, res) => {
  console.log("📡 Server is running...");
  res.status(200).send("OK");
}); 

mongoose
  .connect(env.database.url)
  .then(async () => {
    console.log("✅ MongoDB connected successfully.");
    await seedAdmin();
    app.use("/api/auth", require("./src/routes/authRoutes"));
    app.use("/api/events", require("./src/routes/eventRoutes"));
    app.use("/api/participants", require("./src/routes/participantRoutes"));

    app.use(errorHandler);
    const PORT = env.server.port || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });
