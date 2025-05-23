import type { Request, Response } from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../lib/schema.js";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import { 
  MessageResponse, 
  ErrorResponse, 
  SendMessageRequestBody,
  SuccessResponse 
} from "./types.js";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
const db = drizzle(client, { schema });

const validateMessageData = (data: SendMessageRequestBody): string[] => {
  const errors: string[] = [];

  // Sender validation
  if (!data.sender || typeof data.sender !== "string" || data.sender.trim() === "") {
    errors.push("Sender address is required and must be a non-empty string.");
  }

  // Recipient validation
  if (!data.recipient || typeof data.recipient !== "string" || data.recipient.trim() === "") {
    errors.push("Recipient address is required and must be a non-empty string.");
  }

  // Message validation
  if (!data.message || typeof data.message !== "string" || data.message.trim() === "") {
    errors.push("Message content is required and must be a non-empty string.");
  }

  return errors;
};

export const getMessagesByRecipient = async (
  req: Request<{ address: string }, MessageResponse[] | ErrorResponse>,
  res: Response<MessageResponse[] | ErrorResponse>
) => {
  try {
    const { address } = req.params;
    if (!address || typeof address !== "string" || address.trim() === "") {
      res.status(400).json({ error: "Invalid address parameter" });
      return;
    }

    const result = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.recipient, address));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching messages by recipient:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getMessagesBySender = async (
  req: Request<{ address: string }, MessageResponse[] | ErrorResponse>,
  res: Response<MessageResponse[] | ErrorResponse>
) => {
  try {
    const { address } = req.params;
    if (!address || typeof address !== "string" || address.trim() === "") {
      res.status(400).json({ error: "Invalid address parameter" });
      return;
    }

    const result = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.sender, address));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching messages by sender:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage = async (
  req: Request<{}, MessageResponse | ErrorResponse, SendMessageRequestBody>,
  res: Response<MessageResponse | ErrorResponse>
) => {
  // For now, we'll keep this blocked as it's handled by the blockchain
  res.status(501).json({ error: "Not implemented - messages are handled by the blockchain" });
}; 