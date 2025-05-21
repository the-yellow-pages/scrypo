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

const validateProfileData = (data: any, isUpdate: boolean = false): string[] => {
    const errors: string[] = [];

    // Address validation
    if (!isUpdate) {
        if (!data.address || typeof data.address !== 'string' || data.address.trim() === '') {
            errors.push('Address is required and must be a non-empty string.');
        }
    } else {
        if (data.hasOwnProperty('address')) {
            errors.push('Address cannot be updated via request body.');
        }
    }

    // Name validation
    if (data.hasOwnProperty('name')) {
        if (data.name !== null && typeof data.name !== 'string') {
            errors.push('Name must be a string or null.');
        }
    }

    // Tags validation
    for (let i = 0; i < 4; i++) {
        const tagField = `tags${i}`;
        if (data.hasOwnProperty(tagField)) {
            if (data[tagField] !== null && isNaN(Number(data[tagField]))) {
                errors.push(`${tagField} must be a number, a string convertible to a number, or null.`);
            }
        }
    }

    // Location validation (expects { x: number, y: number } for mode: 'xy')
    if (!isUpdate) { // Create mode: location is required as per schema (notNull)
        if (!data.location || typeof data.location !== 'object' || data.location === null ||
            typeof data.location.x !== 'number' || typeof data.location.y !== 'number') {
            errors.push('Location is required and must be an object with numeric x and y properties (e.g., { x: longitude, y: latitude }).');
        }
    } else { // Update mode: location is optional, but if provided, must be valid
        if (data.hasOwnProperty('location')) {
            if (data.location === null || typeof data.location !== 'object' ||
                typeof data.location.x !== 'number' || typeof data.location.y !== 'number') {
                errors.push('If provided, location must be a valid object with numeric x and y properties (e.g., { x: longitude, y: latitude }) and cannot be null.');
            }
        }
    }

    // Pubkey validation
    const pubkeyFields = ['pubkey_hi', 'pubkey_lo'];
    for (const field of pubkeyFields) {
        if (data.hasOwnProperty(field)) {
            if (data[field] !== null && isNaN(Number(data[field]))) {
                errors.push(`${field} must be a number, a string convertible to a number, or null.`);
            }
        }
    }

    return errors;
};

export const createProfile = async (req: express.Request, res: express.Response) => {
    try {
        const newProfile = req.body;

        const validationErrors = validateProfileData(newProfile, false);
        if (validationErrors.length > 0) {
            res.status(400).json({ error: 'Validation failed', details: validationErrors });
            return;
        }

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

        const validationErrors = validateProfileData(updatedFields, true);
        if (validationErrors.length > 0) {
            res.status(400).json({ error: 'Validation failed', details: validationErrors });
            return;
        }

        // Ensure no attempt to update address via body, already handled by validateProfileData
        // but good to be defensive if validateProfileData changes.
        if (updatedFields.address) {
            delete updatedFields.address;
        }

        if (Object.keys(updatedFields).length === 0) {
            res.status(400).json({ error: 'No fields to update provided.' });
            return;
        }

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
