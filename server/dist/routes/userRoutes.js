"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/login", userController_1.login); // Super Admin Login
router.get("/me", auth_1.authenticateToken, userController_1.getCurrentUser); // Get Current User
router.post("/users", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, userController_1.createUser); // Create a new user (Super Admin only)
router.get("/users/organization/:organizationId", auth_1.authenticateToken, userController_1.getUsersByOrganization); // Get users by organization
router.put("/users/:userId/role", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, userController_1.updateUserRole); // Update user role (Super Admin only)
router.delete("/users/:userId", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, userController_1.deleteUser);
exports.default = router;
