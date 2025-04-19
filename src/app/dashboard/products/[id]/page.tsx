// // src/app/dashboard/products/[id]/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { productApi, invoiceApi } from "@/lib/api";
// import { Product, InvoiceItem } from "@/types";
// import { formatCurrency, formatDate } from "@/lib/utils";
// import {
//   ArrowLeft,
//   Edit,
//   Trash2,
//   AlertCircle,
//   Tag,
//   Hash,
//   DollarSign,
//   Calendar,
//   Archive,
//   Image as ImageIcon,
//   ExternalLink,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import CloudinaryImage from "@/components/cloudinaryImage";

// export default function ProductDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const router = useRouter();
//   const productId = parseInt(params.id);

//   const [product, setProduct] = useState<Product | null>(null);
//   const [productUsage, setProductUsage] = useState<InvoiceItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isArchiving, setIsArchiving] = useState(false);
//   const [isRestoring, setIsRestoring] = useState(false);
//   const [error, setError] = useState("");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
//   const [showImageDialog, setShowImageDialog] = useState(false);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setIsLoading(true);
//         setError("");

//         // Fetch product details
//         const productData = await productApi.getProduct(productId);

//         if (!productData) {
//           setError("Product not found");
//           setIsLoading(false);
//           return;
//         }

//         setProduct(productData);

//         // Fetch invoices to check product usage
//         try {
//           const invoiceItems = await productApi.getProductUsage(productId);
//           setProductUsage(Array.isArray(invoiceItems) ? invoiceItems : []);
//         } catch (err) {
//           console.error("Failed to fetch product usage:", err);
//           setProductUsage([]);
//         }
//       } catch (err: any) {
//         console.error("Error fetching product data:", err);
//         setError("Failed to load product details. Please try again.");
//         toast({
//           title: "Error",
//           description: "Failed to load product details",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProductData();
//   }, [productId]);

//   const handleDeleteProduct = async () => {
//     try {
//       setIsDeleting(true);

//       if (!product) return;

//       // Check if product is used in invoices
//       if (productUsage.length > 0) {
//         setError(
//           "Cannot delete product that is used in invoices. Archive it instead."
//         );
//         setShowDeleteConfirm(false);
//         setIsDeleting(false);
//         return;
//       }

//       await productApi.deleteProduct(product.product_id);
//       toast({
//         title: "Success",
//         description: "Product deleted successfully",
//       });
//       router.push("/dashboard/products");
//     } catch (err: any) {
//       console.error("Error deleting product:", err);
//       setError("Failed to delete product. Please try again.");
//       toast({
//         title: "Error",
//         description: err.message || "Failed to delete product",
//         variant: "destructive",
//       });
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteConfirm(false);
//     }
//   };

//   const handleArchiveProduct = async () => {
//     try {
//       setIsArchiving(true);

//       if (!product) return;

//       // Call the API to archive the product
//       const updatedProduct = await productApi.archiveProduct(
//         product.product_id
//       );

//       // Update the local state with the archived product
//       setProduct(updatedProduct);

//       toast({
//         title: "Success",
//         description: "Product archived successfully",
//       });
//     } catch (err: any) {
//       console.error("Error archiving product:", err);
//       setError("Failed to archive product. Please try again.");
//       toast({
//         title: "Error",
//         description: err.message || "Failed to archive product",
//         variant: "destructive",
//       });
//     } finally {
//       setIsArchiving(false);
//       setShowArchiveConfirm(false);
//     }
//   };

//   const handleRestoreProduct = async () => {
//     try {
//       setIsRestoring(true);

//       if (!product) return;

//       // Call the API to restore the product
//       const updatedProduct = await productApi.restoreProduct(
//         product.product_id
//       );

//       // Update the local state with the restored product
//       setProduct(updatedProduct);

//       toast({
//         title: "Success",
//         description: "Product restored successfully",
//       });
//     } catch (err: any) {
//       console.error("Error restoring product:", err);
//       setError("Failed to restore product. Please try again.");
//       toast({
//         title: "Error",
//         description: err.message || "Failed to restore product",
//         variant: "destructive",
//       });
//     } finally {
//       setIsRestoring(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (error && !product) {
//     return (
//       <div
//         className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
//         role="alert"
//       >
//         <p>{error}</p>
//         <div className="mt-4">
//           <Link href="/dashboard/products">
//             <Button>Back to Products</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div
//         className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded"
//         role="alert"
//       >
//         <p>Product not found.</p>
//         <div className="mt-4">
//           <Link href="/dashboard/products">
//             <Button>Back to Products</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const isArchived = !!product.deleted_at;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div className="flex items-center gap-4">
//           <Link
//             href="/dashboard/products"
//             className="rounded-full p-2 hover:bg-gray-100"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Link>
//           <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
//           {isArchived && (
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//               <Archive className="h-3 w-3 mr-1" />
//               Archived
//             </span>
//           )}
//         </div>

