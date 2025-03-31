'use client';
import { useState, useEffect } from "react";
import { TextField, Typography, MenuItem } from "@mui/material";
import {
    useCreateInventoryReportMutation, useUpdateInventoryReportMutation, useGetWarehousesQuery, useGetItemsQuery, InventoryReport,
    useGetGRNsQuery
} from "@/state/api";

const InventoryReports = ({ inventoryReport, organizationId, onClose }: { inventoryReport: InventoryReport | null; organizationId: number | null; onClose: () => void }) => {
    const [formData, setFormData] = useState(
        inventoryReport || {
            itemId: 0,
            itemName: "",
            sku: "",
            batchNumber: "",
            lotNumber: "",
            serialNumber: "",
            manufacturingDate: "",
            expiryDate: "",
            stockInwardDate: "",
            stockOutwardDate: "",
            // openingQuantity: "",
            // currentQuantity: "",
            // inwardQuantity: "",
            // outwardQuantity: "",
            // committedQuantity: "",
            // availableQuantity: "",
            damagedQuantity: false,
            sellingPrice: "",
            // totalValue: "",
            reorderLevel: 0,
            warehouseId: 0,
            warehouseName: "",
            subWarehouseName: "",
            binLocation: "",
            category: "",
            subCategory: "",
            barcode: "",
            unitOfMeasure: "",
            grnId: 0, // Added grnId to the initial state
            grnNumber: "", // Added grnNumber to the initial state
        }
    );
    const [selectedGrn, setSelectedGrn] = useState<string | null>(null);
    const [allocation, setAllocation] = useState(0);
    const [freight, setFreight] = useState(0);
    const [dutyCharges, setDutyCharges] = useState(0);
    const [currentSelectedItem, setCurrentSelectedItem] = useState<{
        id: number;
        grnId: number;
        itemId: number;
        itemName: string;
        orderedQty: number;
        receivedQty: number;
        unitPrice: number;
        uom: string;
        lineTotal: number;
        batchNumber?: string | null;
        manufacturingDate?: string | null;
        expiryDate?: string | null;
        storageLocation?: string | null;
    } | null>(null);
    const [filteredItems, setFilteredItems] = useState<{
        id: number;
        grnId: number;
        itemId: number;
        itemName: string;
        orderedQty: number;
        receivedQty: number;
        unitPrice: number;
        uom: string;
        lineTotal: number;
        batchNumber?: string | null;
        manufacturingDate?: string | null;
        expiryDate?: string | null;
        storageLocation?: string | null;
    }[]>([]);
    const { data: warehouses = [] } = useGetWarehousesQuery({ organizationId: organizationId ?? 0 });
    // const { data: items = [] } = useGetItemsQuery({ organizationId: organizationId ?? 0 });
    const { data: grns = [] } = useGetGRNsQuery({ organizationId: organizationId ?? 0 });
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
    useEffect(() => {
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        // If it's a number input, ensure the value is not less than 0
        const newValue = type === "number" ? Math.max(0, Number(value)) : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleGrnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const grnId = e.target.value;
        setSelectedGrn(grnId);
        // Find the selected GRN and filter the items
        const grn = grns.find((grn) => grn.grnId === Number(grnId));
        if (grn) {
            // console.log(grn);
            setFilteredItems(grn.grnLineItems);
            setFormData((prev) => ({
                ...prev,
                grnId: Number(grnId), // Ensure grnId is a number
                grnNumber: grn.grnNumber || `GRN #${grnId}`, // Update the formData to reflect selected GRN number
                warehouseId: grn.warehouseId,
                warehouseName: grn.warehouseName,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parseDate = (date: string | undefined) => (date ? new Date(date).toISOString() : undefined);
        const providedQuantity = currentSelectedItem?.receivedQty ?? 0;
        const supplierPrice = currentSelectedItem?.unitPrice ?? 0;
        const fobAmount = providedQuantity * supplierPrice;
        const cAndHCharges = fobAmount * 0.1;
        const costBeforeDuty = fobAmount + freight;
        const costBeforeProfitMargin = costBeforeDuty + dutyCharges;
        const costPerUnit = parseFloat((costBeforeProfitMargin / (providedQuantity || 1)).toFixed(2));
        const apiData = {
            ...formData,
            organizationId: organizationId ?? inventoryReport?.organizationId ?? 0,
            itemId: formData.itemId,
            itemName: formData.itemName,

            sku: formData.sku,
            batchNumber: formData.batchNumber,
            lotNumber: formData.lotNumber,
            serialNumber: formData.serialNumber,
            manufacturingDate: parseDate(formData.manufacturingDate) || undefined,
            expiryDate: parseDate(formData.expiryDate) || undefined,
            stockInwardDate: parseDate(formData.stockInwardDate) || undefined,
            stockOutwardDate: parseDate(formData.stockOutwardDate) || undefined,
            // openingQuantity: Number(formData.openingQuantity),
            // currentQuantity: Number(formData.currentQuantity),
            // inwardQuantity: Number(formData.inwardQuantity),
            // outwardQuantity: Number(formData.outwardQuantity),
            // committedQuantity: Number(formData.committedQuantity),
            // availableQuantity: Number(formData.availableQuantity),
            // damagedQuantity: Number(formData.damagedQuantity),
            providedQuantity,
            supplierPrice,
            fobAmount,
            allocation,
            cAndHCharges,
            freight,
            costBeforeDuty,
            dutyCharges,
            costBeforeProfitMargin,
            costPerUnit: Number(costPerUnit),
            sellingPrice: Number(formData.sellingPrice),
            // totalValue: Number(formData.availableQuantity) * Number(formData.unitCost),
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
        // console.log(apiData);
        if (inventoryReport?.inventoryId) {
            await updateInventoryReport({ id: inventoryReport.inventoryId, data: apiData });
        } else {
            await createInventoryReport(apiData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] max-h-[80vh] overflow-y-auto border-4 border-black-200">
                <h2 className="text-xl font-semibold mb-4">{inventoryReport ? "Edit Inventory Report" : "Create Inventory Report"}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <TextField
                        select
                        label="Select GRN"
                        value={selectedGrn || ""}
                        onChange={handleGrnChange}  // Update the handler to change GRN
                        fullWidth
                        margin="dense"
                    >
                        {grns.length > 0 ? (
                            grns.map((grn) => (
                                <MenuItem key={grn.grnId} value={grn.grnId}>
                                    {grn.grnNumber || `GRN #${grn.grnId}`}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No GRNs available</MenuItem>
                        )}
                    </TextField>

                    <TextField
                        select
                        label="Item Name"
                        value={currentSelectedItem?.itemId || ""} // Display the item name as the value
                        onChange={(e) => {
                            const selectedItem = filteredItems.find((item) => item.itemId === Number(e.target.value));
                            console.log(selectedItem);
                            if (selectedItem) {
                                setCurrentSelectedItem(selectedItem);
                            }
                            setFormData((prev) => ({
                                ...prev,
                                itemId: parseInt(e.target.value, 10),
                                itemName: selectedItem ? selectedItem.itemName : "",
                            }));
                        }}
                        fullWidth
                        margin="dense"
                    >
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <MenuItem key={item.itemId} value={item.itemId}>
                                    {item.itemName}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No items available for this GRN</MenuItem>
                        )}
                    </TextField>
                    <TextField label="SKU" name="sku" value={formData.sku} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleChange} fullWidth margin="normal" />
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
                    {/* <TextField label="Opening Quantity" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="openingQuantity" value={formData.openingQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Current Quantity" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="currentQuantity" value={formData.currentQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Inward Quantity" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="inwardQuantity" value={formData.inwardQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Outward Quantity" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="outwardQuantity" value={formData.outwardQuantity} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Committed Quantity" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="committedQuantity" value={formData.committedQuantity} onChange={handleChange} fullWidth margin="normal" /> */}
                    {/* <TextField label="Available Quantity" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="availableQuantity" value={formData.availableQuantity} onChange={handleChange} fullWidth margin="normal" /> */}
                    {/* <TextField label="Damaged Quantity" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="damagedQuantity" value={formData.damagedQuantity} onChange={handleChange} fullWidth margin="normal" /> */}
                    <Typography variant="h6" sx={{ marginTop: "16px" }}>Provided Qunatity: {currentSelectedItem?.receivedQty}</Typography>
                    <Typography variant="h6" sx={{ marginTop: "16px" }}>Supplier Price: {currentSelectedItem?.unitPrice}</Typography>
                    <Typography variant="h6" sx={{ marginTop: "16px" }}>FOB Amount: {(currentSelectedItem?.receivedQty ?? 0) * (currentSelectedItem?.unitPrice ?? 0)}</Typography>
                    <TextField
                        label="Allocation (%)"
                        type="number"
                        inputMode="numeric"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()} // Prevent scroll from changing the value
                        value={allocation === 0 ? "" : allocation} // Avoid appending to existing zero
                        onChange={(e) => {
                            const value = e.target.value;
                            setAllocation(value === "" ? 0 : Math.max(0, Number(value)));
                        }}
                        fullWidth
                        margin="dense"
                    />
                    <Typography variant="h6" sx={{ marginTop: "16px" }}>C & H charges: {(currentSelectedItem?.receivedQty ?? 0) * (currentSelectedItem?.unitPrice ?? 0) * 0.1}</Typography>
                    <TextField
                        label="Freight"
                        type="number"
                        inputMode="numeric"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()} // Prevent scroll from changing the value
                        value={freight === 0 ? "" : freight} // Avoid appending to existing zero
                        onChange={(e) => {
                            const value = e.target.value;
                            setFreight(value === "" ? 0 : Math.max(0, Number(value)));
                        }}
                        fullWidth
                        margin="dense"
                    />
                    <Typography variant="h6" sx={{ marginTop: "16px" }}>Cost before duty: {(currentSelectedItem?.receivedQty ?? 0) * (currentSelectedItem?.unitPrice ?? 0) + freight}</Typography>
                    <TextField
                        label="Duty Charges"
                        type="number"
                        inputMode="numeric"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()} // Prevent scroll from changing the value
                        value={dutyCharges === 0 ? "" : dutyCharges} // Avoid appending to existing zero
                        onChange={(e) => {
                            const value = e.target.value;
                            setDutyCharges(value === "" ? 0 : Math.max(0, Number(value)));
                        }}
                        fullWidth
                        margin="dense"
                    />
                    <Typography variant="h6" sx={{ marginTop: "16px" }}>Cost before profit margin: {(currentSelectedItem?.receivedQty ?? 0) * (currentSelectedItem?.unitPrice ?? 0) + freight + dutyCharges}</Typography>
                    <Typography variant="h6" sx={{ marginTop: "16px" }}>Cost of an unit: {(((currentSelectedItem?.receivedQty ?? 0) * (currentSelectedItem?.unitPrice ?? 0) + freight + dutyCharges) / (currentSelectedItem?.receivedQty ? currentSelectedItem?.receivedQty : 1)).toFixed(2)}</Typography>
                    <TextField label="Selling Price" type="number" inputMode="numeric" onWheel={(e) => (e.target as HTMLInputElement).blur()} name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} fullWidth margin="normal" />
                    <TextField
                        label="Reorder Level"
                        type="number"
                        inputMode="numeric"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()} // Prevent scroll from changing the value
                        value={formData.reorderLevel === 0 ? "" : formData.reorderLevel} // Avoid appending to existing zero
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => ({
                                ...prev,
                                reorderLevel: value === "" ? 0 : Math.max(0, Number(value)), // Update state correctly
                            }));
                        }}
                        fullWidth
                        margin="dense"
                    />
                    {/* <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                        Total Value: {(Number(formData.availableQuantity) * Number(formData.unitCost)).toFixed(2)}
                    </Typography> */}
                    {/* <TextField
                        select
                        label="Warehouse"
                        value={formData.warehouseId}
                        onChange={(e) => {
                            const selectedWarehouse = warehouses.find(
                                (warehouse) => warehouse.id === Number(e.target.value)
                            );

                            setFormData((prev: typeof formData) => ({
                                ...prev,
                                warehouseId: parseInt(e.target.value, 10),
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
                    </TextField> */}
                    <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                        Warehouse Name: {formData?.warehouseName}
                    </Typography>
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
