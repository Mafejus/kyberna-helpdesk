ALTER TABLE "WorkOrder" DROP COLUMN "event";
ALTER TABLE "WorkOrder" DROP COLUMN "dateRange";

ALTER TABLE "WorkOrder" ADD COLUMN "title" TEXT;
ALTER TABLE "WorkOrder" ADD COLUMN "technician" TEXT;
ALTER TABLE "WorkOrder" ADD COLUMN "date" TEXT;
