import { Router } from 'express';
import {
    createProfile,
    getProfileByAddress,
    updateProfile,
    deleteProfile,
    getAllProfiles,
    getProfilesWithinArea, // Import the new controller function
} from '../controllers/profiles.controller.ts';

const router = Router();

router.post('/', createProfile);
router.get('/', getAllProfiles);
router.get('/within-area', getProfilesWithinArea); // Add the new route
router.get('/:address', getProfileByAddress);
router.put('/:address', updateProfile);
router.delete('/:address', deleteProfile);

export default router;
