'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { companies, type Company } from '@/data/companies';
import { useLists } from '@/contexts/ListsContext';
import {
  Search, Download, MapPin, Users, DollarSign, ExternalLink,
  Bookmark, ListPlus, ChevronDown, ChevronRight, LayoutGrid,
  List, Sparkles, ChevronLeft, X, Star
} from 'lucide-react';
import Link from 'next/link';

type ViewMode = 'list' | 'grid';
type ActiveTab = 'searched' | 'saved';

export default function EmpresasPage() {
  const { lists, addToList, createList, createListWithItems, getListsByType } = useLists();
  const companyLists = getListsByType('companies');

  const [searchTerm, setSearchTerm] = useState('');
  const [aiSearch, setAiSearch] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState<ActiveTab>('searched');
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Filter states
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedRevenues, setSelectedRevenues] = useState<string[]>([]);

  // Collapsible states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(true);
  const [isEmployeesOpen, setIsEmployeesOpen] = useState(true);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isRevenueOpen, setIsRevenueOpen] = useState(false);
  const [isSegmentOpen, setIsSegmentOpen] = useState(false);

  // Get unique values for filters
  const countries = useMemo(() => Array.from(new Set(companies.map(c => c.country))).sort(), []);
  const industries = useMemo(() => Array.from(new Set(companies.map(c => c.industry))).sort(), []);
  const sizes = useMemo(() => Array.from(new Set(companies.map(c => c.size))).sort(), []);
  const segments = useMemo(() => ['Startup', 'PyME', 'Enterprise'] as const, []);

  const revenueRanges = useMemo(() => [
    '< USD 1M',
    'USD 1M - 10M',
    'USD 10M - 50M',
    'USD 50M - 100M',
    'USD 100M - 500M',
    'USD 500M - 1B',
    '> USD 1B'
  ], []);

  // Filter logic
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(company.country);
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(company.industry);
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(company.size);
      const matchesSegment = selectedSegments.length === 0 || selectedSegments.includes(company.segment);
      const matchesRevenue = selectedRevenues.length === 0 || selectedRevenues.includes(company.revenue);

      return matchesSearch && matchesCountry && matchesIndustry && matchesSize && matchesSegment && matchesRevenue;
    });
  }, [searchTerm, selectedCountries, selectedIndustries, selectedSizes, selectedSegments, selectedRevenues]);

  const toggleSelection = (id: string) => {
    setSelectedCompanies(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleFilter = (
    value: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedCountries([]);
    setSelectedIndustries([]);
    setSelectedSizes([]);
    setSelectedSegments([]);
    setSelectedRevenues([]);
    setSearchTerm('');
    setAiSearch('');
  };

  const hasActiveFilters =
    selectedCountries.length > 0 ||
    selectedIndustries.length > 0 ||
    selectedSizes.length > 0 ||
    selectedSegments.length > 0 ||
    selectedRevenues.length > 0;

  const getSegmentColor = (segment: Company['segment']) => {
    const colors = {
      Startup: 'bg-purple-50 text-purple-600 border-purple-200',
      PyME: 'bg-blue-50 text-blue-600 border-blue-200',
      Enterprise: 'bg-orange-50 text-orange-600 border-orange-200',
    };
    return colors[segment];
  };

  const handleAddToList = (listId: string) => {
    addToList(listId, selectedCompanies);
    setShowAddToListModal(false);
    setSelectedCompanies([]);
  };

  const handleCreateAndAddToList = () => {
    if (newListName.trim()) {
      createListWithItems(newListName, 'companies', selectedCompanies);
      setShowAddToListModal(false);
      setSelectedCompanies([]);
      setNewListName('');
    }
  };

  // Stats
  const totalCompanies = companies.length;
  const netNew = companies.filter(c => c.foundedYear >= 2020).length; // Empresas nuevas (fundadas después 2020)
  const savedInLists = companyLists.reduce((acc, list) => acc + list.items.length, 0);

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-5 py-3">
          {/* AI Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Usa IA para encontrar empresas perfectas. Ejemplo: Busca empresas tech en Argentina con más de 50 empleados..."
                value={aiSearch}
                onChange={(e) => setAiSearch(e.target.value)}
                className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mb-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('searched')}
              className={`px-1 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'searched'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recently searched
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-1 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recently saved
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-normal text-gray-900">Companies</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 rounded text-xs text-gray-700 transition-colors">
                <Download size={14} />
                Export
              </button>
              <button className="flex items-center gap-1.5 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 rounded text-xs text-gray-700 transition-colors">
                Import
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-xs mb-3">
            <div>
              <span className="text-gray-500">Total </span>
              <span className="font-semibold text-gray-900">{totalCompanies.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Net New </span>
              <span className="font-semibold text-gray-900">{netNew}</span>
            </div>
            <div>
              <span className="text-gray-500">Saved </span>
              <span className="font-semibold text-gray-900">{savedInLists}</span>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search companies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              {selectedCompanies.length > 0 && (
                <button
                  onClick={() => setShowAddToListModal(true)}
                  className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded text-xs font-medium hover:bg-primary-dark transition-colors"
                >
                  <ListPlus size={14} />
                  Add to list ({selectedCompanies.length})
                </button>
              )}

              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'} transition-colors`}
                  title="List view"
                >
                  <List size={16} className="text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'} transition-colors border-l border-gray-300`}
                  title="Grid view"
                >
                  <LayoutGrid size={16} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Collapsible Sidebar Toggle Button (when collapsed) */}
          {isSidebarCollapsed && (
            <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Show filters"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
          )}

          {/* Filters Sidebar */}
          {!isSidebarCollapsed && (
            <aside className="w-60 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filters</h3>
                  <div className="flex items-center gap-1">
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-primary hover:text-primary-dark font-medium"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors ml-2"
                      title="Hide filters"
                    >
                      <ChevronLeft size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Account Location (Country) */}
                  <div>
                    <button
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className="w-full flex items-center justify-between text-xs font-medium text-gray-900 py-1.5 hover:text-primary transition-colors"
                    >
                      <span>Account Location</span>
                      {isCountryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isCountryOpen && (
                      <div className="mt-2 space-y-1.5">
                        {countries.map(country => (
                          <label key={country} className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5">
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(country)}
                              onChange={() => toggleFilter(country, selectedCountries, setSelectedCountries)}
                              className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span className="flex-1">{country}</span>
                            <span className="text-xs text-gray-400">
                              {companies.filter(c => c.country === country).length}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* # Employees (Size) */}
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setIsEmployeesOpen(!isEmployeesOpen)}
                      className="w-full flex items-center justify-between text-xs font-medium text-gray-900 py-1.5 hover:text-primary transition-colors"
                    >
                      <span># Employees</span>
                      {isEmployeesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isEmployeesOpen && (
                      <div className="mt-2 space-y-1.5">
                        {sizes.map(size => (
                          <label key={size} className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5">
                            <input
                              type="checkbox"
                              checked={selectedSizes.includes(size)}
                              onChange={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                              className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span className="flex-1">{size}</span>
                            <span className="text-xs text-gray-400">
                              {companies.filter(c => c.size === size).length}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Industry & Keywords */}
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                      className="w-full flex items-center justify-between text-xs font-medium text-gray-900 py-1.5 hover:text-primary transition-colors"
                    >
                      <span>Industry & Keywords</span>
                      {isIndustryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isIndustryOpen && (
                      <div className="mt-2 space-y-1.5">
                        {industries.map(industry => (
                          <label key={industry} className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5">
                            <input
                              type="checkbox"
                              checked={selectedIndustries.includes(industry)}
                              onChange={() => toggleFilter(industry, selectedIndustries, setSelectedIndustries)}
                              className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span className="flex-1 text-xs">{industry}</span>
                            <span className="text-xs text-gray-400">
                              {companies.filter(c => c.industry === industry).length}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Revenue */}
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setIsRevenueOpen(!isRevenueOpen)}
                      className="w-full flex items-center justify-between text-xs font-medium text-gray-900 py-1.5 hover:text-primary transition-colors"
                    >
                      <span>Revenue</span>
                      {isRevenueOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isRevenueOpen && (
                      <div className="mt-2 space-y-1.5">
                        {revenueRanges.map(revenue => {
                          const count = companies.filter(c => c.revenue === revenue).length;
                          return (
                            <label key={revenue} className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5">
                              <input
                                type="checkbox"
                                checked={selectedRevenues.includes(revenue)}
                                onChange={() => toggleFilter(revenue, selectedRevenues, setSelectedRevenues)}
                                className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                              />
                              <span className="flex-1">{revenue}</span>
                              <span className="text-xs text-gray-400">{count}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Company Type (Segment) */}
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setIsSegmentOpen(!isSegmentOpen)}
                      className="w-full flex items-center justify-between text-xs font-medium text-gray-900 py-1.5 hover:text-primary transition-colors"
                    >
                      <span>Company Type</span>
                      {isSegmentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isSegmentOpen && (
                      <div className="mt-2 space-y-1.5">
                        {segments.map(segment => (
                          <label key={segment} className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5">
                            <input
                              type="checkbox"
                              checked={selectedSegments.includes(segment)}
                              onChange={() => toggleFilter(segment, selectedSegments, setSelectedSegments)}
                              className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span className="flex-1">{segment}</span>
                            <span className="text-xs text-gray-400">
                              {companies.filter(c => c.segment === segment).length}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Lookalikes (Pro feature) */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-400 py-1.5">
                      <span>Lookalikes</span>
                      <span className="px-1.5 py-0.5 bg-warning/20 text-warning text-[10px] font-semibold rounded">PRO</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Encuentra empresas similares a tus mejores clientes</p>
                  </div>

                  {/* Job Postings (Pro feature) */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-400 py-1.5">
                      <span>Job Postings</span>
                      <span className="px-1.5 py-0.5 bg-warning/20 text-warning text-[10px] font-semibold rounded">PRO</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Filtra por empresas que están contratando</p>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="flex-1 overflow-auto p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow group relative"
                    >
                      {/* Checkbox */}
                      <div className="absolute top-2.5 right-2.5">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.includes(company.id)}
                          onChange={() => toggleSelection(company.id)}
                          className="rounded border-gray-300 w-4 h-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Company Header */}
                      <Link href={`/empresas/${company.id}`} className="block">
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-10 h-10 rounded-lg flex-shrink-0 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-medium text-gray-900 group-hover:text-primary transition-colors mb-0.5 truncate">
                              {company.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={11} />
                              <span>{company.country}</span>
                            </div>
                          </div>
                        </div>

                        {/* Company Info */}
                        <div className="space-y-2 mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${getSegmentColor(company.segment)}`}>
                              {company.segment}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2">
                            {company.description}
                          </p>

                          <div className="grid grid-cols-2 gap-1.5 text-xs">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Users size={11} />
                              <span className="text-[11px]">{company.size}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <DollarSign size={11} />
                              <span className="text-[11px]">{company.revenue.replace('USD ', '')}</span>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-gray-200">
                            <p className="text-[10px] text-gray-500">Industry:</p>
                            <p className="text-xs font-medium text-gray-700 truncate">{company.industry}</p>
                          </div>
                        </div>
                      </Link>

                      {/* Actions */}
                      <div className="flex items-center gap-1 pt-2 border-t border-gray-200">
                        <Link
                          href={`/empresas/${company.id}`}
                          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-medium px-2 py-1.5 rounded transition-colors text-center"
                        >
                          View company
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelection(company.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Save"
                        >
                          <Bookmark size={13} className="text-gray-400 hover:text-primary" />
                        </button>
                        <a
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink size={13} className="text-gray-400 hover:text-primary" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-2.5 w-10">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 w-4 h-4"
                        />
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Segment
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCompanies.map((company) => (
                      <tr
                        key={company.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedCompanies.includes(company.id)}
                            onChange={() => toggleSelection(company.id)}
                            className="rounded border-gray-300 w-4 h-4"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/empresas/${company.id}`}
                            className="flex items-center gap-2.5 group/name"
                          >
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-9 h-9 rounded-lg object-cover"
                            />
                            <div>
                              <div className="text-xs font-medium text-gray-900 group-hover/name:text-primary transition-colors">
                                {company.name}
                              </div>
                              <div className="text-xs text-gray-500">{company.website}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-700">{company.industry}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{company.country}</td>
                        <td className="px-4 py-3 text-xs text-gray-700">{company.size}</td>
                        <td className="px-4 py-3 text-xs text-gray-700">{company.revenue}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded border ${getSegmentColor(company.segment)}`}>
                            {company.segment}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleSelection(company.id)}
                              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                              title="Save"
                            >
                              <Bookmark size={13} />
                            </button>
                            <a
                              href={`https://${company.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                              title="Visit website"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* No Results */}
            {filteredCompanies.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2 text-sm">No companies found</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:text-primary-dark font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 px-5 py-2.5 bg-gray-50">
              <p className="text-xs text-gray-600">
                Showing <span className="font-medium">{filteredCompanies.length}</span> of{' '}
                <span className="font-medium">{totalCompanies}</span> companies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add to List Modal */}
      {showAddToListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Add to List</h2>
              <button
                onClick={() => setShowAddToListModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 max-h-96 overflow-y-auto">
              {companyLists.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {companyLists.map(list => (
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
                            {list.items.length} companies
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No lists yet. Create one below.</p>
              )}

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create new list
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="List name"
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
                    Create
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
