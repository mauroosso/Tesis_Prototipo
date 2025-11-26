'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { companies, type Company } from '@/data/companies';
import { Search, Filter, Download, MapPin, Users, DollarSign, ExternalLink, Bookmark, ListPlus, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function EmpresasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedCompanies(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSegmentColor = (segment: Company['segment']) => {
    const colors = {
      Startup: 'bg-purple-50 text-purple-600',
      PyME: 'bg-blue-50 text-blue-600',
      Enterprise: 'bg-orange-50 text-orange-600',
    };
    return colors[segment];
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gray-light">
        {/* Header */}
        <div className="bg-white border-b border-gray-border px-8 py-6">
          <h1 className="text-2xl font-light text-gray-dark mb-1">Empresas</h1>
          <p className="text-sm text-gray-text">
            Descubre empresas que coinciden con tu perfil de cliente ideal
          </p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Filters Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-dark">Filtros</h3>
              <button className="text-xs text-primary hover:text-primary-dark">
                Limpiar
              </button>
            </div>

            <div className="space-y-4">
              {/* Country Filter */}
              <div>
                <button className="w-full flex items-center justify-between text-sm font-medium text-gray-dark py-2 hover:text-primary transition-colors">
                  <span>País</span>
                  <ChevronDown size={16} />
                </button>
                <div className="mt-2 space-y-2 pl-2">
                  {['Argentina', 'México', 'Colombia', 'Chile', 'Perú'].map(country => (
                    <label key={country} className="flex items-center gap-2 text-sm text-gray-text hover:text-gray-dark cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Industry Filter */}
              <div>
                <button className="w-full flex items-center justify-between text-sm font-medium text-gray-dark py-2 hover:text-primary transition-colors">
                  <span>Industria</span>
                  <ChevronDown size={16} />
                </button>
                <div className="mt-2 space-y-2 pl-2">
                  {['Tecnología', 'E-commerce', 'Logística', 'Fintech', 'Marketing'].map(industry => (
                    <label key={industry} className="flex items-center gap-2 text-sm text-gray-text hover:text-gray-dark cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <button className="w-full flex items-center justify-between text-sm font-medium text-gray-dark py-2 hover:text-primary transition-colors">
                  <span>Tamaño</span>
                  <ChevronDown size={16} />
                </button>
                <div className="mt-2 space-y-2 pl-2">
                  {['11-50', '51-200', '201-500'].map(size => (
                    <label key={size} className="flex items-center gap-2 text-sm text-gray-text hover:text-gray-dark cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Segment Filter */}
              <div>
                <button className="w-full flex items-center justify-between text-sm font-medium text-gray-dark py-2 hover:text-primary transition-colors">
                  <span>Segmento</span>
                  <ChevronDown size={16} />
                </button>
                <div className="mt-2 space-y-2 pl-2">
                  {['Startup', 'PyME', 'Enterprise'].map(segment => (
                    <label key={segment} className="flex items-center gap-2 text-sm text-gray-text hover:text-gray-dark cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{segment}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Actions Bar */}
            <div className="bg-white border-b border-gray-border px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar empresas por nombre, industria o país..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {selectedCompanies.length > 0 && (
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                      <ListPlus size={16} />
                      Agregar a prospección ({selectedCompanies.length})
                    </button>
                  )}
                  <button className="flex items-center gap-2 border border-gray-border px-4 py-2 rounded-lg text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">
                    <Download size={16} />
                    Exportar
                  </button>
                  <button className="flex items-center gap-2 border border-gray-border px-4 py-2 rounded-lg text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">
                    <Filter size={16} />
                    Más filtros
                  </button>
                </div>
              </div>
            </div>

            {/* Companies Grid */}
            <div className="flex-1 overflow-auto px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="bg-white rounded-lg border border-gray-border p-5 card-hover fade-in group cursor-pointer relative"
                  >
                    {/* Checkbox */}
                    <div className="absolute top-4 right-4">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company.id)}
                        onChange={() => toggleSelection(company.id)}
                        className="rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Company Header */}
                    <Link href={`/empresas/${company.id}`} className="block">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-12 h-12 rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-gray-dark group-hover:text-primary transition-colors mb-1 truncate">
                            {company.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-text">
                            <MapPin size={12} />
                            <span>{company.country}</span>
                          </div>
                        </div>
                      </div>

                      {/* Company Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSegmentColor(company.segment)}`}>
                            {company.segment}
                          </span>
                          <span className="text-xs text-gray-text">{company.industry}</span>
                        </div>

                        <p className="text-sm text-gray-text line-clamp-2">
                          {company.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-xs text-gray-text">
                            <Users size={14} className="text-gray-400" />
                            <span>{company.size}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-text">
                            <DollarSign size={14} className="text-gray-400" />
                            <span>{company.revenue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Preferred Channel */}
                      <div className="mb-4 pb-4 border-b border-gray-border">
                        <p className="text-xs text-gray-text mb-1">Canal preferido:</p>
                        <span className="text-xs font-medium text-primary">{company.preferredChannel}</span>
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/empresas/${company.id}`}
                        className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium px-3 py-2 rounded-lg transition-colors text-center"
                      >
                        Ver empleados
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(company.id);
                        }}
                        className="p-2 hover:bg-gray-light rounded-lg transition-colors"
                        title="Guardar"
                      >
                        <Bookmark size={16} className="text-gray-400 hover:text-primary" />
                      </button>
                      <a
                        href={`https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-gray-light rounded-lg transition-colors"
                        title="Visitar sitio"
                      >
                        <ExternalLink size={16} className="text-gray-400 hover:text-primary" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white border-t border-gray-border px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-text">
                  Mostrando {filteredCompanies.length} de {companies.length} empresas
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-gray-border rounded text-sm text-gray-text hover:bg-gray-light transition-colors">
                    Anterior
                  </button>
                  <button className="px-3 py-1.5 border border-gray-border rounded text-sm text-gray-text hover:bg-gray-light transition-colors">
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
