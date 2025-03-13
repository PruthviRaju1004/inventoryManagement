import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Store this securely

// Login API for Super Admin
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user || user.roleId !== 1) {  // Ensure the user is a Super Admin (roleId = 1)
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: "super_admin" },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: "super_admin",
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Current User API
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId; // Extracted from JWT

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, roleId: true, firstName: true, lastName: true }, // Return only required fields
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


