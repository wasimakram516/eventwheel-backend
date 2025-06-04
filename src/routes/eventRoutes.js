const express = require("express");
const authenticate = require("../middlewares/authenticate");
const eventController = require("../controllers/eventController");
const upload = require("../middlewares/upload");

const router = express.Router();

// ✅ Create Event
router.post("/", authenticate, upload.fields([{ name: "logo" }, { name: "background" }]), eventController.createEvent);

// ✅ Get All Events
router.get("/", authenticate, eventController.getEvents);

// ✅ Get Event by ID
router.get("/:id", authenticate, eventController.getEventById);

// ✅ Get Event by Short Name
router.get("/short/:shortName", eventController.getEventByShortName);

// ✅ Update Event
router.put("/:id", authenticate, upload.fields([{ name: "logo" }, { name: "background" }]), eventController.updateEvent);

// ✅ Delete Event
router.delete("/:id", authenticate, eventController.deleteEvent);

module.exports = router;
