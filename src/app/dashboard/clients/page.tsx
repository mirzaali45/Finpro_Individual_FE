// src/app/dashboard/clients/page.tsx
"use client";

import { useState, useEffect } from "react";
import { clientApi } from "@/lib/api";
import { Client } from "@/types/index";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Mail, Phone, Building } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const data = await clientApi.getClients();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.company_name &&
          client.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search clients..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Client list */}
      {filteredClients.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <li key={client.client_id}>
                <Link
                  href={`/dashboard/clients/${client.client_id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary truncate">
                        {client.name}
                      </p>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex sm:flex-col">
                        {client.company_name && (
                          <p className="flex items-center text-sm text-gray-500">
                            <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {client.company_name}
                          </p>
                        )}
                        <p className="mt-1 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-0">
                          <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {client.email}
                        </p>
                      </div>
                      {client.phone && (
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {client.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              No clients found
            </h3>
            {searchTerm ? (
              <p className="mt-2 text-sm text-gray-500">
                No clients match your search. Try adjusting your search terms.
              </p>
            ) : (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-4">
                  You haven't added any clients yet. Add your first client to
                  start creating invoices.
                </p>
                <Link href="/dashboard/clients/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
