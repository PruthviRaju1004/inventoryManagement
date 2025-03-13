"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";
import { useGetSuppliersQuery, useDeleteSupplierMutation } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import React from "react";

const SupplierModal = dynamic(() => import("./suppliersModal"), { ssr: false });

const Suppliers = () => {
    const { organizations, selectedOrg, setSelectedOrg } = useOrganizations();
    const { data: suppliers, isLoading } = useGetSuppliersQuery(selectedOrg ?? 0, { skip: !selectedOrg });
    const [deleteSupplier] = useDeleteSupplierMutation();
    const [open, setOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<any | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const router = useRouter();

    const handleOpen = (supplier = null) => {
        setEditingSupplier(supplier);
        setOpen(true);
    };

    const handleClose = () => {
        setEditingSupplier(null);
        setOpen(false);
    };

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } =
        useDeleteDialog(async (id) => await deleteSupplier(Number(id)));

    const toggleExpandRow = (id: number) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const columns: ColumnDef<any>[] = [
        // {
        //     id: "expand",
        //     header: () => null,
        //     cell: ({ row }) => (
        //         <button onClick={() => toggleExpandRow(row.original.id)} className="p-2 text-gray-500">
        //             {expandedRows[row.original.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        //         </button>
        //     ),
        // },
        {
            accessorKey: "name",
            header: "Supplier Name",
            cell: ({ row }) => (
                <button onClick={() => router.push(`/suppliers/${row.original.id}?organizationId=${selectedOrg}`)} className="text-blue-600 hover:underline">
                    {row.original.name}
                </button>
            ),
        },
        { accessorKey: "supplierCode", header: "Supplier Code" },
        { accessorKey: "contactEmail", header: "Email" },
        { accessorKey: "contactPhone", header: "Phone" },
        { accessorKey: "contactName", header: "Contact Name" },
        { accessorKey: "paymentTerms", header: "Payment Terms" },
        { accessorKey: "taxId", header: "Tax ID" },
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
        data: suppliers || [],
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
                    Create Supplier
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

                                {/* {expandedRows[row.original.id] && (
                                    <tr key={`expanded-${row.id}`} className="bg-gray-100">
                                        <td colSpan={columns.length} className="p-4">
                                            <p>
                                                <strong>Contact Name:</strong> {row.original.contactName}
                                            </p>
                                            <p>
                                                <strong>Payment Terms:</strong> {row.original.paymentTerms}
                                            </p>
                                            <p>
                                                <strong>Tax ID:</strong> {row.original.taxId}
                                            </p>
                                        </td>
                                    </tr>
                                )} */}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Supplier Modal */}
            {open && <SupplierModal supplier={editingSupplier} organizationId={selectedOrg} onClose={handleClose} />}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this supplier?</DialogContentText>
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

export default Suppliers;
