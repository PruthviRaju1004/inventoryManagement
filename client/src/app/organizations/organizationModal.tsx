"use client";
import React, { useState, useEffect } from "react";
import {
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
} from "@/state/api";
import { TextField } from "@mui/material";

type Organization = {
  id?: number;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  taxId?: string;
  dunsNumber?: string;
  website?: string;
  socialMedia?: Record<string, string>;
  legalProofs?: string[]; // API expects string URLs
};

const OrganizationModal = ({ organization, onClose }: { organization: any; onClose: () => void }) => {
  const [formData, setFormData] = useState<Omit<Organization, "legalProofs">>({
    name: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    taxId: "",
    dunsNumber: "",
    website: "",
    socialMedia: {},
  });
  const [legalProofFiles, setLegalProofFiles] = useState<FileList | null>(null);
  const [existingLegalProofs, setExistingLegalProofs] = useState<string[]>([])
  const [loading, setLoading] = useState(false);
  const [createOrganization] = useCreateOrganizationMutation();
  const [updateOrganization] = useUpdateOrganizationMutation();

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        contactEmail: organization.contactEmail || "",
        contactPhone: organization.contactPhone || "",
        address: organization.address || "",
        taxId: organization.taxId || "",
        dunsNumber: organization.dunsNumber || "",
        website: organization.website || "",
        socialMedia: organization.socialMedia || {},
      });
      setExistingLegalProofs(organization.legalProofs || []);
    }
  }, [organization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value },
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLegalProofFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "socialMedia") {
          formDataObj.append(key, JSON.stringify(value));
        } else {
          formDataObj.append(key, value as string);
        }
      });

      if (legalProofFiles) {
        Array.from(legalProofFiles).forEach((file) => {
          formDataObj.append("legalProofs", file);
        });
      } else if (existingLegalProofs.length > 0) {
        formDataObj.append("existingLegalProofs", JSON.stringify(existingLegalProofs));
      }

      if (organization?.id) {
        // Update existing organization
        await updateOrganization({ id: organization.id, data: formData }).unwrap();
      } else {
        // Create new organization
        const payload = {
          name: formDataObj.get("name") as string,
          contactEmail: formDataObj.get("contactEmail") as string,
          contactPhone: formDataObj.get("contactPhone") as string,
          address: formDataObj.get("address") as string,
          taxId: formDataObj.get("taxId") as string,
          dunsNumber: formDataObj.get("dunsNumber") as string,
          website: formDataObj.get("website") as string,
          socialMedia: JSON.parse(formDataObj.get("socialMedia") as string),
          legalProofs: legalProofFiles ? Array.from(legalProofFiles) : [],
        };
        await createOrganization(payload).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Error saving organization:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-h-[80vh] overflow-y-auto border-black-200">
        <h2 className="text-xl font-semibold mb-4">{organization ? "Edit Organization" : "Create Organization"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextField type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Organization Name" className="w-full p-2 border rounded" required />
          <TextField type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Contact Email" className="w-full p-2 border rounded" required />
          <TextField type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Contact Phone" className="w-full p-2 border rounded" required />
          <TextField type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" required />
          <TextField type="text" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="Tax ID" fullWidth />
          <TextField type="text" name="dunsNumber" value={formData.dunsNumber} onChange={handleChange} placeholder="DUNS Number" fullWidth />
          <TextField type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Website" fullWidth />
          <TextField type="text" name="twitter" value={formData.socialMedia?.twitter || ""} onChange={handleSocialMediaChange} placeholder="Twitter URL" fullWidth />
          <TextField type="text" name="facebook" value={formData.socialMedia?.facebook || ""} onChange={handleSocialMediaChange} placeholder="Facebook URL" fullWidth />
          <TextField type="text" name="linkedin" value={formData.socialMedia?.linkedin || ""} onChange={handleSocialMediaChange} placeholder="LinkedIn URL" fullWidth />
           {/* Existing legal proofs display */}
          {existingLegalProofs.length > 0 && (
            <div>
              <h3 className="text-sm font-medium">Existing Legal Proofs:</h3>
              <ul className="text-xs text-gray-600">
                {existingLegalProofs.map((proof, index) => (
                  <li key={index}><a href={proof} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Proof {index + 1}</a></li>
                ))}
              </ul>
            </div>
          )}
          <input type="file" multiple onChange={handleFileChange} />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="mt-4 btn-cancel">Cancel</button>
            <button type="submit" className="mt-4 btn-primary">{organization ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationModal;
