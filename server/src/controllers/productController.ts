import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { console } from "inspector";

const prisma = new PrismaClient();

// Create Item (Only Super Admin or Organization Admin)
export const createItem = async (req: Request, res: Response): Promise<void> => {
    const userRole = (req as any).user.role;
    if (userRole === "viewer") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create items" });
        return;
    }

    try {
        const { organizationId, name, itemCode, description, searchDescription, baseUom, secondaryUom, qtyPerUom,
            salesUom, purchaseUom, type, inventoryGroup, itemCategoryCode, parentCategory, productType,
            hsnSacCode, gstCredit, make, color, size, blocked, unitPrice, costingMethod, costPrice,
            commissionEligible, commissionFactor, businessUnitName, barcode, reorderLevel, leadTimeDays,
            safetyStockLevel, expirationDate, isPerishable } = req.body;

        const existingOrg = await prisma.organization.findUnique({
            where: { id: organizationId }
        });
        if (!existingOrg) {
            res.status(400).json({ message: "Invalid organization ID" });
            return;
        }
        const userId = (req as any).user.id;

        if (!itemCode) {
            res.status(400).json({ message: "Item code is required" });
            return;
        }
        const existingItem = await prisma.item.findUnique({ where: { itemCode } });
        if (existingItem) {
            res.status(400).json({ message: "Item with this code already exists" });
            return;
        }
        const newItem = await prisma.item.create({
            data: {
                organization: {
                    connect: { id: organizationId }
                },
                name,
                itemCode,
                description,
                searchDescription,
                baseUom,
                secondaryUom,
                qtyPerUom,
                salesUom,
                purchaseUom,
                type,
                inventoryGroup,
                itemCategoryCode,
                parentCategory,
                productType,
                hsnSacCode,
                gstCredit,
                make,
                color,
                size,
                blocked,
                unitPrice,
                costingMethod,
                costPrice,
                commissionEligible,
                commissionFactor,
                businessUnitName,
                leadTimeDays,
                barcode,
                reorderLevel,
                safetyStockLevel,
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                isPerishable,
                createdBy: Number(userId),
                updatedBy: Number(userId)
            },
        });
        res.status(201).json({ message: "Item created successfully", item: newItem });
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Items
export const getItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = (req as any).user.role;
        const userOrgId = (req as any).user.organizationId;
        let { organizationId, search, category } = req.query;

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
                { itemCode: { contains: search as string, mode: "insensitive" } },
                { description: { contains: search as string, mode: "insensitive" } }
            ];
        }
        if (category) {
            filters.itemCategoryCode = category as string;
        }
        const items = await prisma.item.findMany({ where: filters });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Item by ID
export const getItemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userOrgId = (req as any).user.organizationId;
        const userRole = (req as any).user.role;

        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }

        // Super admins can access any item; admins can only access items from their org
        const item = await prisma.item.findUnique({ where: { id: Number(id) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }

        if (userRole === "admin" && item.organizationId !== userOrgId) {
            res.status(403).json({ message: "Forbidden: You do not have permission to view this item" });
            return;
        }

        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Item
export const updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userOrgId = (req as any).user.organizationId;
        const userRole = (req as any).user.role;

        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }

        // Get item and check if the user has access
        const item = await prisma.item.findUnique({ where: { id: Number(id) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }

        if (userRole === "admin" && item.organizationId !== userOrgId) {
            res.status(403).json({ message: "Forbidden: You do not have permission to update this item" });
            return;
        }

        const updatedItem = await prisma.item.update({
            where: { id: Number(id) },
            data: {
                ...req.body,
                updatedAt: new Date(),
            },
        });

        res.status(200).json({ message: "Item updated successfully", item: updatedItem });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Item
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userOrgId = (req as any).user.organizationId;
        const userRole = (req as any).user.role;

        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }

        const item = await prisma.item.findUnique({ where: { id: Number(id) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }

        if (userRole === "admin" && item.organizationId !== userOrgId) {
            res.status(403).json({ message: "Forbidden: You do not have permission to delete this item" });
            return;
        }

        await prisma.item.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
