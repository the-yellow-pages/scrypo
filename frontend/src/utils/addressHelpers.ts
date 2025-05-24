/**
 * Normalize an address by ensuring it has the proper format
 * Handles cases where addresses might have different numbers of leading zeros
 */
export const normalizeAddress = (address: string): string => {
    if (!address) return '';

    // Remove 0x prefix if present
    const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;

    // Pad with zeros to ensure consistent length (64 characters for Starknet)
    const paddedAddress = cleanAddress.padStart(64, '0');

    // Add back 0x prefix
    return `0x${paddedAddress}`;
};

/**
 * Compare two addresses for equality, handling different formats
 */
export const addressesEqual = (address1: string | undefined, address2: string | undefined): boolean => {
    if (!address1 || !address2) return false;

    return normalizeAddress(address1).toLowerCase() === normalizeAddress(address2).toLowerCase();
};
