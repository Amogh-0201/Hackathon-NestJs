# Memory — Better Auth Postman Origin Handling

Last updated: 2026-10-24 13:26 +05:30

## What was built

- Configured Better Auth in `src/lib/auth/auth.ts` with `advanced.disableCSRFCheck: true`, so auth requests work without an `Origin` header even when cookies are present.
- Added e2e coverage for email sign-up and sign-in with a cookie header and no `Origin` header in `test/app.e2e-spec.ts`.
- Documented the API-client behavior and CSRF tradeoff in `README.md`.
- Existing user routes remain implemented: `GET /user/all` uses Prisma and requires `ADMIN`; `GET /user/:id` throws `NotFoundException` when missing.

## Decisions made

- Disable the CSRF check, not `disableOriginCheck`, so Better Auth continues validating supplied callback/redirect URLs.
- Keep authentication and role checks enabled. The Better Auth global guard and the `ADMIN` role requirement for `/user/all` remain active.
- Disabling CSRF affects cookie-authenticated browser requests, so the README warns against using this configuration for browser cookie sessions from untrusted origins.

## Problems solved

- Better Auth requires an `Origin` or `Referer` for CSRF validation when auth requests carry cookies. Postman requests can carry cookies without an `Origin`, causing them to fail.

## Current state

- Build and lint pass.
- All 5 e2e tests pass, including unauthenticated route protection, role input restriction during sign-up, and sign-up/sign-in without `Origin` while cookies are present.
- Changes remain uncommitted.

## Next session starts with

If enabling browser-based cookie authentication, revisit the CSRF configuration and use a trusted-origin strategy suitable for the deployment instead of leaving CSRF disabled.

## Open questions

- None for the requested Postman behavior.
