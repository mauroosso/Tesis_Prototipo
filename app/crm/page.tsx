'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { people } from '@/data/people';
import { useCRM, type LeadStatus } from '@/contexts/CRMContext';
import Link from 'next/link';
import {
  MoreVertical, Mail, Linkedin, Phone, Calendar,
  MessageSquare, Sparkles, Eye, Video, CheckCircle
} from 'lucide-react';

interface StageConfig {
  id: LeadStatus;
  name: string;
  color: string;
  icon: React.ReactNode;
}

const stages: StageConfig[] = [
  {
    id: 'nuevo',
    name: 'Nuevo',
    color: 'bg-gray-100',
    icon: <Eye size={16} className="text-gray-600" />,
  },
  {
    id: 'warm-up',
    name: 'Warm-up',
    color: 'bg-blue-100',
    icon: <Sparkles size={16} className="text-blue-600" />,
  },
  {
    id: 'en-secuencia',
    name: 'En Secuencia',
    color: 'bg-purple-100',
    icon: <Mail size={16} className="text-purple-600" />,
  },
  {
    id: 'respondio',
    name: 'Respondió',
    color: 'bg-orange-100',
    icon: <MessageSquare size={16} className="text-orange-600" />,
  },
  {
    id: 'reunion-agendada',
    name: 'Reunión Agendada',
    color: 'bg-yellow-100',
    icon: <Video size={16} className="text-yellow-600" />,
  },
  {
    id: 'cliente',
    name: 'Cliente',
    color: 'bg-green-100',
    icon: <CheckCircle size={16} className="text-green-600" />,
  },
];

export default function CRMPage() {
  const { leads, updateLeadStatus, meetings } = useCRM();
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  // Enrich leads with person data
  const enrichedLeads = useMemo(() => {
    return leads.map(lead => {
      const person = people.find(p => p.id === lead.personId);
      return {
        ...lead,
        person,
      };
    });
  }, [leads]);

  const getLeadsByStage = (stage: LeadStatus) => {
    return enrichedLeads.filter(lead => lead.status === stage);
  };

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: LeadStatus) => {
    if (!draggedLead) return;
    updateLeadStatus(draggedLead, stage);
    setDraggedLead(null);
  };

  const getMeetingForLead = (leadId: string) => {
    return meetings.find(m => m.leadId === leadId && m.status === 'scheduled');
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-normal text-gray-900 mb-1">CRM Visual</h1>
              <p className="text-sm text-gray-500">
                Gestiona tus oportunidades de venta de forma visual
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/listas"
                className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors"
              >
                Ver listas
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-2xl font-semibold text-gray-900">{leads.length}</div>
              <div className="text-xs text-gray-500">Total Leads</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-primary">
                {getLeadsByStage('en-secuencia').length}
              </div>
              <div className="text-xs text-gray-500">En Secuencia</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-success">
                {getLeadsByStage('cliente').length}
              </div>
              <div className="text-xs text-gray-500">Clientes</div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-6">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Sparkles size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay leads en el CRM
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Comienza haciendo warm-up a personas de tus listas para crear leads automáticamente
              </p>
              <Link
                href="/listas"
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Ir a Listas
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 h-full min-w-max">
              {stages.map(stage => (
                <div
                  key={stage.id}
                  className="flex flex-col w-80 bg-white rounded-lg border border-gray-200"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stage.id)}
                >
                  {/* Column Header */}
                  <div className={`px-4 py-3 border-b border-gray-200 ${stage.color} rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {stage.icon}
                        <h3 className="text-sm font-semibold text-gray-900">
                          {stage.name}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-gray-600 bg-white px-2 py-0.5 rounded-full">
                        {getLeadsByStage(stage.id).length}
                      </span>
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {getLeadsByStage(stage.id).map(lead => {
                      if (!lead.person) return null;
                      const meeting = getMeetingForLead(lead.id);

                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => handleDragStart(lead.id)}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-shadow group"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={lead.person.avatar}
                                alt={lead.person.fullName}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {lead.person.fullName}
                                </h4>
                                <p className="text-xs text-gray-500">{lead.person.company}</p>
                              </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>

                          {/* Card Info */}
                          <div className="space-y-2 mb-3">
                            <div className="text-xs text-gray-600">
                              {lead.person.title}
                            </div>

                            {lead.lastContact && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar size={12} />
                                <span>
                                  {new Date(lead.lastContact).toLocaleDateString('es-AR', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                                </span>
                              </div>
                            )}

                            {lead.warmupActions.length > 0 && (
                              <div className="flex items-center gap-1 text-xs">
                                <Sparkles size={12} className="text-primary" />
                                <span className="text-gray-600">
                                  {lead.warmupActions.length} acciones de warm-up
                                </span>
                              </div>
                            )}

                            {meeting && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
                                <div className="flex items-center gap-1 text-yellow-700 font-medium mb-1">
                                  <Video size={12} />
                                  <span>Reunión programada</span>
                                </div>
                                <div className="text-yellow-600">
                                  {new Date(meeting.date).toLocaleDateString('es-AR', {
                                    day: 'numeric',
                                    month: 'long',
                                  })}
                                  {' • '}
                                  {meeting.time}
                                </div>
                              </div>
                            )}

                            <div className="text-xs">
                              <span className="text-gray-500">Próxima acción: </span>
                              <span className="text-gray-900 font-medium">{lead.nextAction}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 pt-2 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                              href={`https://${lead.person.linkedIn}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600 transition-colors"
                              title="LinkedIn"
                            >
                              <Linkedin size={14} />
                            </a>
                            <a
                              href={`mailto:${lead.person.email}`}
                              className="p-1.5 hover:bg-purple-50 rounded text-gray-400 hover:text-purple-600 transition-colors"
                              title="Email"
                            >
                              <Mail size={14} />
                            </a>
                            {lead.person.phone && (
                              <a
                                href={`tel:${lead.person.phone}`}
                                className="p-1.5 hover:bg-green-50 rounded text-gray-400 hover:text-green-600 transition-colors"
                                title="Teléfono"
                              >
                                <Phone size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {getLeadsByStage(stage.id).length === 0 && (
                      <div className="text-center py-8 text-sm text-gray-400">
                        No hay leads en esta etapa
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              💡 Arrastra las tarjetas para moverlas entre etapas
            </span>
            <Link
              href="/conversaciones"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Ver conversaciones →
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
