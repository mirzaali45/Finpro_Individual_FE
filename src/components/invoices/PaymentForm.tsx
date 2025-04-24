// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { formatCurrency } from "@/lib/utils";
// import { PaymentMethod } from "@/types";

// // Make sure this matches the interface in StatusManagement.tsx
// export interface PaymentFormData {
//   amount: number;
//   payment_date: string;
//   payment_method: PaymentMethod; // Using the imported PaymentMethod type
//   reference: string;
//   notes: string;
// }

// interface PaymentFormProps {
//   paymentFormData: PaymentFormData;
//   setPaymentFormData: (data: PaymentFormData) => void;
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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { PaymentMethod, BankAccount, EWallet } from "@/types";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaymentFormData {
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference: string;
  notes: string;
  bank_account_id?: number;
  e_wallet_id?: number;
}

interface PaymentFormProps {
  paymentFormData: PaymentFormData;
  setPaymentFormData: (data: PaymentFormData) => void;
  balanceDue: number;
  isSubmittingPayment: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  bankAccounts?: BankAccount[];
  eWallets?: EWallet[];
}

export default function PaymentForm({
  paymentFormData,
  setPaymentFormData,
  balanceDue,
  isSubmittingPayment,
  onSubmit,
  onCancel,
  bankAccounts = [],
  eWallets = [],
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    paymentFormData.payment_method
  );

  // Initialize default payment method based on available options - ONE TIME ONLY
  useEffect(() => {
    // Check only once, at component mount
    if (paymentMethod === "BANK_TRANSFER" && bankAccounts.length === 0) {
      if (eWallets.length > 0) {
        setPaymentMethod("E_WALLET");
      } else {
        setPaymentMethod("CASH");
      }
    } else if (paymentMethod === "E_WALLET" && eWallets.length === 0) {
      if (bankAccounts.length > 0) {
        setPaymentMethod("BANK_TRANSFER");
      } else {
        setPaymentMethod("CASH");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for one-time execution

  // Effect to update form data when payment method changes
  useEffect(() => {
    // Only update if payment method actually changed
    if (paymentFormData.payment_method !== paymentMethod) {
      const updatedData: PaymentFormData = {
        ...paymentFormData,
        payment_method: paymentMethod,
        bank_account_id: undefined,
        e_wallet_id: undefined,
      };

      if (paymentMethod === "BANK_TRANSFER" && bankAccounts.length > 0) {
        // Find primary bank account or use first one
        const primaryAccount =
          bankAccounts.find((acc) => acc.is_primary) || bankAccounts[0];
        updatedData.bank_account_id = primaryAccount.id;
      } else if (paymentMethod === "E_WALLET" && eWallets.length > 0) {
        // Find primary e-wallet or use first one
        const primaryWallet =
          eWallets.find((wallet) => wallet.is_primary) || eWallets[0];
        updatedData.e_wallet_id = primaryWallet.id;
      }

      setPaymentFormData(updatedData);
    }
  }, [
    paymentMethod,
    bankAccounts,
    eWallets,
    paymentFormData,
    setPaymentFormData,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPaymentFormData({
      ...paymentFormData,
      [name]: name === "amount" ? Number(value) : value,
    });
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  const handleBankAccountChange = (value: string) => {
    setPaymentFormData({
      ...paymentFormData,
      bank_account_id: parseInt(value),
      e_wallet_id: undefined,
    });
  };

  const handleEWalletChange = (value: string) => {
    setPaymentFormData({
      ...paymentFormData,
      e_wallet_id: parseInt(value),
      bank_account_id: undefined,
    });
  };

  // Check if there are no payment methods
  const noPaymentMethods = bankAccounts.length === 0 && eWallets.length === 0;

  if (noPaymentMethods) {
    return (
      <div className="mt-4 border-t pt-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">No payment methods available</p>
            <p className="mt-1">
              You need to add at least one payment method in your profile
              settings before recording payments.
            </p>
            <Button
              className="mt-2"
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/dashboard/profile")}
            >
              Go to Profile Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              className="pl-12"
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
          <Select
            value={paymentMethod}
            onValueChange={handlePaymentMethodChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {bankAccounts.length > 0 && (
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              )}
              {eWallets.length > 0 && (
                <SelectItem value="E_WALLET">E-Wallet</SelectItem>
              )}
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show bank accounts dropdown if bank transfer is selected */}
        {paymentMethod === "BANK_TRANSFER" && bankAccounts.length > 0 && (
          <div>
            <label
              htmlFor="bank_account_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bank Account*
            </label>
            <Select
              value={paymentFormData.bank_account_id?.toString() || ""}
              onValueChange={handleBankAccountChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select bank account" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.bank_name} - {account.account_number}
                    {account.is_primary && " (Primary)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Show e-wallets dropdown if e-wallet is selected */}
        {paymentMethod === "E_WALLET" && eWallets.length > 0 && (
          <div>
            <label
              htmlFor="e_wallet_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-Wallet*
            </label>
            <Select
              value={paymentFormData.e_wallet_id?.toString() || ""}
              onValueChange={handleEWalletChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select e-wallet" />
              </SelectTrigger>
              <SelectContent>
                {eWallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id.toString()}>
                    {wallet.wallet_type} - {wallet.phone_number}
                    {wallet.is_primary && " (Primary)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="mb-4">
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
