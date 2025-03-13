import { useState, useEffect } from "react";
import { useGetOrganizationsQuery } from "../../state/api";

const useOrganizations = () => {
    const { data: organizations, isLoading } = useGetOrganizationsQuery();
    const [selectedOrg, setSelectedOrg] = useState<number | null>(null);

    useEffect(() => {
        if ((organizations?.length ?? 0) > 0 && selectedOrg === null) {
            setSelectedOrg(organizations?.[0]?.id ?? null);
        }
    }, [organizations]);

    return { organizations, selectedOrg, setSelectedOrg, isLoading };
};

export default useOrganizations;
