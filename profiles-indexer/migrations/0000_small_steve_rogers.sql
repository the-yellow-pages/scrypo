-- 1️⃣ Enable PostGIS (idempotent)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Main table
CREATE TABLE IF NOT EXISTS profiles (
    address text PRIMARY KEY,
    name    text,
    tags0   numeric,
    tags1   numeric,
    tags2   numeric,
    tags3   numeric,
    "location" geometry(point) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spatial_index" ON "profiles" USING gist ("location");