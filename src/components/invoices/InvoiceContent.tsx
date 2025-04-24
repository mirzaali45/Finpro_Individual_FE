import { formatCurrency, formatDate } from "@/lib/utils";
import { Invoice, Payment } from "@/types";

interface InvoiceContentProps {
  invoice: Invoice;
  totalPaid: number;
  balanceDue: number;
}

export default function InvoiceContent({
  invoice,
  totalPaid,
  balanceDue,
}: InvoiceContentProps) {
  // Improved function to get payment method details with better fallbacks
  const getPaymentMethodDetail = (payment: Payment): string => {
    try {
      // Handle bank transfers
      if (payment.payment_method === "BANK_TRANSFER") {
        // Check for BankAccount relation in expected format
        if (payment.BankAccount) {
          return `${payment.BankAccount.bank_name} - ${payment.BankAccount.account_number}`;
        }

        // Check for bank account info in user profile as fallback
        if (payment.bank_account_id && invoice.user?.profile?.bank_accounts) {
          const matchingAccount = invoice.user.profile.bank_accounts.find(
            (account) => account.id === payment.bank_account_id
          );
          if (matchingAccount) {
            return `${matchingAccount.bank_name} - ${matchingAccount.account_number}`;
          }
        }
      }

      // Handle e-wallet payments
      else if (payment.payment_method === "E_WALLET") {
        // Check for EWallet relation in expected format
        if (payment.EWallet) {
          return `${payment.EWallet.wallet_type} - ${payment.EWallet.phone_number}`;
        }

        // Check for e-wallet info in user profile as fallback
        if (payment.e_wallet_id && invoice.user?.profile?.e_wallets) {
          const matchingWallet = invoice.user.profile.e_wallets.find(
            (wallet) => wallet.id === payment.e_wallet_id
          );
          if (matchingWallet) {
            return `${matchingWallet.wallet_type} - ${matchingWallet.phone_number}`;
          }
        }
      }

      // Fallback to reference or transaction method
      return payment.reference || payment.payment_method || "-";
    } catch (error) {
      console.error("Error getting payment method details:", error);
      return payment.reference || payment.payment_method || "-";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">Invoice To:</h2>
            <div className="mt-2">
              <p className="text-gray-900 font-medium">
                {invoice.client?.name}
              </p>
              {invoice.client?.company_name && (
                <p className="text-gray-500">{invoice.client.company_name}</p>
              )}
              <p className="text-gray-500">{invoice.client?.email}</p>
              {invoice.client?.phone && (
                <p className="text-gray-500">{invoice.client.phone}</p>
              )}
              {invoice.client?.address && (
                <p className="text-gray-500">
                  {invoice.client.address}
                  {invoice.client.city && `, ${invoice.client.city}`}
                  {invoice.client.state && `, ${invoice.client.state}`}
                  {invoice.client.postal_code &&
                    ` ${invoice.client.postal_code}`}
                  {invoice.client.country && `, ${invoice.client.country}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="text-right">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Invoice Details:
            </h2>
            <div className="mt-2">
              <p className="text-gray-500">
                Invoice Number:{" "}
                <span className="text-gray-900">{invoice.invoice_number}</span>
              </p>
              <p className="text-gray-500">
                Issue Date:{" "}
                <span className="text-gray-900">
                  {formatDate(invoice.issue_date)}
                </span>
              </p>
              <p className="text-gray-500">
                Due Date:{" "}
                <span className="text-gray-900">
                  {formatDate(invoice.due_date)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Invoice Items
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
            <tfoot className="bg-gray-50">
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                ></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
                  Subtotal
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(Number(invoice.subtotal))}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                ></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
                  Tax
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(Number(invoice.tax_amount))}
                </td>
              </tr>
              {invoice.discount_amount &&
                Number(invoice.discount_amount) > 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    ></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
                      Discount
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      -{formatCurrency(Number(invoice.discount_amount))}
                    </td>
                  </tr>
                )}
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                ></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                  {formatCurrency(Number(invoice.total_amount))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payments */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Payment History
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Method
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Account/Reference
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
                {invoice.payments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getPaymentMethodDetail(payment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                      {formatCurrency(Number(payment.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right"
                  >
                    Total Paid
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                    {formatCurrency(totalPaid)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right"
                  >
                    Balance Due
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(balanceDue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Payment Information */}
      {(invoice.user?.profile?.bank_accounts &&
        invoice.user.profile.bank_accounts.length > 0) ||
      (invoice.user?.profile?.e_wallets &&
        invoice.user.profile.e_wallets.length > 0) ? (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Payment Information
          </h3>
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-600 mb-3">
              Please make payment using one of the following methods:
            </p>

            {invoice.user?.profile?.bank_accounts &&
              invoice.user.profile.bank_accounts.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Bank Accounts:
                  </h4>
                  <ul className="text-sm text-gray-600">
                    {invoice.user.profile.bank_accounts
                      .sort(
                        (a, b) =>
                          (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
                      )
                      .map((account, idx) => (
                        <li key={idx} className="mb-1">
                          <span className="font-medium">
                            {account.bank_name}:
                          </span>{" "}
                          {account.account_number} ({account.account_name})
                          {account.is_primary && (
                            <span className="text-green-600 ml-1">
                              (Recommended)
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            {invoice.user?.profile?.e_wallets &&
              invoice.user.profile.e_wallets.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    E-Wallet:
                  </h4>
                  <ul className="text-sm text-gray-600">
                    {invoice.user.profile.e_wallets
                      .sort(
                        (a, b) =>
                          (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
                      )
                      .map((wallet, idx) => (
                        <li key={idx} className="mb-1">
                          <span className="font-medium">
                            {wallet.wallet_type}:
                          </span>{" "}
                          {wallet.phone_number} ({wallet.account_name})
                          {wallet.is_primary && (
                            <span className="text-green-600 ml-1">
                              (Recommended)
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            <p className="text-sm text-gray-600 mt-3 italic">
              Please include the invoice number #{invoice.invoice_number} when
              making payments to facilitate verification. Please send proof of
              payment via email or telephone number.
            </p>
          </div>
        </div>
      ) : null}

      {/* Additional Information */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {invoice.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          </div>
        )}

        {invoice.terms && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </h3>
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-sm text-gray-600">{invoice.terms}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
