/*
  Warnings:

  - Added the required column `itemName` to the `sales_order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales_order_items" ADD COLUMN     "itemName" TEXT NOT NULL;
