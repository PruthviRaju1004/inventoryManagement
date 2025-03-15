"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";
import { useGetWarehousesQuery, useDeleteWarehouseMutation, Warehouse } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import React from "react";
import { useRouter } from "next/navigation";

const WarehousesModal = dynamic(() => import("./warehousesModal"), { ssr: false });

const Warehouses = () => {
    const router = useRouter();
    const { selectedOrg, setSelectedOrg } = useOrganizations();
    const { data: warehouses } = useGetWarehousesQuery(selectedOrg ?? 0, { skip: !selectedOrg });
    const [deleteWarehouse] = useDeleteWarehouseMutation();
    const [open, setOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    const handleOpen = (warehouse: Warehouse | null = null) => {
        setEditingWarehouse(warehouse);
        setOpen(true);
    };

    const handleClose = () => {
        setEditingWarehouse(null);
        setOpen(false);
    };

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } =
        useDeleteDialog(async (id) => await deleteWarehouse(Number(id)));

    const toggleExpandRow = (id: number) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const columns: ColumnDef<Warehouse>[] = [
        {
            id: "expand",
            header: () => null,
            cell: ({ row }) => (
                <button onClick={() => toggleExpandRow(row.original.id)} className="p-2 text-gray-500">
                    {expandedRows[row.original.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            ),
        },
        {
            accessorKey: "name",
            header: "Warehouse Name",
            cell: ({ row }) => (
                <button onClick={() => router.push(`/warehouses/${row.original.id}`)} className="text-blue-600 hover:underline">
                    {row.original.name}
                </button>
            ),
        },
        { accessorKey: "code", header: "Warehouse Code" },
        { accessorKey: "address", header: "Address" },
        { accessorKey: "contactEmail", header: "Email" },
        { accessorKey: "contactPhone", header: "Phone" },
        { accessorKey: "latitude", header: "Latitude" },
        { accessorKey: "longitude", header: "Longitude" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpen(row.original)} className="p-2 text-primary_btn_color rounded">
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(String(row.original.id))} className="p-2 text-primary_btn_color rounded">
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: warehouses || [],
        columns,
        state: { expanded: expandedRows },
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <div>
                    <OrganizationSelector selectedOrg={selectedOrg} onChange={setSelectedOrg} />
                </div>
                <button onClick={() => handleOpen()} className="mt-4 bg-primary_btn_color text-white font-medium text-base px-4 h-12 rounded-sm">
                    Create Warehouse
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="p-3 text-left">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <tr key={row.id} className="border-b">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>

                                {expandedRows[row.original.id] && (
                                    <tr key={`expanded-${row.id}`} className="bg-gray-100">
                                        <td colSpan={columns.length} className="p-4">
                                            <p><strong>Lot Size:</strong> {row.original.lotSize}</p>
                                            <p><strong>Number of Docks:</strong> {row.original.noOfDocks}</p>
                                            <p><strong>Shelves Racks:</strong> {row.original.shelvesRacks}</p>
                                            <p><strong>Warehouse soize:</strong> {row.original.sqFoot} {" sqft"}</p>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Warehouses Modal */}
            {open && <WarehousesModal warehouse={editingWarehouse} organizationId={selectedOrg} onClose={handleClose} />}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this warehouse?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Warehouses;
