// src/components/products/ImageDialog.tsx
import React from "react";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CloudinaryImage from "@/components/cloudinaryImage";

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  productName: string;
}

export default function ImageDialog({
  open,
  onOpenChange,
  imageUrl,
  productName,
}: ImageDialogProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Image</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <CloudinaryImage
            src={imageUrl}
            alt={productName}
            width={300}
            height={200}
            className="max-h-[70vh] object-contain"
          />
        </div>
        <DialogFooter>
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Open Original
            </Button>
          </a>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
