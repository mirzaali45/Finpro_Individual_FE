// src/components/products/InvoiceStatusOverview.tsx
import React from "react";
import { InvoiceItem } from "@/types";

interface InvoiceStatusOverviewProps {
  productUsage: InvoiceItem[];
}

export default function InvoiceStatusOverview({
  productUsage,
}: InvoiceStatusOverviewProps) {
  if (productUsage.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Invoice Status Overview
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          <div>
            <h4 className="text-base font-medium text-gray-900">Paid</h4>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {
                productUsage.filter((item) => item.invoice?.status === "PAID")
                  .length
              }
            </p>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">Pending</h4>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">
              {
                productUsage.filter(
                  (item) => item.invoice?.status === "PENDING"
                ).length
              }
            </p>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">Others</h4>
            <p className="mt-2 text-3xl font-semibold text-gray-600">
              {
                productUsage.filter(
                  (item) =>
                    !["PAID", "PENDING"].includes(item.invoice?.status || "")
                ).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
