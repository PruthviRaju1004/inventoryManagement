import express from "express";
import {
  createPurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  receivePurchaseOrder
} from "../controllers/purchaseOrderController";
import { authenticateToken, authorizeSuperAdmin} from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, createPurchaseOrder); // Only admins can create
router.get("/", authenticateToken, getPurchaseOrders); // Admins & Super Admins can fetch
router.get("/:purchaseOrderId", authenticateToken, getPurchaseOrderById); // Admins & Super Admins can fetch
router.put("/:id", authenticateToken, updatePurchaseOrder);
router.delete("/:id", authenticateToken, authorizeSuperAdmin, deletePurchaseOrder); // Only super_admin can delete
router.put("/:id/receive", authenticateToken, receivePurchaseOrder);

export default router;
