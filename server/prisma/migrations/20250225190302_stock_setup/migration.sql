-- CreateEnum
CREATE TYPE "StockTransactionType" AS ENUM ('PURCHASE', 'SALE', 'ADJUSTMENT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "StockTransferStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "stock_transactions" (
    "id" SERIAL NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "transactionType" "StockTransactionType" NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "referenceId" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "stock_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfers" (
    "id" SERIAL NOT NULL,
    "fromWarehouseId" INTEGER NOT NULL,
    "toWarehouseId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "status" "StockTransferStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
