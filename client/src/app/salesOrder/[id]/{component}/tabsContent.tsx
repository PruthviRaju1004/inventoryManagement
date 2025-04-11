"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useGetSalesOrderByIdQuery, useGetCustomerByIdQuery, useGetWarehouseByIdQuery, useSendEmailMutation, useGetWarehouseProductsQuery } from "../../../../state/api";
import { Typography, Box, TextField, Backdrop, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SalesDocument = ({ documentType, salesId }: { documentType: any; salesId: string | string[] | undefined }) => {
    const { data: salesOrder, isLoading } = useGetSalesOrderByIdQuery(Number(salesId));
    const customerId = salesOrder?.customerId ?? -1;
    const warehouseId = salesOrder?.warehouseId ?? -1;

    const { data: customer, isLoading: isCustomerLoading } = useGetCustomerByIdQuery(customerId, {
        skip: customerId === -1,
    });

    const { data: warehouse, isLoading: isWarehouseLoading } = useGetWarehouseByIdQuery(warehouseId, {
        skip: warehouseId === -1,
    });

    const { data: warehouseStock, isLoading: isStockLoading } = useGetWarehouseProductsQuery(warehouseId, {
        skip: warehouseId === -1,
    });

    const [sendEmail] = useSendEmailMutation();
    const [email, setEmail] = useState("");
    const [subTotal, setSubTotal] = useState(0);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (salesOrder) {
            if (salesOrder.salesOrderItems?.length) {
                const totalValue = salesOrder.salesOrderItems.reduce((acc, item) => acc + Number(item.totalPrice), 0);
                setSubTotal(totalValue || 0);
            }
        }
    }, [salesOrder]);

    const salesItemsWithBinLocations = useMemo(() => {
        if (!salesOrder?.salesOrderItems || !warehouseStock?.length) return [];

        return salesOrder.salesOrderItems.map((salesItem) => {
            const matchingStockItem = warehouseStock.find((stockItem: { itemId: number; binLocation?: string }) => stockItem.itemId === salesItem.itemId);
            return {
                ...salesItem,
                binLocation: matchingStockItem?.binLocation || "N/A", // Default to "N/A" if not found
            };
        });
    }, [salesOrder, warehouseStock]);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!salesOrder || !salesOrder.salesOrderItems?.length) {
        return <Typography>No sales order data available.</Typography>;
    }

    const generatePDF = () => {
        if (!pdfRef.current) return;
        html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`${documentType}_${salesOrder.orderNumber}.pdf`);
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
            const pdfBase64 = pdf.output("datauristring").split(",")[1];

            try {
                const response = await sendEmail({
                    email,
                    subject: `${documentType} #${salesOrder.orderNumber}`,
                    text: `Dear Customer,\n\nPlease find your ${documentType} attached for Order #${salesOrder.orderNumber}.\n\nThank you for your business!\n\nBest regards,\nYour Company Name`,
                    pdfBase64,
                    fileName: `${documentType}_${salesOrder.orderNumber}.pdf`,
                }).unwrap();
                alert(response.message);
            } catch (error) {
                // console.error("Error sending email:", error);
                alert("Failed to send email.");
            } finally {
                setIsSendingEmail(false); // Hide spinner
                setEmail("");
            }
        });
    };

    const renderItemDetails = (item: { id: number; itemName: string; quantity: number; unitPrice?: number; totalPrice?: number; binLocation?: string }, index: number) => {
        if (documentType === "Pick Ticket") {
            return (
                <>
                    <Typography sx={{ flex: 1 }}>{index + 1}</Typography>
                    <Typography sx={{ flex: 4 }}>{item.itemName}</Typography>
                    <Typography sx={{ flex: 2 }}>{item.quantity}</Typography>
                    <Typography sx={{ flex: 2 }}>{item.binLocation}</Typography>
                </>
            );
        }

        if (documentType === "Delivery Note") {
            return (
                <>
                    <Typography sx={{ flex: 1 }}>{index + 1}</Typography>
                    <Typography sx={{ flex: 4 }}>{item.itemName}</Typography>
                    <Typography sx={{ flex: 2 }}>{item.quantity}</Typography>
                </>
            );
        }

        // Default for Invoice
        return (
            <>
                <Typography sx={{ flex: 1 }}>{index + 1}</Typography>
                <Typography sx={{ flex: 4 }}>{item.itemName}</Typography>
                <Typography sx={{ flex: 2 }}>{item.quantity}</Typography>
                <Typography sx={{ flex: 2 }}>${Number(item.unitPrice).toFixed(2)}</Typography>
                <Typography sx={{ flex: 2 }}>${Number(item.totalPrice).toFixed(2)}</Typography>
            </>
        );
    };

    return (
        <Box sx={{ p: 4, maxWidth: "900px", margin: "auto", background: "#fff", borderRadius: "10px", width: "100%" }}>
            <Box ref={pdfRef} sx={{ p: 4, background: "#fff" }}>
                <Box sx={{ alignItems: "center" }}>
                    {/* <Box>
                        <Typography variant="h6" fontWeight="bold">Your Company</Typography>
                        <Typography>Ontario, Canada</Typography>
                    </Box> */}
                    <Box textAlign="right">
                        <Typography variant="h4" fontWeight="bold">{documentType.toUpperCase()}</Typography>
                        <Typography># {salesOrder.orderNumber}</Typography>
                        <Typography><strong>SO Status:</strong> {salesOrder.status}</Typography>
                        <Typography><strong>Payment Status:</strong> {salesOrder.paymentStatus}</Typography>
                    </Box>
                </Box>

                {/* Warehouse Details */}
                <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Warehouse</Typography>
                    {isWarehouseLoading ? (
                        <Typography>Loading warehouse details...</Typography>
                    ) : warehouse ? (
                        <>
                            <Typography><strong>Warehouse Name:</strong>{warehouse.name}</Typography>
                            <Typography><strong>Warehouse Address:</strong>{warehouse.address}</Typography>
                        </>
                    ) : (
                        <Typography>No warehouse details found.</Typography>
                    )}
                </Box>

                {/* Bill To Section */}
                <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Bill To</Typography>
                    {isCustomerLoading ? (
                        <Typography>Loading customer details...</Typography>
                    ) : customer ? (
                        <>
                            <Typography><strong>Customer Name:</strong>{customer.name}</Typography>
                            <br />
                            <Typography><strong>Customer Address:</strong></Typography>
                            <Typography>{customer.address2 ? customer.address2 : customer.address}</Typography>
                            <Typography>{customer.address}</Typography>
                            <Typography>{customer.state}{","}{customer.country}{","}{customer.zipCode}</Typography>
                            <br />
                            <Typography><strong>Customer Email:</strong>{customer.contactEmail}</Typography>
                            <Typography><strong>Customer Phone:</strong>{customer.contactPhone}</Typography>
                        </>
                    ) : (
                        <Typography>No customer details found.</Typography>
                    )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Typography><strong>Invoice Date:</strong> {new Date(salesOrder.orderDate).toDateString()}</Typography>
                    <Typography><strong>Due Date:</strong> {salesOrder.expectedDate ? new Date(salesOrder.expectedDate).toDateString() : "N/A"}</Typography>
                </Box>

                {/* Items Table */}
                <Box sx={{ mt: 3, border: "1px solid black", borderRadius: "8px", overflow: "hidden" }}>
                    <Box sx={{ display: "flex", background: "#333", color: "#fff", p: 1 }}>
                        <Typography sx={{ flex: 1 }}>#</Typography>
                        <Typography sx={{ flex: 4 }}>Item</Typography>
                        <Typography sx={{ flex: 2 }}>Qty</Typography>
                        {(documentType !== "Delivery Note" && documentType !== "Pick Ticket") && (
                            <Typography sx={{ flex: 2 }}>Unit Price</Typography>
                        )}
                        {(documentType !== "Delivery Note" && documentType !== "Pick Ticket") && (
                            <Typography sx={{ flex: 2 }}>Line Total</Typography>
                        )}

                        {documentType === "Pick Ticket" && <Typography sx={{ flex: 2 }}>Bin Location</Typography>}
                    </Box>
                    {salesItemsWithBinLocations
                        .filter(item => item.quantity > 0)
                        .map((item, index) => (
                            <Box key={item.id} sx={{ display: "flex", p: 1, borderBottom: "1px solid #ddd" }}>
                                {renderItemDetails(item, index)}
                            </Box>
                        ))}
                </Box>

                {documentType === "Invoice" && (
                    <Box sx={{ mt: 3, textAlign: "right" }}>
                        <Typography><strong>Subtotal:</strong> {Number(subTotal).toFixed(2)}</Typography>
                        <Typography><strong>Discount:</strong> {Number(salesOrder.discount).toFixed(2)}%</Typography>
                        <Typography><strong>Tax:</strong> {Number(salesOrder.tax).toFixed(2)}%</Typography>
                        <Typography><strong>Total Amount:</strong> ${Number(salesOrder.totalAmount).toFixed(2)}</Typography>
                    </Box>
                )}
            </Box>

            {/* Send Email Section */}
            <Box sx={{ mt: 4, p: 2, border: 1, borderColor: "grey", borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Send {documentType} To:
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
                <button className="mt-4 bg-[#333] text-[#fff] font-medium font-sans text-base text-center px-4 h-12 rounded-sm" onClick={generatePDF}>
                    Download PDF
                </button>
                <button
                    className="mt-4 bg-[#333] text-[#fff] font-medium font-sans text-base text-center px-4 h-12 rounded-sm"
                    onClick={handleSendEmail}>
                    Send Email
                </button>
            </div>

            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSendingEmail}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default SalesDocument;
