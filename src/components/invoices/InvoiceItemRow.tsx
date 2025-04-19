import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceItemRowProps {
  item: {
    product_id: number;
    quantity: number;
    description?: string;
  };
  product: Product | undefined;
  onEdit: () => void;
  onDelete: () => void;
  readonly?: boolean;
}

export default function InvoiceItemRow({
  item,
  product,
  onEdit,
  onDelete,
  readonly = false,
}: InvoiceItemRowProps) {
  const price = product?.price || 0;
  const total = item.quantity * price;

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {product?.name || "Unknown Product"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {item.description || product?.description || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
        {item.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
        {formatCurrency(price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
        {formatCurrency(total)}
      </td>
      {!readonly && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </td>
      )}
    </tr>
  );
}
