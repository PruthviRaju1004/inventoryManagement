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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.getItemById = exports.getItems = exports.createItem = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create Item (Only Super Admin or Organization Admin)
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = req.user.role;
    if (userRole !== "super_admin" && userRole !== "admin") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create items" });
        return;
    }
    try {
        const { organizationId, name, itemCode, description, searchDescription, baseUom, secondaryUom, qtyPerUom, salesUom, purchaseUom, type, inventoryGroup, itemCategoryCode, parentCategory, productType, hsnSacCode, gstCredit, make, color, size, blocked, unitPrice, costingMethod, costPrice, commissionEligible, commissionFactor, businessUnitName, barcode, reorderLevel, leadTimeDays, safetyStockLevel, expirationDate, isPerishable } = req.body;
        const userId = req.user.userId;
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
                organizationId,
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
        console.error("Error creating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createItem = createItem;
// Get All Items
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const items = yield prisma.item.findMany({ where: { organizationId: Number(organizationId) } });
        res.status(200).json(items);
    }
    catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getItems = getItems;
// Get Item by ID
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }
        const item = yield prisma.item.findUnique({ where: { id: Number(id) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.status(200).json(item);
    }
    catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getItemById = getItemById;
// Update Item
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }
        const _a = req.body, { expirationDate } = _a, otherData = __rest(_a, ["expirationDate"]);
        const updatedItem = yield prisma.item.update({
            where: { id: Number(id) },
            data: Object.assign(Object.assign({}, otherData), { expirationDate: expirationDate ? new Date(expirationDate) : null, updatedAt: new Date() }),
        });
        res.status(200).json({ message: "Item updated successfully", item: updatedItem });
    }
    catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateItem = updateItem;
// Delete Item
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid item ID" });
            return;
        }
        const existingItem = yield prisma.item.findUnique({ where: { id: Number(id) } });
        if (!existingItem) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        yield prisma.item.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteItem = deleteItem;
