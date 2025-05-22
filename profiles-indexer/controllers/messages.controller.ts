import type { Request, Response } from "express";
// import { db } from "../lib/db"; // Uncomment and adjust path if needed
import { messages } from "../lib/schema";
import { eq } from "drizzle-orm/expressions";

export const getMessagesByRecipient = async (req: Request, res: Response) => {
  const { address } = req.params;
  // @ts-ignore: db import required
  const result = await db.select().from(messages).where(eq(messages.recipient, address));
  res.json(result);
};

export const getMessagesBySender = async (req: Request, res: Response) => {
  const { address } = req.params;
  // @ts-ignore: db import required
  const result = await db.select().from(messages).where(eq(messages.sender, address));
  res.json(result);
};

export const sendMessage = async (req: Request, res: Response) => {
  // implement if you want to allow off-chain sending
  res.status(501).json({ error: "Not implemented" });
}; 