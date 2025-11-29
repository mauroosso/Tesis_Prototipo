'use client';

import AppLayout from '@/components/AppLayout';
import { TrendingUp, DollarSign, Calendar, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function OportunidadesPage() {
  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-normal text-gray-900">Oportunidades</h1>
          <p className="text-sm text-gray-500">Gestiona tus oportunidades de venta</p>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
              <TrendingUp size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Oportunidades</h3>
            <p className="text-sm text-gray-500 mb-4">
              Las oportunidades se generan automáticamente cuando un lead avanza en el pipeline del CRM.
            </p>
            <Link href="/crm" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              Ver CRM Visual
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
