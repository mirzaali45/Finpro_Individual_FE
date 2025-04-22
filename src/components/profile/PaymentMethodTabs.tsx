// src/components/profile/PaymentMethodsTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { User, Profile, BankAccount, EWallet } from "@/types";
import { ApiError } from "@/lib/utils";
import BankAccountForm from "./BankAccountForm";
import BankAccountsList from "./BankAccountList";
import WalletForm from "./EwalletForm";
import WalletsList from "./EwalletList";

interface PaymentMethodsTabProps {
  bankAccounts: BankAccount[];
  eWallets: EWallet[];
  updateUserData: (data: {
    user: User;
    profile: Profile | null;
    bankAccounts: BankAccount[];
    eWallets: EWallet[];
  }) => void;
  user: User | null;
  profile: Profile | null;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

export default function PaymentMethodsTab({
  bankAccounts,
  eWallets,
  updateUserData,
  user,
  profile,
  setError,
  setSuccess,
}: PaymentMethodsTabProps) {
  const [showBankForm, setShowBankForm] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Penanganan state lokal untuk bank accounts dan e-wallets
  const [localBankAccounts, setLocalBankAccounts] = useState<BankAccount[]>(
    bankAccounts || []
  );
  const [localEWallets, setLocalEWallets] = useState<EWallet[]>(eWallets || []);

  // Gabungkan data dari props dan state lokal untuk dirender
  const currentBankAccounts =
    localBankAccounts.length > 0 ? localBankAccounts : bankAccounts || [];
  const currentEWallets =
    localEWallets.length > 0 ? localEWallets : eWallets || [];

  // Bank account handlers
  const handleBankFormSubmit = async (formData: {
    bank_name: string;
    account_number: string;
    account_name: string;
    is_primary: boolean;
  }) => {
    setError("");
    setSuccess("");
    setIsProcessing(true);

    try {
      console.log("Submitting bank account data:", formData);
      const response = await authApi.addBankAccount(formData);
      console.log("Bank account response:", response);

      if (response && response.bankAccount) {
        // Update bank accounts in local state
        const newBankAccounts = [...currentBankAccounts];

        // If this is a primary account, update other accounts
        if (formData.is_primary) {
          newBankAccounts.forEach((account) => {
            account.is_primary = false;
          });
        }

        // Add the new account
        newBankAccounts.push(response.bankAccount);

        // Update local state
        setLocalBankAccounts(newBankAccounts);

        // Also update global state
        updateUserData({
          user: user!,
          profile: profile,
          bankAccounts: newBankAccounts,
          eWallets: currentEWallets,
        });

        setSuccess("Bank account added successfully");
        setShowBankForm(false);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err: unknown) {
      console.error("Error adding bank account:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to add bank account. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteBankAccount = async (id: number) => {
    setIsProcessing(true);
    try {
      await authApi.deleteBankAccount(id);

      // Update bank accounts in local state
      const newBankAccounts = currentBankAccounts.filter(
        (account) => account.id !== id
      );

      // Update local state
      setLocalBankAccounts(newBankAccounts);

      // Also update global state
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: newBankAccounts,
        eWallets: currentEWallets,
      });

      setSuccess("Bank account deleted successfully");
    } catch (err: unknown) {
      console.error("Error deleting bank account:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to delete bank account. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetPrimaryBank = async (id: number) => {
    setIsProcessing(true);
    try {
      await authApi.updateBankAccount(id, {
        is_primary: true,
      });

      // Update bank accounts in local state
      const newBankAccounts = currentBankAccounts.map((account) =>
        account.id === id
          ? { ...account, is_primary: true }
          : { ...account, is_primary: false }
      );

      // Update local state
      setLocalBankAccounts(newBankAccounts);

      // Also update global state
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: newBankAccounts,
        eWallets: currentEWallets,
      });

      setSuccess("Primary bank account updated successfully");
    } catch (err: unknown) {
      console.error("Error setting primary bank account:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to update primary bank account. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // E-wallet handlers
  const handleWalletFormSubmit = async (formData: {
    wallet_type: string;
    phone_number: string;
    account_name: string;
    is_primary: boolean;
  }) => {
    setError("");
    setSuccess("");
    setIsProcessing(true);

    try {
      console.log("Submitting e-wallet data:", formData);
      const response = await authApi.addEWallet(formData);
      console.log("E-wallet response:", response);

      if (response && response.eWallet) {
        // Update e-wallets in local state
        const newEWallets = [...currentEWallets];

        // If this is a primary wallet, update other wallets
        if (formData.is_primary) {
          newEWallets.forEach((wallet) => {
            wallet.is_primary = false;
          });
        }

        // Add the new wallet
        newEWallets.push(response.eWallet);

        // Update local state
        setLocalEWallets(newEWallets);

        // Also update global state
        updateUserData({
          user: user!,
          profile: profile,
          bankAccounts: currentBankAccounts,
          eWallets: newEWallets,
        });

        setSuccess("E-wallet added successfully");
        setShowWalletForm(false);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err: unknown) {
      console.error("Error adding e-wallet:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to add e-wallet. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteWallet = async (id: number) => {
    setIsProcessing(true);
    try {
      await authApi.deleteEWallet(id);

      // Update e-wallets in local state
      const newEWallets = currentEWallets.filter((wallet) => wallet.id !== id);

      // Update local state
      setLocalEWallets(newEWallets);

      // Also update global state
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: currentBankAccounts,
        eWallets: newEWallets,
      });

      setSuccess("E-wallet deleted successfully");
    } catch (err: unknown) {
      console.error("Error deleting e-wallet:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to delete e-wallet. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetPrimaryWallet = async (id: number) => {
    setIsProcessing(true);
    try {
      await authApi.updateEWallet(id, { is_primary: true });

      // Update e-wallets in local state
      const newEWallets = currentEWallets.map((wallet) =>
        wallet.id === id
          ? { ...wallet, is_primary: true }
          : { ...wallet, is_primary: false }
      );

      // Update local state
      setLocalEWallets(newEWallets);

      // Also update global state
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: currentBankAccounts,
        eWallets: newEWallets,
      });

      setSuccess("Primary e-wallet updated successfully");
    } catch (err: unknown) {
      console.error("Error setting primary e-wallet:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to update primary e-wallet. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bank Accounts Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Bank Accounts</h3>
          {!showBankForm && (
            <Button
              type="button"
              onClick={() => setShowBankForm(true)}
              size="sm"
              disabled={isProcessing}
            >
              Add Bank Account
            </Button>
          )}
        </div>

        {/* Bank Account Form */}
        {showBankForm && (
          <BankAccountForm
            onSubmit={handleBankFormSubmit}
            onCancel={() => setShowBankForm(false)}
          />
        )}

        {/* Bank Accounts List */}
        <BankAccountsList
          bankAccounts={currentBankAccounts}
          onSetPrimary={handleSetPrimaryBank}
          onDelete={handleDeleteBankAccount}
          onAddNew={() => setShowBankForm(true)}
        />
      </div>

      {/* E-Wallets Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">E-Wallets</h3>
          {!showWalletForm && (
            <Button
              type="button"
              onClick={() => setShowWalletForm(true)}
              size="sm"
              disabled={isProcessing}
            >
              Add E-Wallet
            </Button>
          )}
        </div>

        {/* E-Wallet Form */}
        {showWalletForm && (
          <WalletForm
            onSubmit={handleWalletFormSubmit}
            onCancel={() => setShowWalletForm(false)}
          />
        )}

        {/* E-Wallets List */}
        <WalletsList
          eWallets={currentEWallets}
          onSetPrimary={handleSetPrimaryWallet}
          onDelete={handleDeleteWallet}
          onAddNew={() => setShowWalletForm(true)}
        />
      </div>
    </div>
  );
}
