// src/app/dashboard/products/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productApi } from "@/lib/api";
import { Product, CreateProductFormData } from "@/types";
import { ArrowLeft, AlertCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import CloudinaryImage from "@/components/cloudinaryImage";
import { ApiError } from "@/lib/utils";



interface ValidationErrors {
  name?: string;
  price?: string;
  tax_rate?: string;
  unit?: string;
  category?: string;
  description?: string;
  image?: string;
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const productId = parseInt(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProductFormData>({
    name: "",
    description: "",
    price: 0,
    unit: "",
    tax_rate: 0,
    category: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await productApi.getProduct(productId);

        // Check if product is soft deleted
        if (productData.deleted_at) {
          setError("Cannot edit an archived product.");
          setIsLoading(false);
          return;
        }

        setProduct(productData);
        setExistingImage(productData.image || null);

        // Set form data from product
        setFormData({
          name: productData.name,
          description: productData.description || "",
          price: Number(productData.price),
          unit: productData.unit || "",
          tax_rate: productData.tax_rate ? Number(productData.tax_rate) : 0,
          category: productData.category || "",
        });
      } catch (error: unknown) {
        const apiError = error as ApiError;
        setError(
          apiError.message || "Failed to load product data. Please try again."
        );
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Parse numeric values appropriately
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

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setExistingImage(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

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

    setIsSaving(true);
    setError("");

    try {
      // If there's a new image or the image was removed, use the formData approach
      if (selectedImage || existingImage === null) {
        // Create FormData object for file upload
        const productFormData = new FormData();

        // Add all text fields
        Object.entries(formData).forEach(([key, value]) => {
          productFormData.append(key, String(value));
        });

        // Add image if selected
        if (selectedImage) {
          productFormData.append("image", selectedImage);
        } else if (existingImage === null) {
          // Indicate that we want to remove the image
          productFormData.append("removeImage", "true");
        }

        await productApi.updateProductWithImage(productId, productFormData);
      } else {
        // Standard update without image changes
        await productApi.updateProduct(productId, formData);
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      // Navigate to product detail page
      router.push(`/dashboard/products/${productId}`);
    } catch (err: unknown) {
      console.error("Error updating product:", err);

      const apiError = err as ApiError;
      const errorMessage =
        apiError.message ||
        apiError.response?.data?.message ||
        "Failed to update product. Please try again.";

      setError(errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/dashboard/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/products/${productId}`}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Basic Information */}
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Product Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product/Service Name*
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`mt-1 ${
                      validationErrors.name ? "border-red-300" : ""
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`mt-1 ${
                      validationErrors.description ? "border-red-300" : ""
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

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Rp </span>
                    </div>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className={`pl-7 ${
                        validationErrors.price ? "border-red-300" : ""
                      }`}
                    />
                  </div>
                  {validationErrors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="unit"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Unit
                  </label>
                  <Input
                    id="unit"
                    name="unit"
                    placeholder="e.g. hour, piece, kg"
                    value={formData.unit}
                    onChange={handleChange}
                    className={`mt-1 ${
                      validationErrors.unit ? "border-red-300" : ""
                    }`}
                  />
                  {validationErrors.unit && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.unit}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tax_rate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tax Rate (%)
                  </label>
                  <Input
                    id="tax_rate"
                    name="tax_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.tax_rate}
                    onChange={handleChange}
                    className={`mt-1 ${
                      validationErrors.tax_rate ? "border-red-300" : ""
                    }`}
                  />
                  {validationErrors.tax_rate && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.tax_rate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g. Services, Physical Products"
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 ${
                      validationErrors.category ? "border-red-300" : ""
                    }`}
                  />
                  {validationErrors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.category}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Image
                  </label>

                  {/* Show existing image if available */}
                  {existingImage && !previewUrl && (
                    <div className="mb-3">
                      <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                        <CloudinaryImage
                          src={existingImage}
                          alt={formData.name}
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
                  {(!existingImage && !previewUrl) ||
                  (!previewUrl && selectedImage) ? (
                    <div
                      className={`border-2 border-dashed rounded-md p-4 ${
                        validationErrors.image
                          ? "border-red-300"
                          : "border-gray-300"
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
                        onClick={() => {
                          // Force the input to be shown again
                          setPreviewUrl(null);
                          setSelectedImage(null);
                          setExistingImage(null);
                        }}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        Change image
                      </button>
                    </div>
                  )}

                  {validationErrors.image && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.image}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted formats: JPG, PNG, WebP. Max size: 2MB
                  </p>
                </div>
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
    </div>
  );
}