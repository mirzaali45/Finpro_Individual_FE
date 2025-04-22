import React from "react";
import Link from "next/link";
import { CreateProductFormData } from "@/types";
import { Button } from "@/components/ui/button";
import ProductFormFields from "@/components/products/new/ProductFormFields";
import ExistingProductImageUpload from "@/components/products/edit/ExistingProductImageUpload";

interface ValidationErrors {
  name?: string;
  price?: string;
  tax_rate?: string;
  unit?: string;
  category?: string;
  description?: string;
  image?: string;
}

interface ProductEditFormProps {
  productId: number;
  formData: CreateProductFormData;
  validationErrors: ValidationErrors;
  selectedImage: File | null;
  existingImage: string | null;
  previewUrl: string | null;
  isSaving: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  resetImageSelection: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function ProductEditForm({
  productId,
  formData,
  validationErrors,
  selectedImage,
  existingImage,
  previewUrl,
  isSaving,
  handleChange,
  handleImageChange,
  handleRemoveImage,
  resetImageSelection,
  handleSubmit,
}: ProductEditFormProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Product Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* ProductFormFields component for main form fields */}
              <ProductFormFields
                formData={formData}
                validationErrors={validationErrors}
                handleChange={handleChange}
              />

              {/* Image upload component */}
              <ExistingProductImageUpload
                selectedImage={selectedImage}
                existingImage={existingImage}
                previewUrl={previewUrl}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                resetImageSelection={resetImageSelection}
                validationError={validationErrors.image}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href={`/dashboard/products/${productId}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
