// SpiritScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState } from 'react';
import { Sparkles, Heart, BookOpen, Plus, Star, Moon, Sun, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { Card, Modal, AnimatedMount, EmptyState } from '../components/ui';

const SpiritScreen = ({ data, setData, showToast }) => {
  const today = getToday();
  const [activeTab, setActiveTab] = useState('vision'); // vision | manifest | gratitude | affirmations | breathe | journal
  const [showAddVision, setShowAddVision] = useState(false);
  const [showAddAffirmation, setShowAddAffirmation] = useState(false);
  const [showBreathingSession, setShowBreathingSession] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('idle'); // idle | inhale | hold | exhale | holdOut
  const [breathCount, setBreathCount] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState('478'); // 478 | box | wim

  // Initialize spirit data
  const spirit = data.spirit || {
    visionBoard: [],
    manifestations: [],
    gratitude: {},
    affirmations: [],
    journal: {},
    breathingSessions: [],
    scripting: {}
  };

  // Vision Board
  const [newVision, setNewVision] = useState({ title: '', category: 'life', description: '', imageUrl: '', targetDate: '' });
  const visionCategories = [
    { id: 'health', label: 'Salud', icon: '💪', color: 'from-emerald-500/30 to-teal-500/30' },
    { id: 'wealth', label: 'Abundancia', icon: '💰', color: 'from-amber-500/30 to-yellow-500/30' },
    { id: 'love', label: 'Amor', icon: '❤️', color: 'from-rose-500/30 to-pink-500/30' },
    { id: 'career', label: 'Carrera', icon: '🚀', color: 'from-violet-500/30 to-purple-500/30' },
    { id: 'travel', label: 'Viajes', icon: '✈️', color: 'from-blue-500/30 to-cyan-500/30' },
    { id: 'growth', label: 'Crecimiento', icon: '🌱', color: 'from-green-500/30 to-emerald-500/30' },
    { id: 'life', label: 'Vida', icon: '✨', color: 'from-indigo-500/30 to-violet-500/30' }
  ];

  const addVision = () => {
    if (!newVision.title.trim()) return;
    setData(prev => ({
      ...prev,
      spirit: {
        ...prev.spirit,
        visionBoard: [...(prev.spirit?.visionBoard || []), { id: crypto.randomUUID(), ...newVision, achieved: false, createdAt: new Date().toISOString() }]
      }
    }));
    setNewVision({ title: '', category: 'life', description: '', imageUrl: '', targetDate: '' });
    setShowAddVision(false);
    showToast('✨ Visión añadida');
  };

  const toggleVisionAchieved = (id) => {
    setData(prev => ({
      ...prev,
      spirit: { ...prev.spirit, visionBoard: prev.spirit.visionBoard.map(v => v.id === id ? { ...v, achieved: !v.achieved, achievedAt: !v.achieved ? new Date().toISOString() : null } : v) }
    }));
    showToast('🎉 ¡Manifestado!');
  };

  // Manifestation
  const [manifestInput, setManifestInput] = useState('');
  const [activeMethod, setActiveMethod] = useState('369');
  const manifestMethods = [
    { id: '369', name: 'Método 369', desc: 'Escribe 3x mañana, 6x mediodía, 9x noche', icon: '🔢' },
    { id: 'scripting', name: 'Scripting', desc: 'Escribe tu día ideal como si ya pasó', icon: '📝' },
    { id: 'twocup', name: 'Dos Vasos', desc: 'Técnica cuántica dimensional', icon: '🥤' }
  ];
  const todayManifest = spirit.manifestations?.find(m => m.date === today) || { morning: 0, noon: 0, night: 0, text: '' };

  const addManifestCount = (period) => {
    const target = period === 'morning' ? 3 : period === 'noon' ? 6 : 9;
    const existing = spirit.manifestations?.find(m => m.date === today);
    if (existing && existing[period] >= target) return;

    setData(prev => {
      const manifestations = prev.spirit?.manifestations || [];
      const idx = manifestations.findIndex(m => m.date === today);
      if (idx >= 0) {
        return { ...prev, spirit: { ...prev.spirit, manifestations: manifestations.map((m, i) => i === idx ? { ...m, [period]: m[period] + 1, text: manifestInput || m.text } : m) } };
      } else {
        return { ...prev, spirit: { ...prev.spirit, manifestations: [...manifestations, { id: crypto.randomUUID(), date: today, text: manifestInput, morning: period === 'morning' ? 1 : 0, noon: period === 'noon' ? 1 : 0, night: period === 'night' ? 1 : 0 }] } };
      }
    });
    showToast('✨ +1');
  };

  const saveScripting = (text) => {
    setData(prev => ({ ...prev, spirit: { ...prev.spirit, scripting: { ...prev.spirit?.scripting, [today]: text } } }));
  };

  // Gratitude
  const [gratitudeInputs, setGratitudeInputs] = useState(['', '', '']);
  const todayGratitude = spirit.gratitude?.[today] || [];

  const saveGratitude = () => {
    const items = gratitudeInputs.filter(g => g.trim());
    if (items.length === 0) return;
    setData(prev => ({ ...prev, spirit: { ...prev.spirit, gratitude: { ...prev.spirit?.gratitude, [today]: items } } }));
    setGratitudeInputs(['', '', '']);
    showToast('🙏 Gratitud guardada');
  };

  const getGratitudeStreak = () => {
    let streak = 0, checkDate = today;
    while (spirit.gratitude?.[checkDate]?.length > 0) { streak++; checkDate = getDateOffset(checkDate, -1); }
    return streak;
  };

  // Affirmations
  const [newAffirmation, setNewAffirmation] = useState('');
  const [currentAffirmationIdx, setCurrentAffirmationIdx] = useState(0);
  const defaultAffirmations = ["Soy digno de amor y abundancia", "El universo conspira a mi favor", "Atraigo oportunidades infinitas", "Soy imparable y poderoso", "Todo lo que necesito está en mí"];
  const allAffirmations = [...(spirit.affirmations || []).map(a => a.text), ...defaultAffirmations];

  const addAffirmation = () => {
    if (!newAffirmation.trim()) return;
    setData(prev => ({ ...prev, spirit: { ...prev.spirit, affirmations: [...(prev.spirit?.affirmations || []), { id: crypto.randomUUID(), text: newAffirmation.trim() }] } }));
    setNewAffirmation('');
    setShowAddAffirmation(false);
    showToast('💫 Afirmación añadida');
  };

  // Breathing
  const breathingTechniques = {
    '478': { name: '4-7-8 Relajación', inhale: 4, hold: 7, exhale: 8, holdOut: 0, rounds: 4, color: 'from-blue-500 to-cyan-500' },
    'box': { name: 'Respiración Cuadrada', inhale: 4, hold: 4, exhale: 4, holdOut: 4, rounds: 4, color: 'from-violet-500 to-purple-500' },
    'wim': { name: 'Wim Hof', inhale: 2, hold: 0, exhale: 2, holdOut: 15, rounds: 30, color: 'from-cyan-500 to-teal-500' }
  };
  const [breathTimer, setBreathTimer] = useState(0);
  const [breathRound, setBreathRound] = useState(0);

  useEffect(() => {
    if (breathingPhase === 'idle') return;
    const technique = breathingTechniques[selectedTechnique];
    let targetTime = breathingPhase === 'inhale' ? technique.inhale : breathingPhase === 'hold' ? technique.hold : breathingPhase === 'exhale' ? technique.exhale : technique.holdOut;
    let nextPhase = breathingPhase === 'inhale' ? (technique.hold > 0 ? 'hold' : 'exhale') : breathingPhase === 'hold' ? 'exhale' : breathingPhase === 'exhale' ? (technique.holdOut > 0 ? 'holdOut' : 'inhale') : 'inhale';

    if (breathTimer >= targetTime) {
      if (nextPhase === 'inhale' && breathingPhase !== 'inhale') {
        if (breathRound >= technique.rounds - 1) {
          setBreathingPhase('idle'); setBreathRound(0); setBreathTimer(0); setShowBreathingSession(false);
          setData(prev => ({ ...prev, spirit: { ...prev.spirit, breathingSessions: [...(prev.spirit?.breathingSessions || []), { date: today, technique: selectedTechnique }] } }));
          showToast('🧘 Sesión completada');
          return;
        }
        setBreathRound(r => r + 1);
      }
      setBreathingPhase(nextPhase); setBreathTimer(0);
      return;
    }
    const interval = setInterval(() => setBreathTimer(t => t + 0.1), 100);
    return () => clearInterval(interval);
  }, [breathingPhase, breathTimer, breathRound, selectedTechnique]);

  const startBreathing = () => { setShowBreathingSession(true); setBreathingPhase('inhale'); setBreathTimer(0); setBreathRound(0); };
  const stopBreathing = () => { setShowBreathingSession(false); setBreathingPhase('idle'); setBreathTimer(0); setBreathRound(0); };

  // Journal
  const [journalEntry, setJournalEntry] = useState('');
  const [journalMood, setJournalMood] = useState(null);
  const todayJournal = spirit.journal?.[today];
  const moods = [{ id: 'amazing', emoji: '🤩' }, { id: 'happy', emoji: '😊' }, { id: 'calm', emoji: '😌' }, { id: 'meh', emoji: '😐' }, { id: 'anxious', emoji: '😰' }, { id: 'sad', emoji: '😢' }];
  const journalPrompts = ["¿Qué te hizo sentir vivo hoy?", "¿Qué aprendiste de ti mismo?", "¿Qué señal del universo recibiste?"];
  const [currentPrompt] = useState(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);

  const saveJournal = () => {
    if (!journalEntry.trim() || !journalMood) return;
    setData(prev => ({ ...prev, spirit: { ...prev.spirit, journal: { ...prev.spirit?.journal, [today]: { text: journalEntry, mood: journalMood } } } }));
    showToast('📔 Guardado');
  };

  const tabs = [
    { id: 'vision', label: 'Vision Board', icon: '🎯' },
    { id: 'manifest', label: 'Manifestar', icon: '✨' },
    { id: 'gratitude', label: 'Gratitud', icon: '🙏' },
    { id: 'affirmations', label: 'Afirmaciones', icon: '💫' },
    { id: 'breathe', label: 'Respirar', icon: '🧘' },
    { id: 'journal', label: 'Diario', icon: '📔' }
  ];

  return (
    <div className="pb-24">
      <AnimatedMount>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Espíritu</h1>
          <p className="text-white/50 text-sm mt-1">Conecta con tu ser interior</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-white/10'}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>
      </AnimatedMount>

      <AnimatedMount delay={50}>
        {/* VISION BOARD */}
        {activeTab === 'vision' && (
          <div className="space-y-4">
            <p className="text-center text-white/60 text-sm mb-4">Visualiza tu vida ideal. Lo que ves es lo que atraes.</p>
            {(spirit.visionBoard || []).length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {spirit.visionBoard.map(vision => {
                  const cat = visionCategories.find(c => c.id === vision.category) || visionCategories[6];
                  return (
                    <div key={vision.id} className={`rounded-2xl bg-gradient-to-br ${cat.color} p-4 min-h-[120px] flex flex-col ${vision.achieved ? 'ring-2 ring-emerald-400' : ''}`}>
                      <div className="flex justify-between"><span className="text-xl">{cat.icon}</span>{vision.achieved && <span>✅</span>}</div>
                      <p className={`flex-1 flex items-center justify-center text-center font-bold ${vision.achieved ? 'line-through opacity-60' : ''}`}>{vision.title}</p>
                      <div className="flex justify-between items-center mt-2">
                        <button onClick={() => toggleVisionAchieved(vision.id)} className={`text-[10px] px-2 py-1 rounded-full ${vision.achieved ? 'bg-emerald-500/30' : 'bg-white/20'}`}>{vision.achieved ? 'Manifestado' : 'Manifestar'}</button>
                        <button onClick={() => setData(prev => ({ ...prev, spirit: { ...prev.spirit, visionBoard: prev.spirit.visionBoard.filter(v => v.id !== vision.id) } }))} className="text-white/40 text-xs">✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-12 border-dashed border-2 border-white/20"><p className="text-4xl mb-3">🎯</p><p className="text-white/40">Añade tus sueños y metas</p></Card>
            )}
            <button onClick={() => setShowAddVision(true)} className="w-full py-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl text-violet-300 font-medium border border-violet-500/30">+ Añadir a Vision Board</button>
            {showAddVision && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowAddVision(false)}>
                <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold mb-4 text-center">✨ Nueva Visión</h3>
                  <input type="text" value={newVision.title} onChange={e => setNewVision(p => ({ ...p, title: e.target.value }))} placeholder="¿Qué deseas manifestar?" className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none mb-4" autoFocus />
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {visionCategories.map(cat => (
                      <button key={cat.id} onClick={() => setNewVision(p => ({ ...p, category: cat.id }))} className={`p-2 rounded-xl text-center ${newVision.category === cat.id ? 'bg-white/20 ring-2 ring-white/40' : 'bg-white/5'}`}>
                        <span className="text-xl">{cat.icon}</span><p className="text-[8px] mt-1">{cat.label}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddVision(false)} className="flex-1 py-3 bg-white/10 rounded-xl">Cancelar</button>
                    <button onClick={addVision} className="flex-1 py-3 bg-violet-500 rounded-xl">Crear</button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* MANIFESTATION */}
        {activeTab === 'manifest' && (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {manifestMethods.map(m => (
                <button key={m.id} onClick={() => setActiveMethod(m.id)} className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm ${activeMethod === m.id ? 'bg-violet-500' : 'bg-white/10'}`}>{m.icon} {m.name}</button>
              ))}
            </div>
            {activeMethod === '369' && (
              <>
                <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                  <h3 className="font-bold mb-2">🔢 Método 369 de Tesla</h3>
                  <p className="text-sm text-white/60 mb-4">Escribe tu manifestación 3x mañana, 6x mediodía, 9x noche durante 33-45 días.</p>
                  <textarea value={manifestInput || todayManifest.text} onChange={e => setManifestInput(e.target.value)} placeholder="Estoy tan feliz y agradecido de que..." className="w-full bg-black/30 rounded-xl px-4 py-3 outline-none resize-none h-20" />
                </Card>
                <div className="grid grid-cols-3 gap-3">
                  {[{ period: 'morning', label: 'Mañana', target: 3, icon: '🌅' }, { period: 'noon', label: 'Mediodía', target: 6, icon: '☀️' }, { period: 'night', label: 'Noche', target: 9, icon: '🌙' }].map(slot => {
                    const current = todayManifest[slot.period] || 0;
                    const complete = current >= slot.target;
                    return (
                      <Card key={slot.period} className={`text-center ${complete ? 'bg-emerald-500/20' : ''}`}>
                        <p className="text-2xl">{slot.icon}</p><p className="text-xs text-white/40">{slot.label}</p>
                        <p className="text-2xl font-bold my-2">{current}/{slot.target}</p>
                        <button onClick={() => addManifestCount(slot.period)} disabled={complete || !manifestInput.trim()} className={`w-full py-2 rounded-lg text-sm ${complete ? 'bg-emerald-500/30' : 'bg-white/10'} disabled:opacity-50`}>{complete ? '✓' : '+1'}</button>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
            {activeMethod === 'scripting' && (
              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <h3 className="font-bold mb-2">📝 Scripting</h3>
                <p className="text-sm text-white/60 mb-4">Escribe tu día ideal como si ya hubiera pasado.</p>
                <textarea value={spirit.scripting?.[today] || ''} onChange={e => saveScripting(e.target.value)} placeholder="Hoy fue un día increíble..." className="w-full bg-black/30 rounded-xl px-4 py-3 outline-none resize-none h-48" />
              </Card>
            )}
            {activeMethod === 'twocup' && (
              <Card className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
                <h3 className="font-bold mb-2">🥤 Técnica de los Dos Vasos</h3>
                <div className="space-y-3">
                  {['Llena un vaso con agua, etiquétalo "SITUACIÓN ACTUAL"', 'Etiqueta vaso vacío "SITUACIÓN DESEADA"', 'Vierte el agua visualizando el cambio', 'Bebe el agua sintiendo gratitud', 'Confía y suelta'].map((step, i) => (
                    <div key={i} className="flex gap-3"><div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</div><p className="text-sm">{step}</p></div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* GRATITUDE */}
        {activeTab === 'gratitude' && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <div className="flex justify-between mb-4">
                <div><h3 className="font-bold">🙏 Gratitud Diaria</h3><p className="text-sm text-white/60">3 cosas por agradecer</p></div>
                <div className="text-right"><p className="text-2xl font-bold text-amber-400">{getGratitudeStreak()}</p><p className="text-[10px] text-white/40">días</p></div>
              </div>
              {todayGratitude.length > 0 ? (
                <div className="space-y-2">
                  {todayGratitude.map((item, i) => <div key={i} className="flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3"><span className="text-amber-400">✓</span><span>{item}</span></div>)}
                  <p className="text-center text-emerald-400 text-sm mt-4">✨ ¡Completado!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[0, 1, 2].map(i => <input key={i} type="text" value={gratitudeInputs[i]} onChange={e => setGratitudeInputs(p => p.map((v, idx) => idx === i ? e.target.value : v))} placeholder={`${i + 1}. Estoy agradecido por...`} className="w-full bg-black/20 rounded-xl px-4 py-3 outline-none" />)}
                  <button onClick={saveGratitude} disabled={!gratitudeInputs.some(g => g.trim())} className="w-full py-3 bg-amber-500/30 rounded-xl disabled:opacity-50">Guardar</button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* AFFIRMATIONS */}
        {activeTab === 'affirmations' && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 py-8 text-center">
              <p className="text-4xl mb-4">💫</p>
              <p className="text-xl font-medium italic px-4">"{allAffirmations[currentAffirmationIdx]}"</p>
              <div className="flex justify-center gap-4 mt-6">
                <button onClick={() => setCurrentAffirmationIdx(i => i > 0 ? i - 1 : allAffirmations.length - 1)} className="p-2 bg-white/10 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setCurrentAffirmationIdx(i => (i + 1) % allAffirmations.length)} className="p-2 bg-white/10 rounded-full"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <p className="text-xs text-white/40 mt-4">Repite 3 veces con convicción</p>
            </Card>
            <div className="flex justify-between items-center"><h4 className="text-sm text-white/40">MIS AFIRMACIONES</h4><button onClick={() => setShowAddAffirmation(true)} className="text-violet-400 text-sm">+ Añadir</button></div>
            <div className="space-y-2">
              {(spirit.affirmations || []).map(aff => (
                <Card key={aff.id} className="bg-white/5 flex items-center justify-between">
                  <p className="text-sm">"{aff.text}"</p>
                  <button onClick={() => setData(prev => ({ ...prev, spirit: { ...prev.spirit, affirmations: prev.spirit.affirmations.filter(a => a.id !== aff.id) } }))} className="text-white/30"><X className="w-4 h-4" /></button>
                </Card>
              ))}
            </div>
            {showAddAffirmation && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowAddAffirmation(false)}>
                <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-bold mb-4">Nueva Afirmación</h3>
                  <input type="text" value={newAffirmation} onChange={e => setNewAffirmation(e.target.value)} placeholder="Yo soy..." className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none mb-4" autoFocus />
                  <div className="flex gap-2"><button onClick={() => setShowAddAffirmation(false)} className="flex-1 py-3 bg-white/10 rounded-xl">Cancelar</button><button onClick={addAffirmation} className="flex-1 py-3 bg-violet-500 rounded-xl">Guardar</button></div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* BREATHING */}
        {activeTab === 'breathe' && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-center py-6">
              <p className="text-4xl mb-2">🧘</p>
              <h3 className="text-xl font-bold">Respiración Consciente</h3>
              <p className="text-sm text-white/60 mt-2">Calma tu mente, eleva tu vibración</p>
            </Card>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(breathingTechniques).map(([id, tech]) => (
                <button key={id} onClick={() => { setSelectedTechnique(id); startBreathing(); }} className={`p-4 rounded-2xl bg-gradient-to-r ${tech.color} text-left`}>
                  <p className="font-bold">{tech.name}</p>
                  <p className="text-xs text-white/60 mt-1">{tech.inhale}s inhala · {tech.hold > 0 ? `${tech.hold}s retén · ` : ''}{tech.exhale}s exhala · {tech.rounds} rondas</p>
                </button>
              ))}
            </div>
            {showBreathingSession && (
              <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="text-center">
                  <div className={`w-64 h-64 rounded-full mx-auto flex items-center justify-center transition-all duration-1000 bg-gradient-to-br ${breathingTechniques[selectedTechnique].color}`}
                    style={{ transform: `scale(${breathingPhase === 'inhale' ? 1.3 : breathingPhase === 'exhale' ? 0.7 : 1})` }}>
                    <div><p className="text-3xl font-bold">{breathingPhase === 'inhale' ? 'INHALA' : breathingPhase === 'hold' ? 'RETÉN' : breathingPhase === 'exhale' ? 'EXHALA' : 'RETÉN'}</p>
                      <p className="text-5xl font-bold mt-2">{Math.ceil(breathingTechniques[selectedTechnique][breathingPhase === 'holdOut' ? 'holdOut' : breathingPhase] - breathTimer)}</p></div>
                  </div>
                  <p className="text-white/60 mt-8">Ronda {breathRound + 1} / {breathingTechniques[selectedTechnique].rounds}</p>
                  <button onClick={stopBreathing} className="mt-6 px-8 py-3 bg-white/10 rounded-full">Terminar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JOURNAL */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-rose-500/20 to-pink-500/20">
              <h3 className="font-bold mb-4">📔 Diario del Alma</h3>
              {!todayJournal ? (
                <>
                  <p className="text-xs text-white/40 mb-2">¿Cómo te sientes?</p>
                  <div className="flex justify-between mb-4">
                    {moods.map(mood => <button key={mood.id} onClick={() => setJournalMood(mood.id)} className={`text-2xl p-2 rounded-xl ${journalMood === mood.id ? 'bg-white/20 scale-125' : 'opacity-50'}`}>{mood.emoji}</button>)}
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 mb-4 text-center"><p className="text-xs text-white/40">Reflexión</p><p className="text-white/80 italic text-sm">{currentPrompt}</p></div>
                  <textarea value={journalEntry} onChange={e => setJournalEntry(e.target.value)} placeholder="Escribe libremente..." className="w-full bg-black/20 rounded-xl px-4 py-3 outline-none resize-none h-32" />
                  <button onClick={saveJournal} disabled={!journalEntry.trim() || !journalMood} className="w-full mt-4 py-3 bg-rose-500/30 rounded-xl disabled:opacity-50">Guardar</button>
                </>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-4"><span className="text-3xl">{moods.find(m => m.id === todayJournal.mood)?.emoji}</span><p className="text-xs text-white/40">Hoy</p></div>
                  <p className="text-white/80">{todayJournal.text}</p>
                  <p className="text-emerald-400 text-center mt-4">✨ Ya reflexionaste hoy</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </AnimatedMount>
    </div>
  );
};



export default SpiritScreen;
