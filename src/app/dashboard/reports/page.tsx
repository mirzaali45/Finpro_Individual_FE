// // src/app/dashboard/reports/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { invoiceApi, clientApi } from "@/lib/api";
// import { Invoice, Client } from "@/types";
// import InvoiceSummary from "@/components/dashboard/invoicesummery";
// import ReportsCharts from "@/components/reports/RepostsChart";
// import InvoiceFilter from "@/components/reports/InvoiceFilter";
// import InvoiceList from "@/components/reports/InvoiceList";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";
// import { exportInvoicesToCSV } from "@/lib/exportUtils";
// import { useInvoiceFiltering } from "@/components/reports/hooks/useInvoiceFiltering";

// export default function ReportsPage() {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Use custom hook for filtering logic
//   const {
//     filteredInvoices,
//     dateRange,
//     setDateRange,
//     clientFilter,
//     setClientFilter,
//     statusFilter,
//     setStatusFilter,
//     sortField,
//     sortDirection,
//     handleFilterChange,
//     handleSortChange,
//   } = useInvoiceFiltering(invoices);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [invoicesData, clientsData] = await Promise.all([
//           invoiceApi.getInvoices(),
//           clientApi.getClients(),
//         ]);

//         setInvoices(invoicesData);
//         setClients(clientsData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold tracking-tight">Invoice Reports</h1>
//         <Button
//           variant="outline"
//           className="flex items-center gap-2"
//           onClick={() => exportInvoicesToCSV(filteredInvoices)}
//           disabled={filteredInvoices.length === 0}
//         >
//           <Download className="h-4 w-4" />
//           Export to CSV
//         </Button>
//       </div>

//       {/* Filters */}
//       <InvoiceFilter
//         clients={clients}
//         dateRange={dateRange}
//         setDateRange={setDateRange}
//         clientFilter={clientFilter}
//         setClientFilter={setClientFilter}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//         onApplyFilters={handleFilterChange}
//       />

//       {/* Summary */}
//       <InvoiceSummary invoices={filteredInvoices} />

//       {/* Charts */}
//       <ReportsCharts invoices={filteredInvoices} />

//       {/* Invoice List */}
//       <InvoiceList
//         invoices={filteredInvoices}
//         sortField={sortField}
//         sortDirection={sortDirection}
//         onSortChange={handleSortChange}
//       />
//     </div>
//   );
// }
// src/app/dashboard/reports/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { invoiceApi, clientApi } from "@/lib/api";
import { Invoice, Client } from "@/types";
import InvoiceSummary from "@/components/dashboard/invoicesummery";
import ReportsCharts from "@/components/reports/RepostsChart";
import InvoiceFilter from "@/components/reports/InvoiceFilter";
import InvoiceList from "@/components/reports/InvoiceList";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportInvoicesToCSV } from "@/lib/exportUtils";
import { useInvoiceFiltering } from "@/components/reports/hooks/useInvoiceFiltering";

const ITEMS_PER_PAGE = 10;

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse query parameters
  const getQueryParam = useCallback(
    (key: string, defaultValue: string): string => {
      const value = searchParams.get(key);
      return value !== null ? value : defaultValue;
    },
    [searchParams]
  );

  // Initialize with URL parameters
  const initialStartDate = getQueryParam(
    "start_date",
    new Date(new Date().setMonth(new Date().getMonth() - 3))
      .toISOString()
      .split("T")[0]
  );
  const initialEndDate = getQueryParam(
    "end_date",
    new Date().toISOString().split("T")[0]
  );
  const initialClientFilter = getQueryParam("client_id", "all");
  const initialStatusFilter = getQueryParam("status", "all");
  const initialPage = parseInt(getQueryParam("page", "1"), 10);
  const initialSortField = getQueryParam("sort_field", "issue_date");
  const initialSortDirection = getQueryParam("sort_dir", "desc") as
    | "asc"
    | "desc";

  // For pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedInvoices, setPaginatedInvoices] = useState<Invoice[]>([]);

  // Use custom hook for filtering logic with initial values from URL
  const {
    filteredInvoices,
    dateRange,
    setDateRange,
    clientFilter,
    setClientFilter,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleFilterChange,
    handleSortChange,
  } = useInvoiceFiltering(
    invoices,
    {
      start: initialStartDate,
      end: initialEndDate,
    },
    initialClientFilter === "all" ? "all" : parseInt(initialClientFilter),
    initialStatusFilter,
    initialSortField,
    initialSortDirection
  );

  // Update URL with query parameters
  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    // Add all filter parameters
    params.set("start_date", dateRange.start);
    params.set("end_date", dateRange.end);
    if (clientFilter !== "all")
      params.set("client_id", clientFilter.toString());
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (sortField !== "issue_date") params.set("sort_field", sortField);
    if (sortDirection !== "desc") params.set("sort_dir", sortDirection);

    // Update URL without full page reload
    router.replace(
      `/dashboard/reports${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false }
    );
  }, [
    dateRange,
    clientFilter,
    statusFilter,
    currentPage,
    sortField,
    sortDirection,
    router,
  ]);

  // Update URL when filter parameters change
  useEffect(() => {
    updateQueryParams();
  }, [
    dateRange,
    clientFilter,
    statusFilter,
    currentPage,
    sortField,
    sortDirection,
    updateQueryParams,
  ]);

  // Fetch data on component mount
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update pagination when filtered invoices change
  useEffect(() => {
    if (filteredInvoices.length === 0) {
      setPaginatedInvoices([]);
      setTotalPages(1);
      return;
    }

    const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
    setTotalPages(totalPages);

    // Ensure current page is valid
    const validPage = Math.min(Math.max(1, currentPage), totalPages);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
      return;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedInvoices(filteredInvoices.slice(startIndex, endIndex));
  }, [filteredInvoices, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Apply filters and reset to first page
  const applyFilters = () => {
    handleFilterChange();
    setCurrentPage(1);
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
          onClick={() => exportInvoicesToCSV(filteredInvoices)}
          disabled={filteredInvoices.length === 0}
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <InvoiceFilter
        clients={clients}
        dateRange={dateRange}
        setDateRange={setDateRange}
        clientFilter={clientFilter}
        setClientFilter={setClientFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onApplyFilters={applyFilters}
        updateQueryParams={updateQueryParams}
      />

      {/* Summary */}
      <InvoiceSummary invoices={filteredInvoices} />

      {/* Charts */}
      <ReportsCharts invoices={filteredInvoices} />

      {/* Invoice List with Pagination */}
      <InvoiceList
        invoices={paginatedInvoices}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredInvoices.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
