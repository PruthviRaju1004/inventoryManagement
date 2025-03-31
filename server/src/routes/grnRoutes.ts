import express from "express";
import {
    createGRN,
    getGRNs,
    updateGRN,
    deleteGRN,
    getGRNById,
} from "../controllers/grnController";
import { authenticateToken, authorizeAdmin, authorizeManager, authorizeViewer } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeAdmin, createGRN);
router.get("/", authenticateToken, authorizeViewer, getGRNs);
router.get("/:id", authenticateToken, getGRNById);
router.put("/:id", authenticateToken, authorizeManager, updateGRN);
router.delete("/:grnId", authenticateToken, authorizeAdmin, deleteGRN);

export default router;
