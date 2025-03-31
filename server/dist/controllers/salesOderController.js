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
exports.getSalesSummary = exports.deleteSalesOrder = exports.updateSalesOrder = exports.getSalesOrderById = exports.getAllSalesOrders = exports.createSalesOrder = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
// Create a new Sales Order
const createSalesOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId, warehouseId, customerId, status, totalAmount, amountPaid, paymentStatus, orderDate, expectedDate, remarks, salesOrderItems, discount, tax, } = req.body;
        const userId = req.user.id;
        // Ensure warehouse has enough stock before creating the order
        for (const item of salesOrderItems) {
            const inventory = yield prisma.inventoryReport.findFirst({
                where: { itemId: item.itemId, warehouseId: warehouseId }
            });
            if (!inventory || inventory.providedQuantity < item.quantity) {
                res.status(400).json({ message: `Not enough stock for item ${item.itemId}` });
                return;
            }
        }
        const generateOrderNumber = () => {
            return `IN-${Math.floor(Math.random() * 1000000)}`;
        };
        const orderNumberToUse = generateOrderNumber();
        // Ensure date is in ISO format
        const parsedOrderDate = new Date(orderDate);
        const parsedExpectedDate = new Date(expectedDate);
        if (isNaN(parsedOrderDate.getTime()) || isNaN(parsedExpectedDate.getTime())) {
            res.status(400).json({ error: "Invalid date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)" });
            return;
        }
        const outstandingAmountValue = totalAmount - amountPaid;
        const salesOrder = yield prisma.salesOrder.create({
            data: {
                orderNumber: orderNumberToUse,
                status,
                totalAmount,
                amountPaid,
                tax,
                discount,
                outstandingAmount: outstandingAmountValue,
                paymentStatus,
                orderDate: parsedOrderDate, // Ensure correct date format
                expectedDate: parsedExpectedDate, // Ensure correct date format
                remarks,
                createdBy: Number(userId),
                updatedBy: Number(userId),
                organization: { connect: { id: organizationId } },
                warehouse: { connect: { id: warehouseId } },
                customer: { connect: { id: customerId } },
                salesOrderItems: {
                    create: salesOrderItems.map((item) => ({
                        // itemId: item.itemId,
                        item: { connect: { id: item.itemId } },
                        itemName: item.itemName, // Fix typo from `itemNamw`
                        warehouse: { connect: { id: warehouseId } },
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        createdBy: Number(userId),
                        updatedBy: Number(userId),
                    }))
                }
            },
            include: { salesOrderItems: true }
        });
        res.status(201).json(salesOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create sales order' });
    }
});
exports.createSalesOrder = createSalesOrder;
// Get all Sales Orders
// Get all Sales Orders with status and paymentStatus filters
const getAllSalesOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { organizationId, status, paymentStatus } = req.query;
    try {
        const whereConditions = { organizationId: Number(organizationId) };
        // Add filters for status and paymentStatus if provided
        if (status) {
            whereConditions.status = status;
        }
        if (paymentStatus) {
            whereConditions.paymentStatus = paymentStatus;
        }
        const salesOrders = yield prisma.salesOrder.findMany({
            where: whereConditions, // Use the constructed where object
            include: {
                salesOrderItems: true,
                customer: true,
                warehouse: true,
            },
        });
        res.status(200).json(salesOrders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch sales orders' });
    }
});
exports.getAllSalesOrders = getAllSalesOrders;
// Get a Single Sales Order by ID
const getSalesOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { salesOrderId } = req.params;
        const salesOrder = yield prisma.salesOrder.findUnique({
            where: { id: parseInt(salesOrderId) },
            include: {
                salesOrderItems: true,
                customer: true,
                warehouse: true
            }
        });
        if (!salesOrder) {
            res.status(404).json({ message: 'Sales Order not found' });
            return;
        }
        res.status(200).json(salesOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch sales order' });
    }
});
exports.getSalesOrderById = getSalesOrderById;
// Update a Sales Order
const updateSalesOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, paymentStatus, remarks, updatedBy, amountPaid, totalAmount, tax, discount } = req.body;
        const outstandingAmountValue = totalAmount - amountPaid;
        const updatedOrder = yield prisma.salesOrder.update({
            where: { id: parseInt(id) },
            data: { status, paymentStatus, remarks, amountPaid, totalAmount, tax, discount, outstandingAmount: outstandingAmountValue, updatedBy },
            include: { salesOrderItems: true }
        });
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update sales order' });
    }
});
exports.updateSalesOrder = updateSalesOrder;
// Delete a Sales Order
const deleteSalesOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.salesOrderItem.deleteMany({ where: { salesOrderId: parseInt(id) } });
        yield prisma.salesOrder.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Sales Order deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete sales order' });
    }
});
exports.deleteSalesOrder = deleteSalesOrder;
const getSalesSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { organizationId } = req.query;
        if (!organizationId) {
            res.status(400).json({ error: "organizationId is required" });
            return;
        }
        const orgId = Number(organizationId);
        // Date Ranges
        const today = (0, date_fns_1.startOfDay)(new Date());
        const thisWeek = (0, date_fns_1.startOfWeek)(new Date());
        const thisMonth = (0, date_fns_1.startOfMonth)(new Date());
        const thisQuarter = (0, date_fns_1.startOfQuarter)(new Date());
        const thisYear = (0, date_fns_1.startOfYear)(new Date());
        // Helper function to fetch sales for a given date range
        const getSalesTotal = (from) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.salesOrder.aggregate({
                where: { organizationId: orgId, orderDate: { gte: from } },
                _sum: { totalAmount: true },
            });
        });
        // Fetch sales data in parallel
        const [salesToday, salesThisWeek, salesThisMonth, salesThisQuarter, salesThisYear] = yield Promise.all([
            getSalesTotal(today),
            getSalesTotal(thisWeek),
            getSalesTotal(thisMonth),
            getSalesTotal(thisQuarter),
            getSalesTotal(thisYear),
        ]);
        // Get Top & Least Selling Products
        const salesData = yield prisma.salesOrderItem.findMany({
            where: { salesOrder: { organizationId: orgId } },
            select: {
                itemId: true,
                itemName: true,
                quantity: true,
            },
        });
        const productSalesMap = new Map();
        salesData.forEach(({ itemId, itemName, quantity }) => {
            if (!productSalesMap.has(itemId)) {
                productSalesMap.set(itemId, { itemName, quantity: quantity.toNumber() });
            }
            else {
                productSalesMap.get(itemId).quantity += quantity.toNumber();
            }
        });
        const sortedProducts = Array.from(productSalesMap.values()).sort((a, b) => b.quantity - a.quantity);
        const topSellingProducts = sortedProducts.slice(0, 5);
        const leastSellingProducts = sortedProducts.slice(-5);
        // Get Profit Margin Data
        const profitMarginData = yield prisma.salesOrderItem.findMany({
            where: { salesOrder: { organizationId: orgId } },
            select: {
                itemId: true,
                itemName: true,
                unitPrice: true,
                quantity: true,
                item: { select: { costPrice: true } }, // Assuming costPrice exists
            },
        });
        const profitMargins = profitMarginData.map(({ itemId, itemName, unitPrice, quantity, item }) => ({
            itemId,
            itemName,
            unitPrice,
            profitMargin: (Number(unitPrice) - Number(item.costPrice || 0)) * Number(quantity),
        }));
        const sortedProfitMargins = profitMargins.sort((a, b) => b.profitMargin - a.profitMargin);
        const topProfitMarginProducts = sortedProfitMargins.slice(0, 5);
        const leastProfitMarginProducts = sortedProfitMargins.slice(-5);
        // Response
        res.status(200).json({
            salesSummary: {
                today: ((_a = salesToday._sum) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
                thisWeek: ((_b = salesThisWeek._sum) === null || _b === void 0 ? void 0 : _b.totalAmount) || 0,
                thisMonth: ((_c = salesThisMonth._sum) === null || _c === void 0 ? void 0 : _c.totalAmount) || 0,
                thisQuarter: ((_d = salesThisQuarter._sum) === null || _d === void 0 ? void 0 : _d.totalAmount) || 0,
                thisYear: ((_e = salesThisYear._sum) === null || _e === void 0 ? void 0 : _e.totalAmount) || 0,
            },
            topSellingProducts,
            leastSellingProducts,
            topProfitMarginProducts,
            leastProfitMarginProducts,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch sales summary" });
    }
});
exports.getSalesSummary = getSalesSummary;
