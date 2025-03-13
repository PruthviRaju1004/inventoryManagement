/*
  Warnings:

  - You are about to drop the column `status` on the `GRN` table. All the data in the column will be lost.
  - You are about to alter the column `grnNumber` on the `GRN` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[grnNumber]` on the table `GRN` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GRN" DROP COLUMN "status",
ADD COLUMN     "grnStatus" "GRNStatus" NOT NULL DEFAULT 'Draft',
ALTER COLUMN "grnDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "grnNumber" SET DATA TYPE VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "GRN_grnNumber_key" ON "GRN"("grnNumber");