//         <div className="flex items-center gap-2">
//           {!isArchived ? (
//             <>
//               <Link href={`/dashboard/products/${productId}/edit`}>
//                 <Button variant="outline" size="sm">
//                   <Edit className="h-4 w-4 mr-2" />
//                   Edit Product
//                 </Button>
//               </Link>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300"
//                 onClick={() => setShowArchiveConfirm(true)}
//               >
//                 <Archive className="h-4 w-4 mr-2" />
//                 Archive
//               </Button>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
//                 onClick={() => setShowDeleteConfirm(true)}
//                 disabled={productUsage.length > 0}
//               >
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete
//               </Button>
//             </>
//           ) : (
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
//               onClick={handleRestoreProduct}
//               disabled={isRestoring}
//             >
//               {isRestoring ? "Restoring..." : "Restore Product"}
//             </Button>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div
//           className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex"
//           role="alert"
//         >
//           <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Delete confirmation dialog */}
//       <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Product</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this product? This action cannot
//               be undone.
//               {productUsage.length > 0 && (
//                 <div className="mt-2 text-red-600 font-medium">
//                   Warning: This product is used in {productUsage.length}{" "}
//                   invoice(s). You cannot delete it while it's referenced in
//                   invoices.
//                 </div>
//               )}
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setShowDeleteConfirm(false)}
//               disabled={isDeleting}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDeleteProduct}
//               disabled={isDeleting || productUsage.length > 0}
//             >
//               {isDeleting ? "Deleting..." : "Delete Product"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Archive confirmation dialog */}
//       <Dialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Archive Product</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to archive this product? Archived products
//               won't appear in your active product list, but will still be
//               available for existing invoices.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setShowArchiveConfirm(false)}
//               disabled={isArchiving}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="default"
//               onClick={handleArchiveProduct}
//               disabled={isArchiving}
//             >
//               {isArchiving ? "Archiving..." : "Archive Product"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Image preview dialog */}
//       <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Product Image</DialogTitle>
//           </DialogHeader>
//           <div className="flex justify-center">
//             {product.image && (
//               <CloudinaryImage
//                 src={product.image}
//                 alt={product.name}
//                 width={300}
//                 height={200}
//                 className="max-h-[70vh] object-contain"
//               />
//             )}
//           </div>
//           <DialogFooter>
//             {product.image && (
//               <a href={product.image} target="_blank" rel="noopener noreferrer">
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <ExternalLink className="h-4 w-4" />
//                   Open Original
//                 </Button>
//               </a>
//             )}
//             <Button onClick={() => setShowImageDialog(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Product information column */}
//         <div className="lg:col-span-1">
//           {/* Product image (if available) */}
//           {product.image && (
//             <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
//               <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
//                   <ImageIcon className="h-5 w-5 mr-2" />
//                   Product Image
//                 </h3>
//               </div>
//               <div className="p-4">
//                 <div
//                   className="w-full h-48 overflow-hidden relative rounded-md cursor-pointer"
//                   onClick={() => setShowImageDialog(true)}
//                 >
//                   <CloudinaryImage
//                     src={product.image}
//                     alt={product.name}
//                     width={300} // Add appropriate width
//                     height={200}
//                     className="object-cover w-full h-full hover:opacity-90 transition-opacity"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
//                     <span className="opacity-0 hover:opacity-100 text-white font-medium">
//                       Click to view
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Product details */}
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Product Information
//               </h3>
//             </div>
//             <div className="px-4 py-5 sm:p-6">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   {product.name}
//                 </h3>
//                 <span className="text-xl font-bold text-gray-900">
//                   {formatCurrency(Number(product.price))}
//                 </span>
//               </div>

//               {product.description && (
//                 <div className="mt-4">
//                   <p className="text-gray-700">{product.description}</p>
//                 </div>
//               )}

