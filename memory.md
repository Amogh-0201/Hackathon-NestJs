# Memory — Arcjet, Prisma, and Database Console Check

Last updated: 2026-10-23 15:44 +05:30

## What was built

- Arcjet site `jsm-hackathon` is configured; its key is stored only in ignored `.env`.
- Arcjet is configured in `src/app.module.ts` with `ArcjetModule.forRoot`, LIVE Shield, and a global IP token bucket of 10 tokens/minute. `src/common/guards/arcjet.guard.ts` consumes one token per HTTP request, returns 429 for limit denials, 403 for other denials, and 503 on SDK errors.
- Prisma ORM 7.10.1, PostgreSQL adapter/client, `pg`, `tsx`, and `dotenv` are installed. Client generated under `src/generated/prisma`.
- Blank `prisma/schema.prisma`, `prisma.config.ts` (prefers `DIRECT_URL` for CLI), `npm run prisma:generate`, and global DI `PrismaModule`/`PrismaService` are in place.

## Decisions made

- Keep Prisma schema empty; user confirmed no initial migration is needed.
- Use pooled `DATABASE_URL` for runtime. Use direct `DIRECT_URL` only for future Prisma CLI migrations/introspection as needed.
- Nest 12 is the project target; Arcjet adapter Nest peer-range bypass is user-approved.

## Problems solved

- Arcjet rate limiting required `requested: 1` on each guard request; missing it caused errors that were treated as allows. The guard now sets request cost and fails closed on Arcjet SDK errors.
- Port 3000 conflict was a stale Nest process from a prior smoke test; its exact PID was stopped and the port freed.

## Current state

- Prisma schema/client generation, validation, Nest build, lint, and tests pass.
- Runtime PrismaService connected using the app `.env` URL and successfully ran read-only `SELECT 1`.
- Latest Prisma MCP project listing returned project `jsm-hackathon`, ID `proj_ogkua1auiwa8tr9htu8eekzl`; database listing returned `Primary Database`, ID `db_lk9v75i1298geqv45k474vmu`, region Singapore, status ready.
- Those project and database IDs match the IDs visible in the user's Prisma Console screenshot URL. The screenshot database is therefore the same project/database configured in this repo.
- Prisma MCP lists connection-string records for that database. MCP introspection returned “Prisma Postgres schema was not found” (likely because no Prisma migration schema exists yet); a Prisma MCP SQL query requested approval and was not run.
- A fresh in-app read-only Prisma query succeeded against the local DATABASE_URL; this confirms app credentials/runtime DB connectivity. The Console’s “Waiting for your first connection” indicator may be stale/onboarding UI; refresh the console or close/reopen the connection panel and check that database selection.
- `.env` is ignored and contains credentials; never echo or persist values. The database credential was pasted in chat earlier and should be rotated.
- `.mcp.json` contains a pre-existing user change; don't overwrite it inadvertently.

## Next session starts with

If the Prisma Console still says “Waiting for your first connection,” refresh the console page after the successful app query, confirm the selected database is `Primary Database` in `jsm-hackathon`, and run another read-only query through the app's injected PrismaService. Do not run migrations while schema is blank.

## Open questions

- Does refreshing/reopening the Prisma Console connection panel clear its onboarding status?
- Should `app.enableShutdownHooks()` be added in `src/main.ts` for graceful Prisma disconnection?
- What models should eventually be added?
