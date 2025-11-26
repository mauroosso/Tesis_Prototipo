'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Linkedin, Mail, MessageCircle, Calendar, Plus, Play, Pause, Edit, Copy, Trash2, Sparkles } from 'lucide-react';

interface SequenceStep {
  id: string;
  day: number;
  channel: 'linkedin' | 'email' | 'whatsapp';
  type: string;
  subject?: string;
  message: string;
}

interface Sequence {
  id: string;
  name: string;
  status: 'activa' | 'pausada' | 'borrador';
  contacts: number;
  openRate: number;
  responseRate: number;
  steps: SequenceStep[];
}

const mockSequences: Sequence[] = [
  {
    id: 'seq-1',
    name: 'Outreach Founders Tech LATAM',
    status: 'activa',
    contacts: 45,
    openRate: 68,
    responseRate: 22,
    steps: [
      {
        id: 'step-1',
        day: 1,
        channel: 'linkedin',
        type: 'Invitación',
        message: 'Hola {nombre}, vi que liderás {empresa} en {industria}. Me encantaría conectar y compartir algunos insights sobre cómo otras empresas similares están escalando en LATAM.',
      },
      {
        id: 'step-2',
        day: 3,
        channel: 'email',
        type: 'Seguimiento',
        subject: 'Re: Escalando en LATAM',
        message: 'Hola {nombre},\n\nVi que aceptaste mi invitación en LinkedIn - ¡gracias!\n\nTe escribo porque ayudamos a empresas como {empresa} a optimizar su proceso de generación de leads. Trabajamos con +50 empresas tech en LATAM y hemos visto resultados consistentes.\n\n¿Tendrías 15 minutos esta semana para una charla rápida?\n\nSaludos,',
      },
      {
        id: 'step-3',
        day: 7,
        channel: 'whatsapp',
        type: 'Mensaje corto',
        message: 'Hola {nombre}! 👋 Te escribí por email hace unos días. ¿Tenés unos minutos para charlar sobre cómo ayudamos a empresas como {empresa}?',
      },
      {
        id: 'step-4',
        day: 10,
        channel: 'email',
        type: 'Caso de éxito',
        subject: 'Caso: {empresa_similar} aumentó leads 300%',
        message: 'Hola {nombre},\n\nQuiero compartirte un caso de éxito que puede resonar con lo que están haciendo en {empresa}.\n\n{empresa_similar}, una empresa {industria} similar a la tuya, logró aumentar su generación de leads en 300% en 4 meses usando nuestra plataforma.\n\n¿Te interesa conocer cómo lo hicieron?\n\nPodemos agendar una llamada breve.',
      },
    ],
  },
];

