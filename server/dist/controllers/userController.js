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
exports.deleteUser = exports.updateUserRole = exports.getUsersByOrganization = exports.verifyRegistration = exports.resetPassword = exports.forgotPassword = exports.completeRegistration = exports.createUser = exports.getCurrentUser = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
// Login API for Super Admin
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const role = ((_a = user.role) === null || _a === void 0 ? void 0 : _a.name) || "viewer";
        const organizationId = user.organizationId || null;
        console.log("organizationId", organizationId);
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role, organizationId }, SECRET_KEY, { expiresIn: "12h" });
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
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
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
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
    });
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, username, roleId, organizationId } = req.body;
        const createdBy = req.user.id;
        const userRole = req.user.role;
        if (userRole === "viewer") {
            res.status(403).json({ message: "Forbidden: Only super admins or admins can create users" });
            return;
        }
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = yield prisma.user.create({
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
        yield sendEmail(email, "Complete Your Registration", `Click the link to set your password: ${registrationLink}`);
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createUser = createUser;
const completeRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const user = yield prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hashedPassword, verificationToken: null },
        });
        res.status(200).json({ message: "Registration completed. You can now log in." });
    }
    catch (error) {
        console.error("Error completing registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.completeRegistration = completeRegistration;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        yield prisma.user.update({
            where: { email },
            data: { resetToken },
        });
        const resetLink = `https://yourfrontend.com/reset-password?token=${resetToken}`;
        yield sendEmail(email, "Reset Your Password", `Click the link to reset your password: ${resetLink}`);
        res.status(200).json({ message: "Password reset link sent to your email." });
    }
    catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const user = yield prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hashedPassword, verificationToken: null },
        });
        res.status(200).json({ message: "Password successfully updated." });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.resetPassword = resetPassword;
const verifyRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const user = yield prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hashedPassword, verificationToken: null },
        });
        res.status(200).json({ message: "Registration completed successfully, you can now log in." });
    }
    catch (error) {
        console.error("Error completing registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyRegistration = verifyRegistration;
const getUsersByOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        const userOrgId = req.user.organizationId;
        let { organizationId } = req.query;
        if (userRole === "admin") {
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
