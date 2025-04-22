// src/components/products/ProductDetailHeader.tsx
import React from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

interface ProductDetailHeaderProps {
  product: Product;
  isArchived: boolean;
  productUsageCount: number;
  onArchiveClick: () => void;
  onDeleteClick: () => void;
  onRestoreClick: () => void;
  isRestoring: boolean;
}

export default function ProductDetailHeader({
  product,
  isArchived,
  productUsageCount,
  onArchiveClick,
  onDeleteClick,
  onRestoreClick,
  isRestoring,
}: ProductDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
        {isArchived && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Archive className="h-3 w-3 mr-1" />
            Archived
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isArchived ? (
          <>
            <Link href={`/dashboard/products/${product.product_id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300"
              onClick={onArchiveClick}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              onClick={onDeleteClick}
              disabled={productUsageCount > 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
            onClick={onRestoreClick}
            disabled={isRestoring}
          >
            {isRestoring ? "Restoring..." : "Restore Product"}
          </Button>
        )}
      </div>
    </div>
  );
}
