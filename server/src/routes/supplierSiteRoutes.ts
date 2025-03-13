import express from "express";
import {
  createSupplierSite,
  getSupplierSites,
  updateSupplierSite,
  deleteSupplierSite,
} from "../controllers/supplierSiteController";
import { authenticateToken, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/:supplierId/sites", authenticateToken, authorizeSuperAdmin, createSupplierSite);
router.get("/:supplierId/sites", authenticateToken, authorizeSuperAdmin, getSupplierSites);  // Allow both super_admin & admin
router.put("/:supplierId/sites/:siteId", authenticateToken, authorizeSuperAdmin, updateSupplierSite);
router.delete("/:supplierId/sites/:siteId", authenticateToken, authorizeSuperAdmin, deleteSupplierSite);

export default router;