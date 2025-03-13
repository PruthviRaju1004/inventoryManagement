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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, pdfBase64, fileName } = req.body;
        if (!email || !pdfBase64 || !fileName) {
            res.status(400).json({ message: "Missing required fields" });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail
                pass: process.env.GMAIL_PASS, // App Password (not your Gmail password)
            },
        });
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Your Purchase Order",
            text: "Please find the attached purchase order PDF.",
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
        console.error("❌ Error sending email:", error);
        res.status(500).json({ message: "Error sending email", error });
    }
});
exports.sendEmail = sendEmail;
