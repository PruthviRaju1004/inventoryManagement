"use client";
import React, { useState, useEffect } from "react";
import { useCreateUserMutation, useUpdateUserRoleMutation, User } from "@/state/api";
import { TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import { useAppSelector } from "../redux";

const UserModal = ({ user, organizationId, onClose }: { user: User | null; organizationId: number | null; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    roleId: 0,
    password: "",
  });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserRoleMutation();

  const userData = useAppSelector((state) => state.user);
  const userRole = userData?.roleId || 4;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        username: user.username || "",
        roleId: user.roleId,
        password: "",
      });
    } else {
      setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "", username: "", roleId: 0, password: "" });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiData = {
      ...formData,
      organizationId: organizationId ?? user?.organizationId ?? 0, // Ensure organizationId is always a number
    };
  
    if (user?.id) {
      // If updating user, don't send password unless changed
      const updateData = { ...apiData, userId: user.id };
      if (!formData.password) (updateData as any).password = undefined;
      await updateUser(updateData);
    } else {
      // Create a new user
      await createUser(apiData);  // This will create the user and send the email in the backend
    }
    onClose();
  };  

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const roleOptions = [
    { value: 2, label: "Admin" },
    { value: 3, label: "Manager" },
    { value: 4, label: "Viewer" },
  ].filter((role) => {
    if(userRole === 1) return true; // Super Admin can add all roles
    if (userRole === 2) return true; // Admin can add all roles
    if (userRole === 3) return role.value !== 2; // Manager can only add Manager and Viewer
    return false; // Viewers or other roles cannot add users
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] max-h-[80vh] overflow-y-auto border-black-200">
        <h2 className="text-xl font-semibold mb-4">{user ? "Edit User" : "Create User"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} fullWidth required />
          <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} fullWidth required />
          <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
          <TextField name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} fullWidth required />
          <TextField name="username" label="Username" value={formData.username} onChange={handleChange} fullWidth required />
          
          {/* Role Selection Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select name="roleId" value={formData.roleId} onChange={handleSelectChange} required>
              {roleOptions.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="mt-4 btn-cancel">Cancel</button>
            <button type="submit" className="mt-4 btn-primary">{user ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