//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <dl className="divide-y divide-gray-200">
//                   {product.unit && (
//                     <div className="py-3 flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500 flex items-center">
//                         <Tag className="h-4 w-4 mr-2" />
//                         Unit
//                       </dt>
//                       <dd className="text-sm text-gray-900">{product.unit}</dd>
//                     </div>
//                   )}

//                   {product.tax_rate && product.tax_rate > 0 && (
//                     <div className="py-3 flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500 flex items-center">
//                         <Hash className="h-4 w-4 mr-2" />
//                         Tax Rate
//                       </dt>
//                       <dd className="text-sm text-gray-900">
//                         {product.tax_rate}%
//                       </dd>
//                     </div>
//                   )}

//                   {product.category && (
//                     <div className="py-3 flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500 flex items-center">
//                         <DollarSign className="h-4 w-4 mr-2" />
//                         Category
//                       </dt>
//                       <dd className="text-sm text-gray-900">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {product.category}
//                         </span>
//                       </dd>
//                     </div>
//                   )}

//                   <div className="py-3 flex justify-between">
//                     <dt className="text-sm font-medium text-gray-500 flex items-center">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       Created
//                     </dt>
//                     <dd className="text-sm text-gray-900">
//                       {formatDate(product.created_at)}
//                     </dd>
//                   </div>

//                   <div className="py-3 flex justify-between">
//                     <dt className="text-sm font-medium text-gray-500 flex items-center">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       Last Updated
//                     </dt>
//                     <dd className="text-sm text-gray-900">
//                       {formatDate(product.updated_at)}
//                     </dd>
//                   </div>

//                   {product.deleted_at && (
//                     <div className="py-3 flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500 flex items-center">
//                         <Archive className="h-4 w-4 mr-2" />
//                         Archived On
//                       </dt>
//                       <dd className="text-sm text-gray-900">
//                         {formatDate(product.deleted_at)}
//                       </dd>
//                     </div>
//                   )}
//                 </dl>
//               </div>
//             </div>
//           </div>

//           {/* Product stats */}
//           <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Usage Statistics
//               </h3>
//             </div>
//             <div className="px-4 py-5 sm:p-6">
//               <dl className="grid grid-cols-1 gap-5">
//                 <div className="overflow-hidden rounded-lg bg-white">
//                   <dt className="truncate text-sm font-medium text-gray-500">
//                     Times Invoiced
//                   </dt>
//                   <dd className="mt-1 text-3xl font-semibold text-gray-900">
//                     {productUsage.length}
//                   </dd>
//                 </div>

//                 {productUsage.length > 0 && (
//                   <>
//                     <div className="overflow-hidden rounded-lg bg-white">
//                       <dt className="truncate text-sm font-medium text-gray-500">
//                         Total Quantity Sold
//                       </dt>
//                       <dd className="mt-1 text-3xl font-semibold text-gray-900">
//                         {productUsage.reduce(
//                           (sum, item) => sum + item.quantity,
//                           0
//                         )}
//                       </dd>
//                     </div>
//                     <div className="overflow-hidden rounded-lg bg-white">
//                       <dt className="truncate text-sm font-medium text-gray-500">
//                         Total Revenue
//                       </dt>
//                       <dd className="mt-1 text-3xl font-semibold text-green-600">
//                         {formatCurrency(
//                           productUsage.reduce(
//                             (sum, item) => sum + Number(item.amount),
//                             0
//                           )
//                         )}
//                       </dd>
//                     </div>
//                   </>
//                 )}
//               </dl>
//             </div>
//           </div>
//         </div>

//         {/* Product usage */}
//         <div className="lg:col-span-2">
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Invoices Using This Product
//               </h3>
//             </div>

