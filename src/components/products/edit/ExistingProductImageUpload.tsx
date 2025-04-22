import React from "react";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import CloudinaryImage from "@/components/cloudinaryImage";

interface ExistingProductImageUploadProps {
  selectedImage: File | null;
  existingImage: string | null;
  previewUrl: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  resetImageSelection: () => void;
  validationError?: string;
}

export default function ExistingProductImageUpload({
  selectedImage,
  existingImage,
  previewUrl,
  handleImageChange,
  handleRemoveImage,
  resetImageSelection,
  validationError,
}: ExistingProductImageUploadProps) {
  return (
    <div className="sm:col-span-2">
      <Label htmlFor="image" className="text-base mb-1 block">
        Product Image
      </Label>

      {/* Show existing image if available */}
      {existingImage && !previewUrl && (
        <div className="mb-3">
          <div className="relative w-32 h-32 border rounded-md overflow-hidden">
            <CloudinaryImage
              src={existingImage}
              alt="Product image"
              width={300}
              height={200}
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Show new image preview if selected */}
      {previewUrl && (
        <div className="mb-3">
          <div className="relative w-32 h-32 border rounded-md overflow-hidden">
            <CloudinaryImage
              src={previewUrl}
              alt="Preview"
              width={300}
              height={200}
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* File upload area */}
      {(!existingImage && !previewUrl) || (!previewUrl && selectedImage) ? (
        <div
          className={`border-2 border-dashed rounded-md p-4 ${
            validationError ? "border-red-300" : "border-gray-300"
          }`}
        >
          <div className="flex justify-center items-center space-x-2">
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-500">
              {selectedImage
                ? selectedImage.name
                : "Click to upload or drag and drop"}
            </span>
          </div>
          <input
            id="image"
            name="image"
            type="file"
            className="opacity-0 absolute inset-0 cursor-pointer"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
          />
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={resetImageSelection}
            className="text-sm text-primary hover:text-primary-dark"
          >
            Change image
          </button>
        </div>
      )}

      {validationError && (
        <p className="mt-1 text-sm text-red-600">{validationError}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Accepted formats: JPG, PNG, WebP. Max size: 2MB
      </p>
    </div>
  );
}
