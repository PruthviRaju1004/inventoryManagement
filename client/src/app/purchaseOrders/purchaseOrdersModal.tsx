import { useState, useMemo, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Typography, List, ListItem, ListItemText
} from "@mui/material";
import { useGetSuppliersQuery, useCreatePurchaseOrderMutation, useGetSupplierItemsQuery, useUpdatePurchaseOrderMutation, PurchaseOrder } from "../../state/api";

const validStatusTransitions: Record<string, string[]> = {
  PENDING: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["APPROVED", "COMPLETED", "CANCELLED"],
  REJECTED: ["REJECTED"], // Cannot be changed
  COMPLETED: ["COMPLETED", "CLOSED"],
  CANCELLED: ["CANCELLED"], // Cannot be changed
  OPEN: ["OPEN", "APPROVED", "REJECTED", "CANCELLED"],
  CLOSED: ["CLOSED"] // Final state
};


const PurchaseOrderModal = ({ purchaseOrder, organizationId, onClose }: { purchaseOrder: PurchaseOrder | null; organizationId: number | null; onClose: () => void }) => {
  const [supplierId, setSupplierId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [status, setStatus] = useState(purchaseOrder?.status || "PENDING");
  const [remarks, setRemarks] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{ itemId: number; itemName: string; quantity: number; unitPrice: number; uom: string }[]>([]);

  const { data: suppliers = [] } = useGetSuppliersQuery(organizationId ?? 0);
  const { data: supplierProducts = [] } = useGetSupplierItemsQuery(Number(supplierId), { skip: !supplierId });
  const [createPurchaseOrder] = useCreatePurchaseOrderMutation();
  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();

  const totalAmount = useMemo(() => {
    console.log("selectedProducts", selectedProducts);
    return selectedProducts.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0);
  }, [selectedProducts]);
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const localDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
    return localDate.toISOString().split('T')[0];
  };
  useEffect(() => {
    if (purchaseOrder) {
      console.log(purchaseOrder)
      setSupplierId(purchaseOrder.supplierId.toString());
      setOrderNumber(purchaseOrder.orderNumber);
      setOrderDate(purchaseOrder.orderDate ? formatDate(purchaseOrder.orderDate) : "");
      setExpectedDate(purchaseOrder.expectedDate ? formatDate(purchaseOrder.expectedDate) : "");
      setReceivedDate(purchaseOrder.receivedDate || "");
      setStatus(purchaseOrder.status);
      setRemarks(purchaseOrder.remarks || "");
      setSelectedProducts(purchaseOrder.purchaseOrderItems.map(item => ({
        itemId: item.itemId,
        itemName: item.item.name,
        quantity: item.quantity,
        unitPrice: item.supplierUnitPrice,
        uom: item.uom
      })) || []);
    }
  }, [purchaseOrder]);
  const handleSubmit = async () => {
    if (organizationId === null) {
      console.error("Organization ID is null");
      return;
    }
    if (!validStatusTransitions[purchaseOrder?.status || "PENDING"].includes(status)) {
      alert("Invalid status transition!");
      return;
    }
    if (purchaseOrder) {
      // Update purchase order
      await updatePurchaseOrder({
        id: purchaseOrder.id,
        data: {
          organizationId,
          supplierId: Number(supplierId),
          orderDate: orderDate ? new Date(orderDate).toISOString() : "",
          expectedDate: expectedDate ? new Date(expectedDate).toISOString() : undefined,
          receivedDate: receivedDate ? new Date(receivedDate).toISOString() : undefined,
          status,
          remarks,
          totalAmount: Number(totalAmount),
          purchaseOrderItems: selectedProducts.map(product => ({
            id: product.itemId,
            itemId: product.itemId,
            quantity: product.quantity,
            // unitPrice: Number(product.unitPrice), // Convert before sending
            totalPrice: product.quantity * Number(product.unitPrice),
            uom: product.uom,
            supplierUnitPrice: Number(product.unitPrice),
            item: {
              id: product.itemId,
              name: product.itemName,
              itemCode: "", // Add appropriate itemCode if available
            },
          })),
        }
      });
    } else {
      // Create purchase order
      await createPurchaseOrder({
        organizationId,
        supplierId: Number(supplierId),
        orderDate: orderDate ? new Date(orderDate).toISOString() : "",
        expectedDate: expectedDate ? new Date(expectedDate).toISOString() : undefined,
        status: "PENDING",
        remarks,
        totalAmount: Number(totalAmount),
        purchaseOrderItems: selectedProducts.map(product => ({
          itemId: product.itemId,
          quantity: product.quantity,
          unitPrice: Number(product.unitPrice),
          uom: product.uom || "PCS", // default value
          itemName: product.itemName || "Unknown Item", // default value
          totalPrice: product.quantity * product.unitPrice, // calculated value
        })),
      });
    }
    onClose();
  };

  const handleQuantityChange = (productId: number, productName: string, quantity: number, unitPrice: number, uom: string) => {
    setSelectedProducts((prev) => {
      if (quantity > 0) {
        const existingProduct = prev.find((p) => p.itemId === productId);
        if (existingProduct) {
          return prev.map((p) => (p.itemId === productId ? { ...p, quantity } : p));
        } else {
          return [...prev, { itemId: productId, itemName: productName, quantity, unitPrice, uom }];
        }
      } else {
        return prev.filter((p) => p.itemId !== productId);
      }
    });
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{purchaseOrder ? "Update Purchase Order" : "Create Purchase Order"}</DialogTitle>
      <DialogContent>
        {purchaseOrder &&
          <TextField
            label="Order Number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            fullWidth
            margin="dense"
            disabled
          />}
        <TextField
          select
          label="Supplier"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          fullWidth
          margin="dense"
        >
          {suppliers.map((supplier) => (
            <MenuItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </MenuItem>
          ))}
        </TextField>
        <label>Ordered Date</label>
        <TextField
          type="date"
          // label="Order Date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          fullWidth
          margin="dense"
        />
        <label>Expected Date</label>
        <TextField
          type="date"
          // label="Expected Date"
          value={expectedDate}
          onChange={(e) => setExpectedDate(e.target.value)}
          fullWidth
          margin="dense"
        />
        {purchaseOrder &&
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            margin="dense"
            disabled={validStatusTransitions[status].length === 0} // Disable if no valid transitions
          >
            {validStatusTransitions[status]?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>}
        {supplierId && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>Products from Supplier</Typography>
            <List>
              {supplierProducts.length > 0 ? (
                supplierProducts.map((product) => {
                  if (!product.itemId) return null; // Fix: itemId is in the response, not product.item.id
                  const selectedProduct = selectedProducts.find((p) => p.itemId === product.itemId);
                  // console.log(product);
                  return (
                    <ListItem key={product.itemId} sx={{ cursor: "pointer", backgroundColor: selectedProduct ? 'rgba(0, 0, 0, 0.08)' : 'inherit' }}>
                      <ListItemText primary={product.itemName} secondary={`Price: ${product.supply_price}`} />
                      <TextField
                        type="number"
                        label="Quantity"
                        value={selectedProduct?.quantity || ""}
                        onChange={(e) => {
                          const quantity = Math.max(0, Number(e.target.value));
                          handleQuantityChange(product.itemId, product.itemName, quantity, Number(product.supply_price), "PCS");
                        }}
                        size="small"
                        sx={{ width: 80 }}
                      />
                    </ListItem>
                  );
                })
              ) : (
                <Typography variant="body2" color="textSecondary">No products found.</Typography>
              )}

            </List>
          </>
        )}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Total Amount: {Number(totalAmount).toFixed(2)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <button type="button" onClick={onClose} className="mt-4 btn-cancel">Cancel</button>
        <button type="submit" onClick={handleSubmit} className="mt-4 btn-primary">
          {purchaseOrder ? "Update" : "Create"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderModal;
