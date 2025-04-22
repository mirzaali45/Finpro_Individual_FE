// src/components/products/ProductFormHeader.tsx
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProductFormHeaderProps {
  title: string;
  backUrl: string;
  error?: string; // Make error optional
}

export default function ProductFormHeader({
  title,
  backUrl, // Accept error prop
}: ProductFormHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href={backUrl} className="rounded-full p-2 hover:bg-gray-100">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
  );
}
