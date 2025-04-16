//src/app/dashboard/invoices/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { invoiceApi, clientApi } from "@/lib/api";
import { Invoice, InvoiceStatus, Client } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, ArrowUpDown, FileText } from "lucide-react";

export default function InvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">(
    () => (searchParams.get("status")?.toUpperCase() as InvoiceStatus) || "ALL"
  );
  const [clientFilter, setClientFilter] = useState<number | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<"all" | "30days" | "90days">(
    "all"
  );

  // Sorting
  const [sortField, setSortField] = useState<string>("issue_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Status colors for the badge
  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

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

        // Apply initial filters based on URL parameters
        const initialStatus = searchParams
          .get("status")
          ?.toUpperCase() as InvoiceStatus;
        if (initialStatus) {
          setStatusFilter(initialStatus);
          filterInvoices(
            invoicesData,
            searchTerm,
            initialStatus,
            clientFilter,
            dateFilter,
            sortField,
            sortDirection
          );
        } else {
          filterInvoices(
            invoicesData,
            searchTerm,
            statusFilter,
            clientFilter,
            dateFilter,
            sortField,
            sortDirection
          );
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const filterInvoices = (
    data: Invoice[],
    search: string,
    status: InvoiceStatus | "ALL",
    client: number | "ALL",
    dateRange: string,
    sort: string,
    direction: "asc" | "desc"
  ) => {
    let filtered = [...data];

    // Apply status filter
    if (status !== "ALL") {
      filtered = filtered.filter((invoice) => invoice.status === status);
    }

    // Apply client filter
    if (client !== "ALL") {
      filtered = filtered.filter((invoice) => invoice.client_id === client);
    }

    // Apply date filter
    if (dateRange !== "all") {
      const now = new Date();
      const pastDate = new Date();

      if (dateRange === "30days") {
        pastDate.setDate(pastDate.getDate() - 30);
      } else if (dateRange === "90days") {
        pastDate.setDate(pastDate.getDate() - 90);
      }

      filtered = filtered.filter((invoice) => {
        const issueDate = new Date(invoice.issue_date);
        return issueDate >= pastDate && issueDate <= now;
      });
    }

    // Apply search filter
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_number.toLowerCase().includes(searchLower) ||
          invoice.client?.name.toLowerCase().includes(searchLower) ||
          invoice.client?.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      if (sort === "client_name") {
        aValue = a.client?.name || "";
        bValue = b.client?.name || "";
      } else if (sort === "issue_date" || sort === "due_date") {
        aValue = new Date(a[sort as keyof Invoice] as string).getTime();
        bValue = new Date(b[sort as keyof Invoice] as string).getTime();
      } else if (sort === "total_amount") {
        aValue = Number(a.total_amount);
        bValue = Number(b.total_amount);
      } else {
        aValue = a[sort as keyof Invoice];
        bValue = b[sort as keyof Invoice];
      }

      if (direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInvoices(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterInvoices(
      invoices,
      e.target.value,
      statusFilter,
      clientFilter,
      dateFilter,
      sortField,
      sortDirection
    );
  };

  const handleStatusFilterChange = (status: InvoiceStatus | "ALL") => {
    setStatusFilter(status);
    filterInvoices(
      invoices,
      searchTerm,
      status,
      clientFilter,
      dateFilter,
      sortField,
      sortDirection
    );

    // Update URL
    if (status === "ALL") {
      router.push("/dashboard/invoices");
    } else {
      router.push(`/dashboard/invoices?status=${status.toLowerCase()}`);
    }
  };

  const handleClientFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value === "ALL" ? "ALL" : parseInt(e.target.value);
    setClientFilter(value);
    filterInvoices(
      invoices,
      searchTerm,
      statusFilter,
      value,
      dateFilter,
      sortField,
      sortDirection
    );
  };

  const handleDateFilterChange = (value: "all" | "30days" | "90days") => {
    setDateFilter(value);
    filterInvoices(
      invoices,
      searchTerm,
      statusFilter,
      clientFilter,
      value,
      sortField,
      sortDirection
    );
  };

  const handleSort = (field: string) => {
    const newDirection =
      field === sortField && sortDirection === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortDirection(newDirection);
    filterInvoices(
      invoices,
      searchTerm,
      statusFilter,
      clientFilter,
      dateFilter,
      field,
      newDirection
    );
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
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <Link href="/dashboard/invoices/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search invoices..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilterChange("ALL")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                  statusFilter === "ALL"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilterChange("PENDING")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                  statusFilter === "PENDING"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusFilterChange("PAID")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                  statusFilter === "PAID"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => handleStatusFilterChange("OVERDUE")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                  statusFilter === "OVERDUE"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                }`}
              >
                Overdue
              </button>
              <button
                onClick={() => handleStatusFilterChange("DRAFT")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                  statusFilter === "DRAFT"
                    ? "bg-gray-600 text-white border-gray-600"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="client-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Client
            </label>
            <select
              id="client-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              value={clientFilter === "ALL" ? "ALL" : clientFilter}
              onChange={handleClientFilterChange}
            >
              <option value="ALL">All Clients</option>
              {clients.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleDateFilterChange("all")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
                  dateFilter === "all"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => handleDateFilterChange("30days")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
                  dateFilter === "30days"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => handleDateFilterChange("90days")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
                  dateFilter === "90days"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Last 90 Days
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{filteredInvoices.length}</span>{" "}
              invoice{filteredInvoices.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </div>

      {/* Invoice list */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium">Invoice List</h2>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-sm text-gray-500">
              {searchTerm ||
              statusFilter !== "ALL" ||
              clientFilter !== "ALL" ||
              dateFilter !== "all" ? (
                <>
                  No invoices match your current filters. Try adjusting your
                  search criteria.
                </>
              ) : (
                <>
                  You haven't created any invoices yet. Create your first
                  invoice to get started.
                </>
              )}
            </p>
            {!searchTerm &&
              statusFilter === "ALL" &&
              clientFilter === "ALL" &&
              dateFilter === "all" && (
                <div className="mt-4">
                  <Link href="/dashboard/invoices/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Invoice
                    </Button>
                  </Link>
                </div>
              )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("invoice_number")}
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
                    onClick={() => handleSort("issue_date")}
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("client_name")}
                  >
                    <div className="flex items-center">
                      Client
                      {sortField === "client_name" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("due_date")}
                  >
                    <div className="flex items-center">
                      Due Date
                      {sortField === "due_date" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("total_amount")}
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      <Link href={`/dashboard/invoices/${invoice.invoice_id}`}>
                        {invoice.invoice_number}
                      </Link>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.due_date)}
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
    </div>
  );
}
