"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeSuperAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        // console.log("Decoded Token:", decoded); // Add this log
        req.user = decoded; // Attach decoded user data to request object
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return;
    }
};
exports.authenticateToken = authenticateToken;
// Middleware to allow only Super Admin (roleId = 1)
// export const authorizeSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
//     const user = (req as any).user;
//     if (!user || user.role !== "super_admin") { 
//         res.status(403).json({ message: "Forbidden: Super Admin access only" });
//         return;
//     }
//     next();
// };
const authorizeSuperAdmin = (req, res, next) => {
    // console.log("User Role:", (req as any).user.role); // Debugging log
    if (req.user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can perform this action" });
        return;
    }
    next();
};
exports.authorizeSuperAdmin = authorizeSuperAdmin;
