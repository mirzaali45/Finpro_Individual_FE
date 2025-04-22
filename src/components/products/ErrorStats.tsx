// src/components/products/ErrorState.tsx
import React from "react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
      <span>{error}</span>
      <button
        onClick={onRetry}
        className="ml-auto underline text-red-600 hover:text-red-800"
      >
        Try again
      </button>
    </div>
  );
}
