"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeViewer = exports.authorizeManager = exports.authorizeAdmin = exports.authorizeSuperAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return;
    }
};
exports.authenticateToken = authenticateToken;
// 🔹 Middleware to check if user is Super Admin (roleId = 1)
const authorizeSuperAdmin = (req, res, next) => {
    if (req.user.roleId !== 1) {
        res.status(403).json({ message: "Forbidden: Only super admins can perform this action" });
        return;
    }
    next();
};
exports.authorizeSuperAdmin = authorizeSuperAdmin;
// 🔹 Middleware to check if user is Admin or higher (roleId = 1 or 2)
const authorizeAdmin = (req, res, next) => {
    if (![1, 2].includes(req.user.roleId)) {
        res.status(403).json({ message: "Forbidden: Only admins and super admins can perform this action" });
        return;
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
// 🔹 Middleware to check if user is Manager or higher (roleId = 1, 2, or 3)
const authorizeManager = (req, res, next) => {
    if (![1, 2, 3].includes(req.user.roleId)) {
        res.status(403).json({ message: "Forbidden: Only managers, admins, and super admins can perform this action" });
        return;
    }
    next();
};
exports.authorizeManager = authorizeManager;
// 🔹 Middleware to check if user is Viewer or higher (roleId = 1, 2, 3, or 4)
const authorizeViewer = (req, res, next) => {
    if (![1, 2, 3, 4].includes(req.user.roleId)) {
        res.status(403).json({ message: "Forbidden: Only authorized users can perform this action" });
        return;
    }
    next();
};
exports.authorizeViewer = authorizeViewer;
