import express from "express";
import { login, getCurrentUser} from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/login", login); // Super Admin Login
router.get("/me", authenticateToken, getCurrentUser); // Get Current User

export default router;
