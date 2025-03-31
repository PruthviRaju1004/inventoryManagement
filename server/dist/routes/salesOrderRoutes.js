"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salesOderController_1 = require("../controllers/salesOderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.authenticateToken, auth_1.authorizeAdmin, salesOderController_1.createSalesOrder); // Only admins can create
router.get("/", auth_1.authenticateToken, auth_1.authorizeViewer, salesOderController_1.getAllSalesOrders); // Admins & Super Admins can fetch
router.get("/summary", auth_1.authenticateToken, auth_1.authorizeViewer, salesOderController_1.getSalesSummary);
router.get("/:salesOrderId", auth_1.authenticateToken, salesOderController_1.getSalesOrderById); // Admins & Super Admins can fetch
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeManager, salesOderController_1.updateSalesOrder);
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeAdmin, salesOderController_1.deleteSalesOrder); // Only super_admin can delete
// router.put("/:id/receive", authenticateToken, authorizeSuperAdmin, receivePurchaseOrder);
exports.default = router;
