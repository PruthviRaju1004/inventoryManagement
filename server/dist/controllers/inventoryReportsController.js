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
exports.deleteInventoryReport = exports.updateInventoryReport = exports.getInventoryReportById = exports.getAllInventoryReports = exports.createInventoryReport = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create Inventory Report
const createInventoryReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }
        const userId = req.user.userId;
        const { organizationId, itemId, itemName, sku, batchNumber, lotNumber, serialNumber, manufacturingDate, expiryDate, stockInwardDate, stockOutwardDate, openingQuantity, currentQuantity, inwardQuantity, outwardQuantity, committedQuantity, availableQuantity, damagedQuantity, unitCost, totalValue, reorderLevel, warehouseId, warehouseName, subWarehouseName, binLocation, category, subCategory, unitOfMeasure, barcode } = req.body;
        if (!organizationId || !itemName || !sku) {
            res.status(400).json({ message: "Missing required fields: organizationId, itemName, or sku" });
            return;
        }
        const parseDate = (date) => (date ? new Date(date) : null);
        const existingInventory = yield prisma.inventoryReport.findFirst({
            where: { sku },
        });
        if (existingInventory) {
            res.status(400).json({ message: "Inventory report with this SKU already exists." });
            return;
        }
        const newInventoryReport = yield prisma.inventoryReport.create({
            data: {
                organizationId,
                itemId,
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
                updatedBy: Number(userId),
            },
        });
        res.status(201).json({ message: "Inventory Report created successfully", inventoryReport: newInventoryReport });
    }
    catch (error) {
        console.error("Error creating inventory report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createInventoryReport = createInventoryReport;
// Get All Inventory Reports
const getAllInventoryReports = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventoryReports = yield prisma.inventoryReport.findMany();
        res.json(inventoryReports);
    }
    catch (error) {
        console.error("Error fetching inventory reports:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllInventoryReports = getAllInventoryReports;
// Get Inventory Report by ID
const getInventoryReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid Inventory Report ID" });
            return;
        }
        const inventoryReport = yield prisma.inventoryReport.findUnique({
            where: { inventoryId: id },
        });
        if (!inventoryReport) {
            res.status(404).json({ message: "Inventory Report not found" });
            return;
        }
        res.json(inventoryReport);
    }
    catch (error) {
        console.error("Error fetching inventory report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getInventoryReportById = getInventoryReportById;
// Update Inventory Report
const updateInventoryReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid Inventory Report ID" });
            return;
        }
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }
        const existingInventoryReport = yield prisma.inventoryReport.findUnique({
            where: { inventoryId: id },
        });
        if (!existingInventoryReport) {
            res.status(404).json({ message: "Inventory Report not found" });
            return;
        }
        const updatedInventoryReport = yield prisma.inventoryReport.update({
            where: { inventoryId: id },
            data: Object.assign(Object.assign({}, req.body), { updatedBy: Number(userId), updatedAt: new Date() }),
        });
        res.json({ message: "Inventory Report updated successfully", inventoryReport: updatedInventoryReport });
    }
    catch (error) {
        console.error("Error updating inventory report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateInventoryReport = updateInventoryReport;
// Delete Inventory Report
const deleteInventoryReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid Inventory Report ID" });
            return;
        }
        const existingInventoryReport = yield prisma.inventoryReport.findUnique({
            where: { inventoryId: id },
        });
        if (!existingInventoryReport) {
            res.status(404).json({ message: "Inventory Report not found" });
            return;
        }
        yield prisma.inventoryReport.delete({ where: { inventoryId: id } });
        res.json({ message: "Inventory Report deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting inventory report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteInventoryReport = deleteInventoryReport;
