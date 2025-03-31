import express from "express";
import {
    createSalesOrder,
    getAllSalesOrders,
    getSalesOrderById,
    updateSalesOrder,
    deleteSalesOrder,
    getSalesSummary
} from "../controllers/salesOderController";
import { authenticateToken, authorizeAdmin, authorizeManager, authorizeViewer } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeAdmin, createSalesOrder); // Only admins can create
router.get("/", authenticateToken, authorizeViewer, getAllSalesOrders); // Admins & Super Admins can fetch
router.get("/summary", authenticateToken, authorizeViewer, getSalesSummary);
router.get("/:salesOrderId", authenticateToken, getSalesOrderById); // Admins & Super Admins can fetch
router.put("/:id", authenticateToken, authorizeManager, updateSalesOrder);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteSalesOrder); // Only super_admin can delete
// router.put("/:id/receive", authenticateToken, authorizeSuperAdmin, receivePurchaseOrder);

export default router;
