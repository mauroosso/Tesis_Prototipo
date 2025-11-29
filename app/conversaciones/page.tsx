'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useCRM, ConversationStatus } from '@/contexts/CRMContext';
import { useSequences } from '@/contexts/SequencesContext';
import { people } from '@/data/people';
import Link from 'next/link';
import {
  Search, Mail, Linkedin, MessageCircle,
  Send, Clock, CheckCheck, X, Building2, Briefcase,
  MapPin, Tag, ChevronRight, FileText,
} from 'lucide-react';

type InboxFilter = 'todos' | 'nuevos' | 'pendientes' | 'respondidos';

export default function ConversacionesPage() {
  const {
    conversations,
    addMessage,
    markConversationAsRead,
    updateLeadStatus,
  } = useCRM();

  const { sequences, stopContactInSequence } = useSequences();

  const [inboxFilter, setInboxFilter] = useState<InboxFilter>('todos');
  const [channelFilter, setChannelFilter] = useState<'all' | 'linkedin' | 'email' | 'whatsapp'>('all');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get selected conversation
  const selectedConversation = selectedConversationId
    ? conversations.find(c => c.id === selectedConversationId)
    : null;

  // Get person data for selected conversation
  const selectedPerson = selectedConversation
    ? people.find(p => p.id === selectedConversation.personId)
    : null;

  // Filter conversations
  const filteredConversations = conversations
    .filter(conv => {
      // Inbox filter
      if (inboxFilter === 'nuevos' && conv.status !== 'nuevo') return false;
      if (inboxFilter === 'pendientes' && conv.status !== 'pendiente') return false;
      if (inboxFilter === 'respondidos' && conv.status !== 'respondido') return false;

      // Channel filter
      if (channelFilter !== 'all' && conv.channel !== channelFilter) return false;

      // Search filter
      if (searchQuery) {
        const person = people.find(p => p.id === conv.personId);
        if (!person) return false;
        const query = searchQuery.toLowerCase();
        return (
          person.fullName.toLowerCase().includes(query) ||
          person.company.toLowerCase().includes(query) ||
          conv.messages.some(m => m.content.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime());

  // Mark as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      const conv = conversations.find(c => c.id === selectedConversationId);
      if (conv && conv.unread) {
        markConversationAsRead(selectedConversationId);
      }
    }
  }, [selectedConversationId]);

  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return;

    // Add message to conversation
    addMessage(selectedConversation.id, {
      from: 'user',
      content: message.trim(),
      channel: selectedConversation.channel,
    });

    // Stop any active sequence for this contact
    const activeSequences = sequences.filter(seq => seq.status === 'activa');
    activeSequences.forEach(seq => {
      const contactInSeq = seq.contacts.find(c => c.personId === selectedConversation.personId);
      if (contactInSeq && contactInSeq.status === 'activo') {
        stopContactInSequence(seq.id, selectedConversation.personId, 'respondio');
      }
    });

    // Update lead status if needed
    updateLeadStatus(selectedConversation.leadId, 'respondio');

    // Clear message
    setMessage('');
  };

  // Get channel icon
  const getChannelIcon = (channel: 'linkedin' | 'email' | 'whatsapp', size = 16) => {
    switch (channel) {
      case 'linkedin':
        return <Linkedin size={size} className="text-blue-600" />;
      case 'email':
        return <Mail size={size} className="text-purple-600" />;
      case 'whatsapp':
        return <MessageCircle size={size} className="text-green-600" />;
    }
  };

  // Get channel color
  const getChannelColor = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin': return 'bg-blue-100 text-blue-700';
      case 'email': return 'bg-purple-100 text-purple-700';
      case 'whatsapp': return 'bg-green-100 text-green-700';
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Ahora';
    if (hours < 24) return `Hace ${hours}h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
  };

  // Format message date
  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Hoy';
    if (isYesterday) return 'Ayer';
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Array<{
    id: string;
    from: 'user' | 'contact';
    content: string;
    timestamp: Date;
    channel: 'linkedin' | 'email' | 'whatsapp';
  }>) => {
    const groups: { date: string; messages: typeof messages }[] = [];
    let currentDate = '';

    messages.forEach(msg => {
      const msgDate = formatMessageDate(msg.timestamp);
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [] });
      }
      groups[groups.length - 1].messages.push(msg);
    });

    return groups;
  };

  // Get status badge
  const getStatusBadge = (status: ConversationStatus) => {
    switch (status) {
      case 'nuevo':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Nuevo</span>;
      case 'pendiente':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pendiente</span>;
      case 'respondido':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Respondido</span>;
    }
  };

  // Insert template
  const insertTemplate = () => {
    const templates = [
      'Hola! Gracias por tu interés. ¿Tenés disponibilidad esta semana para una llamada rápida de 15 minutos?',
      'Perfecto! Te mando el link para que elijas el horario que mejor te venga: [link]',
      'Gracias por tu mensaje. Te contacto en breve con más información.',
    ];
    setMessage(templates[0]);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-normal text-gray-900">Conversaciones</h1>
            <Link
              href="/crm"
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors"
            >
              Ver CRM
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Conversations List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Inbox Filters */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setInboxFilter('todos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    inboxFilter === 'todos'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos ({conversations.length})
                </button>
                <button
                  onClick={() => setInboxFilter('nuevos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    inboxFilter === 'nuevos'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Nuevos ({conversations.filter(c => c.status === 'nuevo').length})
                </button>
                <button
                  onClick={() => setInboxFilter('pendientes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    inboxFilter === 'pendientes'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pendientes ({conversations.filter(c => c.status === 'pendiente').length})
                </button>
                <button
                  onClick={() => setInboxFilter('respondidos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    inboxFilter === 'respondidos'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Respondidos ({conversations.filter(c => c.status === 'respondido').length})
                </button>
              </div>
            </div>

            {/* Channel Filters */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChannelFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    channelFilter === 'all'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setChannelFilter('linkedin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    channelFilter === 'linkedin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Linkedin size={14} />
                  LinkedIn
                </button>
                <button
                  onClick={() => setChannelFilter('email')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    channelFilter === 'email'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Mail size={14} />
                  Email
                </button>
                <button
                  onClick={() => setChannelFilter('whatsapp')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    channelFilter === 'whatsapp'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  No hay conversaciones
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const person = people.find(p => p.id === conv.personId);
                  if (!person) return null;

                  const lastMessage = conv.messages[conv.messages.length - 1];

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversationId === conv.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img
                            src={person.avatar}
                            alt={person.fullName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${getChannelColor(conv.channel)}`}>
                            {getChannelIcon(conv.channel, 12)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {person.fullName}
                            </h4>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTime(conv.lastMessage)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mb-1">{person.company}</p>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                            {lastMessage.from === 'user' ? 'Tú: ' : ''}
                            {lastMessage.content}
                          </p>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(conv.status)}
                            {conv.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Content - Conversation Detail */}
          {selectedConversation && selectedPerson ? (
            <div className="flex-1 flex">
              {/* Messages Area */}
              <div className="flex-1 flex flex-col">
                {/* Conversation Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={selectedPerson.avatar}
                          alt={selectedPerson.fullName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getChannelColor(selectedConversation.channel)}`}>
                          {getChannelIcon(selectedConversation.channel, 14)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {selectedPerson.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedPerson.title}</p>
                        <p className="text-sm text-gray-500">{selectedPerson.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedConversation.status)}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <div className="max-w-3xl mx-auto space-y-6">
                    {selectedConversation.messages.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm py-8">
                        No hay mensajes aún
                      </div>
                    ) : (
                      groupMessagesByDate(selectedConversation.messages).map((group, groupIndex) => (
                        <div key={groupIndex}>
                          {/* Date Separator */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-white border border-gray-200 rounded-full px-3 py-1">
                              <span className="text-xs text-gray-600 font-medium">{group.date}</span>
                            </div>
                          </div>

                          {/* Messages */}
                          <div className="space-y-3">
                            {group.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-md ${
                                    msg.from === 'user'
                                      ? 'bg-primary text-white'
                                      : 'bg-white border border-gray-200 text-gray-900'
                                  } rounded-lg p-4 shadow-sm`}
                                >
                                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs ${msg.from === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                                      {msg.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {msg.from === 'user' && (
                                      <CheckCheck size={14} className="text-white/70" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Responder por:</span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getChannelColor(selectedConversation.channel)}`}>
                          {getChannelIcon(selectedConversation.channel, 12)}
                          {selectedConversation.channel === 'linkedin' && 'LinkedIn'}
                          {selectedConversation.channel === 'email' && 'Email'}
                          {selectedConversation.channel === 'whatsapp' && 'WhatsApp'}
                        </span>
                      </div>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Escribe tu mensaje..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={insertTemplate}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FileText size={16} />
                      Usar plantilla
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                      Enviar
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Contact Info */}
              <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Información del contacto</h3>

                  <div className="space-y-4">
                    {/* Avatar and Name */}
                    <div className="text-center pb-4 border-b border-gray-200">
                      <img
                        src={selectedPerson.avatar}
                        alt={selectedPerson.fullName}
                        className="w-20 h-20 rounded-full mx-auto mb-3"
                      />
                      <h4 className="text-base font-medium text-gray-900">{selectedPerson.fullName}</h4>
                      <p className="text-sm text-gray-600">{selectedPerson.title}</p>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 size={16} className="text-gray-400" />
                        <span className="text-gray-600">Empresa</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium pl-6">{selectedPerson.company}</p>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase size={16} className="text-gray-400" />
                        <span className="text-gray-600">Cargo</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium pl-6">{selectedPerson.title}</p>
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Tag size={16} className="text-gray-400" />
                        <span className="text-gray-600">Departamento</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium pl-6">{selectedPerson.department}</p>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-600">Ubicación</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium pl-6">{selectedPerson.country}</p>
                    </div>

                    {/* Channel */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageCircle size={16} className="text-gray-400" />
                        <span className="text-gray-600">Canal preferido</span>
                      </div>
                      <div className="pl-6">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${getChannelColor(selectedConversation.channel)}`}>
                          {getChannelIcon(selectedConversation.channel, 12)}
                          {selectedConversation.channel === 'linkedin' && 'LinkedIn'}
                          {selectedConversation.channel === 'email' && 'Email'}
                          {selectedConversation.channel === 'whatsapp' && 'WhatsApp'}
                        </span>
                      </div>
                    </div>

                    {/* CRM Stage */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-600">Etapa del CRM</span>
                      </div>
                      <div className="pl-6">
                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                          {selectedPerson.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 space-y-2">
                      <Link
                        href={`/crm?personId=${selectedPerson.id}`}
                        className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                      >
                        Ver en CRM
                      </Link>
                      <Link
                        href={`/personas/${selectedPerson.id}`}
                        className="block w-full text-center px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        Ver perfil completo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una conversación</h3>
                <p className="text-sm text-gray-500">
                  Elige una conversación de la lista para ver los mensajes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
