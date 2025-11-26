'use client';

import AppLayout from '@/components/AppLayout';
import { BookOpen, Video, FileText, MessageCircle, Trophy, Clock, Users } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'guide';
  duration: string;
  category: 'getting-started' | 'best-practices' | 'advanced';
  popular: boolean;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Cómo escribir mensajes que convierten',
    description: 'Aprende las mejores técnicas de copywriting para outbound en LATAM',
    type: 'video',
    duration: '12 min',
    category: 'best-practices',
    popular: true,
  },
  {
    id: '2',
    title: 'Evitar bloqueos en LinkedIn',
    description: 'Guía completa para mantener tu cuenta segura mientras haces outreach',
    type: 'guide',
    duration: '8 min',
    category: 'best-practices',
    popular: true,
  },
  {
    id: '3',
    title: 'Primeros pasos con LeadFlow',
    description: 'Tutorial paso a paso para configurar tu cuenta y lanzar tu primera campaña',
    type: 'video',
    duration: '15 min',
    category: 'getting-started',
    popular: false,
  },
  {
    id: '4',
    title: 'Mensajes que funcionan en LATAM',
    description: 'Ejemplos reales de mensajes con alta tasa de respuesta en diferentes industrias',
    type: 'article',
    duration: '10 min',
    category: 'best-practices',
    popular: true,
  },
  {
    id: '5',
    title: 'Construyendo secuencias multicanal efectivas',
    description: 'Estrategias avanzadas para combinar LinkedIn, email y WhatsApp',
    type: 'guide',
    duration: '20 min',
    category: 'advanced',
    popular: false,
  },
  {
    id: '6',
    title: 'Definir tu ICP (Cliente Ideal)',
    description: 'Cómo identificar y segmentar tu audiencia objetivo',
    type: 'video',
    duration: '10 min',
    category: 'getting-started',
    popular: false,
  },
];

export default function AcademyPage() {
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return <Video size={18} className="text-purple-500" />;
      case 'article':
        return <FileText size={18} className="text-blue-500" />;
      case 'guide':
        return <BookOpen size={18} className="text-green-500" />;
    }
  };

  const getCategoryName = (category: Resource['category']) => {
    switch (category) {
      case 'getting-started':
        return 'Primeros pasos';
      case 'best-practices':
        return 'Mejores prácticas';
      case 'advanced':
        return 'Avanzado';
    }
  };

  const popularResources = resources.filter(r => r.popular);
  const allResources = resources;

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gray-light overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-2">LeadFlow Academy</h1>
            <p className="text-blue-100 text-lg">
              Aprende a generar y convertir leads como un profesional
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Video className="text-purple-600" size={20} />
                  </div>
                  <h3 className="font-medium text-gray-dark">Videos</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-dark">
                  {resources.filter(r => r.type === 'video').length}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <BookOpen className="text-green-600" size={20} />
                  </div>
                  <h3 className="font-medium text-gray-dark">Guías</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-dark">
                  {resources.filter(r => r.type === 'guide').length}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <h3 className="font-medium text-gray-dark">Artículos</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-dark">
                  {resources.filter(r => r.type === 'article').length}
                </p>
              </div>
            </div>

            {/* Popular Resources */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-warning" size={24} />
                <h2 className="text-xl font-medium text-gray-dark">Más populares</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {popularResources.map(resource => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg border border-gray-border p-6 card-hover cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-light rounded-lg group-hover:bg-primary/10 transition-colors">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base font-medium text-gray-dark group-hover:text-primary transition-colors">
                            {resource.title}
                          </h3>
                          <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2">
                            Popular
                          </span>
                        </div>
                        <p className="text-sm text-gray-text mb-3">
                          {resource.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{resource.duration}</span>
                          </div>
                          <span>•</span>
                          <span>{getCategoryName(resource.category)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Resources */}
            <div>
              <h2 className="text-xl font-medium text-gray-dark mb-4">Todos los recursos</h2>
              <div className="bg-white rounded-lg border border-gray-border divide-y divide-gray-border">
                {allResources.map(resource => (
                  <div
                    key={resource.id}
                    className="p-6 hover:bg-gray-light/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-light rounded-lg group-hover:bg-primary/10 transition-colors flex-shrink-0">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-dark group-hover:text-primary transition-colors mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-text">
                          {resource.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-gray-400 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{resource.duration}</span>
                        </div>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          {getCategoryName(resource.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Section */}
            <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-lg border border-primary/20 p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 text-5xl">
                  👥
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-primary" size={24} />
                    <h2 className="text-xl font-medium text-gray-dark">
                      Comunidad LeadFlow LATAM
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Únete a nuestra comunidad de +500 profesionales de ventas y marketing en LATAM.
                    Comparte experiencias, aprende de casos de éxito y haz networking.
                  </p>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                      <MessageCircle size={16} />
                      Unirse a la comunidad
                    </button>
                    <p className="text-sm text-gray-text">
                      <span className="font-semibold text-gray-dark">+50</span> miembros activos hoy
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Resources */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-border p-6">
                <h3 className="text-lg font-medium text-gray-dark mb-3">
                  📚 Documentación técnica
                </h3>
                <p className="text-sm text-gray-text mb-4">
                  Guías detalladas sobre todas las funcionalidades de la plataforma
                </p>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  Ver documentación →
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-border p-6">
                <h3 className="text-lg font-medium text-gray-dark mb-3">
                  💬 Soporte directo
                </h3>
                <p className="text-sm text-gray-text mb-4">
                  ¿Necesitas ayuda personalizada? Nuestro equipo está disponible
                </p>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  Contactar soporte →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
