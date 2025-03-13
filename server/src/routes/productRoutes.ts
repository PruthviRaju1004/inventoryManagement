import express from "express";
import {
    createItem,
    getItems,
    updateItem,
    deleteItem,
    getItemById
} from "../controllers/productController";
import { authenticateToken, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeSuperAdmin, createItem);
router.get("/", authenticateToken, authorizeSuperAdmin, getItems);  // Allow both super_admin & admin
router.get("/:id", authenticateToken, authorizeSuperAdmin, getItemById);
router.put("/:id", authenticateToken, authorizeSuperAdmin, updateItem);
router.delete("/:id", authenticateToken, authorizeSuperAdmin, deleteItem);

export default router;
