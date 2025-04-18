import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerificationSuccess() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Account Verified</h1>
          <p className="mt-2 text-gray-600">
            Your account has been successfully verified.
          </p>
        </div>

        <div className="bg-white p-8 shadow-md rounded-lg text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Verification Complete
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Your account has been successfully verified. You can now log in to
              access your dashboard.
            </p>
          </div>
          <div className="mt-5">
            <Link href="/login">
              <Button className="w-full">Continue to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
