-- DropForeignKey
ALTER TABLE "purchase_order_items" DROP CONSTRAINT "purchase_order_items_purchaseOrderId_fkey";

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
