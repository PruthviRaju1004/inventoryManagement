import { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const WHATSAPP_API_URL = "https://graph.facebook.com/v19.0";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, subject, text, pdfBase64, fileName } = req.body;
        
        // Validate request body
        if (!email || !subject || !text || !pdfBase64 || !fileName) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        // Configure transporter with Gmail SMTP
        const transporter = nodemailer.createTransport({
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
            subject: subject,  // Use subject from request
            text: text,  // Use text from request
            attachments: [
                {
                    filename: fileName,
                    content: pdfBase64,
                    encoding: "base64",
                },
            ],
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email", error: (error as Error).message });
    }
};

export const sendWhatsAppText = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber, message } = req.body;
        
        if (!phoneNumber || !message) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const response = await axios.post(
            `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "text",
                text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        res.status(200).json({ message: "WhatsApp message sent!", response: response.data });

    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        res.status(500).json({ message: "Error sending WhatsApp message", error: (error as Error).message });
    }
};
