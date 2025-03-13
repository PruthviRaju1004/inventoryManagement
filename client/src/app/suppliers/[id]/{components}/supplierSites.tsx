import { useState, useCallback, useMemo } from 'react';
import { useGetSupplierSitesQuery, useDeleteSupplierSiteMutation } from "../../../../state/api";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Pencil, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const SupplierSiteModal = dynamic(() => import("./supplierSitesModal"), { ssr: false });

const SupplierSites = ({ supplierId }: { supplierId: string }) => {
    const numericSupplierId = Number(supplierId);
    const { data: sites = [], isLoading } = useGetSupplierSitesQuery(numericSupplierId);
    const [deleteSupplierSite] = useDeleteSupplierSiteMutation();
    const [open, setOpen] = useState(false);
    const [editingSupplierSite, setEditingSupplierSite] = useState<any | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleOpen = useCallback((supplier = null) => {
        setEditingSupplierSite(supplier);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setEditingSupplierSite(null);
        setOpen(false);
    }, []);

    const handleDeleteClick = useCallback((id: string) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (deleteId) {
            await deleteSupplierSite({ supplierId: numericSupplierId, siteId: Number(deleteId) });
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    }, [deleteId, deleteSupplierSite]);

    const columns = useMemo(() => [
        { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 150 },
        { field: "address", headerName: "Address", flex: 1, minWidth: 200 },
        { field: "contactPhone", headerName: "Phone", flex: 1, minWidth: 150 },
        { field: "contactName", headerName: "Contact Name", flex: 1, minWidth: 200 },
        { field: "contactEmail", headerName: "Contact Email", flex: 1, minWidth: 200 },
        { field: "latitude", headerName: "Latitude", flex: 1, minWidth: 100 },
        { field: "longitude", headerName: "Longitude", flex: 1, minWidth: 100 },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            flex: 1,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => handleOpen(params.row)} className="p-2 text-primary_btn_color rounded">
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(params.row.id)} className="p-2 text-primary_btn_color rounded">
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ], [handleOpen, handleDeleteClick]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <button onClick={() => handleOpen()} className="mt-4 bg-primary_btn_color text-[#fff] font-medium 
                    font-sans text-base text-center px-4 h-12 rounded-sm">Create Supplier Site</button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
                <DataGrid rows={sites} columns={columns} loading={isLoading} disableColumnResize
                    className="mt-4" sx={{
                        width: "100%",
                        minHeight: "100%",
                        "& .MuiDataGrid-container--top [role=row]": { backgroundColor: "#f4f4f4" },
                        "& .MuiDataGrid-cell--textLeft": { display: "flex" },
                    }} />
            </div>
            {open && <SupplierSiteModal supplierSite={editingSupplierSite} onClose={handleClose} supplierId={supplierId} />}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this supplier?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SupplierSites;
