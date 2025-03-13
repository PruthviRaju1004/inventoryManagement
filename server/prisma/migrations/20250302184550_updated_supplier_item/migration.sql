/*
  Warnings:

  - You are about to drop the column `currency` on the `supplier_items` table. All the data in the column will be lost.
  - You are about to drop the column `leadTime` on the `supplier_items` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `supplier_items` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `supplier_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `effective_date` to the `supplier_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supply_price` to the `supplier_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supply_quantity` to the `supplier_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `supplier_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_date` to the `supplier_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "supplier_items" DROP COLUMN "currency",
DROP COLUMN "leadTime",
DROP COLUMN "price",
ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "effective_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_preferred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supply_price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "supply_quantity" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "updated_by" INTEGER NOT NULL,
ADD COLUMN     "updated_date" TIMESTAMP(3) NOT NULL;
