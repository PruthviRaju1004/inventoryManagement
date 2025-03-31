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
exports.deleteOrganization = exports.updateOrganization = exports.getOrganizations = exports.createOrganization = void 0;
const client_1 = require("@prisma/client");
const validateDomain_1 = require("../utils/validateDomain");
const prisma = new client_1.PrismaClient();
// Create Organization (Only Super Admin)
const createOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can create organizations" });
        return;
    }
    try {
        const { name, contactEmail, contactPhone, address, taxId, dunsNumber, website, socialMedia } = req.body;
        const userId = req.user.userId;
        console.log("User ID:", userId); // Debugging log
        // Validate website domain matches email domain
        if (website && !(0, validateDomain_1.validateDomain)(contactEmail, website)) {
            res.status(400).json({ message: "Website domain must match email domain" });
            return;
        }
        // Get uploaded file paths
        const legalProofs = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const existingOrg = yield prisma.organization.findUnique({ where: { contactEmail } });
        if (existingOrg) {
            res.status(400).json({ message: "Organization already exists" });
            return;
        }
        const newOrg = yield prisma.organization.create({
            data: {
                name,
                contactEmail,
                contactPhone,
                address,
                taxId,
                dunsNumber,
                website,
                socialMedia: socialMedia ? JSON.parse(socialMedia) : null,
                legalProofs: legalProofs.length > 0 ? legalProofs : [],
                createdBy: Number(userId), // ✅ Ensure it's a number
                updatedBy: Number(userId), // ✅ Ensure it's a number
            },
        });
        console.log("new org", newOrg);
        res.status(201).json({ message: "Organization created successfully", organization: newOrg });
    }
    catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createOrganization = createOrganization;
// Get Organizations (Only Super Admin)
const getOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can view organizations" });
        return;
    }
    try {
        const organizations = yield prisma.organization.findMany();
        // Convert file paths to URLs
        const updatedOrganizations = organizations.map(org => (Object.assign(Object.assign({}, org), { legalProofs: Array.isArray(org.legalProofs) ? org.legalProofs.filter((file) => typeof file === 'string').map((file) => `https://inventorymanagement-production-6ff8.up.railway.app${file}`) : [] })));
        res.status(200).json(updatedOrganizations);
    }
    catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getOrganizations = getOrganizations;
// Update Organization (Only Super Admin)
const updateOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can update organizations" });
        return;
    }
    try {
        const { id } = req.params;
        const { name, contactEmail, contactPhone, address, isActive, taxId, dunsNumber, website, socialMedia, existingLegalProofs } = req.body;
        // Validate website domain matches email domain
        if (website && !(0, validateDomain_1.validateDomain)(contactEmail, website)) {
            res.status(400).json({ message: "Website domain must match email domain" });
            return;
        }
        // Get existing legalProofs from DB
        const existingOrg = yield prisma.organization.findUnique({
            where: { id: parseInt(id) },
            select: { legalProofs: true },
        });
        if (!existingOrg) {
            res.status(404).json({ message: "Organization not found" });
            return;
        }
        const uploadedFiles = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        // Merge existing legalProofs if they were not replaced
        const finalLegalProofs = uploadedFiles.length > 0
            ? uploadedFiles
            : existingLegalProofs
                ? JSON.parse(existingLegalProofs)
                : existingOrg.legalProofs;
        const updatedOrg = yield prisma.organization.update({
            where: { id: parseInt(id) },
            data: {
                name,
                contactEmail,
                contactPhone,
                address,
                isActive,
                taxId,
                dunsNumber,
                website,
                socialMedia: socialMedia ? JSON.parse(socialMedia) : null,
                legalProofs: finalLegalProofs, // Preserve existing files if no new ones are uploaded
                updatedBy: req.user.userId,
            },
        });
        res.status(200).json({ message: "Organization updated successfully", organization: updatedOrg });
    }
    catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateOrganization = updateOrganization;
// Delete Organization (Only Super Admin)
const deleteOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can delete organizations" });
        return;
    }
    try {
        const { id } = req.params;
        yield prisma.organization.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: "Organization deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting organization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteOrganization = deleteOrganization;
