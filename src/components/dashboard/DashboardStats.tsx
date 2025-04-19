import {
  DollarSign,
  CheckCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface DashboardStatsProps {
  totalOutstanding: number;
  overdue: number;
  paid: number;
  totalInvoices: number;
  draftCount: number;
  clientCount: number;
  isLoading: boolean;
}

export default function DashboardStats({
  totalOutstanding,
  overdue,
  paid,
  totalInvoices,
  draftCount,
  isLoading,
}: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg p-5 animate-pulse"
          >
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Total Outstanding */}
      <div className="bg-white overflow-hidden shadow hover:shadow-md transition-shadow duration-300 rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Outstanding Amount
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalOutstanding)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <Link
            href="/dashboard/invoices?status=pending"
            className="text-sm text-blue-700 font-medium hover:text-blue-900 flex items-center"
          >
            View all pending invoices
            <svg
              className="ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Overdue Amount */}
      <div className="bg-white overflow-hidden shadow hover:shadow-md transition-shadow duration-300 rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Overdue Amount
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {formatCurrency(overdue)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <Link
            href="/dashboard/invoices?status=overdue"
            className="text-sm text-red-700 font-medium hover:text-red-900 flex items-center"
          >
            View overdue invoices
            <svg
              className="ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Total Paid */}
      <div className="bg-white overflow-hidden shadow hover:shadow-md transition-shadow duration-300 rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Paid this Month
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {formatCurrency(paid)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <Link
            href="/dashboard/invoices?status=paid"
            className="text-sm text-green-700 font-medium hover:text-green-900 flex items-center"
          >
            View paid invoices
            <svg
              className="ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="bg-white overflow-hidden shadow hover:shadow-md transition-shadow duration-300 rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Invoices
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {totalInvoices}{" "}
                    <span className="text-sm text-gray-500">
                      ({draftCount} drafts)
                    </span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <Link
            href="/dashboard/invoices/new"
            className="text-sm text-purple-700 font-medium hover:text-purple-900 flex items-center"
          >
            Create new invoice
            <svg
              className="ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
