'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { people } from '@/data/people';
import { useLists } from '@/contexts/ListsContext';
import { useCRM, type WarmupAction } from '@/contexts/CRMContext';
import Link from 'next/link';
import {
  Eye, UserPlus, ThumbsUp, MessageCircle, CheckCircle,
  Sparkles, ArrowRight, Users as UsersIcon, ArrowLeft
} from 'lucide-react';

interface WarmupTask {
  personId: string;
  actions: {
    'visitar-perfil': boolean;
    'like': boolean;
    'comentar': boolean;
    'seguir': boolean;
    'interactuar-seguidores': boolean;
  };
}

export default function WarmupSocialPage() {
  const searchParams = useSearchParams();
  const listId = searchParams?.get('listId');
  const { lists, getListsByType } = useLists();
  const { createLead, addWarmupAction, getLeadByPersonId } = useCRM();

  const [tasks, setTasks] = useState<Record<string, WarmupTask>>({});
  const [selectedList, setSelectedList] = useState<string | null>(listId);

  const peopleLists = getListsByType('people');

  // Get people from selected list
  const selectedPeople = useMemo(() => {
    if (!selectedList) return [];
    const list = lists.find(l => l.id === selectedList);
    if (!list) return [];
    return list.items.map(id => people.find(p => p.id === id)).filter(Boolean);
  }, [selectedList, lists]);

  // Initialize tasks for selected people
  useEffect(() => {
    if (selectedPeople.length > 0) {
      const newTasks: Record<string, WarmupTask> = {};
      selectedPeople.forEach(person => {
        if (person) {
          newTasks[person.id] = {
            personId: person.id,
            actions: {
              'visitar-perfil': false,
              'like': false,
              'comentar': false,
              'seguir': false,
              'interactuar-seguidores': false,
            },
          };

          // Create lead if doesn't exist
          if (!getLeadByPersonId(person.id)) {
            createLead(person.id);
          }
        }
      });
      setTasks(newTasks);
    }
  }, [selectedPeople]);

  const toggleAction = (personId: string, actionType: keyof WarmupTask['actions']) => {
    setTasks(prev => {
      const updated = { ...prev };
      if (updated[personId]) {
        updated[personId] = {
          ...updated[personId],
          actions: {
            ...updated[personId].actions,
            [actionType]: !updated[personId].actions[actionType],
          },
        };

        // If action is being checked, save to CRM
        if (updated[personId].actions[actionType]) {
          const lead = getLeadByPersonId(personId);
          if (lead) {
            addWarmupAction(lead.id, {
              type: actionType,
              personId,
            });
          }
        }
      }
      return updated;
    });
  };

  const completedActions = Object.values(tasks).reduce((total, task) => {
    return total + Object.values(task.actions).filter(Boolean).length;
  }, 0);

  const totalActions = Object.keys(tasks).length * 5; // 5 actions per person
  const progressPercent = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  const getActionIcon = (type: keyof WarmupTask['actions']) => {
    switch (type) {
      case 'visitar-perfil':
        return <Eye size={16} className="text-blue-500" />;
      case 'seguir':
        return <UserPlus size={16} className="text-purple-500" />;
      case 'like':
        return <ThumbsUp size={16} className="text-green-500" />;
      case 'comentar':
        return <MessageCircle size={16} className="text-orange-500" />;
      case 'interactuar-seguidores':
        return <UsersIcon size={16} className="text-pink-500" />;
    }
  };

  const getActionLabel = (type: keyof WarmupTask['actions']) => {
    switch (type) {
      case 'visitar-perfil':
        return 'Visitar perfil';
      case 'seguir':
        return 'Seguir';
      case 'like':
        return 'Dar like a publicación';
      case 'comentar':
        return 'Comentar publicación';
      case 'interactuar-seguidores':
        return 'Interactuar con seguidores';
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-normal text-gray-900 mb-1">Warm-up Social</h1>
              <p className="text-sm text-gray-500">
                Calienta tus prospectos antes del primer mensaje directo
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
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedList || selectedPeople.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Sparkles size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona una lista de personas
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Elige una lista arriba para comenzar el warm-up social
              </p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Progreso</h2>
                  <span className="text-sm text-gray-600">
                    {completedActions} de {totalActions} acciones completadas
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                      💡
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      ¿Por qué hacer warm-up?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Los contactos que interactúan contigo antes de recibir un mensaje directo tienen{' '}
                      <span className="font-semibold text-primary">4x más probabilidad</span> de
                      responder positivamente. El warm-up social es clave para romper el hielo de forma natural.
                    </p>
                  </div>
                </div>
              </div>

              {/* People Tasks */}
              <div className="space-y-4">
                {selectedPeople.map(person => {
                  if (!person) return null;
                  const task = tasks[person.id];
                  if (!task) return null;

                  const personCompleted = Object.values(task.actions).filter(Boolean).length;
                  const personTotal = 5;

                  return (
                    <div
                      key={person.id}
                      className="bg-white rounded-lg border border-gray-200 p-5"
                    >
                      {/* Person Header */}
                      <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-200">
                        <img
                          src={person.avatar}
                          alt={person.fullName}
                          className="w-14 h-14 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="text-base font-medium text-gray-900">
                            {person.fullName}
                          </h3>
                          <p className="text-sm text-gray-600">{person.title}</p>
                          <p className="text-sm text-gray-500">{person.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {personCompleted} / {personTotal}
                          </div>
                          <div className="text-xs text-gray-500">acciones</div>
                        </div>
                      </div>

                      {/* Actions Checklist */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {(Object.keys(task.actions) as Array<keyof WarmupTask['actions']>).map(actionType => (
                          <label
                            key={actionType}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={task.actions[actionType]}
                              onChange={() => toggleAction(person.id, actionType)}
                              className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                            />
                            <div className="flex items-center gap-2">
                              {getActionIcon(actionType)}
                              <span className="text-sm text-gray-700">
                                {getActionLabel(actionType)}
                              </span>
                            </div>
                            {task.actions[actionType] && (
                              <CheckCircle size={16} className="ml-auto text-success" />
                            )}
                          </label>
                        ))}
                      </div>

                      {/* LinkedIn Button */}
                      <div className="flex items-center gap-3">
                        <a
                          href={`https://${person.linkedIn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Ir a LinkedIn
                          <ArrowRight size={16} />
                        </a>
                        {personCompleted === personTotal && (
                          <span className="text-sm text-success font-medium flex items-center gap-1">
                            <CheckCircle size={16} />
                            Warm-up completado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Next Step */}
              {completedActions > 0 && (
                <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-lg border border-primary/20 p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ¿Listo para el siguiente paso?
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Ya calentaste {completedActions} acciones. Es el momento perfecto para crear una
                        secuencia de outreach personalizada.
                      </p>
                      <Link
                        href={`/secuencias?listId=${selectedList}`}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Sparkles size={16} />
                        Crear secuencia
                      </Link>
                    </div>
                    <div className="text-6xl flex-shrink-0">🚀</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
