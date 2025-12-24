import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, Home, X } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function POSLayout({ children, title }: Props) {
  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col">
      <Head title={title} />
      
      {/* Header */}
      <header className="bg-bg-base border-b border-border-default h-16 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={route('business.dashboard')}
            className="p-2 hover:bg-bg-muted rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-text-secondary" />
          </Link>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            POS - {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-end hidden sm:block">
            <p className="text-sm font-medium text-text-primary">Branch: Main Store</p>
            <p className="text-xs text-text-muted">{new Date().toLocaleDateString()}</p>
          </div>
          <Link
            href={route('business.dashboard')}
            className="p-2 hover:bg-status-error-bg/10 text-status-error-text rounded-full transition-colors"
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
