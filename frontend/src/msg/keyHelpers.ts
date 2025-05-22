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
