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
exports.deleteSupplierSite = exports.updateSupplierSite = exports.getSupplierSites = exports.createSupplierSite = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSupplierSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId, siteName, siteCode, address, contactName, contactEmail, contactPhone, latitude, longitude } = req.body;
        // Validate supplierId
        if (!supplierId || isNaN(Number(supplierId))) {
            res.status(400).json({ message: "Invalid or missing supplierId" });
            return;
        }
        const supplier = yield prisma.supplier.findUnique({ where: { id: Number(supplierId) } });
        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }
        const existingSupplierSite = yield prisma.supplierSite.findUnique({ where: { siteCode } });
        if (existingSupplierSite) {
            res.status(400).json({ message: "Supplier Site already exists" });
            return;
        }
        const newSite = yield prisma.supplierSite.create({
            data: {
                supplierId: Number(supplierId),
                siteName,
                siteCode,
                address,
                latitude,
                longitude,
                contactName,
                contactEmail,
                contactPhone,
                createdBy: Number(supplierId),
                updatedBy: Number(supplierId),
            },
        });
        res.status(201).json({ message: "Supplier site created successfully", supplierSite: newSite });
    }
    catch (error) {
        console.error("Error creating supplier site:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createSupplierSite = createSupplierSite;
const getSupplierSites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        const supplier = yield prisma.supplier.findUnique({ where: { id: Number(supplierId) } });
        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }
        const sites = yield prisma.supplierSite.findMany({ where: { supplierId: Number(supplierId) } });
        res.status(200).json(sites);
    }
    catch (error) {
        console.error("Error fetching supplier sites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSupplierSites = getSupplierSites;
const updateSupplierSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { siteId } = req.params;
        const { siteName, siteCode, address, contactName, contactEmail, contactPhone, latitude, longitude } = req.body;
        const existingSite = yield prisma.supplierSite.findUnique({ where: { id: Number(siteId) } });
        if (!existingSite) {
            res.status(404).json({ message: "Supplier site not found" });
            return;
        }
        const updatedSite = yield prisma.supplierSite.update({
            where: { id: Number(siteId) },
            data: { siteName, siteCode, address, contactName, contactEmail, contactPhone, latitude, longitude },
        });
        res.status(200).json({ message: "Supplier site updated successfully", supplierSite: updatedSite });
    }
    catch (error) {
        console.error("Error updating supplier site:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateSupplierSite = updateSupplierSite;
const deleteSupplierSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { siteId } = req.params;
        const existingSite = yield prisma.supplierSite.findUnique({ where: { id: Number(siteId) } });
        if (!existingSite) {
            res.status(404).json({ message: "Supplier site not found" });
            return;
        }
        yield prisma.supplierSite.delete({ where: { id: Number(siteId) } });
        res.status(200).json({ message: "Supplier site deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting supplier site:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteSupplierSite = deleteSupplierSite;
