-- CreateEnum
CREATE TYPE "AuditEntityType" AS ENUM ('TICKET', 'SCHEDULE_SLOT', 'USER', 'ATTACHMENT', 'SWAP');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('TICKET_CREATED', 'TICKET_STATUS_CHANGED', 'TICKET_PRIORITY_CHANGED', 'TICKET_DUE_DATE_CHANGED', 'TICKET_ASSIGNEE_ADDED', 'TICKET_ASSIGNEE_REMOVED', 'TICKET_APPROVED', 'TICKET_REJECTED', 'TICKET_MARKED_DONE', 'TICKET_FILE_UPLOADED', 'TICKET_FILE_REMOVED', 'TICKET_NOTE_ADDED', 'SLOT_CLAIMED', 'SLOT_UNCLAIMED', 'SLOT_ASSIGNED_BY_ADMIN', 'SLOT_REMOVED_BY_ADMIN', 'CHECK_IN_STARTED', 'CHECK_IN_ENDED', 'SWAP_REQUESTED', 'SWAP_ACCEPTED', 'SWAP_CANCELLED', 'USER_CREATED', 'USER_UPDATED', 'USER_PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TICKET_APPROVED', 'TICKET_RETURNED', 'TICKET_PRIORITY_CHANGED', 'TICKET_DUE_DATE_CHANGED', 'TICKET_ASSIGNED', 'TICKET_UNASSIGNED', 'TICKET_WAITING_APPROVAL', 'SLOT_CHANGED_BY_ADMIN', 'SLOT_CANCELLED_LATE', 'SWAP_OFFER_CREATED', 'SWAP_OFFER_ACCEPTED');

-- CreateEnum
CREATE TYPE "SwapStatus" AS ENUM ('OPEN', 'ACCEPTED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorUserId" TEXT,
    "actorRole" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "entityType" "AuditEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "message" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpdeskCheckIn" (
    "id" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "endedByUserId" TEXT,
    "note" TEXT,

    CONSTRAINT "HelpdeskCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpdeskSwap" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shiftId" TEXT NOT NULL,
    "offeredByUserId" TEXT NOT NULL,
    "status" "SwapStatus" NOT NULL DEFAULT 'OPEN',
    "acceptedByUserId" TEXT,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "HelpdeskSwap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpdeskCheckIn" ADD CONSTRAINT "HelpdeskCheckIn_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "HelpdeskShift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpdeskCheckIn" ADD CONSTRAINT "HelpdeskCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpdeskCheckIn" ADD CONSTRAINT "HelpdeskCheckIn_endedByUserId_fkey" FOREIGN KEY ("endedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpdeskSwap" ADD CONSTRAINT "HelpdeskSwap_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "HelpdeskShift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpdeskSwap" ADD CONSTRAINT "HelpdeskSwap_offeredByUserId_fkey" FOREIGN KEY ("offeredByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpdeskSwap" ADD CONSTRAINT "HelpdeskSwap_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
