'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type LeadStatus = 'nuevo' | 'warm-up' | 'en-secuencia' | 'respondio' | 'reunion-cliente';

export interface WarmupAction {
  type: 'visitar-perfil' | 'dar-like' | 'comentar' | 'seguir' | 'ver-posts' | 'interactuar-seguidores' | 'revisar-empresa' | 'guardar-posts';
  personId: string;
  timestamp: Date;
  notes?: string;
}

export interface Lead {
  id: string;
  personId: string;
  status: LeadStatus;
  lastContact: Date | null;
  nextAction: string;
  warmupActions: WarmupAction[];
  notes: string[];
  preferredChannel: 'linkedin' | 'email' | 'whatsapp';
  lastActivity: string; // Descripción de la última actividad relevante
  sequenceId: string | null; // ID de la secuencia activa si existe
  isFollowUp: boolean; // Si está en follow-up
  createdAt: Date;
  updatedAt: Date;
}

export interface Meeting {
  id: string;
  leadId: string;
  personId: string;
  title: string;
  date: Date;
  time: string;
  meetLink: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Conversation {
  id: string;
  leadId: string;
  personId: string;
  channel: 'linkedin' | 'email' | 'whatsapp';
  messages: {
    id: string;
    from: 'user' | 'contact';
    content: string;
    timestamp: Date;
  }[];
  lastMessage: Date;
  unread: boolean;
}

interface CRMContextType {
  leads: Lead[];
  meetings: Meeting[];
  conversations: Conversation[];

  // Lead operations
  createLead: (personId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus, stopSequences?: boolean) => void;
  addWarmupAction: (leadId: string, action: Omit<WarmupAction, 'timestamp'>) => void;
  addNote: (leadId: string, note: string) => void;
  updateLastActivity: (leadId: string, activity: string) => void;

  // Meeting operations
  scheduleMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;

  // Conversation operations
  getConversation: (leadId: string) => Conversation | undefined;
  addMessage: (conversationId: string, message: Omit<Conversation['messages'][0], 'id' | 'timestamp'>) => void;

  // Sync operations (called from other parts of the app)
  syncLeadFromWarmup: (personId: string) => void;
  syncLeadFromSequence: (personId: string, sequenceId: string) => void;
  syncLeadFromResponse: (personId: string) => void;
  syncLeadFromMeeting: (personId: string) => void;

