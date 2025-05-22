import { Router } from "express";
import {
    createProfile,
    getProfileByAddress,
    updateProfile,
    deleteProfile,
    getAllProfiles,
    getProfilesWithinArea, // Import the new controller function
} from "../controllers/profiles.controller.js"; // Added .js extension
import { getMessagesByRecipient, getMessagesBySender, sendMessage } from "../controllers/messages.controller.js";

const router = Router();

router.post("/", createProfile);
router.get("/", getAllProfiles);
router.get("/within-area", getProfilesWithinArea); // Add the new route
router.get("/:address", getProfileByAddress);
router.put("/:address", updateProfile);
router.delete("/:address", deleteProfile);
router.get("/messages/recipient/:address", getMessagesByRecipient);
router.get("/messages/sender/:address", getMessagesBySender);
router.post("/messages", sendMessage);

export default router;
