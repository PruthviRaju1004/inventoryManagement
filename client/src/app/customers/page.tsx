"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { useGetCustomersQuery, useDeleteCustomerMutation } from "../../state/api";
import { Customer } from "@/state/api";
import dynamic from "next/dynamic";
import OrganizationSelector from "../{components}/organizationSelector/index";
import useOrganizations from "../{hooks}/useOrganizations";
import useDeleteDialog from "../{hooks}/useDeleteDialog";
import React from "react";

const CustomerModal = dynamic(() => import("./customersModal"), { ssr: false });

const Customers = () => {
  const { selectedOrg, setSelectedOrg } = useOrganizations();
  const { data: customers } = useGetCustomersQuery(selectedOrg ?? 0, {
    skip: !selectedOrg,
  });
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  // const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const handleOpen = (customer: Customer | null = null) => {
    setEditingCustomer(customer);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingCustomer(null);
    setOpen(false);
  };

  const { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm } =
    useDeleteDialog(async (id) => await deleteCustomer(Number(id)));

  const columns: ColumnDef<Customer>[] = [
    // {
    //   id: "expand",
    //   header: () => null,
    //   cell: ({ row }) => (
    //     <button onClick={() => toggleExpandRow(row.original.id)} className="p-2 text-gray-500">
    //       {expandedRows[row.original.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    //     </button>
    //   ),
    // },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "customerCode", header: "Customer Code" },
    { accessorKey: "contactEmail", header: "Email" },
    { accessorKey: "contactPhone", header: "Phone" },
    { accessorKey: "paymentTerms", header: "Payment Terms" },
    { accessorKey: "taxId", header: "Tax ID" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpen(row.original)}
            className="p-2 text-primary_btn_color rounded"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(String(row.original.id))}
            className="p-2 text-primary_btn_color rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: customers || [],
    columns,
    // state: { expanded: expandedRows },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <div>
            <OrganizationSelector selectedOrg={selectedOrg} onChange={setSelectedOrg} />
        </div>
        <button
          onClick={() => handleOpen()}
          className="mt-4 bg-primary_btn_color text-white font-medium text-base px-4 h-12 rounded-sm">
          Create Customer
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
                {/* Main Row */}
                <tr className="border-b">
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

      {/* Customer Modal */}
      {open && <CustomerModal customer={editingCustomer} organizationId={selectedOrg} onClose={handleClose} />}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this customer?</DialogContentText>
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

export default Customers;
