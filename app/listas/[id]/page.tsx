'use client';

import { use, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useLists } from '@/contexts/ListsContext';
import { companies } from '@/data/companies';
import { people } from '@/data/people';
import Link from 'next/link';
import {
  ArrowLeft, Download, Trash2, ExternalLink, MapPin,
  Users, DollarSign, Sparkles, Mail, Linkedin, Phone
} from 'lucide-react';

export default function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { lists, removeFromList } = useLists();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const list = lists.find(l => l.id === resolvedParams.id);

  if (!list) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Lista no encontrada</h2>
            <Link href="/listas" className="text-primary hover:text-primary-dark">
              Volver a listas
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const items = list.type === 'companies'
    ? list.items.map(id => companies.find(c => c.id === id)).filter(Boolean)
    : list.items.map(id => people.find(p => p.id === id)).filter(Boolean);

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/listas"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-medium text-gray-900">{list.name}</h1>
              <p className="text-sm text-gray-500">
                {list.items.length} {list.type === 'companies' ? 'empresas' : 'personas'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {list.type === 'people' && items.length > 0 && (
                <Link
                  href={`/warm-up?listId=${list.id}`}
                  className="flex items-center gap-2 bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success-dark transition-colors"
                >
                  <Sparkles size={16} />
                  Iniciar Warm-up
                </Link>
              )}
              {list.type === 'people' && items.length > 0 && (
                <Link
                  href={`/secuencias?listId=${list.id}`}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Crear Secuencia
                </Link>
              )}
              <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors">
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Esta lista está vacía</p>
            </div>
          ) : list.type === 'companies' ? (
            /* Companies Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((company: any) => (
                <div
                  key={company.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group relative"
                >
                  <div className="absolute top-3 right-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(company.id)}
                      onChange={() => toggleSelection(company.id)}
                      className="rounded border-gray-300 w-4 h-4"
                    />
                  </div>

                  <Link href={`/empresas/${company.id}`} className="block">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors mb-1 truncate">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={12} />
                          <span>{company.country}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {company.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users size={12} />
                          <span>{company.size}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <DollarSign size={12} />
                          <span className="text-xs">{company.revenue.replace('USD ', '')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-1 pt-3 mt-3 border-t border-gray-200">
                    <Link
                      href={`/empresas/${company.id}`}
                      className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium px-2 py-1.5 rounded transition-colors text-center"
                    >
                      Ver empresa
                    </Link>
                    <button
                      onClick={() => removeFromList(list.id, [company.id])}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      title="Quitar de la lista"
                    >
                      <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* People Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((person: any) => (
                <div
                  key={person.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group relative"
                >
                  <div className="absolute top-3 right-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(person.id)}
                      onChange={() => toggleSelection(person.id)}
                      className="rounded border-gray-300 w-4 h-4"
                    />
                  </div>

                  <div className="flex flex-col items-center text-center mb-4">
                    <img
                      src={person.avatar}
                      alt={person.fullName}
                      className="w-16 h-16 rounded-full mb-3"
                    />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {person.fullName}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">{person.title}</p>
                    <p className="text-xs text-gray-500">{person.company}</p>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin size={12} className="text-gray-400" />
                      <span className="text-gray-600">{person.country}</span>
                    </div>
                    {person.email && (
                      <div className="flex items-center gap-2 text-xs">
                        <Mail size={12} className="text-gray-400" />
                        <a href={`mailto:${person.email}`} className="text-primary hover:underline truncate">
                          {person.email}
                        </a>
                      </div>
                    )}
                    {person.linkedIn && (
                      <div className="flex items-center gap-2 text-xs">
                        <Linkedin size={12} className="text-gray-400" />
                        <a
                          href={`https://${person.linkedIn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 pt-3 border-t border-gray-200">
                    <Link
                      href={`/empresas/${person.companyId}`}
                      className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium px-2 py-1.5 rounded transition-colors text-center"
                    >
                      Ver empresa
                    </Link>
                    <button
                      onClick={() => removeFromList(list.id, [person.id])}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      title="Quitar de la lista"
                    >
                      <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
