import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface InvoiceItemFormProps {
  products: Product[];
  initialItem?: {
    product_id: number;
    quantity: number;
    description?: string;
  };
  onSave: (item: {
    product_id: number;
    quantity: number;
    description?: string;
  }) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function InvoiceItemForm({
  products,
  initialItem,
  onSave,
  onCancel,
  onDelete,
}: InvoiceItemFormProps) {
  const [item, setItem] = useState({
    product_id:
      initialItem?.product_id ||
      (products.length > 0 ? products[0].product_id : 0),
    quantity: initialItem?.quantity || 1,
    description: initialItem?.description || "",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [itemTotal, setItemTotal] = useState(0);

  useEffect(() => {
    const product = products.find((p) => p.product_id === item.product_id);
    setSelectedProduct(product || null);

    if (product) {
      setItemTotal(product.price * item.quantity);

      // If we're selecting a new product and there's no description yet, use the product description
      if (!initialItem && !item.description && product.description) {
        setItem((prev) => ({
          ...prev,
          description: product.description || "",
        }));
      }
    }
  }, [item.product_id, item.quantity, products, initialItem, item.description]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setItem({
      ...item,
      [name]:
        name === "quantity"
          ? Math.max(1, parseInt(value) || 1)
          : name === "product_id"
          ? parseInt(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="product_id"
            className="block text-sm font-medium text-gray-700"
          >
            Product/Service*
          </label>
          <select
            id="product_id"
            name="product_id"
            value={item.product_id}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            required
          >
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.name} ({formatCurrency(product.price)})
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-md sm:col-span-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                Unit Price:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(selectedProduct.price)}
              </span>
            </div>
            {selectedProduct.tax_rate && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Tax Rate:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedProduct.tax_rate}%
                </span>
              </div>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity*
          </label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div className="flex items-end">
          <div className="bg-gray-50 p-4 rounded-md w-full">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">
                Item Total:
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(itemTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={item.description}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onDelete && (
          <Button
            type="button"
            variant="outline"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Item</Button>
      </div>
    </form>
  );
}