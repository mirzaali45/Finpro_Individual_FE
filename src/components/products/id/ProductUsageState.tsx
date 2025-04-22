// src/components/products/ProductUsageStats.tsx
import React from "react";
import { InvoiceItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductUsageStatsProps {
  productUsage: InvoiceItem[];
}

export default function ProductUsageStats({
  productUsage,
}: ProductUsageStatsProps) {
  return (
    <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Usage Statistics
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-5">
          <div className="overflow-hidden rounded-lg bg-white">
            <dt className="truncate text-sm font-medium text-gray-500">
              Times Invoiced
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {productUsage.length}
            </dd>
          </div>

          {productUsage.length > 0 && (
            <>
              <div className="overflow-hidden rounded-lg bg-white">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Quantity Sold
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {productUsage.reduce((sum, item) => sum + item.quantity, 0)}
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Revenue
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">
                  {formatCurrency(
                    productUsage.reduce(
                      (sum, item) => sum + Number(item.amount),
                      0
                    )
                  )}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}
