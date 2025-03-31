"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth"); // Added authorizeAdmin
const router = express_1.default.Router();
// Middleware to check if the user is either super admin or admin of the organization
router.post("/create", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, productController_1.createItem); // Only Super Admin allowed to create items
router.get("/", auth_1.authenticateToken, auth_1.authorizeViewer, productController_1.getItems); // Both Super Admin & Admin allowed to get items
router.get("/:id", auth_1.authenticateToken, productController_1.getItemById); // Both Super Admin & Admin allowed to get item by ID
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeManager, productController_1.updateItem); // Both Super Admin & Admin allowed to update items
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeAdmin, productController_1.deleteItem); // Both Super Admin & Admin allowed to delete items
exports.default = router;
