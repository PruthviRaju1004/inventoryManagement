/*
  Warnings:

  - Added the required column `warehouseId` to the `purchase_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchase_orders" ADD COLUMN     "warehouseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
