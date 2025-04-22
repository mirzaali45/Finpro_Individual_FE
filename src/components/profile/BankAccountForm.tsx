// src/components/profile/BankAccountForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BankFormData {
  bank_name: string;
  account_number: string;
  account_name: string;
  is_primary: boolean;
}

interface BankAccountFormProps {
  onSubmit: (data: BankFormData) => Promise<void>;
  onCancel: () => void;
}

export default function BankAccountForm({
  onSubmit,
  onCancel,
}: BankAccountFormProps) {
  const [formData, setFormData] = useState<BankFormData>({
    bank_name: "",
    account_number: "",
    account_name: "",
    is_primary: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Menambahkan stopPropagation untuk mencegah event bubble up

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting bank account form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 p-4 border rounded-md bg-gray-50">
      <h4 className="text-sm font-medium mb-3">New Bank Account</h4>
      {/* PENTING: Menggunakan onSubmit={(e) => handleSubmit(e)} */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        <div>
          <label
            htmlFor="bank_name"
            className="block text-sm font-medium text-gray-700"
          >
            Bank Name*
          </label>
          <Input
            id="bank_name"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="account_number"
            className="block text-sm font-medium text-gray-700"
          >
            Account Number*
          </label>
          <Input
            id="account_number"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="account_name"
            className="block text-sm font-medium text-gray-700"
          >
            Account Holder Name*
          </label>
          <Input
            id="account_name"
            name="account_name"
            value={formData.account_name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div className="flex items-center">
          <input
            id="is_primary"
            name="is_primary"
            type="checkbox"
            checked={formData.is_primary}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_primary"
            className="ml-2 block text-sm text-gray-700"
          >
            Set as primary bank account
          </label>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {/* Penting: Ganti menjadi tombol dengan onClick handler */}
          <Button
            type="button"
            onClick={(e) => handleSubmit(e)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Bank Account"}
          </Button>
        </div>
      </form>
    </div>
  );
}
