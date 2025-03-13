import express from "express";
import {
    createGRN,
    getGRNs,
    updateGRN,
    deleteGRN,
    getGRNById,
} from "../controllers/grnController";
import { authenticateToken, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, createGRN); // Only admins can create
router.get("/", authenticateToken, getGRNs); // Admins & Super Admins can fetch
router.get("/:id", authenticateToken, getGRNById); // Admins & Super Admins can fetch
router.put("/:id", authenticateToken, updateGRN);
router.delete("/:grnId", authenticateToken, authorizeSuperAdmin, deleteGRN); // Only super_admin can delete
// router.put("/:id/receive", authenticateToken, receivePurchaseOrder);

export default router;
