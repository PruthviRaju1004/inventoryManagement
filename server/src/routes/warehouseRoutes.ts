import express from "express";
import {
    createWarehouse,
    getWarehouses,
    updateWarehouse,
    deleteWarehouse,
    addItemToWarehouse,
    getWarehouseProducts,
    updateWarehouseStock,
    reserveStock,
    getWarehouseById
} from "../controllers/warehouseController";
import { authenticateToken, authorizeAdmin, authorizeManager, authorizeViewer, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeManager, createWarehouse);
router.get("/", authenticateToken, authorizeViewer, getWarehouses);  // Allow both super_admin & admin
router.get("/:id", authenticateToken, authorizeViewer, getWarehouseById);  // Allow both super_admin & admin
router.put("/:id", authenticateToken, authorizeManager, updateWarehouse);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteWarehouse);
router.post("/:warehouseId/items", authenticateToken, authorizeSuperAdmin, addItemToWarehouse);

// Get stock levels for a warehouse
router.get("/:warehouseId/stock", authenticateToken, authorizeViewer, getWarehouseProducts);
// Update stock levels for a warehouse
router.put("/:warehouseId/stock", authenticateToken, authorizeSuperAdmin, updateWarehouseStock);

// Reserve stock for orders or allocations
router.post("/:warehouseId/reserve", authenticateToken, authorizeSuperAdmin, reserveStock);

export default router;