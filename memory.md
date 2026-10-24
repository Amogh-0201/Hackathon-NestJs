# Memory — Hackathon Participant Join

Last updated: 2026-10-24 14:40 +05:30

## What was built

- Added `POST /hackathon/:id/join` in the Hackathon controller, restricted to the `PARTICIPANT` role and using the authenticated session user ID.
- Added service checks that the hackathon exists, is active, and has not ended before creating a participant record.
- Duplicate joins return `BadRequestException`; the unique constraint is also handled for concurrent duplicate requests.
- The endpoint returns the created participant record and has a success response message.

## Decisions made

- The end-time check uses the Prisma `endDate` field corresponding to the schema; a hackathon with `endDate <= now` is considered ended.
- Database unique-constraint errors (`P2002`) are mapped to the duplicate-join bad request response.

## Problems solved

- None.

## Current state

- `npm run build` and `npm run lint` pass.
- Hackathon schema, CRUD, and participant join endpoint are implemented.

## Next session starts with

- Continue with any remaining Hackathon requirements.

## Open questions

- None.
