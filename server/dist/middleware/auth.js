"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeViewer = exports.authorizeManager = exports.authorizeAdmin = exports.authorizeSuperAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const authenticateToken = (req, res, next) => {
    var _a;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        console.error("Decoded token:", decoded); // Debugging log
        req.user = {
            id: decoded.userId,
            role: decoded.role,
            organizationId: (_a = decoded.organizationId) !== null && _a !== void 0 ? _a : null // Explicitly set null if undefined
        };
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};
exports.authenticateToken = authenticateToken;
// 🔹 Super Admin Authorization
const authorizeSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can perform this action" });
        return;
    }
    next();
};
exports.authorizeSuperAdmin = authorizeSuperAdmin;
// 🔹 Admin Authorization
const authorizeAdmin = (req, res, next) => {
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
    }
    else {
        res.status(403).json({ message: "Forbidden: Only admins can perform this action" });
    }
};
exports.authorizeAdmin = authorizeAdmin;
// 🔹 Manager Authorization
const authorizeManager = (req, res, next) => {
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
    }
    else {
        res.status(403).json({ message: "Forbidden: Only managers can perform this action" });
    }
};
exports.authorizeManager = authorizeManager;
// 🔹 Viewer Authorization
const authorizeViewer = (req, res, next) => {
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
exports.authorizeViewer = authorizeViewer;
