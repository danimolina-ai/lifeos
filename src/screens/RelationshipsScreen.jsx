// RelationshipsScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState } from 'react';
import { Users, Plus, Heart, Phone, Video, MessageCircle, Calendar, Star, Edit3, Trash2, ChevronRight, AlertCircle, Gift, Clock } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { getRelationshipHealthScore } from '../utils/formatting';
import { Card, Modal, AnimatedMount, ProgressBar, EmptyState } from '../components/ui';

const RelationshipsScreen = ({ data, setData, showToast }) => {
  const today = getToday();
  const [view, setView] = useState('dashboard'); // dashboard, list, add, detail
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  // Form state
  const [newRelation, setNewRelation] = useState({
    name: '',
    category: 'friends',
    photo: '',
    loveLanguage: '',
    contactFrequency: 'weekly',
    birthday: '',
    anniversary: '',
    notes: '',
    interests: '',
    pendingTopics: ''
  });

  const [newInteraction, setNewInteraction] = useState({
    type: 'call',
    notes: '',
    quality: 3
  });

  // Categories
  const categories = [
    { id: 'partner', name: 'Pareja', icon: '💑', color: '#EC4899', description: 'Relación romántica' },
    { id: 'family', name: 'Familia', icon: '👨‍👩‍👧‍👦', color: '#F59E0B', description: 'Padres, hermanos, hijos' },
    { id: 'friends', name: 'Amigos', icon: '👥', color: '#3B82F6', description: 'Círculo cercano' },
    { id: 'professional', name: 'Profesional', icon: '🤝', color: '#8B5CF6', description: 'Colegas, mentores' },
    { id: 'community', name: 'Comunidad', icon: '🌱', color: '#10B981', description: 'Conocidos, grupos' }
  ];

  // Love languages
  const loveLanguages = [
    { id: 'words', name: 'Palabras de afirmación', icon: '💬', description: 'Cumplidos, reconocimiento verbal' },
    { id: 'time', name: 'Tiempo de calidad', icon: '⏰', description: 'Atención plena, presencia' },
    { id: 'gifts', name: 'Regalos', icon: '🎁', description: 'Detalles significativos' },
    { id: 'service', name: 'Actos de servicio', icon: '🛠️', description: 'Ayudar, hacer cosas' },
    { id: 'touch', name: 'Contacto físico', icon: '🤗', description: 'Abrazos, cercanía' }
  ];

  // Contact frequencies
  const frequencies = [
    { id: 'daily', name: 'Diario', days: 1 },
    { id: 'weekly', name: 'Semanal', days: 7 },
    { id: 'biweekly', name: 'Quincenal', days: 14 },
    { id: 'monthly', name: 'Mensual', days: 30 },
    { id: 'quarterly', name: 'Trimestral', days: 90 }
  ];

  // Interaction types
  const interactionTypes = [
    { id: 'call', name: 'Llamada', icon: '📞' },
    { id: 'video', name: 'Videollamada', icon: '📹' },
    { id: 'message', name: 'Mensaje', icon: '💬' },
    { id: 'inperson', name: 'En persona', icon: '🤝' },
    { id: 'activity', name: 'Actividad', icon: '🎯' },
    { id: 'gift', name: 'Regalo', icon: '🎁' }
  ];

  // Initialize data
  const relationships = data.relationships || [];

  // Helpers
  const getCat = (id) => categories.find(c => c.id === id) || categories[2];
  const getLang = (id) => loveLanguages.find(l => l.id === id);
  const getFreq = (id) => frequencies.find(f => f.id === id) || frequencies[1];

  // Calculate days since last contact
  const daysSinceContact = (relation) => {
    if (!relation.interactions?.length) return null;
    const lastInteraction = relation.interactions.sort((a, b) => b.date.localeCompare(a.date))[0];
    const diff = Math.floor((new Date(today) - new Date(lastInteraction.date)) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Check if needs attention
  const needsAttention = (relation) => {
    const days = daysSinceContact(relation);
    if (days === null) return true;
    const freq = getFreq(relation.contactFrequency);
    return days >= freq.days;
  };

  // Get health score (1-5)
  const getHealthScore = (relation) => {
    const days = daysSinceContact(relation);
    if (days === null) return 1;
    const freq = getFreq(relation.contactFrequency);
    const ratio = days / freq.days;
    if (ratio <= 0.5) return 5;
    if (ratio <= 1) return 4;
    if (ratio <= 1.5) return 3;
    if (ratio <= 2) return 2;
    return 1;
  };

  // Upcoming birthdays
  const getUpcomingBirthdays = () => {
    const todayDate = new Date(today);
    return relationships
      .filter(r => r.birthday)
      .map(r => {
        const bday = new Date(r.birthday);
        bday.setFullYear(todayDate.getFullYear());
        if (bday < todayDate) bday.setFullYear(todayDate.getFullYear() + 1);
        const daysUntil = Math.floor((bday - todayDate) / (1000 * 60 * 60 * 24));
        return { ...r, daysUntil, nextBirthday: bday.toISOString().split('T')[0] };
      })
      .filter(r => r.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  // Filter relations
  const filteredRelations = selectedCategory === 'all'
    ? relationships
    : relationships.filter(r => r.category === selectedCategory);

  // Relations needing attention
  const attentionNeeded = relationships.filter(needsAttention);

  // Stats
  const stats = {
    total: relationships.length,
    partner: relationships.filter(r => r.category === 'partner').length,
    family: relationships.filter(r => r.category === 'family').length,
    friends: relationships.filter(r => r.category === 'friends').length,
    professional: relationships.filter(r => r.category === 'professional').length,
    needAttention: attentionNeeded.length
  };

  // Actions
  const addRelation = () => {
    if (!newRelation.name.trim()) return;
    const relation = {
      id: crypto.randomUUID(),
      ...newRelation,
      interactions: [],
      healthRating: 3,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      relationships: [...(prev.relationships || []), relation]
    }));
    setNewRelation({
      name: '', category: 'friends', photo: '', loveLanguage: '',
      contactFrequency: 'weekly', birthday: '', anniversary: '',
      notes: '', interests: '', pendingTopics: ''
    });
    setShowAddModal(false);
    showToast('👤 Relación añadida');
  };

  const updateRelation = (id, updates) => {
    setData(prev => ({
      ...prev,
      relationships: prev.relationships.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const deleteRelation = (id) => {
    setData(prev => ({
      ...prev,
      relationships: prev.relationships.filter(r => r.id !== id)
    }));
    setSelectedRelation(null);
    setView('list');
    showToast('Relación eliminada');
  };

  const addInteraction = (relationId) => {
    const interaction = {
      id: crypto.randomUUID(),
      date: today,
      ...newInteraction,
      timestamp: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      relationships: prev.relationships.map(r =>
        r.id === relationId
          ? { ...r, interactions: [...(r.interactions || []), interaction] }
          : r
      )
    }));
    setNewInteraction({ type: 'call', notes: '', quality: 3 });
    setShowInteractionModal(false);
    showToast('✓ Interacción registrada');
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <AnimatedMount>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Relaciones</h1>
            <p className="text-white/50 text-sm">Cultiva tus conexiones</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-3 bg-pink-500 rounded-xl"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </AnimatedMount>

      {/* View Toggle */}
      <AnimatedMount delay={25}>
        <div className="flex bg-white/10 rounded-xl p-1 mb-4">
          <button
            onClick={() => setView('dashboard')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-pink-500' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-pink-500' : ''}`}
          >
            Personas
          </button>
        </div>
      </AnimatedMount>

      {/* DASHBOARD VIEW */}
      {view === 'dashboard' && (
        <div className="space-y-4">
          {/* Quick Stats */}
          <AnimatedMount delay={50}>
            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center py-3">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-white/40">relaciones</p>
              </Card>
              <Card className="text-center py-3">
                <p className="text-2xl font-bold text-amber-400">{stats.needAttention}</p>
                <p className="text-xs text-white/40">necesitan atención</p>
              </Card>
              <Card className="text-center py-3">
                <p className="text-2xl font-bold text-pink-400">{getUpcomingBirthdays().length}</p>
                <p className="text-xs text-white/40">cumples próximos</p>
              </Card>
            </div>
          </AnimatedMount>

          {/* Needs Attention */}
          {attentionNeeded.length > 0 && (
            <AnimatedMount delay={75}>
              <Card>
                <p className="font-medium mb-3 flex items-center gap-2">
                  <span className="text-amber-400">⚠️</span> Necesitan atención
                </p>
                <div className="space-y-2">
                  {attentionNeeded.slice(0, 5).map(relation => {
                    const cat = getCat(relation.category);
                    const days = daysSinceContact(relation);
                    return (
                      <div
                        key={relation.id}
                        onClick={() => { setSelectedRelation(relation); setView('detail'); }}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: cat.color + '30' }}>
                            {relation.photo ? '👤' : cat.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{relation.name}</p>
                            <p className="text-xs text-white/40">
                              {days === null ? 'Sin contacto registrado' : `Hace ${days} días`}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </AnimatedMount>
          )}

          {/* Upcoming Birthdays */}
          {getUpcomingBirthdays().length > 0 && (
            <AnimatedMount delay={100}>
              <Card>
                <p className="font-medium mb-3 flex items-center gap-2">
                  <span>🎂</span> Cumpleaños próximos
                </p>
                <div className="space-y-2">
                  {getUpcomingBirthdays().map(relation => (
                    <div
                      key={relation.id}
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                          🎂
                        </div>
                        <div>
                          <p className="font-medium text-sm">{relation.name}</p>
                          <p className="text-xs text-white/40">
                            {new Date(relation.nextBirthday).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${relation.daysUntil === 0 ? 'bg-pink-500 text-white' :
                        relation.daysUntil <= 7 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-white/10 text-white/60'
                        }`}>
                        {relation.daysUntil === 0 ? '¡Hoy!' :
                          relation.daysUntil === 1 ? 'Mañana' :
                            `En ${relation.daysUntil} días`}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedMount>
          )}

          {/* Categories Overview */}
          <AnimatedMount delay={125}>
            <Card>
              <p className="font-medium mb-3">Por categoría</p>
              <div className="space-y-2">
                {categories.map(cat => {
                  const count = relationships.filter(r => r.category === cat.id).length;
                  const needsAtt = relationships.filter(r => r.category === cat.id && needsAttention(r)).length;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setView('list'); }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: cat.color + '20' }}>
                          {cat.icon}
                        </div>
                        <div>
                          <p className="font-medium">{cat.name}</p>
                          <p className="text-xs text-white/40">{cat.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{count}</p>
                        {needsAtt > 0 && (
                          <p className="text-xs text-amber-400">{needsAtt} pendiente{needsAtt > 1 ? 's' : ''}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </AnimatedMount>

          {/* Empty State */}
          {relationships.length === 0 && (
            <AnimatedMount delay={75}>
              <Card className="text-center py-12">
                <div className="text-5xl mb-4">👥</div>
                <p className="text-white/60 mb-2">Sin relaciones registradas</p>
                <p className="text-xs text-white/40 mb-4">Añade a las personas importantes en tu vida</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2 bg-pink-500 rounded-xl font-medium"
                >
                  Añadir primera relación
                </button>
              </Card>
            </AnimatedMount>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <AnimatedMount delay={50}>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-pink-500' : 'bg-white/10'
                  }`}
              >
                Todos ({relationships.length})
              </button>
              {categories.map(cat => {
                const count = relationships.filter(r => r.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-pink-500' : 'bg-white/10'
                      }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </AnimatedMount>

          {/* Relations List */}
          <div className="space-y-2">
            {filteredRelations.length > 0 ? (
              filteredRelations
                .sort((a, b) => {
                  // Sort by needs attention first, then alphabetically
                  const aNeeds = needsAttention(a);
                  const bNeeds = needsAttention(b);
                  if (aNeeds && !bNeeds) return -1;
                  if (!aNeeds && bNeeds) return 1;
                  return a.name.localeCompare(b.name);
                })
                .map((relation, idx) => {
                  const cat = getCat(relation.category);
                  const days = daysSinceContact(relation);
                  const health = getHealthScore(relation);
                  const needs = needsAttention(relation);

                  return (
                    <AnimatedMount key={relation.id} delay={75 + idx * 25}>
                      <Card
                        className={`cursor-pointer hover:bg-white/10 transition-all ${needs ? 'border-amber-500/30' : ''}`}
                        onClick={() => { setSelectedRelation(relation); setView('detail'); }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                            style={{ backgroundColor: cat.color + '30' }}
                          >
                            {cat.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{relation.name}</p>
                              {needs && <span className="text-amber-400 text-xs">⚠️</span>}
                            </div>
                            <p className="text-xs text-white/40">
                              {days === null ? 'Sin contacto' : `Último contacto hace ${days} días`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map(i => (
                              <div
                                key={i}
                                className={`w-1.5 h-4 rounded-full ${i <= health ? 'bg-pink-500' : 'bg-white/10'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </Card>
                    </AnimatedMount>
                  );
                })
            ) : (
              <AnimatedMount delay={75}>
                <Card className="text-center py-8">
                  <p className="text-white/40">No hay relaciones en esta categoría</p>
                </Card>
              </AnimatedMount>
            )}
          </div>
        </div>
      )}

      {/* DETAIL VIEW */}
      {view === 'detail' && selectedRelation && (() => {
        const relation = selectedRelation;
        const cat = getCat(relation.category);
        const lang = getLang(relation.loveLanguage);
        const freq = getFreq(relation.contactFrequency);
        const days = daysSinceContact(relation);
        const health = getHealthScore(relation);
        const interactions = (relation.interactions || []).sort((a, b) => b.date.localeCompare(a.date));

        return (
          <div className="space-y-4">
            <AnimatedMount>
              <button
                onClick={() => { setView('list'); setSelectedRelation(null); }}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-2"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
            </AnimatedMount>

            {/* Header Card */}
            <AnimatedMount delay={25}>
              <Card className="text-center" style={{ background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}05)` }}>
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
                  style={{ backgroundColor: cat.color + '30' }}
                >
                  {cat.icon}
                </div>
                <h2 className="text-xl font-bold mb-1">{relation.name}</h2>
                <p className="text-sm text-white/50">{cat.name}</p>

                {/* Health indicator */}
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`w-3 h-6 rounded-full ${i <= health ? 'bg-pink-500' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-1">
                  {days === null ? 'Sin contacto registrado' :
                    days === 0 ? 'Contacto hoy' :
                      `Hace ${days} días`}
                </p>
              </Card>
            </AnimatedMount>

            {/* Quick Actions */}
            <AnimatedMount delay={50}>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowInteractionModal(true)}
                  className="flex-1 py-3 bg-pink-500 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Registrar contacto
                </button>
              </div>
            </AnimatedMount>

            {/* Info Cards */}
            <AnimatedMount delay={75}>
              <div className="grid grid-cols-2 gap-3">
                {lang && (
                  <Card className="py-3">
                    <p className="text-xs text-white/40 mb-1">Lenguaje de amor</p>
                    <p className="text-lg">{lang.icon}</p>
                    <p className="text-xs font-medium">{lang.name}</p>
                  </Card>
                )}
                <Card className="py-3">
                  <p className="text-xs text-white/40 mb-1">Frecuencia ideal</p>
                  <p className="text-sm font-medium">{freq.name}</p>
                </Card>
                {relation.birthday && (
                  <Card className="py-3">
                    <p className="text-xs text-white/40 mb-1">Cumpleaños</p>
                    <p className="text-sm font-medium">
                      {new Date(relation.birthday).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                  </Card>
                )}
                {relation.anniversary && (
                  <Card className="py-3">
                    <p className="text-xs text-white/40 mb-1">Aniversario</p>
                    <p className="text-sm font-medium">
                      {new Date(relation.anniversary).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                  </Card>
                )}
              </div>
            </AnimatedMount>

            {/* Notes & Interests */}
            {(relation.notes || relation.interests || relation.pendingTopics) && (
              <AnimatedMount delay={100}>
                <Card>
                  {relation.interests && (
                    <div className="mb-3">
                      <p className="text-xs text-white/40 mb-1">Intereses</p>
                      <p className="text-sm">{relation.interests}</p>
                    </div>
                  )}
                  {relation.pendingTopics && (
                    <div className="mb-3">
                      <p className="text-xs text-white/40 mb-1">Temas pendientes</p>
                      <p className="text-sm">{relation.pendingTopics}</p>
                    </div>
                  )}
                  {relation.notes && (
                    <div>
                      <p className="text-xs text-white/40 mb-1">Notas</p>
                      <p className="text-sm">{relation.notes}</p>
                    </div>
                  )}
                </Card>
              </AnimatedMount>
            )}

            {/* Interaction History */}
            <AnimatedMount delay={125}>
              <Card>
                <p className="font-medium mb-3">Historial de contacto</p>
                {interactions.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {interactions.map(int => {
                      const type = interactionTypes.find(t => t.id === int.type);
                      return (
                        <div key={int.id} className="flex items-start gap-3 p-2 bg-white/5 rounded-lg">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                            {type?.icon || '📝'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{type?.name || 'Contacto'}</p>
                              <p className="text-xs text-white/40">{formatShortDate(int.date)}</p>
                            </div>
                            {int.notes && <p className="text-xs text-white/60 mt-1">{int.notes}</p>}
                            <div className="flex gap-0.5 mt-1">
                              {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={`w-3 h-3 ${i <= int.quality ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-white/40 py-4">Sin interacciones registradas</p>
                )}
              </Card>
            </AnimatedMount>

            {/* Delete button */}
            <AnimatedMount delay={150}>
              <button
                onClick={() => {
                  if (confirm('¿Eliminar esta relación?')) deleteRelation(relation.id);
                }}
                className="w-full py-2 text-red-400 text-sm"
              >
                Eliminar relación
              </button>
            </AnimatedMount>
          </div>
        );
      })()}

      {/* ADD MODAL */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nueva Relación">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/50 mb-1 block">Nombre *</label>
            <input
              type="text"
              value={newRelation.name}
              onChange={(e) => setNewRelation(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre de la persona"
              className="w-full bg-white/5 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-white/50 mb-2 block">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewRelation(prev => ({ ...prev, category: cat.id }))}
                  className={`p-3 rounded-xl text-center transition-all ${newRelation.category === cat.id ? 'bg-pink-500' : 'bg-white/5'
                    }`}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <p className="text-xs">{cat.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-2 block">Lenguaje de amor</label>
            <div className="grid grid-cols-5 gap-2">
              {loveLanguages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setNewRelation(prev => ({ ...prev, loveLanguage: lang.id }))}
                  className={`p-2 rounded-xl text-center transition-all ${newRelation.loveLanguage === lang.id ? 'bg-pink-500' : 'bg-white/5'
                    }`}
                  title={lang.name}
                >
                  <div className="text-lg">{lang.icon}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-2 block">Frecuencia de contacto deseada</label>
            <div className="flex gap-2 flex-wrap">
              {frequencies.map(freq => (
                <button
                  key={freq.id}
                  onClick={() => setNewRelation(prev => ({ ...prev, contactFrequency: freq.id }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${newRelation.contactFrequency === freq.id ? 'bg-pink-500' : 'bg-white/5'
                    }`}
                >
                  {freq.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-white/50 mb-1 block">Cumpleaños</label>
              <input
                type="date"
                value={newRelation.birthday}
                onChange={(e) => setNewRelation(prev => ({ ...prev, birthday: e.target.value }))}
                className="w-full bg-white/5 rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1 block">Aniversario</label>
              <input
                type="date"
                value={newRelation.anniversary}
                onChange={(e) => setNewRelation(prev => ({ ...prev, anniversary: e.target.value }))}
                className="w-full bg-white/5 rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-1 block">Intereses</label>
            <input
              type="text"
              value={newRelation.interests}
              onChange={(e) => setNewRelation(prev => ({ ...prev, interests: e.target.value }))}
              placeholder="Hobbies, temas favoritos..."
              className="w-full bg-white/5 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-white/50 mb-1 block">Notas</label>
            <textarea
              value={newRelation.notes}
              onChange={(e) => setNewRelation(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Información importante..."
              rows={2}
              className="w-full bg-white/5 rounded-xl px-4 py-3 resize-none"
            />
          </div>

          <button
            onClick={addRelation}
            disabled={!newRelation.name.trim()}
            className="w-full py-3 bg-pink-500 rounded-xl font-medium disabled:opacity-30"
          >
            Añadir Relación
          </button>
        </div>
      </Modal>

      {/* INTERACTION MODAL */}
      <Modal isOpen={showInteractionModal} onClose={() => setShowInteractionModal(false)} title="Registrar Contacto">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/50 mb-2 block">Tipo de contacto</label>
            <div className="grid grid-cols-3 gap-2">
              {interactionTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setNewInteraction(prev => ({ ...prev, type: type.id }))}
                  className={`p-3 rounded-xl text-center transition-all ${newInteraction.type === type.id ? 'bg-pink-500' : 'bg-white/5'
                    }`}
                >
                  <div className="text-xl mb-1">{type.icon}</div>
                  <p className="text-xs">{type.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-2 block">¿Cómo fue?</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onClick={() => setNewInteraction(prev => ({ ...prev, quality: i }))}
                  className="p-2"
                >
                  <Star className={`w-8 h-8 transition-all ${i <= newInteraction.quality ? 'text-amber-400 fill-amber-400' : 'text-white/20'
                    }`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-1 block">Notas (opcional)</label>
            <textarea
              value={newInteraction.notes}
              onChange={(e) => setNewInteraction(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="¿De qué hablaron? ¿Algo importante?"
              rows={3}
              className="w-full bg-white/5 rounded-xl px-4 py-3 resize-none"
            />
          </div>

          <button
            onClick={() => addInteraction(selectedRelation?.id)}
            className="w-full py-3 bg-pink-500 rounded-xl font-medium"
          >
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================================
// CONSCIOUSNESS SCREEN - Desarrollo Personal / Elevación de Conciencia
// ============================================================================


export default RelationshipsScreen;
