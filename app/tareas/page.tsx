'use client';

import AppLayout from '@/components/AppLayout';
import { CheckSquare, Plus } from 'lucide-react';

export default function TareasPage() {
  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Tareas</h1>
              <p className="text-sm text-gray-500">Organiza tus tareas pendientes</p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              <Plus size={16} />
              Nueva tarea
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
              <CheckSquare size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sin tareas pendientes</h3>
            <p className="text-sm text-gray-500">
              Las tareas se generan automáticamente desde el CRM y las conversaciones.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
