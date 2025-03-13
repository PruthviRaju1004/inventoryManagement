import express from "express";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController";
import { authenticateToken, authorizeSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken, authorizeSuperAdmin, createCustomer);
router.get("/", authenticateToken, authorizeSuperAdmin, getCustomers);
router.put("/:id", authenticateToken, authorizeSuperAdmin, updateCustomer);
router.delete("/:id", authenticateToken, authorizeSuperAdmin, deleteCustomer);

export default router;
