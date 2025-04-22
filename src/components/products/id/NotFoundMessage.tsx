// src/components/products/NotFoundMessage.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundMessage() {
  return (
    <div
      className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded"
      role="alert"
    >
      <p>Product not found.</p>
      <div className="mt-4">
        <Link href="/dashboard/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    </div>
  );
}
