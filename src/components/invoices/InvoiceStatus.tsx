import { InvoiceStatus } from "@/types";
import { cn } from "@/lib/utils";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export default function InvoiceStatusBadge({
  status,
  className,
}: InvoiceStatusBadgeProps) {
  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-blue-100 text-blue-800";
      case "PARTIAL":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return "Paid";
      case "PENDING":
        return "Pending";
      case "PARTIAL":
        return "Partial";
      case "OVERDUE":
        return "Overdue";
      case "DRAFT":
        return "Draft";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusColor(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
