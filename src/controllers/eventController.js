const { Event } = require("../models/event");
const response = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const validateCreateEventDTO = require("../dto/event/createEvent.dto");
const { deleteImage } = require("../utils/cloudinary");

// Function to generate unique short name
async function generateUniqueShortName(shortName) {
  let base = shortName.toLowerCase().trim().replace(/\s+/g, "-");

  // Check if the shortName already exists
  const existingEvent = await Event.findOne({ shortName: base });

  if (existingEvent) {
    throw new Error(`Short name "${base}" is already taken. Please choose a different one.`);
  }

  return base;
}

const createEvent = asyncHandler(async (req, res) => {
  // Validate Input
  const { name, shortName, type } = validateCreateEventDTO(req.body);

  try {
    // Generate a unique shortName
    const uniqueShortName = await generateUniqueShortName(shortName);

    // Extract file URLs (if uploaded)
    const logoUrl = req.files?.logo?.[0]?.path ?? null;
    const backgroundUrl = req.files?.background?.[0]?.path ?? null;

    // Create new event
    const newEvent = await Event.create({
      name,
      shortName: uniqueShortName,
      type,
      logoUrl,
      backgroundUrl,
      createdBy: req.user.id,
    });

    return response(res, 201, "Event created successfully", newEvent);
  } catch (error) {
    return response(res, 400, error.message); // ✅ Correctly send error response
  }
});

// ✅ Get All Events (For the logged-in user)
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ createdBy: req.user.id }).select("name shortName type logoUrl backgroundUrl");
  return response(res, 200, "Events retrieved successfully", events);
});

// ✅ Get Event by ID
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return response(res, 404, "Event not found");

  return response(res, 200, "Event retrieved successfully", event);
});

// ✅ Get Event by Short Name
const getEventByShortName = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ shortName: req.params.shortName });
  if (!event) return response(res, 404, "Event not found");

  return response(res, 200, "Event retrieved successfully", event);
});

// ✅ Update Event (Ensure unique shortName)
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, shortName, type } = validateCreateEventDTO(req.body);

  const event = await Event.findById(id);
  if (!event) return response(res, 404, "Event not found");

  try {
    // ✅ Ensure the shortName is unique only if it has been changed
    if (shortName !== event.shortName) {
      const uniqueShortName = await generateUniqueShortName(shortName);
      event.shortName = uniqueShortName;
    }

    // ✅ Handle image updates
    let updatedLogoUrl = event.logoUrl;
    let updatedBackgroundUrl = event.backgroundUrl;

    if (req.files["logo"]) {
      if (event.logoUrl) await deleteImage(event.logoUrl);
      updatedLogoUrl = req.files["logo"][0].path;
    }

    if (req.files["background"]) {
      if (event.backgroundUrl) await deleteImage(event.backgroundUrl);
      updatedBackgroundUrl = req.files["background"][0].path;
    }

    event.name = name;
    event.type = type;
    event.logoUrl = updatedLogoUrl;
    event.backgroundUrl = updatedBackgroundUrl;

    await event.save();

    return response(res, 200, "Event updated successfully", event);
  } catch (error) {
    return response(res, 400, error.message); // ✅ Correctly handle error
  }
});

// ✅ Delete Event
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return response(res, 404, "Event not found");

  if (event.logoUrl) await deleteImage(event.logoUrl);
  if (event.backgroundUrl) await deleteImage(event.backgroundUrl);

  await event.deleteOne();
  return response(res, 200, "Event deleted successfully");
});

module.exports = { createEvent, getEvents, getEventById, getEventByShortName, updateEvent, deleteEvent };
