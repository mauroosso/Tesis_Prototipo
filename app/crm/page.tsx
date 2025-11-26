'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { people } from '@/data/people';
import { MoreVertical, Mail, Linkedin, Phone, Calendar } from 'lucide-react';

type Stage = 'nuevo' | 'contactado' | 'interesado' | 'reunión' | 'cliente';

interface Lead {
  id: string;
  name: string;
  company: string;
  avatar: string;
  lastContact: string;
  nextAction: string;
  urgency: 'high' | 'medium' | 'low';
  stage: Stage;
}

const stages: { id: Stage; name: string; color: string }[] = [
  { id: 'nuevo', name: 'Nuevo', color: 'bg-gray-100' },
  { id: 'contactado', name: 'Contactado', color: 'bg-blue-100' },
  { id: 'interesado', name: 'Interesado', color: 'bg-purple-100' },
  { id: 'reunión', name: 'Reunión', color: 'bg-orange-100' },
  { id: 'cliente', name: 'Cliente', color: 'bg-green-100' },
];

export default function CRMPage() {
  // Convert people data to leads format
  const initialLeads: Lead[] = people.slice(0, 20).map(person => ({
    id: person.id,
    name: person.fullName,
    company: person.company,
    avatar: person.avatar,
    lastContact: person.lastContact || 'Sin contacto',
    nextAction: person.nextAction,
    urgency: person.roleChangedRecently ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
    stage: person.status as Stage,
  }));

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const getLeadsByStage = (stage: Stage) => {
    return leads.filter(lead => lead.stage === stage);
  };

  const getUrgencyBadge = (urgency: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return styles[urgency];
  };

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: Stage) => {
    if (!draggedLead) return;

    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === draggedLead ? { ...lead, stage } : lead
      )
    );
    setDraggedLead(null);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gray-light">
        {/* Header */}
        <div className="bg-white border-b border-gray-border px-8 py-6">
          <h1 className="text-2xl font-light text-gray-dark mb-1">CRM Visual</h1>
          <p className="text-sm text-gray-text">
            Gestiona tus oportunidades de venta de forma visual
          </p>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-4 h-full min-w-max">
            {stages.map(stage => (
              <div
                key={stage.id}
                className="flex flex-col w-80 bg-white rounded-lg border border-gray-border"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Column Header */}
                <div className={`px-4 py-3 border-b border-gray-border ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-dark">
                      {stage.name}
                    </h3>
                    <span className="text-xs font-medium text-gray-600 bg-white px-2 py-0.5 rounded-full">
                      {getLeadsByStage(stage.id).length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {getLeadsByStage(stage.id).map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      className="bg-white border border-gray-border rounded-lg p-4 cursor-move hover:shadow-card-hover transition-shadow group"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={lead.avatar}
                            alt={lead.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="text-sm font-medium text-gray-dark">
                              {lead.name}
                            </h4>
                            <p className="text-xs text-gray-text">{lead.company}</p>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-light rounded">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      </div>

                      {/* Card Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-text">
                          <Calendar size={12} />
                          <span>Último contacto: {lead.lastContact}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-text">Próxima acción: </span>
                          <span className="text-gray-dark font-medium">{lead.nextAction}</span>
                        </div>
                      </div>

                      {/* Urgency Badge */}
                      <div className="flex items-center justify-between">
                        <div className={`w-2 h-2 rounded-full ${getUrgencyBadge(lead.urgency)}`} />
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600 transition-colors">
                            <Linkedin size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-purple-50 rounded text-gray-400 hover:text-purple-600 transition-colors">
                            <Mail size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-green-50 rounded text-gray-400 hover:text-green-600 transition-colors">
                            <Phone size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white border-t border-gray-border px-8 py-4">
          <div className="flex items-center gap-6 text-xs">
            <span className="text-gray-text">Urgencia:</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-text">Alta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-gray-text">Media</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-text">Baja</span>
            </div>
            <span className="text-gray-400 ml-auto">
              💡 Arrastra las tarjetas para moverlas entre etapas
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
