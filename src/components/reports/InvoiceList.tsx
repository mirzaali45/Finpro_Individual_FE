// src/components/dashboard/reports/InvoiceList.tsx
"use client";

import { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpDown, FileText } from "lucide-react";

interface InvoiceListProps {
  invoices: Invoice[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
}

export default function InvoiceList({
  invoices,
  sortField,
  // sortDirection,
  onSortChange,
}: InvoiceListProps) {
  // Status colors
  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center gap-2">
        <FileText className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium">Invoice List</h2>
      </div>

      {invoices.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center">
          <p className="text-sm text-gray-500">
            No invoices match your filter criteria. Try adjusting your filters
            or date range.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => onSortChange("invoice_number")}
                >
                  <div className="flex items-center">
                    Invoice #
                    {sortField === "invoice_number" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => onSortChange("issue_date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === "issue_date" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => onSortChange("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "status" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => onSortChange("total_amount")}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    {sortField === "total_amount" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                    <a
                      href={`/dashboard/invoices/${invoice.invoice_id}`}
                      className="hover:underline"
                    >
                      {invoice.invoice_number}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(invoice.issue_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.client?.name || "Unknown Client"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[invoice.status]
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(Number(invoice.total_amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
