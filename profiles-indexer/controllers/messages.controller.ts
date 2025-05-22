import type { Request, Response } from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../lib/schema.js";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
const db = drizzle(client, { schema });

export const getMessagesByRecipient = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const result = await db.select().from(schema.messages).where(eq(schema.messages.recipient, address));
    res.json(result);
  } catch (error) {
    console.error("Error fetching messages by recipient:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getMessagesBySender = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const result = await db.select().from(schema.messages).where(eq(schema.messages.sender, address));
    res.json(result);
  } catch (error) {
    console.error("Error fetching messages by sender:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  // implement if you want to allow off-chain sending
  res.status(501).json({ error: "Not implemented" });
}; 