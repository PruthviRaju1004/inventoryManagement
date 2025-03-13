import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as any;
        // console.log("Decoded Token:", decoded); // Add this log
        (req as any).user = decoded; // Attach decoded user data to request object
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return;
    }
};

// Middleware to allow only Super Admin (roleId = 1)
// export const authorizeSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
//     const user = (req as any).user;
//     if (!user || user.role !== "super_admin") { 
//         res.status(403).json({ message: "Forbidden: Super Admin access only" });
//         return;
//     }
//     next();
// };

export const authorizeSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
    // console.log("User Role:", (req as any).user.role); // Debugging log
    if ((req as any).user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can perform this action" });
        return;
    }
    next();
};