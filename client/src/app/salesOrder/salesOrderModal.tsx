import { useState, useMemo, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, IconButton,
    TextField, MenuItem, Typography, List, ListItem, ListItemText
} from "@mui/material";
import {
    useGetCustomersQuery,
    useGetWarehousesQuery,
    useGetWarehouseProductsQuery,
    useCreateSalesOrderMutation,
    useUpdateSalesOrderMutation,
    SalesOrder,
    PaymentStatus
} from "../../state/api";
import { X } from "lucide-react";
import { SalesOrderStatus } from "../../state/api";

const validStatusTransitions: Record<SalesOrderStatus, SalesOrderStatus[]> = {
    PENDING: [SalesOrderStatus.PENDING, SalesOrderStatus.CONFIRMED, SalesOrderStatus.CANCELLED, SalesOrderStatus.SHIPPED, SalesOrderStatus.DELIVERED],
    CONFIRMED: [SalesOrderStatus.CONFIRMED, SalesOrderStatus.DELIVERED, SalesOrderStatus.CANCELLED, SalesOrderStatus.SHIPPED],
    SHIPPED: [SalesOrderStatus.SHIPPED, SalesOrderStatus.DELIVERED, SalesOrderStatus.CANCELLED],
    DELIVERED: [SalesOrderStatus.DELIVERED, SalesOrderStatus.CANCELLED],
    CANCELLED: [SalesOrderStatus.CANCELLED],
};

