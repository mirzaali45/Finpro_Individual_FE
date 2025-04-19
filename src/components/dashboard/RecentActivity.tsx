import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice, Payment } from '@/types';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentActivityProps {
  recentInvoices: Invoice[];
  recentPayments?: Payment[];
  isLoading: boolean;
}

export default function RecentActivity({
  recentInvoices,
  recentPayments = [],
  isLoading
}: RecentActivityProps) {
  // Status colors for the badge
  const statusColors = {
    'DRAFT': 'bg-gray-100 text-gray-800',
    'PENDING': 'bg-blue-100 text-blue-800',
    'PAID': 'bg-green-100 text-green-800',
    'PARTIAL': 'bg-yellow-100 text-yellow-800',
    'OVERDUE': 'bg-red-100 text-red-800',
    'CANCELLED': 'bg-gray-100 text-gray-800',
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="border-t border-gray-200">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="px-4 py-5 border-b border-gray-200 animate-pulse">
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="mt-2 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
        <Link href="/dashboard/invoices">
          <Button variant="ghost" size="sm" className="text-primary">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {recentInvoices.length === 0 && recentPayments.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center">
          <p className="text-sm text-gray-500">
            No recent activity yet. Create your first invoice to get started.
          </p>
          <div className="mt-4">
            <Link href="/dashboard/invoices/new">
              <Button size="sm">
                Create First Invoice
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {/* Recent payments */}
          {recentPayments.map((payment) => (
            <li key={`payment-${payment.payment_id}`}>
              <Link 
                href={`/dashboard/invoices/${payment.invoice_id}`} 
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm font-medium text-gray-900">
                        Payment Received
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(Number(payment.amount))}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {formatDate(payment.payment_date)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p className="flex items-center">
                        Via {payment.payment_method.replace('_', ' ')}
                        <ArrowUpRight className="ml-1 h-4 w-4 text-gray-400" />
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          
          {/* Recent invoices */}
          {recentInvoices.map((invoice) => (
            <li key={`invoice-${invoice.invoice_id}`}>
              <Link 
                href={`/dashboard/invoices/${invoice.invoice_id}`} 
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary truncate">
                      {invoice.invoice_number}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[invoice.status]}`}>
                        {invoice.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {invoice.client?.name || 'Unknown Client'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        <span className="font-medium text-gray-900">{formatCurrency(Number(invoice.total_amount))}</span>
                        {' · '}
                        Due {formatDate(invoice.due_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}