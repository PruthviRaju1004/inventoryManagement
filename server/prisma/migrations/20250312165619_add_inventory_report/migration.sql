-- CreateTable
CREATE TABLE "inventory_reports" (
    "inventory_id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "batch_number" VARCHAR(50),
    "lot_number" VARCHAR(50),
    "serial_number" VARCHAR(50),
    "manufacturing_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "stock_inward_date" TIMESTAMP(3),
    "stock_outward_date" TIMESTAMP(3),
    "opening_quantity" DECIMAL(10,2) NOT NULL,
    "current_quantity" DECIMAL(10,2) NOT NULL,
    "inward_quantity" DECIMAL(10,2) NOT NULL,
    "outward_quantity" DECIMAL(10,2) NOT NULL,
    "committed_quantity" DECIMAL(10,2) NOT NULL,
    "available_quantity" DECIMAL(10,2) NOT NULL,
    "damaged_quantity" DECIMAL(10,2) NOT NULL,
    "unit_cost" DECIMAL(15,2) NOT NULL,
    "total_value" DECIMAL(20,2) NOT NULL,
    "reorder_level" DECIMAL(10,2),
    "warehouse_id" INTEGER NOT NULL,
    "warehouse_name" VARCHAR(100) NOT NULL,
    "sub_warehouse_name" VARCHAR(100),
    "bin_location" VARCHAR(100),
    "category" VARCHAR(100),
    "subcategory" VARCHAR(100),
    "unit_of_measure" VARCHAR(50),
    "barcode" VARCHAR(100),
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_date" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "inventory_reports_pkey" PRIMARY KEY ("inventory_id")
);

-- AddForeignKey
ALTER TABLE "inventory_reports" ADD CONSTRAINT "inventory_reports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reports" ADD CONSTRAINT "inventory_reports_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
