"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, productController_1.createItem);
router.get("/", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, productController_1.getItems); // Allow both super_admin & admin
router.get("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, productController_1.getItemById);
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, productController_1.updateItem);
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, productController_1.deleteItem);
exports.default = router;
