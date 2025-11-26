'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { people, type Person } from '@/data/people';
import { Search, Filter, Download, ListPlus, Linkedin, Mail, ChevronDown, Info } from 'lucide-react';
import Link from 'next/link';

export default function PersonasPage() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSelection = (id: string) => {
    setSelectedPeople(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPeople.length === people.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(people.map(p => p.id));
    }
  };

  const filteredPeople = people.filter(person =>
    person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Person['status']) => {
    const styles = {
      nuevo: 'bg-gray-100 text-gray-600',
      'warm-up': 'bg-blue-50 text-blue-600',
      contactado: 'bg-purple-50 text-purple-600',
      interesado: 'bg-yellow-50 text-yellow-600',
      reunión: 'bg-orange-50 text-orange-600',
      cliente: 'bg-green-50 text-green-600',
    };
    return styles[status] || styles.nuevo;
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gray-light">
        {/* Header */}
        <div className="bg-white border-b border-gray-border px-8 py-6">
          <h1 className="text-2xl font-light text-gray-dark mb-1">Personas</h1>
          <p className="text-sm text-gray-text">
            Encuentra y conecta con decisores en empresas de LATAM
          </p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Filters Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-dark">Filtros</h3>
              <button className="text-xs text-primary hover:text-primary-dark">
                Limpiar todo
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

              {/* Seniority Filter */}
              <div>
                <button className="w-full flex items-center justify-between text-sm font-medium text-gray-dark py-2 hover:text-primary transition-colors">
                  <span>Seniority</span>
                  <ChevronDown size={16} />
                </button>
                <div className="mt-2 space-y-2 pl-2">
                  {['C-Level', 'VP', 'Director', 'Manager'].map(level => (
                    <label key={level} className="flex items-center gap-2 text-sm text-gray-text hover:text-gray-dark cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <button className="w-full flex items-center justify-between text-sm font-medium text-gray-dark py-2 hover:text-primary transition-colors">
                  <span>Departamento</span>
                  <ChevronDown size={16} />
                </button>
                <div className="mt-2 space-y-2 pl-2">
                  {['Sales', 'Marketing', 'Operations', 'Engineering'].map(dept => (
                    <label key={dept} className="flex items-center gap-2 text-sm text-gray-text hover:text-gray-dark cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <button className="w-full flex items-center justify-between text-sm font-medium text-gray-dark py-2 hover:text-primary transition-colors">
                  <span>Estado</span>
                  <ChevronDown size={16} />
                </button>
                <div className="mt-2 space-y-2 pl-2">
                  {['nuevo', 'warm-up', 'contactado', 'interesado', 'reunión', 'cliente'].map(status => (
                    <label key={status} className="flex items-center gap-2 text-sm text-gray-text hover:text-gray-dark cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="capitalize">{status}</span>
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
                    placeholder="Buscar por nombre, empresa o cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {selectedPeople.length > 0 && (
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                      <ListPlus size={16} />
                      Agregar a lista ({selectedPeople.length})
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

              {/* Tip */}
              <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <Info className="text-primary flex-shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Consejo:</span> Priorizá a quienes cambiaron de rol en los últimos 90 días. Tienen {' '}
                  <span className="text-primary font-medium">3x más probabilidad</span> de responder.
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto bg-white">
              <table className="w-full">
                <thead className="bg-gray-light border-b border-gray-border sticky top-0">
                  <tr>
                    <th className="text-left px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPeople.length === people.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      País
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Próxima acción
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {filteredPeople.map((person) => (
                    <tr
                      key={person.id}
                      className="hover:bg-gray-light/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPeople.includes(person.id)}
                          onChange={() => toggleSelection(person.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/personas/${person.id}`}
                          className="flex items-center gap-3 group/name"
                        >
                          <img
                            src={person.avatar}
                            alt={person.fullName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-dark group-hover/name:text-primary transition-colors">
                              {person.fullName}
                              {person.roleChangedRecently && (
                                <span className="ml-2 text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                                  Nuevo rol
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-text">{person.seniority}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-text">{person.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-text">{person.company}</td>
                      <td className="px-6 py-4 text-sm text-gray-text">{person.country}</td>
                      <td className="px-6 py-4 text-sm text-gray-text">{person.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            person.status
                          )}`}
                        >
                          {person.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-text">{person.nextAction}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={`https://${person.linkedIn}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin size={16} />
                          </a>
                          <a
                            href={`mailto:${person.email}`}
                            className="p-1.5 rounded hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Email"
                          >
                            <Mail size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white border-t border-gray-border px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-text">
                  Mostrando {filteredPeople.length} de {people.length} personas
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
