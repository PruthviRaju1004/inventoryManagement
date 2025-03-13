-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('INVENTORY', 'NON_INVENTORY', 'SERVICE');

-- CreateEnum
CREATE TYPE "CostingMethod" AS ENUM ('FIFO', 'LIFO', 'AVERAGE', 'STANDARD');

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "itemCode" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "searchDescription" VARCHAR(255),
    "baseUom" VARCHAR(20) NOT NULL,
    "secondaryUom" VARCHAR(20),
    "qtyPerUom" DECIMAL(10,2),
    "salesUom" VARCHAR(20),
    "purchaseUom" VARCHAR(20),
    "type" "ItemType" NOT NULL,
    "inventoryGroup" VARCHAR(50),
    "itemCategoryCode" VARCHAR(50),
    "parentCategory" VARCHAR(50),
    "productType" VARCHAR(50),
    "hsnSacCode" VARCHAR(20),
    "gstCredit" BOOLEAN NOT NULL DEFAULT false,
    "make" VARCHAR(50),
    "color" VARCHAR(20),
    "size" VARCHAR(20),
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "costingMethod" "CostingMethod" NOT NULL,
    "costPrice" DECIMAL(10,2),
    "commissionEligible" BOOLEAN NOT NULL DEFAULT false,
    "commissionFactor" DECIMAL(5,2),
    "businessUnitName" VARCHAR(50),
    "leadTimeDays" INTEGER,
    "barcode" VARCHAR(50),
    "reorderLevel" INTEGER,
    "safetyStockLevel" INTEGER,
    "expirationDate" TIMESTAMP(3),
    "isPerishable" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_items" (
    "supplierId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "leadTime" INTEGER,
    "currency" VARCHAR(20) NOT NULL,

    CONSTRAINT "supplier_items_pkey" PRIMARY KEY ("supplierId","itemId")
);

-- CreateTable
CREATE TABLE "warehouse_items" (
    "warehouseId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "reorderLevel" INTEGER,
    "reservedStock" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "warehouse_items_pkey" PRIMARY KEY ("warehouseId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_itemCode_key" ON "items"("itemCode");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_items" ADD CONSTRAINT "supplier_items_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_items" ADD CONSTRAINT "supplier_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_items" ADD CONSTRAINT "warehouse_items_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_items" ADD CONSTRAINT "warehouse_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
