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
exports.getPurchaseOrdersForSupplier = exports.removeSupplierItem = exports.updateSupplierItem = exports.getSupplierItems = exports.linkProductsToSupplier = exports.deleteSupplier = exports.updateSupplier = exports.getSuppliers = exports.createSupplier = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create Supplier (Only Super Admin or Organization Admin)
const createSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = req.user.role;
    if (userRole === "viewer") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create suppliers" });
        return;
    }
    try {
        const { organizationId, name, supplierCode, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId } = req.body;
        const userId = req.user.id;
        if (!supplierCode) {
            res.status(400).json({ message: "Supplier code is required" });
            return;
        }
        const existingSupplier = yield prisma.supplier.findUnique({ where: { supplierCode } });
        if (existingSupplier) {
            res.status(400).json({ message: "Supplier already exists" });
            return;
        }
        const newSupplier = yield prisma.supplier.create({
            data: {
                organizationId,
                name,
                supplierCode,
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
        res.status(201).json({ message: "Supplier created successfully", supplier: newSupplier });
    }
    catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createSupplier = createSupplier;
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        const userOrgId = req.user.organizationId;
        let { organizationId, search } = req.query;
        // If the user is not a super_admin, restrict them to their own organization
        if (userRole !== "super_admin") {
            organizationId = userOrgId;
        }
        else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const filters = { organizationId: Number(organizationId) };
        if (search) {
            filters.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { supplierCode: { contains: search, mode: "insensitive" } }
            ];
        }
        const suppliers = yield prisma.supplier.findMany({ where: filters, orderBy: { name: "asc" } });
        res.status(200).json(suppliers);
    }
    catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSuppliers = getSuppliers;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid supplier ID" });
            return;
        }
        const { name, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId } = req.body;
        const updatedSupplier = yield prisma.supplier.update({
            where: { id: Number(id) },
            data: { name, contactName, contactEmail, contactPhone, paymentTerms, currency, taxId },
        });
        res.status(200).json({ message: "Supplier updated successfully", supplier: updatedSupplier });
    }
    catch (error) {
        console.error("Error updating supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateSupplier = updateSupplier;
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid supplier ID" });
            return;
        }
        // Check if supplier exists
        const existingSupplier = yield prisma.supplier.findUnique({ where: { id: Number(id) } });
        if (!existingSupplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }
        yield prisma.supplier.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Supplier deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteSupplier = deleteSupplier;
// Link Products to a Supplier
const linkProductsToSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        const userId = req.user.id;
        const { itemId, supply_quantity, supply_price, effective_date, is_preferred, created_by } = req.body;
        if (!supplierId || !itemId || !supply_price || !supply_quantity) {
            res.status(400).json({ message: "Invalid request data. Missing required fields." });
            return;
        }
        const supplier = yield prisma.supplier.findUnique({ where: { id: Number(supplierId) } });
        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }
        const item = yield prisma.item.findUnique({ where: { id: Number(itemId) } });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        const stock = yield prisma.supplierItem.upsert({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
            update: {
                supply_price: parseFloat(supply_price),
                supply_quantity: parseFloat(supply_quantity),
                effective_date: new Date(effective_date),
                is_preferred: is_preferred !== null && is_preferred !== void 0 ? is_preferred : false,
                updated_by: Number(userId),
                updated_date: new Date(),
            },
            create: {
                supplierId: Number(supplierId),
                itemId: Number(itemId),
                supply_price: parseFloat(supply_price),
                supply_quantity: parseFloat(supply_quantity),
                effective_date: new Date(effective_date),
                is_preferred: is_preferred !== null && is_preferred !== void 0 ? is_preferred : false,
                created_by: Number(userId),
                created_date: new Date(),
                updated_by: Number(userId),
                updated_date: new Date(),
            },
        });
        res.status(201).json({ message: "Item linked to supplier successfully", stock });
    }
    catch (error) {
        console.error("Error linking item to supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.linkProductsToSupplier = linkProductsToSupplier;
// Get All Products Linked to a Supplier
const getSupplierItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        const supplierItems = yield prisma.supplierItem.findMany({
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
    }
    catch (error) {
        console.error("Error fetching supplier items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSupplierItems = getSupplierItems;
// Update Supplier Item Details
const updateSupplierItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId, itemId } = req.params;
        const { supply_price, supply_quantity, effective_date, is_preferred } = req.body;
        const userId = req.user.id;
        const existingSupplierItem = yield prisma.supplierItem.findUnique({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
        });
        if (!existingSupplierItem) {
            res.status(404).json({ message: "Product not linked to this supplier" });
            return;
        }
        // 🔹 Convert values properly
        const updateData = {};
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
            return;
        }
        updateData.updated_by = Number(userId);
        const updatedSupplierItem = yield prisma.supplierItem.update({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
            data: updateData,
        });
        res.status(200).json({ message: "Supplier product updated successfully", updatedSupplierItem });
    }
    catch (error) {
        console.error("Error updating supplier item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateSupplierItem = updateSupplierItem;
// Remove a Product from a Supplier
const removeSupplierItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId, itemId } = req.params;
        const existingSupplierItem = yield prisma.supplierItem.findUnique({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
        });
        if (!existingSupplierItem) {
            res.status(404).json({ message: "Product not linked to this supplier" });
            return;
        }
        yield prisma.supplierItem.delete({
            where: { supplierId_itemId: { supplierId: Number(supplierId), itemId: Number(itemId) } },
        });
        res.status(200).json({ message: "Supplier product removed successfully" });
    }
    catch (error) {
        console.error("Error removing supplier item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.removeSupplierItem = removeSupplierItem;
// Get Purchase Orders for a specific Supplier
const getPurchaseOrdersForSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        // Check if supplier exists
        const supplier = yield prisma.supplier.findUnique({
            where: { id: Number(supplierId) },
        });
        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }
        // Fetch purchase orders for the supplier
        const purchaseOrders = yield prisma.purchaseOrder.findMany({
            where: { supplierId: Number(supplierId) },
            include: {
                supplier: true, // Include the supplier details
                purchaseOrderItems: true, // Include purchase order items
                grns: true, // Include GRNs related to the purchase orders
            },
        });
        res.status(200).json(purchaseOrders);
    }
    catch (error) {
        console.error("Error fetching purchase orders for supplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getPurchaseOrdersForSupplier = getPurchaseOrdersForSupplier;
