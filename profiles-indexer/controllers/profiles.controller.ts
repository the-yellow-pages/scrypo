import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../lib/schema.js";
import { eq, sql } from "drizzle-orm";
import dotenv from "dotenv";
import {
    CreateProfileRequestBody,
    UpdateProfileRequestBody,
    ProfileResponse,
    ErrorResponse,
    SuccessResponse,
} from "./types.js";
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect();
const db = drizzle(client, { schema });

const validateProfileData = (
    data: CreateProfileRequestBody | UpdateProfileRequestBody,
    isUpdate: boolean = false,
): string[] => {
    const errors: string[] = [];

    // Address validation
    if (!isUpdate) {
        // Type assertion to access 'address' property safely
        const createData = data as CreateProfileRequestBody;
        if (
            !createData.address ||
            typeof createData.address !== "string" ||
            createData.address.trim() === ""
        ) {
            errors.push("Address is required and must be a non-empty string.");
        }
    } else {
        if (data.hasOwnProperty("address")) {
            errors.push("Address cannot be updated via request body.");
        }
    }

    // Name validation
    if (data.hasOwnProperty("name")) {
        if (data.name !== null && typeof data.name !== "string") {
            errors.push("Name must be a string or null.");
        }
    }

    // Tags validation
    for (let i = 0; i < 4; i++) {
        const tagField = `tags${i}` as keyof (
            | CreateProfileRequestBody
            | UpdateProfileRequestBody
        );
        if (data.hasOwnProperty(tagField)) {
            const tagValue = data[tagField];
            if (tagValue !== null && isNaN(Number(tagValue))) {
                errors.push(
                    `${tagField} must be a number, a string convertible to a number, or null.`,
                );
            }
        }
    }

    // Location validation (expects { x: number, y: number } for mode: 'xy')
    if (!isUpdate) {
        // Create mode: location is required as per schema (notNull)
        // Type assertion to access 'location' property safely
        const createData = data as CreateProfileRequestBody;
        if (
            !createData.location ||
            typeof createData.location !== "object" ||
            createData.location === null ||
            typeof createData.location.x !== "number" ||
            typeof createData.location.y !== "number"
        ) {
            errors.push(
                "Location is required and must be an object with numeric x and y properties (e.g., { x: longitude, y: latitude }).",
            );
        }
    } else {
        // Update mode: location is optional, but if provided, must be valid
        // Type assertion to access 'location' property safely
        const updateData = data as UpdateProfileRequestBody;
        if (updateData.hasOwnProperty("location")) {
            if (
                updateData.location === null ||
                typeof updateData.location !== "object" ||
                typeof updateData.location.x !== "number" ||
                typeof updateData.location.y !== "number"
            ) {
                errors.push(
                    "If provided, location must be a valid object with numeric x and y properties (e.g., { x: longitude, y: latitude }) and cannot be null.",
                );
            }
        }
    }
    // Pubkey validation
    const pubkeyFields = ["pubkey_hi", "pubkey_lo"] as const;
    for (const field of pubkeyFields) {
        if (data.hasOwnProperty(field)) {
            const fieldValue =
                data[
                field as keyof (
                    | CreateProfileRequestBody
                    | UpdateProfileRequestBody
                )
                ];
            if (fieldValue !== null && isNaN(Number(fieldValue))) {
                errors.push(
                    `${field} must be a number, a string convertible to a number, or null.`,
                );
            }
        }
    }

    return errors;
};

export const createProfile = async (
    req: express.Request<
        {},
        ProfileResponse | ErrorResponse,
        CreateProfileRequestBody
    >,
    res: express.Response<ProfileResponse | ErrorResponse>,
) => {
    // Blocked for now, cuz blockchain is the source of truth
    return;
    try {
        const newProfile = req.body; // req.body is now correctly typed as CreateProfileRequestBody

        const validationErrors = validateProfileData(newProfile, false);
        if (validationErrors.length > 0) {
            res.status(400).json({
                error: "Validation failed",
                details: validationErrors,
            });
            return;
        }

        // Convert tag values and pubkey values to strings if they are numbers
        const profileToInsert = {
            ...newProfile,
            tags0:
                newProfile.tags0 !== undefined && newProfile.tags0 !== null
                    ? String(newProfile.tags0)
                    : null,
            tags1:
                newProfile.tags1 !== undefined && newProfile.tags1 !== null
                    ? String(newProfile.tags1)
                    : null,
            tags2:
                newProfile.tags2 !== undefined && newProfile.tags2 !== null
                    ? String(newProfile.tags2)
                    : null,
            tags3:
                newProfile.tags3 !== undefined && newProfile.tags3 !== null
                    ? String(newProfile.tags3)
                    : null,
            pubkey_hi:
                newProfile.pubkey_hi !== undefined &&
                    newProfile.pubkey_hi !== null
                    ? String(newProfile.pubkey_hi)
                    : null,
            pubkey_lo:
                newProfile.pubkey_lo !== undefined &&
                    newProfile.pubkey_lo !== null
                    ? String(newProfile.pubkey_lo)
                    : null,
        };

        const result = await db
            .insert(schema.profiles)
            .values(profileToInsert)
            .returning();
        res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create profile" });
    }
};

