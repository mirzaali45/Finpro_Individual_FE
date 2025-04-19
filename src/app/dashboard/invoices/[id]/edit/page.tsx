// src/app/dashboard/invoices/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientApi, invoiceApi, productApi } from "@/lib/api";
import {
  Client,
  CreateInvoiceFormData,
  Invoice,
  InvoiceStatus,
  Product,
  RecurringPattern,
} from "@/types";
import { ApiError, formatCurrency } from "@/lib/utils";
import InvoiceItemForm from "@/components/invoices/invoiceItemForm";

export default function EditInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [addingNewItem, setAddingNewItem] = useState(false);

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
    is_recurring: false,
    recurring_pattern: undefined,
  });

  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch invoice, clients and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [invoiceData, clientsData, productsData] = await Promise.all([
          invoiceApi.getInvoice(parseInt(params.id)),
          clientApi.getClients(),
          productApi.getProducts(),
        ]);

        setInvoice(invoiceData);
        setClients(clientsData);
        setProducts(productsData);

        // Set form data from invoice
        setFormData({
          client_id: invoiceData.client_id,
          issue_date: new Date(invoiceData.issue_date)
            .toISOString()
            .split("T")[0],
          due_date: new Date(invoiceData.due_date).toISOString().split("T")[0],
          items:
            invoiceData.items?.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              description: item.description || undefined,
            })) || [],
          notes: invoiceData.notes || "",
          terms: invoiceData.terms || "",
          is_recurring: Boolean(invoiceData.source_recurring_id) || false,
          recurring_pattern: invoiceData.recurring_pattern,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load invoice data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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
        const itemTotal = Number(product.price) * item.quantity;
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

  const handleAddItem = () => {
    if (products.length === 0) {
      setError("No products available. Please add products first.");
      return;
    }

    setAddingNewItem(true);
    setEditingItemIndex(null);
  };

  const handleEditItem = (index: number) => {
    setEditingItemIndex(index);
    setAddingNewItem(false);
  };

  const handleSaveItem = (
    item: { product_id: number; quantity: number; description?: string },
    index?: number
  ) => {
    let updatedItems;

    if (index !== undefined) {
      // Updating existing item
      updatedItems = [...formData.items];
      updatedItems[index] = item;
    } else {
      // Adding new item
      updatedItems = [...formData.items, item];
    }

    setFormData({
      ...formData,
      items: updatedItems,
    });

    setEditingItemIndex(null);
    setAddingNewItem(false);
  };

  const handleCancelEditItem = () => {
    setEditingItemIndex(null);
    setAddingNewItem(false);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      items: updatedItems,
    });
    setEditingItemIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent, status?: InvoiceStatus) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      setError("Please add at least one item to the invoice.");
      return;
    }

    if (!formData.client_id) {
      setError("Please select a client for the invoice.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Update the invoice with calculated values
      const invoiceData = {
        ...formData,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      };

      // Update the invoice
      const updatedInvoice = await invoiceApi.updateInvoice(
        parseInt(params.id),
        invoiceData
      );

      // Update status if provided
      if (status && invoice?.status !== status) {
        await invoiceApi.changeStatus(updatedInvoice.invoice_id, status);
      }

      // Handle recurring invoice updates if needed
      if (formData.is_recurring && formData.recurring_pattern) {
        if (invoice?.source_recurring_id) {
          // Update existing recurring invoice setup
          await invoiceApi.updateRecurringInvoice(invoice.source_recurring_id, {
            pattern: formData.recurring_pattern,
            items: formData.items,
          });
        } else {
          // Create new recurring invoice setup
          const nextInvoiceDate = getNextInvoiceDate(
            new Date(formData.due_date),
            formData.recurring_pattern
          );

          await invoiceApi.createRecurringInvoice({
            client_id: formData.client_id,
            pattern: formData.recurring_pattern,
            next_invoice_date: nextInvoiceDate.toISOString(),
            items: formData.items,
            source_invoice_id: updatedInvoice.invoice_id,
          });
        }
      }

      router.push(`/dashboard/invoices/${params.id}`);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to update invoice. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to calculate next invoice date based on pattern
  const getNextInvoiceDate = (
    baseDate: Date,
    pattern: RecurringPattern
  ): Date => {
    const nextDate = new Date(baseDate);

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
    }

    return nextDate;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/dashboard/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/invoices/${params.id}`}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Invoice #{invoice?.invoice_number}
        </h1>
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
                  <option value="">Select a client</option>
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

            {/* Recurring options - only enable if the invoice is not already recurring */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  id="is_recurring"
                  name="is_recurring"
                  type="checkbox"
                  checked={formData.is_recurring}
                  onChange={handleChange}
                  disabled={
                    invoice?.source_recurring_id !== null &&
                    invoice?.source_recurring_id !== undefined
                  }
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="is_recurring"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Make this a recurring invoice
                </label>
                {invoice?.source_recurring_id && (
                  <span className="ml-2 text-xs text-blue-600">
                    (This invoice is part of a recurring series)
                  </span>
                )}
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
                    value={formData.recurring_pattern || ""}
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
              {!addingNewItem && editingItemIndex === null && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  disabled={products.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              )}
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

            {addingNewItem && (
              <div className="mb-4 border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium mb-4">Add New Item</h3>
                <InvoiceItemForm
                  products={products}
                  onSave={(item) => handleSaveItem(item)}
                  onCancel={handleCancelEditItem}
                />
              </div>
            )}

            {formData.items.length === 0 && !addingNewItem ? (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500 mb-2">
                  No items added to this invoice.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  disabled={products.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <div>
                {!addingNewItem &&
                  formData.items.map((item, index) => {
                    const product = products.find(
                      (p) => p.product_id === item.product_id
                    );
                    const isEditing = editingItemIndex === index;

                    if (isEditing) {
                      return (
                        <div
                          key={index}
                          className="mb-4 border p-4 rounded-md bg-gray-50"
                        >
                          <h3 className="font-medium mb-4">Edit Item</h3>
                          <InvoiceItemForm
                            products={products}
                            initialItem={item}
                            onSave={(updatedItem) =>
                              handleSaveItem(updatedItem, index)
                            }
                            onCancel={handleCancelEditItem}
                            onDelete={() => handleDeleteItem(index)}
                          />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEditItem(index)}
                      >
                        <div>
                          <p className="font-medium">
                            {product?.name || "Unknown Product"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x{" "}
                            {formatCurrency(
                              product ? Number(product.price) : 0
                            )}
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {formatCurrency(
                              (product ? Number(product.price) : 0) *
                                item.quantity
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(index);
                            }}
                            className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save as Draft"}
              </Button>

              {invoice?.status === "DRAFT" && (
                <Button
                  className="w-full"
                  onClick={(e) => handleSubmit(e, "PENDING")}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save and Send"}
                </Button>
              )}

              {invoice?.status !== "DRAFT" && (
                <Button
                  className="w-full"
                  onClick={(e) => handleSubmit(e)}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}

              <Link
                href={`/dashboard/invoices/${params.id}`}
                className="block w-full"
              >
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
