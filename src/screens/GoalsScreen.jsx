// GoalsScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState } from 'react';
import { Target, Plus, Check, ChevronRight, Edit3, Trash2, Star, TrendingUp, Calendar } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { Card, Modal, AnimatedMount, ProgressBar, EmptyState } from '../components/ui';


const GoalsScreen = ({ data, setData, showToast }) => {
  const today = getToday();
  const [goalsYear, setGoalsYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(Math.floor(new Date().getMonth() / 3));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showAddModal, setShowAddModal] = useState(null); // 'yearly' | 'quarterly' | 'monthly'
  const [newGoal, setNewGoal] = useState({ title: '', description: '', keyResults: [] });
  const [krInput, setKrInput] = useState('');

  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const quarterNames = ['T1', 'T2', 'T3', 'T4'];
  const goals = data.goals || { yearly: [], quarterly: [], monthly: [] };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    const type = showAddModal;
    setData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [type]: [...(prev.goals?.[type] || []), {
          id: crypto.randomUUID(),
          title: newGoal.title.trim(),
          description: newGoal.description.trim(),
          year: goalsYear,
          quarter: type !== 'yearly' ? selectedQuarter : null,
          month: type === 'monthly' ? selectedMonth : null,
          progress: 0,
          keyResults: newGoal.keyResults,
          completed: false,
          createdAt: new Date().toISOString()
        }]
      }
    }));
    setShowAddModal(null);
    setNewGoal({ title: '', description: '', keyResults: [] });
    setKrInput('');
    showToast('🎯 Meta creada');
  };

  const updateProgress = (type, goalId, progress) => {
    setData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [type]: prev.goals[type].map(g => g.id === goalId ? { ...g, progress, completed: progress >= 100 } : g)
      }
    }));
  };

  const deleteGoal = (type, goalId) => {
    setData(prev => ({
      ...prev,
      goals: { ...prev.goals, [type]: prev.goals[type].filter(g => g.id !== goalId) }
    }));
    showToast('Meta eliminada');
  };

  const toggleKeyResult = (type, goalId, krIndex) => {
    setData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [type]: prev.goals[type].map(g => {
          if (g.id !== goalId) return g;
          const newKRs = g.keyResults.map((kr, i) => i === krIndex ? { ...kr, done: !kr.done } : kr);
          const doneCount = newKRs.filter(kr => kr.done).length;
          const newProgress = newKRs.length > 0 ? Math.round((doneCount / newKRs.length) * 100) : g.progress;
          return { ...g, keyResults: newKRs, progress: newProgress, completed: newProgress >= 100 };
        })
      }
    }));
  };

  const yearlyGoals = (goals.yearly || []).filter(g => g.year === goalsYear);
  const quarterlyGoals = (goals.quarterly || []).filter(g => g.year === goalsYear && g.quarter === selectedQuarter);
  const monthlyGoals = (goals.monthly || []).filter(g => g.year === goalsYear && g.month === selectedMonth);

  const GoalCard = ({ goal, type, gradient }) => (
    <Card className={`bg-gradient-to-r ${gradient} border-0`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className={`font-medium ${goal.completed ? 'line-through opacity-60' : ''}`}>{goal.title}</p>
          {goal.description && <p className="text-xs text-white/50 mt-1">{goal.description}</p>}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{goal.progress}%</p>
          <button onClick={() => deleteGoal(type, goal.id)} className="text-xs text-red-400 mt-1">Eliminar</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
        <div className={`h-full transition-all ${goal.completed ? 'bg-emerald-400' : 'bg-white'}`} style={{ width: `${goal.progress}%` }} />
      </div>

      {/* Quick progress buttons */}
      <div className="flex gap-1 mt-2">
        {[0, 25, 50, 75, 100].map(p => (
          <button key={p} onClick={() => updateProgress(type, goal.id, p)}
            className={`flex-1 py-1 text-[10px] rounded transition-all ${goal.progress >= p ? 'bg-white/30' : 'bg-white/10'}`}>{p}%</button>
        ))}
      </div>

      {/* Key Results */}
      {goal.keyResults?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[10px] text-white/40 mb-2">RESULTADOS CLAVE</p>
          <div className="space-y-1.5">
            {goal.keyResults.map((kr, i) => (
              <button key={i} onClick={() => toggleKeyResult(type, goal.id, i)}
                className="w-full flex items-center gap-2 text-left">
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${kr.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'}`}>
                  {kr.done && <Check className="w-3 h-3" />}
                </div>
                <span className={`text-sm ${kr.done ? 'line-through opacity-60' : ''}`}>{kr.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );

  const EmptyState = ({ type, onClick }) => (
    <button onClick={onClick} className="w-full py-8 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-white/40 transition-all">
      <Plus className="w-8 h-8 mx-auto text-white/30 mb-2" />
      <p className="text-white/40">Añadir meta {type}</p>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Year selector */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setGoalsYear(y => y - 1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
        <p className="text-3xl font-bold">{goalsYear}</p>
        <button onClick={() => setGoalsYear(y => y + 1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-amber-500/20 via-violet-500/20 to-emerald-500/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-amber-400">{yearlyGoals.filter(g => g.completed).length}/{yearlyGoals.length}</p>
            <p className="text-[10px] text-white/40">Anuales</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-400">{(goals.quarterly || []).filter(g => g.year === goalsYear && g.completed).length}/{(goals.quarterly || []).filter(g => g.year === goalsYear).length}</p>
            <p className="text-[10px] text-white/40">Trimestrales</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">{(goals.monthly || []).filter(g => g.year === goalsYear && g.completed).length}/{(goals.monthly || []).filter(g => g.year === goalsYear).length}</p>
            <p className="text-[10px] text-white/40">Mensuales</p>
          </div>
        </div>
      </Card>

      {/* Yearly Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-amber-400">🎯 Metas Anuales</h3>
          <button onClick={() => setShowAddModal('yearly')} className="text-sm text-violet-400">+ Añadir</button>
        </div>
        {yearlyGoals.length > 0 ? (
          <div className="space-y-3">{yearlyGoals.map(g => <GoalCard key={g.id} goal={g} type="yearly" gradient="from-amber-500/20 to-orange-500/20" />)}</div>
        ) : (
          <EmptyState type="anual" onClick={() => setShowAddModal('yearly')} />
        )}
      </div>

      {/* Quarterly Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-violet-400">📊 Metas Trimestrales</h3>
            <div className="flex bg-white/10 rounded-lg p-0.5">
              {quarterNames.map((q, i) => (
                <button key={q} onClick={() => setSelectedQuarter(i)}
                  className={`px-2.5 py-1 text-xs rounded ${selectedQuarter === i ? 'bg-violet-500' : ''}`}>{q}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setShowAddModal('quarterly')} className="text-sm text-violet-400">+ Añadir</button>
        </div>
        {quarterlyGoals.length > 0 ? (
          <div className="space-y-3">{quarterlyGoals.map(g => <GoalCard key={g.id} goal={g} type="quarterly" gradient="from-violet-500/20 to-purple-500/20" />)}</div>
        ) : (
          <EmptyState type="trimestral" onClick={() => setShowAddModal('quarterly')} />
        )}
      </div>

      {/* Monthly Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-emerald-400">📅 Metas Mensuales</h3>
            <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}
              className="bg-white/10 rounded-lg px-2 py-1 text-sm outline-none">
              {monthNames.map((m, i) => <option key={m} value={i} className="bg-zinc-800">{m}</option>)}
            </select>
          </div>
          <button onClick={() => setShowAddModal('monthly')} className="text-sm text-violet-400">+ Añadir</button>
        </div>
        {monthlyGoals.length > 0 ? (
          <div className="space-y-3">{monthlyGoals.map(g => <GoalCard key={g.id} goal={g} type="monthly" gradient="from-emerald-500/20 to-teal-500/20" />)}</div>
        ) : (
          <EmptyState type="mensual" onClick={() => setShowAddModal('monthly')} />
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddModal(null); setNewGoal({ title: '', description: '', keyResults: [] }); setKrInput(''); }}>
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-bold">Nueva Meta {showAddModal === 'yearly' ? 'Anual' : showAddModal === 'quarterly' ? 'Trimestral' : 'Mensual'}</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-white/40 block mb-1">Título *</label>
                <input type="text" value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ej: Lanzar nuevo producto" className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none" autoFocus />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">Descripción</label>
                <textarea value={newGoal.description} onChange={e => setNewGoal(p => ({ ...p, description: e.target.value }))}
                  placeholder="Detalles opcionales..." className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none resize-none h-20" />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">Resultados Clave (OKRs)</label>
                <div className="flex gap-2">
                  <input type="text" value={krInput} onChange={e => setKrInput(e.target.value)}
                    placeholder="Añadir KR..." className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-sm outline-none"
                    onKeyDown={e => { if (e.key === 'Enter' && krInput.trim()) { setNewGoal(p => ({ ...p, keyResults: [...p.keyResults, { text: krInput.trim(), done: false }] })); setKrInput(''); } }} />
                  <button onClick={() => { if (krInput.trim()) { setNewGoal(p => ({ ...p, keyResults: [...p.keyResults, { text: krInput.trim(), done: false }] })); setKrInput(''); } }}
                    className="px-4 bg-violet-500 rounded-xl">+</button>
                </div>
                {newGoal.keyResults.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newGoal.keyResults.map((kr, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                        <span className="flex-1 text-sm">{kr.text}</span>
                        <button onClick={() => setNewGoal(p => ({ ...p, keyResults: p.keyResults.filter((_, idx) => idx !== i) }))} className="text-red-400"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setShowAddModal(null); setNewGoal({ title: '', description: '', keyResults: [] }); setKrInput(''); }} className="flex-1 py-3 bg-white/10 rounded-xl">Cancelar</button>
                <button onClick={addGoal} disabled={!newGoal.title.trim()} className="flex-1 py-3 bg-violet-500 rounded-xl disabled:opacity-50">Crear Meta</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SPIRIT SCREEN - Vision Board, Manifestation & Mindfulness
// ============================================================================


export default GoalsScreen;
