"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppText = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const WHATSAPP_API_URL = "https://graph.facebook.com/v19.0";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, subject, text, pdfBase64, fileName } = req.body;
        // Validate request body
        if (!email || !subject || !text || !pdfBase64 || !fileName) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        // Configure transporter with Gmail SMTP
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        // Email options
        const mailOptions = {
            from: `"Your Business Name" <${process.env.GMAIL_USER}>`, // Update "Your Business Name" if needed
            to: email,
            subject: subject, // Use subject from request
            text: text, // Use text from request
            attachments: [
                {
                    filename: fileName,
                    content: pdfBase64,
                    encoding: "base64",
                },
            ],
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email", error: error.message });
    }
});
exports.sendEmail = sendEmail;
const sendWhatsAppText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, message } = req.body;
        if (!phoneNumber || !message) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const response = yield axios_1.default.post(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "text",
            text: { body: message },
        }, {
            headers: {
                Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        res.status(200).json({ message: "WhatsApp message sent!", response: response.data });
    }
    catch (error) {
        console.error("Error sending WhatsApp message:", error);
        res.status(500).json({ message: "Error sending WhatsApp message", error: error.message });
    }
});
exports.sendWhatsAppText = sendWhatsAppText;
