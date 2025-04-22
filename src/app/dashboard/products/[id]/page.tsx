// src/app/dashboard/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productApi } from "@/lib/api";
import { Product, InvoiceItem, ApiError } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailHeader from "@/components/products/id/ProductDetailHeader";
import ProductImage from "@/components/products/id/ProductImage";
import ProductInfo from "@/components/products/id/ProductInfo";
import ProductUsageStats from "@/components/products/id/ProductUsageState";
import ProductInvoices from "@/components/products/id/ProductsInvoices";
import InvoiceStatusOverview from "@/components/products/id/InvoiceStatusOverview";
import DeleteConfirmDialog from "@/components/products/id/DeleteConfirmDialog";
import ArchiveConfirmDialog from "@/components/products/id/ArchiveConfirmDialog";
import ImageDialog from "@/components/products/id/ImageDialog";
import ErrorMessage from "@/components/products/id/ErrorMessage";
import NotFoundMessage from "@/components/products/id/NotFoundMessage";
import LoadingState from "@/components/products/LoadingState";
import axios from "axios";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const productId = parseInt(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [productUsage, setProductUsage] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch product details
        const productData = await productApi.getProduct(productId);

        if (!productData) {
          setError("Product not found");
          setIsLoading(false);
          return;
        }

        setProduct(productData);

        // Fetch invoices to check product usage
        try {
          const invoiceItems = await productApi.getProductUsage(productId);

          // Safely transform the data to the expected type
          if (Array.isArray(invoiceItems)) {
            // First cast to unknown, then to InvoiceItem[] as TypeScript suggests
            const typedItems = invoiceItems as unknown as InvoiceItem[];
            setProductUsage(typedItems);
          } else {
            setProductUsage([]);
          }
        } catch (err) {
          console.error("Failed to fetch product usage:", err);
          setProductUsage([]);
        }
      } catch {
        setError("Failed to load product details. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId, toast]);

  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);

      if (!product) return;

      // Check if product is used in invoices
      if (productUsage.length > 0) {
        setError(
          "Cannot delete product that is used in invoices. Archive it instead."
        );
        setShowDeleteConfirm(false);
        setIsDeleting(false);
        return;
      }

      try {
        await productApi.deleteProduct(product.product_id);
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        router.push("/dashboard/products");
      } catch (err) {
        console.error("Error deleting product:", err);

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError(
              "Product not found or has been deleted in another session."
            );
            toast({
              title: "Error",
              description: "Product not found",
              variant: "destructive",
            });
            // Redirect ke halaman produk setelah beberapa detik
            setTimeout(() => router.push("/dashboard/products"), 2000);
          } else if (err.response?.status === 400) {
            // Handle case where product is used in invoices
            setError(
              err.response?.data?.message || "Cannot delete this product."
            );
            toast({
              title: "Error",
              description:
                err.response?.data?.message || "Cannot delete this product",
              variant: "destructive",
            });
          } else {
            setError("Failed to delete product. Please try again.");
            toast({
              title: "Error",
              description:
                err.response?.data?.message || "Failed to delete product",
              variant: "destructive",
            });
          }
        } else {
          // Non-Axios error
          setError("An unexpected error occurred. Please try again.");
          toast({
            title: "Error",
            description: "Unexpected error",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleArchiveProduct = async () => {
    try {
      setIsArchiving(true);

      if (!product) return;

      // Call the API to archive the product
      const updatedProduct = await productApi.archiveProduct(
        product.product_id
      );

      // Update the local state with the archived product
      setProduct(updatedProduct);

      toast({
        title: "Success",
        description: "Product archived successfully",
      });
    } catch (err: unknown) {
      console.error("Error archiving product:", err);
      const apiError = err as ApiError;
      setError("Failed to archive product. Please try again.");
      toast({
        title: "Error",
        description: apiError.message || "Failed to archive product",
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
      setShowArchiveConfirm(false);
    }
  };

  const handleRestoreProduct = async () => {
    try {
      setIsRestoring(true);

      if (!product) return;

      // Call the API to restore the product
      const updatedProduct = await productApi.restoreProduct(
        product.product_id
      );

      // Update the local state with the restored product
      setProduct(updatedProduct);

      toast({
        title: "Success",
        description: "Product restored successfully",
      });
    } catch (err: unknown) {
      console.error("Error restoring product:", err);
      const apiError = err as ApiError;
      setError("Failed to restore product. Please try again.");
      toast({
        title: "Error",
        description: apiError.message || "Failed to restore product",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error && !product) {
    return <ErrorMessage error={error} hasBackButton={true} />;
  }

  if (!product) {
    return <NotFoundMessage />;
  }

  const isArchived = !!product.deleted_at;

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <ProductDetailHeader
        product={product}
        isArchived={isArchived}
        productUsageCount={productUsage.length}
        onArchiveClick={() => setShowArchiveConfirm(true)}
        onDeleteClick={() => setShowDeleteConfirm(true)}
        onRestoreClick={handleRestoreProduct}
        isRestoring={isRestoring}
      />

      {/* Error Message */}
      {error && <ErrorMessage error={error} />}

      {/* Confirmation Dialogs */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        productId={product.product_id} // Tambahkan baris ini
        productUsageCount={productUsage.length}
        isDeleting={isDeleting}
        onConfirm={handleDeleteProduct}
      />

      <ArchiveConfirmDialog
        open={showArchiveConfirm}
        onOpenChange={setShowArchiveConfirm}
        isArchiving={isArchiving}
        onConfirm={handleArchiveProduct}
      />

      <ImageDialog
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        imageUrl={product.image}
        productName={product.name}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product information column */}
        <div className="lg:col-span-1">
          {/* Product image (if available) */}
          <ProductImage
            image={product.image}
            productName={product.name}
            onImageClick={() => setShowImageDialog(true)}
          />

          {/* Product details */}
          <ProductInfo product={product} />

          {/* Product stats */}
          <ProductUsageStats productUsage={productUsage} />
        </div>

        {/* Product usage */}
        <div className="lg:col-span-2">
          {/* Invoices table */}
          <ProductInvoices productUsage={productUsage} />

          {/* Invoice status overview */}
          <InvoiceStatusOverview productUsage={productUsage} />
        </div>
      </div>
    </div>
  );
}
