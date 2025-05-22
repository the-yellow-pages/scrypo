import { defineIndexer } from "apibara/indexer";
import { useLogger } from "apibara/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { drizzle } from "@apibara/plugin-drizzle";
import { StarknetStream, getSelector } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import * as schema from "../lib/schema";
import { profiles } from "../lib/schema";
import { feltToDeg } from "../../frontend/src/helpers/cords";

export default function (runtimeConfig: ApibaraRuntimeConfig) {
    const { startingBlock, streamUrl, contractAddress } =
        runtimeConfig["profiles"];
    const db = drizzle({
        schema,
    });

    const PROFILE_UPDATED = getSelector("ProfileUpdated"); // helper from v2 SDK :contentReference[oaicite:2]{index=2}
    const MESSAGE_SENT = getSelector("MessageSent");

    return defineIndexer(StarknetStream)({
        streamUrl,
        finality: "pending",
        startingBlock: BigInt(startingBlock),
        filter: {
            events: [
                {
                    address: contractAddress as `0x${string}`,
                    keys: [PROFILE_UPDATED],
                },
                {
                    address: contractAddress as `0x${string}`,
                    keys: [MESSAGE_SENT],
                },
            ],
        },
        plugins: [
            drizzleStorage({
                db,
                idColumn: { profiles: "address" }, // address is already unique
                migrate: { migrationsFolder: "./migrations" }, // auto migrations
                persistState: true,
            }),
        ],

        /** main loop */
        async transform({ block }) {
            const log = useLogger();
            const { db } = useDrizzleStorage(); // tx-bound Drizzle instance

            for (const ev of block.events) {
                if (ev.keys[0] === PROFILE_UPDATED) {
                    const [
                        addrFelt,
                        nameFelt,
                        tags0Low,
                        tags0High,
                        tags1Low,
                        tags1High,
                        tags2Low,
                        tags2High,
                        tags3Low,
                        tags3High,
                        latFelt,
                        lonFelt,
                        pubkeyHi,
                        pubkeyLo,
                    ] = ev.data;

                    log.info("Raw event data:", ev.data);
                    log.info("Raw lat/lon:", { latFelt, lonFelt });
                    log.info("Lat/lon as BigInt:", { 
                        latBigInt: BigInt(latFelt).toString(),
                        lonBigInt: BigInt(lonFelt).toString()
                    });

                    // Reconstruct u256 from low and high parts
                    const reconstructU256 = (low: string, high: string) => {
                        const lowBig = BigInt(low);
                        const highBig = BigInt(high);
                        return (highBig << 128n) | lowBig;
                    };

                    /* felt → helpers */
                    const rec = {
                        address: toHex(addrFelt),
                        name: feltToShortString(nameFelt),
                        tags0: reconstructU256(tags0Low, tags0High).toString(),
                        tags1: reconstructU256(tags1Low, tags1High).toString(),
                        tags2: reconstructU256(tags2Low, tags2High).toString(),
                        tags3: reconstructU256(tags3Low, tags3High).toString(),
                        location: {
                            x: feltToDeg(BigInt(latFelt)),
                            y: feltToDeg(BigInt(lonFelt)),
                        },
                        pubkey_hi: BigInt(pubkeyHi).toString(),
                        pubkey_lo: BigInt(pubkeyLo).toString(),
                    };
                    log.info("Converted coordinates:", {
                        x: rec.location.x,
                        y: rec.location.y
                    });

                    /* UPSERT (Drizzle .onConflictDoUpdate) */ // :contentReference[oaicite:3]{index=3}
                    await db
                        .insert(profiles)
                        .values(rec)
                        .onConflictDoUpdate({ target: profiles.address, set: rec });
                } else if (ev.keys[0] === MESSAGE_SENT) {
                    const [sender, recipient, ...msgArr] = ev.data;
                    // Convert Array<felt252> to hex string
                    const message = msgArr.map(felt => BigInt(felt).toString(16).padStart(62, "0")).join("");
                    await db.insert(messages).values({
                        id: `${block.header.blockNumber}-${ev.transactionHash}`,
                        sender: toHex(sender),
                        recipient: toHex(recipient),
                        message,
                        block_number: block.header.blockNumber,
                        tx_hash: ev.transactionHash,
                        timestamp: block.header.timestamp,
                    });
                }
            }

            log.info(
                `✓ block ${block.header?.blockNumber} (${block.events.length} ProfileUpdated)`,
            );
        },
    });
}

/* ---------- helpers ---------- */

/** BigInt/hex felt → 0x-prefixed hex string */
function toHex(felt: bigint | string): `0x${string}` {
    return `0x${BigInt(felt).toString(16)}` as `0x${string}`;
}

/** Decode short-string (< 31 bytes) felt */
function feltToShortString(felt: bigint | string): string {
    const hex = BigInt(felt).toString(16).padStart(62, "0");
    // Convert to string and remove any null bytes or invalid UTF-8 sequences
    return Buffer.from(hex, "hex")
        .toString("utf8")
        .replace(/\0/g, "") // Remove null bytes
        .replace(/[^\x20-\x7E]/g, ""); // Keep only printable ASCII
}
