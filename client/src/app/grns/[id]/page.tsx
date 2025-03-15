"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import { useGetGRNByIdQuery } from "../../../state/api"; // API Hook for fetching GRN details
import { Box, Typography } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const GRNDetail = () => {
    const { id } = useParams();
    const { data: grn, isLoading } = useGetGRNByIdQuery(Number(id)); 
    const pdfRef = useRef<HTMLDivElement>(null);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!grn) {
        return <Typography>No GRN data available.</Typography>;
    }

    const generatePDF = () => {
        if (!pdfRef.current) return;

        html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210; // A4 width
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`GRN_${grn.grnNumber}.pdf`);
        });
    };

    return (
        <Box sx={{ p: 4, maxWidth: "900px", margin: "auto", background: "#fff", borderRadius: "10px", width: "100%" }}>
            <Box ref={pdfRef} sx={{ p: 4, background: "#fff" }}>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Own Org</Typography>
                        <Typography>Ontario, Canada</Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="h4" fontWeight="bold">GOODS RECEIPT NOTE</Typography>
                        <Typography># {grn.grnNumber}</Typography>
                    </Box>
                </Box>

                {/* Supplier & Warehouse Details */}
                <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Supplier</Typography>
                    <Typography color="primary"><strong>Supplier Id:</strong>{grn.supplierId}</Typography>
                    <Typography><strong>Supplier Name:</strong>{grn.supplierName}</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Warehouse</Typography>
                    <Typography color="primary"><strong>Warehouse Id:</strong>{grn.warehouseId}</Typography>
                    <Typography><strong>Warehouse Name:</strong>{grn.warehouseName}</Typography>
                </Box>

                {/* GRN Details */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Typography><strong>GRN Date:</strong> {new Date(grn.grnDate).toDateString()}</Typography>
                    <Typography><strong>Status:</strong> {grn.status}</Typography>
                </Box>

                {/* Line Items Table */}
                <Box sx={{ mt: 3, border: "1px solid black", borderRadius: "8px", overflow: "hidden" }}>
                    <Box sx={{ display: "flex", background: "#333", color: "#fff", p: 1 }}>
                        <Typography sx={{ flex: 1 }}>#</Typography>
                        <Typography sx={{ flex: 4 }}>Item Name</Typography>
                        <Typography sx={{ flex: 2 }}>Ordered Qty</Typography>
                        <Typography sx={{ flex: 2 }}>Received Qty</Typography>
                        <Typography sx={{ flex: 2 }}>Unit Price</Typography>
                        <Typography sx={{ flex: 2 }}>Line Total</Typography>
                    </Box>
                    {grn.grnLineItems.map((item, index) => (
                        <Box key={item.id ?? `item-${index}`} sx={{ display: "flex", p: 1, borderBottom: "1px solid #ddd" }}>
                            <Typography sx={{ flex: 1 }}>{index + 1}</Typography>
                            <Typography sx={{ flex: 4 }}>{item.itemName}</Typography>
                            <Typography sx={{ flex: 2 }}>{item.orderedQty}</Typography>
                            <Typography sx={{ flex: 2 }}>{item.receivedQty}</Typography>
                            <Typography sx={{ flex: 2 }}>{item.unitPrice}</Typography>
                            <Typography sx={{ flex: 2 }}>{item.lineTotal}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Total & Remarks */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Typography><strong>Remarks:</strong> {grn.remarks}</Typography>
                    <Typography><strong>Total Amount:</strong> ${grn.totalAmount}</Typography>
                </Box>
            </Box>

            {/* Download PDF Button */}
            <button className="mt-4 bg-primary_btn_color text-[#fff] font-medium font-sans text-base text-center px-4 h-12 rounded-sm float-right" onClick={generatePDF}>
                Download PDF
            </button>
        </Box>
    );
};

export default GRNDetail;
