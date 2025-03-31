/*
  Warnings:

  - Added the required column `outstandingAmount` to the `sales_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales_orders" ADD COLUMN     "outstandingAmount" DECIMAL(10,2) NOT NULL;
