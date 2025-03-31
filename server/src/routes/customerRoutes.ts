import express from "express";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById
} from "../controllers/customerController";
import { authenticateToken, authorizeAdmin, authorizeManager, authorizeViewer } from "../middleware/auth";

const router = express.Router();

// Route to create a customer
router.post("/create", authenticateToken, authorizeAdmin, createCustomer);

// Route to get customers (Admin, Manager, Viewer can view based on permissions)
router.get("/", authenticateToken, authorizeViewer, getCustomers);

// Route to update a customer (Admin, Manager can update based on permissions)
router.put("/:id", authenticateToken, authorizeManager, updateCustomer);

// Route to delete a customer (Only Super Admin or Admin can delete based on permissions)
router.delete("/:id", authenticateToken, authorizeAdmin, deleteCustomer);

router.get("/:id", authenticateToken, authorizeViewer, getCustomerById);

export default router;
