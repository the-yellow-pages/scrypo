import {
    type CreateProfileRequestBody,
    type UpdateProfileRequestBody,
    type ProfileResponse,
    type ErrorResponse,
    type SuccessResponse,
} from "./types";

let API_BASE = import.meta.env.VITE_PUBLIC_API_BASE || "http://localhost:3000";

API_BASE = API_BASE + "/profiles";

// disabled on backend
export async function createProfile(
    data: CreateProfileRequestBody,
): Promise<ProfileResponse | ErrorResponse> {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function getAllProfiles(): Promise<ProfileResponse[] | ErrorResponse> {
    const res = await fetch(API_BASE);
    return res.json();
}

export async function getProfilesWithinArea(
    x1: number, y1: number, x2: number, y2: number,
): Promise<ProfileResponse[] | ErrorResponse> {
    const params = new URLSearchParams({
        x1: x1.toString(),
        y1: y1.toString(),
        x2: x2.toString(),
        y2: y2.toString(),
    });
    const res = await fetch(`${API_BASE}/within-area?${params.toString()}`);
    return res.json();
}

export async function getProfileByAddress(
    address: string,
): Promise<ProfileResponse | ErrorResponse> {
    console.log("Fetching profile for address:", address);
    const res = await fetch(`${API_BASE}/${encodeURIComponent(address.replace(/^0x0+/, '0x'))}`);
    return res.json();
}

// disabled on backend
export async function updateProfile(
    address: string,
    data: UpdateProfileRequestBody,
): Promise<ProfileResponse | ErrorResponse> {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(address)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

// disabled on backend
export async function deleteProfile(
    address: string,
): Promise<SuccessResponse | ErrorResponse> {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(address)}`, {
        method: "DELETE",
    });
    return res.json();
}
