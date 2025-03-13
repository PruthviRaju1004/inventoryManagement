import express from "express";
import { sendEmail } from "../controllers/emailController";
import { authenticateToken } from "../middleware/auth"; // Ensure authentication

const router = express.Router();

router.post("/send", authenticateToken, sendEmail); 

export default router;
