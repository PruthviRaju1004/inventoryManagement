/*
  Warnings:

  - You are about to drop the column `warehouseId` on the `purchase_orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_warehouseId_fkey";

-- AlterTable
ALTER TABLE "purchase_orders" DROP COLUMN "warehouseId";
