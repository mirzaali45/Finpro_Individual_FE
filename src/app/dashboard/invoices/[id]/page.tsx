// //src/app/dashboard/invoices/[id]/page.tsx
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Download,
//   Mail,
//   Edit,
//   Printer,
//   MoreHorizontal,
//   CheckCircle,
//   AlertTriangle,
//   XCircle,
//   ChevronDown,
//   RefreshCw,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { invoiceApi } from "@/lib/api";
// import { Invoice, Payment, PaymentMethod } from "@/types";
// import { formatCurrency } from "@/lib/utils";
// import InvoicePrint from "@/components/invoices/invoiceprint";
// import InvoiceContent from "@/components/invoices/InvoiceContent";
// import StatusManagement from "@/components/invoices/StatusManagement";
// import { useAuth } from "@/providers/AuthProviders";

// export default function InvoiceDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const { profile } = useAuth();
//   const router = useRouter();
//   const [invoice, setInvoice] = useState<Invoice | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showPaymentForm, setShowPaymentForm] = useState(false);
//   const [paymentFormData, setPaymentFormData] = useState({
//     amount: 0,
//     payment_date: new Date().toISOString().split("T")[0],
//     payment_method: "BANK_TRANSFER" as PaymentMethod,
//     reference: "",
//     notes: "",
//   });
//   const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
//   const [showActionsMenu, setShowActionsMenu] = useState(false);
//   const actionsMenuRef = useRef<HTMLDivElement>(null);
//   const printRef = useRef<HTMLDivElement>(null);

//   // Status colors for the badge
//   const statusColors = {
//     DRAFT: "bg-gray-100 text-gray-800",
//     PENDING: "bg-blue-100 text-blue-800",
//     PAID: "bg-green-100 text-green-800",
//     PARTIAL: "bg-yellow-100 text-yellow-800",
//     OVERDUE: "bg-red-100 text-red-800",
//     CANCELLED: "bg-gray-100 text-gray-800",
//   };

//   // Define handleSendReminder function
//   const handleSendReminder = async () => {
//     try {
//       if (!invoice) return;

//       setIsLoading(true);
//       await invoiceApi.sendReminderEmail(invoice.invoice_id);

//       // Show success message
//       setSuccessMessage("Reminder email sent successfully!");

//       // Auto-hide the success message after 5 seconds
//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 5000);
//     } catch (error) {
//       console.error("Error sending reminder:", error);
//       setError("Failed to send reminder email. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Status actions
//   const statusActions = {
//     DRAFT: {
//       icon: Edit,
//       text: "Edit Invoice",
//       action: () => router.push(`/dashboard/invoices/${params.id}/edit`),
//     },
//     PENDING: {
//       icon: Mail,
//       text: "Send Reminder",
//       action: handleSendReminder,
//     },
//     PAID: {
//       icon: Download,
//       text: "Download Receipt",
//       action: () => handlePrint(),
//     },
//     PARTIAL: {
//       icon: Mail,
//       text: "Send Reminder",
//       action: handleSendReminder,
//     },
//     OVERDUE: {
//       icon: Mail,
//       text: "Send Reminder",
//       action: handleSendReminder,
//     },
//     CANCELLED: {
//       icon: XCircle,
//       text: "Reactivate Invoice",
//       action: () => handleStatusChange("PENDING"),
//     },
//   };

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         setIsLoading(true);
//         const data = await invoiceApi.getInvoice(parseInt(params.id));
//         setInvoice(data);

//         // Set initial payment amount to balance due
//         if (data.payments && data.payments.length > 0) {
//           const totalPaid = data.payments.reduce(
//             (sum, payment) => sum + Number(payment.amount),
//             0
//           );
//           const balanceDue = Number(data.total_amount) - totalPaid;
//           setPaymentFormData((prev) => ({
//             ...prev,
//             amount: balanceDue,
//           }));
//         } else {
//           setPaymentFormData((prev) => ({
//             ...prev,
//             amount: Number(data.total_amount),
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching invoice:", error);
//         setError("Failed to load invoice details. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInvoice();
//   }, [params.id]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         actionsMenuRef.current &&
//         !actionsMenuRef.current.contains(event.target as Node)
//       ) {
//         setShowActionsMenu(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleStatusChange = async (status: string) => {
//     try {
//       if (!invoice) return;

//       await invoiceApi.changeStatus(invoice.invoice_id, status);

//       // Refetch the invoice to get updated data
//       const updatedInvoice = await invoiceApi.getInvoice(invoice.invoice_id);
//       setInvoice(updatedInvoice);
//     } catch (error) {
//       console.error("Error updating invoice status:", error);
//       setError("Failed to update invoice status. Please try again.");
//     }
//   };

