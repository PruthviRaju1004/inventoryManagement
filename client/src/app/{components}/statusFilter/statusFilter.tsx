import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface StatusFilterProps {
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    statusOptions: string[];
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statusFilter, setStatusFilter, statusOptions }) => {
    return (
        <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{ height: "41px" }}
            >
                {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                        {status}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default StatusFilter;
