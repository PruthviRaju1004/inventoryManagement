/*
  Warnings:

  - You are about to drop the column `grnStatus` on the `GRN` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GRN" DROP COLUMN "grnStatus",
ADD COLUMN     "status" "GRNStatus" NOT NULL DEFAULT 'Draft';
