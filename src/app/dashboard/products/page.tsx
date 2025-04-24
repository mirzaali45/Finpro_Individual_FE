// // src/app/dashboard/products/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { productApi } from "@/lib/api";
// import { Product } from "@/types";
// import { useToast } from "@/components/ui/use-toast";
// import { ApiError } from "@/lib/utils";

// // Import Components
// import ProductsHeader from "@/components/products/ProductHeader";
// import ProductsFilters from "@/components/products/ProductFilter";
// import ActiveFilters from "@/components/products/ActiveFilter";
// import ProductsList from "@/components/products/ProductList";
// import LoadingState from "@/components/products/LoadingState";
// import ErrorState from "@/components/products/ErrorStats";

// export default function ProductsPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { toast } = useToast();

//   // Get initial filters from URL
//   const initialSearchTerm = searchParams?.get("search") || "";
//   const initialCategory = searchParams?.get("category") || "";

//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
//   const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [showArchivedProducts, setShowArchivedProducts] =
//     useState<boolean>(false);

//   // Update URL with current filters
//   const updateUrlWithFilters = (search: string, category: string) => {
//     const params = new URLSearchParams();
//     if (search) params.set("search", search);
//     if (category) params.set("category", category);

//     const newUrl =
//       window.location.pathname +
//       (params.toString() ? `?${params.toString()}` : "");
//     router.push(newUrl, { scroll: false });
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         let data: Product[] = [];

//         // First determine which API endpoint to use based on filters
//         if (searchTerm) {
//           // Use search endpoint
//           data = await productApi.searchProducts(searchTerm);
//         } else if (categoryFilter) {
//           // Use category endpoint
//           data = await productApi.getProductsByCategory(categoryFilter);
//         } else {
//           // Get all products (with archive filter if needed)
//           data = await productApi.getProducts(showArchivedProducts);
//         }

//         if (!Array.isArray(data)) {
//           console.error("Unexpected API response format:", data);
//           setError("Unexpected data format received from server");
//           setFilteredProducts([]);
//           return;
//         }

//         // Extract unique categories for filter dropdown
//         const uniqueCategories = Array.from(
//           new Set(data.map((product) => product.category).filter(Boolean))
//         ) as string[];

//         setCategories(uniqueCategories);

//         // Apply any additional filters needed on the client-side
//         applyFilters(data, searchTerm, categoryFilter, showArchivedProducts);
//       } catch (err: unknown) {
//         setError("Failed to load products. Please try again.");
//         setFilteredProducts([]);

//         const apiError = err as ApiError;
//         toast({
//           title: "Error",
//           description: apiError.message || "Failed to load products",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [
//     initialSearchTerm,
//     initialCategory,
//     showArchivedProducts,
//     searchTerm,
//     categoryFilter,
//     toast,
//   ]);

//   // Apply filters to the products list
//   const applyFilters = (
//     productsToFilter: Product[],
//     search: string,
//     category: string,
//     showArchived: boolean
//   ) => {
//     // First filter by archived status if not specifically including archived
//     const filtered = showArchived
//       ? [...productsToFilter]
//       : productsToFilter.filter((product) => !product.deleted_at);

//     // Additional client-side filtering if needed
//     // (Most filtering should happen on the backend, but we keep this for flexibility)
//     setFilteredProducts(filtered);
//   };

//   // Handle search input changes
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newSearchTerm = e.target.value;
//     setSearchTerm(newSearchTerm);
//   };

//   // Handle search form submission
//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     updateUrlWithFilters(searchTerm, categoryFilter);
//   };

//   // Handle category filter changes
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newCategory = e.target.value;
//     setCategoryFilter(newCategory);
//     updateUrlWithFilters(searchTerm, newCategory);
//   };

//   // Toggle archived products display
//   const toggleArchivedProducts = () => {
//     const newValue = !showArchivedProducts;
//     setShowArchivedProducts(newValue);
//   };

//   // Reset all filters
//   const handleResetFilters = () => {
//     setSearchTerm("");
//     setCategoryFilter("");
//     setShowArchivedProducts(false);
//     updateUrlWithFilters("", "");
//   };

//   // Clear individual filters
//   const clearSearch = () => {
//     setSearchTerm("");
//     updateUrlWithFilters("", categoryFilter);
//   };

//   const clearCategory = () => {
//     setCategoryFilter("");
//     updateUrlWithFilters(searchTerm, "");
//   };

//   const clearArchived = () => {
//     setShowArchivedProducts(false);
//   };

//   if (isLoading) {
//     return <LoadingState />;
//   }

