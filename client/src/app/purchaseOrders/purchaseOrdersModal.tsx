import { useState, useMemo, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, IconButton,
  TextField, MenuItem, Typography, List, ListItem, ListItemText
} from "@mui/material";
import { X } from "lucide-react";
import { useGetSuppliersQuery, useCreatePurchaseOrderMutation, useGetSupplierItemsQuery, useUpdatePurchaseOrderMutation, PurchaseOrder } from "../../state/api";

const validStatusTransitions: Record<string, string[]> = {
  PENDING: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["APPROVED", "COMPLETED", "CANCELLED"],
  REJECTED: ["REJECTED"], // Cannot be changed
  COMPLETED: ["COMPLETED", "CLOSED"],
  CANCELLED: ["CANCELLED"],
};


const PurchaseOrderModal = ({ purchaseOrder, organizationId, onClose }: { purchaseOrder: PurchaseOrder | null; organizationId: number | null; onClose: () => void }) => {
  const [supplierId, setSupplierId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [status, setStatus] = useState(purchaseOrder?.status || "PENDING");
  const [remarks, setRemarks] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{ itemId: number; itemName: string; supply_price: number; supply_quantity: number; quantity: number; }[]>([]);

  const { data: suppliers = [] } = useGetSuppliersQuery({ organizationId: organizationId ?? 0 });
  const { data: supplierProducts = [] } = useGetSupplierItemsQuery(Number(supplierId), { skip: !supplierId });
  const [createPurchaseOrder] = useCreatePurchaseOrderMutation();
  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();

  const totalAmount = useMemo(() => {
    return selectedProducts.reduce((sum, product) => sum + product.quantity * product.supply_price, 0);
  }, [selectedProducts]);
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const localDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
    return localDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (purchaseOrder) {
      // console.log(purchaseOrder)
      setSupplierId(purchaseOrder.supplierId.toString());
      setOrderNumber(purchaseOrder.orderNumber);
      setOrderDate(purchaseOrder.orderDate ? formatDate(purchaseOrder.orderDate) : "");
      setExpectedDate(purchaseOrder.expectedDate ? formatDate(purchaseOrder.expectedDate) : "");
      setReceivedDate(purchaseOrder.receivedDate || "");
      setStatus(purchaseOrder.status);
      setRemarks(purchaseOrder.remarks || "");
      setSelectedProducts(purchaseOrder.purchaseOrderItems.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        supply_price: Number(item.unitPrice) || 0,
        supply_quantity: Number(item.supply_quantity) || 0, // Ensure supply_quantity is a number
        quantity: Number(item.quantity) // Default quantity
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
            itemName: product.itemName,
            supply_quantity: product.supply_quantity, // Add supply_quantity
            quantity: product.quantity,
            totalPrice: product.supply_quantity * Number(product.supply_price),
            unitPrice: Number(product.supply_price),
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
          unitPrice: Number(product.supply_price),
          itemName: product.itemName || "Unknown Item", // default value
          totalPrice: product.quantity * product.supply_price, // calculated value
        })),
      });
    }
    onClose();
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

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.itemId !== productId));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.itemId === productId ? { ...p, quantity } : p))
    );
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
            <Typography variant="h6" sx={{ mt: 2 }}>Search and Select Products</Typography>
            <Autocomplete
              options={supplierProducts}
              getOptionLabel={(option) => option.itemName}
              renderInput={(params) => <TextField {...params} label="Search Products" />}
              onChange={handleProductSelect}
              disablePortal
            />
            {selectedProducts.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>Selected Products</Typography>
                <List>
                  {selectedProducts.map((product) => (
                    <ListItem key={product.itemId} secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveProduct(product.itemId)}>
                        <X size={20} />
                      </IconButton>
                    }>
                      <ListItemText primary={product.itemName} secondary={
                        <>
                          Price: {product.supply_price}
                        </>
                      } />
                      <TextField
                        type="number"
                        inputMode="numeric" 
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(product.itemId, Math.max(1, Number(e.target.value)))}
                        size="small"
                        sx={{ width: 80, ml: 2 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </>
        )}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Total Amount: {Number(totalAmount).toFixed(2)}
        </Typography>
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
        <button type="button" onClick={onClose} className="mt-4 btn-cancel">Cancel</button>
        <button type="submit" onClick={handleSubmit} className="mt-4 btn-primary">
          {purchaseOrder ? "Update" : "Create"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderModal;
