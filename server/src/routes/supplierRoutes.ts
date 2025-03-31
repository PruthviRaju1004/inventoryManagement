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
import { authenticateToken, authorizeAdmin, authorizeManager, authorizeViewer, authorizeSuperAdmin} from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeAdmin, createSupplier);
router.get("/", authenticateToken, authorizeViewer, getSuppliers);  // Allow both super_admin & admin
router.put("/:id", authenticateToken, authorizeManager, updateSupplier);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteSupplier);
// Supplier item routes (Products linked to a supplier)
router.post("/:supplierId/items", authenticateToken, authorizeAdmin, linkProductsToSupplier);
router.get("/:supplierId/items", authenticateToken, authorizeViewer, getSupplierItems);
router.put("/:supplierId/items/:itemId", authenticateToken, authorizeManager, updateSupplierItem);
router.delete("/:supplierId/items/:itemId", authenticateToken, authorizeAdmin, removeSupplierItem);
router.get("/:supplierId/purchase-orders", getPurchaseOrdersForSupplier);

export default router;