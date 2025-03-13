"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Tab, Tabs, Box } from "@mui/material";
import SupplierItems from "../[id]/{components}/supplierItems";
import SupplierSites from "../[id]/{components}/supplierSites";
import { useSearchParams } from "next/navigation";

const SupplierDetails = () => {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const organizationId = searchParams.get("organizationId");
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Box className="p-4">
            <h2 className="text-2xl font-bold mb-4">Supplier Details - ID: {id}</h2>

            <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)}>
                <Tab label="Items" />
                <Tab label="Sites" />
            </Tabs>

            {tabIndex === 0 && id && <SupplierItems supplierId={id as string} organizationId={organizationId}/>}
            {tabIndex === 1 && id && <SupplierSites supplierId={id as string} />}
        </Box>
    );
};

export default SupplierDetails;
