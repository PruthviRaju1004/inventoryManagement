import { Request, Response } from "express";
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, pdfBase64, fileName } = req.body;

        if (!email || !pdfBase64 || !fileName) {
            res.status(400).json({ message: "Missing required fields" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,  // Your Gmail
                pass: process.env.GMAIL_PASS,  // App Password (not your Gmail password)
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

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });

    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ message: "Error sending email", error });
    }
};
