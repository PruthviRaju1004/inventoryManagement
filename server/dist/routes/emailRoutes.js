"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailController_1 = require("../controllers/emailController");
const auth_1 = require("../middleware/auth"); // Ensure authentication
const router = express_1.default.Router();
router.post("/send", auth_1.authenticateToken, emailController_1.sendEmail);
router.post("/send-whatsapp-text", auth_1.authenticateToken, emailController_1.sendWhatsAppText);
exports.default = router;
