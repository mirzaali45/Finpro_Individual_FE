// src/components/dashboard/reports/ReportsCharts.tsx
"use client";

import { useState, useEffect } from "react";
import { Invoice } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart4,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";

interface ReportsChartsProps {
  invoices: Invoice[];
}

// Define status type for type safety
type InvoiceStatus =
  | "PAID"
  | "PENDING"
  | "DRAFT"
  | "PARTIAL"
  | "OVERDUE"
  | "CANCELLED";

export default function ReportsCharts({ invoices }: ReportsChartsProps) {
  const [monthlyData, setMonthlyData] = useState<
    { month: string; amount: number }[]
  >([]);
  const [statusData, setStatusData] = useState<
    { status: InvoiceStatus; count: number }[]
  >([]);
  const [paymentTrendsData, setPaymentTrendsData] = useState<
    { month: string; paid: number; pending: number }[]
  >([]);

  useEffect(() => {
    if (invoices.length > 0) {
      processChartData(invoices);
    } else {
      // Reset chart data when no invoices are available
      setMonthlyData([]);
      setStatusData([]);
      setPaymentTrendsData([]);
    }
  }, [invoices]);

  // Function to process invoice data for charts
  const processChartData = (invoiceData: Invoice[]) => {
    // Monthly revenue chart data
    const monthlyRevenue: { [key: string]: number } = {};

    // Status distribution chart data
    const statusCounts: { [key in InvoiceStatus]: number } = {
      DRAFT: 0,
      PENDING: 0,
      PAID: 0,
      PARTIAL: 0,
      OVERDUE: 0,
      CANCELLED: 0,
    };

    // Payment trends chart data
    const paymentTrends: {
      [key: string]: { paid: number; pending: number };
    } = {};

    // Process each invoice
    invoiceData.forEach((invoice) => {
      // For monthly revenue chart
      const date = new Date(invoice.issue_date);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear().toString().substr(-2)}`;

      if (!monthlyRevenue[monthYear]) {
        monthlyRevenue[monthYear] = 0;
      }

      monthlyRevenue[monthYear] += Number(invoice.total_amount);

      // For status distribution chart
      const status = invoice.status as InvoiceStatus;
      if (status in statusCounts) {
        statusCounts[status]++;
      }

      // For payment trends chart
      if (!paymentTrends[monthYear]) {
        paymentTrends[monthYear] = { paid: 0, pending: 0 };
      }

      if (status === "PAID") {
        paymentTrends[monthYear].paid += Number(invoice.total_amount);
      } else if (status === "PENDING" || status === "PARTIAL") {
        paymentTrends[monthYear].pending += Number(invoice.total_amount);
      }
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyRevenue).sort((a, b) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const [aMonth, aYear] = [a.split(" ")[0], a.split(" ")[1]];
      const [bMonth, bYear] = [b.split(" ")[0], b.split(" ")[1]];

      const aMonthIndex = monthNames.indexOf(aMonth);
      const bMonthIndex = monthNames.indexOf(bMonth);

      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear);
      }

      return aMonthIndex - bMonthIndex;
    });

    // Convert monthly data to array format for Recharts
    const monthlyDataArray = sortedMonths.map((key) => ({
      month: key,
      amount: monthlyRevenue[key],
    }));

    // Convert status data to array format for Recharts
    const statusDataArray = Object.keys(statusCounts)
      .filter((status) => statusCounts[status as InvoiceStatus] > 0) // Only include statuses with at least 1 invoice
      .map((status) => ({
        status: status as InvoiceStatus,
        count: statusCounts[status as InvoiceStatus],
      }));

    // Convert payment trends data to array format
    const paymentTrendsArray = sortedMonths.map((key) => ({
      month: key,
      paid: paymentTrends[key]?.paid || 0,
      pending: paymentTrends[key]?.pending || 0,
    }));

    setMonthlyData(monthlyDataArray);
    setStatusData(statusDataArray);
    setPaymentTrendsData(paymentTrendsArray);
  };

  // Colors for status pie chart
  const STATUS_COLORS: Record<InvoiceStatus, string> = {
    PAID: "#4ade80", // Green
    PENDING: "#60a5fa", // Blue
    DRAFT: "#d4d4d4", // Gray
    PARTIAL: "#facc15", // Yellow
    OVERDUE: "#f87171", // Red
    CANCELLED: "#a1a1aa", // Gray
  };

  return (
    <div className="space-y-6">
      {/* Monthly Revenue Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart4 className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium">Monthly Revenue</h2>
        </div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}jt`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="amount" name="Revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart4 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No data available for the selected period</p>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Status Pie Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium">Invoice Status</h2>
        </div>
        {statusData.length > 0 && statusData.some((item) => item.count > 0) ? (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.status]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <PieChartIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No data available for the selected period</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Trends Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <LineChartIcon className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium">Payment Trends</h2>
        </div>
        {paymentTrendsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={paymentTrendsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}jt`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="paid"
                name="Paid"
                stroke="#4ade80"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                name="Pending"
                stroke="#60a5fa"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <LineChartIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No data available for the selected period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
