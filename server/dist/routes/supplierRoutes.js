"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplierController_1 = require("../controllers/supplierController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, supplierController_1.createSupplier);
router.get("/", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, supplierController_1.getSuppliers); // Allow both super_admin & admin
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, supplierController_1.updateSupplier);
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, supplierController_1.deleteSupplier);
// Supplier item routes (Products linked to a supplier)
router.post("/:supplierId/items", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, supplierController_1.linkProductsToSupplier);
router.get("/:supplierId/items", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, supplierController_1.getSupplierItems);
router.put("/:supplierId/items/:itemId", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, supplierController_1.updateSupplierItem);
router.delete("/:supplierId/items/:itemId", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, supplierController_1.removeSupplierItem);
router.get("/:supplierId/purchase-orders", supplierController_1.getPurchaseOrdersForSupplier);
exports.default = router;
