// "use client";

// import { Invoice, Payment } from "@/types";
// import { formatCurrency, formatDate } from "@/lib/utils";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// interface InvoicePrintProps {
//   invoice: Invoice;
//   companyLogo?: string;
//   companyName?: string;
// }

// export default function InvoicePrint({
//   invoice,
//   companyLogo,
//   companyName,
// }: InvoicePrintProps) {
//   const [totalPaid, setTotalPaid] = useState(0);
//   const [balanceDue, setBalanceDue] = useState(0);

//   // Fungsi untuk mendapatkan detail payment method
//   const getPaymentMethodDetail = (payment: Payment): string => {
//     if (payment.payment_method === "BANK_TRANSFER" && payment.BankAccount) {
//       return `${payment.BankAccount.bank_name} - ${payment.BankAccount.account_number}`;
//     } else if (payment.payment_method === "E_WALLET" && payment.EWallet) {
//       return `${payment.EWallet.wallet_type} - ${payment.EWallet.phone_number}`;
//     } else {
//       return payment.reference || "-";
//     }
//   };

//   useEffect(() => {
//     if (invoice.payments && invoice.payments.length > 0) {
//       const paid = invoice.payments.reduce(
//         (sum, payment) => sum + Number(payment.amount),
//         0
//       );
//       setTotalPaid(paid);
//       setBalanceDue(Number(invoice.total_amount) - paid);
//     } else {
//       setTotalPaid(0);
//       setBalanceDue(Number(invoice.total_amount));
//     }
//   }, [invoice]);

//   // Get appropriate status class for the badge
//   const getStatusClass = () => {
//     switch (invoice.status) {
//       case "PAID":
//         return "bg-green-100 text-green-800";
//       case "PENDING":
//         return "bg-blue-100 text-blue-800";
//       case "OVERDUE":
//         return "bg-red-100 text-red-800";
//       case "PARTIAL":
//         return "bg-yellow-100 text-yellow-800";
//       case "DRAFT":
//         return "bg-gray-100 text-gray-800";
//       case "CANCELLED":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="bg-white p-8 max-w-4xl mx-auto">
//       {/* Invoice Header */}
//       <div className="flex justify-between items-start mb-8">
//         <div>
//           {companyLogo ? (
//             <Image
//               src={companyLogo}
//               alt="Company Logo"
//               width={60}
//               height={100}
//               className="h-16 mb-2"
//             />
//           ) : (
//             <h1 className="text-2xl font-bold text-gray-900">
//               {companyName || "Your Company"}
//             </h1>
//           )}
//           <p className="text-xl font-bold text-gray-900 mt-4">INVOICE</p>
//         </div>
//         <div className="text-right">
//           <p className="text-2xl font-bold text-gray-900">
//             #{invoice.invoice_number}
//           </p>
//           <span
//             className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass()}`}
//           >
//             {invoice.status}
//           </span>
//           <div className="mt-2 text-sm text-gray-500">
//             <p>Issue Date: {formatDate(invoice.issue_date)}</p>
//             <p>Due Date: {formatDate(invoice.due_date)}</p>
//           </div>
//         </div>
//       </div>

