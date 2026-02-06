# LAN Testing Implementation Plan

## Goal
Enable accessing the application from other devices (mobile/tablet) on the local network (LAN) for testing purposes, without exposing it to the public internet.

## Backend Changes (`backend/src/main.ts`, `app.controller.ts`)
- [ ] **CORS**: Ensure regex allows private IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x).
- [ ] **Health Endpoint**: Add `@Get('health')` to `app.controller.ts` returning `{ status: 'ok' }`. Public access.
- [ ] **Listen**: Verify app listens on `0.0.0.0`.

## Frontend Changes (`frontend/src/lib/api.ts`, `next.config.mjs`)
- [x] **Smart Base URL**: `api.ts` already has logic `window.location.hostname:4000`. Verified.
- [ ] **CSP**: Update `next.config.mjs` `connect-src` to allow `http:` and `https:` schemes broadly (or `*`) in development/LAN mode to support dynamic IPs.

## Documentation
- [ ] **LAN Guide**: Add instructions on how to find IP and test.
