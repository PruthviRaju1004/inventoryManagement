import express from "express";
import {
  createOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organizationController";
import { authenticateToken, authorizeSuperAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload"; // Import file upload middleware

const router = express.Router();

router.post("/create", authenticateToken, authorizeSuperAdmin, upload.array("legalProofs", 5), createOrganization);
router.get("/", authenticateToken, authorizeSuperAdmin, getOrganizations);
router.put("/:id", authenticateToken, authorizeSuperAdmin, upload.array("legalProofs", 5), updateOrganization);
router.delete("/:id", authenticateToken, authorizeSuperAdmin, deleteOrganization);

export default router;
