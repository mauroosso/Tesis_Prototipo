'use client';

import AppLayout from '@/components/AppLayout';
import { TrendingUp, TrendingDown, Mail, Linkedin, MessageCircle, Calendar, Download, Sparkles } from 'lucide-react';

export default function AnaliticasPage() {
  const metrics = [
    { name: 'Emails enviados', value: '1,247', change: '+12%', trend: 'up', icon: Mail },
    { name: 'Tasa de apertura', value: '68%', change: '+5%', trend: 'up', icon: Mail },
    { name: 'Tasa de respuesta', value: '22%', change: '+8%', trend: 'up', icon: MessageCircle },
    { name: 'Reuniones agendadas', value: '34', change: '+18%', trend: 'up', icon: Calendar },
    { name: 'Conversiones', value: '12', change: '+25%', trend: 'up', icon: TrendingUp },
    { name: 'Canal más efectivo', value: 'LinkedIn', change: '45% respuesta', trend: 'up', icon: Linkedin },
  ];

  const channelPerformance = [
    { channel: 'LinkedIn', sent: 423, opened: 312, responses: 145, color: 'bg-blue-500' },
    { channel: 'Email', sent: 647, opened: 432, responses: 95, color: 'bg-purple-500' },
    { channel: 'WhatsApp', sent: 177, opened: 156, responses: 34, color: 'bg-green-500' },
  ];

  const bestTimes = [
    { day: 'Martes', time: '10:00 - 12:00', performance: '+22%' },
    { day: 'Miércoles', time: '14:00 - 16:00', performance: '+18%' },
    { day: 'Jueves', time: '09:00 - 11:00', performance: '+15%' },
  ];

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gray-light overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-border px-8 py-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-dark mb-1">Analíticas</h1>
              <p className="text-sm text-gray-text">
                Métricas y rendimiento de tus campañas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select className="border border-gray-border rounded-lg px-4 py-2 text-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Últimos 30 días</option>
                <option>Últimos 7 días</option>
                <option>Este mes</option>
                <option>Mes anterior</option>
              </select>
              <button className="flex items-center gap-2 border border-gray-border px-4 py-2 rounded-lg text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-border p-6 card-hover fade-in">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <metric.icon className="text-primary" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-success' : 'text-danger'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <h3 className="text-sm text-gray-text mb-1">{metric.name}</h3>
                <p className="text-3xl font-semibold text-gray-dark">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Channel Performance */}
          <div className="bg-white rounded-lg border border-gray-border p-6">
            <h2 className="text-lg font-medium text-gray-dark mb-6">
              Rendimiento por Canal
            </h2>
            <div className="space-y-6">
              {channelPerformance.map((channel, index) => {
                const openRate = Math.round((channel.opened / channel.sent) * 100);
                const responseRate = Math.round((channel.responses / channel.opened) * 100);

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-medium text-gray-dark">{channel.channel}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-text">
                        <span>Enviados: {channel.sent}</span>
                        <span>Apertura: {openRate}%</span>
                        <span className="text-primary font-medium">Respuesta: {responseRate}%</span>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-text w-20">Abiertos</span>
                        <div className="flex-1 h-3 bg-gray-light rounded-full overflow-hidden">
                          <div
                            className={`h-full ${channel.color} opacity-40 transition-all`}
                            style={{ width: `${openRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-dark w-12 text-right">
                          {openRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-text w-20">Respuestas</span>
                        <div className="flex-1 h-3 bg-gray-light rounded-full overflow-hidden">
                          <div
                            className={`h-full ${channel.color} transition-all`}
                            style={{ width: `${responseRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-dark w-12 text-right">
                          {responseRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Best Times */}
            <div className="bg-white rounded-lg border border-gray-border p-6">
              <h2 className="text-lg font-medium text-gray-dark mb-4">
                Mejores horarios para enviar
              </h2>
              <div className="space-y-3">
                {bestTimes.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-light rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-dark">{time.day}</p>
                      <p className="text-xs text-gray-text">{time.time}</p>
                    </div>
                    <span className="text-sm font-semibold text-success">
                      {time.performance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-primary/10 to-success/10 rounded-lg border border-primary/20 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg">
                  <Sparkles className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-dark mb-1">
                    Insights con IA
                  </h2>
                  <p className="text-sm text-gray-text">
                    Recomendaciones personalizadas para mejorar tus resultados
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/80 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    💡 Los martes de 10 a 12 tus mensajes rinden <span className="font-semibold text-primary">22% mejor</span>.
                    Considerá programar tus envíos más importantes en este horario.
                  </p>
                </div>

                <div className="bg-white/80 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    📊 LinkedIn está generando <span className="font-semibold text-primary">45% de respuestas positivas</span>.
                    Te recomendamos aumentar el volumen en este canal.
                  </p>
                </div>

                <div className="bg-white/80 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    ⏰ Tus prospectos en Argentina responden mejor por la tarde,
                    mientras que los de México prefieren las mañanas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg border border-gray-border p-6">
            <h2 className="text-lg font-medium text-gray-dark mb-6">
              Embudo de Conversión
            </h2>
            <div className="space-y-4">
              {[
                { stage: 'Contactos totales', value: 1247, percent: 100, color: 'bg-blue-500' },
                { stage: 'Mensajes abiertos', value: 847, percent: 68, color: 'bg-purple-500' },
                { stage: 'Respuestas recibidas', value: 274, percent: 22, color: 'bg-orange-500' },
                { stage: 'Reuniones agendadas', value: 34, percent: 2.7, color: 'bg-green-500' },
                { stage: 'Clientes convertidos', value: 12, percent: 1, color: 'bg-success' },
              ].map((stage, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-dark">{stage.stage}</span>
                    <span className="text-sm text-gray-text">{stage.value} ({stage.percent}%)</span>
                  </div>
                  <div className="h-10 bg-gray-light rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${stage.color} flex items-center justify-center text-white text-sm font-medium transition-all duration-500`}
                      style={{ width: `${stage.percent}%` }}
                    >
                      {stage.percent > 10 && `${stage.percent}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export & Share */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-border p-6">
            <div>
              <h3 className="text-base font-medium text-gray-dark mb-1">
                Exportar reporte completo
              </h3>
              <p className="text-sm text-gray-text">
                Descarga un PDF con todas las métricas y análisis del período seleccionado
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="border border-gray-border px-4 py-2 rounded-lg text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">
                Compartir
              </button>
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                <Download size={16} />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
