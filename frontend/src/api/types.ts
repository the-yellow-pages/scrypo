export interface ProfileLocation {
    x: number;
    y: number;
}

export interface CreateProfileRequestBody {
    address: string;
    name?: string | null;
    tags0?: number | string | null;
    tags1?: number | string | null;
    tags2?: number | string | null;
    tags3?: number | string | null;
    location: ProfileLocation;
    pubkey_hi?: number | string | null;
    pubkey_lo?: number | string | null;
}

export interface UpdateProfileRequestBody {
    name?: string | null;
    tags0?: number | string | null;
    tags1?: number | string | null;
    tags2?: number | string | null;
    tags3?: number | string | null;
    location?: ProfileLocation;
    pubkey_hi?: number | string | null;
    pubkey_lo?: number | string | null;
}

export interface ProfileResponse {
    address: string;
    name?: string | null;
    tags0?: string | null;
    tags1?: string | null;
    tags2?: string | null;
    tags3?: string | null;
    location: ProfileLocation;
    pubkey_hi?: string | null;
    pubkey_lo?: string | null;
}

export interface ErrorResponse {
    error: string;
    details?: string[];
}

export interface SuccessResponse {
    message: string;
}
