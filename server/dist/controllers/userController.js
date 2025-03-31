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
exports.deleteUser = exports.updateUserRole = exports.getUsersByOrganization = exports.createUser = exports.getCurrentUser = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Store this securely
// Login API for Super Admin
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) { // Ensure the user is a Super Admin (roleId = 1)
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Check if the password is correct
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: "super_admin" }, SECRET_KEY, { expiresIn: "12h" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: "super_admin",
            },
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
// Get Current User API
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        console.log(userId);
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ id: user.id, email: user.email, roleId: user.roleId, roleName: user.role.name });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.getCurrentUser = getCurrentUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, username, password, roleId, organizationId } = req.body;
        const createdBy = req.user.userId; // Get logged-in user ID
        // Only Super Admin or Org Admin can create users
        const userRole = req.user.role;
        if (userRole !== "super_admin" && userRole !== "admin") {
            res.status(403).json({ message: "Forbidden: Only super admins or admins can create users" });
            return;
        }
        // Check if user already exists
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        const newUser = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                username,
                passwordHash: hashedPassword,
                roleId,
                organizationId,
                createdBy,
                updatedBy: createdBy,
            },
        });
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createUser = createUser;
const getUsersByOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        const userOrgId = req.user.organizationId;
        let { organizationId } = req.query;
        // Admins can only access their own org's users
        if (userRole !== "super_admin") {
            organizationId = userOrgId;
        }
        else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const users = yield prisma.user.findMany({
            where: { organizationId: Number(organizationId) },
            include: { role: true }, // Include role info
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUsersByOrganization = getUsersByOrganization;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { roleId } = req.body;
        const userRole = req.user.role;
        if (userRole !== "super_admin" && userRole !== "admin") {
            res.status(403).json({ message: "Forbidden: Only super admins or admins can update roles" });
            return;
        }
        const updatedUser = yield prisma.user.update({
            where: { id: Number(id) },
            data: { roleId },
        });
        res.status(200).json({ message: "User role updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateUserRole = updateUserRole;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userRole = req.user.role;
        if (userRole !== "super_admin" && userRole !== "admin") {
            res.status(403).json({ message: "Forbidden: Only super admins or admins can delete users" });
            return;
        }
        yield prisma.user.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteUser = deleteUser;