//       {/* From/To Section */}
//       <div className="flex justify-between mb-8">
//         <div>
//           <h2 className="text-sm font-medium text-gray-500 mb-1">From:</h2>
//           <p className="font-medium">{companyName || "Your Company"}</p>
//           {/* You can add the business address here if available */}
//         </div>
//         <div>
//           <h2 className="text-sm font-medium text-gray-500 mb-1">To:</h2>
//           {invoice.client && (
//             <>
//               <p className="font-medium">{invoice.client.name}</p>
//               {invoice.client.company_name && (
//                 <p>{invoice.client.company_name}</p>
//               )}
//               <p>{invoice.client.email}</p>
//               {invoice.client.address && (
//                 <p>
//                   {invoice.client.address}
//                   {invoice.client.city && `, ${invoice.client.city}`}
//                   {invoice.client.state && `, ${invoice.client.state}`}
//                   {invoice.client.postal_code &&
//                     ` ${invoice.client.postal_code}`}
//                   {invoice.client.country && `, ${invoice.client.country}`}
//                 </p>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Invoice Items */}
//       <table className="min-w-full divide-y divide-gray-200 mb-8">
//         <thead>
//           <tr className="bg-gray-50">
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Item
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Description
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Qty
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Price
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Total
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {invoice.items &&
//             invoice.items.map((item, index) => (
//               <tr key={item.item_id || index}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {item.product?.name || "Unknown Product"}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {item.description || "-"}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                   {item.quantity}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                   {formatCurrency(Number(item.unit_price))}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
//                   {formatCurrency(Number(item.amount))}
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>

//       {/* Invoice Summary */}
//       <div className="flex justify-end mb-8">
//         <div className="w-64">
//           <div className="border-t border-gray-200 pt-4">
//             <div className="flex justify-between py-1">
//               <div className="text-sm text-gray-500">Subtotal</div>
//               <div className="text-sm font-medium text-gray-900">
//                 {formatCurrency(Number(invoice.subtotal))}
//               </div>
//             </div>
//             <div className="flex justify-between py-1">
//               <div className="text-sm text-gray-500">Tax</div>
//               <div className="text-sm font-medium text-gray-900">
//                 {formatCurrency(Number(invoice.tax_amount))}
//               </div>
//             </div>
//             {invoice.discount_amount && Number(invoice.discount_amount) > 0 && (
//               <div className="flex justify-between py-1">
//                 <div className="text-sm text-gray-500">Discount</div>
//                 <div className="text-sm font-medium text-gray-900">
//                   -{formatCurrency(Number(invoice.discount_amount))}
//                 </div>
//               </div>
//             )}
//             <div className="flex justify-between py-1 border-t border-gray-200 mt-2">
//               <div className="text-base font-medium text-gray-900">Total</div>
//               <div className="text-base font-medium text-gray-900">
//                 {formatCurrency(Number(invoice.total_amount))}
//               </div>
//             </div>
//             {invoice.payments && invoice.payments.length > 0 && (
//               <>
//                 <div className="flex justify-between py-1">
//                   <div className="text-sm text-gray-500">Amount Paid</div>
//                   <div className="text-sm font-medium text-green-600">
//                     {formatCurrency(totalPaid)}
//                   </div>
//                 </div>
//                 <div className="flex justify-between py-1 border-t border-gray-200 mt-2">
//                   <div className="text-base font-bold text-gray-900">
//                     Balance Due
//                   </div>
//                   <div className="text-base font-bold text-gray-900">
//                     {formatCurrency(balanceDue)}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Payment Information */}
//       {(invoice.user?.profile?.bank_accounts &&
//         invoice.user.profile.bank_accounts.length > 0) ||
//       (invoice.user?.profile?.e_wallets &&
//         invoice.user.profile.e_wallets.length > 0) ? (
//         <div className="mb-8">
//           <h3 className="text-sm font-medium text-gray-700 mb-2">
//             Payment Information
//           </h3>
//           <div className="bg-gray-50 rounded p-4">
//             <p className="text-xs text-gray-700 mb-3">
//               Please make payment via one of the following methods:
//             </p>

//             {invoice.user?.profile?.bank_accounts &&
//               invoice.user.profile.bank_accounts.length > 0 && (
//                 <div className="mb-4">
//                   <h4 className="text-xs font-medium text-gray-600 mb-1">
//                     Bank Account:
//                   </h4>
//                   <ul className="text-xs text-gray-700">
//                     {invoice.user.profile.bank_accounts
//                       .sort(
//                         (a, b) =>
//                           (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
//                       )
//                       .map((account, idx) => (
//                         <li key={idx} className="mb-1">
//                           <span className="font-medium">
//                             {account.bank_name}:
//                           </span>{" "}
//                           {account.account_number} ({account.account_name})
//                           {account.is_primary && (
//                             <span className="text-green-600 ml-1">
//                               (Recommended)
//                             </span>
//                           )}
//                         </li>
//                       ))}
//                   </ul>
//                 </div>
//               )}

//             {invoice.user?.profile?.e_wallets &&
//               invoice.user.profile.e_wallets.length > 0 && (
//                 <div className="mb-4">
//                   <h4 className="text-xs font-medium text-gray-600 mb-1">
//                     E-Wallet:
//                   </h4>
//                   <ul className="text-xs text-gray-700">
//                     {invoice.user.profile.e_wallets
//                       .sort(
//                         (a, b) =>
//                           (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
//                       )
//                       .map((wallet, idx) => (
//                         <li key={idx} className="mb-1">
//                           <span className="font-medium">
//                             {wallet.wallet_type}:
//                           </span>{" "}
//                           {wallet.phone_number} ({wallet.account_name})
//                           {wallet.is_primary && (
//                             <span className="text-green-600 ml-1">
//                               (Recommended)
//                             </span>
//                           )}
//                         </li>
//                       ))}
//                   </ul>
//                 </div>
//               )}

//             <p className="text-xs text-gray-700 mt-2 italic">
//               Please include the invoice number #{invoice.invoice_number} when
//               making payments to facilitate verification. and if so, please send
//               proof of payment via email or telephone number.
//             </p>
//           </div>
//         </div>
//       ) : null}

//       {/* Payment History */}
//       {invoice.payments && invoice.payments.length > 0 && (
//         <div className="mb-8">
//           <h3 className="text-sm font-medium text-gray-700 mb-2">
//             Payment History
//           </h3>
//           <div className="bg-gray-50 rounded p-4">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead>
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Date
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Method
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Account/Reference
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Amount
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {invoice.payments.map((payment) => (
//                   <tr key={payment.payment_id}>
//                     <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500">
//                       {formatDate(payment.payment_date)}
//                     </td>
//                     <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500">
//                       {payment.payment_method}
//                     </td>
//                     <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500">
//                       {getPaymentMethodDetail(payment)}
//                     </td>
//                     <td className="px-6 py-2 whitespace-nowrap text-xs text-green-600 text-right">
//                       {formatCurrency(Number(payment.amount))}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Notes and Terms */}
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
//         {invoice.notes && (
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
//             <div className="bg-gray-50 rounded p-4">
//               <p className="text-sm text-gray-600">{invoice.notes}</p>
//             </div>
//           </div>
//         )}
//         {invoice.terms && (
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-2">
//               Terms & Conditions
//             </h3>
//             <div className="bg-gray-50 rounded p-4">
//               <p className="text-sm text-gray-600">{invoice.terms}</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="text-center text-sm text-gray-500 mt-16">
//         <p>Thank you for your business!</p>
//       </div>
//     </div>
//   );
// }
"use client";

import { Invoice, Payment } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";

interface InvoicePrintProps {
  invoice: Invoice;
  companyLogo?: string | null;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
}

export default function InvoicePrint({
  invoice,
  companyLogo,
  companyName,
  companyAddress,
  companyEmail,
  companyPhone,
}: InvoicePrintProps) {
  const [totalPaid, setTotalPaid] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);

  // Get profile data from invoice.user.profile
  const userProfile = invoice.user?.profile;

  // Use props first, then fallback to invoice data
  const logo = companyLogo || null;
  const company = companyName || userProfile?.company_name || "Your Company";
  const address = companyAddress || userProfile?.address || "";
  const email = companyEmail || invoice.user?.email || "";
  const phone = companyPhone || userProfile?.phone || invoice.user?.phone || "";

  // Fungsi untuk mendapatkan detail payment method
  const getPaymentMethodDetail = (payment: Payment): string => {
    if (payment.payment_method === "BANK_TRANSFER" && payment.BankAccount) {
      return `${payment.BankAccount.bank_name} - ${payment.BankAccount.account_number}`;
    } else if (payment.payment_method === "E_WALLET" && payment.EWallet) {
      return `${payment.EWallet.wallet_type} - ${payment.EWallet.phone_number}`;
    } else {
      return payment.reference || "-";
    }
  };

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
    <>
      {/* ========== PRINT STYLES - Hapus URL, tanggal, dan page number saat print ========== */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 10mm;
          }
          
          /* Sembunyikan header dan footer browser (URL, tanggal, page number) */
          html {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide browser default headers/footers */
          @page {
            margin-top: 0;
            margin-bottom: 0;
          }
          
          body {
            margin: 1cm;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Pastikan watermark tidak terpotong */
          .invoice-container {
            overflow: visible !important;
          }

          .watermark-container {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
          }
        }
      `}</style>

      <div
        className="bg-white p-8 max-w-4xl mx-auto relative invoice-container"
        style={{ 
          minHeight: "1100px",
          overflow: "hidden",
        }}
      >
        {/* ========== WATERMARK LOGO COPYRIGHT (BESAR DI TENGAH - TIDAK KEPOTONG) ========== */}
        {logo ? (
          <div
            className="watermark-container absolute pointer-events-none select-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "550px",  // Ukuran lebih kecil agar tidak kepotong
              height: "550px",
              opacity: 0.08,
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            <Image
              src={logo}
              alt=""
              fill
              sizes="320px"
              style={{
                objectFit: "contain",
                filter: "grayscale(100%)",
              }}
              priority
            />
          </div>
        ) : (
          /* Jika tidak ada logo, tampilkan text watermark nama company */
          <div
            className="watermark-container absolute pointer-events-none select-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-30deg)",
              opacity: 0.04,
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            <p
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "#000000",
                letterSpacing: "6px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {company}
            </p>
          </div>
        )}

        {/* Main Content - positioned above watermark */}
        <div className="relative" style={{ zIndex: 1 }}>
          {/* Invoice Header - TANPA ALAMAT (alamat ada di FROM section) */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {logo ? (
                <div className="relative" style={{ width: "100px", height: "50px" }}>
                  <Image
                    src={logo}
                    alt="Company Logo"
                    fill
                    sizes="100px"
                    style={{ objectFit: "contain", objectPosition: "left" }}
                    priority
                  />
                </div>
              ) : null}
              {/* Nama company */}
              <h1 className={`text-xl font-bold text-gray-900 ${logo ? 'mt-2' : ''}`}>
                {company}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">INVOICE</p>
              <p className="text-lg font-semibold text-blue-600 mt-1">
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
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                From:
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{company}</p>
                {address && <p className="text-sm text-gray-600">{address}</p>}
                {email && <p className="text-sm text-gray-600">{email}</p>}
                {phone && <p className="text-sm text-gray-600">{phone}</p>}
              </div>
            </div>
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                To:
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {invoice.client && (
                  <>
                    <p className="font-semibold text-gray-900">
                      {invoice.client.name}
                    </p>
                    {invoice.client.company_name && (
                      <p className="text-sm text-gray-600">
                        {invoice.client.company_name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">{invoice.client.email}</p>
                    {invoice.client.phone && (
                      <p className="text-sm text-gray-600">{invoice.client.phone}</p>
                    )}
                    {invoice.client.address && (
                      <p className="text-sm text-gray-600">
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
                {invoice.discount_amount &&
                  Number(invoice.discount_amount) > 0 && (
                    <div className="flex justify-between py-1">
                      <div className="text-sm text-gray-500">Discount</div>
                      <div className="text-sm font-medium text-gray-900">
                        -{formatCurrency(Number(invoice.discount_amount))}
                      </div>
                    </div>
                  )}
                <div className="flex justify-between py-1 border-t border-gray-200 mt-2">
                  <div className="text-base font-medium text-gray-900">Total</div>
                  <div className="text-base font-bold text-blue-600">
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
                      <div
                        className={`text-base font-bold ${
                          balanceDue > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {formatCurrency(balanceDue)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {(userProfile?.bank_accounts && userProfile.bank_accounts.length > 0) ||
          (userProfile?.e_wallets && userProfile.e_wallets.length > 0) ? (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Payment Information
              </h3>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-xs text-gray-700 mb-3">
                  Please make payment via one of the following methods:
                </p>

                {userProfile?.bank_accounts &&
                  userProfile.bank_accounts.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-600 mb-1">
                        Bank Account:
                      </h4>
                      <ul className="text-xs text-gray-700">
                        {userProfile.bank_accounts
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

                {userProfile?.e_wallets && userProfile.e_wallets.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-600 mb-1">
                      E-Wallet:
                    </h4>
                    <ul className="text-xs text-gray-700">
                      {userProfile.e_wallets
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

                <p className="text-xs text-gray-700 mt-2 italic">
                  Please include the invoice number #{invoice.invoice_number} when
                  making payments to facilitate verification. and if so, please
                  send proof of payment via email or telephone number.
                </p>
              </div>
            </div>
          ) : null}

          {/* Payment History */}
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
                        Account/Reference
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
                          {getPaymentMethodDetail(payment)}
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

          {/* ========== FOOTER COPYRIGHT ========== */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {logo && (
                  <div
                    className="relative"
                    style={{ width: "28px", height: "28px", opacity: 0.6 }}
                  >
                    <Image
                      src={logo}
                      alt=""
                      fill
                      sizes="28px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600">{company}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  © {new Date().getFullYear()} {company}. All rights reserved.
                </p>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">Thank you for your business!</p>
            </div>
          </div>
        </div>

        {/* ========== STATUS STAMPS ========== */}
        {invoice.status === "PAID" && (
          <div
            className="absolute pointer-events-none select-none"
            style={{
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-15deg)",
              zIndex: 2,
            }}
          >
            <div
              style={{
                border: "6px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "8px",
                padding: "12px 32px",
              }}
            >
              <p
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: "rgba(34, 197, 94, 0.3)",
                  letterSpacing: "8px",
                }}
              >
                PAID
              </p>
            </div>
          </div>
        )}

        {invoice.status === "CANCELLED" && (
          <div
            className="absolute pointer-events-none select-none"
            style={{
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-15deg)",
              zIndex: 2,
            }}
          >
            <div
              style={{
                border: "6px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "12px 32px",
              }}
            >
              <p
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "rgba(239, 68, 68, 0.3)",
                  letterSpacing: "6px",
                }}
              >
                CANCELLED
              </p>
            </div>
          </div>
        )}

        {invoice.status === "OVERDUE" && (
          <div
            className="absolute pointer-events-none select-none"
            style={{
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-15deg)",
              zIndex: 2,
            }}
          >
            <div
              style={{
                border: "6px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "8px",
                padding: "12px 32px",
              }}
            >
              <p
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "rgba(249, 115, 22, 0.3)",
                  letterSpacing: "6px",
                }}
              >
                OVERDUE
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
