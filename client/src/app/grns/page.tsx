"use client";
import { useState, useCallback, useMemo } from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import { useGetGRNsQuery, useDeleteGRNMutation, GRN } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector/index";
import DataTable from "../{components}/dataTable";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import { useRouter } from "next/navigation";
import { Chip, Box } from "@mui/material";

// Lazy load Purchase Order Modal
const GrnModal = dynamic(() => import("./grnModal"), { ssr: false });

const statusColors: Record<string, { bg: string; text: string }> = {
    Draft: { bg: "#FFCC00", text: "#000000" },  // Amber
    Approved: { bg: "#4CAF50", text: "#FFFFFF" }, // Green
    Cancelled: { bg: "#9E9E9E", text: "#FFFFFF" }, // Gray
    Closed: { bg: "#607D8B", text: "#FFFFFF" } // Dark Gray
};

const Grns = () => {
    const router = useRouter();
    const { selectedOrg, setSelectedOrg } = useOrganizations();
    const { data: grns, isLoading } = useGetGRNsQuery(selectedOrg ?? 0, { skip: !selectedOrg });
    const [deleteGrn] = useDeleteGRNMutation();
    const [open, setOpen] = useState(false);
    const [editingGrn, setEditingGrn] = useState<GRN | null>(null);

    const handleOpen = useCallback((grn: GRN | null = null) => {
        setEditingGrn(grn);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setEditingGrn(null);
        setOpen(false);
    }, []);

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } = useDeleteDialog(
        async (grnId) => {
            if (!grnId || isNaN(Number(grnId))) {
                console.error("Invalid GRN ID:", grnId);
                return;
            }
            await deleteGrn(Number(grnId));
        }
    );    

    const columns = useMemo(() => [
        {
            field: "grnNumber",
            headerName: "GRN Number",
            flex: 1,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <button
                    onClick={() => router.push(`/grns/${params.row.grnId}`)}
                    className="text-blue-600 hover:underline">
                    {params.row.grnNumber}
                </button>
            )
        },
        {
            field: "grnDate",
            headerName: "GRN Date",
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => {
                const date = params.row.grnDate ? new Date(params.row.grnDate).toISOString().split("T")[0] : "N/A";
                return date;
            }
        },
        {
            field: "poNumber",
            headerName: "Purchase Order Number",
            flex: 1,
            width: 150,
            renderCell: (params: GridRenderCellParams) => params.row.poNumber || "N/A"
        },
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
        {
            field: "totalAmount",
            headerName: "Total Amount",
            flex: 1,
            width: 150,
        },
        {
            field: "remarks",
            headerName: "Remarks",
            flex: 1,
            width: 200,
            renderCell: (params: GridRenderCellParams) => params.row.remarks || "N/A"
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    {params.row.status !== "Approved" && 
                        <div className="flex gap-2">
                            <button onClick={() => handleOpen(params.row)} className="p-2 text-primary_btn_color rounded">
                                <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDeleteClick(params.row.grnId)} className="p-2 text-primary_btn_color rounded">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    }
                </>
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
                    font-sans text-base text-center px-4 h-12 rounded-sm">Create GRN</button>
            </div>
            <DataTable
                rows={(grns || []).map((grn) => ({ ...grn, id: Math.random().toString(36).substr(2, 9) }))} 
                columns={columns}
                loading={isLoading}
                onEdit={handleOpen}
                onDelete={handleDeleteClick}
            />

            {open && <GrnModal grn={editingGrn} organizationId={selectedOrg} onClose={handleClose} />}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent><DialogContentText>Are you sure you want to delete this GRN?</DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Grns;
