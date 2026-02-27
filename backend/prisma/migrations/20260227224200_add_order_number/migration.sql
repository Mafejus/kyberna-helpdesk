ALTER TABLE "WorkOrder" ADD COLUMN "orderNumber" INTEGER;
CREATE UNIQUE INDEX "WorkOrder_orderNumber_key" ON "WorkOrder"("orderNumber");
