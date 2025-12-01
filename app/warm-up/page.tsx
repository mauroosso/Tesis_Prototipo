'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { people, type Person } from '@/data/people';
import { useLists } from '@/contexts/ListsContext';
import { useCRM, type WarmupAction } from '@/contexts/CRMContext';
import Link from 'next/link';
import {
  Eye, ThumbsUp, MessageCircle, UserPlus, FileText, Users as UsersIcon,
  Building2, Bookmark, ArrowLeft, Sparkles, CheckCircle, Play, Zap,
  Clock, TrendingUp, Brain, Loader2, Check, X
} from 'lucide-react';

type WarmupActionType = 'visitar-perfil' | 'dar-like' | 'comentar' | 'seguir' | 'ver-posts' | 'interactuar-seguidores' | 'revisar-empresa' | 'guardar-posts';

interface PhantomAction {
  id: WarmupActionType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  estimatedTime: string;
  category: 'engagement' | 'research' | 'connection';
}

interface ExecutionProgress {
  total: number;
  current: number;
  personName: string;
  status: 'running' | 'completed' | 'failed';
}

interface AISuggestion {
  personId: string;
  action: WarmupActionType;
  confidence: number;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
}

export default function WarmupSocialPage() {
  const searchParams = useSearchParams();
  const listId = searchParams?.get('listId');
  const { lists, getListsByType } = useLists();
  const { createLead, addWarmupAction, getLeadByPersonId, updateLeadStatus, leads } = useCRM();

  const [selectedList, setSelectedList] = useState<string | null>(listId);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [executingAction, setExecutingAction] = useState<WarmupActionType | null>(null);
  const [progress, setProgress] = useState<ExecutionProgress | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const peopleLists = getListsByType('people');

  // Get people from selected list
  const selectedPeopleData = useMemo(() => {
    if (!selectedList) return [];
    const list = lists.find(l => l.id === selectedList);
    if (!list) return [];
    return list.items.map(id => people.find(p => p.id === id)).filter(Boolean) as Person[];
  }, [selectedList, lists]);

  // Generate AI Suggestions based on lead data
  const aiSuggestions = useMemo(() => {
    if (selectedPeopleData.length === 0) return [];

    const suggestions: AISuggestion[] = [];

    selectedPeopleData.forEach(person => {
      const lead = getLeadByPersonId(person.id);
      const warmupCount = lead?.warmupActions.length || 0;

      // New leads - suggest profile visit first
      if (!lead || warmupCount === 0) {
        suggestions.push({
          personId: person.id,
          action: 'visitar-perfil',
          confidence: 0.95,
          reason: 'Prospecto nuevo sin interacciones previas',
          urgency: 'high'
        });
      }

      // Recently changed role - suggest company research
      if (person.roleChangedRecently) {
        suggestions.push({
          personId: person.id,
          action: 'revisar-empresa',
          confidence: 0.88,
          reason: 'Cambió de rol recientemente - investigar nueva empresa',
          urgency: 'high'
        });
      }

      // Has some warmup but not following yet
      if (lead && warmupCount > 0 && warmupCount < 3) {
        const hasFollowed = lead.warmupActions.some(a => a.type === 'seguir');
        if (!hasFollowed) {
          suggestions.push({
            personId: person.id,
            action: 'seguir',
            confidence: 0.82,
            reason: 'Ya hay interacciones previas - momento ideal para seguir',
            urgency: 'medium'
          });
        }
      }

      // C-Level executives - suggest engagement on posts
      if (person.seniority === 'C-Level' && warmupCount > 0) {
        suggestions.push({
          personId: person.id,
          action: 'comentar',
          confidence: 0.90,
          reason: 'Ejecutivo de alto nivel - comentario genera mayor impacto',
          urgency: 'high'
        });
      }

      // Marketing department - engage with their content
      if (person.department === 'Marketing') {
        suggestions.push({
          personId: person.id,
          action: 'ver-posts',
          confidence: 0.75,
          reason: 'Profesional de marketing - contenido probablemente activo',
          urgency: 'medium'
        });
      }
    });

    // Sort by confidence and urgency
    return suggestions.sort((a, b) => {
      const urgencyWeight = { high: 3, medium: 2, low: 1 };
      const scoreA = a.confidence * urgencyWeight[a.urgency];
      const scoreB = b.confidence * urgencyWeight[b.urgency];
      return scoreB - scoreA;
    }).slice(0, 5); // Top 5 suggestions
  }, [selectedPeopleData, leads]);

  // PhantomBuster-style actions
  const phantomActions: PhantomAction[] = [
    {
      id: 'visitar-perfil',
      title: 'Visitar Perfil',
      description: 'Ver el perfil completo en LinkedIn para aparecer en sus visitantes',
      icon: <Eye size={20} />,
      color: '#4F7CF9',
      bgColor: '#E8EFFF',
      estimatedTime: '5 seg',
      category: 'research',
    },
    {
      id: 'dar-like',
      title: 'Dar Like',
      description: 'Like a su última publicación para generar familiaridad',
      icon: <ThumbsUp size={20} />,
      color: '#10B981',
      bgColor: '#D1FAE5',
      estimatedTime: '3 seg',
      category: 'engagement',
    },
    {
      id: 'comentar',
      title: 'Comentar',
      description: 'Dejar comentario de valor en su contenido reciente',
      icon: <MessageCircle size={20} />,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      estimatedTime: '2 min',
      category: 'engagement',
    },
    {
      id: 'seguir',
      title: 'Seguir',
      description: 'Seguir su perfil en LinkedIn para recibir actualizaciones',
      icon: <UserPlus size={20} />,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      estimatedTime: '2 seg',
      category: 'connection',
    },
    {
      id: 'ver-posts',
      title: 'Ver Posts',
      description: 'Revisar últimos 5 posts para entender sus intereses',
      icon: <FileText size={20} />,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      estimatedTime: '1 min',
      category: 'research',
    },
    {
      id: 'interactuar-seguidores',
      title: 'Interactuar Seguidores',
      description: 'Explorar y conectar con seguidores comunes',
      icon: <UsersIcon size={20} />,
      color: '#EC4899',
      bgColor: '#FCE7F3',
      estimatedTime: '3 min',
      category: 'connection',
    },
    {
      id: 'revisar-empresa',
      title: 'Revisar Empresa',
      description: 'Ver página de la empresa y seguir actualizaciones',
      icon: <Building2 size={20} />,
      color: '#06B6D4',
      bgColor: '#CFFAFE',
      estimatedTime: '30 seg',
      category: 'research',
    },
    {
      id: 'guardar-posts',
      title: 'Guardar Posts',
      description: 'Guardar posts relevantes para referencia futura',
      icon: <Bookmark size={20} />,
      color: '#F97316',
      bgColor: '#FFEDD5',
      estimatedTime: '10 seg',
      category: 'research',
    },
  ];

  const togglePerson = (personId: string) => {
    setSelectedPeople(prev =>
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const selectAllPeople = () => {
    if (selectedPeople.length === selectedPeopleData.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(selectedPeopleData.map(p => p.id));
    }
  };

  // Execute action with visual progress
  const executeAction = async (actionType: WarmupActionType) => {
    if (selectedPeople.length === 0) {
      alert('Selecciona al menos una persona');
      return;
    }

    setExecutingAction(actionType);
    setProgress({
      total: selectedPeople.length,
      current: 0,
      personName: '',
      status: 'running'
    });

    // Simulate execution with delay for each person
    for (let i = 0; i < selectedPeople.length; i++) {
      const personId = selectedPeople[i];
      const person = people.find(p => p.id === personId);

      setProgress({
        total: selectedPeople.length,
        current: i,
        personName: person?.fullName || '',
        status: 'running'
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      // Create lead if doesn't exist
      let lead = getLeadByPersonId(personId);
      if (!lead) {
        createLead(personId);
        lead = getLeadByPersonId(personId);
      }

      if (lead) {
        // Add warmup action
        addWarmupAction(lead.id, {
          type: actionType,
          personId,
        });

        // Update status to warm-up if was nuevo
        if (lead.status === 'nuevo') {
          updateLeadStatus(lead.id, 'warm-up');
        }
      }
    }

    // Show completion
    setProgress({
      total: selectedPeople.length,
      current: selectedPeople.length,
      personName: '',
      status: 'completed'
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setExecutingAction(null);
      setProgress(null);
      setSelectedPeople([]);
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engagement': return '#10B981';
      case 'research': return '#3B82F6';
      case 'connection': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getPersonWarmupCount = (personId: string) => {
    const lead = getLeadByPersonId(personId);
    return lead?.warmupActions.length || 0;
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
        {/* Header */}
        <div className="bg-white border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold" style={{ color: 'var(--gray-800)' }}>
                    Warm-up Social
                  </h1>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    Powered by AI
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
                  Ejecuta acciones automatizadas de warm-up estilo PhantomBuster con sugerencias inteligentes
                </p>
              </div>
              <Link
                href="/listas"
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Volver a listas
              </Link>
            </div>

            {/* List Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium" style={{ color: 'var(--gray-700)' }}>
                Lista:
              </label>
              <select
                value={selectedList || ''}
                onChange={(e) => {
                  setSelectedList(e.target.value || null);
                  setSelectedPeople([]);
                }}
                className="min-w-[300px]"
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {!selectedList || selectedPeopleData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className="rounded-full p-8 mb-6"
                style={{
                  background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)'
                }}
              >
                <Sparkles size={64} style={{ color: 'var(--primary-blue)' }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--gray-800)' }}>
                Selecciona una lista de personas
              </h3>
              <p className="text-sm max-w-md" style={{ color: 'var(--gray-500)' }}>
                Elige una lista arriba para comenzar el warm-up social con Phantoms automatizados y sugerencias de IA
              </p>
            </div>
          ) : (
            <div className="max-w-[1400px] mx-auto space-y-6">
              {/* AI Suggestions Banner */}
              {aiSuggestions.length > 0 && (
                <div
                  className="phantom-card p-6"
                  style={{
                    background: 'linear-gradient(135deg, #667eea11 0%, #764ba211 100%)',
                    borderLeft: '4px solid #667eea'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      <Brain size={24} style={{ color: 'white' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--gray-800)' }}>
                        Sugerencias Inteligentes
                        <Sparkles size={16} style={{ color: '#667eea' }} />
                      </h3>
                      <p className="text-sm mb-4" style={{ color: 'var(--gray-600)' }}>
                        Basado en el análisis de actividad reciente y perfil de los prospectos
                      </p>
                      <div className="space-y-2">
                        {aiSuggestions.slice(0, 3).map((suggestion, idx) => {
                          const person = people.find(p => p.id === suggestion.personId);
                          const action = phantomActions.find(a => a.id === suggestion.action);
                          if (!person || !action) return null;

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-lg bg-white"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={person.avatar}
                                  alt={person.fullName}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <div className="text-sm font-medium" style={{ color: 'var(--gray-800)' }}>
                                    {person.fullName}
                                  </div>
                                  <div className="text-xs flex items-center gap-2" style={{ color: 'var(--gray-500)' }}>
                                    <span
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        background: action.color
                                      }}
                                    />
                                    {action.title} • {suggestion.reason}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <TrendingUp size={14} style={{ color: '#10B981' }} />
                                  <span className="text-xs font-medium" style={{ color: '#10B981' }}>
                                    {Math.round(suggestion.confidence * 100)}%
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedPeople([suggestion.personId]);
                                    executeAction(suggestion.action);
                                  }}
                                  className="text-xs px-3 py-1 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                  style={{
                                    background: action.color,
                                    color: 'white'
                                  }}
                                >
                                  Ejecutar
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* People Table */}
              <div className="phantom-card overflow-hidden">
                <div className="p-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--gray-800)' }}>
                      Contactos ({selectedPeopleData.length})
                    </h2>
                    <button
                      onClick={selectAllPeople}
                      className="text-sm font-medium"
                      style={{ color: 'var(--primary-blue)' }}
                    >
                      {selectedPeople.length === selectedPeopleData.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ background: 'var(--gray-50)' }}>
                      <tr>
                        <th className="text-left text-xs font-medium px-6 py-3" style={{ color: 'var(--gray-500)', width: '40px' }}>
                          <input
                            type="checkbox"
                            checked={selectedPeople.length === selectedPeopleData.length && selectedPeopleData.length > 0}
                            onChange={selectAllPeople}
                          />
                        </th>
                        <th className="text-left text-xs font-medium px-6 py-3" style={{ color: 'var(--gray-500)' }}>
                          CONTACTO
                        </th>
                        <th className="text-left text-xs font-medium px-6 py-3" style={{ color: 'var(--gray-500)' }}>
                          EMPRESA
                        </th>
                        <th className="text-left text-xs font-medium px-6 py-3" style={{ color: 'var(--gray-500)' }}>
                          NIVEL
                        </th>
                        <th className="text-left text-xs font-medium px-6 py-3" style={{ color: 'var(--gray-500)' }}>
                          WARM-UP
                        </th>
                        <th className="text-left text-xs font-medium px-6 py-3" style={{ color: 'var(--gray-500)' }}>
                          ESTADO
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPeopleData.map((person, idx) => {
                        const isSelected = selectedPeople.includes(person.id);
                        const warmupCount = getPersonWarmupCount(person.id);
                        const lead = getLeadByPersonId(person.id);

                        return (
                          <tr
                            key={person.id}
                            className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                            style={{ borderColor: 'var(--border-light)' }}
                            onClick={() => togglePerson(person.id)}
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => togglePerson(person.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={person.avatar}
                                  alt={person.fullName}
                                  className="w-10 h-10 rounded-full"
                                />
                                <div>
                                  <div className="text-sm font-medium" style={{ color: 'var(--gray-800)' }}>
                                    {person.fullName}
                                  </div>
                                  <div className="text-xs" style={{ color: 'var(--gray-500)' }}>
                                    {person.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm" style={{ color: 'var(--gray-700)' }}>
                                {person.company}
                              </div>
                              <div className="text-xs" style={{ color: 'var(--gray-500)' }}>
                                {person.country}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  background: person.seniority === 'C-Level' ? '#FEF3C7' : '#E0E7FF',
                                  color: person.seniority === 'C-Level' ? '#F59E0B' : '#6366F1'
                                }}
                              >
                                {person.seniority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {warmupCount > 0 ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-1">
                                    {lead?.warmupActions.slice(0, 3).map((action, i) => {
                                      const actionDef = phantomActions.find(a => a.id === action.type);
                                      return (
                                        <div
                                          key={i}
                                          className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                                          style={{ background: actionDef?.color }}
                                          title={actionDef?.title}
                                        >
                                          <span className="text-white text-[10px]">
                                            {actionDef?.icon}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <span className="text-xs font-medium" style={{ color: 'var(--gray-600)' }}>
                                    {warmupCount} accion{warmupCount !== 1 ? 'es' : ''}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs" style={{ color: 'var(--gray-400)' }}>
                                  Sin acciones
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  background: lead?.status === 'warm-up' ? '#D1FAE5' : '#F3F4F6',
                                  color: lead?.status === 'warm-up' ? '#10B981' : '#6B7280'
                                }}
                              >
                                {lead?.status || 'nuevo'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected People Info */}
              {selectedPeople.length > 0 && (
                <div
                  className="phantom-card p-4"
                  style={{ background: 'var(--primary-blue-lighter)' }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} style={{ color: 'var(--primary-blue)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--gray-800)' }}>
                      {selectedPeople.length} persona(s) seleccionada(s)
                    </span>
                    <span className="text-xs" style={{ color: 'var(--gray-500)' }}>
                      • Ejecuta un Phantom para aplicar la acción
                    </span>
                  </div>
                </div>
              )}

              {/* Phantom Actions Grid */}
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--gray-800)' }}>
                    Phantoms Disponibles
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
                    Cada Phantom ejecuta una acción específica de warm-up sobre las personas seleccionadas
                  </p>
                </div>

                {/* Category filters */}
                <div className="flex gap-3 mb-6">
                  {['engagement', 'research', 'connection'].map(category => (
                    <div
                      key={category}
                      className="px-4 py-2 rounded-lg text-xs font-medium"
                      style={{
                        background: `${getCategoryColor(category)}22`,
                        color: getCategoryColor(category)
                      }}
                    >
                      {category === 'engagement' && '🔥 Engagement'}
                      {category === 'research' && '🔍 Research'}
                      {category === 'connection' && '🤝 Connection'}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {phantomActions.map(action => {
                    const isExecuting = executingAction === action.id;

                    return (
                      <div
                        key={action.id}
                        className="phantom-card p-6 transition-all hover:shadow-lg group relative overflow-hidden"
                        style={{
                          borderColor: isExecuting ? action.color : 'var(--border-light)',
                          borderWidth: isExecuting ? '2px' : '1px',
                        }}
                      >
                        {/* Category badge */}
                        <div
                          className="absolute top-3 right-3 w-2 h-2 rounded-full"
                          style={{ background: getCategoryColor(action.category) }}
                        />

                        <div className="flex flex-col space-y-4">
                          {/* Icon */}
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                            style={{
                              background: action.bgColor,
                              color: action.color,
                            }}
                          >
                            {action.icon}
                          </div>

                          {/* Content */}
                          <div>
                            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>
                              {action.title}
                            </h3>
                            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--gray-500)' }}>
                              {action.description}
                            </p>
                            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--gray-400)' }}>
                              <Clock size={12} />
                              <span>{action.estimatedTime}</span>
                            </div>
                          </div>

                          {/* Run Button */}
                          <button
                            onClick={() => executeAction(action.id)}
                            disabled={selectedPeople.length === 0 || isExecuting}
                            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
                            style={{
                              background: isExecuting
                                ? 'var(--gray-200)'
                                : action.color,
                              color: 'white',
                            }}
                          >
                            {isExecuting ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Running...
                              </>
                            ) : (
                              <>
                                <Play size={16} />
                                Run Now
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info Card */}
              <div className="phantom-card p-6" style={{ background: 'var(--gray-50)' }}>
                <div className="flex gap-4">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--gray-800)' }}>
                      ¿Por qué usar Phantoms de warm-up?
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Los prospectos que tienen interacciones previas contigo tienen <strong style={{ color: 'var(--primary-blue)' }}>4x más probabilidad</strong> de responder positivamente a tu mensaje. Los Phantoms automatizan estas interacciones de forma natural y escalable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Execution Progress Modal */}
        {progress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
              {progress.status === 'completed' ? (
                <div className="text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: '#D1FAE5' }}
                  >
                    <Check size={40} style={{ color: '#10B981' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--gray-800)' }}>
                    ¡Phantom Ejecutado!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                    Warm-up aplicado exitosamente a {progress.total} persona(s)
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--primary-blue-lighter)' }}
                    >
                      <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary-blue)' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--gray-800)' }}>
                        Ejecutando Phantom...
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
                        {progress.current + 1} de {progress.total}
                      </p>
                    </div>
                  </div>

                  {progress.personName && (
                    <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--gray-50)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--gray-500)' }}>
                        Procesando:
                      </div>
                      <div className="text-sm font-medium" style={{ color: 'var(--gray-800)' }}>
                        {progress.personName}
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--gray-200)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${((progress.current + 1) / progress.total) * 100}%`,
                        background: 'linear-gradient(90deg, var(--primary-blue) 0%, #667eea 100%)',
                      }}
                    />
                  </div>

                  <div className="mt-4 text-center text-xs" style={{ color: 'var(--gray-500)' }}>
                    Por favor espera mientras procesamos tu solicitud
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success notification */}
        {showSuccess && (
          <div className="fixed bottom-8 right-8 z-50">
            <div
              className="phantom-card p-4 shadow-xl flex items-center gap-3 animate-slide-up"
              style={{ background: '#D1FAE5', borderColor: '#10B981', minWidth: '300px' }}
            >
              <Check size={20} style={{ color: '#10B981' }} />
              <span className="text-sm font-medium" style={{ color: '#047857' }}>
                Acciones registradas en CRM
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </AppLayout>
  );
}