//   return (
//     <div className="space-y-6">
//       <ProductsHeader />
//       {error && (
//         <ErrorState error={error} onRetry={() => window.location.reload()} />
//       )}
//       {/* Search and filters */}
//       <ProductsFilters
//         searchTerm={searchTerm}
//         categoryFilter={categoryFilter}
//         showArchivedProducts={showArchivedProducts}
//         categories={categories}
//         handleSearchChange={handleSearchChange}
//         handleSearchSubmit={handleSearchSubmit}
//         handleCategoryChange={handleCategoryChange}
//         toggleArchivedProducts={toggleArchivedProducts}
//         handleResetFilters={handleResetFilters}
//       />
//       {/* Active filters display */}
//       <ActiveFilters
//         searchTerm={searchTerm}
//         categoryFilter={categoryFilter}
//         showArchivedProducts={showArchivedProducts}
//         clearSearch={clearSearch}
//         clearCategory={clearCategory}
//         clearArchived={clearArchived}
//       />
//       {/* Product list */}
//       <ProductsList
//         products={filteredProducts}
//         searchTerm={searchTerm}
//         categoryFilter={categoryFilter}
//         handleResetFilters={handleResetFilters}
//       />
//     </div>
//   );
// }
// src/app/dashboard/products/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { productApi } from "@/lib/api";
import { Product } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, X, Archive } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { debounce } from "lodash";
import { ApiError } from "@/lib/utils";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get initial filters from URL
  const initialSearchTerm = searchParams?.get("search") || "";
  const initialCategory = searchParams?.get("category") || "";
  const initialShowArchived = searchParams?.get("archived") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [showArchivedProducts, setShowArchivedProducts] =
    useState<boolean>(initialShowArchived);
  const [archivedCount, setArchivedCount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Update URL dengan filter saat ini
  const updateUrlWithFilters = useCallback(
    (search: string, category: string, archived: boolean) => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (archived) params.set("archived", "true");

      const newUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

  // Debounce untuk search term
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      updateUrlWithFilters(value, categoryFilter, showArchivedProducts);
    }, 500),
    [categoryFilter, showArchivedProducts, updateUrlWithFilters]
  );

  // Handle perubahan input dengan debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSetSearchTerm(value);
  };

  // Mencegah form submission yang menyebabkan page reload
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Ambil semua produk termasuk yang diarsipkan jika filter diaktifkan
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Kunci perubahan: Gunakan parameter showArchivedProducts saat memanggil API
        const fetchedProducts = await productApi.getProducts(
          showArchivedProducts
        );

        if (!Array.isArray(fetchedProducts)) {
          setError("Unexpected data format received from server");
          setProducts([]);
          return;
        }

        const archivedProductsCount = fetchedProducts.filter(
          (p) => p.deleted_at
        ).length;

        setProducts(fetchedProducts);
        setArchivedCount(archivedProductsCount);

        // Extract kategori unik
        const uniqueCategories = Array.from(
          new Set(
            fetchedProducts.map((product) => product.category).filter(Boolean)
          )
        ) as string[];
        setCategories(uniqueCategories);
      } catch (err: unknown) {
        setError("Failed to load products. Please try again.");
        setProducts([]);

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
  }, [toast, showArchivedProducts, refreshTrigger]);

  // Terapkan filter client-side untuk kategori dan search
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];

      // Filter by category
      if (categoryFilter) {
        filtered = filtered.filter(
          (product) => product.category === categoryFilter
        );
      }

      // Filter by search term
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            (product.description &&
              product.description.toLowerCase().includes(searchLower))
        );
      }
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, debouncedSearchTerm, categoryFilter]);

  // Handle perubahan filter kategori
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategoryFilter(newCategory);
    updateUrlWithFilters(
      debouncedSearchTerm,
      newCategory,
      showArchivedProducts
    );
  };

  // Toggle tampilan produk yang diarsipkan
  const toggleArchivedProducts = () => {
    const newValue = !showArchivedProducts;
    setShowArchivedProducts(newValue);
    updateUrlWithFilters(debouncedSearchTerm, categoryFilter, newValue);
  };

  // Reset semua filter
  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCategoryFilter("");
    setShowArchivedProducts(false);
    updateUrlWithFilters("", "", false);
  };

  // Refresh data
  const handleRefreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
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
            onClick={handleRefreshData}
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
          className={`flex items-center gap-1 px-3 h-10 ${
            showArchivedProducts ? "bg-purple-600 hover:bg-purple-700" : ""
          }`}
          title={
            showArchivedProducts
              ? "Hide archived products"
              : "Show archived products"
          }
        >
          <Archive className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">
            {showArchivedProducts ? "Hide Archived" : "Show Archived"}
          </span>
          {archivedCount > 0 && (
            <span
              className={`ml-1 text-xs rounded-full px-2 py-0.5 ${
                showArchivedProducts
                  ? "bg-purple-800 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {archivedCount}
            </span>
          )}
        </Button>

        {(debouncedSearchTerm || categoryFilter || showArchivedProducts) && (
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
      {(debouncedSearchTerm || categoryFilter || showArchivedProducts) && (
        <div className="flex flex-wrap gap-2 text-sm">
          {debouncedSearchTerm && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
              <span>Search: {debouncedSearchTerm}</span>
              <button
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                  updateUrlWithFilters(
                    "",
                    categoryFilter,
                    showArchivedProducts
                  );
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
                  updateUrlWithFilters(
                    debouncedSearchTerm,
                    "",
                    showArchivedProducts
                  );
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {showArchivedProducts && (
            <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full flex items-center">
              <span className="flex items-center">
                <Archive className="h-3 w-3 mr-1" />
                Including archived
              </span>
              <button
                className="ml-2 text-purple-500 hover:text-purple-700"
                onClick={() => {
                  setShowArchivedProducts(false);
                  updateUrlWithFilters(
                    debouncedSearchTerm,
                    categoryFilter,
                    false
                  );
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
            {debouncedSearchTerm || categoryFilter ? (
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
                {archivedCount > 0 && !showArchivedProducts ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      No active products found. You have {archivedCount}{" "}
                      archived product(s).
                    </p>
                    <Button
                      variant="outline"
                      onClick={toggleArchivedProducts}
                      className="flex items-center"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Show Archived Products
                    </Button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