//             {productUsage.length === 0 ? (
//               <div className="px-4 py-5 sm:p-6 text-center">
//                 <p className="text-sm text-gray-500">
//                   This product hasn't been used in any invoices yet.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Invoice #
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Client
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Quantity
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Unit Price
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Total
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {productUsage.map((item) => {
//                       const invoice = item.invoice;
//                       return (
//                         <tr key={item.item_id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
//                             <Link
//                               href={`/dashboard/invoices/${item.invoice_id}`}
//                             >
//                               {invoice?.invoice_number ||
//                                 `Invoice #${item.invoice_id}`}
//                             </Link>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {invoice?.client?.name || "Unknown Client"}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                             {item.quantity}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                             {formatCurrency(Number(item.unit_price))}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
//                             {formatCurrency(Number(item.amount))}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Related invoices details */}
//           {productUsage.length > 0 && (
//             <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
//               <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Invoice Status Overview
//                 </h3>
//               </div>
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
//                   <div>
//                     <h4 className="text-base font-medium text-gray-900">
//                       Paid
//                     </h4>
//                     <p className="mt-2 text-3xl font-semibold text-green-600">
//                       {
//                         productUsage.filter(
//                           (item) => item.invoice?.status === "PAID"
//                         ).length
//                       }
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="text-base font-medium text-gray-900">
//                       Pending
//                     </h4>
//                     <p className="mt-2 text-3xl font-semibold text-yellow-600">
//                       {
//                         productUsage.filter(
//                           (item) => item.invoice?.status === "PENDING"
//                         ).length
//                       }
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="text-base font-medium text-gray-900">
//                       Others
//                     </h4>
//                     <p className="mt-2 text-3xl font-semibold text-gray-600">
//                       {
//                         productUsage.filter(
//                           (item) =>
//                             !["PAID", "PENDING"].includes(
//                               item.invoice?.status || ""
//                             )
//                         ).length
//                       }
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// src/app/dashboard/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productApi } from "@/lib/api";
import { Product, InvoiceItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  Tag,
  Hash,
  DollarSign,
  Calendar,
  Archive,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import CloudinaryImage from "@/components/cloudinaryImage";

// Type for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const productId = parseInt(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [productUsage, setProductUsage] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  // First, update the useEffect block with the proper type handling:
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch product details
        const productData = await productApi.getProduct(productId);

        if (!productData) {
          setError("Product not found");
          setIsLoading(false);
          return;
        }

        setProduct(productData);

        // Fetch invoices to check product usage
        try {
          const invoiceItems = await productApi.getProductUsage(productId);

          // Safely transform the data to the expected type
          if (Array.isArray(invoiceItems)) {
            // First cast to unknown, then to InvoiceItem[] as TypeScript suggests
            const typedItems = invoiceItems as unknown as InvoiceItem[];
            setProductUsage(typedItems);
          } else {
            setProductUsage([]);
          }
        } catch (err) {
          console.error("Failed to fetch product usage:", err);
          setProductUsage([]);
        }
      } catch {
        setError("Failed to load product details. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId, toast]);

  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);

      if (!product) return;

      // Check if product is used in invoices
      if (productUsage.length > 0) {
        setError(
          "Cannot delete product that is used in invoices. Archive it instead."
        );
        setShowDeleteConfirm(false);
        setIsDeleting(false);
        return;
      }

      await productApi.deleteProduct(product.product_id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      router.push("/dashboard/products");
    } catch (err: unknown) {
      console.error("Error deleting product:", err);
      const apiError = err as ApiError;
      setError("Failed to delete product. Please try again.");
      toast({
        title: "Error",
        description: apiError.message || "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleArchiveProduct = async () => {
    try {
      setIsArchiving(true);

      if (!product) return;

      // Call the API to archive the product
      const updatedProduct = await productApi.archiveProduct(
        product.product_id
      );

      // Update the local state with the archived product
      setProduct(updatedProduct);

      toast({
        title: "Success",
        description: "Product archived successfully",
      });
    } catch (err: unknown) {
      console.error("Error archiving product:", err);
      const apiError = err as ApiError;
      setError("Failed to archive product. Please try again.");
      toast({
        title: "Error",
        description: apiError.message || "Failed to archive product",
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
      setShowArchiveConfirm(false);
    }
  };

  const handleRestoreProduct = async () => {
    try {
      setIsRestoring(true);

      if (!product) return;

      // Call the API to restore the product
      const updatedProduct = await productApi.restoreProduct(
        product.product_id
      );

      // Update the local state with the restored product
      setProduct(updatedProduct);

      toast({
        title: "Success",
        description: "Product restored successfully",
      });
    } catch (err: unknown) {
      console.error("Error restoring product:", err);
      const apiError = err as ApiError;
      setError("Failed to restore product. Please try again.");
      toast({
        title: "Error",
        description: apiError.message || "Failed to restore product",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/dashboard/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
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

  const isArchived = !!product.deleted_at;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
          {isArchived && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <Archive className="h-3 w-3 mr-1" />
              Archived
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isArchived ? (
            <>
              <Link href={`/dashboard/products/${productId}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300"
                onClick={() => setShowArchiveConfirm(true)}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={productUsage.length > 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
              onClick={handleRestoreProduct}
              disabled={isRestoring}
            >
              {isRestoring ? "Restoring..." : "Restore Product"}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
              {productUsage.length > 0 && (
                <div className="mt-2 text-red-600 font-medium">
                  Warning: This product is used in {productUsage.length}{" "}
                  invoice(s). You cannot delete it while it&apos;s referenced in
                  invoices.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isDeleting || productUsage.length > 0}
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation dialog */}
      <Dialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this product? Archived products
              won&apos;t appear in your active product list, but will still be
              available for existing invoices.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowArchiveConfirm(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleArchiveProduct}
              disabled={isArchiving}
            >
              {isArchiving ? "Archiving..." : "Archive Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image preview dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Product Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {product.image && (
              <CloudinaryImage
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="max-h-[70vh] object-contain"
              />
            )}
          </div>
          <DialogFooter>
            {product.image && (
              <a href={product.image} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open Original
                </Button>
              </a>
            )}
            <Button onClick={() => setShowImageDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product information column */}
        <div className="lg:col-span-1">
          {/* Product image (if available) */}
          {product.image && (
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Product Image
                </h3>
              </div>
              <div className="p-4">
                <div
                  className="w-full h-48 overflow-hidden relative rounded-md cursor-pointer"
                  onClick={() => setShowImageDialog(true)}
                >
                  <CloudinaryImage
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
                    <span className="opacity-0 hover:opacity-100 text-white font-medium">
                      Click to view
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product details */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Product Information
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(Number(product.price))}
                </span>
              </div>

              {product.description && (
                <div className="mt-4">
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                  {product.unit && (
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Unit
                      </dt>
                      <dd className="text-sm text-gray-900">{product.unit}</dd>
                    </div>
                  )}

                  {product.tax_rate && product.tax_rate > 0 && (
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Hash className="h-4 w-4 mr-2" />
                        Tax Rate
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {product.tax_rate}%
                      </dd>
                    </div>
                  )}

                  {product.category && (
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Category
                      </dt>
                      <dd className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </dd>
                    </div>
                  )}

                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(product.created_at)}
                    </dd>
                  </div>

                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last Updated
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(product.updated_at)}
                    </dd>
                  </div>

                  {product.deleted_at && (
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Archive className="h-4 w-4 mr-2" />
                        Archived On
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(product.deleted_at)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Product stats */}
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Usage Statistics
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-5">
                <div className="overflow-hidden rounded-lg bg-white">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Times Invoiced
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {productUsage.length}
                  </dd>
                </div>

                {productUsage.length > 0 && (
                  <>
                    <div className="overflow-hidden rounded-lg bg-white">
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Total Quantity Sold
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {productUsage.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white">
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Total Revenue
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-green-600">
                        {formatCurrency(
                          productUsage.reduce(
                            (sum, item) => sum + Number(item.amount),
                            0
                          )
                        )}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Product usage */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Invoices Using This Product
              </h3>
            </div>

            {productUsage.length === 0 ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-sm text-gray-500">
                  This product hasn&apos;t been used in any invoices yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Invoice #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Client
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Unit Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productUsage.map((item) => {
                      const invoice = item.invoice;
                      return (
                        <tr key={item.item_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            <Link
                              href={`/dashboard/invoices/${item.invoice_id}`}
                            >
                              {invoice?.invoice_number ||
                                `Invoice #${item.invoice_id}`}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice?.client?.name || "Unknown Client"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatCurrency(Number(item.unit_price))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(Number(item.amount))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Related invoices details */}
          {productUsage.length > 0 && (
            <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Invoice Status Overview
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      Paid
                    </h4>
                    <p className="mt-2 text-3xl font-semibold text-green-600">
                      {
                        productUsage.filter(
                          (item) => item.invoice?.status === "PAID"
                        ).length
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      Pending
                    </h4>
                    <p className="mt-2 text-3xl font-semibold text-yellow-600">
                      {
                        productUsage.filter(
                          (item) => item.invoice?.status === "PENDING"
                        ).length
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      Others
                    </h4>
                    <p className="mt-2 text-3xl font-semibold text-gray-600">
                      {
                        productUsage.filter(
                          (item) =>
                            !["PAID", "PENDING"].includes(
                              item.invoice?.status || ""
                            )
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
