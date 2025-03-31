'use client';
import { useState, useEffect } from "react";
import { TextField, Checkbox, FormControlLabel, MenuItem } from "@mui/material";
import { useCreateItemMutation, useUpdateItemMutation, Item } from "@/state/api";

const itemTypes = ["INVENTORY", "NON_INVENTORY", "SERVICE"];
const costingMethods = ["FIFO", "LIFO", "AVERAGE", "STANDARD"];

const ItemModal = ({ item, organizationId, onClose }: { item: Item | null; organizationId: number | null; onClose: () => void }) => {
  const [formData, setFormData] = useState(
    item || {
      name: "",
      itemCode: "",
      description: "",
      searchDescription: "",
      baseUom: "",
      secondaryUom: "",
      qtyPerUom: "",
      salesUom: "",
      purchaseUom: "",
      type: "INVENTORY",
      inventoryGroup: "",
      itemCategoryCode: "",
      parentCategory: "",
      productType: "",
      hsnSacCode: "",
      gstCredit: false,
      make: "",
      color: "",
      size: "",
      blocked: false,
      unitPrice: "",
      costingMethod: "FIFO",
      costPrice: "",
      commissionEligible: false,
      commissionFactor: "",
      businessUnitName: "",
      leadTimeDays: "",
      barcode: "",
      reorderLevel: "",
      safetyStockLevel: "",
      expirationDate: "",
      isPerishable: false,
      isActive: true,
    }
  );

  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();

  useEffect(() => {
    if (item) {
      setFormData({
        ...formData,
        ...item,
        leadTimeDays: Number(item.leadTimeDays),
        reorderLevel: Number(item.reorderLevel),
        safetyStockLevel: Number(item.safetyStockLevel),
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : type === "number"
          ? Math.max(0, Number(value)) || "" // Ensures minimum 0, but allows empty input
          : value,
    }));
  };


  // Handle decimal inputs separately
  const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setFormData((prev: typeof formData) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiData = {
      ...formData,
      organizationId: organizationId ?? item?.organizationId ?? 0,
      unitPrice: formData.unitPrice ? formData.unitPrice.toString() : "",
      costPrice: formData.costPrice ? formData.costPrice.toString() : "",
      qtyPerUom: formData.qtyPerUom ? formData.qtyPerUom.toString() : "",
      commissionFactor: formData.commissionFactor ? formData.commissionFactor.toString() : "",
      // expirationDate: expirationDate,
      leadTimeDays: Number(formData.leadTimeDays),
      reorderLevel: Number(formData.reorderLevel),
      safetyStockLevel: Number(formData.safetyStockLevel),
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : undefined,
    };
    // console.log(apiData);
    if (item?.id) {
      await updateItem({ id: item.id, data: apiData });
    } else {
      await createItem(apiData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-h-[80vh] overflow-y-auto border-4 border-black-200">
        <h2 className="text-xl font-semibold mb-4">{item ? "Edit Item" : "Create Item"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextField label="Product Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Item Code" name="itemCode" value={formData.itemCode} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
          <TextField label="Search Description" name="searchDescription" value={formData.searchDescription} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Base UOM" name="baseUom" value={formData.baseUom} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Secondary UOM" name="secondaryUom" value={formData.secondaryUom} onChange={handleChange} fullWidth margin="normal" />
          {/* Decimal Inputs */}
          <TextField label="Quantity per UOM" name="qtyPerUom" value={formData.qtyPerUom} onChange={handleDecimalChange} fullWidth margin="normal" />
          <TextField label="Sales UOM" name="salesUom" value={formData.salesUom} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Purchase UOM" name="purchaseUom" value={formData.purchaseUom} onChange={handleChange} fullWidth margin="normal" />
          <TextField select label="Type" name="type" value={formData.type} onChange={handleChange} fullWidth margin="normal" required>
            {itemTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <TextField label="Inventory Group" name="inventoryGroup" value={formData.inventoryGroup} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Item Category Code" name="itemCategoryCode" value={formData.itemCategoryCode} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Parent Category" name="parentCategory" value={formData.parentCategory} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Product Type" name="productType" value={formData.productType} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="HSN Sac Code" name="hsnSacCode" value={formData.hsnSacCode} onChange={handleChange} fullWidth margin="normal" />
          <FormControlLabel control={<Checkbox checked={formData.gstCredit} onChange={handleChange} name="gstCredit" />} label="GST Credit" />
          <TextField label="Make" name="make" value={formData.make} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Color" name="color" value={formData.color} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Size" name="size" value={formData.size} onChange={handleChange} fullWidth margin="normal" />
          <FormControlLabel control={<Checkbox checked={formData.blocked} onChange={handleChange} name="blocked" />} label="Blocked" />
          <TextField label="Unit Price" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="unitPrice" value={formData.unitPrice} onChange={handleDecimalChange} fullWidth margin="normal" required />
          <TextField select label="Costing Method" name="costingMethod" value={formData.costingMethod} onChange={handleChange} fullWidth margin="normal" required>
            {costingMethods.map((method) => (
              <MenuItem key={method} value={method}>{method}</MenuItem>
            ))}
          </TextField>
          <TextField label="Cost Price" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="costPrice" value={formData.costPrice} onChange={handleDecimalChange} fullWidth margin="normal" required />
          <FormControlLabel control={<Checkbox checked={formData.commissionEligible} onChange={handleChange} name="commissionEligible" />} label="Commission Eligible" />
          <TextField label="Commission Factor" name="commissionFactor" value={formData.commissionFactor} onChange={handleDecimalChange} fullWidth margin="normal" />
          <TextField label="Business Unit Name" name="businessUnitName" value={formData.businessUnitName} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Lead Time Days" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="leadTimeDays" value={formData.leadTimeDays} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Barcode" name="barcode" value={formData.barcode} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Recorder Level" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Safety Stock Level" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="safetyStockLevel" value={formData.safetyStockLevel} onChange={handleChange} fullWidth margin="normal" />
          <h2>Expiration Date</h2>
          <TextField
            type="date"
            value={formData.expirationDate}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <FormControlLabel control={<Checkbox checked={formData.isPerishable} onChange={handleChange} name="isPerishable" />} label="Perishable" />
          <FormControlLabel control={<Checkbox checked={formData.isActive} onChange={handleChange} name="isActive" />} label="Active" />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="mt-4 btn-cancel">
              Cancel
            </button>
            <button type="submit" className="mt-4 btn-primary">
              {item ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
