'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { people } from '@/data/people';
import { Eye, UserPlus, ThumbsUp, MessageCircle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface WarmupTask {
  id: string;
  type: 'visitar' | 'seguir' | 'reaccionar' | 'comentar';
  person: {
    name: string;
    title: string;
    company: string;
    avatar: string;
    linkedIn: string;
  };
  post?: {
    preview: string;
    timeAgo: string;
  };
  suggestedComment?: string;
  completed: boolean;
}

export default function WarmupSocialPage() {
  // Generate warm-up tasks from people data
  const generateTasks = (): WarmupTask[] => {
    const warmupPeople = people.filter(p => p.status === 'warm-up' || p.status === 'nuevo').slice(0, 12);
    const taskTypes: WarmupTask['type'][] = ['visitar', 'seguir', 'reaccionar', 'comentar'];

    return warmupPeople.map((person, index) => ({
      id: `task-${index}`,
      type: taskTypes[index % taskTypes.length],
      person: {
        name: person.fullName,
        title: person.title,
        company: person.company,
        avatar: person.avatar,
        linkedIn: person.linkedIn,
      },
      post: index % 4 === 3 ? {
        preview: 'Compartí algunos aprendizajes sobre cómo escalamos nuestro equipo de ventas en LATAM...',
        timeAgo: 'hace 2 horas',
      } : undefined,
      suggestedComment: index % 4 === 3 ? '¡Excelente contenido! Me resuena especialmente lo que mencionas sobre...' : undefined,
      completed: false,
    }));
  };

  const [tasks, setTasks] = useState<WarmupTask[]>(generateTasks());
  const [showAISuggestion, setShowAISuggestion] = useState(false);

  const markAsCompleted = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  const getTaskIcon = (type: WarmupTask['type']) => {
    switch (type) {
      case 'visitar':
        return <Eye size={18} className="text-blue-500" />;
      case 'seguir':
        return <UserPlus size={18} className="text-purple-500" />;
      case 'reaccionar':
        return <ThumbsUp size={18} className="text-green-500" />;
      case 'comentar':
        return <MessageCircle size={18} className="text-orange-500" />;
    }
  };

  const getTaskAction = (type: WarmupTask['type']) => {
    switch (type) {
      case 'visitar':
        return 'Visitar perfil de';
      case 'seguir':
        return 'Seguir a';
      case 'reaccionar':
        return 'Reaccionar a publicación de';
      case 'comentar':
        return 'Comentar publicación de';
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = (completedTasks / totalTasks) * 100;

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gray-light">
        {/* Header */}
        <div className="bg-white border-b border-gray-border px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-dark mb-1">Warm-up Social</h1>
              <p className="text-sm text-gray-text">
                Calienta tus prospectos antes del primer mensaje
              </p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              <Sparkles size={16} />
              Generar más tareas con IA
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-lg border border-gray-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-dark">Progreso de hoy</h2>
                <span className="text-sm text-gray-text">
                  {completedTasks} de {totalTasks} completadas
                </span>
              </div>
              <div className="h-3 bg-gray-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    💡
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-dark mb-2">
                    ¿Por qué hacer warm-up?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Los contactos que interactúan contigo antes de recibir un mensaje directo tienen <span className="font-semibold text-primary">4x más probabilidad</span> de responder positivamente.
                    El warm-up social es clave para romper el hielo de forma natural.
                  </p>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg border border-gray-border p-5 transition-all ${
                    task.completed ? 'opacity-50' : 'card-hover'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Task Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {task.completed ? (
                        <CheckCircle className="text-success" size={24} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>

                    {/* Task Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={task.person.avatar}
                          alt={task.person.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getTaskIcon(task.type)}
                            <span className="text-sm font-medium text-gray-dark">
                              {getTaskAction(task.type)}
                            </span>
                          </div>
                          <h4 className="text-base font-medium text-gray-dark">
                            {task.person.name}
                          </h4>
                          <p className="text-sm text-gray-text">
                            {task.person.title} en {task.person.company}
                          </p>
                        </div>
                      </div>

                      {/* Post Preview for Comment Tasks */}
                      {task.post && (
                        <div className="bg-gray-light rounded-lg p-4 mb-3">
                          <p className="text-sm text-gray-600 mb-2">
                            {task.post.preview}
                          </p>
                          <p className="text-xs text-gray-400">{task.post.timeAgo}</p>
                        </div>
                      )}

                      {/* AI Suggested Comment */}
                      {task.suggestedComment && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-3">
                          <div className="flex items-start gap-2 mb-2">
                            <Sparkles className="text-primary flex-shrink-0 mt-0.5" size={16} />
                            <span className="text-xs font-medium text-primary">
                              Comentario sugerido por IA
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 italic">
                            "{task.suggestedComment}"
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {!task.completed && (
                          <>
                            <a
                              href={`https://${task.person.linkedIn}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Ir a LinkedIn
                              <ArrowRight size={16} />
                            </a>
                            <button
                              onClick={() => markAsCompleted(task.id)}
                              className="text-sm text-gray-text hover:text-gray-dark transition-colors"
                            >
                              Marcar como completada
                            </button>
                          </>
                        )}
                        {task.completed && (
                          <span className="text-sm text-success font-medium">
                            ✓ Completada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Sequence CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-lg border border-primary/20 p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-dark mb-2">
                    ¿Listos para el siguiente paso?
                  </h3>
                  <p className="text-sm text-gray-text mb-4">
                    Ya calentaste {completedTasks} contactos. Es el momento perfecto para crear una secuencia de outreach personalizada con IA.
                  </p>
                  <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <Sparkles size={16} />
                    Crear secuencia con IA
                  </button>
                </div>
                <div className="text-6xl flex-shrink-0">
                  🚀
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
