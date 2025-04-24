//src/app/dashboard/invoices/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { invoiceApi, clientApi, authApi } from "@/lib/api";
import { Invoice, InvoiceStatus, Client, BankAccount, EWallet } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowUpDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
} from "lucide-react";
import { useDebounce } from "@/components/hooks/useDebounce";
import InvoiceFilters from "@/components/invoices/InvoiceFilter";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 10;

export default function InvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [eWallets, setEWallets] = useState<EWallet[]>([]);
  const [showPaymentMethodAlert, setShowPaymentMethodAlert] = useState(false);
  const [noPaymentMethodsDialog, setNoPaymentMethodsDialog] = useState(false);

  // Get query parameters with defaults
  const initialSearchTerm = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") as InvoiceStatus | null;
  const initialClientId = searchParams.get("client_id") || "ALL";
  const initialDateFilter = searchParams.get("date_range") || "all";
  const initialStartDate = searchParams.get("start_date") || null;
  const initialEndDate = searchParams.get("end_date") || null;
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSortField = searchParams.get("sort_field") || "issue_date";
  const initialSortDirection =
    (searchParams.get("sort_dir") as "asc" | "desc") || "desc";

  // Search and filters
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">(
    initialStatus || "ALL"
  );
  const [clientFilter, setClientFilter] = useState<number | "ALL">(
    initialClientId === "ALL" ? "ALL" : parseInt(initialClientId)
  );
  const [dateFilter, setDateFilter] = useState<
    "all" | "30days" | "90days" | "custom"
  >(initialDateFilter as "all" | "30days" | "90days" | "custom");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedInvoices, setPaginatedInvoices] = useState<Invoice[]>([]);

  // Sorting
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSortDirection
  );

  // Status colors for the badge
  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  // Update URL with query parameters
  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter !== "ALL")
      params.set("status", statusFilter.toLowerCase());
    if (clientFilter !== "ALL")
      params.set("client_id", clientFilter.toString());
    if (dateFilter !== "all") params.set("date_range", dateFilter);
    if (dateFilter === "custom") {
      if (customDateRange.startDate)
        params.set("start_date", customDateRange.startDate);
      if (customDateRange.endDate)
        params.set("end_date", customDateRange.endDate);
    }
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (sortField !== "issue_date") params.set("sort_field", sortField);
    if (sortDirection !== "desc") params.set("sort_dir", sortDirection);

    const queryString = params.toString();
    router.push(`/dashboard/invoices${queryString ? `?${queryString}` : ""}`);
  }, [
    searchTerm,
    statusFilter,
    clientFilter,
    dateFilter,
    customDateRange,
    currentPage,
    sortField,
    sortDirection,
    router,
  ]);

  // Check if payment methods are available
  const checkPaymentMethods = async () => {
    try {
      const profileData = await authApi.getProfile();
      if (profileData && profileData.user) {
        // Get bank accounts and e-wallets
        const accounts = profileData.profile?.bank_accounts || [];
        const wallets = profileData.profile?.e_wallets || [];

        setBankAccounts(accounts);
        setEWallets(wallets);

        // Show alert if no payment methods
        if (accounts.length === 0 && wallets.length === 0) {
          setShowPaymentMethodAlert(true);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Fetch invoices and clients data
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

        // Fetch payment methods
        await checkPaymentMethods();
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to check if a date string is in the format MM/YYYY
  const isMonthYearFormat = (value: string): boolean => {
    return /^(0?[1-9]|1[0-2])\/\d{4}$/.test(value);
  };

  // Helper function to extract month and year from MM/YYYY format
  const extractMonthYear = (
    value: string
  ): { month: number; year: number } | null => {
    const parts = value.split("/");
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12) {
        return { month, year };
      }
    }
    return null;
  };

  // Filter and sort invoices when dependencies change
  useEffect(() => {
    if (invoices.length === 0) return;

    let filtered = [...invoices];

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    // Apply client filter
    if (clientFilter !== "ALL") {
      filtered = filtered.filter(
        (invoice) => invoice.client_id === clientFilter
      );
    }

    // Apply date filter
    if (dateFilter === "30days") {
      const now = new Date();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);

      filtered = filtered.filter((invoice) => {
        const issueDate = new Date(invoice.issue_date);
        return issueDate >= pastDate && issueDate <= now;
      });
    } else if (dateFilter === "90days") {
      const now = new Date();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 90);

      filtered = filtered.filter((invoice) => {
        const issueDate = new Date(invoice.issue_date);
        return issueDate >= pastDate && issueDate <= now;
      });
    } else if (
      dateFilter === "custom" &&
      (customDateRange.startDate || customDateRange.endDate)
    ) {
      if (customDateRange.startDate) {
        const startDate = new Date(customDateRange.startDate);
        filtered = filtered.filter((invoice) => {
          const issueDate = new Date(invoice.issue_date);
          return issueDate >= startDate;
        });
      }

      if (customDateRange.endDate) {
        const endDate = new Date(customDateRange.endDate);
        // Set to end of day
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter((invoice) => {
          const issueDate = new Date(invoice.issue_date);
          return issueDate <= endDate;
        });
      }
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();

      // Check if search is in MM/YYYY format for month search
      if (isMonthYearFormat(searchTerm)) {
        const monthYear = extractMonthYear(searchTerm);
        if (monthYear) {
          filtered = filtered.filter((invoice) => {
            const issueDate = new Date(invoice.issue_date);
            return (
              issueDate.getMonth() + 1 === monthYear.month &&
              issueDate.getFullYear() === monthYear.year
            );
          });
        }
      } else {
        // Regular search
        filtered = filtered.filter(
          (invoice) =>
            invoice.invoice_number.toLowerCase().includes(searchLower) ||
            (invoice.client?.name &&
              invoice.client.name.toLowerCase().includes(searchLower)) ||
            (invoice.client?.email &&
              invoice.client.email.toLowerCase().includes(searchLower)) ||
            invoice.issue_date.includes(searchLower) ||
            invoice.due_date.includes(searchLower)
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      // Type-safe sort function
      if (sortField === "client_name") {
        const aName = a.client?.name || "";
        const bName = b.client?.name || "";
        return sortDirection === "asc"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      } else if (sortField === "issue_date" || sortField === "due_date") {
        const aDate = new Date(
          a[sortField as keyof Invoice] as string
        ).getTime();
        const bDate = new Date(
          b[sortField as keyof Invoice] as string
        ).getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      } else if (sortField === "total_amount") {
        const aAmount = Number(a.total_amount);
        const bAmount = Number(b.total_amount);
        return sortDirection === "asc" ? aAmount - bAmount : bAmount - aAmount;
      } else {
        // For other fields like invoice_number or status
        const aValue = String(a[sortField as keyof Invoice] || "");
        const bValue = String(b[sortField as keyof Invoice] || "");
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

    setFilteredInvoices(filtered);
  }, [
    invoices,
    debouncedSearchTerm,
    statusFilter,
    clientFilter,
    dateFilter,
    customDateRange,
    sortField,
    sortDirection,
    currentPage,
    updateQueryParams,
    searchTerm,
  ]);

  // Update paginated results when filtered invoices or current page changes
  useEffect(() => {
    if (filteredInvoices.length === 0) {
      setPaginatedInvoices([]);
      setTotalPages(1);
      return;
    }

    const total = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
    setTotalPages(total);

    // Adjust current page if it's out of bounds
    const validPage = Math.min(Math.max(1, currentPage), total);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
      return;
    }

    const start = (validPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedItems = filteredInvoices.slice(start, end);
    setPaginatedInvoices(paginatedItems);
  }, [filteredInvoices, currentPage]);

  // Update URL when page changes
  useEffect(() => {
    updateQueryParams();
  }, [currentPage, updateQueryParams]);

  // Sync search term with debounced value
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when changing search
  };

  const handleStatusFilterChange = (status: InvoiceStatus | "ALL") => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleClientFilterChange = (clientId: number | "ALL") => {
    setClientFilter(clientId);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleDateFilterChange = (
    value: "all" | "30days" | "90days" | "custom"
  ) => {
    setDateFilter(value);
    // Only reset custom date range if not selecting custom
    if (value !== "custom") {
      setCustomDateRange({ startDate: null, endDate: null });
    }
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleCustomDateRangeChange = (range: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    setCustomDateRange(range);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setClientFilter("ALL");
    setDateFilter("all");
    setCustomDateRange({ startDate: null, endDate: null });
    setCurrentPage(1);
    setSortField("issue_date");
    setSortDirection("desc");
  };

  const handleSort = (field: string) => {
    const newDirection =
      field === sortField && sortDirection === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateInvoice = () => {
    if (bankAccounts.length === 0 && eWallets.length === 0) {
      setNoPaymentMethodsDialog(true);
    } else {
      router.push("/dashboard/invoices/new");
    }
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
        <Button onClick={handleCreateInvoice}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* No Payment Methods Dialog */}
      <Dialog
        open={noPaymentMethodsDialog}
        onOpenChange={setNoPaymentMethodsDialog}
      >
        <DialogContent>
          <DialogTitle>Payment Methods Required</DialogTitle>
          <DialogDescription>
            You need to add at least one payment method (bank account or
            e-wallet) to your profile before creating invoices. This allows
            clients to know how to pay you.
          </DialogDescription>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded my-4">
            <p>
              Without payment methods, clients won&apos;t know how to pay your
              invoices.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoPaymentMethodsDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => router.push("/dashboard/profile")}>
              Add Payment Methods
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Alert */}
      {showPaymentMethodAlert && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">No payment methods available</p>
            <p className="mt-1">
              You need to add at least one payment method in your profile
              settings before creating invoices or recording payments.
            </p>
            <div className="mt-2 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/profile")}
              >
                Go to Profile Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPaymentMethodAlert(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <InvoiceFilters
        clients={clients}
        statusFilter={statusFilter}
        clientFilter={clientFilter}
        dateFilter={dateFilter}
        customDateRange={customDateRange}
        searchTerm={searchTerm}
        onStatusFilterChange={handleStatusFilterChange}
        onClientFilterChange={handleClientFilterChange}
        onDateFilterChange={handleDateFilterChange}
        onCustomDateRangeChange={handleCustomDateRangeChange}
        onSearchChange={handleSearch}
        onClearFilters={handleClearFilters}
        updateQueryParams={updateQueryParams}
      />

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
              dateFilter !== "all" ||
              customDateRange.startDate ||
              customDateRange.endDate ? (
                <>
                  No invoices match your current filters. Try adjusting your
                  search criteria.
                </>
              ) : (
                <>
                  You haven&apos;t created any invoices yet. Create your first
                  invoice to get started.
                </>
              )}
            </p>
            {!searchTerm &&
              statusFilter === "ALL" &&
              clientFilter === "ALL" &&
              dateFilter === "all" &&
              !customDateRange.startDate &&
              !customDateRange.endDate && (
                <div className="mt-4">
                  <Button onClick={handleCreateInvoice}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Invoice
                  </Button>
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
                {paginatedInvoices.map((invoice) => (
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

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {paginatedInvoices.length > 0
                      ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                      : 0}
                  </span>
                  {" to "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredInvoices.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredInvoices.length}</span>{" "}
                  invoices
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      currentPage === 1
                        ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">First Page</span>
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border ${
                      currentPage === 1
                        ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;

                    // Calculate which page numbers to show
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    if (pageNumber > 0 && pageNumber <= totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === pageNumber
                              ? "z-10 bg-primary border-primary text-white"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border ${
                      currentPage === totalPages
                        ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      currentPage === totalPages
                        ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Last Page</span>
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
