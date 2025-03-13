-- DropForeignKey
ALTER TABLE "GRN" DROP CONSTRAINT "GRN_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "GRN" DROP CONSTRAINT "GRN_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "GRN" DROP CONSTRAINT "GRN_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "GRNLineItem" DROP CONSTRAINT "GRNLineItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_reports" DROP CONSTRAINT "inventory_reports_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_order_items" DROP CONSTRAINT "purchase_order_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transactions" DROP CONSTRAINT "stock_transactions_itemId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transactions" DROP CONSTRAINT "stock_transactions_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_fromWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_itemId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_toWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "sub_warehouses" DROP CONSTRAINT "sub_warehouses_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "supplier_items" DROP CONSTRAINT "supplier_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "supplier_items" DROP CONSTRAINT "supplier_items_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "supplier_sites" DROP CONSTRAINT "supplier_sites_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "suppliers" DROP CONSTRAINT "suppliers_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_items" DROP CONSTRAINT "warehouse_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_items" DROP CONSTRAINT "warehouse_items_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_organizationId_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_sites" ADD CONSTRAINT "supplier_sites_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_warehouses" ADD CONSTRAINT "sub_warehouses_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_items" ADD CONSTRAINT "supplier_items_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_items" ADD CONSTRAINT "supplier_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_items" ADD CONSTRAINT "warehouse_items_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_items" ADD CONSTRAINT "warehouse_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRNLineItem" ADD CONSTRAINT "GRNLineItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reports" ADD CONSTRAINT "inventory_reports_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
