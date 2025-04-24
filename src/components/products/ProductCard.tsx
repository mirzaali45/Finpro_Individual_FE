// src/components/products/ProductCard.tsx

import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Archive, Tag } from "lucide-react";
import CloudinaryImage from "@/components/cloudinaryImage";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isArchived = !!product.deleted_at;

  return (
    <Link
      href={`/dashboard/products/${product.product_id}`}
      className="block transition-all duration-200 hover:shadow-md"
    >
      <div
        className={`bg-white rounded-lg shadow overflow-hidden h-full border ${
          isArchived ? "border-gray-300 opacity-80" : "border-transparent"
        }`}
      >
        {/* Product image */}
        <div className="relative">
          {product.image ? (
            <div className="w-full h-40 overflow-hidden">
              <CloudinaryImage
                src={product.image}
                alt={product.name}
                width={300}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Archive badge - PENTING: Selalu tampilkan badge jika product diarsipkan */}
          {isArchived && (
            <div className="absolute top-2 right-2 bg-gray-800/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
              <Archive className="h-3 w-3 mr-1" />
              Archived
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3
              className={`text-lg font-medium ${
                isArchived ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {product.name}
            </h3>
            <span
              className={`text-lg font-bold ${
                isArchived ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {formatCurrency(Number(product.price))}
            </span>
          </div>

          {product.description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            {product.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Tag className="h-3 w-3 mr-1" />
                {product.category}
              </span>
            )}

            {/* Tambahan indikator archived di bagian bawah card */}
            {isArchived && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
