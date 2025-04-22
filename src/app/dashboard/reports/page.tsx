// src/app/dashboard/reports/page.tsx
"use client";

import { useState, useEffect } from "react";
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

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use custom hook for filtering logic
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
    applyFilters,
    handleFilterChange,
    handleSortChange,
  } = useInvoiceFiltering(invoices);

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
        onApplyFilters={handleFilterChange}
      />

      {/* Summary */}
      <InvoiceSummary invoices={filteredInvoices} />

      {/* Charts */}
      <ReportsCharts invoices={filteredInvoices} />

      {/* Invoice List */}
      <InvoiceList
        invoices={filteredInvoices}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