//   const handlePaymentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!invoice) return;

//     try {
//       setIsSubmittingPayment(true);

//       await invoiceApi.addPayment({
//         invoice_id: invoice.invoice_id,
//         ...paymentFormData,
//       });

//       // Refetch the invoice to get updated data
//       const updatedInvoice = await invoiceApi.getInvoice(invoice.invoice_id);
//       setInvoice(updatedInvoice);
//       setShowPaymentForm(false);

//       // Check if fully paid
//       const totalPaid =
//         updatedInvoice.payments?.reduce(
//           (sum, payment) => sum + Number(payment.amount),
//           0
//         ) || 0;
//       if (totalPaid >= Number(updatedInvoice.total_amount)) {
//         await handleStatusChange("PAID");
//       } else if (totalPaid > 0) {
//         await handleStatusChange("PARTIAL");
//       }
//     } catch (error) {
//       console.error("Error adding payment:", error);
//       setError("Failed to record payment. Please try again.");
//     } finally {
//       setIsSubmittingPayment(false);
//     }
//   };

//   const handlePrint = () => {
//     const printContent = document.createElement("div");
//     printContent.innerHTML = printRef.current?.innerHTML || "";

//     const originalBody = document.body.innerHTML;
//     document.body.innerHTML = printContent.innerHTML;

//     window.print();
//     document.body.innerHTML = originalBody;

//     // Re-render component
//     window.location.reload();
//   };

//   const ActionButton = invoice?.status ? statusActions[invoice.status] : null;

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (error || !invoice) {
//     return (
//       <div
//         className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
//         role="alert"
//       >
//         <p>{error || "Invoice not found."}</p>
//         <div className="mt-4">
//           <Link href="/dashboard/invoices">
//             <Button>Back to Invoices</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const totalPaid =
//     invoice.payments?.reduce(
//       (sum, payment) => sum + Number(payment.amount),
//       0
//     ) || 0;
//   const balanceDue = Number(invoice.total_amount) - totalPaid;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div className="flex items-center gap-4">
//           <Link
//             href="/dashboard/invoices"
//             className="rounded-full p-2 hover:bg-gray-100"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Link>
//           <h1 className="text-2xl font-bold tracking-tight">
//             Invoice #{invoice.invoice_number}
//           </h1>
//         </div>

//         <div className="flex items-center gap-2">
//           <span
//             className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//               statusColors[invoice.status]
//             }`}
//           >
//             {invoice.status}
//           </span>

//           <Button variant="outline" size="sm" onClick={handlePrint}>
//             <Printer className="h-4 w-4 mr-2" />
//             Print
//           </Button>

//           <Button variant="outline" size="sm" onClick={handlePrint}>
//             <Download className="h-4 w-4 mr-2" />
//             Download
//           </Button>

//           {ActionButton && (
//             <Button size="sm" onClick={ActionButton.action}>
//               <ActionButton.icon className="h-4 w-4 mr-2" />
//               {ActionButton.text}
//             </Button>
//           )}

//           <div className="relative" ref={actionsMenuRef}>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowActionsMenu(!showActionsMenu)}
//             >
//               <MoreHorizontal className="h-4 w-4 mr-2" />
//               Actions
//               <ChevronDown className="h-4 w-4 ml-2" />
//             </Button>

//             {showActionsMenu && (
//               <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
//                 <div className="py-1" role="menu" aria-orientation="vertical">
//                   <button
//                     onClick={() => {
//                       setShowActionsMenu(false);
//                       handleStatusChange("PAID");
//                     }}
//                     className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     role="menuitem"
//                   >
//                     Mark as Paid
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowActionsMenu(false);
//                       setShowPaymentForm(true);
//                     }}
//                     className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     role="menuitem"
//                   >
//                     Record Payment
//                   </button>
//                   {invoice.status !== "DRAFT" && (
//                     <button
//                       onClick={() => {
//                         setShowActionsMenu(false);
//                         handleStatusChange("DRAFT");
//                       }}
//                       className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       role="menuitem"
//                     >
//                       Change to Draft
//                     </button>
//                   )}
//                   {invoice.status !== "PENDING" &&
//                     invoice.status !== "DRAFT" && (
//                       <button
//                         onClick={() => {
//                           setShowActionsMenu(false);
//                           handleStatusChange("PENDING");
//                         }}
//                         className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         role="menuitem"
//                       >
//                         Change to Pending
//                       </button>
//                     )}
//                   {invoice.status !== "CANCELLED" && (
//                     <button
//                       onClick={() => {
//                         setShowActionsMenu(false);
//                         handleStatusChange("CANCELLED");
//                       }}
//                       className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       role="menuitem"
//                     >
//                       Cancel Invoice
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recurring Invoice Info */}
//       {invoice.source_recurring_id && (
//         <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center">
//           <RefreshCw className="h-5 w-5 mr-2 flex-shrink-0" />
//           <p>This is a recurring invoice from your recurring invoice setup.</p>
//         </div>
//       )}

