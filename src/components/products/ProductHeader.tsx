// src/components/products/ProductsHeader.tsx
import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">Products & Services</h1>
      <Link href="/dashboard/products/new">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </Link>
    </div>
  );
}
