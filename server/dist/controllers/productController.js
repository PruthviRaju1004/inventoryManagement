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
exports.deleteItem = exports.updateItem = exports.getItemById = exports.getItems = exports.createItem = void 0;
const client_1 = require("@prisma/client");
const inspector_1 = require("inspector");
const prisma = new client_1.PrismaClient();
// Create Item (Only Super Admin or Organization Admin)
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = req.user.role;
    if (userRole === "viewer") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create items" });
        return;
    }
    try {
        const { organizationId, name, itemCode, description, searchDescription, baseUom, secondaryUom, qtyPerUom, salesUom, purchaseUom, type, inventoryGroup, itemCategoryCode, parentCategory, productType, hsnSacCode, gstCredit, make, color, size, blocked, unitPrice, costingMethod, costPrice, commissionEligible, commissionFactor, businessUnitName, barcode, reorderLevel, leadTimeDays, safetyStockLevel, expirationDate, isPerishable } = req.body;
        const existingOrg = yield prisma.organization.findUnique({
            where: { id: organizationId }
        });
        if (!existingOrg) {
            res.status(400).json({ message: "Invalid organization ID" });
            return;
        }
        const userId = req.user.id;
        if (!itemCode) {
            res.status(400).json({ message: "Item code is required" });
            return;
        }
        const existingItem = yield prisma.item.findUnique({ where: { itemCode } });
        if (existingItem) {
            res.status(400).json({ message: "Item with this code already exists" });
            return;
        }
        const newItem = yield prisma.item.create({
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
    }
    catch (error) {
        inspector_1.console.error("Error creating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createItem = createItem;
// Get All Items
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        const userOrgId = req.user.organizationId;
        let { organizationId, search, category } = req.query;
        if (userRole === "admin") {
            organizationId = userOrgId; // Admin can only access their own org's items
        }
        else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const filters = { organizationId: Number(organizationId) };
        if (search) {
            filters.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { itemCode: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ];
        }
        if (category) {
            filters.itemCategoryCode = category;
        }
        const items = yield prisma.item.findMany({ where: filters });
        res.status(200).json(items);
    }
    catch (error) {
        inspector_1.console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getItems = getItems;
// Get Item by ID
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userOrgId = req.user.organizationId;
        const userRole = req.user.role;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }
        // Super admins can access any item; admins can only access items from their org
        const item = yield prisma.item.findUnique({ where: { id: Number(id) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        if (userRole === "admin" && item.organizationId !== userOrgId) {
            res.status(403).json({ message: "Forbidden: You do not have permission to view this item" });
            return;
        }
        res.status(200).json(item);
    }
    catch (error) {
        inspector_1.console.error("Error fetching item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getItemById = getItemById;
// Update Item
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userOrgId = req.user.organizationId;
        const userRole = req.user.role;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }
        // Get item and check if the user has access
        const item = yield prisma.item.findUnique({ where: { id: Number(id) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        if (userRole === "admin" && item.organizationId !== userOrgId) {
            res.status(403).json({ message: "Forbidden: You do not have permission to update this item" });
            return;
        }
        const updatedItem = yield prisma.item.update({
            where: { id: Number(id) },
            data: Object.assign(Object.assign({}, req.body), { updatedAt: new Date() }),
        });
        res.status(200).json({ message: "Item updated successfully", item: updatedItem });
    }
    catch (error) {
        inspector_1.console.error("Error updating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateItem = updateItem;
// Delete Item
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userOrgId = req.user.organizationId;
        const userRole = req.user.role;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }
        const item = yield prisma.item.findUnique({ where: { id: Number(id) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        if (userRole === "admin" && item.organizationId !== userOrgId) {
            res.status(403).json({ message: "Forbidden: You do not have permission to delete this item" });
            return;
        }
        yield prisma.item.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (error) {
        inspector_1.console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteItem = deleteItem;