//       {/* Success Message */}
//       {successMessage && (
//         <div
//           className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex"
//           role="alert"
//         >
//           <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
//           <p>{successMessage}</p>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div
//           className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex"
//           role="alert"
//         >
//           <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Status Management Component */}
//       <StatusManagement
//         invoice={invoice}
//         onStatusChange={handleStatusChange}
//         onSendReminder={handleSendReminder}
//         showPaymentForm={showPaymentForm}
//         setShowPaymentForm={setShowPaymentForm}
//         paymentFormData={paymentFormData}
//         setPaymentFormData={setPaymentFormData}
//         handlePaymentSubmit={handlePaymentSubmit}
//         isSubmittingPayment={isSubmittingPayment}
//         balanceDue={balanceDue}
//         params={params}
//         router={router}
//       />

//       {/* Invoice Content Component */}
//       <InvoiceContent
//         invoice={invoice}
//         totalPaid={totalPaid}
//         balanceDue={balanceDue}
//       />

//       {/* Hidden printable invoice */}
//       <div className="hidden">
//         <div ref={printRef}>
//           <InvoicePrint
//             invoice={invoice}
//             companyLogo={profile?.logo}
//             companyName={profile?.company_name || "Your Company"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
//src/app/dashboard/invoices/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Mail,
  Edit,
  Printer,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { invoiceApi } from "@/lib/api";
