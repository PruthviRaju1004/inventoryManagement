import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Customer (Only Super Admin or Organization Admin)
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    const userRole = (req as any).user.role;
    if (userRole !== "super_admin" && userRole !== "admin") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create customers" });
        return;
    }

    try {
        console.log("Request Body:", req.body);
        const { organizationId, name, customerCode, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId } = req.body;
        const userId = (req as any).user.userId;

        if (!customerCode) {
            res.status(400).json({ message: "Customer code is required" });
            return;
        }

        const existingCustomer = await prisma.customer.findUnique({ where: { customerCode } });
        if (existingCustomer) {
            res.status(400).json({ message: "Customer already exists" });
            return;
        }

        const newCustomer = await prisma.customer.create({
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
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Customers
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = (req as any).user.role;
        const userOrgId = (req as any).user.organizationId;
        let { organizationId } = req.query;

        if (userRole !== "super_admin") {
            organizationId = userOrgId;
        } else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }

        const customers = await prisma.customer.findMany({ where: { organizationId: Number(organizationId) } });
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Customer
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid customer ID" });
            return;
        }

        const { name, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId } = req.body;
        const updatedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: { name, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId },
        });

        res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Customer
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid customer ID" });
            return;
        }

        const existingCustomer = await prisma.customer.findUnique({ where: { id: Number(id) } });
        if (!existingCustomer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }

        await prisma.customer.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
