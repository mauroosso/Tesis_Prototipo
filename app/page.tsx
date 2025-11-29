'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useLists } from '@/contexts/ListsContext';
import { useSequences } from '@/contexts/SequencesContext';
import { useCRM } from '@/contexts/CRMContext';
import {
  Building2,
  Users,
  List,
  Heart,
  Zap,
  MessageSquare,
  FolderKanban,
  BarChart3,
  CheckCircle,
  Briefcase,
  Workflow,
  ClipboardList,
  Upload,
  GraduationCap,
} from 'lucide-react';

interface FlowCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  buttonText: string;
  route: string;
  order: number;
}

interface SecondaryCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  route: string;
}

export default function Home() {
  const router = useRouter();
  const { lists } = useLists();
  const { sequences } = useSequences();
  const { leads } = useCRM();

  // Calculate user progress
  const userProgress = useMemo(() => {
    const hasLists = lists.length > 0;
    const hasActiveSequences = sequences.some(s => s.status === 'activa');
    const hasWarmupActions = leads.some(lead => lead.warmupActions && lead.warmupActions.length > 0);
    const hasConversations = leads.some(lead => lead.status === 'respondio' || lead.status === 'interesado');

    return {
      hasLists,
      hasActiveSequences,
      hasWarmupActions,
      hasConversations,
      activeSequencesCount: sequences.filter(s => s.status === 'activa').length,
      warmupActionsCount: leads.reduce((acc, lead) => acc + (lead.warmupActions?.length || 0), 0),
    };
  }, [lists, sequences, leads]);

  // Main flow cards (6 essential steps)
  const mainFlowCards: FlowCard[] = [
    {
      id: 'discover',
      title: 'Descubrir empresas ideales',
      description: 'Encontrá empresas por industria, país, tamaño y señales clave para tu ICP',
      icon: <Building2 size={32} />,
      bgColor: '#EEF2FF',
      iconColor: '#6366F1',
      buttonText: 'Buscar empresas',
      route: '/empresas',
      order: 1,
    },
    {
      id: 'employees',
      title: 'Ver empleados y elegir tomadores de decisión',
      description: 'Accedé a los decisores dentro de cada empresa que te interesa',
      icon: <Users size={32} />,
      bgColor: '#ECFDF5',
      iconColor: '#10B981',
      buttonText: 'Ver empleados',
      route: '/personas',
      order: 2,
    },
    {
      id: 'lists',
      title: 'Crear listas personalizadas',
      description: 'Armá listas de empresas o decisores segmentadas por nicho',
      icon: <List size={32} />,
      bgColor: '#F3E8FF',
      iconColor: '#A855F7',
      buttonText: 'Crear lista',
      route: '/listas',
      order: 3,
    },
    {
      id: 'warmup',
      title: 'Hacer warm-up social',
      description: 'Interactuá con prospectos antes de escribirles para aumentar tasa de respuesta',
      icon: <Heart size={32} />,
      bgColor: '#FFF7ED',
      iconColor: '#F59E0B',
      buttonText: 'Ir a warm-up',
      route: '/warm-up',
      order: 4,
    },
    {
      id: 'sequences',
      title: 'Automatizar secuencias',
      description: 'Creá secuencias de mensajes para LinkedIn, email y WhatsApp',
      icon: <Zap size={32} />,
      bgColor: '#FDF2F8',
      iconColor: '#EC4899',
      buttonText: 'Crear secuencia',
      route: '/secuencias',
      order: 5,
    },
    {
      id: 'conversations',
      title: 'Gestionar conversaciones y cerrar reuniones',
      description: 'Respondé mensajes, agendá reuniones y gestioná tu pipeline desde un solo lugar',
      icon: <MessageSquare size={32} />,
      bgColor: '#ECFEFF',
      iconColor: '#06B6D4',
      buttonText: 'Abrir conversaciones',
      route: '/conversaciones',
      order: 6,
    },
  ];

  // Secondary tools cards
  const secondaryCards: SecondaryCard[] = [
    {
      id: 'my-lists',
      title: 'Ver mis listas',
      description: 'Accedé a todas tus listas guardadas',
      icon: <FolderKanban size={24} />,
      bgColor: '#F0F9FF',
      iconColor: '#0284C7',
      route: '/listas',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Métricas de rendimiento y conversión',
      icon: <BarChart3 size={24} />,
      bgColor: '#F0FDF4',
      iconColor: '#16A34A',
      route: '/analytics',
    },
    {
      id: 'verify-emails',
      title: 'Verificar emails',
      description: 'Validá direcciones de email antes de contactar',
      icon: <CheckCircle size={24} />,
      bgColor: '#FEF3C7',
      iconColor: '#CA8A04',
      route: '/verificar-emails',
    },
    {
      id: 'crm',
      title: 'CRM Visual',
      description: 'Gestioná tu pipeline y leads',
      icon: <Briefcase size={24} />,
      bgColor: '#FCE7F3',
      iconColor: '#BE185D',
      route: '/crm',
    },
    {
      id: 'workflows',
      title: 'Workflows',
      description: 'Automatizaciones avanzadas',
      icon: <Workflow size={24} />,
      bgColor: '#EDE9FE',
      iconColor: '#7C3AED',
      route: '/workflows',
    },
    {
      id: 'tasks',
      title: 'Tareas pendientes',
      description: 'Seguimiento de to-dos y recordatorios',
      icon: <ClipboardList size={24} />,
      bgColor: '#DBEAFE',
      iconColor: '#1D4ED8',
      route: '/tareas',
    },
    {
      id: 'import',
      title: 'Importar datos / Sales Navigator',
      description: 'Importá contactos desde CSV o LinkedIn',
      icon: <Upload size={24} />,
      bgColor: '#FEE2E2',
      iconColor: '#DC2626',
      route: '/importar',
    },
    {
      id: 'academy',
      title: 'Academia / Cómo usar END2END',
      description: 'Tutoriales y mejores prácticas',
      icon: <GraduationCap size={24} />,
      bgColor: '#FEF9C3',
      iconColor: '#CA8A04',
      route: '/academia',
    },
  ];

  // Determine which card should be highlighted
  const getRecommendedStep = (): string | null => {
    if (!userProgress.hasLists) return 'lists';
    if (!userProgress.hasWarmupActions) return 'warmup';
    if (!userProgress.hasActiveSequences) return 'sequences';
    if (!userProgress.hasConversations) return 'conversations';
    return null;
  };

  const recommendedStep = getRecommendedStep();

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Section 1: Welcome Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-light text-gray-800 mb-3">
            Hola, Mauricio 👋
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            Aquí tenés todo lo necesario para encontrar empresas ideales, calentar contactos y automatizar tu generación de reuniones en un solo lugar.
          </p>
        </div>

        {/* Microcopy Guide */}
        <div className="mb-10 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-800">Seguí el recorrido sugerido para generar tus primeras reuniones:</span> buscá empresas → elegí decisores → creá listas → hacé warm-up → enviá secuencias → respondé leads → agendá reuniones.
          </p>
        </div>

        {/* Section 2: Main Flow Cards (6 essential steps) */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tu flujo principal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFlowCards.map((card) => {
              const isRecommended = recommendedStep === card.id;
              const showSequenceBadge = card.id === 'sequences' && userProgress.activeSequencesCount > 0;
              const showWarmupBadge = card.id === 'warmup' && userProgress.warmupActionsCount > 0;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.route)}
                  className="relative bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
                  style={{
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {/* Recommended Badge */}
                  {isRecommended && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      Paso {card.order} recomendado
                    </div>
                  )}

                  {/* Active Badge */}
                  {showSequenceBadge && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {userProgress.activeSequencesCount} activa{userProgress.activeSequencesCount > 1 ? 's' : ''}
                    </div>
                  )}

                  {showWarmupBadge && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {userProgress.warmupActionsCount} acciones
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-200 group-hover:scale-110"
                    style={{ backgroundColor: card.bgColor, color: card.iconColor }}
                  >
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed min-h-[40px]">
                    {card.description}
                  </p>

                  {/* Button */}
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {card.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Secondary Tools */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Acciones avanzadas / Herramientas adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondaryCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.route)}
                className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md group"
                style={{
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all duration-200 group-hover:scale-110"
                  style={{ backgroundColor: card.bgColor, color: card.iconColor }}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-tight">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
