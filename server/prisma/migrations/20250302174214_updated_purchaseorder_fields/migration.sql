/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `purchase_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'OPEN';
ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'CLOSED';

-- AlterTable
ALTER TABLE "purchase_order_items" ADD COLUMN     "itemName" VARCHAR(20) NOT NULL DEFAULT 'Unknown Item',
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "uom" VARCHAR(20) NOT NULL DEFAULT 'PCS';

-- AlterTable
ALTER TABLE "purchase_orders" ADD COLUMN     "orderNumber" VARCHAR(50) NOT NULL DEFAULT 'PO-000000',
ADD COLUMN     "remarks" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_orderNumber_key" ON "purchase_orders"("orderNumber");
