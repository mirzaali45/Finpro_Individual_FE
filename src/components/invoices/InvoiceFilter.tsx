// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Filter, Search, X } from "lucide-react";
// import { InvoiceStatus, Client } from "@/types";

// interface InvoiceFiltersProps {
//   clients: Client[];
//   statusFilter: InvoiceStatus | "ALL";
//   clientFilter: number | "ALL";
//   dateFilter: string;
//   searchTerm: string;
//   onStatusFilterChange: (status: InvoiceStatus | "ALL") => void;
//   onClientFilterChange: (clientId: number | "ALL") => void;
//   onDateFilterChange: (range: string) => void;
//   onSearchChange: (term: string) => void;
//   onClearFilters: () => void;
// }

// export default function InvoiceFilters({
//   clients,
//   statusFilter,
//   clientFilter,
//   dateFilter,
//   searchTerm,
//   onStatusFilterChange,
//   onClientFilterChange,
//   onDateFilterChange,
//   onSearchChange,
//   onClearFilters,
// }: InvoiceFiltersProps) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const hasActiveFilters =
//     statusFilter !== "ALL" ||
//     clientFilter !== "ALL" ||
//     dateFilter !== "all" ||
//     searchTerm !== "";

//   return (
//     <div className="bg-white shadow rounded-lg">
//       {/* Basic search bar and toggle */}
//       <div className="p-4 flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-grow">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search className="h-5 w-5 text-gray-400" />
//           </div>
//           <Input
//             type="text"
//             placeholder="Search invoices..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e.target.value)}
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             type="button"
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="whitespace-nowrap"
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             {isExpanded ? "Hide Filters" : "Show Filters"}
//           </Button>

//           {hasActiveFilters && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={onClearFilters}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X className="h-4 w-4 mr-1" />
//               Clear
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Status filter row - always visible */}
//       <div className="px-4 pb-4">
//         <div className="flex items-center gap-2 mb-2">
//           <span className="text-sm font-medium text-gray-700">Status:</span>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => onStatusFilterChange("ALL")}
//             className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
//               statusFilter === "ALL"
//                 ? "bg-primary text-white border-primary"
//                 : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//             }`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => onStatusFilterChange("PENDING")}
//             className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
//               statusFilter === "PENDING"
//                 ? "bg-blue-600 text-white border-blue-600"
//                 : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
//             }`}
//           >
//             Pending
//           </button>
//           <button
//             onClick={() => onStatusFilterChange("PAID")}
//             className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
//               statusFilter === "PAID"
//                 ? "bg-green-600 text-white border-green-600"
//                 : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
//             }`}
//           >
//             Paid
//           </button>
//           <button
//             onClick={() => onStatusFilterChange("OVERDUE")}
//             className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
//               statusFilter === "OVERDUE"
//                 ? "bg-red-600 text-white border-red-600"
//                 : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
//             }`}
//           >
//             Overdue
//           </button>
//           <button
//             onClick={() => onStatusFilterChange("DRAFT")}
//             className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
//               statusFilter === "DRAFT"
//                 ? "bg-gray-600 text-white border-gray-600"
//                 : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
//             }`}
//           >
//             Draft
//           </button>
//         </div>
//       </div>

//       {/* Advanced filters - expandable */}
//       {isExpanded && (
//         <div className="px-4 pb-4 pt-2 border-t border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label
//                 htmlFor="client-filter"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Client
//               </label>
//               <select
//                 id="client-filter"
//                 className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
//                 value={clientFilter === "ALL" ? "ALL" : clientFilter}
//                 onChange={(e) =>
//                   onClientFilterChange(
//                     e.target.value === "ALL" ? "ALL" : parseInt(e.target.value)
//                   )
//                 }
//               >
//                 <option value="ALL">All Clients</option>
//                 {clients.map((client) => (
//                   <option key={client.client_id} value={client.client_id}>
//                     {client.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date Range
//               </label>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => onDateFilterChange("all")}
//                   className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
//                     dateFilter === "all"
//                       ? "bg-primary text-white border-primary"
//                       : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                   }`}
//                 >
//                   All Time
//                 </button>
//                 <button
//                   onClick={() => onDateFilterChange("30days")}
//                   className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
//                     dateFilter === "30days"
//                       ? "bg-primary text-white border-primary"
//                       : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                   }`}
//                 >
//                   Last 30 Days
//                 </button>
//                 <button
//                   onClick={() => onDateFilterChange("90days")}
//                   className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
//                     dateFilter === "90days"
//                       ? "bg-primary text-white border-primary"
//                       : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                   }`}
//                 >
//                   Last 90 Days
//                 </button>
//               </div>
//             </div>

//             {/* Custom date range - could be added as an enhancement */}
//             {/* <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
//                   From Date
//                 </label>
//                 <Input
//                   id="start-date"
//                   type="date"
//                   className="w-full"
//                   // Additional implementation required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
//                   To Date
//                 </label>
//                 <Input
//                   id="end-date"
//                   type="date"
//                   className="w-full"
//                   // Additional implementation required
//                 />
//               </div>
//             </div> */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, X, Calendar } from "lucide-react";
import { InvoiceStatus, Client } from "@/types";

