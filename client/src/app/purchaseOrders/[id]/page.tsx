"use client";

import { useRef, useState } from "react";
import { useGetPurchaseOrderByIdQuery, useSendEmailMutation } from "../../../state/api";
import { Typography, Box, TextField } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "next/navigation";

const PurchaseOrderDetail = () => {
    const { id } = useParams();
    const { data: purchaseOrder, isLoading } = useGetPurchaseOrderByIdQuery(Number(id));
    const [sendEmail, { isLoading: isSending }] = useSendEmailMutation();
    const [email, setEmail] = useState("");
    const pdfRef = useRef<HTMLDivElement>(null);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!purchaseOrder || !purchaseOrder.purchaseOrderItems?.length) {
        return <Typography>No purchase order data available.</Typography>;
    }

    const generatePDF = () => {
        if (!pdfRef.current) return;

        html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210; // A4 width
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Purchase_Order_${purchaseOrder.orderNumber}.pdf`);
        });
    };

    const handleSendEmail = async () => {
        if (!pdfRef.current) return;
        html2canvas(pdfRef.current, { scale: 2 }).then(async (canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            // Convert PDF to Base64
            const pdfBase64 = pdf.output("datauristring").split(",")[1]; // Remove prefix
            // Send to Backend
            try {
                const response = await sendEmail({
                    email,
                    pdfBase64,
                    fileName: `Purchase_Order_${purchaseOrder.orderNumber}.pdf`,
                }).unwrap();
                alert(response.message);
            } catch (error) {
                console.error("Error sending email:", error);
                alert("Failed to send email.");
            }
        });
    };

    return (
        <Box sx={{ p: 4, maxWidth: "900px", margin: "auto", background: "#fff", borderRadius: "10px", width: "100%" }}>
            <Box ref={pdfRef} sx={{ p: 4, background: "#fff" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Own org</Typography>
                        <Typography>Ontario, Canada</Typography>
                        <Typography>{purchaseOrder.supplier.contactEmail}</Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="h4" fontWeight="bold">PURCHASE ORDER</Typography>
                        <Typography># {purchaseOrder.orderNumber}</Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Vendor Address</Typography>
                    <Typography color="primary">{purchaseOrder.supplier.name}</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Deliver To</Typography>
                    <Typography>{purchaseOrder.supplier.contactName}</Typography>
                    <Typography>Ontario, Canada</Typography>
                    <Typography>{purchaseOrder.supplier.contactEmail}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Typography><strong>Date:</strong> {new Date(purchaseOrder.orderDate).toDateString()}</Typography>
                    <Typography><strong>Expected Delivery Date:</strong> {purchaseOrder.expectedDate ? new Date(purchaseOrder.expectedDate).toDateString() : "N/A"}</Typography>
                </Box>

                <Box sx={{ mt: 3, border: "1px solid black", borderRadius: "8px", overflow: "hidden" }}>
                    <Box sx={{ display: "flex", background: "#333", color: "#fff", p: 1 }}>
                        <Typography sx={{ flex: 1 }}>#</Typography>
                        <Typography sx={{ flex: 4 }}>Item & Description</Typography>
                        <Typography sx={{ flex: 2 }}>Qty</Typography>
                        <Typography sx={{ flex: 2 }}>Rate</Typography>
                        <Typography sx={{ flex: 2 }}>Amount</Typography>
                    </Box>
                    {purchaseOrder.purchaseOrderItems.map((item, index) => (
                        <Box key={item.id} sx={{ display: "flex", p: 1, borderBottom: "1px solid #ddd" }}>
                            <Typography sx={{ flex: 1 }}>{index + 1}</Typography>
                            <Typography sx={{ flex: 4 }}>{item.item.name}</Typography>
                            <Typography sx={{ flex: 2 }}>{item.quantity} {item.uom}</Typography>
                            <Typography sx={{ flex: 2 }}>${Number(item.unitPrice).toFixed(2)}</Typography>
                            <Typography sx={{ flex: 2 }}>${Number(item.totalPrice).toFixed(2)}</Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, pr: 2 }}>
                    <Box>
                        <Typography><strong>Sub Total:</strong> ${Number(purchaseOrder.totalAmount).toFixed(2)}</Typography>
                        <Typography variant="h5" fontWeight="bold">Total: ${Number(purchaseOrder.totalAmount).toFixed(2)}</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Email Input */}
            <Box sx={{ mt: 3 }}>
                <TextField
                    fullWidth
                    label="Recipient Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Box>

            {/* Button for PDF Download */}
            <div className="mt-4 flex justify-end gap-4">
                <button className="mt-4 bg-primary_btn_color text-[#fff] font-medium 
                        font-sans text-base text-center px-4 h-12 rounded-sm float-right" onClick={generatePDF}>
                    Download PDF
                </button>
                <button
                    className="mt-4 bg-primary_btn_color text-[#fff] font-medium 
                        font-sans text-base text-center px-4 h-12 rounded-sm float-right"
                    onClick={handleSendEmail}>
                    Send Email
                </button>
            </div>
        </Box>
    );
};

export default PurchaseOrderDetail;
