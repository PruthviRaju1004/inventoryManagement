"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventoryReportsController_1 = require("../controllers/inventoryReportsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", auth_1.authenticateToken, auth_1.authorizeAdmin, inventoryReportsController_1.createInventoryReport);
router.get("/", auth_1.authenticateToken, auth_1.authorizeViewer, inventoryReportsController_1.getAllInventoryReports);
router.get("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, inventoryReportsController_1.getInventoryReportById);
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeManager, inventoryReportsController_1.updateInventoryReport);
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeAdmin, inventoryReportsController_1.deleteInventoryReport);
exports.default = router;