  // Utilities
  getLeadByPersonId: (personId: string) => Lead | undefined;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([
    // Demo leads
    {
      id: 'lead-1',
      personId: 'p001', // Martín González
      status: 'en-secuencia',
      lastContact: new Date('2025-11-20'),
      nextAction: 'Enviar follow-up',
      warmupActions: [],
      notes: ['Contacto inicial muy positivo', 'Interesado en demo'],
      preferredChannel: 'linkedin',
      lastActivity: 'Abrió email de secuencia',
      sequenceId: 'seq-demo-1',
      isFollowUp: false,
      createdAt: new Date('2025-11-15'),
      updatedAt: new Date('2025-11-20'),
    },
    {
      id: 'lead-2',
      personId: 'p002', // Ana Rodríguez
      status: 'nuevo',
      lastContact: null,
      nextAction: 'Iniciar warm-up',
      warmupActions: [],
      notes: [],
      preferredChannel: 'linkedin',
      lastActivity: 'Lead creado',
      sequenceId: null,
      isFollowUp: false,
      createdAt: new Date('2025-11-28'),
      updatedAt: new Date('2025-11-28'),
    },
    {
      id: 'lead-3',
      personId: 'p003', // Carlos Méndez
      status: 'reunion-cliente',
      lastContact: new Date('2025-11-25'),
      nextAction: 'Reunión programada',
      warmupActions: [],
      notes: ['Reunión agendada para el 2 de diciembre', 'Enviar agenda previa'],
      preferredChannel: 'email',
      lastActivity: 'Reunión agendada',
      sequenceId: null,
      isFollowUp: false,
      createdAt: new Date('2025-11-10'),
      updatedAt: new Date('2025-11-25'),
    },
    {
      id: 'lead-4',
      personId: 'p004', // Laura Fernández
      status: 'respondio',
      lastContact: new Date('2025-11-18'),
      nextAction: 'Responder consulta',
      warmupActions: [],
      notes: ['Preguntó sobre pricing', 'Quiere más información sobre features'],
      preferredChannel: 'email',
      lastActivity: 'Respondió mensaje',
      sequenceId: null,
      isFollowUp: true,
      createdAt: new Date('2025-11-12'),
      updatedAt: new Date('2025-11-18'),
    },
    {
      id: 'lead-5',
      personId: 'p005', // Diego Romero
      status: 'warm-up',
      lastContact: new Date('2025-11-22'),
      nextAction: 'Continuar warm-up',
      warmupActions: [
        {
          type: 'visitar-perfil',
          personId: 'p005',
          timestamp: new Date('2025-11-20'),
        },
        {
          type: 'dar-like',
          personId: 'p005',
          timestamp: new Date('2025-11-21'),
        },
      ],
      notes: [],
      preferredChannel: 'linkedin',
      lastActivity: 'Warm-up en progreso',
      sequenceId: null,
      isFollowUp: false,
      createdAt: new Date('2025-11-19'),
      updatedAt: new Date('2025-11-22'),
    },
    {
      id: 'lead-6',
      personId: 'p006', // Patricia Silva
      status: 'en-secuencia',
      lastContact: new Date('2025-11-21'),
      nextAction: 'Esperar respuesta',
      warmupActions: [],
      notes: [],
      preferredChannel: 'linkedin',
      lastActivity: 'En secuencia activa',
      sequenceId: 'seq-demo-1',
      isFollowUp: false,
      createdAt: new Date('2025-11-16'),
      updatedAt: new Date('2025-11-21'),
    },
    {
      id: 'lead-7',
      personId: 'p009', // Miguel Vargas
      status: 'reunion-cliente',
      lastContact: new Date('2025-11-24'),
      nextAction: 'Cliente activo',
      warmupActions: [],
      notes: ['Cliente desde noviembre', 'Muy satisfecho con el servicio'],
      preferredChannel: 'whatsapp',
      lastActivity: 'Reunión completada - Cliente',
      sequenceId: null,
      isFollowUp: false,
      createdAt: new Date('2025-10-15'),
      updatedAt: new Date('2025-11-24'),
    },
    {
      id: 'lead-8',
      personId: 'p010', // Valeria Morales
      status: 'warm-up',
      lastContact: new Date('2025-11-23'),
      nextAction: 'Interactuar en LinkedIn',
      warmupActions: [
        {
          type: 'seguir',
          personId: 'p010',
          timestamp: new Date('2025-11-23'),
        },
      ],
      notes: [],
      preferredChannel: 'linkedin',
      lastActivity: 'Warm-up completado',
      sequenceId: null,
      isFollowUp: false,
      createdAt: new Date('2025-11-22'),
      updatedAt: new Date('2025-11-23'),
    },
  ]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const createLead = (personId: string) => {
    const existing = leads.find(l => l.personId === personId);
    if (existing) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      personId,
      status: 'nuevo',
      lastContact: null,
      nextAction: 'Iniciar warm-up',
      warmupActions: [],
      notes: [],
      preferredChannel: 'linkedin',
      lastActivity: 'Lead creado',
      sequenceId: null,
      isFollowUp: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLeads(prev => [...prev, newLead]);
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus, stopSequences: boolean = false) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id === leadId) {
          let updates: Partial<Lead> = { status, updatedAt: new Date() };

          // Si se mueve a "Respondió", detener secuencias activas
          if (status === 'respondio' || stopSequences) {
            updates.sequenceId = null;
            updates.lastActivity = 'Respondió mensaje';
          }

          // Si se mueve a "Reunión / Cliente", marcar como cerrado
          if (status === 'reunion-cliente') {
            updates.sequenceId = null;
            updates.lastActivity = 'Reunión agendada / Cliente';
          }

          return { ...lead, ...updates };
        }
        return lead;
      })
    );
  };

  const addWarmupAction = (leadId: string, action: Omit<WarmupAction, 'timestamp'>) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id === leadId) {
          const newAction: WarmupAction = {
            ...action,
            timestamp: new Date(),
          };

          // Update status to warm-up if not already
          const newStatus = lead.status === 'nuevo' ? 'warm-up' : lead.status;

          return {
            ...lead,
            warmupActions: [...lead.warmupActions, newAction],
            status: newStatus,
            lastContact: new Date(),
            updatedAt: new Date(),
          };
        }
        return lead;
      })
    );
  };

  const addNote = (leadId: string, note: string) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId
          ? { ...lead, notes: [...lead.notes, note], updatedAt: new Date() }
          : lead
      )
    );
  };

  const scheduleMeeting = (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    setMeetings(prev => [...prev, newMeeting]);

    // Update lead status
    updateLeadStatus(meeting.leadId, 'reunion-cliente');
  };

  const updateMeeting = (meetingId: string, updates: Partial<Meeting>) => {
    setMeetings(prev =>
      prev.map(meeting =>
        meeting.id === meetingId
          ? { ...meeting, ...updates }
          : meeting
      )
    );
  };

  const getConversation = (leadId: string) => {
    return conversations.find(c => c.leadId === leadId);
  };

  const addMessage = (conversationId: string, message: Omit<Conversation['messages'][0], 'id' | 'timestamp'>) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          const newMessage = {
            ...message,
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
          };

          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: new Date(),
            unread: message.from === 'contact',
          };
        }
        return conv;
      })
    );
  };

  const getLeadByPersonId = (personId: string) => {
    return leads.find(l => l.personId === personId);
  };

  const updateLastActivity = (leadId: string, activity: string) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId
          ? { ...lead, lastActivity: activity, updatedAt: new Date() }
          : lead
      )
    );
  };

  // Sync functions - called from other parts of the app
  const syncLeadFromWarmup = (personId: string) => {
    const lead = getLeadByPersonId(personId);
    if (lead && lead.status === 'nuevo') {
      updateLeadStatus(lead.id, 'warm-up');
      updateLastActivity(lead.id, 'Warm-up completado');
    }
  };

  const syncLeadFromSequence = (personId: string, sequenceId: string) => {
    const lead = getLeadByPersonId(personId);
    if (lead) {
      setLeads(prev =>
        prev.map(l =>
          l.id === lead.id
            ? { ...l, status: 'en-secuencia', sequenceId, lastActivity: 'En secuencia activa', updatedAt: new Date() }
            : l
        )
      );
    }
  };

  const syncLeadFromResponse = (personId: string) => {
    const lead = getLeadByPersonId(personId);
    if (lead) {
      updateLeadStatus(lead.id, 'respondio', true); // Stop sequences
      updateLastActivity(lead.id, 'Respondió mensaje');
    }
  };

  const syncLeadFromMeeting = (personId: string) => {
    const lead = getLeadByPersonId(personId);
    if (lead) {
      updateLeadStatus(lead.id, 'reunion-cliente');
      updateLastActivity(lead.id, 'Reunión agendada');
    }
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        meetings,
        conversations,
        createLead,
        updateLeadStatus,
        addWarmupAction,
        addNote,
        updateLastActivity,
        scheduleMeeting,
        updateMeeting,
        getConversation,
        addMessage,
        syncLeadFromWarmup,
        syncLeadFromSequence,
        syncLeadFromResponse,
        syncLeadFromMeeting,
        getLeadByPersonId,
        selectedLead,
        setSelectedLead,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within CRMProvider');
  }
  return context;
}
