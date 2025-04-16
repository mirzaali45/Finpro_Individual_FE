// src/app/dashboard/products/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { productApi } from "@/lib/api";
import { Product } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, X } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { toast } from "@/components/ui/use-toast";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial filters from URL
  const initialSearchTerm = searchParams?.get("search") || "";
  const initialCategory = searchParams?.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
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
          setProducts([]);
          setFilteredProducts([]);
          return;
        }

        setProducts(data);

        // Extract unique categories for filter dropdown
        const uniqueCategories = Array.from(
          new Set(data.map((product) => product.category).filter(Boolean))
        ) as string[];

        setCategories(uniqueCategories);

        // Apply any additional filters needed on the client-side
        applyFilters(data, searchTerm, categoryFilter, showArchivedProducts);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
        setProducts([]);
        setFilteredProducts([]);
        toast({
          title: "Error",
          description: error.message || "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [initialSearchTerm, initialCategory, showArchivedProducts]);

  // Apply filters to the products list
  const applyFilters = (
    productsToFilter: Product[],
    search: string,
    category: string,
    showArchived: boolean
  ) => {
    // First filter by archived status if not specifically including archived
    let filtered = showArchived
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Products & Services
        </h1>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto underline text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* Search and filters */}
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

      {/* Active filters display */}
      {(searchTerm || categoryFilter || showArchivedProducts) && (
        <div className="flex flex-wrap gap-2 text-sm">
          {searchTerm && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
              <span>Search: {searchTerm}</span>
              <button
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  setSearchTerm("");
                  updateUrlWithFilters("", categoryFilter);
                }}
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
                onClick={() => {
                  setCategoryFilter("");
                  updateUrlWithFilters(searchTerm, "");
                }}
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
                onClick={() => {
                  setShowArchivedProducts(false);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product list */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              No products found
            </h3>
            {searchTerm || categoryFilter ? (
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
                  You haven't added any products yet. Add your first product to
                  include in your invoices.
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
      )}
    </div>
  );
}