const SalesOrderModal = ({ salesOrder, organizationId, onClose }: { salesOrder: SalesOrder | null; organizationId: number | null; onClose: () => void }) => {
    const [customerId, setCustomerId] = useState("");
    const [warehouseId, setWarehouseId] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [expectedDate, setExpectedDate] = useState("");
    const [status, setStatus] = useState(salesOrder?.status || "PENDING");
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [amountPaid, setAmountPaid] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
    const [selectedProducts, setSelectedProducts] = useState<{
        sellingPrice: number; itemId: number; itemName: string; quantity: number; unitCost: number; unitPrice: Number; totalPrice: number; availableQuantity: number 
}[]>([]);

    const { data: customers = [] } = useGetCustomersQuery({ organizationId: organizationId ?? 0 });
    const { data: warehouses = [] } = useGetWarehousesQuery({ organizationId: organizationId ?? 0 });
    const { data: warehouseProducts = [] } = useGetWarehouseProductsQuery(Number(warehouseId), { skip: !warehouseId });

    const [createSalesOrder] = useCreateSalesOrderMutation();
    const [updateSalesOrder] = useUpdateSalesOrderMutation();

    const totalAmount = useMemo(() => {
        const subTotal = selectedProducts.reduce((sum, product) => sum + product.quantity * Number(product.sellingPrice), 0);
        const discountAmount = (discount / 100) * subTotal;
        const taxAmount = (tax / 100) * (subTotal - discountAmount);
        return subTotal - discountAmount + taxAmount;
    }, [selectedProducts, discount, tax]);
    const formatDate = (date: string) => {
        const dateObj = new Date(date);
        const localDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
        return localDate.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (salesOrder) {
            setCustomerId(salesOrder.customerId.toString());
            setWarehouseId(salesOrder.warehouseId.toString());
            setOrderNumber(salesOrder.orderNumber);
            setOrderDate(salesOrder.orderDate ? formatDate(salesOrder.orderDate) : "");
            setExpectedDate(salesOrder.expectedDate ? formatDate(salesOrder.expectedDate) : "");
            setPaymentStatus(salesOrder.paymentStatus);
            setAmountPaid(salesOrder.amountPaid || 0);
            setStatus(salesOrder.status);
            setRemarks(salesOrder.remarks || "");
            setDiscount(salesOrder.discount || 0);
            setTax(salesOrder.tax || 0);
            setSelectedProducts(
                salesOrder.salesOrderItems.map(item => ({
                    itemId: item.itemId,
                    itemName: item.itemName,
                    quantity: item.quantity,
                    unitCost: item.unitPrice, // Assuming unitCost is the same as unitPrice
                    unitPrice: item.unitPrice,
                    sellingPrice: item.unitPrice, // Add sellingPrice property
                    totalPrice: item.quantity * item.unitPrice,
                    availableQuantity: 0, // Add default value for availableQuantity
                })) || []
            );
        }
    }, [salesOrder]);

    const handleQuantityChange = (itemId: number, quantity: number) => {
        setSelectedProducts((prev) => {
            const product = warehouseProducts.find((p: { itemId: number; availableQuantity: number; unitPrice: number; sellinPrice: number }) => p.itemId === itemId);
            // console.log("product", product);
            if (!product) return prev;
            const availableQuantity = product.providedQuantity;
            const existingProduct = prev.find((p) => p.itemId === itemId);

            if (existingProduct) {
                // Update existing product
                return prev.map((p) =>
                    p.itemId === itemId
                        ? { ...p, quantity: Math.min(quantity, availableQuantity), totalPrice: Math.min(quantity, availableQuantity) * Number(p.unitPrice) }
                        : p
                );
            } else {
                // Add new product to selectedProducts
                return [
                    ...prev,
                    {
                        itemId,
                        itemName: product.itemName, // Add itemName property
                        quantity: Math.min(quantity, availableQuantity),
                        unitCost: product.unitCost || 0, // Ensure unit cost exists
                        unitPrice: product.sellingPrice || 0, // Ensure unit price exists
                        sellingPrice: product.sellingPrice || 0, // Add sellingPrice property
                        totalPrice: Math.min(quantity, availableQuantity) * (product.sellingPrice || 0),
                        availableQuantity: product.availableQuantity, // Add availableQuantity property
                    },
                ];
            }
        });
    };

    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts((prev) => prev.filter((p) => p.itemId !== productId));
    };
    const handleProductSelect = (event: any, newValue: any) => {
        if (newValue) {
            const exists = selectedProducts.find((p) => p.itemId === newValue.itemId);
            // console.log("selectedProducts", selectedProducts);
            if (!exists) {
                setSelectedProducts([...selectedProducts, { ...newValue, quantity: 1 }]);
            }
        }
    };

    if (!validStatusTransitions[(salesOrder?.status as SalesOrderStatus) || "PENDING"].includes(status as SalesOrderStatus)) {
        alert("Invalid status transition!");
        return;
    }
    const handleSubmit = async () => {
        // if (!validStatusTransitions[salesOrder?.status || "PENDING"].includes(status)) {
        //   alert("Invalid status transition!");
        //   return;
        // }
        const orderData = {
            organizationId: organizationId ?? 0,
            customerId: Number(customerId),
            warehouseId: Number(warehouseId),
            orderDate,
            expectedDate,
            discount,
            tax,
            status: salesOrder ? (status as SalesOrderStatus) : ("PENDING" as SalesOrderStatus | undefined),
            remarks,
            totalAmount: Number(totalAmount),
            paymentStatus: paymentStatus,
            amountPaid: Number(amountPaid), // Add the missing amountPaid property
            salesOrderItems: selectedProducts.map(product => ({
                id: 0, // Default value, replace with actual id if available
                salesOrderId: salesOrder?.id || 0, // Default value, replace with actual salesOrderId if available
                itemId: product.itemId,
                quantity: product.quantity,
                unitPrice: Number(product.sellingPrice),
                itemName: product.itemName,
                totalPrice: product.quantity * Number(product.sellingPrice),
            })),
        };
        // console.log(orderData);

        if (salesOrder) {
            await updateSalesOrder({ id: salesOrder.id, data: orderData });
        } else {
            await createSalesOrder(orderData);
        }
        onClose();
    };

    return (
        <Dialog open onClose={onClose} sx={{
            '& .MuiDialogContainer-root': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            '& .MuiDialog-paper': {
                width: '500px', // Set your desired width
                margin: 'auto', // Center the modal
            },
        }}>
            <DialogTitle>{salesOrder ? "Update Sales Order" : "Create Sales Order"}</DialogTitle>
            <DialogContent>
                {salesOrder && <TextField label="Order Number" value={orderNumber} disabled fullWidth margin="dense" />}
                <TextField select label="Customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} fullWidth margin="dense">
                    {customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
                    ))}
                </TextField>
                <TextField select label="Warehouse" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} fullWidth margin="dense">
                    {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>
                    ))}
                </TextField>
                <div>
                    <label htmlFor="orderDate">Order Date</label>
                    <TextField type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} fullWidth margin="dense" />
                </div>
                <div>
                    <label htmlFor="expectedDate">Expected Date</label>
                    <TextField type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} fullWidth margin="dense" />
                </div>
                <TextField select label="Sales Order Status" value={status} onChange={(e) => setStatus(e.target.value as SalesOrderStatus)} fullWidth margin="dense">
                    {validStatusTransitions[salesOrder?.status || "PENDING"].map((statusOption) => (
                        <MenuItem key={statusOption} value={statusOption}>{statusOption}</MenuItem>
                    ))}
                </TextField>

                <TextField select label="Payment Status" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)} fullWidth margin="dense">
                    {Object.values(PaymentStatus).map((payStatus) => (
                        <MenuItem key={payStatus} value={payStatus}>{payStatus}</MenuItem>
                    ))}
                </TextField>
                {warehouseProducts.length > 0 ? (
                    <>
                        <Typography variant="h6" sx={{ mt: 2 }}>Selected Products</Typography>
                        <Autocomplete
                            options={warehouseProducts}
                            getOptionLabel={(option) => option.itemName}
                            onChange={handleProductSelect}
                            renderInput={(params) => <TextField {...params} label="Select Product" />}
                        />
                        <List>
                            {selectedProducts.map((product) => (
                                <ListItem key={product.itemId}>
                                    <ListItemText primary={product.itemName}
                                        secondary={`Cost: ${product.sellingPrice}`} />
                                    <TextField
                                        type="number"
                                        label="Quantity"
                                        inputMode="numeric"
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                        value={selectedProducts.find((p) => p.itemId === product.itemId)?.quantity || ""}
                                        onChange={(e) => handleQuantityChange(product.itemId, Number(e.target.value))}
                                        size="small"
                                        sx={{ width: 80 }}
                                    />
                                    <IconButton onClick={() => handleRemoveProduct(product.itemId)}>
                                        <X size={20} />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>

                    </>
                ) : <Typography variant="body2">No products found.</Typography>}
                <TextField
                    label="Discount (%)"
                    type="number"
                    inputMode="numeric"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()} // Prevent scroll from changing the value
                    value={discount === 0 ? "" : discount} // Avoid appending to existing zero
                    onChange={(e) => {
                        const value = e.target.value;
                        setDiscount(value === "" ? 0 : Math.max(0, Number(value)));
                    }}
                    fullWidth
                    margin="dense"
                />

                <TextField
                    label="Tax (%)"
                    type="number"
                    inputMode="numeric"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    value={tax === 0 ? "" : tax}
                    onChange={(e) => {
                        const value = e.target.value;
                        setTax(value === "" ? 0 : Math.max(0, Number(value)));
                    }}
                    fullWidth
                    margin="dense"
                />
                <Typography variant="h6" sx={{ mt: 2 }}>Total Amount: {Number(totalAmount).toFixed(2)}</Typography>
                {salesOrder &&
                    <TextField label="Amount Paid" name="name" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} fullWidth margin="normal" required />
                }
                <TextField
                    label="Remarks"
                    value={remarks ? remarks : ""}
                    onChange={(e) => setRemarks(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />
            </DialogContent>
            <DialogActions>
                <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                <button type="submit" onClick={handleSubmit} className="btn-primary">{salesOrder ? "Update" : "Create"}</button>
            </DialogActions>
        </Dialog>
    );
};

export default SalesOrderModal;