import express from "express";
import {
    createWarehouse,
    getWarehouses,
    updateWarehouse,
    deleteWarehouse,
    addItemToWarehouse,
    getWarehouseStock,
    updateWarehouseStock,
    reserveStock
} from "../controllers/warehouseController";
import { authenticateToken, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeSuperAdmin, createWarehouse);
router.get("/", authenticateToken, authorizeSuperAdmin, getWarehouses);  // Allow both super_admin & admin
router.put("/:id", authenticateToken, authorizeSuperAdmin, updateWarehouse);
router.delete("/:id", authenticateToken, authorizeSuperAdmin, deleteWarehouse);
router.post("/:warehouseId/items", authenticateToken, authorizeSuperAdmin, addItemToWarehouse);

// Get stock levels for a warehouse
router.get("/:warehouseId/stock", authenticateToken, authorizeSuperAdmin, getWarehouseStock);
// Update stock levels for a warehouse
router.put("/:warehouseId/stock", authenticateToken, authorizeSuperAdmin, updateWarehouseStock);

// Reserve stock for orders or allocations
router.post("/:warehouseId/reserve", authenticateToken, authorizeSuperAdmin, reserveStock);

export default router;