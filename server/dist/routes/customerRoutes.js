"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, customerController_1.createCustomer);
router.get("/", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, customerController_1.getCustomers);
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, customerController_1.updateCustomer);
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, customerController_1.deleteCustomer);
exports.default = router;
