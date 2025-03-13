/*
  Warnings:

  - Added the required column `createdBy` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "updatedBy" INTEGER NOT NULL;
