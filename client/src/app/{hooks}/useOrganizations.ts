import { useState, useEffect } from "react";
import { useGetOrganizationsQuery, useGetOrganizationByIdQuery } from "../../state/api";

const useOrganizations = () => {
    const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
    const storedOrgId = typeof window !== "undefined" ? localStorage.getItem("userOrg") : null;
    const parsedStoredOrgId = storedOrgId ? Number(storedOrgId) : null;

    // Fetch a single organization if org ID exists in localStorage
    const { data: singleOrg, isLoading: singleOrgLoading } = useGetOrganizationByIdQuery(parsedStoredOrgId!, {
        skip: !parsedStoredOrgId, // Skip query if no stored ID
    });

    // Fetch all organizations if no stored org ID
    const { data: organizations, isLoading: orgsLoading } = useGetOrganizationsQuery(undefined, {
        skip: !!parsedStoredOrgId, // Skip fetching all if we already have a stored org
    });

    useEffect(() => {
        if (parsedStoredOrgId) {
            setSelectedOrg(parsedStoredOrgId);
        } else if ((organizations?.length ?? 0) > 0) {
            setSelectedOrg((prev) => prev ?? organizations?.[0]?.id ?? null);
        }
    }, [organizations, parsedStoredOrgId]); // No need to include selectedOrg

    return {
        organizations,
        selectedOrg,
        setSelectedOrg,
        isLoading: singleOrgLoading || orgsLoading,
        singleOrg,
    };
};

export default useOrganizations;
