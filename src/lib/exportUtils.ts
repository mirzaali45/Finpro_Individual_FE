// src/lib/exportUtils.ts
import { Invoice } from "@/types";
import { formatDate } from "./utils";

/**
 * Exports invoice data to a CSV file and triggers download
 * @param invoices Array of invoice objects
 * @param filename Optional custom filename
 */
export const exportInvoicesToCSV = (
  invoices: Invoice[],
  filename?: string
): void => {
  if (invoices.length === 0) return;

  // Create CSV content
  const headers = [
    "Invoice #",
    "Date",
    "Due Date",
    "Client",
    "Status",
    "Amount",
    "Tax",
    "Total",
  ];
  
  const rows = invoices.map((invoice) => [
    invoice.invoice_number,
    formatDate(invoice.issue_date),
    formatDate(invoice.due_date),
    invoice.client?.name || "Unknown",
    invoice.status,
    invoice.subtotal,
    invoice.tax_amount,
    invoice.total_amount,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    filename || `invoice-report-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};