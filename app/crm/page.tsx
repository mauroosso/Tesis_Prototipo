'use client';

import { useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { people } from '@/data/people';
import { useCRM, type LeadStatus } from '@/contexts/CRMContext';
import Link from 'next/link';
import {
  MoreVertical, Mail, Linkedin, Phone, Calendar,
  MessageSquare, Sparkles, Eye, CheckCircle, X,
  ArrowUpRight, Zap
} from 'lucide-react';

interface StageConfig {
  id: LeadStatus;
  name: string;
  color: string;
  bgColor: string;
}

const stages: StageConfig[] = [
  {
    id: 'nuevo',
    name: 'Nuevo',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
  },
  {
    id: 'warm-up',
    name: 'Warm-up',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'en-secuencia',
    name: 'En secuencia',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'respondio',
    name: 'Respondió',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'reunion-cliente',
    name: 'Reunión / Cliente',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
];

export default function CRMPage() {
  const { leads, updateLeadStatus, selectedLead, setSelectedLead, addNote } = useCRM();

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

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    // Apply business rules
    const shouldStopSequences = stage === 'respondio';
    updateLeadStatus(leadId, stage, shouldStopSequences);
  };

  const handleCardClick = (lead: typeof enrichedLeads[0]) => {
    setSelectedLead(lead);
  };

  const handleCloseSidebar = () => {
    setSelectedLead(null);
  };

  const handleAddNote = (note: string) => {
    if (selectedLead && note.trim()) {
      addNote(selectedLead.id, note);
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex bg-[#fafafa]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-normal text-gray-900 mb-1">CRM</h1>
                <p className="text-sm text-gray-500">
                  Gestiona tus leads de forma simple y visual
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
                <div className="text-2xl font-semibold text-purple-600">
                  {getLeadsByStage('en-secuencia').length}
                </div>
                <div className="text-xs text-gray-500">En Secuencia</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-green-600">
                  {getLeadsByStage('reunion-cliente').length}
                </div>
                <div className="text-xs text-gray-500">Reunión / Cliente</div>
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
                    className="flex flex-col w-80"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    {/* Column Header */}
                    <div className={`px-4 py-3 rounded-t-lg ${stage.bgColor} border-b-2 ${stage.color.replace('text-', 'border-')}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-semibold ${stage.color}`}>
                          {stage.name}
                        </h3>
                        <span className="text-xs font-medium text-gray-600 bg-white px-2 py-0.5 rounded-full">
                          {getLeadsByStage(stage.id).length}
                        </span>
                      </div>
                    </div>

                    {/* Cards Container */}
                    <div className="flex-1 bg-gray-50/50 rounded-b-lg p-3 space-y-3 overflow-y-auto">
                      {getLeadsByStage(stage.id).map(lead => {
                        if (!lead.person) return null;

                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            onClick={() => handleCardClick(lead)}
                            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow group"
                          >
                            {/* Card Header */}
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={lead.person.avatar}
                                alt={lead.person.fullName}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {lead.person.fullName}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">{lead.person.title}</p>
                              </div>
                            </div>

                            {/* Card Info */}
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="font-medium">{lead.person.company}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-500">
                                <span>{lead.person.country}</span>
                              </div>

                              {/* Last Activity */}
                              {lead.lastActivity && (
                                <div className="flex items-center gap-1 text-gray-600 pt-2 border-t border-gray-100">
                                  <Zap size={12} className="text-primary" />
                                  <span className="truncate">{lead.lastActivity}</span>
                                </div>
                              )}
                            </div>

                            {/* Badge */}
                            {lead.sequenceId && (
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                  <Sparkles size={10} />
                                  Secuencia activa
                                </span>
                              </div>
                            )}
                            {lead.isFollowUp && !lead.sequenceId && (
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                  Follow-up
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {getLeadsByStage(stage.id).length === 0 && (
                        <div className="text-center py-8 text-sm text-gray-400">
                          Sin leads en esta etapa
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Arrastra las tarjetas para moverlas entre etapas
              </span>
              <Link
                href="/conversaciones"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Ver conversaciones
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {selectedLead && selectedLead.person && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Detalles del lead</h2>
                <button
                  onClick={handleCloseSidebar}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Person Info */}
              <div className="flex items-center gap-3">
                <img
                  src={selectedLead.person.avatar}
                  alt={selectedLead.person.fullName}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">
                    {selectedLead.person.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedLead.person.title}</p>
                  <p className="text-sm text-gray-500">{selectedLead.person.company}</p>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Información de contacto
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-gray-400" />
                    <a
                      href={`mailto:${selectedLead.person.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedLead.person.email}
                    </a>
                  </div>
                  {selectedLead.person.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <a
                        href={`tel:${selectedLead.person.phone}`}
                        className="text-gray-700 hover:underline"
                      >
                        {selectedLead.person.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Linkedin size={14} className="text-gray-400" />
                    <a
                      href={`https://${selectedLead.person.linkedIn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Ver perfil
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Current Stage */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Etapa actual
                </h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900">
                    {stages.find(s => s.id === selectedLead.status)?.name}
                  </div>
                  {selectedLead.lastActivity && (
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedLead.lastActivity}
                    </div>
                  )}
                </div>
              </div>

              {/* Preferred Channel */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Canal preferido
                </h4>
                <div className="flex items-center gap-2">
                  {selectedLead.preferredChannel === 'linkedin' && (
                    <span className="inline-flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      <Linkedin size={14} />
                      LinkedIn
                    </span>
                  )}
                  {selectedLead.preferredChannel === 'email' && (
                    <span className="inline-flex items-center gap-1 text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      <Mail size={14} />
                      Email
                    </span>
                  )}
                  {selectedLead.preferredChannel === 'whatsapp' && (
                    <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <MessageSquare size={14} />
                      WhatsApp
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Notas
                </h4>
                {selectedLead.notes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedLead.notes.map((note, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-gray-700">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Sin notas</p>
                )}

                {/* Add Note */}
                <div className="mt-3">
                  <textarea
                    placeholder="Agregar una nota rápida..."
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddNote(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Presiona Enter para guardar
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/conversaciones"
                className="flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <MessageSquare size={16} />
                Ver conversación
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
