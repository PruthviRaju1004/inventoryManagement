"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchaseOrderController_1 = require("../controllers/purchaseOrderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.authenticateToken, purchaseOrderController_1.createPurchaseOrder); // Only admins can create
router.get("/", auth_1.authenticateToken, purchaseOrderController_1.getPurchaseOrders); // Admins & Super Admins can fetch
router.get("/:purchaseOrderId", auth_1.authenticateToken, purchaseOrderController_1.getPurchaseOrderById); // Admins & Super Admins can fetch
router.put("/:id", auth_1.authenticateToken, purchaseOrderController_1.updatePurchaseOrder);
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, purchaseOrderController_1.deletePurchaseOrder); // Only super_admin can delete
router.put("/:id/receive", auth_1.authenticateToken, purchaseOrderController_1.receivePurchaseOrder);
exports.default = router;
