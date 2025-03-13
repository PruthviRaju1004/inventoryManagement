"use client";
import React, { useState, useEffect } from "react";
import { useLinkProductsToSupplierMutation, useUpdateSupplierItemMutation, useGetItemsQuery } from "@/state/api";
import { TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress, SelectChangeEvent } from "@mui/material";


const SupplierItemModal = ({ supplierItem, onClose, supplierId, organizationId }: { supplierItem: any; onClose: () => void; supplierId: string; organizationId: string }) => {
  const [formData, setFormData] = useState({
    itemId: "",
    supply_quantity: "",
    supply_price: "",
    effective_date: "",
    is_preferred: false,
    created_by: "",
  });

  const { data: items, isLoading } = useGetItemsQuery(Number(organizationId) || 0); // Fetch items
  const [createSupplierItem] = useLinkProductsToSupplierMutation();
  const [updateSupplierItem] = useUpdateSupplierItemMutation();

  useEffect(() => {
    if (supplierItem) {
      setFormData({
        itemId: supplierItem.itemId ? String(supplierItem.itemId) : "", 
        supply_quantity: supplierItem.supply_quantity || "",
        supply_price: supplierItem.supply_price || "",
        effective_date: supplierItem.effective_date || "",
        is_preferred: supplierItem.is_preferred || false,
        created_by: supplierItem.created_by || "",
      });
    } else {
      setFormData({
        itemId: "",
        supply_quantity: "",
        supply_price: "",
        effective_date: "",
        is_preferred: false,
        created_by: "",
      });
    }
  }, [supplierItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      itemId: e.target.value, // Store as string for dropdown compatibility
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiData = {
      ...formData,
      supplierId: Number(supplierId), // Convert supplierId to number
      itemId: Number(formData.itemId),
      supply_quantity: formData.supply_quantity, // Keep as string
      supply_price: formData.supply_price, // Keep as string
      effective_date: new Date(formData.effective_date), // Convert to date
    };

    if (supplierItem?.id) {
      await updateSupplierItem({ supplierId: Number(supplierId), itemId: supplierItem.itemId, data: apiData });
    } else {
      await createSupplierItem({ ...apiData, itemId: Number(formData.itemId), effective_date: new Date(formData.effective_date).toISOString(), created_by: Number(formData.created_by) });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-h-[80vh] overflow-y-auto border-black-200">
        <h2 className="text-xl font-semibold mb-4">{supplierItem ? "Edit Supplier Item" : "Create Supplier Item"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
        <FormControl fullWidth required>
            <InputLabel>Item</InputLabel>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                name="itemId"
                value={formData.itemId}
                onChange={handleSelectChange}
              >
                {items?.map((item: { id: number; name: string }) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
          <TextField
            type="number"
            name="supply_quantity"
            value={formData.supply_quantity}
            onChange={handleChange}
            placeholder="Supply Quantity"
            className="w-full p-2 border rounded"
            required
          />
          <TextField
            type="number"
            name="supply_price"
            value={formData.supply_price}
            onChange={handleChange}
            placeholder="Supply Price"
            className="w-full p-2 border rounded"
            required
          />
          <div>
            <label>Effective Date</label>
            <TextField
              type="date"
              name="effective_date"
              value={formData.effective_date}
              onChange={handleChange}
              placeholder="Effective Date"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_preferred"
              checked={formData.is_preferred}
              onChange={(e) => setFormData({ ...formData, is_preferred: e.target.checked })}
            />
            <label htmlFor="is_preferred">Is Preferred</label>
          </div>
          <TextField
            type="text"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
            placeholder="Created By"
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="mt-4 btn-cancel">
              Cancel
            </button>
            <button type="submit" className="mt-4 btn-primary">
              {supplierItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierItemModal;
