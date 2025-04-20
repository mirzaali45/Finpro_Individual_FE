//src/app/dashboard/invoices/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientApi, invoiceApi, productApi } from "@/lib/api";
import {
  Client,
  CreateInvoiceFormData,
  InvoiceStatus,
  Product,
  RecurringPattern,
} from "@/types";
import { ApiError, formatCurrency } from "@/lib/utils";

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<CreateInvoiceFormData>({
    client_id: 0,
    issue_date: new Date().toISOString().split("T")[0], // Today
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 14 days from now
    items: [],
    notes: "",
    terms:
      "Payment is due within 14 days from the date of invoice. Thank you for your business.",
    // Adding recurring information to match schema
    is_recurring: false,
    recurring_pattern: undefined,
  });

  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch clients and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [clientsData, productsData] = await Promise.all([
          clientApi.getClients(),
          productApi.getProducts(),
        ]);

        setClients(clientsData);
        setProducts(productsData);

        // Set default client if available
        if (clientsData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            client_id: clientsData[0].client_id,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load clients or products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals when items change
  useEffect(() => {
    if (!formData.items.length) {
      setSubtotal(0);
      setTaxAmount(0);
      setTotalAmount(0);
      return;
    }

    let newSubtotal = 0;
    let newTaxAmount = 0;

    formData.items.forEach((item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      if (product) {
        const itemTotal = product.price * item.quantity;
        newSubtotal += itemTotal;

        if (product.tax_rate) {
          newTaxAmount += itemTotal * (Number(product.tax_rate) / 100);
        }
      }
    });

    const newTotalAmount = newSubtotal + newTaxAmount;

    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotalAmount(newTotalAmount);
  }, [formData.items, products]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "is_recurring" && type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        is_recurring: checked,
        recurring_pattern: checked ? formData.recurring_pattern : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "quantity" ? parseInt(value.toString()) || 0 : value,
    };
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const addItem = () => {
    if (products.length === 0) {
      setError("No products available. Please add products first.");
      return;
    }

    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product_id: products[0].product_id,
          quantity: 1,
          description: products[0].description || "",
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  // Perbaikan pada fungsi handleSubmit di src/app/dashboard/invoices/new/page.tsx

  const handleSubmit = async (
    e: React.FormEvent,
    status: InvoiceStatus = "DRAFT"
  ) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      setError("Please add at least one item to the invoice.");
      return;
    }

    if (!formData.client_id) {
      setError("Please select a client for the invoice.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Prepare data to send to API - pastikan semua nilai yang dikirim memiliki tipe data yang konsisten
      const invoiceData = {
        ...formData,
        client_id: Number(formData.client_id), // Pastikan client_id adalah number
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        items: formData.items.map((item) => ({
          ...item,
          product_id: Number(item.product_id), // Pastikan product_id adalah number
          quantity: Number(item.quantity), // Pastikan quantity adalah number
        })),
      };

      let invoice;

      // Jika status adalah PENDING, kita kirim invoice ke client
      if (status === "PENDING") {
        // Buat invoice terlebih dahulu dengan status yang eksplisit
        invoice = await invoiceApi.createInvoice({
          ...invoiceData,
          status: "PENDING", // Set status secara eksplisit
        });

        // Kemudian kirim email
        try {
          await invoiceApi.sendInvoiceEmail(invoice.invoice_id);
          setSuccessMessage("Invoice created and email sent successfully!");
        } catch (emailError) {
          console.error("Error sending invoice email:", emailError);
          setSuccessMessage(
            "Invoice created, but there was an error sending the email."
          );
        }
      } else {
        // Buat invoice tanpa mengirim email, dengan status yang eksplisit
        invoice = await invoiceApi.createInvoice({
          ...invoiceData,
          status: status, // Set status secara eksplisit
        });
      }

      // Jika recurring, buat recurring invoice
      if (formData.is_recurring && formData.recurring_pattern) {
        try {
          console.log("Creating recurring invoice:", {
            pattern: formData.recurring_pattern,
            client_id: formData.client_id,
          });

          // Hitung next invoice date
          const nextInvoiceDate = getNextInvoiceDate(
            new Date(formData.due_date),
            formData.recurring_pattern
          );

          // Format tanggal dengan benar untuk API
          const formattedNextDate = nextInvoiceDate.toISOString();

          // Buat data untuk recurring invoice dengan tipe data yang eksplisit
          const recurringData = {
            client_id: Number(formData.client_id),
            pattern: formData.recurring_pattern,
            next_invoice_date: formattedNextDate,
            items: formData.items.map((item) => ({
              product_id: Number(item.product_id),
              quantity: Number(item.quantity),
              description: item.description || "",
            })),
            source_invoice_id: invoice.invoice_id,
          };

          console.log("Sending recurring data:", JSON.stringify(recurringData));

          // Buat recurring invoice
          await invoiceApi.createRecurringInvoice(recurringData);
        } catch (recurringError) {
          console.error("Error creating recurring invoice:", recurringError);
          // Meskipun recurring gagal, invoice utama tetap berhasil dibuat
          setSuccessMessage(
            "Invoice created, but failed to set up recurring schedule."
          );
        }
      }

      // Arahkan ke halaman detail invoice
      router.push(`/dashboard/invoices/${invoice.invoice_id}`);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      let errorMessage = "Failed to create invoice. Please try again.";

      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      console.error("Invoice creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate next invoice date based on pattern
  // Perbaikan pada fungsi getNextInvoiceDate
  const getNextInvoiceDate = (
    baseDate: Date,
    pattern: RecurringPattern
  ): Date => {
    // Pastikan baseDate adalah objek Date yang valid
    const nextDate = new Date(baseDate);

    if (isNaN(nextDate.getTime())) {
      console.error("Invalid date provided to getNextInvoiceDate:", baseDate);
      // Jika tanggal tidak valid, gunakan tanggal sekarang
      return new Date();
    }

    try {
      switch (pattern) {
        case "WEEKLY":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "BIWEEKLY":
          nextDate.setDate(nextDate.getDate() + 14);
          break;
        case "MONTHLY":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case "QUARTERLY":
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case "SEMIANNUALLY":
          nextDate.setMonth(nextDate.getMonth() + 6);
          break;
        case "ANNUALLY":
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          console.warn(`Unknown pattern: ${pattern}, defaulting to MONTHLY`);
          nextDate.setMonth(nextDate.getMonth() + 1);
      }

      console.log(`Next date calculated for pattern ${pattern}:`, nextDate);
      return nextDate;
    } catch (error) {
      console.error("Error calculating next invoice date:", error);
      // Return safe fallback
      const fallback = new Date();
      fallback.setMonth(fallback.getMonth() + 1);
      return fallback;
    }
  };

  if (isLoading && (!clients.length || !products.length)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/invoices"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Create New Invoice
        </h1>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex"
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column - Invoice details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Invoice Details</h2>

            {/* Client selection */}
            <div className="mb-4">
              <label
                htmlFor="client_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Client*
              </label>
              {clients.length > 0 ? (
                <select
                  id="client_id"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  required
                >
                  {clients.map((client) => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.name}{" "}
                      {client.company_name ? `(${client.company_name})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex flex-col items-start">
                  <p className="text-sm text-gray-500 mb-2">
                    No clients available.
                  </p>
                  <Link href="/dashboard/clients/new">
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Invoice dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="issue_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Issue Date*
                </label>
                <Input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="due_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Due Date*
                </label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Recurring options */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  id="is_recurring"
                  name="is_recurring"
                  type="checkbox"
                  checked={formData.is_recurring}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="is_recurring"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Make this a recurring invoice
                </label>
              </div>

              {formData.is_recurring && (
                <div className="mt-2">
                  <label
                    htmlFor="recurring_pattern"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Recurring Pattern
                  </label>
                  <select
                    id="recurring_pattern"
                    name="recurring_pattern"
                    value={formData.recurring_pattern}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="">Select frequency</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BIWEEKLY">Every 2 weeks</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="SEMIANNUALLY">Every 6 months</option>
                    <option value="ANNUALLY">Yearly</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Invoice Items</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={products.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {products.length === 0 && (
              <div className="flex flex-col items-start">
                <p className="text-sm text-gray-500 mb-2">
                  No products available.
                </p>
                <Link href="/dashboard/products/new">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </div>
            )}

            {formData.items.length === 0 && products.length > 0 && (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500 mb-2">
                  No items added to this invoice.
                </p>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            )}

            {formData.items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Qty
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => {
                      const product = products.find(
                        (p) => p.product_id === item.product_id
                      );
                      const price = product ? Number(product.price) : 0;
                      const total = item.quantity * price;

                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={item.product_id}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "product_id",
                                  parseInt(e.target.value)
                                )
                              }
                              className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                            >
                              {products.map((product) => (
                                <option
                                  key={product.product_id}
                                  value={product.product_id}
                                >
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              type="text"
                              value={item.description || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description"
                              className="text-sm"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="w-20 text-sm"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatCurrency(total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Notes and Terms */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Additional Information</h2>

            <div className="mb-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes to Customer
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g. Thank you for your business"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="terms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Terms & Conditions
              </label>
              <textarea
                id="terms"
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                rows={3}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right column - Summary and actions */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-medium mb-6">Invoice Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => handleSubmit(e, "DRAFT")}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                className="w-full"
                onClick={(e) => handleSubmit(e, "PENDING")}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save and Send"}
              </Button>
              <Link href="/dashboard/invoices" className="block w-full">
                <Button variant="ghost" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
