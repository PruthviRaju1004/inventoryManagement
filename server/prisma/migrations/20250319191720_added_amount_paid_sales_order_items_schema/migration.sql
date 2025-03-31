/*
  Warnings:

  - Added the required column `amountPaid` to the `sales_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales_orders" ADD COLUMN     "amountPaid" DECIMAL(10,2) NOT NULL;
