// src/components/products/ArchiveConfirmDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ArchiveConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isArchiving: boolean;
  onConfirm: () => void;
}

export default function ArchiveConfirmDialog({
  open,
  onOpenChange,
  isArchiving,
  onConfirm,
}: ArchiveConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive this product? Archived products
            won&apos;t appear in your active product list, but will still be
            available for existing invoices.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isArchiving}
          >
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={isArchiving}>
            {isArchiving ? "Archiving..." : "Archive Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
