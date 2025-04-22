// src/components/profile/AccountSettingsTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import ChangeEmailForm from "@/components/profile/ChangeEmailForm";
import { User } from "@/types";

interface AccountSettingsTabProps {
  user: User | null;
}

export default function AccountSettingsTab({ user }: AccountSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Email Change Section */}
      <div className="px-4 py-5 sm:p-6 bg-gray-50 rounded-md">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-base font-medium leading-6 text-gray-900">
              Email Address
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your email address. You will need to verify the new email
              before the change takes effect.
            </p>
          </div>
          {/* Use ChangeEmailForm component */}
          {user?.email && <ChangeEmailForm currentEmail={user.email} />}
        </div>
      </div>

      {/* Password Reset Section */}
      <div className="px-4 py-5 sm:p-6 bg-gray-50 rounded-md">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-base font-medium leading-6 text-gray-900">
              Change Password
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your password using the Reset Password flow.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = "/reset-password")}
            >
              Reset Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
