'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { useCRM } from '@/contexts/CRMContext';
import { people } from '@/data/people';
import Link from 'next/link';
import {
  Search, Filter, Mail, Linkedin, MessageCircle,
  Calendar, Paperclip, Send, Video, StickyNote,
  MoveRight, Sparkles, X, Clock, Check, CheckCheck
} from 'lucide-react';

type Channel = 'linkedin' | 'email' | 'whatsapp' | 'all';

// Mock messages for the conversation
interface Message {
  id: string;
  from: 'user' | 'contact';
  content: string;
  timestamp: Date;
  channel: 'linkedin' | 'email' | 'whatsapp';
  status?: 'sent' | 'delivered' | 'read';
}

export default function ConversacionesPage() {
  const { leads, updateLeadStatus, scheduleMeeting } = useCRM();
  const [activeChannel, setActiveChannel] = useState<Channel>('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  // Filter leads that have responded or are in sequence
  const conversations = useMemo(() => {
    return leads.filter(l => l.status === 'respondio' || l.status === 'en-secuencia' || l.status === 'reunion-agendada');
  }, [leads]);

  const enrichedConversations = useMemo(() => {
    return conversations.map(lead => {
      const person = people.find(p => p.id === lead.personId);
      return { ...lead, person };
    }).filter(conv => conv.person);
  }, [conversations]);

  // Filter by channel
  const filteredConversations = useMemo(() => {
    if (activeChannel === 'all') return enrichedConversations;
    // For this demo, we'll just filter based on the person's preferred channel from company data
    return enrichedConversations;
  }, [enrichedConversations, activeChannel]);

  const selectedLead = selectedConversation
    ? enrichedConversations.find(c => c.id === selectedConversation)
    : null;

  // Mock conversation messages
  const conversationMessages: Message[] = selectedLead ? [
    {
      id: 'msg-1',
      from: 'user',
      content: `Hola ${selectedLead.person?.firstName}! Vi que sos ${selectedLead.person?.title} en ${selectedLead.person?.company}. Me gustaría conectar para compartir una estrategia que está ayudando a empresas del sector a escalar sus ventas B2B. ¿Te interesa?`,
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      channel: 'linkedin',
      status: 'read',
    },
    {
      id: 'msg-2',
      from: 'contact',
      content: `Hola! Vi tu mensaje. Sí, me interesa conocer más sobre cómo pueden ayudarnos a mejorar nuestro proceso de generación de leads. ¿Podrías darme más detalles?`,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      channel: 'linkedin',
    },
    {
      id: 'msg-3',
      from: 'user',
      content: `Perfecto! Trabajamos con empresas como ${selectedLead.person?.company} ayudándolas a generar 3-5 reuniones calificadas por semana a través de automatización multicanal. \n\nNuestra plataforma combina:\n- Búsqueda avanzada de empresas y decisores\n- Warm-up social automatizado en LinkedIn\n- Secuencias personalizadas por email, LinkedIn y WhatsApp\n- CRM visual con gestión completa del pipeline\n\n¿Tenés 15 minutos esta semana para una demo rápida?`,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      channel: 'linkedin',
      status: 'read',
    },
    {
      id: 'msg-4',
      from: 'contact',
      content: 'Me parece interesante. El jueves o viernes de la semana que viene me vendría bien. ¿Qué horarios tenés disponibles?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      channel: 'linkedin',
    },
  ] : [];

  const handleScheduleMeeting = () => {
    if (!selectedLead || !meetingDate || !meetingTime) return;

    scheduleMeeting({
      leadId: selectedLead.id,
      personId: selectedLead.personId,
      title: `Reunión con ${selectedLead.person?.fullName}`,
      date: new Date(meetingDate),
      time: meetingTime,
      meetLink: meetingLink || 'https://meet.google.com/xxx-xxxx-xxx',
      notes: '',
      status: 'scheduled',
    });

    setShowScheduleModal(false);
    setMeetingDate('');
    setMeetingTime('');
    setMeetingLink('');
  };

  const handleGenerateResponse = async () => {
    setIsGeneratingResponse(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponses = [
      `Perfecto ${selectedLead?.person?.firstName}! Te puedo ofrecer el jueves 5/12 a las 15:00 o el viernes 6/12 a las 10:00 o 16:00 hs. ¿Cuál te viene mejor?\n\nTe voy a enviar un link de Google Meet para la reunión.`,
      `Excelente! Tengo disponibilidad el jueves 5 a las 15:00 y el viernes 6 a las 10:00 o 16:00. ¿Alguno de esos horarios te funciona?\n\nLa demo dura 15-20 minutos y vamos a ver en vivo cómo podés aplicarlo a ${selectedLead?.person?.company}.`,
      `Genial! Perfecto timing. El jueves 5/12 tengo a las 15:00 y el viernes 6/12 a las 10:00 y 16:00. \n\n¿Cuál preferís? Te mando el link de Meet apenas confirms.`,
    ];

    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    setMessage(randomResponse);
    setIsGeneratingResponse(false);
  };

  const getChannelIcon = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin':
        return <Linkedin size={14} className="text-blue-600" />;
      case 'email':
        return <Mail size={14} className="text-purple-600" />;
      case 'whatsapp':
        return <MessageCircle size={14} className="text-green-600" />;
    }
  };

  const getChannelColor = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'email':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'whatsapp':
        return 'bg-green-50 text-green-600 border-green-200';
    }
  };

  const getMessageStatus = (status?: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-normal text-gray-900 mb-1">Inbox Unificado</h1>
              <p className="text-sm text-gray-500">
                Gestiona todas tus conversaciones desde un solo lugar - Estilo Front
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/crm"
                className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors"
              >
                Ver CRM
              </Link>
            </div>
          </div>

          {/* Channel Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChannel('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChannel === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({filteredConversations.length})
            </button>
            <button
              onClick={() => setActiveChannel('linkedin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChannel === 'linkedin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Linkedin size={16} />
              LinkedIn
            </button>
            <button
              onClick={() => setActiveChannel('email')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChannel === 'email'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail size={16} />
              Email
            </button>
            <button
              onClick={() => setActiveChannel('whatsapp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChannel === 'whatsapp'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  No hay conversaciones activas
                </div>
              ) : (
                filteredConversations.map(conv => {
                  if (!conv.person) return null;
                  const hasUnread = conv.status === 'respondio';

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img
                            src={conv.person.avatar}
                            alt={conv.person.fullName}
                            className="w-10 h-10 rounded-full"
                          />
                          {hasUnread && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'}`}>
                              {conv.person.fullName}
                            </h4>
                            <span className="text-xs text-gray-400 ml-2">2h</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mb-1">{conv.person.company}</p>
                          <p className={`text-xs truncate ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            Me parece interesante. El jueves o...
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Conversation Detail */}
          {selectedLead && selectedLead.person ? (
            <div className="flex-1 flex flex-col">
              {/* Conversation Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedLead.person.avatar}
                      alt={selectedLead.person.fullName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {selectedLead.person.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">{selectedLead.person.title}</p>
                      <p className="text-sm text-gray-500">{selectedLead.person.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      <Calendar size={16} />
                      Agendar reunión
                    </button>
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id, 'cliente')}
                      className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      <MoveRight size={16} />
                      Marcar como cliente
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-3xl mx-auto space-y-4">
                  {conversationMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200'} rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                            msg.from === 'user'
                              ? 'bg-white/20 text-white border-white/30'
                              : getChannelColor(msg.channel)
                          }`}>
                            {getChannelIcon(msg.channel)}
                            {msg.channel === 'linkedin' ? 'LinkedIn' : msg.channel === 'email' ? 'Email' : 'WhatsApp'}
                          </span>
                        </div>
                        <p className={`text-sm whitespace-pre-wrap ${msg.from === 'user' ? 'text-white' : 'text-gray-900'}`}>
                          {msg.content}
                        </p>
                        <div className={`flex items-center justify-between mt-2 text-xs ${msg.from === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                          <span>
                            {msg.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.from === 'user' && msg.status && (
                            <span className="flex items-center gap-1">
                              {getMessageStatus(msg.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end gap-3 mb-2">
                  <button
                    onClick={handleGenerateResponse}
                    disabled={isGeneratingResponse}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={16} />
                    {isGeneratingResponse ? 'Generando...' : 'Generar respuesta con IA'}
                  </button>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>Ahorra tiempo con respuestas inteligentes</span>
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe tu mensaje o genera uno con IA..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Adjuntar archivo">
                      <Paperclip size={20} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (message.trim()) {
                          // Here you would add the message to the conversation
                          setMessage('');
                        }
                      }}
                      disabled={!message.trim()}
                      className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Enviar mensaje"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona una conversación para empezar</p>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Meeting Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Agendar Reunión</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={`Reunión con ${selectedLead?.person?.fullName}`}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link de Meet/Zoom
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 La reunión se agendará automáticamente y se enviará un email con el link de Google Meet
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={handleScheduleMeeting}
                    disabled={!meetingDate || !meetingTime}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calendar size={16} />
                    Confirmar reunión
                  </button>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
