"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Route to create a customer
router.post("/create", auth_1.authenticateToken, auth_1.authorizeAdmin, customerController_1.createCustomer);
// Route to get customers (Admin, Manager, Viewer can view based on permissions)
router.get("/", auth_1.authenticateToken, auth_1.authorizeViewer, customerController_1.getCustomers);
// Route to update a customer (Admin, Manager can update based on permissions)
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeManager, customerController_1.updateCustomer);
// Route to delete a customer (Only Super Admin or Admin can delete based on permissions)
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeAdmin, customerController_1.deleteCustomer);
router.get("/:id", auth_1.authenticateToken, auth_1.authorizeViewer, customerController_1.getCustomerById);
exports.default = router;
