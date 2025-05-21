import express from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '../lib/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL); // Added to log DATABASE_URL
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect();
const db = drizzle(client, { schema });

export const createProfile = async (req: express.Request, res: express.Response) => {
    try {
        const newProfile = req.body;
        const result = await db.insert(schema.profiles).values(newProfile).returning();
        res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
};

export const getAllProfiles = async (req: express.Request, res: express.Response) => {
    try {
        const allProfiles = await db.select().from(schema.profiles);
        res.status(200).json(allProfiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve profiles' });
    }
};

export const getProfileByAddress = async (req: express.Request, res: express.Response) => {
    try {
        const { address } = req.params;
        const profile = await db.query.profiles.findFirst({
            where: eq(schema.profiles.address, address),
        });
        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};

export const updateProfile = async (req: express.Request, res: express.Response) => {
    try {
        const { address } = req.params;
        const updatedFields = req.body;
        const result = await db
            .update(schema.profiles)
            .set(updatedFields)
            .where(eq(schema.profiles.address, address))
            .returning();
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const deleteProfile = async (req: express.Request, res: express.Response) => {
    try {
        const { address } = req.params;
        const result = await db
            .delete(schema.profiles)
            .where(eq(schema.profiles.address, address))
            .returning();
        if (result.length > 0) {
            res.status(200).json({ message: 'Profile deleted successfully' });
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete profile' });
    }
};
