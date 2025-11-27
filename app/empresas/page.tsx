'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { companies, type Company } from '@/data/companies';
import { Search, Download, MapPin, Users, DollarSign, ExternalLink, Bookmark, ListPlus, ChevronDown, ChevronRight, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';

type ViewMode = 'list' | 'grid';

export default function EmpresasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter states
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  // Collapsible states
  const [isCountryOpen, setIsCountryOpen] = useState(true);
  const [isIndustryOpen, setIsIndustryOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isSegmentOpen, setIsSegmentOpen] = useState(true);

  // Get unique values for filters
  const countries = useMemo(() => Array.from(new Set(companies.map(c => c.country))).sort(), []);
  const industries = useMemo(() => Array.from(new Set(companies.map(c => c.industry))).sort(), []);
  const sizes = useMemo(() => Array.from(new Set(companies.map(c => c.size))).sort(), []);
  const segments = useMemo(() => ['Startup', 'PyME', 'Enterprise'] as const, []);

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

      return matchesSearch && matchesCountry && matchesIndustry && matchesSize && matchesSegment;
    });
  }, [searchTerm, selectedCountries, selectedIndustries, selectedSizes, selectedSegments]);

  const toggleSelection = (id: string) => {
    setSelectedCompanies(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleCountryFilter = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleIndustryFilter = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const toggleSizeFilter = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleSegmentFilter = (segment: string) => {
    setSelectedSegments(prev =>
      prev.includes(segment) ? prev.filter(s => s !== segment) : [...prev, segment]
    );
  };

  const clearAllFilters = () => {
    setSelectedCountries([]);
    setSelectedIndustries([]);
    setSelectedSizes([]);
    setSelectedSegments([]);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCountries.length > 0 || selectedIndustries.length > 0 ||
                          selectedSizes.length > 0 || selectedSegments.length > 0;

  const getSegmentColor = (segment: Company['segment']) => {
    const colors = {
      Startup: 'bg-purple-50 text-purple-600 border-purple-200',
      PyME: 'bg-blue-50 text-blue-600 border-blue-200',
      Enterprise: 'bg-orange-50 text-orange-600 border-orange-200',
    };
    return colors[segment];
  };

  // Stats
  const totalCompanies = companies.length;
  const netNew = companies.filter(c => c.foundedYear >= 2020).length;
  const saved = selectedCompanies.length;

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-normal text-gray-900">Companies</h1>
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
              <span className="font-semibold text-gray-900">{totalCompanies.toLocaleString()}</span>
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
                placeholder="Search companies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              {selectedCompanies.length > 0 && (
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-dark transition-colors">
                  <ListPlus size={16} />
                  Add to list ({selectedCompanies.length})
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
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
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
                            {companies.filter(c => c.country === country).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Industry Filter */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-900 py-2 hover:text-primary transition-colors"
                  >
                    <span>Industry</span>
                    {isIndustryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {isIndustryOpen && (
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {industries.map(industry => (
                        <label key={industry} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedIndustries.includes(industry)}
                            onChange={() => toggleIndustryFilter(industry)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-xs">{industry}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {companies.filter(c => c.industry === industry).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Size Filter */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsSizeOpen(!isSizeOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-900 py-2 hover:text-primary transition-colors"
                  >
                    <span>Company Size</span>
                    {isSizeOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {isSizeOpen && (
                    <div className="mt-2 space-y-2">
                      {sizes.map(size => (
                        <label key={size} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => toggleSizeFilter(size)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>{size}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {companies.filter(c => c.size === size).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Segment Filter */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsSegmentOpen(!isSegmentOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-900 py-2 hover:text-primary transition-colors"
                  >
                    <span>Segment</span>
                    {isSegmentOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {isSegmentOpen && (
                    <div className="mt-2 space-y-2">
                      {segments.map(segment => (
                        <label key={segment} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedSegments.includes(segment)}
                            onChange={() => toggleSegmentFilter(segment)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>{segment}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {companies.filter(c => c.segment === segment).length}
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
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group relative"
                    >
                      {/* Checkbox */}
                      <div className="absolute top-3 right-3">
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
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-12 h-12 rounded-lg flex-shrink-0"
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

                        {/* Company Info */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded border ${getSegmentColor(company.segment)}`}>
                              {company.segment}
                            </span>
                          </div>

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

                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Industry:</p>
                            <p className="text-xs font-medium text-gray-700">{company.industry}</p>
                          </div>
                        </div>
                      </Link>

                      {/* Actions */}
                      <div className="flex items-center gap-1 pt-2 border-t border-gray-200">
                        <Link
                          href={`/empresas/${company.id}`}
                          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium px-2 py-1.5 rounded transition-colors text-center"
                        >
                          View company
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelection(company.id);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Save"
                        >
                          <Bookmark size={14} className="text-gray-400 hover:text-primary" />
                        </button>
                        <a
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink size={14} className="text-gray-400 hover:text-primary" />
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
                      <th className="text-left px-6 py-3 w-12">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Segment
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedCompanies.includes(company.id)}
                            onChange={() => toggleSelection(company.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/empresas/${company.id}`}
                            className="flex items-center gap-3 group/name"
                          >
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-10 h-10 rounded-lg"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 group-hover/name:text-primary transition-colors">
                                {company.name}
                              </div>
                              <div className="text-xs text-gray-500">{company.website}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{company.industry}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{company.country}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{company.size}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{company.revenue}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${getSegmentColor(company.segment)}`}>
                            {company.segment}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleSelection(company.id)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                              title="Save"
                            >
                              <Bookmark size={14} />
                            </button>
                            <a
                              href={`https://${company.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                              title="Visit website"
                            >
                              <ExternalLink size={14} />
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
                  <p className="text-gray-500 mb-2">No companies found</p>
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
                Showing <span className="font-medium">{filteredCompanies.length}</span> of{' '}
                <span className="font-medium">{totalCompanies}</span> companies
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
