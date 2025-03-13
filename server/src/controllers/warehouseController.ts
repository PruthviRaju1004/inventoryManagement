import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Warehouse (Only Super Admin or Organization Admin)
export const createWarehouse = async (req: Request, res: Response): Promise<void> => {
    const userRole = (req as any).user.role;
    if (userRole !== "super_admin" && userRole !== "admin") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create warehouses" });
        return;
    }

    try {
        const { organizationId, name, code, address, contactEmail, contactPhone, latitude, longitude, sqFoot, noOfDocks, lotSize, shelvesRacks } = req.body;
        const userId = (req as any).user.userId;

        if (!code) {
            res.status(400).json({ message: "Warehouse code is required" });
            return;
        }

        const existingWarehouse = await prisma.warehouse.findUnique({ where: { code } });
        if (existingWarehouse) {
            res.status(400).json({ message: "Warehouse already exists" });
            return;
        }

        const newWarehouse = await prisma.warehouse.create({
            data: {
                organizationId,
                name,
                code,
                address,
                contactEmail,
                contactPhone,
                latitude,
                longitude,
                sqFoot,
                lotSize,
                noOfDocks,
                shelvesRacks,
                createdBy: Number(userId),
                updatedBy: Number(userId),
            },
        });

        res.status(201).json({ message: "Warehouse created successfully", warehouse: newWarehouse });
    } catch (error) {
        console.error("Error creating warehouse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getWarehouses = async (req: Request, res: Response): Promise<void> => {
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

        const warehouses = await prisma.warehouse.findMany({ where: { organizationId: Number(organizationId) } });
        res.status(200).json(warehouses);
    } catch (error) {
        console.error("Error fetching warehouses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid warehouse ID" });
            return;
        }

        const { name, address, contactEmail, contactPhone, latitude, longitude, sqFoot, noOfDocks, lotSize, shelvesRacks } = req.body;
        const updatedWarehouse = await prisma.warehouse.update({
            where: { id: Number(id) },
            data: { name, address, contactEmail, contactPhone, latitude, longitude, sqFoot, noOfDocks, lotSize, shelvesRacks },
        });
        res.status(200).json({ message: "Warehouse updated successfully", warehouse: updatedWarehouse });
    } catch (error) {
        console.error("Error updating warehouse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid warehouse ID" });
            return;
        }

        const existingWarehouse = await prisma.warehouse.findUnique({ where: { id: Number(id) } });
        if (!existingWarehouse) {
            res.status(404).json({ message: "Warehouse not found" });
            return;
        }

        await prisma.warehouse.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (error) {
        console.error("Error deleting warehouse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Add an item to a warehouse with quantity
export const addItemToWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { warehouseId } = req.params;
        const { itemId, quantity } = req.body;

        const warehouse = await prisma.warehouse.findUnique({ where: { id: Number(warehouseId) } });
        if (!warehouse) {
            res.status(404).json({ message: "Warehouse not found" });
            return;
        }

        const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }

        const stock = await prisma.warehouseItem.upsert({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } },
            update: { quantity: { increment: Number(quantity) } },
            create: { warehouseId: Number(warehouseId), itemId: Number(itemId), quantity: Number(quantity), reservedStock: 0 },
        });

        res.status(200).json({ message: "Item added to warehouse", stock });
    } catch (error) {
        console.error("Error adding item to warehouse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get stock levels for a warehouse
export const getWarehouseStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const { warehouseId } = req.params;
        const stock = await prisma.warehouseItem.findMany({
            where: { warehouseId: Number(warehouseId) },
            include: { item: true },
        });

        res.status(200).json(stock);
    } catch (error) {
        console.error("Error fetching warehouse stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateWarehouseStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const { warehouseId } = req.params;
        const { itemId, quantity } = req.body;

        const warehouse = await prisma.warehouse.findUnique({ where: { id: Number(warehouseId) } });
        if (!warehouse) {
            res.status(404).json({ message: "Warehouse not found" });
            return;
        }
        const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }

        const existingStock = await prisma.warehouseItem.findUnique({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } }
        }); 
        if (existingStock && Number(existingStock.quantity) + Number(quantity) < 0) {
            res.status(400).json({ message: "Insufficient stock" });
            return;
        }

        const stock = await prisma.warehouseItem.upsert({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } },
            update: { quantity: { increment: Number(quantity) } },
            create: { warehouseId: Number(warehouseId), itemId: Number(itemId), quantity: Number(quantity), reservedStock: 0 },
        });

        res.status(200).json({ message: "Warehouse stock updated successfully", stock });
    } catch (error) {
        console.error("Error updating warehouse stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const reserveStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const { warehouseId } = req.params;
        const { itemId, quantity } = req.body;

        const warehouseItem = await prisma.warehouseItem.findUnique({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } },
        });

        if (!warehouseItem) {
            res.status(404).json({ message: "Item not found in warehouse" });
            return;
        }

        if (warehouseItem.quantity < quantity) {
            res.status(400).json({ message: "Insufficient stock available" });
            return;
        }

        const updatedStock = await prisma.warehouseItem.update({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } },
            data: {
                quantity: { decrement: Number(quantity) },
                reservedStock: { increment: Number(quantity) },
            },
        });

        res.status(200).json({ message: "Stock reserved successfully", stock: updatedStock });
    } catch (error) {
        console.error("Error reserving stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
