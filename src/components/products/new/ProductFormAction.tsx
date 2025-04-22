// src/components/products/ProductFormActions.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductFormActionsProps {
  isLoading: boolean;
  cancelUrl: string;
  submitLabel: string;
}

export default function ProductFormActions({
  isLoading,
  cancelUrl,
  submitLabel,
}: ProductFormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Link href={cancelUrl}>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </Link>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : submitLabel}
      </Button>
    </div>
  );
}
