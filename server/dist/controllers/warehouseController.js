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
exports.reserveStock = exports.updateWarehouseStock = exports.getWarehouseStock = exports.addItemToWarehouse = exports.deleteWarehouse = exports.updateWarehouse = exports.getWarehouses = exports.createWarehouse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create Warehouse (Only Super Admin or Organization Admin)
const createWarehouse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = req.user.role;
    if (userRole !== "super_admin" && userRole !== "admin") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create warehouses" });
        return;
    }
    try {
        const { organizationId, name, code, address, contactEmail, contactPhone, latitude, longitude, sqFoot, noOfDocks, lotSize, shelvesRacks } = req.body;
        const userId = req.user.userId;
        if (!code) {
            res.status(400).json({ message: "Warehouse code is required" });
            return;
        }
        const existingWarehouse = yield prisma.warehouse.findUnique({ where: { code } });
        if (existingWarehouse) {
            res.status(400).json({ message: "Warehouse already exists" });
            return;
        }
        const newWarehouse = yield prisma.warehouse.create({
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
    }
    catch (error) {
        console.error("Error creating warehouse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createWarehouse = createWarehouse;
const getWarehouses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const warehouses = yield prisma.warehouse.findMany({ where: { organizationId: Number(organizationId) } });
        res.status(200).json(warehouses);
    }
    catch (error) {
        console.error("Error fetching warehouses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getWarehouses = getWarehouses;
const updateWarehouse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid warehouse ID" });
            return;
        }
        const { name, address, contactEmail, contactPhone, latitude, longitude, sqFoot, noOfDocks, lotSize, shelvesRacks } = req.body;
        const updatedWarehouse = yield prisma.warehouse.update({
            where: { id: Number(id) },
            data: { name, address, contactEmail, contactPhone, latitude, longitude, sqFoot, noOfDocks, lotSize, shelvesRacks },
        });
        res.status(200).json({ message: "Warehouse updated successfully", warehouse: updatedWarehouse });
    }
    catch (error) {
        console.error("Error updating warehouse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateWarehouse = updateWarehouse;
const deleteWarehouse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid warehouse ID" });
            return;
        }
        const existingWarehouse = yield prisma.warehouse.findUnique({ where: { id: Number(id) } });
        if (!existingWarehouse) {
            res.status(404).json({ message: "Warehouse not found" });
            return;
        }
        yield prisma.warehouse.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Warehouse deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting warehouse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteWarehouse = deleteWarehouse;
// Add an item to a warehouse with quantity
const addItemToWarehouse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { warehouseId } = req.params;
        const { itemId, quantity } = req.body;
        const warehouse = yield prisma.warehouse.findUnique({ where: { id: Number(warehouseId) } });
        if (!warehouse) {
            res.status(404).json({ message: "Warehouse not found" });
            return;
        }
        const item = yield prisma.item.findUnique({ where: { id: Number(itemId) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        const stock = yield prisma.warehouseItem.upsert({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } },
            update: { quantity: { increment: Number(quantity) } },
            create: { warehouseId: Number(warehouseId), itemId: Number(itemId), quantity: Number(quantity), reservedStock: 0 },
        });
        res.status(200).json({ message: "Item added to warehouse", stock });
    }
    catch (error) {
        console.error("Error adding item to warehouse:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addItemToWarehouse = addItemToWarehouse;
// Get stock levels for a warehouse
const getWarehouseStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { warehouseId } = req.params;
        const stock = yield prisma.warehouseItem.findMany({
            where: { warehouseId: Number(warehouseId) },
            include: { item: true },
        });
        res.status(200).json(stock);
    }
    catch (error) {
        console.error("Error fetching warehouse stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getWarehouseStock = getWarehouseStock;
const updateWarehouseStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { warehouseId } = req.params;
        const { itemId, quantity } = req.body;
        const warehouse = yield prisma.warehouse.findUnique({ where: { id: Number(warehouseId) } });
        if (!warehouse) {
            res.status(404).json({ message: "Warehouse not found" });
            return;
        }
        const item = yield prisma.item.findUnique({ where: { id: Number(itemId) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        const existingStock = yield prisma.warehouseItem.findUnique({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } }
        });
        if (existingStock && Number(existingStock.quantity) + Number(quantity) < 0) {
            res.status(400).json({ message: "Insufficient stock" });
            return;
        }
        const stock = yield prisma.warehouseItem.upsert({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } },
            update: { quantity: { increment: Number(quantity) } },
            create: { warehouseId: Number(warehouseId), itemId: Number(itemId), quantity: Number(quantity), reservedStock: 0 },
        });
        res.status(200).json({ message: "Warehouse stock updated successfully", stock });
    }
    catch (error) {
        console.error("Error updating warehouse stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateWarehouseStock = updateWarehouseStock;
const reserveStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { warehouseId } = req.params;
        const { itemId, quantity } = req.body;
        const warehouseItem = yield prisma.warehouseItem.findUnique({
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
        const updatedStock = yield prisma.warehouseItem.update({
            where: { warehouseId_itemId: { warehouseId: Number(warehouseId), itemId: Number(itemId) } },
            data: {
                quantity: { decrement: Number(quantity) },
                reservedStock: { increment: Number(quantity) },
            },
        });
        res.status(200).json({ message: "Stock reserved successfully", stock: updatedStock });
    }
    catch (error) {
        console.error("Error reserving stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.reserveStock = reserveStock;
