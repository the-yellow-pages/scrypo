/**
 * Converts a 32-byte public key to two felt252 values (high and low)
 * 
 * Implementation details:
 * - Takes a 32-byte public key as Uint8Array
 * - Splits it into two 16-byte parts (high and low)
 * - Converts each part to a hex string using browser-compatible methods:
 *   1. Converts bytes to array using Array.from()
 *   2. Maps each byte to its hex representation with proper padding
 *   3. Joins the hex values into a single string
 * - Converts the hex strings to BigInt and then to string representation
 * 
 * @param pub 32-byte public key as Uint8Array
 * @returns tuple of [high felt, low felt] as strings
 */
export function pubToFelts(pub: Uint8Array): [string, string] {
    // Convert Uint8Array to hex string without using Buffer
    const toHex = (bytes: Uint8Array) => Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const hi = BigInt("0x" + toHex(pub.slice(0, 16)))
    const lo = BigInt("0x" + toHex(pub.slice(16)))
    return [hi.toString(), lo.toString()]
} 