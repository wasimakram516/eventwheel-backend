const express = require("express");
const authenticate = require("../middlewares/authenticate");
const participantController = require("../controllers/participantController");

const router = express.Router();

// ✅ Public Route for Event Details
router.get("/public/event/:id", participantController.getPublicEvent);

// ✅ Admin Adds Participants (Only for "collect_info" Events)
router.post("/", authenticate, participantController.addParticipant);

// ✅ User Adds Participants names in bulk
router.post("/bulk", participantController.addOrUpdateParticipantsInBulk);

// ✅ Get Participants names in bulk
router.get("/bulk/:shortName", participantController.getBulkParticipantsForEvent);

// ✅ Get Participants for an Event
router.get("/:eventId", authenticate, participantController.getParticipants);

// ✅ Get Participants for an Event by Short Name
router.get("/short/:shortName", participantController.getParticipantsByShortName);

// ✅ Get Single Participant
router.get("/single/:id", authenticate, participantController.getParticipantById);

// ✅ Update Participant
router.put("/:id", authenticate, participantController.updateParticipant);

// ✅ Delete Participant
router.delete("/:id", authenticate, participantController.deleteParticipant);

module.exports = router;
