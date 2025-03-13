-- CreateTable
CREATE TABLE "warehouses" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "address" TEXT NOT NULL,
    "contactEmail" VARCHAR(100),
    "contactPhone" VARCHAR(20),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_warehouses" (
    "id" SERIAL NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "capacity" DECIMAL(10,2),
    "temperatureControl" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL,

    CONSTRAINT "sub_warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sub_warehouses_code_key" ON "sub_warehouses"("code");

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_warehouses" ADD CONSTRAINT "sub_warehouses_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
