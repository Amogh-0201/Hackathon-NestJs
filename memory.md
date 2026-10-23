# Memory — Arcjet NestJS Setup

Last updated: 2026-10-23 13:30 +05:30

## What was built

- Created Arcjet site `jsm-hackathon` in the Personal team (site ID `site_01m5kvccjdeg4tp2c5br1m04ps`).
- Retrieved the site's SDK key and stored it in the local `.env`. The file is gitignored. Never persist or reveal the key itself.
- Added `@nestjs/config` for dotenv loading and integrated Arcjet directly in `src/app.module.ts` with `ArcjetModule.forRoot({ isGlobal: true, key, rules })`.
- Configured Shield LIVE and a per-IP token bucket with capacity 100 and refill rate 100/minute.
- Registered the application-wide `ArcjetGuard` using `APP_GUARD`; it injects the Arcjet token from `@arcjet/nest`, checks HTTP requests, returns 429 for rate limit denials and 403 for other denials.
- Added `.npmrc` with `legacy-peer-deps=true` and documented the compatibility caveat in README.md.

## Decisions made

- User explicitly chose to target the globally installed Nest CLI version, 12.0.8, and keep Nest 12.
- User explicitly approved the official `@arcjet/nest` adapter despite the current package's declared Nest 10/11 peer range. Use legacy peer resolution for reproducible installs; this package/framework combination remains outside the declared support range.
- Keep the 100-per-minute global per-IP token bucket unless product traffic requirements call for a change.

## Problems solved

- Replaced the original custom `@arcjet/node` module/service configuration with the official Nest adapter and `ArcjetModule.forRoot` at the user's request.
- A clean `npm ci --dry-run` failed due to the Nest 12 vs Arcjet Nest 10/11 peer conflict. Added `.npmrc` per user's approval; a full clean `npm ci` then succeeded.
- Nest does not export `TooManyRequestsException`; guard uses `HttpException` and `HttpStatus.TOO_MANY_REQUESTS`.
- Global Nest CLI was confirmed as 12.0.8; project package manifests are Nest 12. Repository `AGENTS.md` still says Nest 11.

## Current state

- Arcjet key exists exactly once and non-empty in ignored `.env`; value intentionally excluded from memory and chat.
- `@arcjet/nest@1.14.1` is installed with Nest common 12.2.0 via the explicitly approved peer bypass.
- `npm ci`, `npm run build`, `npm run lint`, and `npm test -- --runInBand` pass.
- Local runtime smoke test passed with HTTP 200 through the global guard.
- npm install/audit reports five vulnerabilities (2 low, 1 moderate, 2 high); no automatic fixes were applied.

## Next session starts with

Continue feature work with the global Arcjet config in `src/app.module.ts`; preserve `.env` secrecy and `.npmrc` peer bypass. Revisit the Nest 12 peer-support caveat if Arcjet publishes a compatible adapter or project framework version changes.

## Open questions

- Should the global rate limit be tuned to expected traffic?
- Should repository `AGENTS.md` be updated from Nest 11 to Nest 12?
