import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSupplierSite = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supplierId, siteName, siteCode, address, contactName, contactEmail, contactPhone, latitude, longitude } = req.body;
        // Validate supplierId
        if (!supplierId || isNaN(Number(supplierId))) {
            res.status(400).json({ message: "Invalid or missing supplierId" });
            return;
        }
        
        const supplier = await prisma.supplier.findUnique({ where: { id: Number(supplierId) } });
        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }
        const existingSupplierSite = await prisma.supplierSite.findUnique({ where: { siteCode } });
        if (existingSupplierSite) {
            res.status(400).json({ message: "Supplier Site already exists" });
            return;
        }
        const newSite = await prisma.supplierSite.create({
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
    } catch (error) {
        console.error("Error creating supplier site:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getSupplierSites = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supplierId } = req.params;
        
        const supplier = await prisma.supplier.findUnique({ where: { id: Number(supplierId) } });
        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }

        const sites = await prisma.supplierSite.findMany({ where: { supplierId: Number(supplierId) } });

        res.status(200).json(sites);
    } catch (error) {
        console.error("Error fetching supplier sites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSupplierSite = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.params;
        const { siteName, siteCode, address, contactName, contactEmail, contactPhone, latitude, longitude } = req.body;

        const existingSite = await prisma.supplierSite.findUnique({ where: { id: Number(siteId) } });
        if (!existingSite) {
            res.status(404).json({ message: "Supplier site not found" });
            return;
        }

        const updatedSite = await prisma.supplierSite.update({
            where: { id: Number(siteId) },
            data: { siteName, siteCode, address, contactName, contactEmail, contactPhone, latitude, longitude },
        });

        res.status(200).json({ message: "Supplier site updated successfully", supplierSite: updatedSite });
    } catch (error) {
        console.error("Error updating supplier site:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteSupplierSite = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.params;

        const existingSite = await prisma.supplierSite.findUnique({ where: { id: Number(siteId) } });
        if (!existingSite) {
            res.status(404).json({ message: "Supplier site not found" });
            return;
        }

        await prisma.supplierSite.delete({ where: { id: Number(siteId) } });

        res.status(200).json({ message: "Supplier site deleted successfully" });
    } catch (error) {
        console.error("Error deleting supplier site:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