interface InvoiceFiltersProps {
  clients: Client[];
  statusFilter: InvoiceStatus | "ALL";
  clientFilter: number | "ALL";
  dateFilter: "all" | "30days" | "90days" | "custom"; // Diubah untuk memastikan spesifik
  searchTerm: string;
  customDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  onStatusFilterChange: (status: InvoiceStatus | "ALL") => void;
  onClientFilterChange: (clientId: number | "ALL") => void;
  onDateFilterChange: (range: "all" | "30days" | "90days" | "custom") => void; // Diubah untuk memastikan spesifik
  onCustomDateRangeChange: (range: { startDate: string | null; endDate: string | null }) => void;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
  updateQueryParams: () => void; // Add this to trigger query params update
}

export default function InvoiceFilters({
  clients,
  statusFilter,
  clientFilter,
  dateFilter,
  customDateRange,
  searchTerm,
  onStatusFilterChange,
  onClientFilterChange,
  onDateFilterChange,
  onCustomDateRangeChange,
  onSearchChange,
  onClearFilters,
  updateQueryParams,
}: InvoiceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomDateRange, setShowCustomDateRange] = useState(dateFilter === "custom");
  const [localStartDate, setLocalStartDate] = useState(customDateRange.startDate || "");
  const [localEndDate, setLocalEndDate] = useState(customDateRange.endDate || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Initialize expanded state based on active filters
  useEffect(() => {
    if (clientFilter !== "ALL" || (dateFilter !== "all" && dateFilter !== "30days" && dateFilter !== "90days") || customDateRange.startDate || customDateRange.endDate) {
      setIsExpanded(true);
    }
    
    if (dateFilter === "custom") {
      setShowCustomDateRange(true);
    }
  }, [clientFilter, dateFilter, customDateRange]);

  // Handle search term debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(debouncedSearchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearchTerm, onSearchChange]);

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    clientFilter !== "ALL" ||
    dateFilter !== "all" ||
    customDateRange.startDate !== null ||
    customDateRange.endDate !== null ||
    searchTerm !== "";

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearchTerm(e.target.value);
  };

  const handleDateOptionChange = (option: "all" | "30days" | "90days" | "custom") => {
    onDateFilterChange(option);
    if (option === "custom") {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      onCustomDateRangeChange({ startDate: null, endDate: null });
    }
    
    // Update query params
    setTimeout(updateQueryParams, 0);
  };

  const handleCustomDateChange = () => {
    onCustomDateRangeChange({
      startDate: localStartDate || null,
      endDate: localEndDate || null
    });
    
    // Ensure we're in custom date mode
    if (dateFilter !== "custom") {
      onDateFilterChange("custom");
    }

    // Update query params
    setTimeout(updateQueryParams, 0);
  };

  const handleClearFilters = () => {
    setLocalStartDate("");
    setLocalEndDate("");
    setDebouncedSearchTerm("");
    onClearFilters();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Basic search bar and toggle */}
      <div className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search invoices (number, client, date: YYYY-MM-DD, month: MM/YYYY)..."
            className="pl-10"
            value={debouncedSearchTerm}
            onChange={handleSearchInputChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            {isExpanded ? "Hide Filters" : "Show Filters"}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Status filter row - always visible */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              onStatusFilterChange("ALL");
              setTimeout(updateQueryParams, 0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
              statusFilter === "ALL"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              onStatusFilterChange("PENDING");
              setTimeout(updateQueryParams, 0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
              statusFilter === "PENDING"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              onStatusFilterChange("PAID");
              setTimeout(updateQueryParams, 0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
              statusFilter === "PAID"
                ? "bg-green-600 text-white border-green-600"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => {
              onStatusFilterChange("OVERDUE");
              setTimeout(updateQueryParams, 0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
              statusFilter === "OVERDUE"
                ? "bg-red-600 text-white border-red-600"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            }`}
          >
            Overdue
          </button>
          <button
            onClick={() => {
              onStatusFilterChange("DRAFT");
              setTimeout(updateQueryParams, 0);
            }}
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

      {/* Advanced filters - expandable */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onChange={(e) => {
                  const value = e.target.value;
                  onClientFilterChange(
                    value === "ALL" ? "ALL" : parseInt(value)
                  );
                  setTimeout(updateQueryParams, 0);
                }}
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
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDateOptionChange("all")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
                    dateFilter === "all"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => handleDateOptionChange("30days")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
                    dateFilter === "30days"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => handleDateOptionChange("90days")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
                    dateFilter === "90days"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Last 90 Days
                </button>
                <button
                  onClick={() => handleDateOptionChange("custom")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded border ${
                    dateFilter === "custom"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>

            {/* Custom date range */}
            {showCustomDateRange && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <Input
                    id="start-date"
                    type="date"
                    className="w-full"
                    value={localStartDate}
                    onChange={(e) => setLocalStartDate(e.target.value)}
                    max={localEndDate || undefined}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <Input
                    id="end-date"
                    type="date"
                    className="w-full"
                    value={localEndDate}
                    onChange={(e) => setLocalEndDate(e.target.value)}
                    min={localStartDate || undefined}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCustomDateChange}
                    className="mt-2"
                    disabled={!localStartDate && !localEndDate}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Apply Date Range
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}