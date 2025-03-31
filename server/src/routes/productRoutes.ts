import express from "express";
import {
    createItem,
    getItems,
    updateItem,
    deleteItem,
    getItemById
} from "../controllers/productController";
import { authenticateToken, authorizeAdmin, authorizeManager, authorizeViewer, authorizeSuperAdmin } from "../middleware/auth"; // Added authorizeAdmin

const router = express.Router();

// Middleware to check if the user is either super admin or admin of the organization
router.post("/create", authenticateToken, authorizeSuperAdmin, createItem); // Only Super Admin allowed to create items
router.get("/", authenticateToken, authorizeViewer, getItems);  // Both Super Admin & Admin allowed to get items
router.get("/:id", authenticateToken, getItemById); // Both Super Admin & Admin allowed to get item by ID
router.put("/:id", authenticateToken, authorizeManager, updateItem);  // Both Super Admin & Admin allowed to update items
router.delete("/:id", authenticateToken, authorizeAdmin, deleteItem);  // Both Super Admin & Admin allowed to delete items

export default router;
