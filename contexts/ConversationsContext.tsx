'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useCRM } from './CRMContext';
import { useSequences } from './SequencesContext';

export type MessageChannel = 'linkedin' | 'email' | 'whatsapp';
export type ConversationStatus = 'nuevo' | 'pendiente' | 'respondido' | 'requiere-followup' | 'archivado';
export type ConversationLabel = 'caliente' | 'tibio' | 'frio';

export interface Message {
  id: string;
  conversationId: string;
  channel: MessageChannel;
  content: string;
  subject?: string; // For emails
  sentBy: 'user' | 'prospect';
  sentAt: Date;
  read: boolean;
  attachments?: string[];
}

export interface InternalNote {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface Meeting {
  id: string;
  scheduledAt: Date;
  duration: number; // minutes
  platform: 'zoom' | 'meet' | 'teams' | 'presencial';
  status: 'programada' | 'completada' | 'cancelada';
  notes?: string;
}

export interface Conversation {
  id: string;
  personId: string;
  channel: MessageChannel;
  status: ConversationStatus;
  labels: ConversationLabel[];
  messages: Message[];
  internalNotes: InternalNote[];
  meeting?: Meeting;
  stoppedSequence?: boolean; // True if they replied to a sequence
  requiresFollowup?: boolean;
  followupDate?: Date;
  lastMessageAt: Date;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationsContextType {
  conversations: Conversation[];
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  getConversation: (id: string) => Conversation | undefined;
  getConversationsByStatus: (status: ConversationStatus) => Conversation[];
  getConversationsByChannel: (channel: MessageChannel) => Conversation[];
  getConversationsByLabel: (label: ConversationLabel) => Conversation[];
  getNewConversations: () => Conversation[];
  sendMessage: (conversationId: string, content: string, subject?: string) => void;
  receiveMessage: (conversationId: string, content: string, channel: MessageChannel, fromSequence?: boolean) => void;
  markAsRead: (conversationId: string) => void;
  updateStatus: (conversationId: string, status: ConversationStatus) => void;
  addLabel: (conversationId: string, label: ConversationLabel) => void;
  removeLabel: (conversationId: string, label: ConversationLabel) => void;
  addInternalNote: (conversationId: string, content: string) => void;
  scheduleMeeting: (conversationId: string, meeting: Omit<Meeting, 'id'>) => void;
  setFollowupReminder: (conversationId: string, date: Date) => void;
  archiveConversation: (conversationId: string) => void;
  createConversation: (personId: string, channel: MessageChannel) => string;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error('useConversations must be used within ConversationsProvider');
  }
  return context;
};

interface ConversationsProviderProps {
  children: ReactNode;
}

export const ConversationsProvider: React.FC<ConversationsProviderProps> = ({ children }) => {
  const { updateLeadStatus, addTimelineEvent } = useCRM();
  const { stopContactInSequence } = useSequences();

  // Demo conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      personId: 'person-1',
      channel: 'linkedin',
      status: 'nuevo',
      labels: ['caliente'],
      messages: [
        {
          id: 'msg-1',
          conversationId: 'conv-1',
          channel: 'linkedin',
          content: 'Hola! Vi que trabajás en soluciones B2B. Me encantaría conversar sobre cómo END2END podría ayudarte a escalar tu prospección.',
          sentBy: 'user',
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'msg-2',
          conversationId: 'conv-1',
          channel: 'linkedin',
          content: 'Hola! Gracias por escribir. Sí, estoy buscando herramientas para optimizar nuestro outreach. ¿Podemos agendar una llamada?',
          sentBy: 'prospect',
          sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: false,
        },
      ],
      internalNotes: [],
      stoppedSequence: true,
      lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      unreadCount: 1,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'conv-2',
      personId: 'person-2',
      channel: 'email',
      status: 'pendiente',
      labels: ['tibio'],
      messages: [
        {
          id: 'msg-3',
          conversationId: 'conv-2',
          channel: 'email',
          subject: 'Automatización de prospección B2B',
          content: 'Hola María, noté que TechCorp está creciendo rápido. ¿Están evaluando herramientas para automatizar su generación de leads?',
          sentBy: 'user',
          sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'msg-4',
          conversationId: 'conv-2',
          channel: 'email',
          subject: 'Re: Automatización de prospección B2B',
          content: 'Hola, gracias por contactarte. Sí, estamos en proceso de evaluación. ¿Podrías enviarme más información sobre precios?',
          sentBy: 'prospect',
          sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: false,
        },
      ],
      internalNotes: [
        {
          id: 'note-1',
          content: 'Lead calificado. Mencionó que tienen presupuesto aprobado para Q1.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdBy: 'Mauricio',
        },
      ],
      lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unreadCount: 1,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'conv-3',
      personId: 'person-3',
      channel: 'whatsapp',
      status: 'respondido',
      labels: ['caliente'],
      messages: [
        {
          id: 'msg-5',
          conversationId: 'conv-3',
          channel: 'whatsapp',
          content: 'Hola Carlos! Te escribo desde END2END. ¿Cómo va tu búsqueda de nuevos clientes?',
          sentBy: 'user',
          sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'msg-6',
          conversationId: 'conv-3',
          channel: 'whatsapp',
          content: 'Hola! Justo estábamos viendo opciones. Mandame info por favor.',
          sentBy: 'prospect',
          sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 'msg-7',
          conversationId: 'conv-3',
          channel: 'whatsapp',
          content: 'Perfecto! Te comparto este video donde explico cómo funciona: [link]. ¿Te gustaría una demo personalizada?',
          sentBy: 'user',
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true,
        },
      ],
      internalNotes: [],
      meeting: {
        id: 'meeting-1',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        duration: 30,
        platform: 'zoom',
        status: 'programada',
        notes: 'Demo personalizada de la plataforma',
      },
      lastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      unreadCount: 0,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'conv-4',
      personId: 'person-4',
      channel: 'linkedin',
      status: 'requiere-followup',
      labels: ['frio'],
      messages: [
        {
          id: 'msg-8',
          conversationId: 'conv-4',
          channel: 'linkedin',
          content: 'Hola Laura! Noté que CloudSoft está expandiéndose a LATAM. ¿Están buscando optimizar su prospección?',
          sentBy: 'user',
          sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          read: true,
        },
      ],
      internalNotes: [],
      requiresFollowup: true,
      followupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      lastMessageAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      unreadCount: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const getConversation = useCallback((id: string): Conversation | undefined => {
    return conversations.find(c => c.id === id);
  }, [conversations]);

  const getConversationsByStatus = useCallback((status: ConversationStatus): Conversation[] => {
    return conversations.filter(c => c.status === status);
  }, [conversations]);

  const getConversationsByChannel = useCallback((channel: MessageChannel): Conversation[] => {
    return conversations.filter(c => c.channel === channel);
  }, [conversations]);

  const getConversationsByLabel = useCallback((label: ConversationLabel): Conversation[] => {
    return conversations.filter(c => c.labels.includes(label));
  }, [conversations]);

  const getNewConversations = useCallback((): Conversation[] => {
    return conversations.filter(c => c.unreadCount > 0);
  }, [conversations]);

  const sendMessage = useCallback((conversationId: string, content: string, subject?: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        channel: conv.channel,
        content,
        subject,
        sentBy: 'user',
        sentAt: new Date(),
        read: true,
      };

      return {
        ...conv,
        messages: [...conv.messages, newMessage],
        status: 'respondido',
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      };
    }));

    // Add to CRM timeline
    const conversation = getConversation(conversationId);
    if (conversation) {
      addTimelineEvent(conversation.personId, {
        type: 'mensaje',
        description: `Mensaje enviado por ${conversation.channel}`,
        channel: conversation.channel,
      });
    }
  }, [getConversation, addTimelineEvent]);

  const receiveMessage = useCallback((
    conversationId: string,
    content: string,
    channel: MessageChannel,
    fromSequence: boolean = false
  ) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        channel,
        content,
        sentBy: 'prospect',
        sentAt: new Date(),
        read: false,
      };

      const updatedConv = {
        ...conv,
        messages: [...conv.messages, newMessage],
        status: 'nuevo' as ConversationStatus,
        lastMessageAt: new Date(),
        unreadCount: conv.unreadCount + 1,
        updatedAt: new Date(),
      };

      // If they replied to a sequence, stop it and mark
      if (fromSequence) {
        updatedConv.stoppedSequence = true;

        // Stop sequence in SequencesContext
        // Find active sequence and stop contact
        const sequences = useSequences.getState?.()?.sequences || [];
        const activeSequence = sequences.find(s =>
          s.contacts.some(c => c.personId === conv.personId && c.status === 'activo')
        );

        if (activeSequence) {
          stopContactInSequence(activeSequence.id, conv.personId, 'respondio');
        }

        // Update CRM status to "respondio"
        updateLeadStatus(conv.personId, 'respondio');
      }

      return updatedConv;
    }));

    // Add to CRM timeline
    const conversation = getConversation(conversationId);
    if (conversation) {
      addTimelineEvent(conversation.personId, {
        type: 'respuesta',
        description: `Prospecto respondió por ${channel}`,
        channel,
      });
    }
  }, [getConversation, addTimelineEvent, updateLeadStatus, stopContactInSequence]);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      return {
        ...conv,
        messages: conv.messages.map(msg => ({ ...msg, read: true })),
        unreadCount: 0,
        updatedAt: new Date(),
      };
    }));
  }, []);

  const updateStatus = useCallback((conversationId: string, status: ConversationStatus) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, status, updatedAt: new Date() }
        : conv
    ));
  }, []);

  const addLabel = useCallback((conversationId: string, label: ConversationLabel) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      if (conv.labels.includes(label)) return conv;

      return {
        ...conv,
        labels: [...conv.labels, label],
        updatedAt: new Date(),
      };
    }));
  }, []);

  const removeLabel = useCallback((conversationId: string, label: ConversationLabel) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      return {
        ...conv,
        labels: conv.labels.filter(l => l !== label),
        updatedAt: new Date(),
      };
    }));
  }, []);

  const addInternalNote = useCallback((conversationId: string, content: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      const newNote: InternalNote = {
        id: `note-${Date.now()}`,
        content,
        createdAt: new Date(),
        createdBy: 'Mauricio', // In real app, get from auth context
      };

      return {
        ...conv,
        internalNotes: [...conv.internalNotes, newNote],
        updatedAt: new Date(),
      };
    }));
  }, []);

  const scheduleMeeting = useCallback((conversationId: string, meeting: Omit<Meeting, 'id'>) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      const newMeeting: Meeting = {
        ...meeting,
        id: `meeting-${Date.now()}`,
      };

      return {
        ...conv,
        meeting: newMeeting,
        updatedAt: new Date(),
      };
    }));

    // Add to CRM timeline
    const conversation = getConversation(conversationId);
    if (conversation) {
      addTimelineEvent(conversation.personId, {
        type: 'reunion',
        description: `Reunión agendada para ${new Date(meeting.scheduledAt).toLocaleDateString()}`,
      });

      // Update lead status to "reunion"
      updateLeadStatus(conversation.personId, 'reunion');
    }
  }, [getConversation, addTimelineEvent, updateLeadStatus]);

  const setFollowupReminder = useCallback((conversationId: string, date: Date) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? {
            ...conv,
            requiresFollowup: true,
            followupDate: date,
            status: 'requiere-followup',
            updatedAt: new Date(),
          }
        : conv
    ));
  }, []);

  const archiveConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, status: 'archivado', updatedAt: new Date() }
        : conv
    ));
  }, []);

  const createConversation = useCallback((personId: string, channel: MessageChannel): string => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      personId,
      channel,
      status: 'nuevo',
      labels: [],
      messages: [],
      internalNotes: [],
      lastMessageAt: new Date(),
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  }, []);

  const value: ConversationsContextType = {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    getConversation,
    getConversationsByStatus,
    getConversationsByChannel,
    getConversationsByLabel,
    getNewConversations,
    sendMessage,
    receiveMessage,
    markAsRead,
    updateStatus,
    addLabel,
    removeLabel,
    addInternalNote,
    scheduleMeeting,
    setFollowupReminder,
    archiveConversation,
    createConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};
