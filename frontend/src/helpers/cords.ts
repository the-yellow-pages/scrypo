// scale = 1 degree  ↔  1 000 000 integer units
const SCALE = 1_000_000n as const;

/**
 * The Starknet field prime: 2²⁵¹ + 17 × 2¹⁹² + 1
 * Using it lets us tuck negative numbers into the same 0…prime-1 range
 * that every felt252 already lives in.
 */
const FIELD_PRIME = BigInt(
  "0x800000000000011000000000000000000000000000000000000000000000001"
);

/**
 * Convert a latitude/longitude expressed in decimal degrees
 * (e.g. 37.7749 or -122.4194) to a *signed* fixed-point integer
 * with 6 decimal places, ready to be sent as `felt252`.
 */
export function degToFelt(deg: number): bigint {
  // ➊ scale, ➋ round to the nearest integer, ➌ wrap negatives into the field
  const scaled = BigInt(Math.round(deg * 1e6));
  return scaled >= 0n ? scaled : FIELD_PRIME + scaled;
}

/**
 * Convert the fixed-point *felt* you read back from the contract
 * into a JavaScript `number` in plain decimal degrees.
 */
export function feltToDeg(felt: bigint): number {
  // Bring the encoded felt back into the signed integer range first
  const signed =
    felt <= FIELD_PRIME / 2n ? felt : felt - FIELD_PRIME; // two’s-complement style
  return Number(signed) / 1e6;
}
