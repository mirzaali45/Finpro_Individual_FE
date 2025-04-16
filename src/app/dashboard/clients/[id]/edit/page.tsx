// src/app/dashboard/clients/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientApi } from "@/lib/api";
import { Client, CreateClientFormData } from "@/types";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CreateClientFormData>({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    payment_preference: "",
    notes: "",
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true);
        const clientData = await clientApi.getClient(parseInt(params.id));
        setClient(clientData);

        // Set form data from client
        setFormData({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone || "",
          company_name: clientData.company_name || "",
          address: clientData.address || "",
          city: clientData.city || "",
          state: clientData.state || "",
          postal_code: clientData.postal_code || "",
          country: clientData.country || "",
          payment_preference: clientData.payment_preference || "",
          notes: clientData.notes || "",
        });
      } catch (error) {
        console.error("Error fetching client:", error);
        setError("Failed to load client data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await clientApi.updateClient(parseInt(params.id), formData);
      router.push(`/dashboard/clients/${params.id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update client. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !client) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/dashboard/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/clients/${params.id}`}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Client</h1>
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

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Personal Information */}
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Client Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name*
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email*
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Address
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postal_code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal Code
                  </label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="payment_preference"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Preference
                  </label>
                  <Input
                    id="payment_preference"
                    name="payment_preference"
                    value={formData.payment_preference}
                    onChange={handleChange}
                    placeholder="e.g. Bank Transfer, Credit Card, etc."
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href={`/dashboard/clients/${params.id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
