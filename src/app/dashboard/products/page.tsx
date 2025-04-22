// src/app/dashboard/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { productApi } from "@/lib/api";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { ApiError } from "@/lib/utils";

// Import Components
import ProductsHeader from "@/components/products/ProductHeader";
import ProductsFilters from "@/components/products/ProductFilter";
import ActiveFilters from "@/components/products/ActiveFilter";
import ProductsList from "@/components/products/ProductList";
import LoadingState from "@/components/products/LoadingState";
import ErrorState from "@/components/products/ErrorStats";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get initial filters from URL
  const initialSearchTerm = searchParams?.get("search") || "";
  const initialCategory = searchParams?.get("category") || "";

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [showArchivedProducts, setShowArchivedProducts] =
    useState<boolean>(false);

  // Update URL with current filters
  const updateUrlWithFilters = (search: string, category: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);

    const newUrl =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");
    router.push(newUrl, { scroll: false });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data: Product[] = [];

        // First determine which API endpoint to use based on filters
        if (searchTerm) {
          // Use search endpoint
          data = await productApi.searchProducts(searchTerm);
        } else if (categoryFilter) {
          // Use category endpoint
          data = await productApi.getProductsByCategory(categoryFilter);
        } else {
          // Get all products (with archive filter if needed)
          data = await productApi.getProducts(showArchivedProducts);
        }

        if (!Array.isArray(data)) {
          console.error("Unexpected API response format:", data);
          setError("Unexpected data format received from server");
          setFilteredProducts([]);
          return;
        }

        // Extract unique categories for filter dropdown
        const uniqueCategories = Array.from(
          new Set(data.map((product) => product.category).filter(Boolean))
        ) as string[];

        setCategories(uniqueCategories);

        // Apply any additional filters needed on the client-side
        applyFilters(data, searchTerm, categoryFilter, showArchivedProducts);
      } catch (err: unknown) {
        setError("Failed to load products. Please try again.");
        setFilteredProducts([]);

        const apiError = err as ApiError;
        toast({
          title: "Error",
          description: apiError.message || "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    initialSearchTerm,
    initialCategory,
    showArchivedProducts,
    searchTerm,
    categoryFilter,
    toast,
  ]);

  // Apply filters to the products list
  const applyFilters = (
    productsToFilter: Product[],
    search: string,
    category: string,
    showArchived: boolean
  ) => {
    // First filter by archived status if not specifically including archived
    const filtered = showArchived
      ? [...productsToFilter]
      : productsToFilter.filter((product) => !product.deleted_at);

    // Additional client-side filtering if needed
    // (Most filtering should happen on the backend, but we keep this for flexibility)
    setFilteredProducts(filtered);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlWithFilters(searchTerm, categoryFilter);
  };

  // Handle category filter changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategoryFilter(newCategory);
    updateUrlWithFilters(searchTerm, newCategory);
  };

  // Toggle archived products display
  const toggleArchivedProducts = () => {
    const newValue = !showArchivedProducts;
    setShowArchivedProducts(newValue);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setShowArchivedProducts(false);
    updateUrlWithFilters("", "");
  };

  // Clear individual filters
  const clearSearch = () => {
    setSearchTerm("");
    updateUrlWithFilters("", categoryFilter);
  };

  const clearCategory = () => {
    setCategoryFilter("");
    updateUrlWithFilters(searchTerm, "");
  };

  const clearArchived = () => {
    setShowArchivedProducts(false);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <ProductsHeader />
      {error && (
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      )}
      {/* Search and filters */}
      <ProductsFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        showArchivedProducts={showArchivedProducts}
        categories={categories}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        handleCategoryChange={handleCategoryChange}
        toggleArchivedProducts={toggleArchivedProducts}
        handleResetFilters={handleResetFilters}
      />
      {/* Active filters display */}
      <ActiveFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        showArchivedProducts={showArchivedProducts}
        clearSearch={clearSearch}
        clearCategory={clearCategory}
        clearArchived={clearArchived}
      />
      {/* Product list */}
      <ProductsList
        products={filteredProducts}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        handleResetFilters={handleResetFilters}
      />
    </div>
  );
}
