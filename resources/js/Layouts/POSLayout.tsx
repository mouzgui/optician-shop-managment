import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, Home, X } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function POSLayout({ children, title }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head title={title} />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={route('business.dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            POS - {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-end hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Branch: Main Store</p>
            <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>
          <Link
            href={route('business.dashboard')}
            className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
            title="Exit POS"
          >
            <X className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
