// src/components/products/ProductInfo.tsx
import React from "react";
import { Tag, Hash, DollarSign, Calendar, Archive } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Product Information
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(Number(product.price))}
          </span>
        </div>

        {product.description && (
          <div className="mt-4">
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            {product.unit && (
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Unit
                </dt>
                <dd className="text-sm text-gray-900">{product.unit}</dd>
              </div>
            )}

            {product.tax_rate && product.tax_rate > 0 && (
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Hash className="h-4 w-4 mr-2" />
                  Tax Rate
                </dt>
                <dd className="text-sm text-gray-900">{product.tax_rate}%</dd>
              </div>
            )}

            {product.category && (
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Category
                </dt>
                <dd className="text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </dd>
              </div>
            )}

            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Created
              </dt>
              <dd className="text-sm text-gray-900">
                {formatDate(product.created_at)}
              </dd>
            </div>

            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Last Updated
              </dt>
              <dd className="text-sm text-gray-900">
                {formatDate(product.updated_at)}
              </dd>
            </div>

            {product.deleted_at && (
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Archive className="h-4 w-4 mr-2" />
                  Archived On
                </dt>
                <dd className="text-sm text-gray-900">
                  {formatDate(product.deleted_at)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