export const getAllProfiles = async (
    req: express.Request,
    res: express.Response<ProfileResponse[] | ErrorResponse>,
) => {
    try {
        const allProfiles = await db.select().from(schema.profiles);
        res.status(200).json(allProfiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve profiles" });
    }
};

export const getProfilesWithinArea = async (
    req: express.Request,
    res: express.Response<ProfileResponse[] | ErrorResponse>,
) => {
    try {
        const { x1, y1, x2, y2 } = req.query;

        if (
            x1 === undefined ||
            y1 === undefined ||
            x2 === undefined ||
            y2 === undefined
        ) {
            res.status(400).json({
                error: "Missing query parameters: x1, y1, x2, y2 are required.",
            });
            return;
        }

        const nX1 = parseFloat(x1 as string);
        const nY1 = parseFloat(y1 as string);
        const nX2 = parseFloat(x2 as string);
        const nY2 = parseFloat(y2 as string);

        if (isNaN(nX1) || isNaN(nY1) || isNaN(nX2) || isNaN(nY2)) {
            res.status(400).json({
                error: "Invalid query parameters: x1, y1, x2, y2 must be numbers.",
            });
            return;
        }

        const profilesInArea = await db
            .select()
            .from(schema.profiles)
            .where(
                sql`ST_Within(ST_SetSRID(${schema.profiles.location}, 4326), ST_MakeEnvelope(${nX1}, ${nY1}, ${nX2}, ${nY2}, 4326))`,
            );

        res.status(200).json(profilesInArea);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to retrieve profiles within area",
        });
    }
};

export const getProfileByAddress = async (
    req: express.Request,
    res: express.Response<ProfileResponse | ErrorResponse>,
) => {
    try {
        const { address } = req.params;
        const profile = await db.query.profiles.findFirst({
            where: eq(schema.profiles.address, address),
        });
        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ error: "Profile not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve profile" });
    }
};

export const updateProfile = async (
    req: express.Request<
        { address: string },
        ProfileResponse | ErrorResponse,
        UpdateProfileRequestBody
    >,
    res: express.Response<ProfileResponse | ErrorResponse>,
) => {
    // Blocked for now, cuz blockchain is the source of truth
    return;
    try {
        const { address } = req.params;
        const updatedFieldsBody = req.body; // req.body is now correctly typed as UpdateProfileRequestBody

        const validationErrors = validateProfileData(updatedFieldsBody, true);
        if (validationErrors.length > 0) {
            res.status(400).json({
                error: "Validation failed",
                details: validationErrors,
            });
            return;
        }

        if ((updatedFieldsBody as any).address) {
            delete (updatedFieldsBody as any).address;
        }

        if (Object.keys(updatedFieldsBody).length === 0) {
            res.status(400).json({ error: "No fields to update provided." });
            return;
        }

        const fieldsToUpdate: Partial<typeof schema.profiles.$inferInsert> = {};

        if (updatedFieldsBody.name !== undefined) {
            fieldsToUpdate.name = updatedFieldsBody.name;
        }
        if (updatedFieldsBody.location !== undefined) {
            fieldsToUpdate.location = updatedFieldsBody.location;
        }
        if (updatedFieldsBody.pubkey_hi !== undefined) {
            fieldsToUpdate.pubkey_hi =
                updatedFieldsBody.pubkey_hi !== null
                    ? String(updatedFieldsBody.pubkey_hi)
                    : null;
        }
        if (updatedFieldsBody.pubkey_lo !== undefined) {
            fieldsToUpdate.pubkey_lo =
                updatedFieldsBody.pubkey_lo !== null
                    ? String(updatedFieldsBody.pubkey_lo)
                    : null;
        }
        if (updatedFieldsBody.tags0 !== undefined) {
            fieldsToUpdate.tags0 =
                updatedFieldsBody.tags0 !== null
                    ? String(updatedFieldsBody.tags0)
                    : null;
        }
        if (updatedFieldsBody.tags1 !== undefined) {
            fieldsToUpdate.tags1 =
                updatedFieldsBody.tags1 !== null
                    ? String(updatedFieldsBody.tags1)
                    : null;
        }
        if (updatedFieldsBody.tags2 !== undefined) {
            fieldsToUpdate.tags2 =
                updatedFieldsBody.tags2 !== null
                    ? String(updatedFieldsBody.tags2)
                    : null;
        }
        if (updatedFieldsBody.tags3 !== undefined) {
            fieldsToUpdate.tags3 =
                updatedFieldsBody.tags3 !== null
                    ? String(updatedFieldsBody.tags3)
                    : null;
        }

        const result = await db
            .update(schema.profiles)
            .set(fieldsToUpdate)
            .where(eq(schema.profiles.address, address))
            .returning();
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ error: "Profile not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

export const deleteProfile = async (
    req: express.Request,
    res: express.Response<SuccessResponse | ErrorResponse>,
) => {
    // Blocked for now, cuz blockchain is the source of truth
    return;
    try {
        const { address } = req.params;
        const result = await db
            .delete(schema.profiles)
            .where(eq(schema.profiles.address, address))
            .returning();
        if (result.length > 0) {
            res.status(200).json({ message: "Profile deleted successfully" });
        } else {
            res.status(404).json({ error: "Profile not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete profile" });
    }
};
