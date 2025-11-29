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
  Building2, Bookmark, ArrowLeft, Sparkles, CheckCircle, Play
} from 'lucide-react';

type WarmupActionType = 'visitar-perfil' | 'dar-like' | 'comentar' | 'seguir' | 'ver-posts' | 'interactuar-seguidores' | 'revisar-empresa' | 'guardar-posts';

interface PhantomAction {
  id: WarmupActionType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function WarmupSocialPage() {
  const searchParams = useSearchParams();
  const listId = searchParams?.get('listId');
  const { lists, getListsByType } = useLists();
  const { createLead, addWarmupAction, getLeadByPersonId, updateLeadStatus } = useCRM();

  const [selectedList, setSelectedList] = useState<string | null>(listId);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<WarmupActionType[]>([]);

  const peopleLists = getListsByType('people');

  // Get people from selected list
  const selectedPeopleData = useMemo(() => {
    if (!selectedList) return [];
    const list = lists.find(l => l.id === selectedList);
    if (!list) return [];
    return list.items.map(id => people.find(p => p.id === id)).filter(Boolean);
  }, [selectedList, lists]);

  // PhantomBuster-style actions
  const phantomActions: PhantomAction[] = [
    {
      id: 'visitar-perfil',
      title: 'Visitar Perfil',
      description: 'Ver el perfil completo en LinkedIn',
      icon: <Eye size={24} />,
      color: '#4F7CF9',
      bgColor: '#E8EFFF',
    },
    {
      id: 'dar-like',
      title: 'Dar Like',
      description: 'Like a su última publicación',
      icon: <ThumbsUp size={24} />,
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    {
      id: 'comentar',
      title: 'Comentar',
      description: 'Dejar comentario de valor',
      icon: <MessageCircle size={24} />,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    {
      id: 'seguir',
      title: 'Seguir',
      description: 'Seguir en LinkedIn',
      icon: <UserPlus size={24} />,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
    {
      id: 'ver-posts',
      title: 'Ver Posts',
      description: 'Revisar últimos 5 posts',
      icon: <FileText size={24} />,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      id: 'interactuar-seguidores',
      title: 'Interactuar Seguidores',
      description: 'Explorar seguidores comunes',
      icon: <UsersIcon size={24} />,
      color: '#EC4899',
      bgColor: '#FCE7F3',
    },
    {
      id: 'revisar-empresa',
      title: 'Revisar Empresa',
      description: 'Ver página de la empresa',
      icon: <Building2 size={24} />,
      color: '#06B6D4',
      bgColor: '#CFFAFE',
    },
    {
      id: 'guardar-posts',
      title: 'Guardar Posts',
      description: 'Guardar posts relevantes',
      icon: <Bookmark size={24} />,
      color: '#F97316',
      bgColor: '#FFEDD5',
    },
  ];

  const toggleAction = (actionId: WarmupActionType) => {
    setSelectedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

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
      setSelectedPeople(selectedPeopleData.map(p => p!.id));
    }
  };

  const handleApplyWarmup = () => {
    if (selectedPeople.length === 0 || selectedActions.length === 0) {
      alert('Selecciona al menos una persona y una acción');
      return;
    }

    selectedPeople.forEach(personId => {
      // Create lead if doesn't exist
      let lead = getLeadByPersonId(personId);
      if (!lead) {
        createLead(personId);
        lead = getLeadByPersonId(personId);
      }

      if (lead) {
        // Add all selected actions
        selectedActions.forEach(actionType => {
          addWarmupAction(lead.id, {
            type: actionType,
            personId,
          });
        });

        // Update status to warm-up if was nuevo
        if (lead.status === 'nuevo') {
          updateLeadStatus(lead.id, 'warm-up');
        }
      }
    });

    alert(`Warm-up aplicado a ${selectedPeople.length} persona(s) con ${selectedActions.length} acción(es)`);
    setSelectedPeople([]);
    setSelectedActions([]);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
        {/* Header */}
        <div className="bg-white border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>
                  Warm-up Social
                </h1>
                <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
                  Calienta tus prospectos antes del contacto directo - Estilo PhantomBuster
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
                onChange={(e) => setSelectedList(e.target.value || null)}
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
                style={{ background: 'var(--gray-100)' }}
              >
                <Sparkles size={64} style={{ color: 'var(--gray-400)' }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--gray-800)' }}>
                Selecciona una lista de personas
              </h3>
              <p className="text-sm max-w-md" style={{ color: 'var(--gray-500)' }}>
                Elige una lista arriba para comenzar el warm-up social con acciones automatizadas estilo PhantomBuster
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* People Selection */}
              <div className="phantom-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--gray-800)' }}>
                    Personas ({selectedPeopleData.length})
                  </h2>
                  <button
                    onClick={selectAllPeople}
                    className="text-sm font-medium"
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    {selectedPeople.length === selectedPeopleData.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedPeopleData.map(person => {
                    if (!person) return null;
                    const isSelected = selectedPeople.includes(person.id);

                    return (
                      <div
                        key={person.id}
                        onClick={() => togglePerson(person.id)}
                        className={`phantom-card p-4 cursor-pointer transition-all ${
                          isSelected ? 'border-primary shadow-md' : ''
                        }`}
                        style={{
                          borderColor: isSelected ? 'var(--primary-blue)' : undefined,
                          borderWidth: isSelected ? '2px' : '1px',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={person.avatar}
                            alt={person.fullName}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" style={{ color: 'var(--gray-800)' }}>
                              {person.fullName}
                            </div>
                            <div className="text-xs truncate" style={{ color: 'var(--gray-500)' }}>
                              {person.title}
                            </div>
                            <div className="text-xs truncate" style={{ color: 'var(--gray-400)' }}>
                              {person.company}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle size={20} style={{ color: 'var(--primary-blue)' }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Phantom Actions */}
              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--gray-800)' }}>
                  Acciones de Warm-up
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--gray-500)' }}>
                  Selecciona las acciones que quieres aplicar a las personas seleccionadas
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {phantomActions.map(action => {
                    const isSelected = selectedActions.includes(action.id);

                    return (
                      <div
                        key={action.id}
                        onClick={() => toggleAction(action.id)}
                        className={`phantom-card p-6 cursor-pointer transition-all group hover:shadow-lg ${
                          isSelected ? 'shadow-md' : ''
                        }`}
                        style={{
                          borderColor: isSelected ? action.color : undefined,
                          borderWidth: isSelected ? '2px' : '1px',
                        }}
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
                            style={{
                              background: isSelected ? action.color : action.bgColor,
                              color: isSelected ? 'white' : action.color,
                            }}
                          >
                            {action.icon}
                          </div>

                          <div>
                            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>
                              {action.title}
                            </h3>
                            <p className="text-xs" style={{ color: 'var(--gray-500)' }}>
                              {action.description}
                            </p>
                          </div>

                          <button
                            className={`w-full text-sm font-medium py-2 rounded-lg transition-all ${
                              isSelected ? 'bg-white' : ''
                            }`}
                            style={{
                              background: isSelected ? 'white' : action.bgColor,
                              color: action.color,
                              border: isSelected ? `1px solid ${action.color}` : 'none',
                            }}
                          >
                            {isSelected ? (
                              <span className="flex items-center justify-center gap-1">
                                <CheckCircle size={14} />
                                Seleccionado
                              </span>
                            ) : (
                              'Seleccionar'
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Apply Button */}
              {(selectedPeople.length > 0 || selectedActions.length > 0) && (
                <div className="phantom-card p-6" style={{ background: 'var(--primary-blue-lighter)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>
                        Listo para aplicar warm-up
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                        {selectedPeople.length} persona(s) seleccionada(s) • {selectedActions.length} acción(es) seleccionada(s)
                      </p>
                    </div>
                    <button
                      onClick={handleApplyWarmup}
                      disabled={selectedPeople.length === 0 || selectedActions.length === 0}
                      className="btn-primary flex items-center gap-2 px-8 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play size={20} />
                      Aplicar Warm-up
                    </button>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="phantom-card p-6" style={{ background: 'var(--gray-50)' }}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    💡
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--gray-800)' }}>
                      ¿Por qué hacer warm-up social?
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Los prospectos que tienen interacciones previas contigo tienen <strong style={{ color: 'var(--primary-blue)' }}>4x más probabilidad</strong> de responder positivamente a tu mensaje. El warm-up social es clave para generar familiaridad de forma natural y orgánica.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
