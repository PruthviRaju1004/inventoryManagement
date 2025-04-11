import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validateDomain } from "../utils/validateDomain";

const prisma = new PrismaClient();

// Create Organization (Only Super Admin)
export const createOrganization = async (req: Request, res: Response): Promise<void> => {
    if ((req as any).user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can create organizations" });
        return;
    }

    try {
        const { name, contactEmail, contactPhone, address, address2, city, country, state, zipCode, taxId, dunsNumber, website, socialMedia } = req.body;
        const userId = (req as any).user.id;
        // Get uploaded file paths
        const legalProofs = req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];
        const existingOrg = await prisma.organization.findUnique({ where: { contactEmail } });
        if (existingOrg) {
            res.status(400).json({ message: "Organization already exists" });
            return;
        }
        const newOrg = await prisma.organization.create({
            data: {
                name,
                contactEmail,
                contactPhone,
                address,
                address2,
                city,
                country,
                state,
                zipCode,
                taxId,
                dunsNumber,
                website,
                socialMedia: socialMedia ? JSON.parse(socialMedia) : null,
                legalProofs: legalProofs.length > 0 ? legalProofs : [],
                createdBy: Number(userId),  // ✅ Ensure it's a number
                updatedBy: Number(userId),  // ✅ Ensure it's a number
            },
        });
        // console.log("new org", newOrg)

        res.status(201).json({ message: "Organization created successfully", organization: newOrg });
    } catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Organizations (Only Super Admin)
export const getOrganizations = async (req: Request, res: Response): Promise<void> => {
    try {
        const organizations = await prisma.organization.findMany();
        // Convert file paths to URLs
        const updatedOrganizations = organizations.map(org => ({
            ...org,
            legalProofs: Array.isArray(org.legalProofs) ? org.legalProofs.filter((file): file is string => typeof file === 'string').map((file: string) => `http://localhost:8000${file}`) : [],
        }));
        res.status(200).json(updatedOrganizations);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOrganizationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organization = await prisma.organization.findUnique({
            where: { id: Number(id) },
        });

        if (!organization) {
            res.status(404).json({ message: "Organization not found" });
            return;
        }

        // Convert file paths to URLs
        const updatedOrganization = {
            ...organization,
            legalProofs: Array.isArray(organization.legalProofs)
                ? organization.legalProofs
                      .filter((file): file is string => typeof file === "string")
                      .map((file: string) => `https://inventorymanagement-production-6ff8.up.railway.app${file}`)
                : [],
        };

        res.status(200).json(updatedOrganization);
    } catch (error) {
        console.error("Error fetching organization by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Organization (Only Super Admin)
export const updateOrganization = async (req: Request, res: Response): Promise<void> => {
    if ((req as any).user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can update organizations" });
        return;
    }

    try {
        const { id } = req.params;
        const { name, contactEmail, contactPhone, address, isActive, taxId, dunsNumber, website, 
            address2, city, state, country, zipCode, socialMedia, existingLegalProofs } = req.body;

        // Get existing legalProofs from DB
        const existingOrg = await prisma.organization.findUnique({
            where: { id: parseInt(id) },
            select: { legalProofs: true },
        });

        if (!existingOrg) {
            res.status(404).json({ message: "Organization not found" });
            return;
        }

        const uploadedFiles = req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];

        // Merge existing legalProofs if they were not replaced
        const finalLegalProofs = uploadedFiles.length > 0 
            ? uploadedFiles 
            : existingLegalProofs 
                ? JSON.parse(existingLegalProofs) 
                : existingOrg.legalProofs;

        const updatedOrg = await prisma.organization.update({
            where: { id: parseInt(id) },
            data: { 
                name,
                contactEmail,
                contactPhone,
                address,
                address2,
                city,
                country,
                state,
                zipCode,
                isActive,
                taxId,
                dunsNumber,
                website,
                socialMedia: socialMedia ? JSON.parse(socialMedia) : null,
                legalProofs: finalLegalProofs, // Preserve existing files if no new ones are uploaded
                updatedBy: (req as any).user.userId,
            },
        });

        res.status(200).json({ message: "Organization updated successfully", organization: updatedOrg });
    } catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Delete Organization (Only Super Admin)
export const deleteOrganization = async (req: Request, res: Response): Promise<void> => {
    if ((req as any).user.role !== "super_admin") {
        res.status(403).json({ message: "Forbidden: Only super admins can delete organizations" });
        return;
    }

    try {
        const { id } = req.params;
        await prisma.organization.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: "Organization deleted successfully" });
    } catch (error) {
        console.error("Error deleting organization:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
