// src/components/products/ProductCard.tsx
import { Product } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tag, DollarSign, Archive, Image as ImageIcon } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isArchived = !!product.deleted_at;

  return (
    <Link href={`/dashboard/products/${product.product_id}`} className="block">
      <Card
        className={`h-full transition-shadow hover:shadow-md ${
          isArchived ? "bg-gray-50" : ""
        }`}
      >
        {product.image && (
          <div className="relative w-full h-40 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardHeader className={`pb-2 ${product.image ? "pt-3" : ""}`}>
          <div className="flex items-center justify-between">
            <CardTitle
              className="text-lg font-bold line-clamp-1"
              title={product.name}
            >
              {product.name}
            </CardTitle>
            <span className="font-bold text-lg">
              {formatCurrency(Number(product.price))}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          {product.description && (
            <div className="mb-3">
              <p
                className="text-sm text-gray-600 line-clamp-2"
                title={product.description}
              >
                {product.description}
              </p>
            </div>
          )}

          <div className="flex items-center text-xs text-gray-500 mb-2">
            {product.unit && (
              <div className="flex items-center mr-4" title="Unit">
                <Tag className="h-3 w-3 mr-1" />
                <span>{product.unit}</span>
              </div>
            )}

            {product.tax_rate && product.tax_rate > 0 && (
              <div className="flex items-center" title="Tax Rate">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>{product.tax_rate}%</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {product.category && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {product.category}
              </Badge>
            )}

            {isArchived && (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 border-gray-300 flex items-center"
              >
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </Badge>
            )}
          </div>

          <div className="text-xs text-gray-400 mt-3">
            Last updated: {formatDate(product.updated_at)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
