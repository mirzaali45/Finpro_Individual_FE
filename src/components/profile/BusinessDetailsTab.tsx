// src/components/profile/BusinessDetailsTab.tsx
"use client";

import { useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Upload } from "lucide-react";
import { UpdateProfileFormData } from "@/types";

interface BusinessDetailsTabProps {
  formData: UpdateProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<UpdateProfileFormData>>;
  logoPreview: string | null;
  setLogoPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function BusinessDetailsTab({
  formData,
  setFormData,
  logoPreview,
  setLogoPreview,
}: BusinessDetailsTabProps) {
  // Ref for file input
  const logoFileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file uploads
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;

        setFormData({
          ...formData,
          logo: base64String,
        });
        setLogoPreview(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden relative group">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt={formData.companyName || "Company logo"}
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            ) : (
              <Building className="h-12 w-12 text-gray-400" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload
                className="h-8 w-8 text-white cursor-pointer"
                onClick={() => logoFileRef.current?.click()}
              />
            </div>
          </div>
        </div>
        <div className="flex-grow max-w-sm">
          <input
            type="file"
            ref={logoFileRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => logoFileRef.current?.click()}
            className="w-full"
          >
            Upload Company Logo
          </Button>
          <p className="mt-1 text-xs text-gray-500">
            Upload your company logo (max 2MB)
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700"
        >
          Company Name
        </label>
        <Input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State / Province
          </label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code
          </label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700"
        >
          Website
        </label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <label
          htmlFor="taxNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Tax/VAT Number
        </label>
        <Input
          id="taxNumber"
          name="taxNumber"
          value={formData.taxNumber}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
    </div>
  );
}
