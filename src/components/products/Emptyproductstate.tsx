// src/components/products/EmptyProductState.tsx
import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyProductStateProps {
  hasFilters: boolean;
  handleResetFilters: () => void;
}

export default function EmptyProductState({
  hasFilters,
  handleResetFilters,
}: EmptyProductStateProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:p-6 text-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          No products found
        </h3>
        {hasFilters ? (
          <p className="mt-2 text-sm text-gray-500">
            No products match your current filters. Try adjusting your
            search terms or{" "}
            <button
              className="text-primary hover:underline"
              onClick={handleResetFilters}
            >
              reset all filters
            </button>
            .
          </p>
        ) : (
          <div className="mt-4 flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-4">
              You haven&apos;t added any products yet. Add your first
              product to include in your invoices.
            </p>
            <Link href="/dashboard/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}