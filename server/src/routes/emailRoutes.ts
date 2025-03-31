import express from "express";
import { sendEmail, sendWhatsAppText } from "../controllers/emailController";
import { authenticateToken } from "../middleware/auth"; // Ensure authentication

const router = express.Router();

router.post("/send", authenticateToken, sendEmail); 
router.post("/send-whatsapp-text", authenticateToken, sendWhatsAppText);

export default router;
