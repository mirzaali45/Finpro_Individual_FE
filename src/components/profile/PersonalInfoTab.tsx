// src/components/profile/PersonalInfoTab.tsx
"use client";

import { useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { UpdateProfileFormData } from "@/types";

interface PersonalInfoTabProps {
  formData: UpdateProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<UpdateProfileFormData>>;
  avatarPreview: string | null;
  setAvatarPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function PersonalInfoTab({
  formData,
  setFormData,
  avatarPreview,
  setAvatarPreview,
}: PersonalInfoTabProps) {
  // Ref for file input
  const avatarFileRef = useRef<HTMLInputElement>(null);

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
          avatar: base64String,
        });
        setAvatarPreview(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative group">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt={formData.username || "User avatar"}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-gray-400" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload
                className="h-8 w-8 text-white cursor-pointer"
                onClick={() => avatarFileRef.current?.click()}
              />
            </div>
          </div>
        </div>
        <div className="flex-grow max-w-sm">
          <input
            type="file"
            ref={avatarFileRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => avatarFileRef.current?.click()}
            className="w-full"
          >
            Upload Profile Picture
          </Button>
          <p className="mt-1 text-xs text-gray-500">
            Upload your profile picture (max 2MB)
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
    </div>
  );
}
