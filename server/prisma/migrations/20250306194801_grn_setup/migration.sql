-- CreateEnum
CREATE TYPE "GRNStatus" AS ENUM ('Draft', 'Approved', 'Closed', 'Cancelled');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'REJECTED';
ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'OPEN';

-- CreateTable
CREATE TABLE "GRN" (
    "grnId" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "grnDate" TIMESTAMP(3) NOT NULL,
    "poId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "supplierName" VARCHAR(100) NOT NULL,
    "status" "GRNStatus" NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "warehouseName" VARCHAR(100) NOT NULL,

    CONSTRAINT "GRN_pkey" PRIMARY KEY ("grnId")
);

-- CreateTable
CREATE TABLE "GRNLineItem" (
    "lineId" SERIAL NOT NULL,
    "grnId" INTEGER NOT NULL,
    "poItemId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "itemName" VARCHAR(100) NOT NULL,
    "orderedQty" DECIMAL(10,2) NOT NULL,
    "receivedQty" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "uom" VARCHAR(20) NOT NULL,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "batchNumber" VARCHAR(50),
    "manufacturingDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "storageLocation" VARCHAR(100),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL,

    CONSTRAINT "GRNLineItem_pkey" PRIMARY KEY ("lineId")
);

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_poId_fkey" FOREIGN KEY ("poId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRNLineItem" ADD CONSTRAINT "GRNLineItem_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "GRN"("grnId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRNLineItem" ADD CONSTRAINT "GRNLineItem_poItemId_fkey" FOREIGN KEY ("poItemId") REFERENCES "purchase_order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRNLineItem" ADD CONSTRAINT "GRNLineItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
