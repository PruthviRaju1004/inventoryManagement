import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Login API for Super Admin
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const role = user.role?.name || "viewer";
        const organizationId = user.organizationId || null;
        console.log("organizationId", organizationId);
        const token = jwt.sign(
            { userId: user.id, role, organizationId },
            SECRET_KEY,
            { expiresIn: "12h" }
        );
        console.log("toekn", token);
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role,
                organizationId
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ id: user.id, email: user.email, roleId: user.roleId, roleName: user.role.name });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendEmail = async (to: string, subject: string, text: string) => {
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
    });
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, phoneNumber, username, roleId, organizationId } = req.body;
        const createdBy = (req as any).user.id;
        const userRole = (req as any).user.role;
        if (userRole === "viewer") {
            res.status(403).json({ message: "Forbidden: Only super admins or admins can create users" });
            return;
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const verificationToken = crypto.randomBytes(32).toString("hex");
        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                username,
                // passwordHash: hashedPassword,
                roleId,
                organizationId,
                createdBy,
                updatedBy: createdBy,
                verificationToken
            },
        });
        const registrationLink = `https://inventory-management-woad-five.vercel.app/register?token=${verificationToken}`;
        // const registrationLink = `http://localhost:3000/register?token=${verificationToken}`;
        await sendEmail(email, "Complete Your Registration", `Click the link to set your password: ${registrationLink}`);
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const completeRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hashedPassword, verificationToken: null },
        });
        res.status(200).json({ message: "Registration completed. You can now log in." });
    } catch (error) {
        console.error("Error completing registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        await prisma.user.update({
            where: { email },
            data: { resetToken },
        });
        const resetLink = `https://yourfrontend.com/reset-password?token=${resetToken}`;
        await sendEmail(email, "Reset Your Password", `Click the link to reset your password: ${resetLink}`);
        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hashedPassword, verificationToken: null },
        });
        res.status(200).json({ message: "Password successfully updated." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hashedPassword, verificationToken: null },
        });
        res.status(200).json({ message: "Registration completed successfully, you can now log in." });
    } catch (error) {
        console.error("Error completing registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUsersByOrganization = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = (req as any).user.role;
        const userOrgId = (req as any).user.organizationId;
        let { organizationId } = req.query;
        if (userRole === "admin") {
            organizationId = userOrgId;
        } else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const users = await prisma.user.findMany({
            where: { organizationId: Number(organizationId) },
            include: { role: true }, // Include role info
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;
        const userRole = (req as any).user.role;
        if (userRole !== "super_admin" && userRole !== "admin") {
            res.status(403).json({ message: "Forbidden: Only super admins or admins can update roles" });
            return;
        }
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { roleId },
        });
        res.status(200).json({ message: "User role updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userRole = (req as any).user.role;
        if (userRole !== "super_admin" && userRole !== "admin") {
            res.status(403).json({ message: "Forbidden: Only super admins or admins can delete users" });
            return;
        }
        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


