// src/app/(auth)/verify-chang-email/[token]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, XCircle } from "lucide-react";

// Untuk App Router dengan parameter dinamis
interface VerifyEmailChangeParams {
  params: {
    token: string;
  };
}

export default function VerifyEmailChange({ params }: VerifyEmailChangeParams) {
  const router = useRouter();
  const token = params.token;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmailChange = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. No token provided.");
        return;
      }

      try {
        // Mengirim token langsung sebagai string, bukan sebagai objek
        const response = await authApi.verifyChangeEmail(token);
        if (response && response.status === "success") {
          setStatus("success");
          setMessage(
            response.message || "Your email has been successfully changed."
          );
        } else {
          throw new Error(
            response?.message || "Failed to verify email change."
          );
        }
      } catch (err: any) {
        console.error("Email verification error:", err);
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            err.message ||
            "Failed to verify email change. The token may be invalid or expired."
        );
      }
    };

    verifyEmailChange();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>

          <div className="mt-8">
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-gray-600">Verifying your email change...</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-green-700">{message}</p>
                <div className="flex items-center justify-center mt-4">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-600">
                    You can now use your new email to login.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-red-700">{message}</p>
                <p className="text-sm text-gray-600">
                  There was a problem verifying your email change. Please try
                  requesting a new email change.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
