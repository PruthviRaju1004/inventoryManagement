"use client";
import { useState, useCallback, useMemo } from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip, Box } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import { useGetSalesOrdersQuery, useDeleteSalesOrderMutation, SalesOrder } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector";
import DataTable from "../{components}/dataTable";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../redux";
import StatusFilter from "../{components}/statusFilter/statusFilter";

// Lazy load Sales Order Modal
const SalesOrderModal = dynamic(() => import("./salesOrderModal"), { ssr: false });

const statusOptions = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: "#FFCC00", text: "#000000" },  // Amber
    CONFIRMED: { bg: "#4CAF50", text: "#FFFFFF" }, // Green
    SHIPPED: { bg: "#2196F3", text: "#FFFFFF" }, // Blue
    DELIVERED: { bg: "#673AB7", text: "#FFFFFF" }, // Purple
    CANCELLED: { bg: "#F44336", text: "#FFFFFF" }  // Red
};

const SalesOrders = () => {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState("ALL");
    const { selectedOrg, setSelectedOrg } = useOrganizations();
    const { data: salesOrders, isLoading } = useGetSalesOrdersQuery({ organizationId: selectedOrg ?? 0, status: statusFilter !== "ALL" ? statusFilter : undefined }, { skip: !selectedOrg });
    const [deleteSalesOrder] = useDeleteSalesOrderMutation();
    const [open, setOpen] = useState(false);
    const [editingSalesOrder, setEditingSalesOrder] = useState<SalesOrder | null>(null);
    const user = useAppSelector((state) => state.user);
    const userRole = user?.roleId || 4;

    const handleOpen = (salesOrder: SalesOrder | null = null) => {
        setEditingSalesOrder(salesOrder);
        setOpen(true);
    };

    const handleClose = useCallback(() => {
        setEditingSalesOrder(null);
        setOpen(false);
    }, []);

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } = useDeleteDialog(
        async (id) => await deleteSalesOrder(Number(id))
    );

    const columns = useMemo(() => [
        {
            field: "orderNumber",
            headerName: "Order Number",
            flex: 1,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <button
                    onClick={() => router.push(`/salesOrder/${params.row.id}`)}
                    className="text-blue-600 hover:underline">
                    {params.row.orderNumber}
                </button>
            )
        },
        {
            field: "orderDate",
            headerName: "Order Date",
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => {
                const date = params.row.orderDate ? new Date(params.row.orderDate).toISOString().split("T")[0] : "N/A";
                return date;
            }
        },
        { field: "customer", headerName: "Customer", flex: 1, width: 200, renderCell: (params: GridRenderCellParams) => params.row.customer?.name || "N/A" },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const status = params.row.status as keyof typeof statusColors;
                return (
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
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
        { field: "totalAmount", headerName: "Amount Payable", flex: 1, width: 150 },
        { field: "amountPaid", headerName: "Amount Paid", flex: 1, width: 150 },
        { field: "outstandingAmount", headerName: "Outstanding Amount", flex: 1, width: 150 },
        { field: "paymentStatus", headerName: "Payment Status", flex: 1, width: 150 },
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
        ...(userRole !== 4
            ? [
                {
                    field: "actions",
                    headerName: "Actions",
                    sortable: false,
                    flex: 1,
                    minWidth: 150,
                    renderCell: (params: GridRenderCellParams) => (
                        <div className="flex gap-2">
                            {userRole !== 4 && (
                                <button onClick={() => handleOpen(params.row)} className="p-2 text-primary_btn_color rounded">
                                    <Pencil size={16} />
                                </button>)}
                            {userRole !== 4 && userRole !== 3 && (
                                <button onClick={() => handleDeleteClick(params.row.id)} className="p-2 text-primary_btn_color rounded">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ),
                },
            ]
            : [])
    ], [handleOpen, handleDeleteClick, router]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Sales Orders</h1>
            <div className="flex justify-between gap-4 align-center">
                <div className="flex gap-4">
                    {!localStorage.getItem("userOrg") &&
                        <div>
                            <OrganizationSelector selectedOrg={selectedOrg} onChange={setSelectedOrg} />
                        </div>}
                    <div>
                        <StatusFilter
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            statusOptions={statusOptions}
                        />
                    </div>
                </div>
                {userRole !== 4 &&
                    <button onClick={() => handleOpen()} className="bg-primary_btn_color text-[#fff] font-medium 
                    font-sans text-base text-center px-4 h-12 rounded-sm">Create Sales Order</button>
                }
            </div>
            <DataTable rows={salesOrders || []} columns={columns} loading={isLoading} onEdit={handleOpen} onDelete={handleDeleteClick} />

            {open && <SalesOrderModal salesOrder={editingSalesOrder} organizationId={selectedOrg} onClose={handleClose} />}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent><DialogContentText>Are you sure you want to delete this sales order?</DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SalesOrders;
