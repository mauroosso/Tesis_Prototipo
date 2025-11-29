'use client';

import AppLayout from '@/components/AppLayout';
import { MousePointerClick } from 'lucide-react';

export default function VisitantesPage() {
  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-normal text-gray-900">Visitantes del Sitio</h1>
          <p className="text-sm text-gray-500">Identifica empresas que visitan tu sitio web</p>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
              <MousePointerClick size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tracking de visitantes</h3>
            <p className="text-sm text-gray-500">
              Instala el pixel de tracking en tu sitio para identificar empresas visitantes.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
