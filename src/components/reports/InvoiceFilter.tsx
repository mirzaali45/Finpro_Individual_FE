// src/components/dashboard/reports/InvoiceFilter.tsx
"use client";

import { Client } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Calendar } from "lucide-react";

interface InvoiceFilterProps {
  clients: Client[];
  dateRange: { start: string; end: string };
  setDateRange: (dateRange: { start: string; end: string }) => void;
  clientFilter: number | "all";
  setClientFilter: (clientFilter: number | "all") => void;
  statusFilter: string | "all";
  setStatusFilter: (statusFilter: string | "all") => void;
  onApplyFilters: () => void;
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
}: InvoiceFilterProps) {
  return (
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
          onClick={onApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
