'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type SequenceChannel = 'linkedin' | 'email' | 'whatsapp';
export type SequenceStatus = 'activa' | 'pausada' | 'borrador';

export interface SequenceStep {
  id: string;
  day: number;
  channel: SequenceChannel;
  title: string;
  subject?: string; // For emails
  message: string;
  order: number;
}

export interface SequenceContact {
  personId: string;
  currentDay: number;
  currentStepIndex: number;
  startedAt: Date;
  lastStepSentAt: Date | null;
  status: 'activo' | 'completado' | 'detenido';
  stoppedReason?: 'respondio' | 'manual';
}

export interface SequenceMetrics {
  sent: number;
  opened: number;
  replied: number;
  conversions: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
}

export interface Sequence {
  id: string;
  name: string;
  status: SequenceStatus;
  steps: SequenceStep[];
  contacts: SequenceContact[];
  listId: string | null;
  metrics: SequenceMetrics;
  createdAt: Date;
  updatedAt: Date;
}

interface SequencesContextType {
  sequences: Sequence[];

  // Sequence operations
  createSequence: (name: string, listId: string | null, firstStep: Omit<SequenceStep, 'id' | 'order'>) => string;
  updateSequence: (sequenceId: string, updates: Partial<Sequence>) => void;
  deleteSequence: (sequenceId: string) => void;
  duplicateSequence: (sequenceId: string) => string;
  pauseSequence: (sequenceId: string) => void;
  activateSequence: (sequenceId: string) => void;

  // Step operations
  addStep: (sequenceId: string, step: Omit<SequenceStep, 'id' | 'order'>) => void;
  updateStep: (sequenceId: string, stepId: string, updates: Partial<SequenceStep>) => void;
  deleteStep: (sequenceId: string, stepId: string) => void;

  // Contact operations
  addContactsToSequence: (sequenceId: string, personIds: string[]) => void;
  stopContactInSequence: (sequenceId: string, personId: string, reason: 'respondio' | 'manual') => void;

  // Utilities
  getSequenceById: (sequenceId: string) => Sequence | undefined;
  getActiveSequences: () => Sequence[];
  processSequences: () => void; // Simulate automation
}

const SequencesContext = createContext<SequencesContextType | undefined>(undefined);

