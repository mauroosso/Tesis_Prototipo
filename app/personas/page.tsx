'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { people, type Person } from '@/data/people';
import { Search, Download, ListPlus, Linkedin, Mail, ChevronDown, ChevronRight, LayoutGrid, List, Info } from 'lucide-react';
import Link from 'next/link';

type ViewMode = 'list' | 'grid';

export default function PersonasPage() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Filter states
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSeniorities, setSelectedSeniorities] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Collapsible states
  const [isCountryOpen, setIsCountryOpen] = useState(true);
  const [isSeniorityOpen, setIsSeniorityOpen] = useState(true);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(true);

  // Get unique values for filters
  const countries = useMemo(() => Array.from(new Set(people.map(p => p.country))).sort(), []);
  const seniorities = useMemo(() => Array.from(new Set(people.map(p => p.seniority))).sort(), []);
  const departments = useMemo(() => Array.from(new Set(people.map(p => p.department))).sort(), []);
  const statuses = useMemo(() => ['nuevo', 'warm-up', 'contactado', 'interesado', 'reunión', 'cliente'] as const, []);

  // Filter logic
  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const matchesSearch =
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(person.country);
      const matchesSeniority = selectedSeniorities.length === 0 || selectedSeniorities.includes(person.seniority);
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(person.department);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(person.status);

      return matchesSearch && matchesCountry && matchesSeniority && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedCountries, selectedSeniorities, selectedDepartments, selectedStatuses]);

  const toggleSelection = (id: string) => {
    setSelectedPeople(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPeople.length === filteredPeople.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(filteredPeople.map(p => p.id));
    }
  };

  const toggleCountryFilter = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleSeniorityFilter = (seniority: string) => {
    setSelectedSeniorities(prev =>
      prev.includes(seniority) ? prev.filter(s => s !== seniority) : [...prev, seniority]
    );
  };

  const toggleDepartmentFilter = (department: string) => {
    setSelectedDepartments(prev =>
      prev.includes(department) ? prev.filter(d => d !== department) : [...prev, department]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSelectedCountries([]);
    setSelectedSeniorities([]);
    setSelectedDepartments([]);
    setSelectedStatuses([]);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCountries.length > 0 || selectedSeniorities.length > 0 ||
                          selectedDepartments.length > 0 || selectedStatuses.length > 0;

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

  // Stats
  const totalPeople = people.length;
  const netNew = people.filter(p => p.roleChangedRecently).length;
  const saved = selectedPeople.length;

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-normal text-gray-900">People</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 rounded text-sm text-gray-700 transition-colors">
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 rounded text-sm text-gray-700 transition-colors">
                Import
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm mb-4">
            <div>
              <span className="text-gray-500">Total </span>
              <span className="font-semibold text-gray-900">{totalPeople.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Net New </span>
              <span className="font-semibold text-gray-900">{netNew}</span>
            </div>
            <div>
              <span className="text-gray-500">Saved </span>
              <span className="font-semibold text-gray-900">{saved}</span>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search people"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              {selectedPeople.length > 0 && (
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-dark transition-colors">
                  <ListPlus size={16} />
                  Add to list ({selectedPeople.length})
                </button>
              )}

              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'} transition-colors`}
                  title="List view"
                >
                  <List size={18} className="text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'} transition-colors border-l border-gray-300`}
                  title="Grid view"
                >
                  <LayoutGrid size={18} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Filters Sidebar */}
          <aside className="w-60 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:text-primary-dark font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Country Filter */}
                <div>
                  <button
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-900 py-2 hover:text-primary transition-colors"
                  >
                    <span>Country</span>
                    {isCountryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {isCountryOpen && (
                    <div className="mt-2 space-y-2">
                      {countries.map(country => (
                        <label key={country} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedCountries.includes(country)}
                            onChange={() => toggleCountryFilter(country)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>{country}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {people.filter(p => p.country === country).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Seniority Filter */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsSeniorityOpen(!isSeniorityOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-900 py-2 hover:text-primary transition-colors"
                  >
                    <span>Seniority</span>
                    {isSeniorityOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {isSeniorityOpen && (
                    <div className="mt-2 space-y-2">
                      {seniorities.map(seniority => (
                        <label key={seniority} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedSeniorities.includes(seniority)}
                            onChange={() => toggleSeniorityFilter(seniority)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>{seniority}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {people.filter(p => p.seniority === seniority).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Department Filter */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-900 py-2 hover:text-primary transition-colors"
                  >
                    <span>Department</span>
                    {isDepartmentOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {isDepartmentOpen && (
                    <div className="mt-2 space-y-2">
                      {departments.map(department => (
                        <label key={department} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedDepartments.includes(department)}
                            onChange={() => toggleDepartmentFilter(department)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>{department}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {people.filter(p => p.department === department).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-900 py-2 hover:text-primary transition-colors"
                  >
                    <span>Status</span>
                    {isStatusOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {isStatusOpen && (
                    <div className="mt-2 space-y-2">
                      {statuses.map(status => (
                        <label key={status} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(status)}
                            onChange={() => toggleStatusFilter(status)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="capitalize">{status}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {people.filter(p => p.status === status).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Tip */}
            {filteredPeople.length > 0 && (
              <div className="px-6 pt-4">
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded px-3 py-2">
                  <Info className="text-primary flex-shrink-0 mt-0.5" size={14} />
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Tip:</span> People who changed roles in the last 90 days are{' '}
                    <span className="text-primary font-medium">3x more likely</span> to respond.
                  </p>
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200 sticky top-0">
                    <tr>
                      <th className="text-left px-6 py-3 w-12">
                        <input
                          type="checkbox"
                          checked={filteredPeople.length > 0 && selectedPeople.length === filteredPeople.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredPeople.map((person) => (
                      <tr
                        key={person.id}
                        className="hover:bg-gray-50 transition-colors group"
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
                              <div className="text-sm font-medium text-gray-900 group-hover/name:text-primary transition-colors">
                                {person.fullName}
                                {person.roleChangedRecently && (
                                  <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-normal">
                                    New role
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{person.seniority}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{person.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{person.company}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{person.country}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getStatusBadge(
                              person.status
                            )}`}
                          >
                            {person.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                              href={`https://${person.linkedIn}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                              title="LinkedIn"
                            >
                              <Linkedin size={14} />
                            </a>
                            <a
                              href={`mailto:${person.email}`}
                              className="p-1.5 rounded hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors"
                              title="Email"
                            >
                              <Mail size={14} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPeople.map((person) => (
                    <div
                      key={person.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group relative"
                    >
                      <div className="absolute top-3 right-3">
                        <input
                          type="checkbox"
                          checked={selectedPeople.includes(person.id)}
                          onChange={() => toggleSelection(person.id)}
                          className="rounded border-gray-300"
                        />
                      </div>

                      <Link href={`/personas/${person.id}`} className="block">
                        <div className="flex flex-col items-center text-center mb-4">
                          <img
                            src={person.avatar}
                            alt={person.fullName}
                            className="w-16 h-16 rounded-full mb-3"
                          />
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors mb-1">
                            {person.fullName}
                            {person.roleChangedRecently && (
                              <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-gray-600 mb-1">{person.title}</p>
                          <p className="text-xs text-gray-500">{person.company}</p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Location:</span>
                            <span className="text-gray-700">{person.country}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Seniority:</span>
                            <span className="text-gray-700">{person.seniority}</span>
                          </div>
                          <div className="flex items-center justify-center pt-2">
                            <span
                              className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getStatusBadge(
                                person.status
                              )}`}
                            >
                              {person.status}
                            </span>
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`https://${person.linkedIn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin size={16} />
                        </a>
                        <a
                          href={`mailto:${person.email}`}
                          className="p-2 rounded hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Email"
                        >
                          <Mail size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredPeople.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">No people found</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:text-primary-dark font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredPeople.length}</span> of{' '}
                <span className="font-medium">{totalPeople}</span> people
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
