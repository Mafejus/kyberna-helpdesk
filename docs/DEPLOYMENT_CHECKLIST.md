# Deployment Checklist

Follow these steps to deploy on the school server.

## 1. Environment Variables
Create `.env` in `backend/` and `frontend/` (or root if using Docker env_file) with STRONG secrets.

**Backend `.env`**:
```env
DATABASE_URL="postgresql://user:STRONG_PASSWORD_HERE@postgres:5432/school_helpdesk?schema=public"
JWT_SECRET="VERY_LONG_RANDOM_STRING_HERE_MIN_64_CHARS"
JWT_EXPIRATION="15m"
NODE_ENV="production"
ALLOWED_EMAIL_DOMAIN="ssakhk.cz"
```

## 2. Server Setup (Docker)
1.  Install Docker & Docker Compose.
2.  Clone repository.
3.  Go to project root.
4.  Run:
    ```bash
    # Build and start with production config
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

## 3. Database Migration
On the first run (or after updates), apply migrations:
```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```
*Note: If specific seeding is needed, run `npx prisma db seed`.*

## 4. Admin Setup
1.  Ensure you have an admin account.
2.  **IMMEDATELY Change Admin Password**.

## 5. Reverse Proxy (Nginx)
Configure Nginx to terminate SSL and forward traffic.
**Important**: Configure Nginx to forward `Host` headers.

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`

## 6. Verification
- [ ] Check logs: `docker-compose logs -f backend`
- [ ] Verify Login limits (try 6 wrong passwords, expect 429 Too Many Requests).
- [ ] Verify File Upload restriction (try uploading .exe, expect Error).
