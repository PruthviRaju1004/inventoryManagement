import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

interface AuthRequest extends Request {
    user?: { id: number; role: string; organizationId: number | null | undefined };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; role: string; organizationId?: number };
        console.log("Decoded token:", decoded); // Debugging log

        req.user = { 
            id: decoded.userId, 
            role: decoded.role, 
            organizationId: decoded.organizationId ?? null // Explicitly set null if undefined
        };
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

// 🔹 Super Admin Authorization
export const authorizeSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can perform this action" });
        return;
    }
    next();
};

// 🔹 Admin Authorization
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
    }

    if (req.user.role === "super_admin") {
        next(); // Super Admin has full access
        return;
    }

    if (req.user.role === "admin") {
        if (!req.user.organizationId) {
            res.status(403).json({ message: "Forbidden: Admin must belong to an organization" });
            return;
        }
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Only admins can perform this action" });
    }
};

// 🔹 Manager Authorization
export const authorizeManager = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
    }

    if (req.user.role === "super_admin" || req.user.role === "admin") {
        next(); // Super Admin has full access
        return;
    }

    if (req.user.role === "manager") {
        if (!req.user.organizationId) {
            res.status(403).json({ message: "Forbidden: Manager must belong to an organization" });
            return;
        }
        if (req.method === "DELETE") {
            res.status(403).json({ message: "Forbidden: Managers cannot delete records" });
            return;
        }
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Only managers can perform this action" });
    }
};

// 🔹 Viewer Authorization
export const authorizeViewer = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
    }

    if (req.user.role === "super_admin") {
        next(); // Super Admin has full access
        return;
    }

    if (!["admin", "manager", "viewer"].includes(req.user.role)) {
        res.status(403).json({ message: "Forbidden: Only authorized users can perform this action" });
        return;
    }

    if (req.method !== "GET") {
        res.status(403).json({ message: "Forbidden: Viewers can only view data" });
        return;
    }

    next();
};
