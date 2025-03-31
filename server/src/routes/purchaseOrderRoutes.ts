import express from "express";
import {
  createPurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  receivePurchaseOrder
} from "../controllers/purchaseOrderController";
import { authenticateToken, authorizeAdmin, authorizeManager, authorizeViewer, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeAdmin, createPurchaseOrder); // Only admins can create
router.get("/", authenticateToken, authorizeViewer, getPurchaseOrders); // Admins & Super Admins can fetch
router.get("/:purchaseOrderId", authenticateToken, getPurchaseOrderById); // Admins & Super Admins can fetch
router.put("/:id", authenticateToken, authorizeManager, updatePurchaseOrder);
router.delete("/:id", authenticateToken, authorizeAdmin, deletePurchaseOrder); // Only super_admin can delete
router.put("/:id/receive", authenticateToken, authorizeSuperAdmin, receivePurchaseOrder);

export default router;
