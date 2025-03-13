import express from "express";
import {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  linkProductsToSupplier,
  getSupplierItems,
  updateSupplierItem,
  removeSupplierItem,
  getPurchaseOrdersForSupplier
} from "../controllers/supplierController";
import { authenticateToken, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeSuperAdmin, createSupplier);
router.get("/", authenticateToken, authorizeSuperAdmin, getSuppliers);  // Allow both super_admin & admin
router.put("/:id", authenticateToken, authorizeSuperAdmin, updateSupplier);
router.delete("/:id", authenticateToken, authorizeSuperAdmin, deleteSupplier);
// Supplier item routes (Products linked to a supplier)
router.post("/:supplierId/items", authenticateToken, authorizeSuperAdmin, linkProductsToSupplier);
router.get("/:supplierId/items", authenticateToken, authorizeSuperAdmin, getSupplierItems);
router.put("/:supplierId/items/:itemId", authenticateToken, authorizeSuperAdmin, updateSupplierItem);
router.delete("/:supplierId/items/:itemId", authenticateToken, authorizeSuperAdmin, removeSupplierItem);
router.get("/:supplierId/purchase-orders", getPurchaseOrdersForSupplier);

export default router;