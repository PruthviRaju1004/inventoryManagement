"use client";

import { useRef, useState } from "react";
import { useGetPurchaseOrderByIdQuery, useSendEmailMutation, useSendWhatsAppTextMutation } from "../../../state/api";
import { Typography, Box, TextField, Backdrop, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "next/navigation";

const PurchaseOrderDetail = () => {
    const { id } = useParams();
    const { data: purchaseOrder, isLoading } = useGetPurchaseOrderByIdQuery(Number(id));
    const [sendEmail] = useSendEmailMutation();
    const [sendWhatsAppText] = useSendWhatsAppTextMutation();
    const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
    const [email, setEmail] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);
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
        setIsSendingEmail(true);

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
                    subject: `PurchaseOrder #${purchaseOrder.orderNumber}`,
                    text: `Dear Supplier,\n\nPlease find your purchase order attached for Order #${purchaseOrder.orderNumber}.\n\nThank you for your business!\n\nBest regards,\nYour Company Name`,
                    pdfBase64,
                    fileName: `Purchase_Order_${purchaseOrder.orderNumber}.pdf`,
                }).unwrap();
                alert(response.message);
            } catch (error) {
                console.error("Error sending email:", error);
                alert("Failed to send email.");
            } finally {
                setIsSendingEmail(false); // Hide spinner
                setEmail("");
            }
        });
    };

    const handleSendWhatsApp = async () => {
        setIsSendingWhatsApp(true);
    
        const message = `*Purchase Order #${purchaseOrder.orderNumber}*\n\n` +
            `*Supplier:* ${purchaseOrder.supplier.name}\n` +
            `*Email:* ${purchaseOrder.supplier.contactEmail}\n` +
            `*Contact Person:* ${purchaseOrder.supplier.contactName}\n` +
            `*Date:* ${new Date(purchaseOrder.orderDate).toDateString()}\n` +
            `*Expected Delivery:* ${purchaseOrder.expectedDate ? new Date(purchaseOrder.expectedDate).toDateString() : "N/A"}\n\n` +
            `*Items Ordered:*\n` +
            "---------------------------------------------\n" +
            `| *#*  | *Item*        | *Qty* | *Rate*  | *Total* |\n` +
            "---------------------------------------------\n" +
            purchaseOrder.purchaseOrderItems.map((item, index) => 
                `| ${index + 1} | ${item.itemName} | ${item.quantity} | $${Number(item.unitPrice).toFixed(2)} | $${Number(item.totalPrice).toFixed(2)} |`
            ).join("\n") +
            "\n---------------------------------------------\n" +
            `*Total Amount:* $${Number(purchaseOrder.totalAmount).toFixed(2)}`;
    
        // Send to Backend to send via WhatsApp
        try {
            const response = await sendWhatsAppText({
                phoneNumber: "15145503765", // Replace with actual phone number
                message,
            }).unwrap();
            alert(response.message);
        } catch (error) {
            console.error("Error sending WhatsApp message:", error);
            alert("Failed to send WhatsApp message.");
        } finally {
            setIsSendingWhatsApp(false);
        }
    };
    

    return (
        <Box sx={{ p: 4, maxWidth: "900px", margin: "auto", background: "#fff", borderRadius: "10px", width: "100%" }}>
            <Box ref={pdfRef} sx={{ p: 4, background: "#fff" }}>
                <Box sx={{ alignItems: "center" }}>
                    <Box textAlign="right">
                        <Typography variant="h4" fontWeight="bold">PURCHASE ORDER</Typography>
                        <Typography># {purchaseOrder.orderNumber}</Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Supplier Details</Typography>
                    <Typography color="primary"><strong>Supplier Name:</strong>{purchaseOrder.supplier.name}</Typography>
                    <br />
                    <Typography><strong>Supplier Address:</strong></Typography>
                    <Typography>{purchaseOrder.supplier.address}</Typography>
                    <Typography>{purchaseOrder.supplier.city}, {purchaseOrder.supplier.state}, {purchaseOrder.supplier.country} - {purchaseOrder.supplier.zipCode}</Typography>
                    <br />
                    <Typography><strong>Supplier Phone:</strong>{purchaseOrder.supplier.contactPhone}</Typography>
                    <Typography><strong>Supplier Email:</strong>{purchaseOrder.supplier.contactEmail}</Typography>
                    <Typography><strong>Supplier Contact Name:</strong>{purchaseOrder.supplier.contactName}</Typography>
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
                            <Typography sx={{ flex: 4 }}>{item.itemName}</Typography>
                            <Typography sx={{ flex: 2 }}>{item.quantity}</Typography>
                            <Typography sx={{ flex: 2 }}>{Number(item.unitPrice).toFixed(2)}</Typography>
                            <Typography sx={{ flex: 2 }}>{Number(item.totalPrice).toFixed(2)}</Typography>
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
            <Box sx={{ mt: 4, p: 2, border: 1, borderColor: "grey", borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Send Purchase Order To:
                </Typography>
                <TextField
                    fullWidth
                    label="Recipient Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Box>

            {/* Buttons */}
            <div className="mt-4 flex justify-between gap-4">
                <button className="mt-4 bg-[#333] text-[#fff] font-medium 
                        font-sans text-base text-center px-4 h-12 rounded-sm float-right" onClick={generatePDF}>
                    Download PDF
                </button>
                <button
                    className="mt-4 bg-[#333] text-[#fff] font-medium 
                        font-sans text-base text-center px-4 h-12 rounded-sm float-right"
                    onClick={handleSendEmail}>
                    Send Email
                </button>
                <button
                    className="mt-4 bg-primary_btn_color text-[#fff] font-medium 
                        font-sans text-base text-center px-4 h-12 rounded-sm float-right"
                    onClick={handleSendWhatsApp}>
                    Send via WhatsApp
                </button>
            </div>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSendingEmail || isSendingWhatsApp}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default PurchaseOrderDetail;
