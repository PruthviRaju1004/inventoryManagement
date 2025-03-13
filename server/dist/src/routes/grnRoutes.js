"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grnController_1 = require("../controllers/grnController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.authenticateToken, grnController_1.createGRN); // Only admins can create
router.get("/", auth_1.authenticateToken, grnController_1.getGRNs); // Admins & Super Admins can fetch
router.get("/:id", auth_1.authenticateToken, grnController_1.getGRNById); // Admins & Super Admins can fetch
router.put("/:id", auth_1.authenticateToken, grnController_1.updateGRN);
router.delete("/:grnId", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, grnController_1.deleteGRN); // Only super_admin can delete
// router.put("/:id/receive", authenticateToken, receivePurchaseOrder);
exports.default = router;
