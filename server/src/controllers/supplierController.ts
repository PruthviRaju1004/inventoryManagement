import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Supplier (Only Super Admin or Organization Admin)
export const createSupplier = async (req: Request, res: Response): Promise<void> => {
    const userRole = (req as any).user.role;
    if (userRole === "viewer") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create suppliers" });
        return;
    }

    try {
        const { organizationId, name, supplierCode, contactName, contactEmail, contactPhone,
            address, address2, city, country, zipCode, paymentTerms, currency, taxId } = req.body;
        const userId = (req as any).user.id;
        if (!supplierCode) {
            res.status(400).json({ message: "Supplier code is required" });
            return;
        }
        const existingSupplier = await prisma.supplier.findUnique({ where: { supplierCode } });
        if (existingSupplier) {
            res.status(400).json({ message: "Supplier already exists" });
            return;
        }
        const newSupplier = await prisma.supplier.create({
            data: {
                organizationId,
                name,
                supplierCode,
                contactName,
                contactEmail,
                contactPhone,
                address,
                address2,
                city,
                country,
                zipCode,
                paymentTerms,
                currency,
                taxId,
                createdBy: Number(userId),
                updatedBy: Number(userId),
            },
        });

        res.status(201).json({ message: "Supplier created successfully", supplier: newSupplier });
    } catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = (req as any).user.role;
        const userOrgId = (req as any).user.organizationId;
        let { organizationId, search } = req.query;

        // If the user is not a super_admin, restrict them to their own organization
        if (userRole !== "super_admin") {
            organizationId = userOrgId;
        } else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const filters: any = { organizationId: Number(organizationId) };
        if (search) {
            filters.OR = [
                { name: { contains: search as string, mode: "insensitive" } },
                { supplierCode: { contains: search as string, mode: "insensitive" } }
            ];
        }
        const suppliers = await prisma.supplier.findMany({ where: filters, orderBy: { name: "asc" } });
        res.status(200).json(suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid supplier ID" });
            return;
        }

        const { name, contactName, contactEmail, contactPhone, address, address2, city, country, zipCode,
            paymentTerms, currency, taxId } = req.body;
        const updatedSupplier = await prisma.supplier.update({
            where: { id: Number(id) },
            data: { name, contactName, contactEmail, contactPhone, address, address2, city, country, zipCode, paymentTerms, currency, taxId },
        });
        res.status(200).json({ message: "Supplier updated successfully", supplier: updatedSupplier });
    } catch (error) {
        console.error("Error updating supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid supplier ID" });
            return;
        }

        // Check if supplier exists
        const existingSupplier = await prisma.supplier.findUnique({ where: { id: Number(id) } });
        if (!existingSupplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }

        await prisma.supplier.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Link Products to a Supplier
export const linkProductsToSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supplierId } = req.params;
        const userId = (req as any).user.id;
        const { itemId, supply_quantity, supply_price, effective_date, is_preferred, created_by } = req.body;

        if (!supplierId || !itemId || !supply_price || !supply_quantity) {
            res.status(400).json({ message: "Invalid request data. Missing required fields." });
            return;
        }

        const supplier = await prisma.supplier.findUnique({ where: { id: Number(supplierId) } });
        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }

        const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }

        const stock = await prisma.supplierItem.upsert({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
            update: {
                supply_price: parseFloat(supply_price),
                supply_quantity: parseFloat(supply_quantity),
                effective_date: new Date(effective_date),
                is_preferred: is_preferred ?? false,
                updated_by: Number(userId),
                updated_date: new Date(),
            },
            create: {
                supplierId: Number(supplierId),
                itemId: Number(itemId),
                supply_price: parseFloat(supply_price),
                supply_quantity: parseFloat(supply_quantity),
                effective_date: new Date(effective_date),
                is_preferred: is_preferred ?? false,
                created_by: Number(userId),
                created_date: new Date(),
                updated_by: Number(userId),
                updated_date: new Date(),
            },
        });

        res.status(201).json({ message: "Item linked to supplier successfully", stock });
    } catch (error) {
        console.error("Error linking item to supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Products Linked to a Supplier
export const getSupplierItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supplierId } = req.params;

        const supplierItems = await prisma.supplierItem.findMany({
            where: { supplierId: Number(supplierId) },
            include: { item: true, supplier: true },
        });

        const flattenedItems = supplierItems.map(({ supplierId, itemId, supply_quantity, supply_price, effective_date, is_preferred, created_date, created_by, updated_date, updated_by, item, supplier }) => ({
            supplierId,
            itemId,
            supply_quantity,
            supply_price,
            effective_date,
            is_preferred,
            created_date,
            created_by,
            updated_date,
            updated_by,
            itemName: item.name,
            itemCode: item.itemCode,
            itemDescription: item.description,
            supplierName: supplier.name,
            supplierCode: supplier.supplierCode,
            supplierContact: supplier.contactName
        }));

        res.status(200).json(flattenedItems);
    } catch (error) {
        console.error("Error fetching supplier items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Supplier Item Details
export const updateSupplierItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supplierId, itemId } = req.params;
        const { supply_price, supply_quantity, effective_date, is_preferred } = req.body;
        const userId = (req as any).user.id;

        const existingSupplierItem = await prisma.supplierItem.findUnique({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
        });

        if (!existingSupplierItem) {
            res.status(404).json({ message: "Product not linked to this supplier" });
            return
        }

        // 🔹 Convert values properly
        const updateData: any = {};
        if (supply_price !== undefined) {
            updateData.supply_price = parseFloat(supply_price);
        }
        if (supply_quantity !== undefined) {
            updateData.supply_quantity = parseFloat(supply_quantity);
        }
        if (effective_date !== undefined) {
            updateData.effective_date = new Date(effective_date);
        }
        if (is_preferred !== undefined) {
            updateData.is_preferred = is_preferred;
        }

        // 🔹 Ensure update is actually happening
        if (Object.keys(updateData).length === 0) {
            res.status(200).json({ message: "No changes detected, update skipped" });
            return
        }

        updateData.updated_by = Number(userId);

        const updatedSupplierItem = await prisma.supplierItem.update({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
            data: updateData,
        });

        res.status(200).json({ message: "Supplier product updated successfully", updatedSupplierItem });
    } catch (error) {
        console.error("Error updating supplier item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove a Product from a Supplier
export const removeSupplierItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supplierId, itemId } = req.params;

        const existingSupplierItem = await prisma.supplierItem.findUnique({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
        });

        if (!existingSupplierItem) {
            res.status(404).json({ message: "Product not linked to this supplier" });
            return;
        }

        await prisma.supplierItem.delete({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
        });

        res.status(200).json({ message: "Supplier product removed successfully" });
    } catch (error) {
        console.error("Error removing supplier item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Purchase Orders for a specific Supplier
export const getPurchaseOrdersForSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supplierId } = req.params;

        // Check if supplier exists
        const supplier = await prisma.supplier.findUnique({
            where: { id: Number(supplierId) },
        });

        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }

        // Fetch purchase orders for the supplier
        const purchaseOrders = await prisma.purchaseOrder.findMany({
            where: { supplierId: Number(supplierId) },
            include: {
                supplier: true, // Include the supplier details
                purchaseOrderItems: true, // Include purchase order items
                grns: true, // Include GRNs related to the purchase orders
            },
        });

        res.status(200).json(purchaseOrders);
    } catch (error) {
        console.error("Error fetching purchase orders for supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
