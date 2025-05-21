import {
    pgTable,
    text,
    numeric,
    doublePrecision,
    geometry,
    index,
} from "drizzle-orm/pg-core";

export const profiles = pgTable(
    "profiles",
    {
        /** wallet address = primary key */
        address: text("address").primaryKey(),

        /** extra profile fields */
        name: text("name"),
        tags0: numeric("tags0", { precision: 78, scale: 0 }),
        tags1: numeric("tags1", { precision: 78, scale: 0 }),
        tags2: numeric("tags2", { precision: 78, scale: 0 }),
        tags3: numeric("tags3", { precision: 78, scale: 0 }),

        location: geometry("location", {
            type: "point",
            mode: "xy",
            srid: 4326,
        }).notNull(),

        /** Public key fields */
        pubkey_hi: numeric("pubkey_hi", { precision: 78, scale: 0 }),
        pubkey_lo: numeric("pubkey_lo", { precision: 78, scale: 0 }),

        /** PostGIS-friendly coords (°) */
        // lat: doublePrecision("lat"),
        // lon: doublePrecision("lon"),
    },
    (t) => [index("spatial_index").using("gist", t.location)],
);
