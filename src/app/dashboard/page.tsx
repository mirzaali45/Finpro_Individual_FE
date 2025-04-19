"use client";

import { useState, useEffect } from "react";
import { clientApi, invoiceApi, productApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Invoice } from "@/types/index";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clock, DollarSign, FileText, Users } from "lucide-react";

export default function DashboardPage() {
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [clientCount, setClientCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    overdue: 0,
    paid: 0,
    draft: 0,
  });

  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch invoices
        const invoices = await invoiceApi.getInvoices();

        // Get recent invoices (last 5)
        const recent = [...invoices]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5);
        setRecentInvoices(recent);

        // Calculate stats
        const totalOutstanding = invoices
          .filter((inv) => ["PENDING", "OVERDUE"].includes(inv.status))
          .reduce((sum, inv) => sum + Number(inv.total_amount), 0);

        const overdue = invoices
          .filter((inv) => inv.status === "OVERDUE")
          .reduce((sum, inv) => sum + Number(inv.total_amount), 0);

        const paid = invoices
          .filter((inv) => inv.status === "PAID")
          .reduce((sum, inv) => sum + Number(inv.total_amount), 0);

        const draft = invoices.filter((inv) => inv.status === "DRAFT").length;

        setStats({
          totalOutstanding,
          overdue,
          paid,
          draft,
        });

        // Fetch clients count
        const clients = await clientApi.getClients();
        setClientCount(clients.length);

        // Fetch products count - just to demonstrate that the endpoint is working
        await productApi.getProducts();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Outstanding Amount */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
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
                      {formatCurrency(stats.totalOutstanding)}
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
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue Amount
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(stats.overdue)}
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
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Total Clients */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Clients
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {clientCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link
              href="/dashboard/clients"
              className="text-sm text-green-700 font-medium hover:text-green-900 flex items-center"
            >
              View all clients
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Draft Invoices */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Draft Invoices
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.draft}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link
              href="/dashboard/invoices?status=draft"
              className="text-sm text-purple-700 font-medium hover:text-purple-900 flex items-center"
            >
              View draft invoices
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Invoices
          </h3>
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <ul className="divide-y divide-gray-200">
          {recentInvoices.length > 0 ? (
            recentInvoices.map((invoice) => (
              <li key={invoice.invoice_id}>
                <Link
                  href={`/dashboard/invoices/${invoice.invoice_id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary truncate">
                        {invoice.invoice_number}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusColors[invoice.status]
                          }`}
                        >
                          {invoice.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {invoice.client?.name || "Unknown Client"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(Number(invoice.total_amount))}
                          </span>
                          {" · "}
                          Due {formatDate(invoice.due_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 text-center text-gray-500">
              No invoices yet. Create your first invoice to get started.
            </li>
          )}
        </ul>

        {recentInvoices.length > 0 && (
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <Link
              href="/dashboard/invoices/new"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Create New Invoice
            </Link>
          </div>
        )}
      </div>

      {/* Quick actions */}
      {recentInvoices.length === 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Get started with your business
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href="/dashboard/clients/new"
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      Add a client
                    </p>
                    <p className="text-sm text-gray-500">
                      Add your first client to start creating invoices
                    </p>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href="/dashboard/products/new"
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      Add a product
                    </p>
                    <p className="text-sm text-gray-500">
                      Create products or services to add to your invoices
                    </p>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href="/dashboard/invoices/new"
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      Create an invoice
                    </p>
                    <p className="text-sm text-gray-500">
                      Create your first invoice to bill a client
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
