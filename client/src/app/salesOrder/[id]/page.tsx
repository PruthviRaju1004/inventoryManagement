"use client";

import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useParams } from "next/navigation";
import SalesDocument from "./{component}/tabsContent";

const SalesDocumentTabs = () => {
    const { id } = useParams();
    const [tabIndex, setTabIndex] = useState(0);

    const documentTypes = ["Invoice", "Pick Ticket", "Delivery Note"];

    return (
        <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto", mt: 4, border: "1px solid #ddd", borderRadius: "8px", p: 2 }}>
            <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
                {documentTypes.map((type, index) => (
                    <Tab key={index} label={type} />
                ))}
            </Tabs>

            <Box sx={{ mt: 3 }}>
                <SalesDocument documentType={documentTypes[tabIndex]} salesId={id} />
            </Box>
        </Box>
    );
};

export default SalesDocumentTabs;
