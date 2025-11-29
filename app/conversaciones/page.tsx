'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useCRM } from '@/contexts/CRMContext';
import { people } from '@/data/people';
import Link from 'next/link';
import {
  Search, Filter, Mail, Linkedin, MessageCircle,
  Calendar, Paperclip, Send, Video, StickyNote,
  MoveRight
} from 'lucide-react';

type Channel = 'linkedin' | 'email' | 'whatsapp' | 'all';

export default function ConversacionesPage() {
  const { leads, updateLeadStatus, scheduleMeeting } = useCRM();
  const [activeChannel, setActiveChannel] = useState<Channel>('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Filter leads that have responded
  const conversations = leads.filter(l => l.status === 'respondio' || l.status === 'en-secuencia');

  const enrichedConversations = conversations.map(lead => {
    const person = people.find(p => p.id === lead.personId);
    return { ...lead, person };
  });

  const selectedLead = selectedConversation
    ? enrichedConversations.find(c => c.id === selectedConversation)
    : null;

  const handleScheduleMeeting = (date: string, time: string, meetLink: string) => {
    if (!selectedLead) return;

    scheduleMeeting({
      leadId: selectedLead.id,
      personId: selectedLead.personId,
      title: `Reunión con ${selectedLead.person?.fullName}`,
      date: new Date(date),
      time,
      meetLink,
      notes: '',
      status: 'scheduled',
    });

    setShowScheduleModal(false);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-normal text-gray-900">Conversaciones</h1>
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
              Todas
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
              {enrichedConversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  No hay conversaciones activas
                </div>
              ) : (
                enrichedConversations.map(conv => {
                  if (!conv.person) return null;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation === conv.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={conv.person.avatar}
                          alt={conv.person.fullName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {conv.person.fullName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{conv.person.company}</p>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {conv.status === 'respondio' ? 'Respondió a la secuencia' : 'En secuencia activa'}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-primary rounded-full" />
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
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md">
                      <p className="text-sm text-gray-900">
                        Hola! Vi tu mensaje sobre End2End. Me interesa conocer más sobre cómo pueden ayudarnos a mejorar nuestro proceso de generación de leads.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Hace 2 horas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip size={20} className="text-gray-400" />
                    </button>
                    <button className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Schedule Meeting Modal */}
              {showScheduleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Agendar Reunión</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                        <input
                          type="time"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link de Meet/Zoom</label>
                        <input
                          type="url"
                          placeholder="https://meet.google.com/xxx-xxxx-xxx"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <button
                          onClick={() => {
                            handleScheduleMeeting('2025-12-01', '15:00', 'https://meet.google.com/xxx');
                          }}
                          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                        >
                          Confirmar
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
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
