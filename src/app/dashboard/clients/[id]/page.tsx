// src/app/dashboard/clients/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientApi, invoiceApi } from "@/lib/api";
import { Client, Invoice } from "@/types";
import { ApiError, formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit,
  Trash2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Status colors for the badge
  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);

        // Fetch client details
        const clientData = await clientApi.getClient(parseInt(params.id));
        setClient(clientData);

        // Fetch client's invoices
        const invoices = await invoiceApi.getInvoices();
        const filteredInvoices = invoices.filter(
          (invoice) => invoice.client_id === clientData.client_id
        );
        setClientInvoices(filteredInvoices);
      } catch (error) {
        console.error("Error fetching client data:", error);
        setError("Failed to load client details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [params.id]);

  const handleDeleteClient = async () => {
    try {
      setIsDeleting(true);

      if (!client) return;

      // Check if client has invoices
      if (clientInvoices.length > 0) {
        setError(
          "Cannot delete client with existing invoices. Delete the invoices first or archive the client instead."
        );
        setIsDeleting(false);
        setShowDeleteConfirm(false);
        return;
      }

      await clientApi.deleteClient(client.client_id);
      router.push("/dashboard/clients");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to delete client. Please try again."
      );
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !client) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/dashboard/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div
        className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>Client not found.</p>
        <div className="mt-4">
          <Link href="/dashboard/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate client stats
  const totalInvoiced = clientInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount),
    0
  );
  const totalPaid = clientInvoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
  const totalOutstanding = clientInvoices
    .filter((invoice) =>
      ["PENDING", "OVERDUE", "PARTIAL"].includes(invoice.status)
    )
    .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
  const overdueInvoices = clientInvoices.filter(
    (invoice) => invoice.status === "OVERDUE"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/clients"
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          {client.company_name && (
            <span className="text-gray-500">({client.company_name})</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/clients/${params.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          </Link>

          <Link href={`/dashboard/invoices/new?client_id=${client.client_id}`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Client
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this client? This action cannot be
              undone.
              {clientInvoices.length > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  Warning: This client has {clientInvoices.length} invoice(s).
                  You must delete these invoices before you can delete this
                  client.
                </span>
              )}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                disabled={isDeleting || clientInvoices.length > 0}
                onClick={handleDeleteClient}
              >
                {isDeleting ? "Deleting..." : "Delete Client"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Client information */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Client Information
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <a
                    href={`mailto:${client.email}`}
                    className="text-primary hover:text-primary-dark"
                  >
                    {client.email}
                  </a>
                </div>

                {client.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <a href={`tel:${client.phone}`} className="text-gray-600">
                      {client.phone}
                    </a>
                  </div>
                )}

                {client.company_name && (
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{client.company_name}</span>
                  </div>
                )}

                {client.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div className="text-gray-600">
                      <div>{client.address}</div>
                      {client.city && client.state && (
                        <div>
                          {client.city}, {client.state} {client.postal_code}
                        </div>
                      )}
                      {client.country && <div>{client.country}</div>}
                    </div>
                  </div>
                )}
              </div>

              {client.payment_preference && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Payment Preference
                  </h4>
                  <p className="text-gray-700">{client.payment_preference}</p>
                </div>
              )}

              {client.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Notes
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Client stats */}
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Client Overview
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-5">
                <div className="overflow-hidden rounded-lg bg-white">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Total Invoiced
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-gray-900">
                    {formatCurrency(totalInvoiced)}
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Total Paid
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-green-600">
                    {formatCurrency(totalPaid)}
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Outstanding Balance
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-gray-900">
                    {formatCurrency(totalOutstanding)}
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Overdue Invoices
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-red-600">
                    {overdueInvoices.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Client invoices */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Invoices
              </h3>
              <Link
                href={`/dashboard/invoices/new?client_id=${client.client_id}`}
              >
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </Link>
            </div>

            {clientInvoices.length === 0 ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  No invoices created for this client yet.
                </p>
                <Link
                  href={`/dashboard/invoices/new?client_id=${client.client_id}`}
                >
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Invoice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Invoice #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientInvoices.map((invoice) => (
                      <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          <Link
                            href={`/dashboard/invoices/${invoice.invoice_id}`}
                          >
                            {invoice.invoice_number}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{formatDate(invoice.issue_date)}</div>
                          <div className="text-xs text-gray-400">
                            Due: {formatDate(invoice.due_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[invoice.status]
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(Number(invoice.total_amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
