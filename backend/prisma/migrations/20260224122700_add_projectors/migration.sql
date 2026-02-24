-- CreateTable
CREATE TABLE "Projector" (
    "id" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,
    "hasDellDock" BOOLEAN NOT NULL DEFAULT false,
    "isFunctional" BOOLEAN NOT NULL DEFAULT true,
    "hasHdmi" BOOLEAN NOT NULL DEFAULT false,
    "hasHdmiExtension" BOOLEAN NOT NULL DEFAULT false,
    "usbExtensionType" TEXT,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "lampHours" TEXT,
    "lastInspectionDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projector_pkey" PRIMARY KEY ("id")
);
