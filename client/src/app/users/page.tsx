"use client";

import { useState, useMemo } from "react";
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
import { useGetUsersByOrganizationQuery, useDeleteUserMutation, User } from "../../state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import { useAppSelector } from "../redux";
import React from "react";

const UserModal = dynamic(() => import("./userModal"), { ssr: false });

const Users = () => {
    const { selectedOrg, setSelectedOrg } = useOrganizations();
    const organizationId = localStorage.getItem("userOrg") ? Number(localStorage.getItem("userOrg")) : selectedOrg ?? 0;
    const { data: users } = useGetUsersByOrganizationQuery(organizationId, { skip: !selectedOrg });
    const [deleteUser] = useDeleteUserMutation();
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const user = useAppSelector((state) => state.user);
    const userRole = user?.roleId || 4;
    const router = useRouter();

    const filteredUsers = useMemo(() => {
        return users?.filter(u => u.email !== user?.email) || [];
    }, [users, user?.email]);

    const handleOpen = (user: User | null = null) => {
        setEditingUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setEditingUser(null);
        setOpen(false);
    };

    const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } =
        useDeleteDialog(async (id) => await deleteUser({ userId: Number(id) }));

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
            cell: ({ row }: { row: { original: User } }) => (
                <button onClick={() => router.push(`/users/${row.original.id}?organizationId=${selectedOrg}`)} className="text-blue-600 hover:underline">
                    {row.original.firstName}
                </button>
            ),
        },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phoneNumber", header: "Phone Number" },
        ...(userRole !== 4
            ? [
                {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }: { row: { original: User } }) => (
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
        data: filteredUsers || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Organization Users</h1>
            <div className="flex justify-between gap-4">
                {!localStorage.getItem("userOrg") &&
                    <div>
                        <OrganizationSelector selectedOrg={selectedOrg} onChange={setSelectedOrg} />
                    </div>}
                {userRole !== 4 &&
                    <button onClick={() => handleOpen()} className="bg-primary_btn_color text-white font-medium text-base px-4 h-12 rounded-sm">
                        Create User
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

            {/* User Modal */}
            {open && <UserModal user={editingUser} organizationId={selectedOrg} onClose={handleClose} />}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
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

export default Users;
