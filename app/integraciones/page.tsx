'use client';

import AppLayout from '@/components/AppLayout';
import { CheckCircle, AlertCircle, Circle, ExternalLink } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'connected' | 'error' | 'disconnected';
  category: 'email' | 'social' | 'crm' | 'calendar' | 'messaging';
  lastSync?: string;
}

const integrations: Integration[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Conecta tu cuenta de LinkedIn para enviar mensajes y conexiones',
    logo: '🔗',
    status: 'connected',
    category: 'social',
    lastSync: 'Hace 5 minutos',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Sincroniza tus emails y envía campañas desde tu cuenta de Gmail',
    logo: '📧',
    status: 'connected',
    category: 'email',
    lastSync: 'Hace 2 horas',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Envía mensajes de WhatsApp a tus contactos de forma automatizada',
    logo: '💬',
    status: 'error',
    category: 'messaging',
    lastSync: 'Error de sincronización',
  },
  {
    id: 'gcal',
    name: 'Google Calendar',
    description: 'Agenda reuniones automáticamente y sincroniza tu calendario',
    logo: '📅',
    status: 'connected',
    category: 'calendar',
    lastSync: 'Hace 1 hora',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sincroniza contactos y oportunidades con tu CRM de HubSpot',
    logo: '🎯',
    status: 'disconnected',
    category: 'crm',
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    description: 'Integra tus leads y oportunidades con Zoho CRM',
    logo: '📊',
    status: 'disconnected',
    category: 'crm',
  },
  {
    id: 'outlook',
    name: 'Outlook',
    description: 'Conecta tu cuenta de Outlook para enviar campañas de email',
    logo: '📨',
    status: 'disconnected',
    category: 'email',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Recibe notificaciones de nuevas respuestas en tu workspace',
    logo: '💬',
    status: 'disconnected',
    category: 'messaging',
  },
];

export default function IntegracionesPage() {
  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="text-success" size={20} />;
      case 'error':
        return <AlertCircle className="text-warning" size={20} />;
      case 'disconnected':
        return <Circle className="text-gray-300" size={20} />;
    }
  };

  const getStatusText = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return { text: 'Conectado', className: 'text-success bg-success/10' };
      case 'error':
        return { text: 'Error', className: 'text-warning bg-warning/10' };
      case 'disconnected':
        return { text: 'Desconectado', className: 'text-gray-500 bg-gray-100' };
    }
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  const categoryNames: Record<string, string> = {
    email: 'Email',
    social: 'Redes Sociales',
    crm: 'CRM',
    calendar: 'Calendario',
    messaging: 'Mensajería',
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gray-light overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-border px-8 py-6">
          <h1 className="text-2xl font-light text-gray-dark mb-1">Integraciones</h1>
          <p className="text-sm text-gray-text">
            Conecta tus herramientas favoritas con LeadFlow
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-text mb-1">Conectadas</p>
                  <p className="text-3xl font-semibold text-success">
                    {integrations.filter(i => i.status === 'connected').length}
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="text-success" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-text mb-1">Con errores</p>
                  <p className="text-3xl font-semibold text-warning">
                    {integrations.filter(i => i.status === 'error').length}
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <AlertCircle className="text-warning" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-text mb-1">Disponibles</p>
                  <p className="text-3xl font-semibold text-gray-dark">
                    {integrations.filter(i => i.status === 'disconnected').length}
                  </p>
                </div>
                <div className="p-3 bg-gray-light rounded-lg">
                  <Circle className="text-gray-400" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Integrations by Category */}
          {Object.entries(groupedIntegrations).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-medium text-gray-dark mb-4">
                {categoryNames[category]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(integration => {
                  const statusInfo = getStatusText(integration.status);

                  return (
                    <div
                      key={integration.id}
                      className="bg-white rounded-lg border border-gray-border p-6 card-hover"
                    >
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="w-12 h-12 rounded-lg bg-gray-light flex items-center justify-center text-2xl flex-shrink-0">
                          {integration.logo}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base font-medium text-gray-dark">
                              {integration.name}
                            </h3>
                            {getStatusIcon(integration.status)}
                          </div>
                          <p className="text-sm text-gray-text mb-3">
                            {integration.description}
                          </p>

                          {/* Status & Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.className}`}>
                                {statusInfo.text}
                              </span>
                              {integration.lastSync && (
                                <span className="text-xs text-gray-400">
                                  {integration.lastSync}
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            {integration.status === 'connected' && (
                              <div className="flex items-center gap-2">
                                <button className="text-xs text-gray-text hover:text-gray-dark transition-colors">
                                  Configurar
                                </button>
                                <button className="text-xs text-danger hover:text-red-700 transition-colors">
                                  Desconectar
                                </button>
                              </div>
                            )}

                            {integration.status === 'error' && (
                              <button className="text-xs font-medium text-warning hover:text-orange-700 transition-colors">
                                Reconectar
                              </button>
                            )}

                            {integration.status === 'disconnected' && (
                              <button className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                                Conectar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Help Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                🔌
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-dark mb-2">
                  ¿Necesitas ayuda con las integraciones?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Visita nuestra documentación para guías paso a paso sobre cómo conectar cada herramienta.
                  También puedes contactar a nuestro equipo de soporte.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-dark px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ver documentación
                    <ExternalLink size={14} />
                  </a>
                  <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                    Contactar soporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
