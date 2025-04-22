// src/components/products/ProductsFilters.tsx
import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductsFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  showArchivedProducts: boolean;
  categories: string[];
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  toggleArchivedProducts: () => void;
  handleResetFilters: () => void;
}

export default function ProductsFilters({
  searchTerm,
  categoryFilter,
  showArchivedProducts,
  categories,
  handleSearchChange,
  handleSearchSubmit,
  handleCategoryChange,
  toggleArchivedProducts,
  handleResetFilters,
}: ProductsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <form className="relative flex-grow" onSubmit={handleSearchSubmit}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {categories.length > 0 && (
        <div className="w-full sm:w-auto">
          <select
            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      <Button
        variant={showArchivedProducts ? "default" : "outline"}
        onClick={toggleArchivedProducts}
        size="icon"
        className="w-10 h-10"
        title={
          showArchivedProducts
            ? "Hide archived products"
            : "Show archived products"
        }
      >
        <Filter className="h-4 w-4" />
      </Button>

      {(searchTerm || categoryFilter || showArchivedProducts) && (
        <Button
          variant="outline"
          onClick={handleResetFilters}
          size="icon"
          className="w-10 h-10"
          title="Reset filters"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
