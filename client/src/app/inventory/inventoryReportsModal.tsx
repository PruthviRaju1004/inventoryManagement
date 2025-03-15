'use client';
import { useState, useEffect } from "react";
import { TextField, Typography, MenuItem } from "@mui/material";
import { useCreateInventoryReportMutation, useUpdateInventoryReportMutation, useGetWarehousesQuery, InventoryReport } from "@/state/api";

const InventoryReports = ({ inventoryReport, organizationId, onClose }: { inventoryReport: InventoryReport; organizationId: number | null; onClose: () => void }) => {
    const [formData, setFormData] = useState(
        inventoryReport || {
            itemName: "",
            sku: "",
            batchNumber: "",
            lotNumber: "",
            serialNumber: "",
            manufacturingDate: "",
            expiryDate: "",
            stockInwardDate: "",
            stockOutwardDate: "",
            openingQuantity: "",
            currentQuantity: "",
            inwardQuantity: "",
            outwardQuantity: "",
            committedQuantity: "",
            availableQuantity: "",
            damagedQuantity: false,
            unitCost: "",
            totalValue: "",
            reorderLevel: "",
            warehouseId: "",
            warehouseName: "",
            subWarehouseName: "",
            binLocation: "",
            category: "",
            subCategory: "",
            barcode: "",
            unitOfMeasure: "",
        }
    );
    const { data: warehouses = [] } = useGetWarehousesQuery(organizationId ?? 0);
    const [createInventoryReport] = useCreateInventoryReportMutation();
    const [updateInventoryReport] = useUpdateInventoryReportMutation();

    useEffect(() => {
        if (inventoryReport) {
            const formatDate = (date: string | null | undefined) =>
                date ? new Date(date).toISOString().split("T")[0] : "";
    
            setFormData((prev) => ({
                ...prev,
                ...inventoryReport,
                manufacturingDate: formatDate(inventoryReport.manufacturingDate),
                expiryDate: formatDate(inventoryReport.expiryDate),
                stockInwardDate: formatDate(inventoryReport.stockInwardDate),
                stockOutwardDate: formatDate(inventoryReport.stockOutwardDate),
            }));
        }
    }, [inventoryReport]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        // If it's a number input, ensure the value is not less than 0
        const newValue = type === "number" ? Math.max(0, Number(value)) : value;
        setFormData((prev: typeof formData) => ({
            ...prev,
            [name]: newValue,
        }));
    };    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parseDate = (date: string | undefined) => (date ? new Date(date).toISOString() : undefined);
        const apiData = {
            ...formData,
            organizationId: organizationId || inventoryReport?.organizationId,
            itemName: formData.itemName,
            sku: formData.sku,
            batchNumber: formData.batchNumber,
            lotNumber: formData.lotNumber,
            serialNumber: formData.serialNumber,
            manufacturingDate: parseDate(formData.manufacturingDate) || undefined,
            expiryDate: parseDate(formData.expiryDate) || undefined,
            stockInwardDate: parseDate(formData.stockInwardDate) || undefined,
            stockOutwardDate: parseDate(formData.stockOutwardDate) || undefined,
            openingQuantity: formData.openingQuantity,
            currentQuantity: formData.currentQuantity,
            inwardQuantity: formData.inwardQuantity,
            outwardQuantity: formData.outwardQuantity,
            committedQuantity: formData.committedQuantity,
            availableQuantity: formData.availableQuantity,
            damagedQuantity: formData.damagedQuantity,
            unitCost: formData.unitCost,
            totalValue: formData.availableQuantity * formData.unitCost,
            reorderLevel: formData.reorderLevel,
            warehouseId: formData.warehouseId,
            warehouseName: formData.warehouseName,
            subWarehouseName: formData.subWarehouseName,
            binLocation: formData.binLocation,
            category: formData.category,
            subCategory: formData.subCategory,
            barcode: formData.barcode,
            unitOfMeasure: formData.unitOfMeasure,
        };
        if (inventoryReport?.inventoryId) {
            await updateInventoryReport({ id: inventoryReport.inventoryId, data: apiData });
        } else {
            await createInventoryReport(apiData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-h-[80vh] overflow-y-auto border-4 border-black-200">
                <h2 className="text-xl font-semibold mb-4">{inventoryReport ? "Edit Inventory Report" : "Create Inventory Report"}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <TextField label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="SKU" name="sku" value={formData.sku} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleChange} fullWidth margin="normal"/>
                    <TextField label="Lot Number" name="lotNumber" value={formData.lotNumber} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Serial Number" name="serialNumber" value={formData.serialNumber} onChange={handleChange} fullWidth margin="normal" />
                    <div>
                    <label>Manufacturing Date</label>
                        <TextField
                            type="date"
                            name="manufacturingDate"
                            value={formData.manufacturingDate || ""}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                        />
                    </div>
                    <label>Expiry Date</label>
                    <TextField
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <label>Stock Inward Date</label>
                    <TextField
                        type="date"
                        name="stockInwardDate"
                        value={formData.stockInwardDate || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <label>Stock Outward Date</label>
                    <TextField
                        type="date"
                        name="stockOutwardDate"
                        value={formData.stockOutwardDate || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField label="Opening Quantity" type="number" name="openingQuantity" value={formData.openingQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Current Quantity" type="number" name="currentQuantity" value={formData.currentQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Inward Quantity" type="number" name="inwardQuantity" value={formData.inwardQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Outward Quantity" type="number" name="outwardQuantity" value={formData.outwardQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Committed Quantity" type="number" name="committedQuantity" value={formData.committedQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Available Quantity" type="number" name="availableQuantity" value={formData.availableQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Damaged Quantity" type="number" name="damagedQuantity" value={formData.damagedQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Unit Cost" type="number" name="unitCost" value={formData.unitCost} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Reorder Level" type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} fullWidth margin="normal" />
                    <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                        Total Value: {Number(formData.availableQuantity*formData.unitCost).toFixed(2)}
                    </Typography>
                    <TextField
                        select
                        label="Warehouse"
                        value={formData.warehouseId}
                        onChange={(e) => {
                            const selectedWarehouse = warehouses.find(
                                (warehouse) => warehouse.id === Number(e.target.value)
                            );
                            setFormData((prev: typeof formData) => ({
                                ...prev,
                                warehouseId: Number(e.target.value),
                                warehouseName: selectedWarehouse ? selectedWarehouse.name : "",
                            }));
                        }}
                        fullWidth
                        margin="dense">
                        {warehouses.length > 0 ? (
                            warehouses.map((warehouse) => (
                                <MenuItem key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No warehouses available</MenuItem>
                        )}
                    </TextField>
                    <TextField label="Sub-Warehouse Name" name="subWarehouseName" value={formData.subWarehouseName} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Bin Location" name="binLocation" value={formData.binLocation} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Category" name="category" value={formData.category} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Sub-Category" name="subCategory" value={formData.subCategory} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Unit Of Measure" name="unitOfMeasure" value={formData.unitOfMeasure} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Barcode" name="barcode" value={formData.barcode} onChange={handleChange} fullWidth margin="normal" />

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="mt-4 btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="mt-4 btn-primary">
                            {inventoryReport ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryReports;
