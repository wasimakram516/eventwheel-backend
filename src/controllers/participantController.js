const { Participant } = require("../models/participant");
const { Event } = require("../models/event");
const response = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const validateAddParticipantDTO = require("../dto/participant/addParticipant.dto");

// ✅ Add Participant (Only Admin for "collect_info" Events)
const addParticipant = asyncHandler(async (req, res) => {
  const { name, phone, company, eventId } = validateAddParticipantDTO(req.body);

  const event = await Event.findById(eventId);
  if (!event) return response(res, 404, "Event not found");

  if (event.type === "collect_info" && !req.user) {
    return response(res, 403, "Only admins can add participants for this event.");
  }

  const newParticipant = await Participant.create({ name, phone, company, event: eventId });

  return response(res, 201, "Participant added successfully", newParticipant);
});

// ✅ Add or Update Participants in Bulk
const addOrUpdateParticipantsInBulk = asyncHandler(async (req, res) => {
  const { shortName, participants } = req.body;

  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return response(res, 400, "Participants array is required.");
  }

  const event = await Event.findOne({ shortName });
  if (!event) return response(res, 404, "Event not found");

  // ✅ Remove existing participants for this event
  await Participant.deleteMany({ event: event._id });

  // ✅ Add new participants
  const newParticipants = participants.map((name) => ({
    name,
    event: event._id,
  }));

  await Participant.insertMany(newParticipants);

  return response(res, 201, "Participants updated successfully");
});

// ✅ Get Existing Participants for an Event by Short Name
const getBulkParticipantsForEvent = asyncHandler(async (req, res) => {
  const { shortName } = req.params;

  const event = await Event.findOne({ shortName }).select("_id");
  if (!event) return response(res, 404, "Event not found");

  const participants = await Participant.find({ event: event._id })
    .sort({ name: 1 })
    .select("name"); // Only return names

  return response(res, 200, "Participants retrieved successfully", participants);
});

// ✅ Get Participants for an Event
const getParticipants = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  const participants = await Participant.find({ event: eventId }).sort({ name: 1 });

  return response(res, 200, "Participants retrieved successfully", participants);
});

// ✅ Get Participants for an Event by Short Name
const getParticipantsByShortName = asyncHandler(async (req, res) => {
  const { shortName } = req.params;
  try {
    // 🔍 Find the event by shortName
    const event = await Event.findOne({ shortName }).select("_id");
    if (!event) return response(res, 404, "Event not found");

    // 🎯 Fetch participants using the event's ObjectId
    const participants = await Participant.find({ event: event._id })
      .sort({ name: 1 })
      .select("name phone company"); // Select only necessary fields

    return response(res, 200, "Participants retrieved successfully", participants);
  } catch (error) {
    console.error("Error fetching participants by short name:", error);
    return response(res, 500, "Internal server error");
  }
});

// ✅ Get Single Participant by ID
const getParticipantById = asyncHandler(async (req, res) => {
  const participant = await Participant.findById(req.params.id);
  if (!participant) return response(res, 404, "Participant not found");

  return response(res, 200, "Participant retrieved successfully", participant);
});

// ✅ Update Participant
const updateParticipant = asyncHandler(async (req, res) => {
  const { name, phone, company } = req.body;
  const participant = await Participant.findById(req.params.id);

  if (!participant) return response(res, 404, "Participant not found");

  participant.name = name || participant.name;
  participant.phone = phone || participant.phone;
  participant.company = company || participant.company;

  await participant.save();
  
  return response(res, 200, "Participant updated successfully", participant);
});

// ✅ Delete Participant
const deleteParticipant = asyncHandler(async (req, res) => {
  const participant = await Participant.findById(req.params.id);
  if (!participant) return response(res, 404, "Participant not found");

  await participant.deleteOne();
  return response(res, 200, "Participant deleted successfully");
});

// ✅ Public API to Get Event Details
const getPublicEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return response(res, 404, "Event not found");

  return response(res, 200, "Event details retrieved", event);
});

module.exports = { addParticipant, addOrUpdateParticipantsInBulk,getBulkParticipantsForEvent, getParticipants, getParticipantById, getParticipantsByShortName, updateParticipant, deleteParticipant, getPublicEvent };
