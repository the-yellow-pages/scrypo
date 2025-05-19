/**
 * Converts a 32-byte public key to two felt252 values (high and low)
 * @param pub 32-byte public key
 * @returns tuple of [high felt, low felt] as strings
 */
export function pubToFelts(pub: Uint8Array): [string, string] {
    const hi = BigInt("0x" + Buffer.from(pub.slice(0, 16)).toString("hex"))
    const lo = BigInt("0x" + Buffer.from(pub.slice(16)).toString("hex"))
    return [hi.toString(), lo.toString()]
} 