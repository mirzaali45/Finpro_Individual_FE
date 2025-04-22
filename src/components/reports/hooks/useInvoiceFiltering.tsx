// src/hooks/useInvoiceFiltering.ts
import { useState, useEffect } from "react";
import { Invoice } from "@/types";

export function useInvoiceFiltering(allInvoices: Invoice[]) {
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

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

  // Apply filters when invoices change
  useEffect(() => {
    if (allInvoices.length > 0) {
      applyFilters(
        allInvoices,
        dateRange,
        clientFilter,
        statusFilter,
        sortField,
        sortDirection
      );
    } else {
      setFilteredInvoices([]);
    }
  }, [allInvoices]);

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
      allInvoices,
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
      allInvoices,
      dateRange,
      clientFilter,
      statusFilter,
      field,
      newDirection
    );
  };

  return {
    filteredInvoices,
    dateRange,
    setDateRange,
    clientFilter,
    setClientFilter,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    applyFilters,
    handleFilterChange,
    handleSortChange,
  };
}
