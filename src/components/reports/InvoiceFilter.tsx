// src/components/dashboard/reports/InvoiceFilter.tsx
"use client";

import { Client } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Calendar, X } from "lucide-react";
import { useEffect } from "react";

interface InvoiceFilterProps {
  clients: Client[];
  dateRange: { start: string; end: string };
  setDateRange: (dateRange: { start: string; end: string }) => void;
  clientFilter: number | "all";
  setClientFilter: (clientFilter: number | "all") => void;
  statusFilter: string | "all";
  setStatusFilter: (statusFilter: string | "all") => void;
  onApplyFilters: () => void;
  updateQueryParams: () => void;
}

export default function InvoiceFilter({
  clients,
  dateRange,
  setDateRange,
  clientFilter,
  setClientFilter,
  statusFilter,
  setStatusFilter,
  onApplyFilters,
  updateQueryParams,
}: InvoiceFilterProps) {
  // Apply filters immediately when date changes
  const handleDateChange = (field: "start" | "end", value: string) => {
    setDateRange({
      ...dateRange,
      [field]: value,
    });
  };

  // Apply filters immediately when client changes
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setClientFilter(value === "all" ? "all" : parseInt(value));
  };

  // Apply filters immediately when status changes
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // Reset filters to default values
  const handleResetFilters = () => {
    setDateRange({
      start: new Date(new Date().setMonth(new Date().getMonth() - 3))
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    });
    setClientFilter("all");
    setStatusFilter("all");

    // Force immediate application of filters
    setTimeout(() => {
      onApplyFilters();
      updateQueryParams();
    }, 0);
  };

  // Apply filters and update URL when form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters();
    updateQueryParams();
  };

  // Check if any filter is active
  const hasActiveFilters =
    clientFilter !== "all" ||
    statusFilter !== "all" ||
    dateRange.start !==
      new Date(new Date().setMonth(new Date().getMonth() - 3))
        .toISOString()
        .split("T")[0] ||
    dateRange.end !== new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium">Filters</h2>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Reset Filters
          </Button>
        )}
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
              onChange={(e) => handleDateChange("start", e.target.value)}
              max={dateRange.end}
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
              onChange={(e) => handleDateChange("end", e.target.value)}
              min={dateRange.start}
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
            onChange={handleClientChange}
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
            onChange={handleStatusChange}
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
        <Button type="submit" variant="outline" className="w-full md:w-auto">
          Apply Filters
        </Button>
      </div>
    </form>
  );
}
