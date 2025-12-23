import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, Eye, Filter, Plus } from 'lucide-react';
import Pagination from '@/Components/Pagination';

interface Invoice {
  id: number;
  invoice_number: string;
  customer: {
    first_name: string;
    last_name: string;
  };
  branch: {
    name: string;
  };
  total: string;
  amount_paid: string;
  balance_due: string;
  status: string;
  created_at: string;
}

interface Props {
  invoices: {
    data: Invoice[];
    links: any[];
    meta: any;
  };
}

const statusColors: Record<string, string> = {
  deposit_paid: 'bg-blue-100 text-blue-700',
  in_lab: 'bg-purple-100 text-purple-700',
  ready_pickup: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Index({ invoices }: Props) {
  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Invoices</h2>}
    >
      <Head title="Invoices" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
                <Link
                  href={route('business.sales.pos.index')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Sale
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 font-semibold text-sm text-gray-600">Invoice #</th>
                      <th className="py-3 px-4 font-semibold text-sm text-gray-600">Customer</th>
                      <th className="py-3 px-4 font-semibold text-sm text-gray-600">Date</th>
                      <th className="py-3 px-4 font-semibold text-sm text-gray-600">Total</th>
                      <th className="py-3 px-4 font-semibold text-sm text-gray-600">Balance</th>
                      <th className="py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                      <th className="py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.data.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{invoice.invoice_number}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {invoice.customer.first_name} {invoice.customer.last_name}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">${invoice.total}</td>
                        <td className="py-3 px-4">
                          <span className={parseFloat(invoice.balance_due) > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                            ${invoice.balance_due}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${statusColors[invoice.status]}`}>
                            {invoice.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={route('business.sales.invoices.show', invoice.id)}
                            className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <Pagination links={invoices.links} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
