'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useLists } from '@/contexts/ListsContext';
import { companies } from '@/data/companies';
import { people } from '@/data/people';
import Link from 'next/link';
import {
  Building2, Users, Trash2, ExternalLink, Calendar,
  Plus, Search, Filter, MoreVertical, Edit2
} from 'lucide-react';

type TabType = 'companies' | 'people';

export default function ListasPage() {
  const { lists, getListsByType } = useLists();
  const [activeTab, setActiveTab] = useState<TabType>('companies');
  const [searchTerm, setSearchTerm] = useState('');

  const companyLists = getListsByType('companies');
  const peopleLists = getListsByType('people');

  const currentLists = activeTab === 'companies' ? companyLists : peopleLists;

  const filteredLists = currentLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getListItemsDetails = (list: typeof lists[0]) => {
    if (list.type === 'companies') {
      return list.items.map(id => companies.find(c => c.id === id)).filter(Boolean);
    } else {
      return list.items.map(id => people.find(p => p.id === id)).filter(Boolean);
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-normal text-gray-900">Listas</h1>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              <Plus size={18} />
              Nueva lista
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'companies'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                <span>Listas de Empresas</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {companyLists.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'people'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Listas de Personas</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {peopleLists.length}
                </span>
              </div>
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar listas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Lists Grid */}
        <div className="flex-1 overflow-auto p-6">
          {filteredLists.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                {activeTab === 'companies' ? (
                  <Building2 size={48} className="text-gray-400" />
                ) : (
                  <Users size={48} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay listas {activeTab === 'companies' ? 'de empresas' : 'de personas'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Crea tu primera lista para organizar tus {activeTab === 'companies' ? 'empresas' : 'contactos'}
              </p>
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                <Plus size={18} />
                Crear lista
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLists.map((list) => {
                const items = getListItemsDetails(list);
                return (
                  <div
                    key={list.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    {/* List Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors">
                            {list.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {list.items.length} {list.type === 'companies' ? 'empresas' : 'personas'}
                          </p>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>
                          Creada {new Date(list.createdAt).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* List Preview */}
                    <div className="p-4">
                      {items.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {items.slice(0, 3).map((item: any) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 text-xs"
                            >
                              {list.type === 'companies' ? (
                                <>
                                  <img
                                    src={item.logo}
                                    alt={item.name}
                                    className="w-6 h-6 rounded"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                    <p className="text-gray-500 truncate">{item.country}</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <img
                                    src={item.avatar}
                                    alt={item.fullName}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{item.fullName}</p>
                                    <p className="text-gray-500 truncate">{item.title}</p>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                          {items.length > 3 && (
                            <p className="text-xs text-gray-400 pt-1">
                              +{items.length - 3} más
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mb-3">Lista vacía</p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/listas/${list.id}`}
                          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium px-3 py-2 rounded transition-colors text-center"
                        >
                          Ver lista
                        </Link>
                        {list.type === 'people' && items.length > 0 && (
                          <Link
                            href={`/warm-up?listId=${list.id}`}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Warm-up"
                          >
                            <ExternalLink size={14} className="text-gray-400 hover:text-primary" />
                          </Link>
                        )}
                        <button
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={14} className="text-gray-400 hover:text-primary" />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
