/*
  Warnings:

  - You are about to drop the column `adobe` on the `ClassroomPc` table. All the data in the column will be lost.
  - You are about to drop the column `cloned` on the `ClassroomPc` table. All the data in the column will be lost.
  - You are about to drop the column `imageMoved` on the `ClassroomPc` table. All the data in the column will be lost.
  - You are about to drop the column `inDomain` on the `ClassroomPc` table. All the data in the column will be lost.
  - You are about to drop the column `office` on the `ClassroomPc` table. All the data in the column will be lost.
  - You are about to drop the column `pcNumber` on the `ClassroomPc` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classroomId,label]` on the table `ClassroomPc` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `ClassroomPc` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('BOOLEAN', 'TEXT');

-- DropIndex
DROP INDEX "ClassroomPc_classroomId_pcNumber_key";

-- AlterTable
ALTER TABLE "ClassroomPc" DROP COLUMN "adobe",
DROP COLUMN "cloned",
DROP COLUMN "imageMoved",
DROP COLUMN "inDomain",
DROP COLUMN "office",
DROP COLUMN "pcNumber",
ADD COLUMN     "label" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PcProperty" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL DEFAULT 'BOOLEAN',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PcProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PcPropertyValue" (
    "id" TEXT NOT NULL,
    "pcId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "valueBool" BOOLEAN,
    "valueText" TEXT,

    CONSTRAINT "PcPropertyValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PcProperty_classroomId_key_key" ON "PcProperty"("classroomId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "PcPropertyValue_pcId_propertyId_key" ON "PcPropertyValue"("pcId", "propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomPc_classroomId_label_key" ON "ClassroomPc"("classroomId", "label");

-- AddForeignKey
ALTER TABLE "PcProperty" ADD CONSTRAINT "PcProperty_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PcPropertyValue" ADD CONSTRAINT "PcPropertyValue_pcId_fkey" FOREIGN KEY ("pcId") REFERENCES "ClassroomPc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PcPropertyValue" ADD CONSTRAINT "PcPropertyValue_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PcProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
