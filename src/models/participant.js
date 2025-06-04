const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
}, { timestamps: true });

const Participant = mongoose.model("Participant", participantSchema);
module.exports = { Participant };
