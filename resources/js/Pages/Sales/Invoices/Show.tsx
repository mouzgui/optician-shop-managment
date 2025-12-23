import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
  Printer, 
  ArrowLeft, 
  CreditCard, 
  History, 
  FileText,
  User,
  MapPin,
  Package
} from 'lucide-react';

interface Props {
  invoice: any;
}

const statusColors: Record<string, string> = {
  deposit_paid: 'bg-blue-100 text-blue-700',
  in_lab: 'bg-purple-100 text-purple-700',
  ready_pickup: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Show({ invoice }: Props) {
  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={route('business.sales.invoices.index')} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Invoice {invoice.invoice_number}
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Add Payment
            </button>
          </div>
        </div>
      }
    >
      <Head title={`Invoice ${invoice.invoice_number}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Items Table */}
              <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    Items
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[invoice.status]}`}>
                    {invoice.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-6 font-semibold text-xs text-gray-500 uppercase">Item</th>
                        <th className="py-3 px-6 font-semibold text-xs text-gray-500 uppercase text-center">Qty</th>
                        <th className="py-3 px-6 font-semibold text-xs text-gray-500 uppercase text-right">Unit Price</th>
                        <th className="py-3 px-6 font-semibold text-xs text-gray-500 uppercase text-right">Discount</th>
                        <th className="py-3 px-6 font-semibold text-xs text-gray-500 uppercase text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invoice.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-900">{item.description}</div>
                            <div className="text-xs text-gray-500 uppercase">{item.item_type}</div>
                          </td>
                          <td className="py-4 px-6 text-center">{item.quantity}</td>
                          <td className="py-4 px-6 text-right">${item.unit_price}</td>
                          <td className="py-4 px-6 text-right text-red-600">-${item.discount}</td>
                          <td className="py-4 px-6 text-right font-bold">${item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="py-3 px-6 text-right font-medium text-gray-500">Subtotal</td>
                        <td className="py-3 px-6 text-right font-bold">${invoice.subtotal}</td>
                      </tr>
                      {parseFloat(invoice.discount_amount) > 0 && (
                        <tr>
                          <td colSpan={4} className="py-3 px-6 text-right font-medium text-red-500 text-sm">Discount</td>
                          <td className="py-3 px-6 text-right font-bold text-red-600">-${invoice.discount_amount}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={4} className="py-3 px-6 text-right text-lg font-black text-gray-900">Total</td>
                        <td className="py-3 px-6 text-right text-lg font-black text-primary-600">${invoice.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payments History */}
              <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-400" />
                    Payment History
                  </h3>
                </div>
                <div className="p-6">
                  {invoice.payments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No payments recorded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {invoice.payments.map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-full shadow-sm">
                              {payment.payment_method === 'cash' ? <CreditCard className="w-5 h-5 text-green-600" /> : <CreditCard className="w-5 h-5 text-blue-600" />}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">${payment.amount}</div>
                              <div className="text-xs text-gray-500">
                                {payment.payment_method.toUpperCase()} • {new Date(payment.received_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase">Received By</div>
                            <div className="text-sm font-medium text-gray-700">{payment.received_by?.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Customer & Summary */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white shadow-sm sm:rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <User className="w-5 h-5 text-gray-400" />
                  Customer
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 uppercase">Name</div>
                    <div className="font-bold text-gray-900">{invoice.customer.first_name} {invoice.customer.last_name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase">Phone</div>
                    <div className="text-gray-700">{invoice.customer.phone || 'N/A'}</div>
                  </div>
                  <Link 
                    href={route('business.sales.customers.show', invoice.customer.id)}
                    className="text-primary-600 text-sm hover:underline block pt-2"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-primary-600 shadow-lg sm:rounded-lg p-6 text-white">
                <h3 className="font-bold text-white/80 mb-4 flex items-center gap-2 border-b border-white/20 pb-2 uppercase text-xs tracking-wider">
                  Financial Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Amount</span>
                    <span className="text-2xl font-black">${invoice.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Paid to Date</span>
                    <span className="text-xl font-bold">${invoice.amount_paid}</span>
                  </div>
                  <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                    <span className="font-bold">Balance Due</span>
                    <span className={`text-3xl font-black ${parseFloat(invoice.balance_due) > 0 ? 'text-yellow-300' : 'text-green-300'}`}>
                      ${invoice.balance_due}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-white shadow-sm sm:rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  Branch
                </h3>
                <div className="text-sm font-medium text-gray-700">{invoice.branch.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
