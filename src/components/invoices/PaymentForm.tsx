// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { formatCurrency } from "@/lib/utils";
// import { PaymentMethod } from "@/types";

// interface PaymentFormProps {
//   paymentFormData: {
//     amount: number;
//     payment_date: string;
//     payment_method: PaymentMethod;
//     reference: string;
//     notes: string;
//   };
//   setPaymentFormData: (data: any) => void;
//   balanceDue: number;
//   isSubmittingPayment: boolean;
//   onSubmit: (e: React.FormEvent) => void;
//   onCancel: () => void;
// }

// export default function PaymentForm({
//   paymentFormData,
//   setPaymentFormData,
//   balanceDue,
//   isSubmittingPayment,
//   onSubmit,
//   onCancel,
// }: PaymentFormProps) {
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setPaymentFormData({
//       ...paymentFormData,
//       [name]: name === "amount" ? Number(value) : value,
//     });
//   };

//   return (
//     <form onSubmit={onSubmit} className="mt-4 border-t pt-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label
//             htmlFor="amount"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Payment Amount*
//           </label>
//           <div className="relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="text-gray-500 sm:text-sm">Rp</span>
//             </div>
//             <Input
//               type="number"
//               name="amount"
//               id="amount"
//               value={paymentFormData.amount}
//               onChange={handleChange}
//               className="pl-12 pr-12"
//               required
//             />
//           </div>
//           <p className="mt-1 text-sm text-gray-500">
//             Balance due: {formatCurrency(balanceDue)}
//           </p>
//         </div>

//         <div>
//           <label
//             htmlFor="payment_date"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Payment Date*
//           </label>
//           <Input
//             type="date"
//             name="payment_date"
//             id="payment_date"
//             value={paymentFormData.payment_date}
//             onChange={handleChange}
//             required
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label
//             htmlFor="payment_method"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Payment Method*
//           </label>
//           <select
//             id="payment_method"
//             name="payment_method"
//             value={paymentFormData.payment_method}
//             onChange={handleChange}
//             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
//             required
//           >
//             <option value="CASH">Cash</option>
//             <option value="BANK_TRANSFER">Bank Transfer</option>
//             <option value="E_WALLET">E-Wallet</option>
//             <option value="OTHER">Other</option>
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="reference"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Reference / Transaction ID
//           </label>
//           <Input
//             type="text"
//             name="reference"
//             id="reference"
//             value={paymentFormData.reference}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       <div className="mb-4">
//         <label
//           htmlFor="notes"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Notes
//         </label>
//         <textarea
//           id="notes"
//           name="notes"
//           value={paymentFormData.notes}
//           onChange={handleChange}
//           rows={3}
//           className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
//         ></textarea>
//       </div>

//       <div className="flex justify-end space-x-2">
//         <Button variant="outline" type="button" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isSubmittingPayment}>
//           {isSubmittingPayment ? "Saving..." : "Save Payment"}
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
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="E_WALLET">E-Wallet</option>
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
