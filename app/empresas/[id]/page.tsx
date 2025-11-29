'use client';

import { use, useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { companies } from '@/data/companies';
import { people } from '@/data/people';
import { useLists } from '@/contexts/ListsContext';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, MapPin, Users, DollarSign,
  Calendar, Building2, Globe, Mail, Linkedin, Phone,
  Briefcase, Clock, ListPlus, X, ChevronRight, Bookmark
} from 'lucide-react';

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const company = companies.find(c => c.id === resolvedParams.id);
  const { addToList, createList, getListsByType } = useLists();

  const [showEmployees, setShowEmployees] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  const peopleLists = getListsByType('people');

  // Get employees for this company
  const employees = useMemo(() => {
    return people.filter(p => p.companyId === company?.id);
  }, [company?.id]);

  if (!company) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Empresa no encontrada</h2>
            <Link href="/empresas" className="text-primary hover:text-primary-dark">
              Volver a empresas
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const selectAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.id));
    }
  };

  const handleAddToList = (listId: string) => {
    addToList(listId, selectedEmployees);
    setShowAddToListModal(false);
    setSelectedEmployees([]);
  };

  const handleCreateAndAddToList = () => {
    if (newListName.trim()) {
      createList(newListName, 'people');
      setTimeout(() => {
        const newList = peopleLists.find(l => l.name === newListName);
        if (newList) {
          addToList(newList.id, selectedEmployees);
        }
        setShowAddToListModal(false);
        setSelectedEmployees([]);
        setNewListName('');
      }, 100);
    }
  };

  const getSegmentColor = (segment: typeof company.segment) => {
    const colors = {
      Startup: 'bg-purple-50 text-purple-600 border-purple-200',
      PyME: 'bg-blue-50 text-blue-600 border-blue-200',
      Enterprise: 'bg-orange-50 text-orange-600 border-orange-200',
    };
    return colors[segment];
  };

  const getSeniorityColor = (seniority: string) => {
    const colors: Record<string, string> = {
      'C-Level': 'bg-red-50 text-red-600 border-red-200',
      'VP': 'bg-orange-50 text-orange-600 border-orange-200',
      'Director': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'Manager': 'bg-blue-50 text-blue-600 border-blue-200',
      'Individual Contributor': 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return colors[seniority] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <Link
              href="/empresas"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft size={16} />
              Volver a empresas
            </Link>

            {/* Company Header */}
            <div className="flex items-start gap-6">
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-2xl font-medium text-gray-900 mb-2">{company.name}</h1>
                    <p className="text-sm text-gray-600 mb-3">{company.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getSegmentColor(company.segment)}`}>
                        {company.segment}
                      </span>
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full border bg-gray-50 text-gray-600 border-gray-200">
                        {company.industry}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors">
                      <Bookmark size={16} />
                      Guardar
                    </button>
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      <ExternalLink size={16} />
                      Visitar sitio
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Stats */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Ubicación</p>
                  <p className="text-sm font-medium text-gray-900">{company.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Users size={18} className="text-success" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Empleados</p>
                  <p className="text-sm font-medium text-gray-900">{company.size}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <DollarSign size={18} className="text-warning" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Facturación</p>
                  <p className="text-sm font-medium text-gray-900">{company.revenue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Fundada</p>
                  <p className="text-sm font-medium text-gray-900">{company.foundedYear}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employees Section Header */}
          <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-gray-900">Empleados</h2>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                {employees.length}
              </span>
            </div>
            {selectedEmployees.length > 0 && (
              <button
                onClick={() => setShowAddToListModal(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors"
              >
                <ListPlus size={14} />
                Agregar a lista ({selectedEmployees.length})
              </button>
            )}
          </div>
        </div>

        {/* Employees List */}
        <div className="flex-1 overflow-auto">
          {employees.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No hay empleados registrados para esta empresa</p>
            </div>
          ) : (
            <div className="bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-200 sticky top-0">
                  <tr>
                    <th className="text-left px-6 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.length === employees.length && employees.length > 0}
                        onChange={selectAllEmployees}
                        className="rounded border-gray-300 w-4 h-4"
                      />
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seniority
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                          className="rounded border-gray-300 w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={employee.avatar}
                            alt={employee.fullName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.fullName}
                            </div>
                            <div className="text-xs text-gray-500">{employee.timezone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${getSeniorityColor(employee.seniority)}`}>
                          {employee.seniority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.department}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {employee.email && (
                            <a
                              href={`mailto:${employee.email}`}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                              title="Email"
                            >
                              <Mail size={14} />
                            </a>
                          )}
                          {employee.linkedIn && (
                            <a
                              href={`https://${employee.linkedIn}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                              title="LinkedIn"
                            >
                              <Linkedin size={14} />
                            </a>
                          )}
                          {employee.phone && (
                            <a
                              href={`tel:${employee.phone}`}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                              title="Teléfono"
                            >
                              <Phone size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-600 border border-blue-200">
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add to List Modal */}
      {showAddToListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Agregar a lista de personas</h2>
              <button
                onClick={() => setShowAddToListModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 max-h-96 overflow-y-auto">
              {peopleLists.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {peopleLists.map(list => (
                    <button
                      key={list.id}
                      onClick={() => handleAddToList(list.id)}
                      className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 group-hover:text-primary">
                            {list.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {list.items.length} personas
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No hay listas aún. Crea una abajo.</p>
              )}

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crear nueva lista
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nombre de la lista"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateAndAddToList()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  <button
                    onClick={handleCreateAndAddToList}
                    disabled={!newListName.trim()}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Crear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
