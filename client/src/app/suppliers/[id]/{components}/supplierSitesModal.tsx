"use client";
import React, { useState, useEffect } from "react";
import { useCreateSupplierSiteMutation, useUpdateSupplierSiteMutation, SupplierSite } from "@/state/api";
import { TextField } from "@mui/material";

const SupplierSiteModal = ({ supplierSite, onClose, supplierId }: { supplierSite: SupplierSite | null; onClose: () => void; supplierId: string }) => {
  const [formData, setFormData] = useState({
    name: "",
    siteCode: "",
    contactEmail: "",
    contactPhone: "",
    contactName: "",
    latitude: "",
    longitude: "",
    address: ""
  });

  const [createSupplierSite] = useCreateSupplierSiteMutation();
  const [updateSupplierSite] = useUpdateSupplierSiteMutation();

  useEffect(() => {
    if (supplierSite) {
      setFormData({
        name: supplierSite.siteName || "",
        siteCode: supplierSite.siteCode || "",
        contactEmail: supplierSite.contactEmail || "",
        contactPhone: supplierSite.contactPhone || "",
        address: supplierSite.address || "",
        contactName: supplierSite.contactName || "",
        latitude: supplierSite.latitude?.toString() || "",
        longitude: supplierSite.longitude?.toString() || "",
      });
    } else {
      setFormData({
        name: "",
        siteCode: "",
        contactEmail: "",
        contactPhone: "",
        contactName: "",
        latitude: "",
        longitude: "",
        address: "",
      });
    }
  }, [supplierSite]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiData = {
      ...formData,
      supplierId: Number(supplierId), // Convert supplierId to number
      siteCode: formData.siteCode, // Assuming siteCode is same as supplierCode
      siteName: formData.name,
      address: formData.address, // Add default or appropriate value
      latitude: parseFloat(formData.latitude), // Convert to number
      longitude: parseFloat(formData.longitude) // Convert to number
    };
    if (supplierSite?.id) {
      await updateSupplierSite({ supplierId: Number(supplierId), siteId: supplierSite.id, data: apiData });
    } else {
      await createSupplierSite({ supplierId: Number(supplierId), siteData: apiData });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-h-[80vh] overflow-y-auto border-black-200">
        <h2 className="text-xl font-semibold mb-4">{supplierSite ? "Edit Supplier Site" : "Create Supplier Site"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextField type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Site Name" className="w-full p-2 border rounded" required />
          <TextField type="text" name="siteCode" value={formData.siteCode} onChange={handleChange} placeholder="Site Code" className="w-full p-2 border rounded" required />
          <TextField type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Contact Email" className="w-full p-2 border rounded" required />
          <TextField type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Contact Phone" className="w-full p-2 border rounded" required />
          <TextField type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Contact Name" className="w-full p-2 border rounded" required />
          <TextField type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" className="w-full p-2 border rounded" required />
          <TextField type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" className="w-full p-2 border rounded" required />
          <TextField type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" required />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="mt-4 btn-cancel">Cancel</button>
            <button type="submit" className="mt-4 btn-primary">{supplierSite ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierSiteModal;
