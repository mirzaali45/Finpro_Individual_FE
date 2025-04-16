"use client";

import { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

interface InvoicePrintProps {
  invoice: Invoice;
  companyLogo?: string;
  companyName?: string;
}

export default function InvoicePrint({
  invoice,
  companyLogo,
  companyName,
}: InvoicePrintProps) {
  const [totalPaid, setTotalPaid] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);

  useEffect(() => {
    if (invoice.payments && invoice.payments.length > 0) {
      const paid = invoice.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      );
      setTotalPaid(paid);
      setBalanceDue(Number(invoice.total_amount) - paid);
    } else {
      setTotalPaid(0);
      setBalanceDue(Number(invoice.total_amount));
    }
  }, [invoice]);

  // Get appropriate status class for the badge
  const getStatusClass = () => {
    switch (invoice.status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-blue-100 text-blue-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "PARTIAL":
        return "bg-yellow-100 text-yellow-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {companyLogo ? (
            <img src={companyLogo} alt="Company Logo" className="h-16 mb-2" />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">
              {companyName || "Your Company"}
            </h1>
          )}
          <p className="text-xl font-bold text-gray-900 mt-4">INVOICE</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            #{invoice.invoice_number}
          </p>
          <span
            className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass()}`}
          >
            {invoice.status}
          </span>
          <div className="mt-2 text-sm text-gray-500">
            <p>Issue Date: {formatDate(invoice.issue_date)}</p>
            <p>Due Date: {formatDate(invoice.due_date)}</p>
          </div>
        </div>
      </div>

      {/* From/To Section */}
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-1">From:</h2>
          <p className="font-medium">{companyName || "Your Company"}</p>
          {/* You can add the business address here if available */}
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-1">To:</h2>
          {invoice.client && (
            <>
              <p className="font-medium">{invoice.client.name}</p>
              {invoice.client.company_name && (
                <p>{invoice.client.company_name}</p>
              )}
              <p>{invoice.client.email}</p>
              {invoice.client.address && (
                <p>
                  {invoice.client.address}
                  {invoice.client.city && `, ${invoice.client.city}`}
                  {invoice.client.state && `, ${invoice.client.state}`}
                  {invoice.client.postal_code &&
                    ` ${invoice.client.postal_code}`}
                  {invoice.client.country && `, ${invoice.client.country}`}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Invoice Items */}
      <table className="min-w-full divide-y divide-gray-200 mb-8">
        <thead>
          <tr className="bg-gray-50">
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Item
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Qty
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoice.items &&
            invoice.items.map((item, index) => (
              <tr key={item.item_id || index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.product?.name || "Unknown Product"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatCurrency(Number(item.unit_price))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(Number(item.amount))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Invoice Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between py-1">
              <div className="text-sm text-gray-500">Subtotal</div>
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(Number(invoice.subtotal))}
              </div>
            </div>
            <div className="flex justify-between py-1">
              <div className="text-sm text-gray-500">Tax</div>
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(Number(invoice.tax_amount))}
              </div>
            </div>
            {invoice.discount_amount && Number(invoice.discount_amount) > 0 && (
              <div className="flex justify-between py-1">
                <div className="text-sm text-gray-500">Discount</div>
                <div className="text-sm font-medium text-gray-900">
                  -{formatCurrency(Number(invoice.discount_amount))}
                </div>
              </div>
            )}
            <div className="flex justify-between py-1 border-t border-gray-200 mt-2">
              <div className="text-base font-medium text-gray-900">Total</div>
              <div className="text-base font-medium text-gray-900">
                {formatCurrency(Number(invoice.total_amount))}
              </div>
            </div>
            {invoice.payments && invoice.payments.length > 0 && (
              <>
                <div className="flex justify-between py-1">
                  <div className="text-sm text-gray-500">Amount Paid</div>
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(totalPaid)}
                  </div>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-200 mt-2">
                  <div className="text-base font-bold text-gray-900">
                    Balance Due
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(balanceDue)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Payment History
          </h3>
          <div className="bg-gray-50 rounded p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Method
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reference
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.payments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500">
                      {payment.reference || "-"}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-xs text-green-600 text-right">
                      {formatCurrency(Number(payment.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes and Terms */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
        {invoice.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          </div>
        )}
        {invoice.terms && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </h3>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-sm text-gray-600">{invoice.terms}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-16">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}
