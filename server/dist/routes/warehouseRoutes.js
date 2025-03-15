"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const warehouseController_1 = require("../controllers/warehouseController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, warehouseController_1.createWarehouse);
router.get("/", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, warehouseController_1.getWarehouses); // Allow both super_admin & admin
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, warehouseController_1.updateWarehouse);
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, warehouseController_1.deleteWarehouse);
router.post("/:warehouseId/items", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, warehouseController_1.addItemToWarehouse);
// Get stock levels for a warehouse
router.get("/:warehouseId/stock", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, warehouseController_1.getWarehouseStock);
// Update stock levels for a warehouse
router.put("/:warehouseId/stock", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, warehouseController_1.updateWarehouseStock);
// Reserve stock for orders or allocations
router.post("/:warehouseId/reserve", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, warehouseController_1.reserveStock);
exports.default = router;
