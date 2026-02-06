-- CreateTable
CREATE TABLE "HelpdeskShift" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "lesson" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpdeskShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpdeskShiftAssignee" (
    "id" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelpdeskShiftAssignee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HelpdeskShift_date_lesson_key" ON "HelpdeskShift"("date", "lesson");

-- CreateIndex
CREATE UNIQUE INDEX "HelpdeskShiftAssignee_shiftId_userId_key" ON "HelpdeskShiftAssignee"("shiftId", "userId");

-- AddForeignKey
ALTER TABLE "HelpdeskShiftAssignee" ADD CONSTRAINT "HelpdeskShiftAssignee_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "HelpdeskShift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpdeskShiftAssignee" ADD CONSTRAINT "HelpdeskShiftAssignee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
