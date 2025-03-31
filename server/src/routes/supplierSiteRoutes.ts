import express from "express";
import {
  createSupplierSite,
  getSupplierSites,
  updateSupplierSite,
  deleteSupplierSite,
} from "../controllers/supplierSiteController";
import { authenticateToken, authorizeAdmin, authorizeManager, authorizeViewer, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/:supplierId/sites", authenticateToken, authorizeAdmin, createSupplierSite);
router.get("/:supplierId/sites", authenticateToken, authorizeViewer, getSupplierSites);  // Allow both super_admin & admin
router.put("/:supplierId/sites/:siteId", authenticateToken, authorizeManager, updateSupplierSite);
router.delete("/:supplierId/sites/:siteId", authenticateToken, authorizeAdmin, deleteSupplierSite);

export default router;