// src/components/profile/WalletForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WalletFormData {
  wallet_type: string;
  phone_number: string;
  account_name: string;
  is_primary: boolean;
}

interface WalletFormProps {
  onSubmit: (data: WalletFormData) => Promise<void>;
  onCancel: () => void;
}

export default function WalletForm({ onSubmit, onCancel }: WalletFormProps) {
  const [formData, setFormData] = useState<WalletFormData>({
    wallet_type: "",
    phone_number: "",
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

  const handleWalletTypeChange = (value: string) => {
    setFormData({
      ...formData,
      wallet_type: value,
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
      console.error("Error submitting wallet form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 p-4 border rounded-md bg-gray-50">
      <h4 className="text-sm font-medium mb-3">New E-Wallet</h4>
      {/* PENTING: Menggunakan onSubmit={(e) => handleSubmit(e)} */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        <div>
          <label
            htmlFor="wallet_type"
            className="block text-sm font-medium text-gray-700"
          >
            Wallet Type*
          </label>
          <Select
            onValueChange={handleWalletTypeChange}
            value={formData.wallet_type}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a wallet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GoPay">GoPay</SelectItem>
              <SelectItem value="OVO">OVO</SelectItem>
              <SelectItem value="DANA">DANA</SelectItem>
              <SelectItem value="LinkAja">LinkAja</SelectItem>
              <SelectItem value="ShopeePay">ShopeePay</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number*
          </label>
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
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
            Account Name*
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
            id="is_primary_wallet"
            name="is_primary"
            type="checkbox"
            checked={formData.is_primary}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_primary_wallet"
            className="ml-2 block text-sm text-gray-700"
          >
            Set as primary e-wallet
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
            {isSubmitting ? "Saving..." : "Save E-Wallet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
