'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { people } from '@/data/people';
import { useLists } from '@/contexts/ListsContext';
import { useCRM, type WarmupAction } from '@/contexts/CRMContext';
import Link from 'next/link';
import {
  Eye, ThumbsUp, MessageCircle, UserPlus, FileText, Users as UsersIcon,
  Building2, Bookmark, ArrowLeft, Sparkles, CheckCircle2, Circle, Clock
} from 'lucide-react';

interface PersonWarmupState {
  personId: string;
  actions: {
    'visitar-perfil': boolean;
    'dar-like': boolean;
    'comentar': boolean;
    'seguir': boolean;
    'ver-posts': boolean;
    'interactuar-seguidores': boolean;
    'revisar-empresa': boolean;
    'guardar-posts': boolean;
  };
  aiSuggestions: string[];
}

type WarmupStatus = 'pendiente' | 'en-progreso' | 'completo';

export default function WarmupSocialPage() {
  const searchParams = useSearchParams();
  const listId = searchParams?.get('listId');
  const { lists, getListsByType } = useLists();
  const { createLead, addWarmupAction, getLeadByPersonId, updateLeadStatus } = useCRM();

  const [selectedList, setSelectedList] = useState<string | null>(listId);
  const [warmupStates, setWarmupStates] = useState<Record<string, PersonWarmupState>>({});
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  const peopleLists = getListsByType('people');

  // Get people from selected list
  const selectedPeopleData = useMemo(() => {
    if (!selectedList) return [];
    const list = lists.find(l => l.id === selectedList);
    if (!list) return [];
    return list.items.map(id => people.find(p => p.id === id)).filter(Boolean);
  }, [selectedList, lists]);

  // Generate AI suggestions based on person data
  const generateAISuggestions = (person: any): string[] => {
    const suggestions: string[] = [];

    // Based on seniority
    if (person.seniority === 'C-Level') {
      suggestions.push('Comentar sobre tendencias de la industria en sus posts');
      suggestions.push('Revisar actividad reciente de su empresa');
    } else if (person.seniority === 'VP' || person.seniority === 'Director') {
      suggestions.push('Dar like a publicaciones sobre logros del equipo');
      suggestions.push('Seguir para aparecer en su radar');
    } else {
      suggestions.push('Interactuar con publicaciones donde mencione proyectos');
    }

    // Based on department
    if (person.department === 'Sales' || person.department === 'Marketing') {
      suggestions.push('Guardar posts sobre estrategias de growth');
      suggestions.push('Comentar aportando valor sobre leads/conversiones');
    } else if (person.department === 'Engineering' || person.department === 'Product') {
      suggestions.push('Comentar sobre tecnologías que mencione');
    }

    // Based on role change
    if (person.roleChangedRecently) {
      suggestions.push('🔥 Felicitar por nuevo rol (engagement alto)');
      suggestions.push('Revisar empresa nueva y comentar sobre su visión');
    }

    // General suggestions
    suggestions.push('Ver últimos 5 posts para contexto');
    suggestions.push('Visitar perfil completo antes de conectar');

    return suggestions.slice(0, 4); // Return top 4 suggestions
  };

  // Initialize warmup states for selected people
  useEffect(() => {
    if (selectedPeopleData.length > 0) {
      const newStates: Record<string, PersonWarmupState> = {};
      selectedPeopleData.forEach(person => {
        if (person) {
          // Check if person already has warmup actions in CRM
          const lead = getLeadByPersonId(person.id);
          const existingActions = lead?.warmupActions || [];

          newStates[person.id] = {
            personId: person.id,
            actions: {
              'visitar-perfil': existingActions.some(a => a.type === 'visitar-perfil'),
              'dar-like': existingActions.some(a => a.type === 'dar-like'),
              'comentar': existingActions.some(a => a.type === 'comentar'),
              'seguir': existingActions.some(a => a.type === 'seguir'),
              'ver-posts': existingActions.some(a => a.type === 'ver-posts'),
              'interactuar-seguidores': existingActions.some(a => a.type === 'interactuar-seguidores'),
              'revisar-empresa': existingActions.some(a => a.type === 'revisar-empresa'),
              'guardar-posts': existingActions.some(a => a.type === 'guardar-posts'),
            },
            aiSuggestions: generateAISuggestions(person),
          };

          // Create lead if doesn't exist
          if (!lead) {
            createLead(person.id);
          }
        }
      });
      setWarmupStates(newStates);
    }
  }, [selectedPeopleData]);

  // Calculate warmup status for a person
  const getPersonStatus = (personId: string): WarmupStatus => {
    const state = warmupStates[personId];
    if (!state) return 'pendiente';

    const completedActions = Object.values(state.actions).filter(Boolean).length;
    if (completedActions === 0) return 'pendiente';
    if (completedActions === 8) return 'completo';
    return 'en-progreso';
  };

  const togglePersonSelection = (personId: string) => {
    setSelectedPeople(prev =>
      prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]
    );
  };

  const selectAllPeople = () => {
    if (selectedPeople.length === selectedPeopleData.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(selectedPeopleData.map(p => p!.id));
    }
  };

  const toggleAction = (personId: string, actionType: keyof PersonWarmupState['actions']) => {
    setWarmupStates(prev => {
      const updated = { ...prev };
      if (updated[personId]) {
        updated[personId] = {
          ...updated[personId],
          actions: {
            ...updated[personId].actions,
            [actionType]: !updated[personId].actions[actionType],
          },
        };
      }
      return updated;
    });
  };

  const applyWarmupToSelected = () => {
    selectedPeople.forEach(personId => {
      const state = warmupStates[personId];
      const lead = getLeadByPersonId(personId);

      if (state && lead) {
        // Add all checked actions to CRM
        Object.entries(state.actions).forEach(([actionType, isChecked]) => {
          if (isChecked) {
            // Check if action already exists
            const alreadyExists = lead.warmupActions.some(
              a => a.type === actionType && a.personId === personId
            );

            if (!alreadyExists) {
              addWarmupAction(lead.id, {
                type: actionType as WarmupAction['type'],
                personId,
              });
            }
          }
        });

        // Update lead status to warm-up if it was nuevo
        if (lead.status === 'nuevo') {
          updateLeadStatus(lead.id, 'warm-up');
        }
      }
    });

    // Clear selection after applying
    setSelectedPeople([]);
  };

  const getActionIcon = (type: keyof PersonWarmupState['actions']) => {
    switch (type) {
      case 'visitar-perfil':
        return <Eye size={14} className="text-blue-500" />;
      case 'seguir':
        return <UserPlus size={14} className="text-purple-500" />;
      case 'dar-like':
        return <ThumbsUp size={14} className="text-green-500" />;
      case 'comentar':
        return <MessageCircle size={14} className="text-orange-500" />;
      case 'ver-posts':
        return <FileText size={14} className="text-indigo-500" />;
      case 'interactuar-seguidores':
        return <UsersIcon size={14} className="text-pink-500" />;
      case 'revisar-empresa':
        return <Building2 size={14} className="text-cyan-500" />;
      case 'guardar-posts':
        return <Bookmark size={14} className="text-amber-500" />;
    }
  };

  const getActionLabel = (type: keyof PersonWarmupState['actions']) => {
    const labels = {
      'visitar-perfil': 'Visitar perfil',
      'dar-like': 'Dar like',
      'comentar': 'Comentar',
      'seguir': 'Seguir',
      'ver-posts': 'Ver posts',
      'interactuar-seguidores': 'Interactuar seguidores',
      'revisar-empresa': 'Revisar empresa',
      'guardar-posts': 'Guardar posts',
    };
    return labels[type];
  };

  const getStatusBadge = (status: WarmupStatus) => {
    const badges = {
      'pendiente': (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          <Circle size={8} />
          Pendiente
        </span>
      ),
      'en-progreso': (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-200">
          <Clock size={8} />
          En progreso
        </span>
      ),
      'completo': (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600 border border-green-200">
          <CheckCircle2 size={8} />
          Completo
        </span>
      ),
    };
    return badges[status];
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-normal text-gray-900 mb-1">Warm-up Social</h1>
                <p className="text-sm text-gray-500">
                  Calienta tus prospectos con interacciones naturales antes del primer contacto directo
                </p>
              </div>
              <Link
                href="/listas"
                className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Volver a listas
              </Link>
            </div>

            {/* List Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Lista:</label>
              <select
                value={selectedList || ''}
                onChange={(e) => setSelectedList(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[300px]"
              >
                <option value="">Seleccionar lista de personas</option>
                {peopleLists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.name} ({list.items.length} personas)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Bar */}
          {selectedPeople.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-3 bg-blue-50 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedPeople.length} persona{selectedPeople.length !== 1 ? 's' : ''} seleccionada{selectedPeople.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={applyWarmupToSelected}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <Sparkles size={16} />
                Aplicar warm-up a los seleccionados
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {!selectedList || selectedPeopleData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Sparkles size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona una lista de personas
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                Elige una lista de personas arriba para comenzar el proceso de warm-up social con acciones personalizadas por IA.
              </p>
            </div>
          ) : (
            <div className="bg-white">
              {/* Table */}
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={selectedPeople.length === selectedPeopleData.length && selectedPeopleData.length > 0}
                        onChange={selectAllPeople}
                        className="rounded border-gray-300 w-4 h-4"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Persona
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      País
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seniority
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones IA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedPeopleData.map(person => {
                    if (!person) return null;
                    const state = warmupStates[person.id];
                    const status = getPersonStatus(person.id);
                    const isExpanded = expandedPerson === person.id;

                    return (
                      <>
                        <tr
                          key={person.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setExpandedPerson(isExpanded ? null : person.id)}
                        >
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedPeople.includes(person.id)}
                              onChange={() => togglePersonSelection(person.id)}
                              className="rounded border-gray-300 w-4 h-4"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={person.avatar}
                                alt={person.fullName}
                                className="w-9 h-9 rounded-full"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{person.fullName}</div>
                                <div className="text-xs text-gray-500">{person.timezone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{person.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{person.company}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{person.country}</td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                              {person.seniority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(status)}
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1">
                              <Sparkles size={12} />
                              Ver sugerencias ({state?.aiSuggestions.length || 0})
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Details Row */}
                        {isExpanded && state && (
                          <tr>
                            <td colSpan={8} className="px-4 py-4 bg-gray-50">
                              <div className="max-w-6xl mx-auto">
                                <div className="grid grid-cols-2 gap-6">
                                  {/* Left: Actions */}
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                      <CheckCircle2 size={16} className="text-primary" />
                                      Acciones de Warm-up
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {(Object.keys(state.actions) as Array<keyof PersonWarmupState['actions']>).map(actionType => (
                                        <label
                                          key={actionType}
                                          className="flex items-center gap-2 p-2 rounded border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={state.actions[actionType]}
                                            onChange={() => toggleAction(person.id, actionType)}
                                            className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                                          />
                                          <div className="flex items-center gap-1.5 flex-1">
                                            {getActionIcon(actionType)}
                                            <span className="text-xs text-gray-700">
                                              {getActionLabel(actionType)}
                                            </span>
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Right: AI Suggestions */}
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                      <Sparkles size={16} className="text-amber-500" />
                                      Sugerencias de IA
                                    </h4>
                                    <div className="space-y-2">
                                      {state.aiSuggestions.map((suggestion, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-2 p-2 rounded bg-amber-50 border border-amber-100"
                                        >
                                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                          <p className="text-xs text-gray-700 flex-1">{suggestion}</p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* LinkedIn Link */}
                                    <div className="mt-4">
                                      <a
                                        href={`https://${person.linkedIn}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Ir a LinkedIn →
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