import { Invoice, PaymentMethod } from "@/types";
import InvoicePrint from "@/components/invoices/invoiceprint";
import InvoiceContent from "@/components/invoices/InvoiceContent";
import StatusManagement from "@/components/invoices/StatusManagement";
import { useAuth } from "@/providers/AuthProviders";

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { profile } = useAuth();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: 0,
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "BANK_TRANSFER" as PaymentMethod,
    reference: "",
    notes: "",
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Status colors for the badge
  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  // Define handleSendReminder function
  const handleSendReminder = async () => {
    try {
      if (!invoice) return;

      setIsLoading(true);
      await invoiceApi.sendReminderEmail(invoice.invoice_id);

      // Show success message
      setSuccessMessage("Reminder email sent successfully!");

      // Auto-hide the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error sending reminder:", error);
      setError("Failed to send reminder email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending invoice email
  const handleSendInvoice = async () => {
    try {
      if (!invoice) return;

      setIsLoading(true);
      await invoiceApi.sendInvoiceEmail(invoice.invoice_id);

      // Update invoice status
      await handleStatusChange("PENDING");

      // Show success message
      setSuccessMessage("Invoice email sent successfully!");

      // Auto-hide the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error sending invoice:", error);
      setError("Failed to send invoice email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Status actions
  const statusActions = {
    DRAFT: {
      icon: Edit,
      text: "Edit Invoice",
      action: () => router.push(`/dashboard/invoices/${params.id}/edit`),
    },
    PENDING: {
      icon: Mail,
      text: "Send Reminder",
      action: handleSendReminder,
    },
    PAID: {
      icon: Download,
      text: "Download Receipt",
      action: () => handlePrint(),
    },
    PARTIAL: {
      icon: Mail,
      text: "Send Reminder",
      action: handleSendReminder,
    },
    OVERDUE: {
      icon: Mail,
      text: "Send Reminder",
      action: handleSendReminder,
    },
    CANCELLED: {
      icon: XCircle,
      text: "Reactivate Invoice",
      action: () => handleStatusChange("PENDING"),
    },
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        const data = await invoiceApi.getInvoice(parseInt(params.id));
        setInvoice(data);

        // Set initial payment amount to balance due
        if (data.payments && data.payments.length > 0) {
          const totalPaid = data.payments.reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
          );
          const balanceDue = Number(data.total_amount) - totalPaid;
          setPaymentFormData((prev) => ({
            ...prev,
            amount: balanceDue,
          }));
        } else {
          setPaymentFormData((prev) => ({
            ...prev,
            amount: Number(data.total_amount),
          }));
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError("Failed to load invoice details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowActionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = async (status: string) => {
    try {
      if (!invoice) return;

      await invoiceApi.changeStatus(invoice.invoice_id, status);

      // Add success message for status change
      setSuccessMessage(`Invoice status updated to ${status} successfully!`);

      // Auto-hide the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      // Refetch the invoice to get updated data
      const updatedInvoice = await invoiceApi.getInvoice(invoice.invoice_id);
      setInvoice(updatedInvoice);
    } catch (error) {
      console.error("Error updating invoice status:", error);
      setError("Failed to update invoice status. Please try again.");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoice) return;

    try {
      setIsSubmittingPayment(true);
      setError(""); // Reset error message

      await invoiceApi.addPayment({
        invoice_id: invoice.invoice_id,
        ...paymentFormData,
      });

      // Refetch the invoice to get updated data
      const updatedInvoice = await invoiceApi.getInvoice(invoice.invoice_id);
      setInvoice(updatedInvoice);
      setShowPaymentForm(false);

      // Show success message
      setSuccessMessage("Payment recorded successfully!");

      // Auto-hide the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      // Check if fully paid
      const totalPaid =
        updatedInvoice.payments?.reduce(
          (sum, payment) => sum + Number(payment.amount),
          0
        ) || 0;
      if (totalPaid >= Number(updatedInvoice.total_amount)) {
        await handleStatusChange("PAID");
      } else if (totalPaid > 0) {
        await handleStatusChange("PARTIAL");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      setError("Failed to record payment. Please try again.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = printRef.current?.innerHTML || "";

    const originalBody = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;

    window.print();
    document.body.innerHTML = originalBody;

    // Re-render component
    window.location.reload();
  };

  const ActionButton = invoice?.status ? statusActions[invoice.status] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>{error || "Invoice not found."}</p>
        <div className="mt-4">
          <Link href="/dashboard/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPaid =
    invoice.payments?.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    ) || 0;
  const balanceDue = Number(invoice.total_amount) - totalPaid;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/invoices"
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Invoice #{invoice.invoice_number}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusColors[invoice.status]
            }`}
          >
            {invoice.status}
          </span>

          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          {ActionButton && (
            <Button size="sm" onClick={ActionButton.action}>
              <ActionButton.icon className="h-4 w-4 mr-2" />
              {ActionButton.text}
            </Button>
          )}

          <div className="relative" ref={actionsMenuRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowActionsMenu(!showActionsMenu)}
            >
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>

            {showActionsMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => {
                      setShowActionsMenu(false);
                      handleStatusChange("PAID");
                    }}
                    className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => {
                      setShowActionsMenu(false);
                      setShowPaymentForm(true);
                    }}
                    className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Record Payment
                  </button>
                  {invoice.status === "DRAFT" && (
                    <button
                      onClick={() => {
                        setShowActionsMenu(false);
                        handleSendInvoice();
                      }}
                      className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Send Invoice
                    </button>
                  )}
                  {invoice.status !== "DRAFT" && (
                    <button
                      onClick={() => {
                        setShowActionsMenu(false);
                        handleStatusChange("DRAFT");
                      }}
                      className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Change to Draft
                    </button>
                  )}
                  {invoice.status !== "PENDING" &&
                    invoice.status !== "DRAFT" && (
                      <button
                        onClick={() => {
                          setShowActionsMenu(false);
                          handleStatusChange("PENDING");
                        }}
                        className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Change to Pending
                      </button>
                    )}
                  {invoice.status !== "CANCELLED" && (
                    <button
                      onClick={() => {
                        setShowActionsMenu(false);
                        handleStatusChange("CANCELLED");
                      }}
                      className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Cancel Invoice
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recurring Invoice Info */}
      {invoice.source_recurring_id && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>This is a recurring invoice from your recurring invoice setup.</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Status Management Component */}
      <StatusManagement
        invoice={invoice}
        onStatusChange={handleStatusChange}
        onSendReminder={handleSendReminder}
        showPaymentForm={showPaymentForm}
        setShowPaymentForm={setShowPaymentForm}
        paymentFormData={paymentFormData}
        setPaymentFormData={setPaymentFormData}
        handlePaymentSubmit={handlePaymentSubmit}
        isSubmittingPayment={isSubmittingPayment}
        balanceDue={balanceDue}
        params={params}
        router={router}
      />

      {/* Invoice Content Component */}
      <InvoiceContent
        invoice={invoice}
        totalPaid={totalPaid}
        balanceDue={balanceDue}
      />

      {/* Hidden printable invoice */}
      <div className="hidden">
        <div ref={printRef}>
          <InvoicePrint
            invoice={invoice}
            companyLogo={profile?.logo}
            companyName={profile?.company_name || "Your Company"}
          />
        </div>
      </div>
    </div>
  );
}
