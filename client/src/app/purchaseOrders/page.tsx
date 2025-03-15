"use client";
import { useState, useCallback, useMemo } from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import { useGetPurchaseOrdersQuery, useDeletePurchaseOrderMutation, PurchaseOrder } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector/index";
import DataTable from "../{components}/dataTable";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import { useRouter } from "next/navigation";
import { Chip, Box } from "@mui/material";

// Lazy load Purchase Order Modal
const PurchaseOrderModal = dynamic(() => import("./purchaseOrdersModal"), { ssr: false });

const statusColors: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: "#FFCC00", text: "#000000" },  // Amber
    APPROVED: { bg: "#4CAF50", text: "#FFFFFF" }, // Green
    REJECTED: { bg: "#F44336", text: "#FFFFFF" }, // Red
    COMPLETED: { bg: "#2196F3", text: "#FFFFFF" }, // Blue
    CANCELED: { bg: "#9E9E9E", text: "#FFFFFF" }, // Gray
    OPEN: { bg: "#673AB7", text: "#FFFFFF" }, // Purple
    CLOSED: { bg: "#607D8B", text: "#FFFFFF" } // Dark Gray
};

const PurchaseOrders = () => {
    const router = useRouter();
    const { selectedOrg, setSelectedOrg } = useOrganizations();
    const { data: purchaseOrders, isLoading } = useGetPurchaseOrdersQuery(selectedOrg ?? 0, { skip: !selectedOrg });
    const [deletePurchaseOrder] = useDeletePurchaseOrderMutation();
    const [open, setOpen] = useState(false);
    const [editingPurchaeOrder, setEditingPurchaeOrder] = useState<PurchaseOrder | null>(null);

    const handleOpen = (purchaseOrder: PurchaseOrder | null = null) => {
        console.log("purchaseOrder", purchaseOrder);
        setEditingPurchaeOrder(purchaseOrder);
        setOpen(true);
    };

    const handleClose = useCallback(() => {
        setEditingPurchaeOrder(null);
        setOpen(false);
    }, []);

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } = useDeleteDialog(
        async (id) => await deletePurchaseOrder(Number(id))
    );

    const columns = useMemo(() => [
        {
            field: "orderNumber", headerName: "Order Number", flex: 1, minWidth: 200, renderCell: (params: GridRenderCellParams) => (
                <button
                    onClick={() => router.push(`/purchaseOrders/${params.row.id}`)}
                    className="text-blue-600 hover:underline">
                    {params.row.orderNumber}
                </button>
            )
        },
        {
            field: "orderDate",
            headerName: "Ordered Date",
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => {
                const date = params.row.orderDate ? new Date(params.row.orderDate).toISOString().split("T")[0] : "N/A";
                return date;
            }
        },
        { field: "supplier", headerName: "Supplier", flex: 1, width: 200, renderCell: (params: GridRenderCellParams) => params.row.supplier?.name || "N/A" },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const status = params.row.status as keyof typeof statusColors;
                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",  // Ensures it takes full cell width
                            height: "100%"  // Ensures it takes full cell height
                        }}
                    >
                        <Chip
                            label={status}
                            sx={{
                                backgroundColor: statusColors[status]?.bg || "#ddd",
                                color: statusColors[status]?.text || "#000",
                                fontWeight: "bold",
                                borderRadius: "16px",
                                px: 2
                            }}
                        />
                    </Box>
                );
            }
        },
        { field: "totalAmount", headerName: "Total Amount", flex: 1, width: 150 },
        { field: "paymentTerms", headerName: "Payment Terms", flex: 1, width: 150 },
        {
            field: "expectedDate",
            headerName: "Expected Date",
            flex: 1,
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const date = params.row.expectedDate ? new Date(params.row.expectedDate).toISOString().split("T")[0] : "N/A";
                return date;
            }
        },
        // { field: "receivedDate", headerName: "Received Date", width: 150 },
        // { field: "remarks", headerName: "Remarks", width: 200 },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpen(params.row)} className="p-2 text-primary_btn_color rounded">
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(params.row.id)} className="p-2 text-primary_btn_color rounded">
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ], [handleOpen, handleDeleteClick, router]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <div>
                    <OrganizationSelector selectedOrg={selectedOrg} onChange={setSelectedOrg} />
                </div>
                <button onClick={() => handleOpen()} className="mt-4 bg-primary_btn_color text-[#fff] font-medium 
                    font-sans text-base text-center px-4 h-12 rounded-sm">Create Purchase Order</button>
            </div>
            <DataTable rows={purchaseOrders || []} columns={columns} loading={isLoading} onEdit={handleOpen} onDelete={handleDeleteClick} />

            {open && <PurchaseOrderModal purchaseOrder={editingPurchaeOrder} organizationId={selectedOrg} onClose={handleClose} />}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent><DialogContentText>Are you sure you want to delete this purchase order?</DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PurchaseOrders;
