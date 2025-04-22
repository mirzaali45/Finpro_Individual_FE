// src/components/products/ActiveFilters.tsx
import React from "react";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  showArchivedProducts: boolean;
  clearSearch: () => void;
  clearCategory: () => void;
  clearArchived: () => void;
}

export default function ActiveFilters({
  searchTerm,
  categoryFilter,
  showArchivedProducts,
  clearSearch,
  clearCategory,
  clearArchived,
}: ActiveFiltersProps) {
  if (!searchTerm && !categoryFilter && !showArchivedProducts) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {searchTerm && (
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
          <span>Search: {searchTerm}</span>
          <button
            className="ml-2 text-blue-500 hover:text-blue-700"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {categoryFilter && (
        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center">
          <span>Category: {categoryFilter}</span>
          <button
            className="ml-2 text-green-500 hover:text-green-700"
            onClick={clearCategory}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {showArchivedProducts && (
        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full flex items-center">
          <span>Including archived</span>
          <button
            className="ml-2 text-purple-500 hover:text-purple-700"
            onClick={clearArchived}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
