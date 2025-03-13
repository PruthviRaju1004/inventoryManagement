"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useCreateCustomerMutation, useUpdateCustomerMutation } from "@/state/api";

const CustomerModal = ({ customer, organizationId, onClose }: { customer: any; organizationId: number | null; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    customerCode: "",
    contactEmail: "",
    contactPhone: "",
    contactName: "",
    paymentTerms: "",
    currency: "",
    taxId: "",
  });

  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        customerCode: customer.customerCode || "",
        contactEmail: customer.contactEmail || "",
        contactPhone: customer.contactPhone || "",
        contactName: customer.contactName || "",
        paymentTerms: customer.paymentTerms || "",
        currency: customer.currency || "",
        taxId: customer.taxId || "",
      });
    } else {
      setFormData({
        name: "",
        customerCode: "",
        contactEmail: "",
        contactPhone: "",
        contactName: "",
        paymentTerms: "",
        currency: "",
        taxId: ""
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiData = {
      ...formData,
      organizationId: organizationId || customer?.organizationId, // Use selected org
    };
    if (customer?.id) {
      await updateCustomer({ id: customer.id, data: apiData });
    } else {
      await createCustomer(apiData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-h-[80vh] overflow-y-auto border-black-200">
        <h2 className="text-xl font-semibold mb-4">{customer ? "Edit Customer" : "Create Customer"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextField type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Customer Name" className="w-full p-2 border rounded" required />
          <TextField type="text" name="customerCode" value={formData.customerCode} onChange={handleChange} placeholder="Customer Code" className="w-full p-2 border rounded" required />
          <TextField type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Contact Email" className="w-full p-2 border rounded" required />
          <TextField type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Contact Phone" className="w-full p-2 border rounded" required />
          <TextField type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Contact Name" className="w-full p-2 border rounded" required />
          <TextField type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} placeholder="Payment Terms" className="w-full p-2 border rounded" required />
          <TextField type="text" name="currency" value={formData.currency} onChange={handleChange} placeholder="Currency" className="w-full p-2 border rounded" required />
          <TextField type="text" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="Tax ID" className="w-full p-2 border rounded" required />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="mt-4 btn-cancel">Cancel</button>
            <button type="submit" className="mt-4 btn-primary">{customer ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;

