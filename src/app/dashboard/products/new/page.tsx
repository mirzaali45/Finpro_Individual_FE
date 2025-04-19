// src/app/dashboard/products/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productApi } from "@/lib/api";
import { CreateProductFormData } from "@/types";
import { ArrowLeft, AlertCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CloudinaryImage from "@/components/cloudinaryImage";

// Type for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface ValidationErrors {
  name?: string;
  price?: string;
  tax_rate?: string;
  unit?: string;
  category?: string;
  description?: string;
  image?: string;
}

export default function NewProductPage() {
  const router = useRouter();
    const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProductFormData>({
    name: "",
    description: "",
    price: 0,
    unit: "",
    tax_rate: 0,
    category: "",
  });

  // Validate form data before submission
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate name (required)
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
      isValid = false;
    } else if (formData.name.length > 100) {
      errors.name = "Product name cannot exceed 100 characters";
      isValid = false;
    }

    // Validate price (required, non-negative)
    if (formData.price < 0) {
      errors.price = "Price cannot be negative";
      isValid = false;
    }

    // Validate tax rate (non-negative)
    if (formData.tax_rate < 0) {
      errors.tax_rate = "Tax rate cannot be negative";
      isValid = false;
    } else if (formData.tax_rate > 100) {
      errors.tax_rate = "Tax rate cannot exceed 100%";
      isValid = false;
    }

    // Validate unit (optional, max length)
    if (formData.unit && formData.unit.length > 20) {
      errors.unit = "Unit cannot exceed 20 characters";
      isValid = false;
    }

    // Validate category (optional, max length)
    if (formData.category && formData.category.length > 50) {
      errors.category = "Category cannot exceed 50 characters";
      isValid = false;
    }

    // Validate description (optional, max length)
    if (formData.description && formData.description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
      isValid = false;
    }

    // Validate image if selected
    if (selectedImage) {
      // Check file size (max 2MB)
      if (selectedImage.size > 2 * 1024 * 1024) {
        errors.image = "Image size cannot exceed 2MB";
        isValid = false;
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(selectedImage.type)) {
        errors.image = "Only JPG, PNG, and WebP images are allowed";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Parse numeric values, use 0 as fallback for empty strings
    let parsedValue: string | number = value;
    if (name === "price" || name === "tax_rate") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    // Clear validation error when field is edited
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      // Clear previous image validation errors
      if (validationErrors.image) {
        setValidationErrors({
          ...validationErrors,
          image: undefined,
        });
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let newProduct;

      // Use appropriate API method based on whether image is included
      if (selectedImage) {
        // Create FormData object for file upload
        const productFormData = new FormData();

        // Add all text fields
        Object.entries(formData).forEach(([key, value]) => {
          productFormData.append(key, String(value));
        });

        // Add image
        productFormData.append("image", selectedImage);

        // Submit with image
        newProduct = await productApi.createProductWithImage(productFormData);
      } else {
        // Submit without image
        newProduct = await productApi.createProduct(formData);
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      // Navigate to product detail page or products list
      router.push(`/dashboard/products/${newProduct.product_id}`);
    } catch (err: unknown) {
      console.error("Error creating product:", err);

      const apiError = err as ApiError;
      const errorMessage =
        apiError.message ||
        apiError.response?.data?.message ||
        "Failed to create product. Please try again.";

      setError(errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                className={`mt-1 ${
                  validationErrors.name ? "border-red-500" : ""
                }`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.name}
                </p>
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
                  className={`mt-1 ${
                    validationErrors.unit ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.unit && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.unit}
                  </p>
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

            {/* Product Image */}
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
                    width={300} // Add appropriate width
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
                    validationErrors.image
                      ? "border-red-500"
                      : "border-gray-300"
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
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 2MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {validationErrors.image && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.image}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link href="/dashboard/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
