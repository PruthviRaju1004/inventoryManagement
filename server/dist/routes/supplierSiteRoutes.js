"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplierSiteController_1 = require("../controllers/supplierSiteController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/:supplierId/sites", auth_1.authenticateToken, auth_1.authorizeAdmin, supplierSiteController_1.createSupplierSite);
router.get("/:supplierId/sites", auth_1.authenticateToken, auth_1.authorizeViewer, supplierSiteController_1.getSupplierSites); // Allow both super_admin & admin
router.put("/:supplierId/sites/:siteId", auth_1.authenticateToken, auth_1.authorizeManager, supplierSiteController_1.updateSupplierSite);
router.delete("/:supplierId/sites/:siteId", auth_1.authenticateToken, auth_1.authorizeAdmin, supplierSiteController_1.deleteSupplierSite);
exports.default = router;
