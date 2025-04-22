// src/components/profile/WalletsList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { EWallet } from "@/types";

interface WalletsListProps {
  eWallets: EWallet[];
  onSetPrimary: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onAddNew: () => void;
}

export default function WalletsList({
  eWallets,
  onSetPrimary,
  onDelete,
  onAddNew,
}: WalletsListProps) {
  if (!eWallets || eWallets.length === 0) {
    return (
      <div className="border rounded-md p-6 text-center">
        <Wallet className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No e-wallets</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new e-wallet.
        </p>
        <div className="mt-6">
          <Button type="button" onClick={onAddNew} size="sm">
            Add E-Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Wallet Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Phone Number
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Account Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {eWallets.map((wallet) => (
            <tr key={wallet.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {wallet.wallet_type}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {wallet.phone_number}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {wallet.account_name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {wallet.is_primary ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetPrimary(wallet.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Set as Primary
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  type="button"
                  onClick={() => onDelete(wallet.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
