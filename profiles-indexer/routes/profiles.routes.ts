import { Router } from "express";
import {
    createProfile,
    getProfileByAddress,
    updateProfile,
    deleteProfile,
    getAllProfiles,
    getProfilesWithinArea, // Import the new controller function
} from "../controllers/profiles.controller.js"; // Added .js extension

const router = Router();

router.post("/", createProfile);
router.get("/", getAllProfiles);
router.get("/within-area", getProfilesWithinArea);
router.get("/:address", getProfileByAddress);
router.put("/:address", updateProfile);
router.delete("/:address", deleteProfile);

export default router;
