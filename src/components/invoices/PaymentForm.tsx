// import { useState } from "react";
// import { PaymentMethod } from "@/types";
// import { Button } from "@/components/ui/button";
// import { formatCurrency } from "@/lib/utils";

// interface PaymentFormProps {
//   invoiceId: number;
//   balanceDue: number;
//   onSubmit: (data: {
//     invoice_id: number;
//     amount: number;
//     payment_date: string;
//     payment_method: PaymentMethod;
//     reference: string;
//     notes: string;
//   }) => Promise<void>;
//   onCancel: () => void;
// }

// export default function PaymentForm({
//   invoiceId,
//   balanceDue,
//   onSubmit,
//   onCancel,
// }: PaymentFormProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [paymentData, setPaymentData] = useState({
//     invoice_id: invoiceId,
//     amount: balanceDue,
//     payment_date: new Date().toISOString().split("T")[0],
//     payment_method: "BANK_TRANSFER" as PaymentMethod,
//     reference: "",
//     notes: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value, type } = e.target;
//     setPaymentData({
//       ...paymentData,
//       [name]: type === "number" ? parseFloat(value) || 0 : value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (paymentData.amount <= 0) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await onSubmit(paymentData);
//     } catch (error) {
//       console.error("Error recording payment:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
//     >
//       <div className="sm:col-span-3">
//         <label
//           htmlFor="amount"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Payment Amount*
//         </label>
//         <div className="mt-1 relative rounded-md shadow-sm">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <span className="text-gray-500 sm:text-sm">$</span>
//           </div>
//           <input
//             type="number"
//             name="amount"
//             id="amount"
//             step="0.01"
//             min="0.01"
//             max={balanceDue}
//             value={paymentData.amount}
//             onChange={handleChange}
//             className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
//             placeholder="0.00"
//             required
//           />
//           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//             <span className="text-gray-500 sm:text-sm">USD</span>
//           </div>
//         </div>
//         <p className="mt-1 text-xs text-gray-500">
//           {balanceDue > 0
//             ? `Balance due: ${formatCurrency(balanceDue)}`
//             : "This invoice is fully paid"}
//         </p>
//       </div>

//       <div className="sm:col-span-3">
//         <label
//           htmlFor="payment_date"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Payment Date*
//         </label>
//         <div className="mt-1">
//           <input
//             type="date"
//             name="payment_date"
//             id="payment_date"
//             value={paymentData.payment_date}
//             onChange={handleChange}
//             className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
//             required
//           />
//         </div>
//       </div>

//       <div className="sm:col-span-3">
//         <label
//           htmlFor="payment_method"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Payment Method*
//         </label>
//         <div className="mt-1">
//           <select
//             id="payment_method"
//             name="payment_method"
//             value={paymentData.payment_method}
//             onChange={handleChange}
//             className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
//             required
//           >
//             <option value="CASH">Cash</option>
//             <option value="BANK_TRANSFER">Bank Transfer</option>
//             <option value="CREDIT_CARD">Credit Card</option>
//             <option value="DEBIT_CARD">Debit Card</option>
//             <option value="PAYPAL">PayPal</option>
//             <option value="OTHER">Other</option>
//           </select>
//         </div>
//       </div>

//       <div className="sm:col-span-3">
//         <label
//           htmlFor="reference"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Reference / Transaction ID
//         </label>
//         <div className="mt-1">
//           <input
//             type="text"
//             name="reference"
//             id="reference"
//             value={paymentData.reference}
//             onChange={handleChange}
//             className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
//           />
//         </div>
//       </div>

//       <div className="sm:col-span-6">
//         <label
//           htmlFor="notes"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Notes
//         </label>
//         <div className="mt-1">
//           <textarea
//             id="notes"
//             name="notes"
//             rows={2}
//             value={paymentData.notes}
//             onChange={handleChange}
//             className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
//           ></textarea>
//         </div>
//       </div>

//       <div className="sm:col-span-6 flex justify-end gap-2">
//         <Button type="button" variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           disabled={isSubmitting || paymentData.amount <= 0}
//         >
//           {isSubmitting ? "Saving..." : "Save Payment"}
//         </Button>
//       </div>
//     </form>
//   );
// }
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { PaymentMethod } from "@/types";

interface PaymentFormProps {
  paymentFormData: {
    amount: number;
    payment_date: string;
    payment_method: PaymentMethod;
    reference: string;
    notes: string;
  };
  setPaymentFormData: (data: any) => void;
  balanceDue: number;
  isSubmittingPayment: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function PaymentForm({
  paymentFormData,
  setPaymentFormData,
  balanceDue,
  isSubmittingPayment,
  onSubmit,
  onCancel,
}: PaymentFormProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPaymentFormData({
      ...paymentFormData,
      [name]: name === "amount" ? Number(value) : value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 border-t pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payment Amount*
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">Rp</span>
            </div>
            <Input
              type="number"
              name="amount"
              id="amount"
              value={paymentFormData.amount}
              onChange={handleChange}
              className="pl-12 pr-12"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Balance due: {formatCurrency(balanceDue)}
          </p>
        </div>

        <div>
          <label
            htmlFor="payment_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payment Date*
          </label>
          <Input
            type="date"
            name="payment_date"
            id="payment_date"
            value={paymentFormData.payment_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="payment_method"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payment Method*
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={paymentFormData.payment_method}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            required
          >
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="PAYPAL">PayPal</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="reference"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reference / Transaction ID
          </label>
          <Input
            type="text"
            name="reference"
            id="reference"
            value={paymentFormData.reference}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={paymentFormData.notes}
          onChange={handleChange}
          rows={3}
          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmittingPayment}>
          {isSubmittingPayment ? "Saving..." : "Save Payment"}
        </Button>
      </div>
    </form>
  );
}
