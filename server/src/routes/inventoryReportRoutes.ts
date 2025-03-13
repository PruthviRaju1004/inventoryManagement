import express from "express";
import { createInventoryReport, getAllInventoryReports, getInventoryReportById, updateInventoryReport, deleteInventoryReport } from "../controllers/inventoryReportsController";
import { authenticateToken, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticateToken, authorizeSuperAdmin, createInventoryReport);
router.get("/", authenticateToken, authorizeSuperAdmin, getAllInventoryReports);
router.get("/:id", authenticateToken, authorizeSuperAdmin, getInventoryReportById);
router.put("/:id", authenticateToken, authorizeSuperAdmin, updateInventoryReport);
router.delete("/:id", authenticateToken, authorizeSuperAdmin, deleteInventoryReport);

export default router;
