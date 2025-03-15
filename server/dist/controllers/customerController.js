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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomers = exports.createCustomer = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create Customer (Only Super Admin or Organization Admin)
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = req.user.role;
    if (userRole !== "super_admin" && userRole !== "admin") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create customers" });
        return;
    }
    try {
        console.log("Request Body:", req.body);
        const { organizationId, name, customerCode, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId } = req.body;
        const userId = req.user.userId;
        if (!customerCode) {
            res.status(400).json({ message: "Customer code is required" });
            return;
        }
        const existingCustomer = yield prisma.customer.findUnique({ where: { customerCode } });
        if (existingCustomer) {
            res.status(400).json({ message: "Customer already exists" });
            return;
        }
        const newCustomer = yield prisma.customer.create({
            data: {
                organizationId,
                name,
                customerCode,
                contactName,
                contactEmail,
                contactPhone,
                paymentTerms,
                currency,
                taxId,
                createdBy: Number(userId),
                updatedBy: Number(userId),
            },
        });
        res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
    }
    catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createCustomer = createCustomer;
// Get Customers
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        const userOrgId = req.user.organizationId;
        let { organizationId } = req.query;
        if (userRole !== "super_admin") {
            organizationId = userOrgId;
        }
        else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const customers = yield prisma.customer.findMany({ where: { organizationId: Number(organizationId) } });
        res.status(200).json(customers);
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCustomers = getCustomers;
// Update Customer
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid customer ID" });
            return;
        }
        const { name, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId } = req.body;
        const updatedCustomer = yield prisma.customer.update({
            where: { id: Number(id) },
            data: { name, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId },
        });
        res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
    }
    catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateCustomer = updateCustomer;
// Delete Customer
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid customer ID" });
            return;
        }
        const existingCustomer = yield prisma.customer.findUnique({ where: { id: Number(id) } });
        if (!existingCustomer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        yield prisma.customer.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Customer deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteCustomer = deleteCustomer;
