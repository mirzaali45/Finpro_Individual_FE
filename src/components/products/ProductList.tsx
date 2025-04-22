// src/components/products/ProductsList.tsx
import React from "react";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import EmptyProductState from "@/components/products/Emptyproductstate";

interface ProductsListProps {
  products: Product[];
  searchTerm: string;
  categoryFilter: string;
  handleResetFilters: () => void;
}

export default function ProductsList({
  products,
  searchTerm,
  categoryFilter,
  handleResetFilters,
}: ProductsListProps) {
  if (products.length === 0) {
    return (
      <EmptyProductState
        hasFilters={!!searchTerm || !!categoryFilter}
        handleResetFilters={handleResetFilters}
      />
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}