export default function SecuenciasPage() {
  const [sequences] = useState<Sequence[]>(mockSequences);
  const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(sequences[0]);

  const getChannelIcon = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin':
        return <Linkedin size={20} className="text-blue-600" />;
      case 'email':
        return <Mail size={20} className="text-purple-600" />;
      case 'whatsapp':
        return <MessageCircle size={20} className="text-green-600" />;
    }
  };

  const getChannelBg = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin':
        return 'bg-blue-50 border-blue-200';
      case 'email':
        return 'bg-purple-50 border-purple-200';
      case 'whatsapp':
        return 'bg-green-50 border-green-200';
    }
  };

  const getStatusBadge = (status: Sequence['status']) => {
    const styles = {
      activa: 'bg-green-50 text-green-600 border-green-200',
      pausada: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      borrador: 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return styles[status];
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gray-light">
        {/* Header */}
        <div className="bg-white border-b border-gray-border px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-dark mb-1">Secuencias Multicanal</h1>
              <p className="text-sm text-gray-text">
                Automatiza tu outreach con mensajes personalizados
              </p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              <Plus size={16} />
              Nueva secuencia
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sequences List */}
          <aside className="w-80 bg-white border-r border-gray-border overflow-y-auto">
            <div className="p-4 border-b border-gray-border">
              <h3 className="text-sm font-semibold text-gray-dark mb-1">Mis secuencias</h3>
              <p className="text-xs text-gray-text">{sequences.length} secuencias creadas</p>
            </div>
            <div className="p-3 space-y-2">
              {sequences.map(seq => (
                <div
                  key={seq.id}
                  onClick={() => setSelectedSequence(seq)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedSequence?.id === seq.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-border hover:border-gray-300 hover:bg-gray-light/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-dark">{seq.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(seq.status)}`}>
                      {seq.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-text">
                    <p>{seq.contacts} contactos activos</p>
                    <p>Apertura: {seq.openRate}% • Respuesta: {seq.responseRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Sequence Detail */}
          {selectedSequence && (
            <div className="flex-1 overflow-y-auto">
              {/* Sequence Header */}
              <div className="bg-white border-b border-gray-border px-8 py-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-medium text-gray-dark mb-2">
                      {selectedSequence.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-text">
                        {selectedSequence.contacts} contactos activos
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-text">
                        {selectedSequence.steps.length} pasos
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSequence.status === 'activa' ? (
                      <button className="flex items-center gap-2 border border-gray-border px-4 py-2 rounded-lg text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">
                        <Pause size={16} />
                        Pausar
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success-dark transition-colors">
                        <Play size={16} />
                        Activar
                      </button>
                    )}
                    <button className="p-2 border border-gray-border rounded-lg hover:bg-gray-light transition-colors">
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 border border-gray-border rounded-lg hover:bg-gray-light transition-colors">
                      <Copy size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 border border-gray-border rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-light rounded-lg p-4">
                    <p className="text-xs text-gray-text mb-1">Tasa de apertura</p>
                    <p className="text-2xl font-semibold text-gray-dark">{selectedSequence.openRate}%</p>
                  </div>
                  <div className="bg-gray-light rounded-lg p-4">
                    <p className="text-xs text-gray-text mb-1">Tasa de respuesta</p>
                    <p className="text-2xl font-semibold text-primary">{selectedSequence.responseRate}%</p>
                  </div>
                  <div className="bg-gray-light rounded-lg p-4">
                    <p className="text-xs text-gray-text mb-1">Conversiones</p>
                    <p className="text-2xl font-semibold text-success">
                      {Math.round(selectedSequence.contacts * (selectedSequence.responseRate / 100))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-lg font-medium text-gray-dark mb-6">Timeline de la secuencia</h3>

                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[2rem] top-8 bottom-8 w-0.5 bg-gray-border" />

                    {/* Steps */}
                    <div className="space-y-8">
                      {selectedSequence.steps.map((step, index) => (
                        <div key={step.id} className="relative flex gap-6">
                          {/* Day Indicator */}
                          <div className="flex flex-col items-center w-16 flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10">
                              <div className="text-center">
                                <div className="text-xs text-gray-text">Día</div>
                                <div className="text-lg font-semibold text-primary">{step.day}</div>
                              </div>
                            </div>
                          </div>

                          {/* Step Card */}
                          <div className="flex-1 bg-white rounded-lg border border-gray-border p-6 card-hover">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg border ${getChannelBg(step.channel)}`}>
                                  {getChannelIcon(step.channel)}
                                </div>
                                <div>
                                  <h4 className="text-base font-medium text-gray-dark capitalize">
                                    {step.channel} - {step.type}
                                  </h4>
                                  {step.subject && (
                                    <p className="text-sm text-gray-text mt-0.5">
                                      Asunto: {step.subject}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
                                Editar
                              </button>
                            </div>

                            {/* Message Preview */}
                            <div className="bg-gray-light rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                              {step.message}
                            </div>

                            {/* Variables Used */}
                            <div className="mt-4 flex items-center gap-2 text-xs">
                              <span className="text-gray-text">Variables:</span>
                              {['nombre', 'empresa', 'industria'].map(variable => (
                                <span
                                  key={variable}
                                  className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono"
                                >
                                  {`{${variable}}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Step Button */}
                  <button className="mt-8 w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-text hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} />
                    <span className="font-medium">Agregar nuevo paso</span>
                  </button>
                </div>
              </div>

              {/* Important Notice */}
              <div className="px-8 pb-8">
                <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-100 rounded-lg p-6">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 text-2xl">
                      ✉️
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-dark mb-2">
                        Solo enviamos mensajes reales, nunca spam
                      </h4>
                      <p className="text-sm text-gray-600">
                        Nuestra plataforma está diseñada para respetar las mejores prácticas de outreach.
                        Los mensajes se envían de forma natural, con intervalos realistas y siempre personalizados.
                        Jamás enviaremos mensajes masivos que puedan dañar tu reputación.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="px-8 pb-8">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <Sparkles className="text-primary" size={24} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-dark mb-2">
                        Optimiza tu secuencia con IA
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Nuestra IA puede analizar tus mensajes y sugerir mejoras basadas en miles de secuencias exitosas en LATAM.
                      </p>
                      <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Sparkles size={16} />
                        Optimizar con IA
                      </button>
                    </div>
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
