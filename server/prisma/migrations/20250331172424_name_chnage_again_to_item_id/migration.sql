/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `sales_order_items` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `sales_order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sales_order_items" DROP CONSTRAINT "sales_order_items_inventoryId_fkey";

-- AlterTable
ALTER TABLE "sales_order_items" DROP COLUMN "inventoryId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
