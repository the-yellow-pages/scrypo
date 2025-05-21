import { defineIndexer } from "apibara/indexer";
import { useLogger } from "apibara/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { drizzle } from "@apibara/plugin-drizzle";
import { StarknetStream, getSelector } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import * as schema from "../lib/schema";
import { profiles } from "../lib/schema";

export default function (runtimeConfig: ApibaraRuntimeConfig) {
    const { startingBlock, streamUrl, contractAddress } =
        runtimeConfig["profiles"];
    const db = drizzle({
        schema,
    });

    const PROFILE_UPDATED = getSelector("ProfileUpdated"); // helper from v2 SDK :contentReference[oaicite:2]{index=2}

    return defineIndexer(StarknetStream)({
        streamUrl,
        finality: "accepted",
        startingBlock: BigInt(startingBlock),
        filter: {
            events: [
                {
                    address: contractAddress as `0x${string}`,
                    keys: [PROFILE_UPDATED],
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
                const [
                    addrFelt,
                    nameFelt,
                    tags0,
                    tags1,
                    tags2,
                    tags3,
                    latFelt,
                    lonFelt,
                ] = ev.data;

                /* felt → helpers */
                const rec = {
                    address: toHex(addrFelt),
                    name: feltToShortString(nameFelt),
                    tags0: BigInt(tags0).toString(),
                    tags1: BigInt(tags1).toString(),
                    tags2: BigInt(tags2).toString(),
                    tags3: BigInt(tags3).toString(),
                    location: {
                        x: Number(latFelt) / 1_000_000,
                        y: Number(lonFelt) / 1_000_000,
                    },
                };

                /* UPSERT (Drizzle .onConflictDoUpdate) */ // :contentReference[oaicite:3]{index=3}
                await db
                    .insert(profiles)
                    .values(rec)
                    .onConflictDoUpdate({ target: profiles.address, set: rec });
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
    return Buffer.from(hex, "hex").toString("utf8").replace(/\0+$/, "");
}
