"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";
import { useGetSuppliersQuery, useDeleteSupplierMutation, Supplier } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import { useAppSelector } from "../redux";
import React from "react";
import debounce from "lodash.debounce";
import SearchBar from "../{components}/searchBar";

const SupplierModal = dynamic(() => import("./suppliersModal"), { ssr: false });

const Suppliers = () => {
    const { selectedOrg, setSelectedOrg } = useOrganizations();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const { data: suppliers } = useGetSuppliersQuery({ organizationId: selectedOrg ?? 0, search: debouncedSearch }, { skip: !selectedOrg });
    const [deleteSupplier] = useDeleteSupplierMutation();
    const [open, setOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const user = useAppSelector((state) => state.user);
    const userRole = user?.roleId || 4;
    const router = useRouter();

    const fliterSuppliers = useMemo(() => {
        return suppliers?.filter((warehouse) =>
            warehouse.name.toLowerCase().includes(search.toLowerCase()) ||
            warehouse.supplierCode.toLowerCase().includes(search.toLowerCase())
        ) || [];
    }, [suppliers, search]);

    const debouncedSetSearch = useMemo(() => debounce(setDebouncedSearch, 500), []);

    useEffect(() => {
        debouncedSetSearch(search);
    }, [search, debouncedSetSearch]);

    const handleOpen = (supplier: Supplier | null = null) => {
        setEditingSupplier(supplier);
        setOpen(true);
    };

    const handleClose = () => {
        setEditingSupplier(null);
        setOpen(false);
    };

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } =
        useDeleteDialog(async (id) => await deleteSupplier(Number(id)));

    const columns: ColumnDef<Supplier>[] = [
        {
            accessorKey: "name",
            header: "Supplier Name",
            cell: ({ row }: { row: { original: Supplier } }) => (
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
        ...(userRole !== 4
            ? [
                {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }: { row: { original: Supplier } }) => (
                        <div className="flex gap-2">
                            {userRole !== 4 && (
                                <button onClick={() => handleOpen(row.original)} className="p-2 text-primary_btn_color rounded">
                                    <Pencil size={16} />
                                </button>
                            )}
                            {userRole !== 4 && userRole !== 3 && (
                                <button onClick={() => handleDeleteClick(String(row.original.id))} className="p-2 text-primary_btn_color rounded">
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
        data: fliterSuppliers,
        columns,
        state: { expanded: expandedRows },
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Suppliers</h1>
            <div className="flex justify-between gap-4 align-center">
                <div className="flex gap-4">
                    {!localStorage.getItem("userOrg") &&
                        <div>
                            <OrganizationSelector selectedOrg={selectedOrg} onChange={setSelectedOrg} />
                        </div>}
                    <div>
                        <SearchBar onSearch={setSearch} placeholder="Search Suppliers by Supplier Name and Code" />
                    </div>
                </div>
                {userRole !== 4 &&
                    <button onClick={() => handleOpen()} className="bg-primary_btn_color text-white font-medium text-base px-4 h-12 rounded-sm">
                        Create Supplier
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
