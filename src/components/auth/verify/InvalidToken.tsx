import Link from "next/link";
import { Button } from "@/components/ui/button";

interface InvalidTokenProps {
  error: string;
}

export default function InvalidToken({ error }: InvalidTokenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Link Expired</h1>
          <p className="mt-2 text-gray-600">
            The verification link is invalid or has expired
          </p>
        </div>

        <div className="bg-white p-8 shadow-md rounded-lg text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Invalid or Expired Link
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {error || "The verification link you clicked is no longer valid. Please register again to receive a new verification link."}
            </p>
          </div>
          <div className="mt-5">
            <Link href="/register">
              <Button className="w-full">Register Again</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}