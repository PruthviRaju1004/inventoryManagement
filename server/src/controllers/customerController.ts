import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Customer (Only Super Admin)
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { organizationId, name, customerCode, contactName, address, address2, city, state, country, zipCode,
            contactEmail, contactPhone, paymentTerms, currency, taxId } = req.body;
        const userId = (req as any).user.id;

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
                address,
                address2,
                city,
                state,
                country,
                zipCode,
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

// Get Customers (Admin, Manager, Viewer can view)
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = (req as any).user.roleId;
        const userOrgId = (req as any).user.organizationId;
        let { organizationId, search } = req.query;

        if (userRole === "admin") {
            organizationId = userOrgId;  // Admin can only access their own org's items
        } else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const filters: any = { organizationId: Number(organizationId) };
        if (search) {
            filters.OR = [
                { name: { contains: search as string, mode: "insensitive" } },
                { customerCode: { contains: search as string, mode: "insensitive" } }
            ];
        }
        const customers = await prisma.customer.findMany({
            where: filters,
        });

        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Customer (Admin, Manager can update)
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid customer ID" });
            return;
        }

        const { name, contactName, contactEmail, contactPhone, address, address2, city, state, country, zipCode,
             paymentTerms, currency, taxId } = req.body;
        const updatedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: { name, contactName, contactEmail, contactPhone, address, address2, city, state, country, zipCode, paymentTerms, currency, taxId },
        });
        res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Customer (Admin, Super Admin can delete)
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

// Get Customer by ID (Admin, Manager, Viewer can view)
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid customer ID" });
            return;
        }

        const customer = await prisma.customer.findUnique({
            where: { id: Number(id) },
        });

        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

