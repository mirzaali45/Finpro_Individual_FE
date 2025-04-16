import React from "react";
import { Invoice, InvoiceStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

interface InvoiceSummaryProps {
  invoices: Invoice[];
  className?: string;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  invoices,
  className = "",
}) => {
  // Calculate summary data
  const statusCounts = {
    DRAFT: 0,
    PENDING: 0,
    PAID: 0,
    PARTIAL: 0,
    OVERDUE: 0,
    CANCELLED: 0,
  };

  const statusAmounts = {
    DRAFT: 0,
    PENDING: 0,
    PAID: 0,
    PARTIAL: 0,
    OVERDUE: 0,
    CANCELLED: 0,
  };

  let totalAmount = 0;
  let paidAmount = 0;
  let overdueAmount = 0;
  let pendingAmount = 0;

  invoices.forEach((invoice) => {
    const amount = Number(invoice.total_amount);
    statusCounts[invoice.status]++;
    statusAmounts[invoice.status] += amount;
    totalAmount += amount;

    if (invoice.status === "PAID") {
      paidAmount += amount;
    } else if (invoice.status === "OVERDUE") {
      overdueAmount += amount;
    } else if (invoice.status === "PENDING" || invoice.status === "PARTIAL") {
      pendingAmount += amount;
    }
  });

  // Prepare chart data
  const chartData = {
    labels: ["Paid", "Overdue", "Pending", "Other"],
    datasets: [
      {
        data: [
          paidAmount,
          overdueAmount,
          pendingAmount,
          totalAmount - (paidAmount + overdueAmount + pendingAmount),
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(209, 213, 219, 0.7)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
          "rgb(59, 130, 246)",
          "rgb(209, 213, 219)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += formatCurrency(context.parsed);
            }
            return label;
          },
        },
      },
    },
  };

  const collectiveData = [
    {
      label: "Total Invoiced",
      value: totalAmount,
      color: "text-gray-900",
    },
    {
      label: "Paid",
      value: paidAmount,
      color: "text-green-600",
    },
    {
      label: "Outstanding",
      value: totalAmount - paidAmount,
      color: "text-gray-900",
    },
    {
      label: "Overdue",
      value: overdueAmount,
      color: "text-red-600",
    },
  ];

  const statusData = [
    {
      label: "Pending",
      count: statusCounts["PENDING"],
      value: statusAmounts["PENDING"],
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Paid",
      count: statusCounts["PAID"],
      value: statusAmounts["PAID"],
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Overdue",
      count: statusCounts["OVERDUE"],
      value: statusAmounts["OVERDUE"],
      color: "bg-red-100 text-red-800",
    },
    {
      label: "Partial",
      count: statusCounts["PARTIAL"],
      value: statusAmounts["PARTIAL"],
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Draft",
      count: statusCounts["DRAFT"],
      value: statusAmounts["DRAFT"],
      color: "bg-gray-100 text-gray-800",
    },
    {
      label: "Cancelled",
      count: statusCounts["CANCELLED"],
      value: statusAmounts["CANCELLED"],
      color: "bg-gray-100 text-gray-800",
    },
  ];

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Invoice Summary
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="flex justify-center items-center">
            <div className="w-48 h-48">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Summary Stats */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">
              Financial Overview
            </h4>
            <dl className="space-y-3">
              {collectiveData.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className={`text-sm font-medium ${item.color}`}>
                    {formatCurrency(item.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="mt-8">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Status Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statusData
              .filter((item) => item.count > 0)
              .map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-3 border border-gray-200"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${item.color} mb-2`}
                    >
                      {item.label}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {item.count}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
