// src/components/products/ProductImageUpload.tsx
import React from "react";
import { Upload, X } from "lucide-react";
import CloudinaryImage from "@/components/cloudinaryImage";
import { Label } from "@/components/ui/label";

interface ProductImageUploadProps {
  selectedImage: File | null;
  previewUrl: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  validationError?: string;
}

export default function ProductImageUpload({
  selectedImage,
  previewUrl,
  handleImageChange,
  handleRemoveImage,
  validationError,
}: ProductImageUploadProps) {
  return (
    <div>
      <Label htmlFor="image" className="text-base">
        Product Image
      </Label>

      {/* Image Preview */}
      {previewUrl && (
        <div className="mt-2 mb-4 relative w-40 h-40 border rounded-md overflow-hidden">
          <CloudinaryImage
            src={previewUrl}
            alt="Product preview"
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Image Upload */}
      {!previewUrl && (
        <div
          className={`mt-1 border-2 border-dashed rounded-md p-6 ${
            validationError ? "border-red-500" : "border-gray-300"
          }`}
        >
          <div className="flex justify-center">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Upload a file</span>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB</p>
            </div>
          </div>
        </div>
      )}

      {validationError && (
        <p className="mt-1 text-sm text-red-600">{validationError}</p>
      )}
    </div>
  );
}
