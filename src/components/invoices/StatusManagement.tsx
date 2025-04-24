// import { Button } from "@/components/ui/button";
// import { Invoice } from "@/types";
// import { Clock, CheckCircle, AlertTriangle, Send } from "lucide-react";
// import PaymentForm, { PaymentFormData } from "./PaymentForm";

// interface RouterInterface {
//   push: (url: string) => void;
// }

// interface StatusManagementProps {
//   invoice: Invoice;
//   onStatusChange: (status: string) => void;
//   onSendReminder?: () => void;
//   showPaymentForm: boolean;
//   setShowPaymentForm: (show: boolean) => void;
//   paymentFormData: PaymentFormData;
//   setPaymentFormData: (data: PaymentFormData) => void;
//   handlePaymentSubmit: (e: React.FormEvent) => void;
//   isSubmittingPayment: boolean;
//   balanceDue: number;
//   params: { id: string };
//   router: RouterInterface;
// }

// export default function StatusManagement({
//   invoice,
//   onStatusChange,
//   onSendReminder,
//   showPaymentForm,
//   setShowPaymentForm,
//   paymentFormData,
//   setPaymentFormData,
//   handlePaymentSubmit,
//   isSubmittingPayment,
//   balanceDue,
//   params,
//   router,
// }: StatusManagementProps) {
//   const StatusIcon = () => {
//     switch (invoice?.status) {
//       case "PAID":
//         return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case "PENDING":
//         return <Clock className="h-5 w-5 text-blue-500" />;
//       case "OVERDUE":
//         return <AlertTriangle className="h-5 w-5 text-red-500" />;
//       case "PARTIAL":
//         return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
//       default:
//         return null;
//     }
//   };

//   if (invoice.status === "PAID" || invoice.status === "CANCELLED") {
//     return null;
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-sm">
//       <div className="flex flex-col sm:flex-row justify-between items-center">
//         <div className="flex items-center mb-4 sm:mb-0">
//           <StatusIcon />
//           <span className="ml-2 text-sm font-medium">
//             {invoice.status === "PENDING" && "This invoice is awaiting payment"}
//             {invoice.status === "OVERDUE" && "This invoice is overdue"}
//             {invoice.status === "PARTIAL" &&
//               "This invoice has been partially paid"}
//             {invoice.status === "DRAFT" && "This invoice is in draft mode"}
//           </span>
//         </div>

//         <div className="flex gap-2">
//           {invoice.status === "DRAFT" && (
//             <>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={() => onStatusChange("PENDING")}
//               >
//                 <Send className="h-4 w-4 mr-2" />
//                 Send Invoice
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={() =>
//                   router.push(`/dashboard/invoices/${params.id}/edit`)
//                 }
//               >
//                 Edit Invoice
//               </Button>
//             </>
//           )}

//           {(invoice.status === "PENDING" ||
//             invoice.status === "OVERDUE" ||
//             invoice.status === "PARTIAL") && (
//             <>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={() => setShowPaymentForm(true)}
//                 disabled={showPaymentForm}
//               >
//                 Record Payment
//               </Button>
//               <Button size="sm" onClick={() => onStatusChange("PAID")}>
//                 Mark as Paid
//               </Button>
//               {onSendReminder && (
//                 <Button size="sm" variant="outline" onClick={onSendReminder}>
//                   Send Reminder
//                 </Button>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Payment Form */}
//       {showPaymentForm && (
//         <PaymentForm
//           paymentFormData={paymentFormData}
//           setPaymentFormData={setPaymentFormData}
//           balanceDue={balanceDue}
//           isSubmittingPayment={isSubmittingPayment}
//           onSubmit={handlePaymentSubmit}
//           onCancel={() => setShowPaymentForm(false)}
//         />
//       )}
//     </div>
//   );
// }
import { Button } from "@/components/ui/button";
import { Invoice, BankAccount, EWallet } from "@/types";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  AlertCircle,
} from "lucide-react";
import PaymentForm, { PaymentFormData } from "./PaymentForm";
import { useState } from "react";

interface RouterInterface {
  push: (url: string) => void;
}

interface StatusManagementProps {
  invoice: Invoice;
  onStatusChange: (status: string) => void;
  onSendReminder?: () => void;
  showPaymentForm: boolean;
  setShowPaymentForm: (show: boolean) => void;
  paymentFormData: PaymentFormData;
  setPaymentFormData: (data: PaymentFormData) => void;
  handlePaymentSubmit: (e: React.FormEvent) => void;
  isSubmittingPayment: boolean;
  balanceDue: number;
  params: { id: string };
  router: RouterInterface;
  bankAccounts?: BankAccount[];
  eWallets?: EWallet[];
}

export default function StatusManagement({
  invoice,
  onStatusChange,
  onSendReminder,
  showPaymentForm,
  setShowPaymentForm,
  paymentFormData,
  setPaymentFormData,
  handlePaymentSubmit,
  isSubmittingPayment,
  balanceDue,
  params,
  router,
  bankAccounts = [],
  eWallets = [],
}: StatusManagementProps) {
  const [showNoPaymentMethodsAlert, setShowNoPaymentMethodsAlert] =
    useState(false);

  const StatusIcon = () => {
    switch (invoice?.status) {
      case "PAID":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "OVERDUE":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "PARTIAL":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const handleRecordPaymentClick = () => {
    // Check if payment methods exist
    if (bankAccounts.length === 0 && eWallets.length === 0) {
      setShowNoPaymentMethodsAlert(true);
    } else {
      setShowPaymentForm(true);
    }
  };

  if (invoice.status === "PAID" || invoice.status === "CANCELLED") {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <StatusIcon />
          <span className="ml-2 text-sm font-medium">
            {invoice.status === "PENDING" && "This invoice is awaiting payment"}
            {invoice.status === "OVERDUE" && "This invoice is overdue"}
            {invoice.status === "PARTIAL" &&
              "This invoice has been partially paid"}
            {invoice.status === "DRAFT" && "This invoice is in draft mode"}
          </span>
        </div>

        <div className="flex gap-2">
          {invoice.status === "DRAFT" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange("PENDING")}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/invoices/${params.id}/edit`)
                }
              >
                Edit Invoice
              </Button>
            </>
          )}

          {(invoice.status === "PENDING" ||
            invoice.status === "OVERDUE" ||
            invoice.status === "PARTIAL") && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRecordPaymentClick}
                disabled={showPaymentForm}
              >
                Record Payment
              </Button>
              <Button size="sm" onClick={() => onStatusChange("PAID")}>
                Mark as Paid
              </Button>
              {onSendReminder && (
                <Button size="sm" variant="outline" onClick={onSendReminder}>
                  Send Reminder
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* No Payment Methods Alert */}
      {showNoPaymentMethodsAlert && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">No payment methods available</p>
            <p className="mt-1">
              You need to add at least one payment method in your profile
              settings before recording payments.
            </p>
            <div className="mt-2 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/profile")}
              >
                Go to Profile Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNoPaymentMethodsAlert(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form */}
      {showPaymentForm && (
        <PaymentForm
          paymentFormData={paymentFormData}
          setPaymentFormData={setPaymentFormData}
          balanceDue={balanceDue}
          isSubmittingPayment={isSubmittingPayment}
          onSubmit={handlePaymentSubmit}
          onCancel={() => setShowPaymentForm(false)}
          bankAccounts={bankAccounts}
          eWallets={eWallets}
        />
      )}
    </div>
  );
}
