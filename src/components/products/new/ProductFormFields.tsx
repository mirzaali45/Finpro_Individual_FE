// src/components/products/ProductFormFields.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CreateProductFormData } from "@/types";

interface ValidationErrors {
  name?: string;
  price?: string;
  tax_rate?: string;
  unit?: string;
  category?: string;
  description?: string;
  image?: string;
}

interface ProductFormFieldsProps {
  formData: CreateProductFormData;
  validationErrors: ValidationErrors;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function ProductFormFields({
  formData,
  validationErrors,
  handleChange,
}: ProductFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <Label htmlFor="name" className="text-base">
          Product/Service Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`mt-1 ${validationErrors.name ? "border-red-500" : ""}`}
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-base">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`mt-1 ${
            validationErrors.description ? "border-red-500" : ""
          }`}
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors.description}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.description ? formData.description.length : 0}/500
          characters
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Price */}
        <div>
          <Label htmlFor="price" className="text-base">
            Price <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">Rp </span>
            </div>
            <Input
              id="price"
              name="price"
              type="number"
              step="1"
              min="0"
              value={
                formData.price === 0 && formData.price !== 0
                  ? ""
                  : formData.price
              }
              onChange={handleChange}
              required
              className={`pl-7 ${
                validationErrors.price ? "border-red-500" : ""
              }`}
            />
            {validationErrors.price && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.price}
              </p>
            )}
          </div>
        </div>

        {/* Unit */}
        <div>
          <Label htmlFor="unit" className="text-base">
            Unit
          </Label>
          <Input
            id="unit"
            name="unit"
            placeholder="e.g. hour, piece, kg"
            value={formData.unit}
            onChange={handleChange}
            className={`mt-1 ${validationErrors.unit ? "border-red-500" : ""}`}
          />
          {validationErrors.unit && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.unit}</p>
          )}
        </div>

        {/* Tax Rate */}
        <div>
          <Label htmlFor="tax_rate" className="text-base">
            Tax Rate (%)
          </Label>
          <Input
            id="tax_rate"
            name="tax_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={
              formData.tax_rate === 0 && formData.tax_rate !== 0
                ? ""
                : formData.tax_rate
            }
            onChange={handleChange}
            className={`mt-1 ${
              validationErrors.tax_rate ? "border-red-500" : ""
            }`}
          />
          {validationErrors.tax_rate && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.tax_rate}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category" className="text-base">
            Category
          </Label>
          <Input
            id="category"
            name="category"
            placeholder="e.g. Services, Physical Products"
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 ${
              validationErrors.category ? "border-red-500" : ""
            }`}
          />
          {validationErrors.category && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.category}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
