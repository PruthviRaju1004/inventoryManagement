"use client";
import React, { useState, useEffect } from "react";
import { useCreateSupplierMutation, useUpdateSupplierMutation, Supplier } from "@/state/api";
import { TextField } from "@mui/material";
import AddressFields from "../{components}/address";

const SupplierModal = ({ supplier, organizationId, onClose }: { supplier: Supplier | null; organizationId: number | null; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    supplierCode: "",
    contactEmail: "",
    contactPhone: "",
    contactName: "",
    address: "",
    address2: "", 
    city: "",
    state: "",
    country: "",
    zipCode: "",
    paymentTerms: "",
    currency: "",
    taxId: "",
  });

  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        supplierCode: supplier.supplierCode || "",
        contactEmail: supplier.contactEmail || "",
        contactPhone: supplier.contactPhone || "",
        address: supplier.address || "",
        address2: supplier.address2 || "",
        city: supplier.city || "",
        state: supplier.state || "",
        country: supplier.country || "",
        zipCode: supplier.zipCode || "",
        contactName: supplier.contactName || "",
        paymentTerms: supplier.paymentTerms || "",
        currency: supplier.currency || "",
        taxId: supplier.taxId || "",
      });
    } else {
      setFormData({
        name: "",
        supplierCode: "",
        contactEmail: "",
        contactPhone: "",
        contactName: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        paymentTerms: "",
        currency: "",
        taxId: ""
      });
    }
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiData = {
      ...formData,
      organizationId: organizationId ?? supplier?.organizationId ?? 0, // Ensure organizationId is always a number
    };
    if (supplier?.id) {
      await updateSupplier({ id: supplier.id, data: apiData });
    } else {
      await createSupplier(apiData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-h-[80vh] overflow-y-auto border-black-200">
        <h2 className="text-xl font-semibold mb-4">{supplier ? "Edit Supplier" : "Create Supplier"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextField type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Supplier Name" className="w-full p-2 border rounded" required />
          <TextField type="text" name="supplierCode" value={formData.supplierCode} onChange={handleChange} placeholder="Supplier Code" className="w-full p-2 border rounded" required />
          <TextField type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Contact Email" className="w-full p-2 border rounded" required />
          <TextField type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Contact Phone" className="w-full p-2 border rounded" required />
          <AddressFields
            address={formData.address}
            address2={formData.address2}
            city={formData.city}
            state={formData.state}
            country={formData.country}
            zipCode={formData.zipCode}
            onChange={handleChange}
          />
          <TextField type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Contact Name" className="w-full p-2 border rounded" required />
          <TextField type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} placeholder="Payment Terms" className="w-full p-2 border rounded" required />
          <TextField type="text" name="currency" value={formData.currency} onChange={handleChange} placeholder="Currency" className="w-full p-2 border rounded" required />
          <TextField type="text" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="Tax ID" className="w-full p-2 border rounded" required />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="mt-4 btn-cancel">Cancel</button>
            <button type="submit" className="mt-4 btn-primary">{supplier ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
