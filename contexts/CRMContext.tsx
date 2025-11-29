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
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  addWarmupAction: (leadId: string, action: Omit<WarmupAction, 'timestamp'>) => void;
  addNote: (leadId: string, note: string) => void;

  // Meeting operations
  scheduleMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;

  // Conversation operations
  getConversation: (leadId: string) => Conversation | undefined;
  addMessage: (conversationId: string, message: Omit<Conversation['messages'][0], 'id' | 'timestamp'>) => void;

  // Utilities
  getLeadByPersonId: (personId: string) => Lead | undefined;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

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
        addMessage,
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
