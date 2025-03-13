import { useState, useMemo, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, MenuItem, Typography, List, ListItem, ListItemText, Box
} from "@mui/material";
import {
    useGetSuppliersQuery, useCreateGRNMutation, useGetSupplierItemsQuery, useGetPurchaseOrderByIdQuery,
    useUpdateGRNMutation, useGetWarehousesQuery, useGetSupplierPurchaseOrdersQuery
} from "../../state/api";

const validStatusTransitions: Record<string, string[]> = {
    Draft: ["Draft", "Approved", "Cancelled"],
    Approved: ["Approved", "Cancelled"],
    Cancelled: ["Cancelled"], // Cannot be changed
    Closed: ["Closed"] // Final state
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "PENDING":
            return "orange";
        case "APPROVED":
            return "green";
        case "CANCELLED":
            return "red";
        case "COMPLETED":
            return "blue";
        default:
            return "black";
    }
};

const GRNModal = ({ grn, organizationId, onClose }: { grn: any; organizationId: number | null; onClose: () => void }) => {
    const [supplierId, setSupplierId] = useState("");
    const [supplierName, setSupplierName] = useState("");
    const [warehouseId, setWarehouseId] = useState("");
    const [warehouseName, setWarehouseName] = useState("");
    const [poId, setPoId] = useState("");
    const [grnDate, setGrnDate] = useState("");
    const [receivedDate, setReceivedDate] = useState("");
    const [status, setStatus] = useState(grn?.status || "Draft");
    const [remarks, setRemarks] = useState("");
    const [grnNumber, setGrnNumber] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<{
        id?: number;
        itemId: number;
        itemName: string;
        orderedQty: number;
        receivedQty: number;
        unitPrice: number;
        uom: string;
        lineTotal: number;
        batchNumber?: string | null;
        manufacturingDate?: string | null;
        expiryDate?: string | null;
        storageLocation?: string | null;
        remarks?: string | null;
    }[]>([]);

    const { data: suppliers = [] } = useGetSuppliersQuery(organizationId ?? 0);
    const { data: supplierPurchaseOrders, error, isLoading } = useGetSupplierPurchaseOrdersQuery(
        Number(supplierId),
        { skip: !supplierId }
    );
    const { data: purchaseOrderDetails, isError } = useGetPurchaseOrderByIdQuery(Number(poId), {
        skip: !poId,
    });
    const { data: warehouses = [] } = useGetWarehousesQuery(organizationId ?? 0); // Fetch warehouses
    const [createGRN] = useCreateGRNMutation();
    const [updateGRN] = useUpdateGRNMutation();

    const totalAmount = useMemo(() => {
        return selectedProducts.reduce((sum, product) => sum + product.receivedQty * product.unitPrice, 0);
    }, [selectedProducts]);

    const formatDate = (date: string) => {
        const dateObj = new Date(date);
        const localDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
        return localDate.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (grn && suppliers.length > 0 && warehouses.length > 0) {
            setGrnNumber(grn.grnNumber);
            setSupplierId(grn.supplierId);
            setPoId(grn.poId);
            setSupplierName(grn.supplierName);
            setWarehouseId(grn.warehouseId);
            setWarehouseName(grn.warehouseName);
            setGrnDate(grn.grnDate ? formatDate(grn.grnDate) : "");
            setReceivedDate(grn.receivedDate);
            setStatus(grn.status);
            setRemarks(grn.remarks);
            setSelectedProducts(grn.grnItems || []);
        }
    }, [grn, suppliers, warehouses]);

    // Set selectedProducts to purchaseOrderItems when a purchase order is selected
    useEffect(() => {
        if (purchaseOrderDetails?.purchaseOrderItems) {
            setSelectedProducts(
                purchaseOrderDetails.purchaseOrderItems.map((item: any) => ({
                    id: item.grnLineItemId ?? undefined,
                    itemId: item.id,
                    itemName: item.item.name,
                    orderedQty: item.quantity,
                    receivedQty: item.quantity,
                    unitPrice: item.unitPrice,
                    uom: item.baseUom,
                    lineTotal: item.quantity * item.unitPrice,
                    batchNumber: null,
                    manufacturingDate: null,
                    expiryDate: null,
                    storageLocation: null,
                    remarks: null
                }))
            );
        }
    }, [purchaseOrderDetails]);

    const handleSubmit = async () => {
        if (organizationId === null) {
            console.error("Organization ID is null");
            return;
        }

        if (!validStatusTransitions[grn?.status || "Draft"].includes(status)) {
            alert("Invalid status transition!");
            return;
        }

        const payload = {
            poNumber: purchaseOrderDetails?.orderNumber || "",
            organizationId,
            grnNumber,
            supplierId: Number(supplierId),
            poId: Number(poId),
            supplierName,
            grnDate,
            status,
            remarks,
            totalAmount: Number(totalAmount),
            warehouseId: Number(warehouseId),
            warehouseName,
            grnLineItems: selectedProducts.map(product => {
                return {
                    id: product.id ?? 0,
                    grnId: grn?.grnId || 0,
                    itemId: product.itemId,
                    itemName: product.itemName,
                    orderedQty: product.orderedQty,
                    receivedQty: product.receivedQty,
                    unitPrice: product.unitPrice,
                    uom: product.uom,
                    lineTotal: product.receivedQty * Number(product.unitPrice),
                    batchNumber: product.batchNumber,
                    manufacturingDate: product.manufacturingDate,
                    expiryDate: product.expiryDate,
                    storageLocation: product.storageLocation,
                    remarks: product.remarks
                };
            })
        };
        console.log("payload", grn);
        grn ? await updateGRN({ id: grn.grnId, data: payload }) : await createGRN(payload);
        onClose();
    };

    const handleReceivedQuantityChange = (productId: number, quantity: number) => {
        setSelectedProducts(prev =>
            prev.map(product =>
                product.itemId === productId
                    ? { ...product, receivedQty: quantity, lineTotal: quantity * product.unitPrice }
                    : product
            )
        );
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>{grn ? "Edit GRN" : "Create GRN"}</DialogTitle>
            <DialogContent>
                <TextField
                    label="GRN Number"
                    value={grnNumber ? grnNumber : ""}
                    onChange={(e) => setGrnNumber(e.target.value)}
                    fullWidth
                    margin="dense"
                    disabled={grn ? true : false}
                />
                <TextField
                    select
                    label="Supplier"
                    value={suppliers.some(s => s.id === Number(supplierId)) ? supplierId : ""}
                    onChange={(e) => {
                        const selectedSupplier = suppliers.find(s => s.id === Number(e.target.value));
                        setSupplierId(e.target.value);
                        setSupplierName(selectedSupplier ? selectedSupplier.name : "");
                    }}
                    fullWidth
                    margin="dense"
                >
                    {suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                            <MenuItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No suppliers available</MenuItem>
                    )}
                </TextField>
                {supplierId && (
                    <TextField
                        select
                        label="Purchase Order"
                        value={poId}
                        onChange={(e) => setPoId(e.target.value)}
                        fullWidth
                        margin="dense"
                    >
                        {supplierPurchaseOrders && supplierPurchaseOrders.length > 0 ? (
                            supplierPurchaseOrders.map((po) => (
                                <MenuItem key={po.id} value={po.id}>
                                    {po.orderNumber}-
                                    <Typography
                                        component="span"
                                        sx={{ color: getStatusColor(po.status), fontWeight: "bold", ml: 1 }}
                                    >
                                        {po.status}
                                    </Typography>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No purchase orders available</MenuItem>
                        )}
                    </TextField>
                )}
                <label>GRN Date</label>
                <TextField
                    type="date"
                    value={grnDate ? grnDate : ""}
                    onChange={(e) => setGrnDate(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                {/* <label>Received Date</label>
                <TextField
                    type="date"
                    value={receivedDate ? receivedDate : ""}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    fullWidth
                    margin="dense"
                /> */}
                <TextField
                    select
                    label="Status"
                    value={validStatusTransitions[status]?.includes(status) ? status : "Draft"}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    margin="dense"
                >
                    {validStatusTransitions[status]?.length > 0 ? (
                        validStatusTransitions[status].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No valid status transitions available</MenuItem>
                    )}
                </TextField>
                {poId && (
                    <>
                        <Typography variant="h6" sx={{ mt: 2 }}>Products from Purchase Order</Typography>
                        <List>
                            {selectedProducts.map((product) => (
                                <ListItem key={product.itemId}>
                                    <ListItemText
                                        primary={product.itemName}
                                        secondary={`Unit Price: ${product.unitPrice}`}
                                    />
                                    <Box>
                                        <Typography variant="body2">Ordered: {product.orderedQty}</Typography>
                                        <TextField
                                            type="number"
                                            label="Received"
                                            value={product.receivedQty}
                                            onChange={(e) => handleReceivedQuantityChange(product.itemId, Math.max(0, Number(e.target.value)))}
                                            size="small"
                                            sx={{ width: 80, mt: 1 }}
                                        />
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
                <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Total Amount: {Number(totalAmount).toFixed(2)}
                </Typography>
                {/* Warehouse Selection Dropdown */}
                <TextField
                    select
                    label="Warehouse"
                    value={warehouseId}
                    // onChange={(e) => setWarehouseId(e.target.value)}
                    onChange={(e) => {
                        const selectedWarehouse = warehouses.find(
                            (warehouse) => warehouse.id === Number(e.target.value)
                        );
                        setWarehouseId(e.target.value);
                        setWarehouseName(selectedWarehouse ? selectedWarehouse.name : "");
                    }}
                    fullWidth
                    margin="dense">
                    {warehouses.length > 0 ? (
                        warehouses.map((warehouse) => (
                            <MenuItem key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No warehouses available</MenuItem>
                    )}
                </TextField>
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
                <button className="mt-4 btn-cancel" onClick={onClose}>
                    Cancel
                </button>
                <button className="mt-4 btn-primary" onClick={handleSubmit}>
                    Create
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default GRNModal;
