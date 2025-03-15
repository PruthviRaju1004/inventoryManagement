"use client";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Pencil, Trash2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps {
    rows: any[];
    columns: GridColDef[];
    loading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEdit: (row: any) => void;
    onDelete: (id: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ rows, columns, loading, onEdit, onDelete }) => {
    // Ensure "actions" column isn't duplicated
    const existingColumnKeys = columns.map(col => col.field);
    const actionColumn = {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <div className="flex gap-2">
                <button onClick={() => onEdit(params.row)} className="p-2 bg-blue-500 text-white rounded">
                    <Pencil size={16} />
                </button>
                <button onClick={() => onDelete(params.row.id)} className="p-2 bg-red-500 text-white rounded">
                    <Trash2 size={16} />
                </button>
            </div>
        ),
    };

    const allColumns = existingColumnKeys.includes("actions") ? columns : [...columns, actionColumn];

    return <DataGrid rows={rows} columns={allColumns} loading={loading} disableColumnResize
        sx={{
            width: "100%",
            minHeight: "100%",
            "& .MuiDataGrid-container--top [role=row]": { backgroundColor: "#f4f4f4" },
            "& .MuiDataGrid-cell--textLeft": { display: "flex" },
        }} />;
};

export default DataTable;
