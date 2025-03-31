import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfDay } from "date-fns";
const prisma = new PrismaClient();

// Create a new Sales Order
export const createSalesOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            organizationId,
            warehouseId,
            customerId,
            status,
            totalAmount,
            amountPaid,
            paymentStatus,
            orderDate,
            expectedDate,
            remarks,
            salesOrderItems,
            discount,
            tax,
        } = req.body;

        const userId = (req as any).user.id;

        // Ensure warehouse has enough stock before creating the order
        for (const item of salesOrderItems) {
            const inventory = await prisma.inventoryReport.findFirst({
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
        const salesOrder = await prisma.salesOrder.create({
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
                    create: salesOrderItems.map((item: { itemId: number; itemName: string; quantity: number; unitPrice: number; totalPrice: number }) => ({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create sales order' });
    }
};

// Get all Sales Orders
// Get all Sales Orders with status and paymentStatus filters
export const getAllSalesOrders = async (req: Request, res: Response): Promise<void> => {
    let { organizationId, status, paymentStatus } = req.query;
    try {
        const whereConditions: any = { organizationId: Number(organizationId) };
        // Add filters for status and paymentStatus if provided
        if (status) {
            whereConditions.status = status;
        }
        if (paymentStatus) {
            whereConditions.paymentStatus = paymentStatus;
        }
        const salesOrders = await prisma.salesOrder.findMany({
            where: whereConditions,  // Use the constructed where object
            include: {
                salesOrderItems: true,
                customer: true,
                warehouse: true,
            },
        });
        res.status(200).json(salesOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch sales orders' });
    }
};

// Get a Single Sales Order by ID
export const getSalesOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { salesOrderId } = req.params;
        const salesOrder = await prisma.salesOrder.findUnique({
            where: { id: parseInt(salesOrderId) },
            include: {
                salesOrderItems: true,
                customer: true,
                warehouse: true
            }
        });

        if (!salesOrder) {
            res.status(404).json({ message: 'Sales Order not found' });
            return
        }

        res.status(200).json(salesOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch sales order' });
    }
};

// Update a Sales Order
export const updateSalesOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, paymentStatus, remarks, updatedBy, amountPaid, totalAmount, tax, discount } = req.body;
        const outstandingAmountValue = totalAmount - amountPaid;

        const updatedOrder = await prisma.salesOrder.update({
            where: { id: parseInt(id) },
            data: { status, paymentStatus, remarks, amountPaid, totalAmount, tax, discount, outstandingAmount:outstandingAmountValue,updatedBy },
            include: { salesOrderItems: true }
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update sales order' });
    }
};

// Delete a Sales Order
export const deleteSalesOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.salesOrderItem.deleteMany({ where: { salesOrderId: parseInt(id) } });
        await prisma.salesOrder.delete({ where: { id: parseInt(id) } });

        res.status(200).json({ message: 'Sales Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete sales order' });
    }
};

export const getSalesSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const { organizationId } = req.query;
        if (!organizationId) {
            res.status(400).json({ error: "organizationId is required" });
            return;
        }

        const orgId = Number(organizationId);

        // Date Ranges
        const today = startOfDay(new Date());
        const thisWeek = startOfWeek(new Date());
        const thisMonth = startOfMonth(new Date());
        const thisQuarter = startOfQuarter(new Date());
        const thisYear = startOfYear(new Date());

        // Helper function to fetch sales for a given date range
        const getSalesTotal = async (from: Date) => {
            return await prisma.salesOrder.aggregate({
                where: { organizationId: orgId, orderDate: { gte: from } },
                _sum: { totalAmount: true },
            });
        };

        // Fetch sales data in parallel
        const [salesToday, salesThisWeek, salesThisMonth, salesThisQuarter, salesThisYear] = await Promise.all([
            getSalesTotal(today),
            getSalesTotal(thisWeek),
            getSalesTotal(thisMonth),
            getSalesTotal(thisQuarter),
            getSalesTotal(thisYear),
        ]);

        // Get Top & Least Selling Products
        const salesData = await prisma.salesOrderItem.findMany({
            where: { salesOrder: { organizationId: orgId } },
            select: {
                itemId: true,
                itemName: true,
                quantity: true,
            },
        });

        const productSalesMap = new Map<number, { itemName: string; quantity: number }>();

        salesData.forEach(({ itemId, itemName, quantity }) => {
            if (!productSalesMap.has(itemId)) {
                productSalesMap.set(itemId, { itemName, quantity: quantity.toNumber() });
            } else {
                productSalesMap.get(itemId)!.quantity += quantity.toNumber();
            }
        });

        const sortedProducts = Array.from(productSalesMap.values()).sort((a, b) => b.quantity - a.quantity);

        const topSellingProducts = sortedProducts.slice(0, 5);
        const leastSellingProducts = sortedProducts.slice(-5);

        // Get Profit Margin Data
        const profitMarginData = await prisma.salesOrderItem.findMany({
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
                today: salesToday._sum?.totalAmount || 0,
                thisWeek: salesThisWeek._sum?.totalAmount || 0,
                thisMonth: salesThisMonth._sum?.totalAmount || 0,
                thisQuarter: salesThisQuarter._sum?.totalAmount || 0,
                thisYear: salesThisYear._sum?.totalAmount || 0,
            },
            topSellingProducts,
            leastSellingProducts,
            topProfitMarginProducts,
            leastProfitMarginProducts,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch sales summary" });
    }
};