export function SequencesProvider({ children }: { children: ReactNode }) {
  const [sequences, setSequences] = useState<Sequence[]>([
    // Demo sequence
    {
      id: 'seq-demo-1',
      name: 'Outreach Founders Tech LATAM',
      status: 'activa',
      listId: null,
      steps: [
        {
          id: 'step-1',
          day: 1,
          channel: 'linkedin',
          title: 'Conexión + mensaje personalizado',
          message: 'Hola {nombre}, vi que sos {cargo} en {empresa}. Me gustaría conectar para compartir una estrategia que está ayudando a empresas de {industria} a escalar sus ventas B2B. ¿Te interesa?',
          order: 0,
        },
        {
          id: 'step-2',
          day: 3,
          channel: 'email',
          title: 'Follow-up Email',
          subject: 'Re: Estrategia de ventas para {empresa}',
          message: 'Hola {nombre},\n\nTe escribí por LinkedIn hace unos días. Sé que {pain} es un desafío común en {industria}.\n\nTrabajamos con empresas similares a {empresa} ayudándolas a generar 3-5 reuniones calificadas por semana.\n\n¿Tenés 15 minutos esta semana para una llamada rápida?\n\nSaludos,',
          order: 1,
        },
        {
          id: 'step-3',
          day: 7,
          channel: 'linkedin',
          title: 'Follow-up LinkedIn',
          message: '{nombre}, quería hacer un último follow-up. Si no es el momento adecuado, lo entiendo perfectamente. ¿Preferís que vuelva a contactarte en un par de meses?',
          order: 2,
        },
        {
          id: 'step-4',
          day: 14,
          channel: 'whatsapp',
          title: 'Último touchpoint',
          message: 'Hola {nombre}! Soy [Tu nombre]. Te contacté hace unas semanas sobre cómo ayudar a {empresa} con ventas B2B. ¿Sigue siendo relevante para vos?',
          order: 3,
        },
      ],
      contacts: [],
      metrics: {
        sent: 145,
        opened: 89,
        replied: 23,
        conversions: 8,
        openRate: 61.4,
        replyRate: 15.9,
        conversionRate: 5.5,
      },
      createdAt: new Date('2025-11-15'),
      updatedAt: new Date('2025-11-28'),
    },
    {
      id: 'seq-demo-2',
      name: 'Reactivación clientes perdidos',
      status: 'pausada',
      listId: null,
      steps: [
        {
          id: 'step-5',
          day: 1,
          channel: 'email',
          title: 'Email de reactivación',
          subject: 'Te extrañamos, {nombre}',
          message: 'Hola {nombre},\n\nNoté que hace un tiempo no conversamos. ¿Cómo va todo en {empresa}?\n\nQuería compartirte algunas actualizaciones que podrían interesarte...',
          order: 0,
        },
        {
          id: 'step-6',
          day: 5,
          channel: 'linkedin',
          title: 'Mensaje LinkedIn',
          message: '{nombre}, espero que todo esté bien! Quería retomar la conversación. ¿Tenés unos minutos esta semana?',
          order: 1,
        },
      ],
      contacts: [],
      metrics: {
        sent: 67,
        opened: 45,
        replied: 12,
        conversions: 4,
        openRate: 67.2,
        replyRate: 17.9,
        conversionRate: 6.0,
      },
      createdAt: new Date('2025-10-20'),
      updatedAt: new Date('2025-11-10'),
    },
  ]);

  const createSequence = (name: string, listId: string | null, firstStep: Omit<SequenceStep, 'id' | 'order'>): string => {
    const newSequence: Sequence = {
      id: `seq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      status: 'borrador',
      listId,
      steps: [
        {
          ...firstStep,
          id: `step-${Date.now()}-1`,
          order: 0,
        },
      ],
      contacts: [],
      metrics: {
        sent: 0,
        opened: 0,
        replied: 0,
        conversions: 0,
        openRate: 0,
        replyRate: 0,
        conversionRate: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSequences(prev => [...prev, newSequence]);
    return newSequence.id;
  };

  const updateSequence = (sequenceId: string, updates: Partial<Sequence>) => {
    setSequences(prev =>
      prev.map(seq =>
        seq.id === sequenceId
          ? { ...seq, ...updates, updatedAt: new Date() }
          : seq
      )
    );
  };

  const deleteSequence = (sequenceId: string) => {
    setSequences(prev => prev.filter(seq => seq.id !== sequenceId));
  };

  const duplicateSequence = (sequenceId: string): string => {
    const original = sequences.find(seq => seq.id === sequenceId);
    if (!original) return '';

    const newId = `seq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duplicated: Sequence = {
      ...original,
      id: newId,
      name: `${original.name} (copia)`,
      status: 'borrador',
      contacts: [],
      metrics: {
        sent: 0,
        opened: 0,
        replied: 0,
        conversions: 0,
        openRate: 0,
        replyRate: 0,
        conversionRate: 0,
      },
      steps: original.steps.map(step => ({
        ...step,
        id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSequences(prev => [...prev, duplicated]);
    return newId;
  };

  const pauseSequence = (sequenceId: string) => {
    updateSequence(sequenceId, { status: 'pausada' });
  };

  const activateSequence = (sequenceId: string) => {
    updateSequence(sequenceId, { status: 'activa' });
  };

  const addStep = (sequenceId: string, step: Omit<SequenceStep, 'id' | 'order'>) => {
    setSequences(prev =>
      prev.map(seq => {
        if (seq.id === sequenceId) {
          const newStep: SequenceStep = {
            ...step,
            id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            order: seq.steps.length,
          };
          return {
            ...seq,
            steps: [...seq.steps, newStep],
            updatedAt: new Date(),
          };
        }
        return seq;
      })
    );
  };

  const updateStep = (sequenceId: string, stepId: string, updates: Partial<SequenceStep>) => {
    setSequences(prev =>
      prev.map(seq => {
        if (seq.id === sequenceId) {
          return {
            ...seq,
            steps: seq.steps.map(step =>
              step.id === stepId ? { ...step, ...updates } : step
            ),
            updatedAt: new Date(),
          };
        }
        return seq;
      })
    );
  };

  const deleteStep = (sequenceId: string, stepId: string) => {
    setSequences(prev =>
      prev.map(seq => {
        if (seq.id === sequenceId) {
          const filteredSteps = seq.steps.filter(step => step.id !== stepId);
          // Reorder remaining steps
          const reorderedSteps = filteredSteps.map((step, index) => ({
            ...step,
            order: index,
          }));
          return {
            ...seq,
            steps: reorderedSteps,
            updatedAt: new Date(),
          };
        }
        return seq;
      })
    );
  };

  const addContactsToSequence = (sequenceId: string, personIds: string[]) => {
    setSequences(prev =>
      prev.map(seq => {
        if (seq.id === sequenceId) {
          const newContacts: SequenceContact[] = personIds.map(personId => ({
            personId,
            currentDay: 1,
            currentStepIndex: 0,
            startedAt: new Date(),
            lastStepSentAt: null,
            status: 'activo',
          }));
          return {
            ...seq,
            contacts: [...seq.contacts, ...newContacts],
            updatedAt: new Date(),
          };
        }
        return seq;
      })
    );
  };

  const stopContactInSequence = (sequenceId: string, personId: string, reason: 'respondio' | 'manual') => {
    setSequences(prev =>
      prev.map(seq => {
        if (seq.id === sequenceId) {
          return {
            ...seq,
            contacts: seq.contacts.map(contact =>
              contact.personId === personId
                ? { ...contact, status: 'detenido', stoppedReason: reason }
                : contact
            ),
            updatedAt: new Date(),
          };
        }
        return seq;
      })
    );
  };

  const getSequenceById = (sequenceId: string) => {
    return sequences.find(seq => seq.id === sequenceId);
  };

  const getActiveSequences = () => {
    return sequences.filter(seq => seq.status === 'activa');
  };

  const processSequences = () => {
    // This would be called periodically to advance sequences
    // For demo purposes, we won't implement the full automation
    console.log('Processing sequences...');
  };

  return (
    <SequencesContext.Provider
      value={{
        sequences,
        createSequence,
        updateSequence,
        deleteSequence,
        duplicateSequence,
        pauseSequence,
        activateSequence,
        addStep,
        updateStep,
        deleteStep,
        addContactsToSequence,
        stopContactInSequence,
        getSequenceById,
        getActiveSequences,
        processSequences,
      }}
    >
      {children}
    </SequencesContext.Provider>
  );
}

export function useSequences() {
  const context = useContext(SequencesContext);
  if (!context) {
    throw new Error('useSequences must be used within SequencesProvider');
  }
  return context;
}
