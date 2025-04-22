// src/app/dashboard/products/new/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { productApi } from "@/lib/api";
import { CreateProductFormData } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import ProductFormHeader from "@/components/products/new/ProductFormHeader";
import ProductFormFields from "@/components/products/new/ProductFormFields";
import ProductImageUpload from "@/components/products/new/ProductImageUpload";
import ProductFormActions from "@/components/products/new/ProductFormAction";
import { ApiError } from "@/lib/utils";
import ProductErrorDisplay from "@/components/products/new/ProductErrorDisplay";

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
      <ProductFormHeader
        title="Add New Product"
        backUrl="/dashboard/products"
      />
      {/* Use ErrorDisplay component to handle errors */}
      <ProductErrorDisplay error={error} />
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ProductFormFields
            formData={formData}
            validationErrors={validationErrors}
            handleChange={handleChange}
          />
          <ProductImageUpload
            selectedImage={selectedImage}
            previewUrl={previewUrl}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            validationError={validationErrors.image}
          />
          <ProductFormActions
            isLoading={isLoading}
            cancelUrl="/dashboard/products"
            submitLabel="Create Product"
          />
        </form>
      </div>
    </div>
  );
}
