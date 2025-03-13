/*
  Warnings:

  - You are about to drop the column `poItemId` on the `GRNLineItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GRNLineItem" DROP CONSTRAINT "GRNLineItem_poItemId_fkey";

-- AlterTable
ALTER TABLE "GRNLineItem" DROP COLUMN "poItemId";
