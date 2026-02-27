ALTER TABLE "WorkOrder" DROP COLUMN "department";
ALTER TABLE "WorkOrder" DROP COLUMN "payer";
ALTER TABLE "WorkOrder" DROP COLUMN "material";
ALTER TABLE "WorkOrder" DROP COLUMN "timeSpent";
ALTER TABLE "WorkOrder" DROP COLUMN "signature";

ALTER TABLE "WorkOrder" ADD COLUMN "event" TEXT;
ALTER TABLE "WorkOrder" ADD COLUMN "dateRange" TEXT;
ALTER TABLE "WorkOrder" ADD COLUMN "problemDescription" TEXT;
ALTER TABLE "WorkOrder" ADD COLUMN "resolution" TEXT;
ALTER TABLE "WorkOrder" ADD COLUMN "status" TEXT;

ALTER TABLE "WorkOrder" ALTER COLUMN "ticketId" DROP NOT NULL;
