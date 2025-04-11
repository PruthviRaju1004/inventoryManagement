import React from "react";
import { TextField } from "@mui/material";

interface AddressFieldsProps {
  address: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ address, address2, city, state, country, zipCode, onChange }) => {
  return (
    <div className="space-y-2">
      <TextField name="address2" label="Address-H.No/F.No (Optional)" value={address2} onChange={onChange} fullWidth />
      <TextField name="address" label="Address" value={address} onChange={onChange} fullWidth required />
      <TextField name="city" label="City" value={city} onChange={onChange} fullWidth required />
      <TextField name="state" label="State" value={state} onChange={onChange} fullWidth required />
      <TextField name="country" label="Country" value={country} onChange={onChange} fullWidth required />
      <TextField name="zipCode" label="Zip Code" value={zipCode} onChange={onChange} fullWidth required />
    </div>
  );
};

export default AddressFields;
