// src/components/products/DeleteConfirmDialog.tsx
import React, { useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { productApi } from "@/lib/api";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productUsageCount: number;
  isDeleting: boolean;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  productId,
  productUsageCount,
  isDeleting,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const { toast } = useToast();

  // Validasi produk masih ada sebelum menampilkan dialog
  useEffect(() => {
    if (open && productId) {
      const validateProduct = async () => {
        try {
          await productApi.getProduct(productId);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            // Produk tidak ditemukan, tutup dialog dan tampilkan pesan
            onOpenChange(false);
            toast({
              title: "Error",
              description: "Product not found or has been deleted",
              variant: "destructive",
            });
          }
        }
      };

      validateProduct();
    }
  }, [open, productId, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
            {productUsageCount > 0 && (
              <div className="mt-2 text-red-600 font-medium">
                Warning: This product is used in {productUsageCount} invoice(s).
                You cannot delete it while it&apos;s referenced in invoices.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting || productUsageCount > 0}
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
