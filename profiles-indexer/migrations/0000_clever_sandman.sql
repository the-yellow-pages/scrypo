CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"sender" text NOT NULL,
	"recipient" text NOT NULL,
	"message" "bytea" NOT NULL,
	"block_number" numeric(78, 0),
	"tx_hash" text,
	"timestamp" numeric(78, 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"address" text PRIMARY KEY NOT NULL,
	"name" text,
	"tags0" numeric(78, 0),
	"tags1" numeric(78, 0),
	"tags2" numeric(78, 0),
	"tags3" numeric(78, 0),
	"location" geometry(point) NOT NULL,
	"pubkey_hi" numeric(78, 0),
	"pubkey_lo" numeric(78, 0)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spatial_index" ON "profiles" USING gist ("location");