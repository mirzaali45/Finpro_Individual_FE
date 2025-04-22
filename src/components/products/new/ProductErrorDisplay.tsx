// src/components/products/ProductErrorDisplay.tsx
import React from "react";
import { AlertCircle } from "lucide-react";

interface ProductErrorDisplayProps {
  error: string;
}

export default function ProductErrorDisplay({
  error,
}: ProductErrorDisplayProps) {
  if (!error) return null;

  return (
    <div
      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start"
      role="alert"
    >
      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      <p>{error}</p>
    </div>
  );
}
