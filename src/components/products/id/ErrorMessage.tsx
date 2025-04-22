// src/components/products/ErrorMessage.tsx
import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  error: string;
  hasBackButton?: boolean;
  backUrl?: string;
}

export default function ErrorMessage({
  error,
  hasBackButton = false,
  backUrl = "/dashboard/products",
}: ErrorMessageProps) {
  return (
    <div
      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start"
      role="alert"
    >
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
      <div>
        <p>{error}</p>
        {hasBackButton && (
          <div className="mt-4">
            <Link href={backUrl}>
              <Button>Back to Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
