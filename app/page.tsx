'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { CheckCircle2, XCircle, Target, Zap, TrendingUp } from 'lucide-react';

export default function Home() {
  const [showSetup, setShowSetup] = useState(true);
  const [activeTab, setActiveTab] = useState<'setup' | 'recommendations'>('setup');

  const setupSteps = [
    { name: 'Conectar email', completed: true },
    { name: 'Conectar LinkedIn', completed: true },
    { name: 'Definir perfil de cliente ideal', completed: false },
    { name: 'Importar primeros contactos', completed: false },
    { name: 'Crear primera secuencia', completed: false },
  ];

  const completedSteps = setupSteps.filter(step => step.completed).length;
  const totalSteps = setupSteps.length;
  const progressPercent = (completedSteps / totalSteps) * 100;

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-dark mb-2">
            Bienvenido, Mauricio 👋
          </h1>
          <p className="text-gray-text">
            Tu centro de comando para generación de leads B2B
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-gray-border">
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'setup'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-text hover:text-gray-dark'
            }`}
          >
            Configuración inicial
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'recommendations'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-text hover:text-gray-dark'
            }`}
          >
            Recomendaciones
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'setup' && showSetup && (
          <div className="space-y-6">
            {/* Setup Progress Card */}
            <div className="bg-white rounded-lg border border-gray-border p-6 card-hover fade-in">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-dark mb-1">
                    Configuración inicial
                  </h2>
                  <p className="text-sm text-gray-text">
                    {completedSteps} de {totalSteps} pasos completados
                  </p>
                </div>
                <button
                  onClick={() => setShowSetup(false)}
                  className="text-sm text-gray-text hover:text-gray-dark transition-colors"
                >
                  Ocultar
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-gray-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {step.completed ? (
                      <CheckCircle2 className="text-success flex-shrink-0" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        step.completed ? 'text-gray-400 line-through' : 'text-gray-dark'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">
                Continuar configuración
              </button>
            </div>

            {/* No Data Yet Card */}
            <div className="bg-white rounded-lg border border-gray-border p-8 text-center fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-light rounded-full mb-4">
                <XCircle className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-dark mb-2">
                No hay datos disponibles todavía
              </h3>
              <p className="text-sm text-gray-text max-w-md mx-auto">
                Completa la configuración inicial para empezar a ver información y métricas de tus leads.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {/* AI Flow Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-lg border border-gray-border p-6 card-hover fade-in group cursor-pointer">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                  <Target className="text-primary" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-dark mb-2">
                  Empresas investigando tu categoría
                </h3>
                <p className="text-sm text-gray-text mb-4">
                  Detecta empresas que buscan soluciones como la tuya y activa outreach inteligente con IA.
                </p>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
                  Activar flujo IA
                  <Zap size={16} />
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-lg border border-gray-border p-6 card-hover fade-in group cursor-pointer">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mb-4 group-hover:bg-success/20 transition-colors">
                  <TrendingUp className="text-success" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-dark mb-2">
                  Convertir clientes ideales
                </h3>
                <p className="text-sm text-gray-text mb-4">
                  Crea secuencias multicanal personalizadas con IA para tu ICP (perfil de cliente ideal).
                </p>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
                  Crear secuencia IA
                  <Zap size={16} />
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-lg border border-gray-border p-6 card-hover fade-in group cursor-pointer">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg mb-4 group-hover:bg-warning/20 transition-colors">
                  <Zap className="text-warning" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-dark mb-2">
                  Convertir clientes de la competencia
                </h3>
                <p className="text-sm text-gray-text mb-4">
                  Mensajes inteligentes para contactos que usan herramientas de tu competencia.
                </p>
                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
                  Activar campaña
                  <Zap size={16} />
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6 fade-in">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-lg">
                    💡
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-dark mb-1">
                    Consejo del día
                  </h3>
                  <p className="text-sm text-gray-text">
                    Los mensajes enviados los martes entre las 10:00 y 12:00 tienen un <span className="font-medium text-primary">22% más de tasa de respuesta</span> en LATAM.
                    Configura tus secuencias para aprovechar este horario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
