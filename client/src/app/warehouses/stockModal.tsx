"use client";
import { useState } from "react";
import { useUpdateWarehouseStockMutation } from "@/state/api";

const StockModal = ({ warehouseId, onClose }: { warehouseId: number; onClose: () => void }) => {
    const [itemId, setItemId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [updateStock] = useUpdateWarehouseStockMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateStock({ warehouseId, itemId, quantity: parseInt(quantity, 10) });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Update Warehouse Stock</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="itemId"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        placeholder="Item ID"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        inputMode="numeric" 
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        name="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)).toString())}
                        placeholder="Quantity (+ to add, - to remove)"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update Stock</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockModal;
