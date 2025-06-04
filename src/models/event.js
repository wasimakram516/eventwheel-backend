const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String, unique: true, required: true },
    type: { type: String, enum: ["collect_info", "enter_names"], required: true },
    logoUrl: { type: String }, // Cloudinary Image URL
    backgroundUrl: { type: String }, // Cloudinary Image URL
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = { Event };
