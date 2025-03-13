"use client"
import { useState, useCallback, useMemo } from "react";
import { useGetSupplierItemsQuery } from "../../../../state/api";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import dynamic from "next/dynamic";
import { Pencil, Trash2 } from "lucide-react";

const SupplierItemModal = dynamic(() => import("./supplierItemsModal"), { ssr: false });

const SupplierItems = ({ supplierId, organizationId }: { supplierId: string; organizationId: string | null }) => {
    const { data: items = [], isLoading } = useGetSupplierItemsQuery(Number(supplierId));
    // const [deleteSupplierSite] = useDeleteSupplierSiteMutation();
    const [open, setOpen] = useState(false);
    const [editingSupplierItems, setEditingSupplierItems] = useState<any | null>(null);
    // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [deleteId, setDeleteId] = useState<string | null>(null);

    // Ensure each row has a unique `id`
    const rows = items.map((item: { supplierId: number; itemId: number;[key: string]: any }) => ({
        id: `${item.supplierId}-${item.itemId}`, // Unique ID combining supplier and item IDs
        ...item,
        supplierId: item.supplierId.toString(),
        itemId: item.itemId.toString(),
    }));

    const handleOpen = useCallback((supplier = null) => {
        setEditingSupplierItems(supplier);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setEditingSupplierItems(null);
        setOpen(false);
    }, []);

    const columns = useMemo(() => [
        { field: "itemId", headerName: "Item ID", flex: 1, minWidth: 100 },
        { field: "itemName", headerName: "Item Name", flex: 1, minWidth: 150 },
        { field: "itemCode", headerName: "Item Code", width: 150 },
        { field: "supply_quantity", headerName: "Supplied Quantity", flex: 1, minWidth: 150 },
        { field: "supply_price", headerName: "Unit Price", flex: 1, minWidth: 150 },
        {
            field: "effective_date",
            headerName: "Effective Date",
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => {
                const date = params.row.effective_date ? new Date(params.row.effective_date).toISOString().split("T")[0] : "N/A";
                return date;
            }
        },
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
                    {/* <button onClick={() => handleDeleteClick(params.row.id)} className="p-2 text-primary_btn_color rounded">
                        <Trash2 size={16} />
                    </button> */}
                </div>
            ),
        },
    ], [handleOpen]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <button onClick={() => handleOpen()} className="mt-4 bg-primary_btn_color text-[#fff] font-medium 
                    font-sans text-base text-center px-4 h-12 rounded-sm float-right">Create Supplier Item</button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
                <DataGrid rows={rows} columns={columns} loading={isLoading} disableColumnResize
                    className="mt-4" sx={{
                        width: "100%",
                        minHeight: "100%",
                        "& .MuiDataGrid-container--top [role=row]": { backgroundColor: "#f4f4f4" },
                        "& .MuiDataGrid-cell--textLeft": { display: "flex" },
                    }} />
            </div>
            {open && <SupplierItemModal supplierItem={editingSupplierItems} onClose={handleClose} supplierId={supplierId} organizationId={organizationId || ''}/>}
        </div>
    );
};

export default SupplierItems;
