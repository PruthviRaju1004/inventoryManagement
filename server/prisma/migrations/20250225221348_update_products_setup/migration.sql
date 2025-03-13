/*
  Warnings:

  - The `leadTimeDays` column on the `items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "leadTimeDays",
ADD COLUMN     "leadTimeDays" INTEGER;
