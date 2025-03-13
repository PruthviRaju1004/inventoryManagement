"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";
import { useGetItemsQuery, useDeleteItemMutation } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import React from "react";

const ItemsModal = dynamic(() => import("./ItemsModal"), { ssr: false });

const Items = () => {
    const { organizations, selectedOrg, setSelectedOrg } = useOrganizations();
    const { data: items, isLoading } = useGetItemsQuery(selectedOrg ?? 0, { skip: !selectedOrg });
    const [deleteItem] = useDeleteItemMutation();
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    const handleOpen = (item = null) => {
        setEditingItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setEditingItem(null);
        setOpen(false);
    };

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } =
        useDeleteDialog(async (id) => await deleteItem(Number(id)));

    const toggleExpandRow = (id: number) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const columns: ColumnDef<any>[] = [
        {
            id: "expand",
            header: () => null,
            cell: ({ row }) => (
                <button onClick={() => toggleExpandRow(row.original.id)} className="p-2 text-gray-500">
                    {expandedRows[row.original.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            ),
        },
        { accessorKey: "name", header: "Item Name" },
        { accessorKey: "itemCode", header: "Item Code" },
        { accessorKey: "baseUom", header: "Base UOM" },
        { accessorKey: "unitPrice", header: "Unit Price" },
        { accessorKey: "costPrice", header: "Cost Price" },
        { accessorKey: "color", header: "Color"},
        { accessorKey: "costingMethod", header: "Costing Method"},
        {accessorKey: "hsnSacCode", header: "HSNSAC Code"},
        {accessorKey: "type", header: "Type"},
        {accessorKey: "safetyStockLevel", header: "Safety Stock Level"},
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpen(row.original)} className="p-2 text-primary_btn_color rounded">
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(row.original.id)} className="p-2 text-primary_btn_color rounded">
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: items || [],
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
                    Create Item
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
                                            <p><strong>Description:</strong> {row.original.description}</p>
                                            <p><strong>Barcode:</strong> {row.original.barcode}</p>
                                            <p><strong>Business Unit Name:</strong> {row.original.businessUnitName}</p>
                                            <p><strong>Commision Factor:</strong> {row.original.commissionFactor}</p>
                                            <p><strong>Inventory Group:</strong> {row.original.inventoryGroup}</p>
                                            <p><strong>Item Category Code:</strong> {row.original.itemCategoryCode}</p>
                                            <p><strong>Item Code:</strong> {row.original.itemCode}</p>
                                            <p><strong>Lead Time Days:</strong> {row.original.leadTimeDays}</p>
                                            <p><strong>Make:</strong> {row.original.make}</p>
                                            <p><strong>Product category:</strong> {row.original.parentCategory}</p>
                                            <p><strong>Product Type:</strong> {row.original.productType}</p>
                                            <p><strong>Purchase UOM:</strong> {row.original.purchaseUom}</p>
                                            <p><strong>Sales UOM:</strong> {row.original.salesUom}</p>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Items Modal */}
            {open && <ItemsModal item={editingItem} organizationId={selectedOrg} onClose={handleClose} />}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
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

export default Items;
