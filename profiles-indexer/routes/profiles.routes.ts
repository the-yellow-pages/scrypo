import { Router } from 'express';
import {
    createProfile,
    getProfileByAddress,
    updateProfile,
    deleteProfile,
    getAllProfiles,
} from '../controllers/profiles.controller.ts';

const router = Router();

router.post('/', createProfile);
router.get('/', getAllProfiles);
router.get('/:address', getProfileByAddress);
router.put('/:address', updateProfile);
router.delete('/:address', deleteProfile);

export default router;
