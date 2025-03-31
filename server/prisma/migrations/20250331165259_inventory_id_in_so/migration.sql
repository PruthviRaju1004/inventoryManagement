/*
  Warnings:

  - You are about to drop the column `itemId` on the `sales_order_items` table. All the data in the column will be lost.
  - Added the required column `inventoryId` to the `sales_order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sales_order_items" DROP CONSTRAINT "sales_order_items_itemId_fkey";

-- AlterTable
ALTER TABLE "sales_order_items" DROP COLUMN "itemId",
ADD COLUMN     "inventoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory_reports"("inventoryId") ON DELETE CASCADE ON UPDATE CASCADE;
