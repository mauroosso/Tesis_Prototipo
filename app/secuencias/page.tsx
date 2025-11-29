'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useSequences, type Sequence, type SequenceStep } from '@/contexts/SequencesContext';
import { useLists } from '@/contexts/ListsContext';
import {
  Linkedin, Mail, MessageCircle, Plus, Play, Pause, Edit, Copy, Trash2,
  Sparkles, X, Save, Calendar, ChevronDown
} from 'lucide-react';

export default function SecuenciasPage() {
  const {
    sequences,
    createSequence,
    updateSequence,
    deleteSequence,
    duplicateSequence,
    pauseSequence,
    activateSequence,
    addStep,
    updateStep,
    deleteStep,
  } = useSequences();

  const { lists, getListsByType } = useLists();

  const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(
    sequences.length > 0 ? sequences[0] : null
  );

  // Modals state
  const [showNewSequenceModal, setShowNewSequenceModal] = useState(false);
  const [showEditStepModal, setShowEditStepModal] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [editingStep, setEditingStep] = useState<SequenceStep | null>(null);

  // New sequence form
  const [newSequenceName, setNewSequenceName] = useState('');
  const [newSequenceList, setNewSequenceList] = useState<string | null>(null);
  const [newSequenceChannel, setNewSequenceChannel] = useState<'linkedin' | 'email' | 'whatsapp'>('linkedin');
  const [newSequenceDay, setNewSequenceDay] = useState(1);
  const [newSequenceMessage, setNewSequenceMessage] = useState('');

  // Edit/Add step form
  const [stepFormData, setStepFormData] = useState({
    day: 1,
    channel: 'linkedin' as 'linkedin' | 'email' | 'whatsapp',
    title: '',
    subject: '',
    message: '',
  });

  const getChannelIcon = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin':
        return <Linkedin size={18} className="text-blue-600" />;
      case 'email':
        return <Mail size={18} className="text-purple-600" />;
      case 'whatsapp':
        return <MessageCircle size={18} className="text-green-600" />;
    }
  };

  const getChannelBg = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin':
        return 'bg-blue-50 border-blue-200';
      case 'email':
        return 'bg-purple-50 border-purple-200';
      case 'whatsapp':
        return 'bg-green-50 border-green-200';
    }
  };

  const getStatusBadge = (status: Sequence['status']) => {
    const styles = {
      activa: 'badge-green',
      pausada: 'badge-yellow',
      borrador: 'badge-gray',
    };
    return styles[status];
  };

  const handleCreateSequence = () => {
    if (!newSequenceName.trim()) return;

    const firstStep = {
      day: newSequenceDay,
      channel: newSequenceChannel,
      title: 'Primer contacto',
      message: newSequenceMessage || 'Hola {nombre}, ...',
    };

    const newId = createSequence(newSequenceName, newSequenceList, firstStep);
    const newSeq = sequences.find(s => s.id === newId);
    if (newSeq) {
      setSelectedSequence(newSeq);
    }

    // Reset form
    setNewSequenceName('');
    setNewSequenceList(null);
    setNewSequenceChannel('linkedin');
    setNewSequenceDay(1);
    setNewSequenceMessage('');
    setShowNewSequenceModal(false);
  };

  const handleEditStep = (step: SequenceStep) => {
    setEditingStep(step);
    setStepFormData({
      day: step.day,
      channel: step.channel,
      title: step.title,
      subject: step.subject || '',
      message: step.message,
    });
    setShowEditStepModal(true);
  };

  const handleSaveEditStep = () => {
    if (!selectedSequence || !editingStep) return;

    updateStep(selectedSequence.id, editingStep.id, {
      day: stepFormData.day,
      channel: stepFormData.channel,
      title: stepFormData.title,
      subject: stepFormData.subject || undefined,
      message: stepFormData.message,
    });

    setShowEditStepModal(false);
    setEditingStep(null);
  };

  const handleAddStep = () => {
    if (!selectedSequence) return;

    addStep(selectedSequence.id, {
      day: stepFormData.day,
      channel: stepFormData.channel,
      title: stepFormData.title,
      subject: stepFormData.subject || undefined,
      message: stepFormData.message,
    });

    setShowAddStepModal(false);
    // Reset form
    setStepFormData({
      day: (selectedSequence.steps[selectedSequence.steps.length - 1]?.day || 0) + 2,
      channel: 'email',
      title: '',
      subject: '',
      message: '',
    });
  };

  const handleDeleteSequence = () => {
    if (!selectedSequence) return;
    if (!confirm(`¿Estás seguro de eliminar la secuencia "${selectedSequence.name}"?`)) return;

    deleteSequence(selectedSequence.id);
    setSelectedSequence(sequences.length > 1 ? sequences[0] : null);
  };

  const handleDuplicateSequence = () => {
    if (!selectedSequence) return;
    const newId = duplicateSequence(selectedSequence.id);
    const duplicated = sequences.find(s => s.id === newId);
    if (duplicated) {
      setSelectedSequence(duplicated);
    }
  };

  const handleToggleStatus = () => {
    if (!selectedSequence) return;
    if (selectedSequence.status === 'activa') {
      pauseSequence(selectedSequence.id);
    } else {
      activateSequence(selectedSequence.id);
    }
  };

  const handleDeleteStep = (stepId: string) => {
    if (!selectedSequence) return;
    if (!confirm('¿Eliminar este paso?')) return;
    deleteStep(selectedSequence.id, stepId);
  };

  const peopleLists = getListsByType('people');

  return (
    <AppLayout>
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
        {/* Header */}
        <div className="bg-white border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>
                  Secuencias Multicanal
                </h1>
                <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
                  Automatiza tu outreach con mensajes personalizados estilo Lemlist
                </p>
              </div>
              <button
                onClick={() => setShowNewSequenceModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                Nueva secuencia
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sequences List - Left Panel */}
          <aside className="w-80 bg-white border-r overflow-y-auto" style={{ borderColor: 'var(--border-light)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--gray-700)' }}>
                Mis secuencias
              </h3>
              <p className="text-xs" style={{ color: 'var(--gray-500)' }}>
                {sequences.length} secuencias creadas
              </p>
            </div>
            <div className="p-3 space-y-2">
              {sequences.map(seq => (
                <div
                  key={seq.id}
                  onClick={() => setSelectedSequence(seq)}
                  className={`phantom-card p-4 cursor-pointer transition-all ${
                    selectedSequence?.id === seq.id ? 'border-primary shadow-md' : ''
                  }`}
                  style={{
                    borderColor: selectedSequence?.id === seq.id ? 'var(--primary-blue)' : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium" style={{ color: 'var(--gray-800)' }}>
                      {seq.name}
                    </h4>
                    <span className={`badge ${getStatusBadge(seq.status)}`}>
                      {seq.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs" style={{ color: 'var(--gray-500)' }}>
                    <p>{seq.contacts.length} contactos activos</p>
                    <p>Apertura: {seq.metrics.openRate.toFixed(1)}% • Respuesta: {seq.metrics.replyRate.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Sequence Detail - Right Panel */}
          {selectedSequence && (
            <div className="flex-1 overflow-y-auto">
              {/* Sequence Header */}
              <div className="bg-white border-b px-8 py-6" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--gray-800)' }}>
                      {selectedSequence.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--gray-500)' }}>
                      <span>{selectedSequence.contacts.length} contactos activos</span>
                      <span>•</span>
                      <span>{selectedSequence.steps.length} pasos</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleStatus}
                      className={selectedSequence.status === 'activa' ? 'btn-secondary' : 'btn-primary'}
                    >
                      {selectedSequence.status === 'activa' ? (
                        <>
                          <Pause size={16} />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Activar
                        </>
                      )}
                    </button>
                    <button onClick={handleDuplicateSequence} className="btn-secondary p-2">
                      <Copy size={16} />
                    </button>
                    <button onClick={handleDeleteSequence} className="btn-secondary p-2 hover:bg-red-50">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="phantom-card p-4">
                    <p className="text-xs mb-1" style={{ color: 'var(--gray-500)' }}>Apertura</p>
                    <p className="text-2xl font-semibold" style={{ color: 'var(--gray-800)' }}>
                      {selectedSequence.metrics.openRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="phantom-card p-4">
                    <p className="text-xs mb-1" style={{ color: 'var(--gray-500)' }}>Respuesta</p>
                    <p className="text-2xl font-semibold" style={{ color: 'var(--primary-blue)' }}>
                      {selectedSequence.metrics.replyRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="phantom-card p-4">
                    <p className="text-xs mb-1" style={{ color: 'var(--gray-500)' }}>Conversiones</p>
                    <p className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>
                      {selectedSequence.metrics.conversions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--gray-800)' }}>
                    Timeline de la secuencia
                  </h3>

                  <div className="space-y-6">
                    {selectedSequence.steps.map((step, index) => (
                      <div key={step.id} className="timeline-step">
                        <div className="timeline-dot">
                          <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
                            {step.day}
                          </div>
                        </div>

                        <div className="phantom-card p-6 card-hover">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg border ${getChannelBg(step.channel)}`}>
                                {getChannelIcon(step.channel)}
                              </div>
                              <div>
                                <h4 className="text-base font-medium capitalize" style={{ color: 'var(--gray-800)' }}>
                                  {step.title}
                                </h4>
                                {step.subject && (
                                  <p className="text-sm mt-0.5" style={{ color: 'var(--gray-500)' }}>
                                    Asunto: {step.subject}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditStep(step)}
                                className="text-sm font-medium hover:underline"
                                style={{ color: 'var(--primary-blue)' }}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteStep(step.id)}
                                className="text-sm font-medium text-red-600 hover:underline"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>

                          <div
                            className="p-4 rounded-lg text-sm whitespace-pre-wrap"
                            style={{ background: 'var(--gray-100)', color: 'var(--gray-700)' }}
                          >
                            {step.message}
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-xs">
                            <span style={{ color: 'var(--gray-500)' }}>Variables:</span>
                            {['nombre', 'empresa', 'industria', 'cargo', 'pain'].map(variable => (
                              <span
                                key={variable}
                                className="badge-blue font-mono"
                              >
                                {`{${variable}}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Step Button */}
                  <button
                    onClick={() => {
                      setStepFormData({
                        day: (selectedSequence.steps[selectedSequence.steps.length - 1]?.day || 0) + 2,
                        channel: 'email',
                        title: '',
                        subject: '',
                        message: '',
                      });
                      setShowAddStepModal(true);
                    }}
                    className="mt-8 w-full border-2 border-dashed rounded-lg py-4 transition-all flex items-center justify-center gap-2"
                    style={{
                      borderColor: 'var(--border-medium)',
                      color: 'var(--gray-500)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-blue)';
                      e.currentTarget.style.color = 'var(--primary-blue)';
                      e.currentTarget.style.background = 'var(--primary-blue-lighter)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.color = 'var(--gray-500)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Plus size={20} />
                    <span className="font-medium">Agregar nuevo paso</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Sequence Modal */}
        {showNewSequenceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--gray-800)' }}>
                  Nueva Secuencia
                </h2>
                <button onClick={() => setShowNewSequenceModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                    Nombre de la secuencia
                  </label>
                  <input
                    type="text"
                    value={newSequenceName}
                    onChange={(e) => setNewSequenceName(e.target.value)}
                    placeholder="Ej: Outreach Founders Tech LATAM"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                    Lista de personas (opcional)
                  </label>
                  <select
                    value={newSequenceList || ''}
                    onChange={(e) => setNewSequenceList(e.target.value || null)}
                    className="w-full"
                  >
                    <option value="">Sin lista (agregar contactos después)</option>
                    {peopleLists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.name} ({list.items.length} personas)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t pt-6" style={{ borderColor: 'var(--border-light)' }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--gray-800)' }}>
                    Primer paso
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                        Canal
                      </label>
                      <select
                        value={newSequenceChannel}
                        onChange={(e) => setNewSequenceChannel(e.target.value as any)}
                        className="w-full"
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                        Día
                      </label>
                      <input
                        type="number"
                        value={newSequenceDay}
                        onChange={(e) => setNewSequenceDay(parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                      Mensaje
                    </label>
                    <textarea
                      value={newSequenceMessage}
                      onChange={(e) => setNewSequenceMessage(e.target.value)}
                      rows={6}
                      placeholder="Hola {nombre}, vi que sos {cargo} en {empresa}..."
                      className="w-full"
                    />
                    <p className="text-xs mt-2" style={{ color: 'var(--gray-500)' }}>
                      Variables disponibles: {'{nombre}'}, {'{empresa}'}, {'{industria}'}, {'{cargo}'}, {'{pain}'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={handleCreateSequence}
                    disabled={!newSequenceName.trim()}
                    className="btn-primary flex-1"
                  >
                    <Save size={16} />
                    Crear secuencia
                  </button>
                  <button onClick={() => setShowNewSequenceModal(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Step Modal */}
        {showEditStepModal && editingStep && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--gray-800)' }}>
                  Editar Paso
                </h2>
                <button onClick={() => setShowEditStepModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                      Día
                    </label>
                    <input
                      type="number"
                      value={stepFormData.day}
                      onChange={(e) => setStepFormData({ ...stepFormData, day: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                      Canal
                    </label>
                    <select
                      value={stepFormData.channel}
                      onChange={(e) => setStepFormData({ ...stepFormData, channel: e.target.value as any })}
                      className="w-full"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                    Título
                  </label>
                  <input
                    type="text"
                    value={stepFormData.title}
                    onChange={(e) => setStepFormData({ ...stepFormData, title: e.target.value })}
                    placeholder="Ej: Follow-up email"
                    className="w-full"
                  />
                </div>

                {stepFormData.channel === 'email' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                      Asunto (solo para email)
                    </label>
                    <input
                      type="text"
                      value={stepFormData.subject}
                      onChange={(e) => setStepFormData({ ...stepFormData, subject: e.target.value })}
                      placeholder="Re: ..."
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                    Mensaje
                  </label>
                  <textarea
                    value={stepFormData.message}
                    onChange={(e) => setStepFormData({ ...stepFormData, message: e.target.value })}
                    rows={8}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button onClick={handleSaveEditStep} className="btn-primary flex-1">
                    <Save size={16} />
                    Guardar cambios
                  </button>
                  <button onClick={() => setShowEditStepModal(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Step Modal */}
        {showAddStepModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--gray-800)' }}>
                  Agregar Paso
                </h2>
                <button onClick={() => setShowAddStepModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                      Día
                    </label>
                    <input
                      type="number"
                      value={stepFormData.day}
                      onChange={(e) => setStepFormData({ ...stepFormData, day: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                      Canal
                    </label>
                    <select
                      value={stepFormData.channel}
                      onChange={(e) => setStepFormData({ ...stepFormData, channel: e.target.value as any })}
                      className="w-full"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                    Título
                  </label>
                  <input
                    type="text"
                    value={stepFormData.title}
                    onChange={(e) => setStepFormData({ ...stepFormData, title: e.target.value })}
                    placeholder="Ej: Follow-up email"
                    className="w-full"
                  />
                </div>

                {stepFormData.channel === 'email' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                      Asunto (solo para email)
                    </label>
                    <input
                      type="text"
                      value={stepFormData.subject}
                      onChange={(e) => setStepFormData({ ...stepFormData, subject: e.target.value })}
                      placeholder="Re: ..."
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                    Mensaje
                  </label>
                  <textarea
                    value={stepFormData.message}
                    onChange={(e) => setStepFormData({ ...stepFormData, message: e.target.value })}
                    rows={8}
                    placeholder="Hola {nombre}, ..."
                    className="w-full"
                  />
                  <p className="text-xs mt-2" style={{ color: 'var(--gray-500)' }}>
                    Variables: {'{nombre}'}, {'{empresa}'}, {'{industria}'}, {'{cargo}'}, {'{pain}'}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button onClick={handleAddStep} className="btn-primary flex-1">
                    <Plus size={16} />
                    Agregar paso
                  </button>
                  <button onClick={() => setShowAddStepModal(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
