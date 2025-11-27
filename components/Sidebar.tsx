'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Building2,
  ListPlus,
  Database,
  Mail,
  Calendar,
  MessageSquare,
  Briefcase,
  CheckSquare,
  Workflow,
  BarChart3,
  MousePointerClick,
  Settings,
  Zap,
  Send,
  TrendingUp,
  GraduationCap,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: 'PROSPECT & ENRICH',
    items: [
      { name: 'Personas', href: '/personas', icon: <Users size={18} /> },
      { name: 'Empresas', href: '/empresas', icon: <Building2 size={18} /> },
      { name: 'Listas', href: '/listas', icon: <ListPlus size={18} /> },
      { name: 'Enriquecimiento', href: '/enriquecimiento', icon: <Database size={18} /> },
    ],
  },
  {
    title: 'ENGAGE',
    items: [
      { name: 'Secuencias', href: '/secuencias', icon: <Send size={18} /> },
      { name: 'Emails', href: '/emails', icon: <Mail size={18} /> },
      { name: 'Warm-up Social', href: '/warm-up', icon: <Sparkles size={18} /> },
    ],
  },
  {
    title: 'WIN DEALS',
    items: [
      { name: 'Reuniones', href: '/reuniones', icon: <Calendar size={18} /> },
      { name: 'Conversaciones', href: '/conversaciones', icon: <MessageSquare size={18} /> },
      { name: 'Oportunidades', href: '/oportunidades', icon: <TrendingUp size={18} /> },
      { name: 'CRM Visual', href: '/crm', icon: <Briefcase size={18} /> },
    ],
  },
  {
    title: 'TOOLS & AUTOMATION',
    items: [
      { name: 'Tareas', href: '/tareas', icon: <CheckSquare size={18} /> },
      { name: 'Workflows', href: '/workflows', icon: <Workflow size={18} /> },
      { name: 'Analíticas', href: '/analiticas', icon: <BarChart3 size={18} /> },
    ],
  },
  {
    title: 'INBOUND',
    items: [
      { name: 'Visitantes del sitio', href: '/visitantes', icon: <MousePointerClick size={18} /> },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-border flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-border">
        <Link href="/" className="flex items-center gap-2">
          <ArrowRightLeft className="text-primary" size={24} />
          <span className="font-semibold text-lg text-gray-dark">End2End</span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-gray-400 tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal transition-all
                        ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-gray-text hover:bg-gray-light hover:text-gray-dark'
                        }
                      `}
                    >
                      <span className={isActive ? 'text-primary' : 'text-gray-400'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Academy */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 tracking-wider mb-2">
            APRENDER
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/academy"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal text-gray-text hover:bg-gray-light hover:text-gray-dark transition-all"
              >
                <span className="text-gray-400">
                  <GraduationCap size={18} />
                </span>
                <span>Academy</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Settings */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 tracking-wider mb-2">
            CONFIGURACIÓN
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/configuracion"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal text-gray-text hover:bg-gray-light hover:text-gray-dark transition-all"
              >
                <span className="text-gray-400">
                  <Settings size={18} />
                </span>
                <span>Ajustes</span>
              </Link>
            </li>
            <li>
              <Link
                href="/integraciones"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal text-gray-text hover:bg-gray-light hover:text-gray-dark transition-all"
              >
                <span className="text-gray-400">
                  <Zap size={18} />
                </span>
                <span>Integraciones</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Upgrade Button */}
      <div className="px-3 py-4 border-t border-gray-border">
        <button className="w-full bg-warning hover:bg-warning/90 text-gray-dark font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">
          ⚡ Actualizar plan
        </button>
      </div>
    </aside>
  );
}
