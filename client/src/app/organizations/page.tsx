"use client";
import { useState } from "react";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import {
  useGetOrganizationsQuery,
  useDeleteOrganizationMutation,
  Organization
} from "../../state/api";
import OrganizationModal from "./organizationModal";

const Organizations = () => {
  const { data: organizations, isLoading } = useGetOrganizationsQuery();
  const [deleteOrganization] = useDeleteOrganizationMutation();
  const [open, setOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpen = (org = null) => {
    setEditingOrg(org);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingOrg(null);
    setOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteOrganization(Number(deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const columns = [
    // { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "contactEmail", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "contactPhone", headerName: "Phone", flex: 1, minWidth: 200 },
    {
      field: "fullAddress",
      headerName: "Address",
      flex: 1,
      minWidth: 300,
      renderCell: (params: GridRenderCellParams) => {
        if (!params?.row) return "";
        const { address, address2, city, state, country, zipCode } = params.row;
        return [address, address2, city, state, country, zipCode]
          .filter(Boolean)
          .join(", ");
      },
    },
    { field: "taxId", headerName: "Tax ID", flex: 1, minWidth: 150 },
    { field: "dunsNumber", headerName: "DUNS Number", flex: 1, minWidth: 150 },
    { field: "website", headerName: "Website", flex: 1, minWidth: 250 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex gap-2">
          <button onClick={() => handleOpen(params.row)} className="p-2 text-primary_btn_color rounded">
            <Pencil size={16} />
          </button>
          <button onClick={() => handleDeleteClick(params.row.id)} className="p-2 text-primary_btn_color rounded">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <button onClick={() => handleOpen()} className="mt-4 bg-primary_btn_color text-[#fff] font-medium 
        font-sans text-base text-center px-4 h-12 rounded-sm mb-4">Create Organization</button>
      <DataGrid rows={organizations || []} columns={columns} loading={isLoading} disableColumnResize
        sx={{
          width: "100%",
          minHeight: "100%",
          "& .MuiDataGrid-container--top [role=row]": { backgroundColor: "#f4f4f4" },
          "& .MuiDataGrid-cell--textLeft": { display: "flex" },
        }} />

      {open && <OrganizationModal organization={editingOrg} onClose={handleClose} />}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this organization?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Organizations;
