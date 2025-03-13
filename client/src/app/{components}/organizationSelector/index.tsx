"use client";
import React from "react";
import { Select, MenuItem, CircularProgress } from "@mui/material";
import { useGetOrganizationsQuery } from "../../../state/api";

interface Props {
  selectedOrg: number | null;
  onChange: (orgId: number) => void;
}

const OrganizationSelector: React.FC<Props> = ({ selectedOrg, onChange }) => {
  const { data: organizations, isLoading } = useGetOrganizationsQuery();

  if (isLoading) return <CircularProgress />;

  return (
    <Select
      value={selectedOrg || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      displayEmpty
      fullWidth
    >
      <MenuItem value="" disabled>Select an Organization</MenuItem>
      {organizations?.map((org) => (
        <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
      ))}
    </Select>
  );
};

export default OrganizationSelector;
