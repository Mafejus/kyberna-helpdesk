-- CreateTable
CREATE TABLE "ClassroomPc" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "pcNumber" INTEGER NOT NULL,
    "office" BOOLEAN NOT NULL DEFAULT false,
    "adobe" BOOLEAN NOT NULL DEFAULT false,
    "cloned" BOOLEAN NOT NULL DEFAULT false,
    "imageMoved" BOOLEAN NOT NULL DEFAULT false,
    "inDomain" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassroomPc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomPc_classroomId_pcNumber_key" ON "ClassroomPc"("classroomId", "pcNumber");

-- AddForeignKey
ALTER TABLE "ClassroomPc" ADD CONSTRAINT "ClassroomPc_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
