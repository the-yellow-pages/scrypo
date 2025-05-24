import sodium        from 'libsodium-wrappers';
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

/**
 * Converts two felt252 values (high and low) back to a 32-byte public key
 * 
 * @param pubkeyHi high felt as string
 * @param pubkeyLo low felt as string
 * @returns 32-byte public key as Uint8Array
 */
export function feltsToPub(pubkeyHi: string, pubkeyLo: string): Uint8Array {
    const recipientPubKey = new Uint8Array(32);
    const hiBytes = BigInt(pubkeyHi).toString(16).padStart(32, '0');
    const loBytes = BigInt(pubkeyLo).toString(16).padStart(32, '0');
    
    for (let i = 0; i < 16; i++) {
        recipientPubKey[i] = parseInt(hiBytes.slice(i * 2, (i + 1) * 2), 16);
        recipientPubKey[i + 16] = parseInt(loBytes.slice(i * 2, (i + 1) * 2), 16);
    }
    
    return recipientPubKey;
}

/*  install                                       *
 *  npm i libsodium-wrappers @noble/hashes        */
// import { keccak_256 } from '@noble/hashes/sha3';

/* ------------------------------------------------------------------ *
 * 1.  Deterministic key-pair – same code you already have            *
 * ------------------------------------------------------------------ */
// await sodium.ready;                          // wait until WASM is loaded
// const seed       = keccak_256(sigHex);       // sigHex = r||s from wallet
// const { publicKey, privateKey } =
//     sodium.crypto_box_seed_keypair(seed);  // 32-byte X25519 keys

/* ------------------------------------------------------------------ *
 * 2.  Helpers                                                         *
 * ------------------------------------------------------------------ */

// Encrypt with *recipient* pub-key → sealed box (sender stays anonymous)
export async function encrypt(
    plaintext: string | Uint8Array,
    recipientPub: Uint8Array
): Promise<Uint8Array> {
    await sodium.ready;
    const msg = typeof plaintext === 'string'
        ? sodium.from_string(plaintext)
        : plaintext;
    // adds crypto_box_SEALBYTES (48) bytes of overhead
    return sodium.crypto_box_seal(msg, recipientPub);
}

// Decrypt with *your* pub/priv-key pair
export async function decrypt(
    ciphertext: Uint8Array,
    myPub: Uint8Array,
    myPriv: Uint8Array
): Promise<string> {
    await sodium.ready;
    const plain = sodium.crypto_box_seal_open(ciphertext, myPub, myPriv);
    if (!plain) throw new Error('Decryption failed – wrong key or tampered data');
    return sodium.to_string(plain);
}

/* ------------------------------------------------------------------ *
 * 3.  Quick demo                                                      *
 * ------------------------------------------------------------------ */

// Alice → Bob
// const note      = 'hi Bob – call me at +33 6 12 34 56 78 🤫';
// const sealedBox = await encrypt(note, bobPublicKey);
// ...ship `sealedBox` via IPFS, on-chain calldata, e-mail, pigeon…

// Bob opens it
// const clearText = await decrypt(sealedBox, bobPublicKey, bobPrivateKey);
// console.log(clearText);   // → "hi Bob – call me at +33 6 12 34 56 78 🤫"

// ---------- packing & unpacking ----------
/** Split a Uint8Array into 31-byte chunks and pack each chunk into one felt. */
// export function uint8ArrayToFelts(bytes: Uint8Array): bigint[] {
//     const FELT_BASE = 256n;           // 2^8
//     const CHUNK_SIZE = 31;            // bytes per felt (248 bits)
//
//     const felts: bigint[] = [BigInt(bytes.length)]; // Store length in first element
//     for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
//         const chunk = bytes.subarray(i, i + CHUNK_SIZE);
//         let felt = 0n;
//         for (const b of chunk) felt = (felt << 8n) + BigInt(b);
//         felts.push(felt);               // 0 ≤ felt < 2²⁵¹ guaranteed
//     }
//     return felts;
// }
//
// /**
//  * Rebuild the original Uint8Array from felts.
//  * Pass the original byteLength so that padding zeros added to the last chunk
//  * are trimmed away.
//  */
// export function feltsToUint8Array(felts: readonly bigint[]): Uint8Array {
//     if (felts.length === 0) return new Uint8Array(0);
//
//     const byteLength = Number(felts[1]); // Get length from first element
//     const dataFelts = felts.slice(2); // Skip the length element
//
//     const bytes: number[] = [];
//     for (const f of dataFelts) {
//         let felt = BigInt(f);
//         const chunk: number[] = [];
//         // Pull out bytes from the least-significant end.
//         while (felt > 0n) {
//             chunk.unshift(Number(felt & 0xffn));
//             felt >>= 8n;
//         }
//         // Left-pad the chunk to 31 bytes so ordering is preserved.
//         while (chunk.length < 31) chunk.unshift(0);
//         bytes.push(...chunk);
//     }
//     return new Uint8Array(bytes.slice(bytes.length - byteLength));
// }
//

const CHUNK_SIZE = 31;          // 31 × 8 = 248 bits ≤ 251 bits

/* ---------- pack ---------- */
export function uint8ArrayToFelts(bytes: Uint8Array): bigint[] {
    const felts: bigint[] = [BigInt(bytes.length)];   // meta: original length

    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        const chunk = bytes.subarray(i, i + CHUNK_SIZE);
        let felt = 0n;
        for (const b of chunk) felt = (felt << 8n) + BigInt(b);
        felts.push(felt);                               // big-endian
    }
    return felts;
}

/* ---------- unpack ---------- */
export function feltsToUint8Array(felts: readonly bigint[]): Uint8Array {
    if (felts.length === 0) return new Uint8Array(0);

    const byteLength = Number(felts[1]);   // meta sits at index-0
    const dataFelts  = felts.slice(2);     // payload starts here

    const bytes: number[] = [];

    for (const f of dataFelts) {
        let felt = BigInt(f);
        const chunk: number[] = [];

        // extract bytes, least-significant first
        while (felt > 0n) {
            chunk.unshift(Number(felt & 0xffn));
            felt >>= 8n;
        }

        // **right-pad** to 31 so the zeros land *after* real bytes
        while (chunk.length < CHUNK_SIZE) chunk.push(0);

        bytes.push(...chunk);
    }

    // keep the leading `byteLength` bytes
    return new Uint8Array(bytes.slice(0, byteLength));
}
