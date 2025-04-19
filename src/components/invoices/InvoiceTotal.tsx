import { formatCurrency } from "@/lib/utils";

interface InvoiceTotalsProps {
  subtotal: number;
  taxAmount: number;
  discountAmount?: number;
  totalAmount: number;
  totalPaid?: number;
  className?: string;
}

export default function InvoiceTotals({
  subtotal,
  taxAmount,
  discountAmount = 0,
  totalAmount,
  totalPaid,
  className = "",
}: InvoiceTotalsProps) {
  const balanceDue =
    totalPaid !== undefined ? totalAmount - totalPaid : undefined;

  return (
    <div className={`bg-gray-50 p-4 rounded-md ${className}`}>
      <dl className="space-y-2">
        <div className="flex justify-between py-1">
          <dt className="text-sm text-gray-500">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-sm text-gray-500">Tax</dt>
          <dd className="text-sm font-medium text-gray-900">
            {formatCurrency(taxAmount)}
          </dd>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between py-1">
            <dt className="text-sm text-gray-500">Discount</dt>
            <dd className="text-sm font-medium text-gray-900">
              -{formatCurrency(discountAmount)}
            </dd>
          </div>
        )}
        <div className="flex justify-between py-1 border-t border-gray-200 mt-2">
          <dt className="text-sm font-medium text-gray-900">Total</dt>
          <dd className="text-sm font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </dd>
        </div>

        {totalPaid !== undefined && (
          <>
            <div className="flex justify-between py-1">
              <dt className="text-sm text-gray-500">Amount Paid</dt>
              <dd className="text-sm font-medium text-green-600">
                {formatCurrency(totalPaid)}
              </dd>
            </div>
            <div className="flex justify-between py-1 border-t border-gray-200 mt-2">
              <dt className="text-sm font-bold text-gray-900">Balance Due</dt>
              <dd className="text-sm font-bold text-gray-900">
                {formatCurrency(balanceDue || 0)}
              </dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
