import { Request, Response } from "express";
import { PrismaClient, PurchaseOrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Create Purchase Order (Only Super Admin or Organization Admin)
export const createPurchaseOrder = async (req: Request, res: Response): Promise<void> => {
    const userRole = (req as any).user.role;
    if (userRole !== "super_admin" && userRole !== "admin") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create purchase orders" });
        return;
    }

    try {
        const { organizationId, supplierId, totalAmount, orderDate, expectedDate, purchaseOrderItems, orderNumber, receivedDate, remarks } = req.body;
        const userId = (req as any).user.userId;
        console.log("Received purchase order data:", req.body);


        if (!Array.isArray(purchaseOrderItems)) {
            res.status(400).json({ message: "purchaseOrderItems must be a non-empty array" });
            return;
        }

        const generateOrderNumber = () => {
            // This can be a more sophisticated generation logic if required
            return `PO-${Math.floor(Math.random() * 1000000)}`;
        };
        const orderNumberToUse = generateOrderNumber();
        const newPurchaseOrder = await prisma.purchaseOrder.create({
            data: {
                organizationId,
                supplierId,
                orderNumber: orderNumberToUse,
                status: PurchaseOrderStatus.PENDING,
                totalAmount,
                orderDate,
                expectedDate,
                receivedDate,
                remarks,
                createdBy: Number(userId),
                updatedBy: Number(userId),
                purchaseOrderItems: {
                    create: purchaseOrderItems.map((item: any) => ({
                        itemId: item.itemId,
                        quantity: item.quantity,
                        unitPrice: Number(item.unitPrice), // Make sure unitPrice is a number
                        uom: item.uom || "PCS", // Default to "PCS" if uom is undefined
                        itemName: item.itemName || "Unknown Item", // Default to "Unknown Item" if itemName is undefined
                        totalPrice: item.quantity * Number(item.unitPrice), // Ensure totalPrice is calculated
                    })),
                },
            },
            include: { purchaseOrderItems: true }, // Ensure to include purchaseOrderItems in the response
        });

        res.status(201).json({ message: "Purchase Order created successfully", purchaseOrder: newPurchaseOrder });
    } catch (error) {
        console.error("Error creating purchase order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Purchase Orders (Filtered by Organization)
export const getPurchaseOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = (req as any).user.role;
        const userOrgId = (req as any).user.organizationId;
        let { organizationId } = req.query;

        if (userRole !== "super_admin") {
            organizationId = userOrgId;
        } else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }

        const purchaseOrders = await prisma.purchaseOrder.findMany({
            include: {
                supplier: true,
                purchaseOrderItems: {
                    include: { 
                        item: true, 
                    },
                },
            },
            where: { organizationId: Number(organizationId) }
        });

        // Fetch supplier prices separately
        const formattedOrders = await Promise.all(purchaseOrders.map(async (order) => {
            const updatedItems = await Promise.all(order.purchaseOrderItems.map(async (poItem) => {
                const supplierProduct = await prisma.supplierItem.findFirst({
                    where: {
                        supplierId: order.supplierId, // Find supplier's price for this item
                        itemId: poItem.itemId,
                    },
                    select: { supply_price: true },
                });

                return {
                    ...poItem,
                    ...poItem.item,
                    itemId: poItem.item.id,
                    supplierUnitPrice: supplierProduct?.supply_price || null, // Assign supplier's unit price
                };
            }));

            return {
                ...order,
                purchaseOrderItems: updatedItems,
            };
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error("Error fetching purchase orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// Get Single Purchase Order by ID
export const getPurchaseOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { purchaseOrderId } = req.params;

        // Validate if ID exists and is a valid number
        if (!purchaseOrderId || isNaN(Number(purchaseOrderId))) {
            res.status(400).json({ message: "Invalid purchase order ID" });
            return;
        }

        const purchaseOrder = await prisma.purchaseOrder.findUnique({
            where: { id: Number(purchaseOrderId) },
            include: {
                supplier: true,
                purchaseOrderItems: { include: { item: true } },
            },
        });

        if (!purchaseOrder) {
            res.status(404).json({ message: "Purchase order not found" });
            return;
        }

        // Merge item properties into purchaseOrderItems
        const formattedOrder = {
            ...purchaseOrder,
            purchaseOrderItems: purchaseOrder.purchaseOrderItems.map(poItem => ({
                ...poItem,
                ...poItem.item, // Merge all item properties into purchaseOrderItems
                itemId: poItem.item.id, // Rename item id to avoid confusion
            }))
        };

        res.status(200).json(formattedOrder);
    } catch (error) {
        console.error("Error fetching purchase order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Purchase Order (Status, Expected Date, etc.)
export const updatePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid purchase order ID" });
            return;
        }

        const { status, expectedDate, receivedDate, updatedBy, totalAmount, remarks } = req.body;

        const updatedPurchaseOrder = await prisma.purchaseOrder.update({
            where: { id: Number(id) },
            data: { status, expectedDate, receivedDate, updatedBy, totalAmount: Number(totalAmount), remarks },
        });

        res.status(200).json({ message: "Purchase order updated successfully", purchaseOrder: updatedPurchaseOrder });
    } catch (error) {
        console.error("Error updating purchase order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Purchase Order
export const deletePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid purchase order ID" });
            return;
        }

        const existingOrder = await prisma.purchaseOrder.findUnique({ where: { id: Number(id) } });
        if (!existingOrder) {
            res.status(404).json({ message: "Purchase order not found" });
            return;
        }

        await prisma.purchaseOrder.delete({ where: { id: Number(id) } });

        res.status(200).json({ message: "Purchase order deleted successfully" });
    } catch (error) {
        console.error("Error deleting purchase order:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Receive Purchase Order (Update Received Quantities)
export const receivePurchaseOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { receivedItems, receivedDate } = req.body;  // Expecting receivedItems and receivedDate from the frontend

        const purchaseOrder = await prisma.purchaseOrder.findUnique({
            where: { id: Number(id) },
            include: { purchaseOrderItems: true },
        });

        if (!purchaseOrder) {
            res.status(404).json({ message: "Purchase order not found" });
            return;
        }

        if (purchaseOrder.status === PurchaseOrderStatus.CANCELLED || purchaseOrder.status === PurchaseOrderStatus.REJECTED) {
            res.status(400).json({ message: "Cannot receive a canceled or rejected purchase order" });
            return;
        }

        for (const receivedItem of receivedItems) {
            const purchaseOrderItem = purchaseOrder.purchaseOrderItems.find(item => item.id === receivedItem.itemId);
            if (purchaseOrderItem) {
                await prisma.purchaseOrderItem.update({
                    where: { id: receivedItem.itemId },
                    data: { receivedQuantity: receivedItem.receivedQuantity },
                });
            }
        }

        const allReceived = purchaseOrder.purchaseOrderItems.every(
            (item) => item.receivedQuantity && item.receivedQuantity >= item.quantity
        );

        let updatedStatus: PurchaseOrderStatus = purchaseOrder.status;

        if (purchaseOrder.status === PurchaseOrderStatus.PENDING) {
            updatedStatus = PurchaseOrderStatus.OPEN; // Change from PENDING to OPEN when items are received
        }

        if (allReceived) {
            updatedStatus = PurchaseOrderStatus.COMPLETED;
            await prisma.purchaseOrder.update({
                where: { id: Number(id) },
                data: { status: updatedStatus, receivedDate: new Date(receivedDate) },  // Use receivedDate here
            });
        } else {
            if (updatedStatus === PurchaseOrderStatus.PENDING) {
                updatedStatus = PurchaseOrderStatus.OPEN;
            }

            await prisma.purchaseOrder.update({
                where: { id: Number(id) },
                data: { status: updatedStatus },
            });
        }

        res.status(200).json({ message: "Purchase order received successfully", status: updatedStatus });
    } catch (error) {
        console.error("Error receiving purchase order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

