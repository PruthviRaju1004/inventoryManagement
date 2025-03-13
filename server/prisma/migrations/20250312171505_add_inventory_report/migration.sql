/*
  Warnings:

  - The primary key for the `inventory_reports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `available_quantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `batch_number` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `bin_location` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `committed_quantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `created_date` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `current_quantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `damaged_quantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `expiry_date` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `inventory_id` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `inward_quantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `item_name` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `lot_number` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturing_date` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `opening_quantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `outward_quantity` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `reorder_level` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `serial_number` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `stock_inward_date` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `stock_outward_date` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `sub_warehouse_name` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_value` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `unit_cost` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `unit_of_measure` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `updated_date` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_id` on the `inventory_reports` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_name` on the `inventory_reports` table. All the data in the column will be lost.
  - Added the required column `availableQuantity` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `committedQuantity` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentQuantity` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `damagedQuantity` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inwardQuantity` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemName` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingQuantity` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outwardQuantity` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalValue` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitCost` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseName` to the `inventory_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "inventory_reports" DROP CONSTRAINT "inventory_reports_warehouse_id_fkey";

-- AlterTable
ALTER TABLE "inventory_reports" DROP CONSTRAINT "inventory_reports_pkey",
DROP COLUMN "available_quantity",
DROP COLUMN "batch_number",
DROP COLUMN "bin_location",
DROP COLUMN "committed_quantity",
DROP COLUMN "created_by",
DROP COLUMN "created_date",
DROP COLUMN "current_quantity",
DROP COLUMN "damaged_quantity",
DROP COLUMN "expiry_date",
DROP COLUMN "inventory_id",
DROP COLUMN "inward_quantity",
DROP COLUMN "item_name",
DROP COLUMN "lot_number",
DROP COLUMN "manufacturing_date",
DROP COLUMN "opening_quantity",
DROP COLUMN "outward_quantity",
DROP COLUMN "reorder_level",
DROP COLUMN "serial_number",
DROP COLUMN "stock_inward_date",
DROP COLUMN "stock_outward_date",
DROP COLUMN "sub_warehouse_name",
DROP COLUMN "subcategory",
DROP COLUMN "total_value",
DROP COLUMN "unit_cost",
DROP COLUMN "unit_of_measure",
DROP COLUMN "updated_by",
DROP COLUMN "updated_date",
DROP COLUMN "warehouse_id",
DROP COLUMN "warehouse_name",
ADD COLUMN     "availableQuantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "batchNumber" VARCHAR(50),
ADD COLUMN     "binLocation" VARCHAR(100),
ADD COLUMN     "committedQuantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "currentQuantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "damagedQuantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "inventoryId" SERIAL NOT NULL,
ADD COLUMN     "inwardQuantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "itemName" VARCHAR(255) NOT NULL,
ADD COLUMN     "lotNumber" VARCHAR(50),
ADD COLUMN     "manufacturingDate" TIMESTAMP(3),
ADD COLUMN     "openingQuantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "outwardQuantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "reorderLevel" DECIMAL(10,2),
ADD COLUMN     "serialNumber" VARCHAR(50),
ADD COLUMN     "stockInwardDate" TIMESTAMP(3),
ADD COLUMN     "stockOutwardDate" TIMESTAMP(3),
ADD COLUMN     "subCategory" VARCHAR(100),
ADD COLUMN     "subWarehouseName" VARCHAR(100),
ADD COLUMN     "totalValue" DECIMAL(20,2) NOT NULL,
ADD COLUMN     "unitCost" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "unitOfMeasure" VARCHAR(50),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" INTEGER NOT NULL,
ADD COLUMN     "warehouseId" INTEGER NOT NULL,
ADD COLUMN     "warehouseName" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "inventory_reports_pkey" PRIMARY KEY ("inventoryId");

-- AddForeignKey
ALTER TABLE "inventory_reports" ADD CONSTRAINT "inventory_reports_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
