"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useGetWarehouseStockQuery, useAddItemToWarehouseMutation, useUpdateWarehouseStockMutation, useGetItemsQuery } from "../../../state/api";
import { Plus, Pencil } from "lucide-react";

const WarehouseDetails = () => {
    const { id } = useParams(); // Warehouse ID from URL
    const { data: stockData, isLoading } = useGetWarehouseStockQuery(id);
    const searchParams = useSearchParams();
    const orgId = searchParams.get("orgId");
    const { data: items = [] } = useGetItemsQuery(Number(orgId) || 0, { skip: !orgId }); // Fetch available items
    const [addItemToWarehouse] = useAddItemToWarehouseMutation();
    const [updateWarehouseStock] = useUpdateWarehouseStockMutation();

    const [open, setOpen] = useState(false);
    interface Item {
        itemId: string;
        quantity: number;
        // Add other properties if needed
    }

    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [itemId, setItemId] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleOpen = (item: Item | null = null) => {
        setEditingItem(item);
        setItemId(item ? item.itemId : "");
        setQuantity(item ? item.quantity.toString() : "");
        setOpen(true);
    };

    const handleClose = () => {
        setEditingItem(null);
        setItemId("");
        setQuantity("");
        setOpen(false);
    };

    const handleSave = async () => {
        if (!itemId || !quantity) return;

        if (editingItem) {
            await updateWarehouseStock({ warehouseId: id, itemId, quantity: Number(quantity) });
        } else {
            await addItemToWarehouse({ warehouseId: id, itemId, quantity: Number(quantity) });
        }
        handleClose();
    };

    const columns = [
        { field: "itemId", headerName: "Item ID", width: 150 },
        { field: "productName", headerName: "Product", width: 200 },
        { field: "quantity", headerName: "Quantity", width: 150 },
        { field: "unit", headerName: "Unit", width: 150 },
        { field: "lastUpdated", headerName: "Last Updated", width: 200 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Button onClick={() => handleOpen(params.row)} variant="outlined" startIcon={<Pencil />}>
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Warehouse Stock</h1>
                <Button onClick={() => handleOpen()} variant="contained" startIcon={<Plus />}>
                    Add Item
                </Button>
            </div>

            <DataGrid rows={(stockData || []).map((row: any) => ({
                ...row,
                id: `${row.warehouseId}-${row.itemId}`, // Generate a unique ID
                productName: row.item?.name || "Unknown",
                unit: row.item?.baseUom || "N/A",
                lastUpdated: row.updatedAt || "N/A",
            }))}
                columns={columns} loading={isLoading} />

            {/* Dialog for Adding/Editing Stock */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingItem ? "Edit Stock" : "Add Stock"}</DialogTitle>
                <DialogContent className="flex flex-col gap-4 p-4">
                    <FormControl fullWidth>
                        <InputLabel>Item</InputLabel>
                        <Select value={itemId} onChange={(e) => setItemId(e.target.value)} disabled={!!editingItem}>
                            {items.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSave} color="primary">{editingItem ? "Update" : "Add"}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default WarehouseDetails;
