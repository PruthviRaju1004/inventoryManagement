import express from "express";
import { login, getCurrentUser, createUser, 
    getUsersByOrganization, 
    updateUserRole,
    forgotPassword,
    resetPassword,
    verifyRegistration,
    deleteUser } from "../controllers/userController";
import { authenticateToken, authorizeSuperAdmin, authorizeViewer, authorizeAdmin, authorizeManager } from "../middleware/auth";

const router = express.Router();

router.post("/login", login); // Super Admin Login
router.get("/me", authenticateToken, getCurrentUser); // Get Current User
router.post("/create", authenticateToken, authorizeAdmin, createUser); // Create a new user (Super Admin only)
router.get("/", authenticateToken, authorizeViewer, getUsersByOrganization); // Get users by organization
router.put("/:id", authenticateToken, authorizeManager, updateUserRole); // Update user role (Super Admin only)
router.delete("/:id", authenticateToken, authorizeAdmin, deleteUser);
router.post("/forgot-password", forgotPassword); // Request a password reset link
router.post("/reset-password", resetPassword); // Reset user password with reset token
router.post("/verify-registration", verifyRegistration);  // Handle registration verification

export default router;
