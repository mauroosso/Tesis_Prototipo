'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useCRM } from '@/contexts/CRMContext';
import { people } from '@/data/people';
import Link from 'next/link';
import {
  Calendar, Video, Clock, ExternalLink,
  CheckCircle, XCircle, Filter, Plus
} from 'lucide-react';

export default function ReunionesPage() {
  const { meetings, leads } = useCRM();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  const filteredMeetings = filter === 'all'
    ? meetings
    : meetings.filter(m => m.status === filter);

  const enrichedMeetings = filteredMeetings.map(meeting => {
    const lead = leads.find(l => l.id === meeting.leadId);
    const person = lead ? people.find(p => p.id === lead.personId) : null;
    return { ...meeting, lead, person };
  });

  const upcomingMeetings = enrichedMeetings.filter(m =>
    m.status === 'scheduled' && new Date(m.date) >= new Date()
  );

  const pastMeetings = enrichedMeetings.filter(m =>
    m.status === 'completed' || new Date(m.date) < new Date()
  );

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Reuniones</h1>
              <p className="text-sm text-gray-500">Gestiona tus reuniones con prospectos</p>
            </div>
            <Link
              href="/conversaciones"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Agendar reunión
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div>
              <div className="text-2xl font-semibold text-gray-900">{upcomingMeetings.length}</div>
              <div className="text-xs text-gray-500">Próximas</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-success">{pastMeetings.filter(m => m.status === 'completed').length}</div>
              <div className="text-xs text-gray-500">Completadas</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-400">{meetings.filter(m => m.status === 'cancelled').length}</div>
              <div className="text-xs text-gray-500">Canceladas</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Upcoming Meetings */}
            {upcomingMeetings.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Próximas Reuniones</h2>
                <div className="space-y-3">
                  {upcomingMeetings.map(meeting => {
                    if (!meeting.person) return null;
                    return (
                      <div
                        key={meeting.id}
                        className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={meeting.person.avatar}
                              alt={meeting.person.fullName}
                              className="w-12 h-12 rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  {meeting.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {meeting.person.fullName} • {meeting.person.company}
                                </p>
                              </div>
                              <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-xs font-medium">
                                Programada
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span>
                                  {new Date(meeting.date).toLocaleDateString('es-AR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <span>{meeting.time}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={meeting.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Video size={16} />
                                Unirse a la reunión
                                <ExternalLink size={14} />
                              </a>
                              <Link
                                href="/crm"
                                className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 transition-colors"
                              >
                                Ver en CRM
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Meetings */}
            {pastMeetings.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Reuniones Pasadas</h2>
                <div className="space-y-3">
                  {pastMeetings.map(meeting => {
                    if (!meeting.person) return null;
                    return (
                      <div
                        key={meeting.id}
                        className="bg-white border border-gray-200 rounded-lg p-5 opacity-75"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={meeting.person.avatar}
                              alt={meeting.person.fullName}
                              className="w-12 h-12 rounded-full grayscale"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  {meeting.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {meeting.person.fullName} • {meeting.person.company}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                meeting.status === 'completed'
                                  ? 'bg-gray-100 text-gray-600 border border-gray-200'
                                  : 'bg-red-50 text-red-600 border border-red-200'
                              }`}>
                                {meeting.status === 'completed' ? 'Completada' : 'Cancelada'}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span>
                                  {new Date(meeting.date).toLocaleDateString('es-AR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <span>{meeting.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {meetings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <Calendar size={48} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay reuniones programadas
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Comienza agendando reuniones desde las conversaciones activas
                </p>
                <Link
                  href="/conversaciones"
                  className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Ir a Conversaciones
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
