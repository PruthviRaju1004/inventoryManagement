  "use client";
  import React, { useState, useEffect } from "react";
  import { useCreateWarehouseMutation, useUpdateWarehouseMutation, Warehouse } from "@/state/api";
  import { TextField } from "@mui/material";

  const WarehousesModal = ({ warehouse, organizationId, onClose }: { warehouse: Warehouse | null; organizationId: number | null; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: "",
      code: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      latitude: "",
      longitude: "",
      sqFoot: "",
      noOfDocks: "",
      lotSize: "",
      shelvesRacks: ""
    });

    const [createWarehouse] = useCreateWarehouseMutation();
    const [updateWarehouse] = useUpdateWarehouseMutation();

    useEffect(() => {
      if (warehouse) {
        setFormData({
          name: warehouse.name || "",
          code: warehouse.code || "",
          contactEmail: warehouse.contactEmail || "",
          contactPhone: warehouse.contactPhone || "",
          address: warehouse.address || "",
          latitude: warehouse.latitude?.toString() || "",
          longitude: warehouse.longitude?.toString() || "",
          sqFoot: warehouse.sqFoot?.toString() || "",
          noOfDocks: warehouse.noOfDocks?.toString() || "",
          lotSize: warehouse.lotSize?.toString() || "",
          shelvesRacks: warehouse.shelvesRacks?.toString() || ""
        });
      } else {
        setFormData({
          name: "",
          code: "",
          contactEmail: "",
          contactPhone: "",
          address: "",
          latitude: "",
          longitude: "",
          sqFoot: "",
          noOfDocks: "",
          lotSize: "",
          shelvesRacks: ""
        });
      }
    }, [warehouse]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const apiData = {
        ...formData,
        organizationId: organizationId ?? warehouse?.organizationId ?? 0, // Preserve warehouse's org ID if no new selection
        latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
        sqFoot: formData.sqFoot ? parseInt(formData.sqFoot, 10) : 0,
        noOfDocks: formData.noOfDocks ? parseInt(formData.noOfDocks, 10) : 0,
        lotSize: formData.lotSize ? parseInt(formData.lotSize, 10) : 0,
        shelvesRacks: formData.shelvesRacks ? parseInt(formData.shelvesRacks, 10) : 0,
      };
      // console.log(apiData)

      if (warehouse?.id) {
        await updateWarehouse({ id: warehouse.id, data: apiData });
      } else {
        await createWarehouse({
          ...apiData,
          organizationId: organizationId ?? warehouse?.organizationId ?? 0, // Ensure organizationId is always a number
          isActive: true,
        });
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-h-[80vh] overflow-y-auto border-black-200">
          <h2 className="text-xl font-semibold mb-4">{warehouse ? "Edit Warehouse" : "Create Warehouse"}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {["name", "code", "contactEmail", "contactPhone", "address", "latitude", "longitude", "sqFoot", "noOfDocks", "lotSize", "shelvesRacks"].map((field) => (
              <TextField
                key={field}
                type={field.includes("Email") ? "email" : field.match(/latitude|longitude|sqFoot|noOfDocks|lotSize|shelvesRacks/) ? "number" : "text"}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1").trim()} // Format placeholder
                className="w-full p-2 border rounded"
                required
              />
            ))}
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={onClose} className="mt-4 btn-cancel">Cancel</button>
              <button type="submit" className="mt-4 btn-primary">{warehouse ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default WarehousesModal;
