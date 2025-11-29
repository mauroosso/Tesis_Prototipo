'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type LeadStatus = 'nuevo' | 'warm-up' | 'en-secuencia' | 'respondio' | 'reunion-agendada' | 'cliente';

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

export type ConversationStatus = 'nuevo' | 'pendiente' | 'respondido';

export interface Conversation {
  id: string;
  leadId: string;
  personId: string;
  channel: 'linkedin' | 'email' | 'whatsapp';
  status: ConversationStatus;
  messages: {
    id: string;
    from: 'user' | 'contact';
    content: string;
    timestamp: Date;
    channel: 'linkedin' | 'email' | 'whatsapp';
  }[];
  lastMessage: Date;
  unread: boolean;
  createdAt: Date;
}

interface CRMContextType {
  leads: Lead[];
  meetings: Meeting[];
  conversations: Conversation[];

  // Lead operations
  createLead: (personId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  addWarmupAction: (leadId: string, action: Omit<WarmupAction, 'timestamp'>) => void;
  addNote: (leadId: string, note: string) => void;

  // Meeting operations
  scheduleMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;

  // Conversation operations
  getConversation: (leadId: string) => Conversation | undefined;
  getConversationById: (conversationId: string) => Conversation | undefined;
  createConversation: (leadId: string, personId: string, channel: 'linkedin' | 'email' | 'whatsapp', initialMessage?: string) => string;
  addMessage: (conversationId: string, message: Omit<Conversation['messages'][0], 'id' | 'timestamp'>) => void;
  markConversationAsRead: (conversationId: string) => void;
  updateConversationStatus: (conversationId: string, status: ConversationStatus) => void;

  // Utilities
  getLeadByPersonId: (personId: string) => Lead | undefined;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([
    // Demo leads
    {
      id: 'lead-demo-1',
      personId: 'p001',
      status: 'respondio',
      lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextAction: 'Seguir conversación',
      warmupActions: [],
      notes: ['Lead interesado en el producto'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'lead-demo-2',
      personId: 'p002',
      status: 'respondio',
      lastContact: new Date(Date.now() - 3 * 60 * 60 * 1000),
      nextAction: 'Enviar link de reunión',
      warmupActions: [],
      notes: ['Quiere agendar llamada'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: 'lead-demo-3',
      personId: 'p003',
      status: 'en-secuencia',
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      nextAction: 'Siguiente paso en 2 días',
      warmupActions: [],
      notes: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'lead-demo-4',
      personId: 'p004',
      status: 'warm-up',
      lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000),
      nextAction: 'Dar like en próximos posts',
      warmupActions: [
        {
          type: 'visitar-perfil',
          personId: 'p004',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          notes: 'Visitado perfil',
        },
        {
          type: 'dar-like',
          personId: 'p004',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          notes: 'Like en último post',
        },
      ],
      notes: ['Perfil muy activo en LinkedIn'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      id: 'lead-demo-5',
      personId: 'p005',
      status: 'nuevo',
      lastContact: null,
      nextAction: 'Iniciar warm-up',
      warmupActions: [],
      notes: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'lead-demo-6',
      personId: 'p006',
      status: 'reunion-agendada',
      lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000),
      nextAction: 'Preparar demo',
      warmupActions: [],
      notes: ['Reunión agendada para mañana', 'Muy interesado en automatización'],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: 'lead-demo-7',
      personId: 'p007',
      status: 'cliente',
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextAction: 'Onboarding call',
      warmupActions: [],
      notes: ['Cliente nuevo!', 'Cerrado plan Enterprise'],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'lead-demo-8',
      personId: 'p008',
      status: 'en-secuencia',
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextAction: 'Follow-up email en día 7',
      warmupActions: [],
      notes: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);
  const [meetings, setMeetings] = useState<Meeting[]>([
    // Demo meetings
    {
      id: 'meeting-demo-1',
      leadId: 'lead-demo-6',
      personId: 'p006',
      title: 'Demo de End2End',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      time: '15:00',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Mostrar automatización de secuencias',
      status: 'scheduled',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: 'meeting-demo-2',
      leadId: 'lead-demo-7',
      personId: 'p007',
      title: 'Onboarding Call',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: '10:00',
      meetLink: 'https://meet.google.com/xyz-abcd-efg',
      notes: 'Configuración inicial de cuenta',
      status: 'scheduled',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);
  const [conversations, setConversations] = useState<Conversation[]>([
    // Demo conversations
    {
      id: 'conv-1',
      leadId: 'lead-demo-1',
      personId: 'p001',
      channel: 'linkedin',
      status: 'nuevo',
      messages: [
        {
          id: 'msg-1',
          from: 'contact',
          content: 'Hola! Vi tu mensaje sobre End2End. Me interesa conocer más sobre cómo pueden ayudarnos a mejorar nuestro proceso de generación de leads.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          channel: 'linkedin',
        },
      ],
      lastMessage: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'conv-2',
      leadId: 'lead-demo-2',
      personId: 'p002',
      channel: 'email',
      status: 'pendiente',
      messages: [
        {
          id: 'msg-2',
          from: 'contact',
          content: 'Hola,\n\nRecibí tu email sobre automatización de ventas. Nos interesa mucho. ¿Podemos agendar una llamada esta semana?\n\nSaludos,\nAna',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          channel: 'email',
        },
        {
          id: 'msg-3',
          from: 'user',
          content: 'Hola Ana,\n\nPerfecto! Me alegra que te interese. ¿Qué tal el jueves a las 15:00 hs?\n\nSaludos,',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          channel: 'email',
        },
        {
          id: 'msg-4',
          from: 'contact',
          content: 'Perfecto, me viene bien. ¿Me mandás el link de la reunión?',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          channel: 'email',
        },
      ],
      lastMessage: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unread: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 'conv-3',
      leadId: 'lead-demo-3',
      personId: 'p003',
      channel: 'whatsapp',
      status: 'respondido',
      messages: [
        {
          id: 'msg-5',
          from: 'contact',
          content: 'Hola! Me contactaste hace unos días. Me interesa saber más sobre End2End.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          channel: 'whatsapp',
        },
        {
          id: 'msg-6',
          from: 'user',
          content: 'Hola! Claro, End2End es una plataforma que te ayuda a automatizar todo el proceso de generación de leads. ¿Tenés unos minutos para una demo rápida?',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
          channel: 'whatsapp',
        },
        {
          id: 'msg-7',
          from: 'contact',
          content: 'Sí, me interesa. ¿Podemos coordinar para la próxima semana?',
          timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
          channel: 'whatsapp',
        },
        {
          id: 'msg-8',
          from: 'user',
          content: 'Perfecto! Te mando un link para que elijas el horario que mejor te venga.',
          timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000),
          channel: 'whatsapp',
        },
      ],
      lastMessage: new Date(Date.now() - 21 * 60 * 60 * 1000),
      unread: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]);

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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLeads(prev => [...prev, newLead]);
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId
          ? { ...lead, status, updatedAt: new Date() }
          : lead
      )
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
    updateLeadStatus(meeting.leadId, 'reunion-agendada');
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

  const getConversationById = (conversationId: string) => {
    return conversations.find(c => c.id === conversationId);
  };

  const createConversation = (
    leadId: string,
    personId: string,
    channel: 'linkedin' | 'email' | 'whatsapp',
    initialMessage?: string
  ): string => {
    const existing = conversations.find(c => c.leadId === leadId);
    if (existing) return existing.id;

    const newConversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      leadId,
      personId,
      channel,
      status: 'nuevo',
      messages: initialMessage ? [{
        id: `msg-${Date.now()}-1`,
        from: 'contact',
        content: initialMessage,
        timestamp: new Date(),
        channel,
      }] : [],
      lastMessage: new Date(),
      unread: !!initialMessage,
      createdAt: new Date(),
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
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

          // If user is sending, mark as responded and read
          const newStatus = message.from === 'user' ? 'respondido' : conv.status;
          const unread = message.from === 'contact';

          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: new Date(),
            status: newStatus,
            unread,
          };
        }
        return conv;
      })
    );
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unread: false,
            status: conv.status === 'nuevo' ? 'pendiente' : conv.status,
          };
        }
        return conv;
      })
    );
  };

  const updateConversationStatus = (conversationId: string, status: ConversationStatus) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, status }
          : conv
      )
    );
  };

  const getLeadByPersonId = (personId: string) => {
    return leads.find(l => l.personId === personId);
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
        scheduleMeeting,
        updateMeeting,
        getConversation,
        getConversationById,
        createConversation,
        addMessage,
        markConversationAsRead,
        updateConversationStatus,
        getLeadByPersonId,
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
