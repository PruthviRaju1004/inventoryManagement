import express from "express";
import { createInventoryReport, getAllInventoryReports, getInventoryReportById, updateInventoryReport, deleteInventoryReport } from "../controllers/inventoryReportsController";
import { authenticateToken, authorizeSuperAdmin, authorizeAdmin, authorizeManager, authorizeViewer } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateToken, authorizeAdmin, createInventoryReport);
router.get("/", authenticateToken, authorizeViewer, getAllInventoryReports);
router.get("/:id", authenticateToken, authorizeSuperAdmin, getInventoryReportById);
router.put("/:id", authenticateToken, authorizeManager, updateInventoryReport);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteInventoryReport);

export default router;
