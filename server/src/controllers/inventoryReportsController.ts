import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Inventory Report
export const createInventoryReport = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!(req as any).user || !(req as any).user.userId) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }
        const userId = (req as any).user.userId;
        const { organizationId, itemName, sku, batchNumber, lotNumber, serialNumber, manufacturingDate,
            expiryDate, stockInwardDate, stockOutwardDate, openingQuantity, currentQuantity,
            inwardQuantity, outwardQuantity, committedQuantity, availableQuantity, damagedQuantity,
            unitCost, totalValue, reorderLevel, warehouseId, warehouseName, subWarehouseName,
            binLocation, category, subCategory, unitOfMeasure, barcode } = req.body;

        if (!organizationId || !itemName || !sku) {
            res.status(400).json({ message: "Missing required fields: organizationId, itemName, or sku" });
            return;
        }
        const parseDate = (date: string) => (date ? new Date(date) : null);
        const existingInventory = await prisma.inventoryReport.findFirst({
            where: { sku },
        });

        if (existingInventory) {
            res.status(400).json({ message: "Inventory report with this SKU already exists." });
            return;
        }
    
        const newInventoryReport = await prisma.inventoryReport.create({
            data: {
                organizationId,
                itemName,
                sku,
                batchNumber,
                lotNumber,
                serialNumber,
                manufacturingDate: parseDate(manufacturingDate),
                expiryDate: parseDate(expiryDate),
                stockInwardDate: parseDate(stockInwardDate),
                stockOutwardDate: parseDate(stockOutwardDate),
                openingQuantity,
                currentQuantity,
                inwardQuantity,
                outwardQuantity,
                committedQuantity,
                availableQuantity,
                damagedQuantity,
                unitCost,
                totalValue,
                reorderLevel,
                warehouseId,
                warehouseName,
                subWarehouseName,
                binLocation,
                category,
                subCategory,
                unitOfMeasure,
                barcode,
                createdBy: Number(userId),
                updatedBy: Number(userId)
            },
        });

        res.status(201).json({ message: "Inventory Report created successfully", inventoryReport: newInventoryReport });
    } catch (error) {
        console.error("Error creating inventory report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Inventory Reports
export const getAllInventoryReports = async (_req: Request, res: Response): Promise<void> => {
    try {
        const inventoryReports = await prisma.inventoryReport.findMany();
        res.json(inventoryReports);
    } catch (error) {
        console.error("Error fetching inventory reports:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Inventory Report by ID
export const getInventoryReportById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid Inventory Report ID" });
            return;
        }

        const inventoryReport = await prisma.inventoryReport.findUnique({
            where: { inventoryId: id },
        });

        if (!inventoryReport) {
            res.status(404).json({ message: "Inventory Report not found" });
            return;
        }

        res.json(inventoryReport);
    } catch (error) {
        console.error("Error fetching inventory report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Inventory Report
export const updateInventoryReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid Inventory Report ID" });
            return;
        }

        const userId = (req as any)?.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }

        const existingInventoryReport = await prisma.inventoryReport.findUnique({
            where: { inventoryId: id },
        });

        if (!existingInventoryReport) {
            res.status(404).json({ message: "Inventory Report not found" });
            return;
        }

        const updatedInventoryReport = await prisma.inventoryReport.update({
            where: { inventoryId: id },
            data: {
                ...req.body,
                updatedBy: Number(userId),
                updatedAt: new Date(),
            },
        });

        res.json({ message: "Inventory Report updated successfully", inventoryReport: updatedInventoryReport });
    } catch (error) {
        console.error("Error updating inventory report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Inventory Report
export const deleteInventoryReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid Inventory Report ID" });
            return;
        }

        const existingInventoryReport = await prisma.inventoryReport.findUnique({
            where: { inventoryId: id },
        });

        if (!existingInventoryReport) {
            res.status(404).json({ message: "Inventory Report not found" });
            return;
        }

        await prisma.inventoryReport.delete({ where: { inventoryId: id } });

        res.json({ message: "Inventory Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting inventory report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

