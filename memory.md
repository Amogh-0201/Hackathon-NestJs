# Memory — Global Response Interceptor

Last updated: 2026-10-24 13:35 +05:30

## What was built

- Added `ResponseMessage` metadata decorator and a global response interceptor in `src/common/decorators/response-message.decorator.ts` and `src/common/interceptors/response.interceptor.ts`.
- Responses handled by Nest controllers are wrapped as `{ statusCode, message, data }`; message defaults to `success`.
- Registered the interceptor in `AppModule` and installed its DI-managed instance globally in `src/main.ts`.
- Added focused tests for the default and custom message behavior.

## Decisions made

- Handler-level message metadata takes precedence over controller-level metadata.
- The interceptor is registered as an `AppModule` provider and retrieved through Nest DI when wiring it globally.

## Problems solved

- No existing shared response interceptor or message decorator was present.

## Current state

- Build and lint pass.
- Both focused interceptor tests pass.
- Changes are uncommitted.

## Next session starts with

- Continue from the interceptor feature; no follow-up is required unless response-envelope behavior needs additional endpoint-specific coverage.

## Open questions

- None.
