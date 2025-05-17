import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials:{ url: process.env.DATABASE_URL! },

  // NEW — keep Drizzle away from PostGIS & tiger/topology stuff
  schemaFilter:       ["public"],  // we only manage the public schema
  extensionsFilters:  ["postgis"], // skip objects owned by PostGIS
} satisfies Config;


