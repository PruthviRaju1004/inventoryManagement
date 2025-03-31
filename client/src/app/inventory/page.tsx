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
import { useGetInventoryReportsQuery, useDeleteInventoryReportMutation, InventoryReport } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import { useAppSelector } from "../redux";
import React from "react";

const InventoryReportsModal = dynamic(() => import("./inventoryReportsModal"), { ssr: false });

const InventoryReports = () => {
    const { selectedOrg, setSelectedOrg } = useOrganizations();
    const { data: inventoryReports } = useGetInventoryReportsQuery(selectedOrg ?? 0, { skip: !selectedOrg });
    const [deleteInventoryReport] = useDeleteInventoryReportMutation();
    const [open, setOpen] = useState(false);
    const [editingInventoryReport, setEditingInventoryReport] = useState<InventoryReport | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const user = useAppSelector((state) => state.user);
    const userRole = user?.roleId || 4;

    const handleOpen = (inventoryReport: InventoryReport | null = null) => {
        setEditingInventoryReport(inventoryReport);
        setOpen(true);
    };

    const handleClose = () => {
        setEditingInventoryReport(null);
        setOpen(false);
    };

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } =
        useDeleteDialog(async (inventoryId) => await deleteInventoryReport(Number(inventoryId)));

    const toggleExpandRow = (inventoryId: number) => {
        setExpandedRows((prev) => ({ ...prev, [inventoryId]: !prev[inventoryId] }));
    };

    const columns: ColumnDef<InventoryReport>[] = [
        {
            id: "expand",
            header: () => null,
            cell: ({ row }: { row: any }) => (
                <button onClick={() => toggleExpandRow(row.original.inventoryId)} className="p-2 text-gray-500">
                    {expandedRows[row.original.inventoryId] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            ),
        },
        { accessorKey: "itemName", header: "Item Name" },
        { accessorKey: "sku", header: "SKU" },

        { accessorKey: "lotNumber", header: "Lot Number" },
        { accessorKey: "batchNumber", header: "Batch Number" },
        { accessorKey: "serialNumber", header: "Serial Number" },
        // { accessorKey: "outwardQuantity", header: "Outward Quantity" },
        // { accessorKey: "committedQuantity", header: "Committed Quantity" },
        { accessorKey: "providedQuantity", header: "Available Quantity" },
        // { accessorKey: "damagedQuantity", header: "Damaged Quantity" },
        { accessorKey: "costPerUnit", header: "Cost Price" },
        { accessorKey: "sellingPrice", header: "Selling Price" },
        { accessorKey: "warehouseName", header: "Warehouse Name" },
        { accessorKey: "subWarehouseName", header: "Sub Warehouse Name" },
        { accessorKey: "binLocation", header: "Bin Location" },
        ...(userRole !== 4
            ? [
                {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }: { row: any }) => (
                        <div className="flex gap-2">
                            {userRole !== 4 && (
                                <button
                                    onClick={() => handleOpen(row.original)}
                                    className="p-2 text-primary_btn_color rounded">
                                    <Pencil size={16} />
                                </button>
                            )}
                            {userRole !== 4 && userRole !== 3 && (
                                <button
                                    onClick={() => handleDeleteClick(String(row.original.inventoryId))}
                                    className="p-2 text-primary_btn_color rounded">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ),
                },
            ]
            : [])
    ];

    const table = useReactTable({
        data: inventoryReports || [],
        columns,
        state: { expanded: expandedRows },
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Inventory</h1>
            <div className="flex justify-between gap-4">
                {!localStorage.getItem("userOrg") &&
                    <div>
                        <OrganizationSelector selectedOrg={selectedOrg} onChange={setSelectedOrg} />
                    </div>}
                {userRole !== 4 &&
                    <button onClick={() => handleOpen()} className="bg-primary_btn_color text-white font-medium text-base px-4 h-12 rounded-sm">
                        Add Inventory
                    </button>
                }
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

                                {expandedRows[row.original.inventoryId] && (
                                    <tr key={`expanded-${row.id}`} className="bg-gray-100">
                                        <td colSpan={columns.length} className="p-4">
                                            <p><strong>C and H charges:</strong> {row.original.cAndHCharges}</p>
                                            <p><strong>Cost Before Duty:</strong> {row.original.costBeforeDuty}</p>
                                            <p><strong>Cost Before Profit Margin:</strong> {row.original.costBeforeProfitMargin}</p>
                                            <p><strong>Duty Charges:</strong> {row.original.dutyCharges}</p>
                                            <p><strong>Freight:</strong> {row.original.freight}</p>
                                            <p><strong>Manufacturing Date:</strong> {row.original.manufacturingDate}</p>
                                            <p><strong>Expiry Date:</strong> {row.original.expiryDate}</p>
                                            <p><strong>Stock Inward Date:</strong> {row.original.stockInwardDate}</p>
                                            <p><strong>Stock Outward Date:</strong> {row.original.stockOutwardDate}</p>
                                            <p><strong>Reorder Level:</strong> {row.original.reorderLevel}</p>
                                            <p><strong>Category:</strong> {row.original.category}</p>
                                            <p><strong>Sub-Category:</strong> {row.original.subCategory}</p>
                                            <p><strong>Unit Of Measure:</strong> {row.original.unitOfMeasure}</p>
                                            <p><strong>Barcode:</strong> {row.original.barcode}</p>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* InventoryReports Modal */}
            {open && <InventoryReportsModal inventoryReport={editingInventoryReport} organizationId={selectedOrg} onClose={handleClose} />}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this Inventory?</DialogContentText>
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

export default InventoryReports;
