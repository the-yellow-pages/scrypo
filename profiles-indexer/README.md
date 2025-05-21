# Profiles Indexer

### run:

```
docker-compose up -d
pnpm drizzle-kit push
pnpm run dev
```

---

other notes:

geospatial database (PostgreSQL + PostGIS) with the following extensions.

check:

`SELECT * FROM pg_extension;`

`docker exec -it profiles-db psql -U ${POSTGRES_USER} -d profiles -c "CREATE EXTENSION IF NOT EXISTS postgis;"`

`docker exec -it profiles-db psql -U ${POSTGRES_USER} -d profiles -c "SELECT * FROM pg_extension;"`

init db:
https://orm.drizzle.team/docs/guides/postgis-geometry-point

```
npx drizzle-kit generate --custom
```

put our migration

apply everything in ./migrations

```
pnpm drizzle-kit push
```

↑ same as: `drizzle-kit push:pg --config drizzle.config.ts`


DB cheetsheet:

`psql -U apibara -d profiles`