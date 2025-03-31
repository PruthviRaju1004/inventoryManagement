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
exports.receivePurchaseOrder = exports.deletePurchaseOrder = exports.updatePurchaseOrder = exports.getPurchaseOrderById = exports.getPurchaseOrders = exports.createPurchaseOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create Purchase Order (Only Super Admin or Organization Admin)
const createPurchaseOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRole = req.user.role;
    if (userRole === "viewer") {
        res.status(403).json({ message: "Forbidden: Only super admins or organization admins can create purchase orders" });
        return;
    }
    try {
        const { organizationId, supplierId, totalAmount, orderDate, expectedDate, purchaseOrderItems, receivedDate, remarks } = req.body;
        const userId = req.user.id;
        if (!Array.isArray(purchaseOrderItems)) {
            res.status(400).json({ message: "purchaseOrderItems must be a non-empty array" });
            return;
        }
        const generateOrderNumber = () => {
            // This can be a more sophisticated generation logic if required
            return `PO-${Math.floor(Math.random() * 1000000)}`;
        };
        const orderNumberToUse = generateOrderNumber();
        const newPurchaseOrder = yield prisma.purchaseOrder.create({
            data: {
                organizationId,
                supplierId,
                orderNumber: orderNumberToUse,
                status: client_1.PurchaseOrderStatus.PENDING,
                totalAmount,
                orderDate,
                expectedDate,
                receivedDate,
                remarks,
                createdBy: Number(userId),
                updatedBy: Number(userId),
                purchaseOrderItems: {
                    create: purchaseOrderItems.map((item) => ({
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
    }
    catch (error) {
        console.error("Error creating purchase order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createPurchaseOrder = createPurchaseOrder;
// Get Purchase Orders (Filtered by Organization)
const getPurchaseOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        const userOrgId = req.user.organizationId;
        let { organizationId, status } = req.query;
        if (userRole !== "super_admin") {
            organizationId = userOrgId;
        }
        else if (!organizationId) {
            res.status(400).json({ message: "Organization ID is required for super admins" });
            return;
        }
        const whereClause = { organizationId: Number(organizationId) };
        if (status) {
            whereClause.status = status;
        }
        const purchaseOrders = yield prisma.purchaseOrder.findMany({
            where: whereClause,
            include: {
                supplier: true,
                purchaseOrderItems: true
            },
        });
        // Fetch supplier prices separately
        const formattedOrders = yield Promise.all(purchaseOrders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedItems = yield Promise.all(order.purchaseOrderItems.map((poItem) => __awaiter(void 0, void 0, void 0, function* () {
                const supplierProduct = yield prisma.supplierItem.findFirst({
                    where: {
                        supplierId: order.supplierId, // Find supplier's price for this item
                        itemId: poItem.itemId,
                    },
                    select: { supply_price: true },
                });
                return Object.assign(Object.assign({}, poItem), { itemId: poItem.itemId, supplierUnitPrice: (supplierProduct === null || supplierProduct === void 0 ? void 0 : supplierProduct.supply_price) || null });
            })));
            return Object.assign(Object.assign({}, order), { purchaseOrderItems: updatedItems });
        })));
        res.status(200).json(formattedOrders);
    }
    catch (error) {
        console.error("Error fetching purchase orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getPurchaseOrders = getPurchaseOrders;
// Get Single Purchase Order by ID
const getPurchaseOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { purchaseOrderId } = req.params;
        // Validate if ID exists and is a valid number
        if (!purchaseOrderId || isNaN(Number(purchaseOrderId))) {
            res.status(400).json({ message: "Invalid purchase order ID" });
            return;
        }
        const purchaseOrder = yield prisma.purchaseOrder.findUnique({
            where: { id: Number(purchaseOrderId) },
            include: {
                supplier: true,
                purchaseOrderItems: true,
            },
        });
        if (!purchaseOrder) {
            res.status(404).json({ message: "Purchase order not found" });
            return;
        }
        // Merge item properties into purchaseOrderItems
        const formattedOrder = Object.assign(Object.assign({}, purchaseOrder), { purchaseOrderItems: purchaseOrder.purchaseOrderItems.map(poItem => (Object.assign({}, poItem))) });
        res.status(200).json(formattedOrder);
    }
    catch (error) {
        console.error("Error fetching purchase order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getPurchaseOrderById = getPurchaseOrderById;
// Update Purchase Order (Status, Expected Date, etc.)
const updatePurchaseOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid purchase order ID" });
            return;
        }
        const { status, expectedDate, receivedDate, updatedBy, totalAmount, remarks } = req.body;
        const updatedPurchaseOrder = yield prisma.purchaseOrder.update({
            where: { id: Number(id) },
            data: { status, expectedDate, receivedDate, updatedBy, totalAmount: Number(totalAmount), remarks },
        });
        res.status(200).json({ message: "Purchase order updated successfully", purchaseOrder: updatedPurchaseOrder });
    }
    catch (error) {
        console.error("Error updating purchase order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updatePurchaseOrder = updatePurchaseOrder;
// Delete Purchase Order
const deletePurchaseOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            res.status(400).json({ message: "Invalid purchase order ID" });
            return;
        }
        const existingOrder = yield prisma.purchaseOrder.findUnique({ where: { id: Number(id) } });
        if (!existingOrder) {
            res.status(404).json({ message: "Purchase order not found" });
            return;
        }
        yield prisma.purchaseOrder.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Purchase order deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting purchase order:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deletePurchaseOrder = deletePurchaseOrder;
// Receive Purchase Order (Update Received Quantities)
const receivePurchaseOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { receivedItems, receivedDate } = req.body; // Expecting receivedItems and receivedDate from the frontend
        const purchaseOrder = yield prisma.purchaseOrder.findUnique({
            where: { id: Number(id) },
            include: { purchaseOrderItems: true },
        });
        if (!purchaseOrder) {
            res.status(404).json({ message: "Purchase order not found" });
            return;
        }
        if (purchaseOrder.status === client_1.PurchaseOrderStatus.CANCELLED || purchaseOrder.status === client_1.PurchaseOrderStatus.REJECTED) {
            res.status(400).json({ message: "Cannot receive a canceled or rejected purchase order" });
            return;
        }
        for (const receivedItem of receivedItems) {
            const purchaseOrderItem = purchaseOrder.purchaseOrderItems.find(item => item.id === receivedItem.itemId);
            if (purchaseOrderItem) {
                yield prisma.purchaseOrderItem.update({
                    where: { id: receivedItem.itemId },
                    data: { receivedQuantity: receivedItem.receivedQuantity },
                });
            }
        }
        const allReceived = purchaseOrder.purchaseOrderItems.every((item) => item.receivedQuantity && item.receivedQuantity >= item.quantity);
        let updatedStatus = purchaseOrder.status;
        if (purchaseOrder.status === client_1.PurchaseOrderStatus.PENDING) {
            updatedStatus = client_1.PurchaseOrderStatus.OPEN; // Change from PENDING to OPEN when items are received
        }
        if (allReceived) {
            updatedStatus = client_1.PurchaseOrderStatus.COMPLETED;
            yield prisma.purchaseOrder.update({
                where: { id: Number(id) },
                data: { status: updatedStatus, receivedDate: new Date(receivedDate) }, // Use receivedDate here
            });
        }
        else {
            if (updatedStatus === client_1.PurchaseOrderStatus.PENDING) {
                updatedStatus = client_1.PurchaseOrderStatus.OPEN;
            }
            yield prisma.purchaseOrder.update({
                where: { id: Number(id) },
                data: { status: updatedStatus },
            });
        }
        res.status(200).json({ message: "Purchase order received successfully", status: updatedStatus });
    }
    catch (error) {
        console.error("Error receiving purchase order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.receivePurchaseOrder = receivePurchaseOrder;
