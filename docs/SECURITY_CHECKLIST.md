# Security Checklist (School Helpdesk)

This checklist tracks security measures implemented for production readiness.

## 0. Fundamental Principles
- [x] **No Secrets in Repo**: All secrets (JWT, DB) are expected from ENV.
- [x] **Prod/Dev Separation**: `NODE_ENV` controls CORS, Swagger, logging.
- [x] **Auth Strategy**: Local Email+Password only (No external OAuth).

## 1. Authentication & Accounts
- [x] **Strong Passwords**: Recommended min 12 chars.
- [x] **Secure Storage**: `bcrypt` with cost 12 (upgraded from 10).
- [x] **Token Invalidation**: `passwordUpdatedAt` field added. Tokens issued before password change are invalid.
- [x] **Rate Limiting**:
    - Global: 100 req/min.
    - Login: Strict 5 req/10min.
- [x] **JWT Security**: Checked against `passwordUpdatedAt`.

## 2. Access Control (RBAC)
- [x] **Student Ticket Visibility**: Students can ONLY see tickets assigned to them OR unassigned. Enforced in `tickets.service.ts`.
- [x] **Attachment Access**: Enforced in `getAttachmentStream`.

## 3. Input Validation & Injection
- [x] **Validation**: `ValidationPipe` with `whitelist: true` is enabled globally.
- [x] **SQL Injection**: Using Prisma ORM.
- [x] **File Uploads**:
    - Whitelist: jpg, png, pdf, docx, xlsx, txt.
    - Size Limit: 10MB.
    - Random Filenames generation (uuid/random hex).

## 4. Network & Headers
- [x] **Helmet**: Enabled for security headers (backend).
- [x] **CORS**:
    - **Production**: Strict origin `https://helpdesk.ssakhk.cz`.
    - **Dev**: Regex for LAN/Localhost.
- [x] **CSP**: Configured in Next.js (`next.config.mjs`) including HSTS.

## 5. Infrastructure
- [x] **Backend Isolation**: Runs as non-root `node` user in Docker.
- [x] **Database Isolation**: Port 5432 is NOT exposed to host in production (commented out in docker-compose).
- [x] **Reliability**: Restart policies and Healthchecks configured.
