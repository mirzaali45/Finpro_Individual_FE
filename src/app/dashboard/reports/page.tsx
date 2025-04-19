// src/app/dashboard/reports/page.tsx
"use client";

import { useState, useEffect } from "react";
import { invoiceApi, clientApi } from "@/lib/api";
import { Invoice, Client } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import InvoiceSummary from "@/components/dashboard/invoicesummery";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Calendar,
  Download,
  Filter,
  BarChart4,
  PieChart,
  LineChart,
  FileText,
} from "lucide-react";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 3))
      .toISOString()
      .split("T")[0], // 3 months ago
    end: new Date().toISOString().split("T")[0], // today
  });
  const [clientFilter, setClientFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");

  // Sort
  const [sortField, setSortField] = useState<string>("issue_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [invoicesData, clientsData] = await Promise.all([
          invoiceApi.getInvoices(),
          clientApi.getClients(),
        ]);

        setInvoices(invoicesData);
        setClients(clientsData);

        // Apply initial filtering
        applyFilters(
          invoicesData,
          dateRange,
          clientFilter,
          statusFilter,
          sortField,
          sortDirection
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, clientFilter, statusFilter, sortField, sortDirection]);

  const applyFilters = (
    data: Invoice[],
    dates: { start: string; end: string },
    client: number | "all",
    status: string | "all",
    sort: string,
    direction: "asc" | "desc"
  ) => {
    // Filter by date range
    let filtered = data.filter((invoice) => {
      const issueDate = new Date(invoice.issue_date);
      const startDate = new Date(dates.start);
      const endDate = new Date(dates.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day

      return issueDate >= startDate && issueDate <= endDate;
    });

    // Filter by client
    if (client !== "all") {
      filtered = filtered.filter((invoice) => invoice.client_id === client);
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === status);
    }

    // Sort the data
    filtered.sort((a, b) => {
      let aValue: string | number | Date | null = null;
      let bValue: string | number | Date | null = null;

      // Handle date comparison
      if (
        sort === "issue_date" ||
        sort === "due_date" ||
        sort === "created_at"
      ) {
        aValue = new Date(a[sort as keyof Invoice] as string).getTime();
        bValue = new Date(b[sort as keyof Invoice] as string).getTime();
      }

      // Handle numeric comparison
      else if (
        sort === "total_amount" ||
        sort === "subtotal" ||
        sort === "tax_amount"
      ) {
        aValue = Number(a[sort as keyof Invoice]);
        bValue = Number(b[sort as keyof Invoice]);
      }

      // Handle string comparison (default)
      else {
        aValue = String(a[sort as keyof Invoice] || "");
        bValue = String(b[sort as keyof Invoice] || "");
      }

      if (direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInvoices(filtered);
  };

  const handleFilterChange = () => {
    applyFilters(
      invoices,
      dateRange,
      clientFilter,
      statusFilter,
      sortField,
      sortDirection
    );
  };

  const handleSortChange = (field: string) => {
    const newDirection =
      field === sortField && sortDirection === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortDirection(newDirection);
    applyFilters(
      invoices,
      dateRange,
      clientFilter,
      statusFilter,
      field,
      newDirection
    );
  };

  const exportToCSV = () => {
    if (filteredInvoices.length === 0) return;

    // Create CSV content
    const headers = [
      "Invoice #",
      "Date",
      "Due Date",
      "Client",
      "Status",
      "Amount",
      "Tax",
      "Total",
    ];
    const rows = filteredInvoices.map((invoice) => [
      invoice.invoice_number,
      formatDate(invoice.issue_date),
      formatDate(invoice.due_date),
      invoice.client?.name || "Unknown",
      invoice.status,
      invoice.subtotal,
      invoice.tax_amount,
      invoice.total_amount,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `invoice-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <h1 className="text-2xl font-bold tracking-tight">Invoice Reports</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={exportToCSV}
          disabled={filteredInvoices.length === 0}
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium">Filters</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label
              htmlFor="date-from"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              From Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="date-from"
                type="date"
                className="pl-10"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="date-to"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              To Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="date-to"
                type="date"
                className="pl-10"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="client"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Client
            </label>
            <select
              id="client"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              value={clientFilter === "all" ? "all" : clientFilter}
              onChange={(e) =>
                setClientFilter(
                  e.target.value === "all" ? "all" : parseInt(e.target.value)
                )
              }
            >
              <option value="all">All Clients</option>
              {clients.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={handleFilterChange}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Summary */}
      <InvoiceSummary invoices={filteredInvoices} />

      {/* Charts Section - Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart4 className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium">Monthly Revenue</h2>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <PieChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Monthly revenue chart would be displayed here</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium">Payment Trends</h2>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <LineChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Payment trend chart would be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium">Invoice List</h2>
        </div>

        {filteredInvoices.length === 0 ? (
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
                    onClick={() => handleSortChange("invoice_number")}
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
                    onClick={() => handleSortChange("issue_date")}
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
                    onClick={() => handleSortChange("status")}
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
                    onClick={() => handleSortChange("total_amount")}
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
                {filteredInvoices.map((invoice) => {
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
