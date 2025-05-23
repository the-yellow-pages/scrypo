import { Router } from "express";
import {
    getMessagesByRecipient,
    getMessagesBySender,
    sendMessage
} from "../controllers/messages.controller.js";

const router = Router();

router.get("/recipient/:address", getMessagesByRecipient);
router.get("/sender/:address", getMessagesBySender);
router.post("/", sendMessage);

export default router; 