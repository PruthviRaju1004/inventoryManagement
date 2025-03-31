/*
  Warnings:

  - You are about to drop the column `availableQuantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `committedQuantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `currentQuantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `damagedQuantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `inwardQuantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `openingQuantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `outwardQuantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `totalValue` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `unitCost` on the `inventory_reports` table. All the data in the column will be lost.
  - Added the required column `allocation` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cAndHCharges` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costBeforeDuty` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costBeforeProfitMargin` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costPerUnit` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dutyCharges` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fobAmount` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freight` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providedQuantity` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierPrice` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory_reports" DROP COLUMN "availableQuantity",
DROP COLUMN "committedQuantity",
DROP COLUMN "currentQuantity",
DROP COLUMN "damagedQuantity",
DROP COLUMN "inwardQuantity",
DROP COLUMN "openingQuantity",
DROP COLUMN "outwardQuantity",
DROP COLUMN "totalValue",
DROP COLUMN "unitCost",
ADD COLUMN     "allocation" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "cAndHCharges" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "costBeforeDuty" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "costBeforeProfitMargin" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "costPerUnit" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "dutyCharges" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "fobAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "freight" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "providedQuantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "sellingPrice" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "supplierPrice" DECIMAL(15,2) NOT NULL;
