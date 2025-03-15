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
exports.deleteGRN = exports.updateGRN = exports.getGRNById = exports.getGRNs = exports.createGRN = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create GRN (Goods Receipt Note)
const createGRN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!["super_admin", "admin"].includes(user.role)) {
            res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create GRNs" });
            return;
        }
        const { organizationId, grnDate, poId, poNumber, supplierId, warehouseId, totalAmount, remarks, grnLineItems, supplierName, warehouseName, grnNumber, status: grnStatus } = req.body;
        if (!supplierId || !warehouseId || !(grnLineItems === null || grnLineItems === void 0 ? void 0 : grnLineItems.length)) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const existingGRN = yield prisma.gRN.findUnique({
            where: { grnNumber } // Now this will work!
        });
        if (existingGRN) {
            res.status(400).json({ message: "GRN already exist" });
            return;
        }
        // Ensure userId is valid
        const userId = Number(user.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }
        const generateOrderNumber = () => {
            return `GRN-${Math.floor(Math.random() * 1000000)}`;
        };
        const orderNumberToUse = generateOrderNumber();
        // Create GRN
        const newGRN = yield prisma.gRN.create({
            data: {
                organizationId: Number(organizationId),
                grnDate: new Date(grnDate),
                grnNumber: orderNumberToUse,
                poId: Number(poId),
                poNumber,
                supplierId: Number(supplierId),
                supplierName,
                warehouseId: Number(warehouseId),
                warehouseName,
                totalAmount: totalAmount ? parseFloat(totalAmount) : 0, // Ensure valid number
                status: client_1.GRNStatus[grnStatus] || client_1.GRNStatus.Draft,
                remarks: remarks || "",
                createdBy: userId,
                updatedBy: userId,
                grnLineItems: {
                    create: grnLineItems.map((item) => ({
                        itemId: Number(item.itemId),
                        itemName: item.itemName,
                        orderedQty: parseFloat(item.orderedQty),
                        receivedQty: parseFloat(item.receivedQty),
                        unitPrice: parseFloat(item.unitPrice),
                        uom: item.uom || "PCS",
                        lineTotal: parseFloat(item.receivedQty) * parseFloat(item.unitPrice),
                        batchNumber: item.batchNumber || null,
                        manufacturingDate: item.manufacturingDate ? new Date(item.manufacturingDate) : null,
                        expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
                        storageLocation: item.storageLocation || null,
                        remarks: item.remarks || null,
                        createdBy: userId,
                        updatedBy: userId,
                    })),
                },
            },
            include: { grnLineItems: true },
        });
        res.status(201).json({ message: "GRN created successfully", grn: newGRN });
    }
    catch (error) {
        console.error("Error creating GRN:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createGRN = createGRN;
// Get All GRNs for an Organization
const getGRNs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        let { organizationId } = req.query;
        if (user.role !== "super_admin") {
            organizationId = user.organizationId;
        }
        else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const orgId = Number(organizationId);
        if (isNaN(orgId)) {
            res.status(400).json({ message: "Invalid organization ID" });
            return;
        }
        const grns = yield prisma.gRN.findMany({
            where: { organizationId: orgId },
            include: { supplier: true, warehouse: true, grnLineItems: { include: { item: true } } },
        });
        res.status(200).json(grns);
    }
    catch (error) {
        console.error("Error fetching GRNs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getGRNs = getGRNs;
// Get Single GRN by ID
const getGRNById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grnId = Number(req.params.id);
        if (isNaN(grnId)) {
            res.status(400).json({ message: "Invalid GRN ID" });
            return;
        }
        const grn = yield prisma.gRN.findUnique({
            where: { grnId },
            include: { supplier: true, warehouse: true, grnLineItems: { include: { item: true } } },
        });
        if (!grn) {
            res.status(404).json({ message: "GRN not found" });
            return;
        }
        res.status(200).json(grn);
    }
    catch (error) {
        console.error("Error fetching GRN:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getGRNById = getGRNById;
// Update GRN Status
const updateGRN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grnId = Number(req.params.id);
        console.log("grnId", grnId);
        if (isNaN(grnId)) {
            res.status(400).json({ message: "Invalid GRN ID" });
            return;
        }
        const { status, remarks, updatedBy } = req.body;
        if (!Object.values(client_1.GRNStatus).includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }
        const updatedGRN = yield prisma.gRN.update({
            where: { grnId },
            data: { status: status, remarks },
        });
        res.status(200).json({ message: "GRN updated successfully", grn: updatedGRN });
    }
    catch (error) {
        console.error("Error updating GRN:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateGRN = updateGRN;
// Delete GRN
const deleteGRN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grnId = Number(req.params.grnId);
        console.log("grnId", grnId);
        if (isNaN(grnId)) {
            res.status(400).json({ message: "Invalid GRN ID" });
            return;
        }
        const existingGRN = yield prisma.gRN.findUnique({ where: { grnId } });
        if (!existingGRN) {
            res.status(404).json({ message: "GRN not found" });
            return;
        }
        if (existingGRN.status === client_1.GRNStatus.Approved) {
            res.status(400).json({ message: "Cannot delete an approved GRN" });
            return;
        }
        yield prisma.gRN.delete({ where: { grnId } });
        res.status(200).json({ message: "GRN deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting GRN:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteGRN = deleteGRN;
