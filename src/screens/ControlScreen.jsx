// ControlScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, Calendar, BarChart3, ChevronLeft, ChevronRight, Moon, Zap, Droplets, Footprints } from 'lucide-react';
import { getToday, getDateOffset, formatDate, getWeekDates } from '../utils/date';
import { Card, AnimatedMount, MiniChart, ProgressBar } from '../components/ui';

const ControlScreen = ({ data, setData, showToast }) => {
  const today = getToday();
  const [subView, setSubView] = useState('metrics'); // 'metrics' | 'goals' | 'areas'
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [editingGoals, setEditingGoals] = useState(false);
  const [tempGoals, setTempGoals] = useState(data.user.goals || {});

  // Active areas
  const activeAreas = data.user.activeAreas || [];

  // Body metrics
  const bodyMetrics = data.bodyMetrics || [];
  const latestWeight = bodyMetrics.sort((a, b) => b.date.localeCompare(a.date))[0];
  const oldestWeight = bodyMetrics.sort((a, b) => a.date.localeCompare(b.date))[0];
  const weightChange = latestWeight && oldestWeight ? (latestWeight.weight - oldestWeight.weight).toFixed(1) : null;

  // Last 30 days weights for chart
  const last30Weights = bodyMetrics
    .filter(m => m.date >= getDateOffset(today, -30))
    .sort((a, b) => a.date.localeCompare(b.date));

  const saveWeight = () => {
    if (!newWeight) return;
    const entry = {
      id: generateId(),
      date: today,
      weight: parseFloat(newWeight)
    };
    setData(prev => ({
      ...prev,
      bodyMetrics: [...(prev.bodyMetrics || []), entry]
    }));
    setNewWeight('');
    setShowAddWeight(false);
    showToast('Peso registrado');
  };

  const saveGoals = () => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, goals: tempGoals }
    }));
    setEditingGoals(false);
    showToast('Metas actualizadas');
  };

  // Last 7 days stats
  const last7Days = Array.from({ length: 7 }, (_, i) => getDateOffset(today, -i));
  const sleepData = last7Days.map(d => data.days[d]?.sleep_hours || 0).filter(h => h > 0);
  const avgSleep = sleepData.length > 0 ? (sleepData.reduce((a, b) => a + b, 0) / sleepData.length).toFixed(1) : null;
  const energyData = last7Days.map(d => data.days[d]?.energy_level || 0).filter(e => e > 0);
  const avgEnergy = energyData.length > 0 ? (energyData.reduce((a, b) => a + b, 0) / energyData.length).toFixed(1) : null;
  const waterData = last7Days.map(d => data.days[d]?.water_glasses || 0);
  const avgWater = (waterData.reduce((a, b) => a + b, 0) / 7).toFixed(1);
  const stepsData = last7Days.map(d => data.days[d]?.steps || 0);
  const avgSteps = Math.round(stepsData.reduce((a, b) => a + b, 0) / 7);

  // Habits stats
  const habits = data.habits || [];
  const habitLogs = data.habitLogs || [];
  const completionRate = last7Days.reduce((sum, d) => {
    const dayLogs = habitLogs.filter(l => l.date === d && l.completed);
    return sum + (habits.length > 0 ? dayLogs.length / habits.length : 0);
  }, 0) / 7 * 100;

  // Workout stats
  const workouts = data.workouts || [];
  const completedWorkouts = workouts.filter(w => w.is_completed);
  const workoutsThisWeek = completedWorkouts.filter(w => last7Days.includes(w.day_id)).length;

  // Work stats
  const workTasks = data.workTasks || [];
  const completedTasks = workTasks.filter(t => t.completed);
  const tasksThisWeek = completedTasks.filter(t => t.completedAt && last7Days.some(d => t.completedAt.startsWith(d))).length;

  // Personal tasks stats
  const personalTasks = data.personalTasks || [];
  const completedPersonal = personalTasks.filter(t => t.completed).length;
  const pendingPersonal = personalTasks.filter(t => !t.completed).length;

  // Relationships stats
  const relationships = data.relationships || [];
  const frequencyDays = { daily: 1, weekly: 7, biweekly: 14, monthly: 30, quarterly: 90 };
  const relNeedsAttention = relationships.filter(r => {
    if (!r.interactions?.length) return true;
    const sorted = [...r.interactions].sort((a, b) => b.date.localeCompare(a.date));
    const days = Math.floor((new Date(today) - new Date(sorted[0].date)) / (1000 * 60 * 60 * 24));
    return days >= (frequencyDays[r.contactFrequency] || 7);
  }).length;

  // Finances stats
  const transactions = data.finances?.transactions || [];
  const thisMonth = today.substring(0, 7);
  const monthExpenses = transactions.filter(t => t.date?.startsWith(thisMonth) && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthIncome = transactions.filter(t => t.date?.startsWith(thisMonth) && t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const monthlyBudget = data.finances?.monthlyBudget || 0;

  // Consciousness stats
  const cons = data.consciousness || {};
  const consXP = cons.totalXP || 0;
  const consLevel = (cons.startingLevel || 0) + (cons.currentLevel || 0);

  return (
    <div className="space-y-4 pb-24">
      <AnimatedMount>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">Control</h1>
            <p className="text-white/50 text-sm">Métricas y metas</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-xl p-1">
          <button onClick={() => setSubView('metrics')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${subView === 'metrics' ? 'bg-violet-500' : ''}`}>
            📊 Métricas
          </button>
          <button onClick={() => setSubView('goals')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${subView === 'goals' ? 'bg-violet-500' : ''}`}>
            🎯 Metas
          </button>
          <button onClick={() => setSubView('areas')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${subView === 'areas' ? 'bg-violet-500' : ''}`}>
            🗂️ Áreas
          </button>
        </div>
      </AnimatedMount>

      {/* METRICS VIEW */}
      {subView === 'metrics' && (
        <>
          {/* Weight Section */}
          <AnimatedMount delay={50}>
            <Section title="PESO" icon={Scale} iconColor="text-teal-400">
              <Card className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold">{latestWeight?.weight || '-'} kg</p>
                    <p className="text-sm text-white/50">
                      {latestWeight ? `Último: ${formatShortDate(latestWeight.date)}` : 'Sin registros'}
                    </p>
                  </div>
                  {weightChange && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${parseFloat(weightChange) <= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {parseFloat(weightChange) > 0 ? '+' : ''}{weightChange} kg
                    </div>
                  )}
                </div>

                {last30Weights.length > 1 && (
                  <div className="mb-4">
                    <MiniChart data={last30Weights.map(w => w.weight)} color="#14B8A6" height={60} showDots />
                  </div>
                )}

                <button onClick={() => setShowAddWeight(true)} className="w-full py-3 bg-teal-500/20 hover:bg-teal-500/30 rounded-xl font-medium text-teal-400 transition-colors">
                  + Registrar peso
                </button>
              </Card>
            </Section>
          </AnimatedMount>

          {/* Vitals Section */}
          <AnimatedMount delay={100}>
            <Section title="PROMEDIOS (7 DÍAS)" icon={Activity} iconColor="text-violet-400">
              <div className="grid grid-cols-2 gap-3">
                <Card className="text-center">
                  <Moon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{avgSleep || '-'}</p>
                  <p className="text-xs text-white/40">h sueño</p>
                </Card>
                <Card className="text-center">
                  <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{avgEnergy || '-'}</p>
                  <p className="text-xs text-white/40">energía /5</p>
                </Card>
                <Card className="text-center">
                  <Droplets className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{avgWater}</p>
                  <p className="text-xs text-white/40">vasos agua</p>
                </Card>
                <Card className="text-center">
                  <Footprints className="w-5 h-5 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{avgSteps > 0 ? `${(avgSteps / 1000).toFixed(1)}k` : '-'}</p>
                  <p className="text-xs text-white/40 flex items-center justify-center gap-1">
                    pasos <Watch className="w-3 h-3" />
                  </p>
                </Card>
              </div>
            </Section>
          </AnimatedMount>

          {/* Areas Overview */}
          <AnimatedMount delay={150}>
            <Section title="RESUMEN POR ÁREA" icon={LayoutGrid} iconColor="text-fuchsia-400">
              <div className="space-y-2">
                {activeAreas.includes('workout') && (
                  <Card className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-medium">Entreno</p>
                        <p className="text-xs text-white/40">{workoutsThisWeek} esta semana</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-violet-400">{completedWorkouts.length}</p>
                  </Card>
                )}

                {activeAreas.includes('habits') && (
                  <Card className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium">Hábitos</p>
                        <p className="text-xs text-white/40">{habits.length} activos</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-emerald-400">{Math.round(completionRate)}%</p>
                  </Card>
                )}

                {activeAreas.includes('work') && (
                  <Card className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Trabajo</p>
                        <p className="text-xs text-white/40">{tasksThisWeek} tareas esta semana</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-blue-400">{completedTasks.length}</p>
                  </Card>
                )}

                {activeAreas.includes('personal') && (
                  <Card className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium">Personal</p>
                        <p className="text-xs text-white/40">{pendingPersonal} pendientes</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-cyan-400">{completedPersonal}</p>
                  </Card>
                )}

                {activeAreas.includes('relationships') && (
                  <Card className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-pink-400" />
                      </div>
                      <div>
                        <p className="font-medium">Relaciones</p>
                        <p className="text-xs text-white/40">{relNeedsAttention} necesitan atención</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-pink-400">{relationships.length}</p>
                  </Card>
                )}

                {activeAreas.includes('finances') && (
                  <Card className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Finanzas</p>
                        <p className="text-xs text-white/40">{monthlyBudget > 0 ? `${Math.round((monthExpenses / monthlyBudget) * 100)}% usado` : 'Sin presupuesto'}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-400">{monthIncome - monthExpenses > 0 ? '+' : ''}{monthIncome - monthExpenses}€</p>
                  </Card>
                )}

                {activeAreas.includes('consciousness') && (
                  <Card className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Consciencia</p>
                        <p className="text-xs text-white/40">Nivel {consLevel + 1}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-purple-400">{consXP} XP</p>
                  </Card>
                )}
              </div>
            </Section>
          </AnimatedMount>
        </>
      )}

      {/* GOALS VIEW */}
      {subView === 'goals' && (
        <AnimatedMount delay={50}>
          <Section title="METAS DIARIAS" icon={Target} iconColor="text-emerald-400">
            <Card>
              {editingGoals ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/50 mb-1 block">Calorías (kcal)</label>
                    <input type="number" value={tempGoals.calories || ''} onChange={e => setTempGoals(p => ({ ...p, calories: parseInt(e.target.value) || 0 }))} className="w-full bg-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-sm text-white/50 mb-1 block">Proteína (g)</label>
                    <input type="number" value={tempGoals.protein || ''} onChange={e => setTempGoals(p => ({ ...p, protein: parseInt(e.target.value) || 0 }))} className="w-full bg-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-sm text-white/50 mb-1 block">Carbohidratos (g)</label>
                    <input type="number" value={tempGoals.carbs || ''} onChange={e => setTempGoals(p => ({ ...p, carbs: parseInt(e.target.value) || 0 }))} className="w-full bg-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-sm text-white/50 mb-1 block">Grasas (g)</label>
                    <input type="number" value={tempGoals.fats || ''} onChange={e => setTempGoals(p => ({ ...p, fats: parseInt(e.target.value) || 0 }))} className="w-full bg-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-sm text-white/50 mb-1 block">Horas de sueño</label>
                    <input type="number" step="0.5" value={tempGoals.sleep || ''} onChange={e => setTempGoals(p => ({ ...p, sleep: parseFloat(e.target.value) || 0 }))} className="w-full bg-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-sm text-white/50 mb-1 block">Vasos de agua</label>
                    <input type="number" value={tempGoals.water || ''} onChange={e => setTempGoals(p => ({ ...p, water: parseInt(e.target.value) || 0 }))} className="w-full bg-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="text-sm text-white/50 mb-1 block flex items-center gap-2">
                      Pasos diarios <Watch className="w-3 h-3 text-white/30" />
                    </label>
                    <input type="number" step="1000" value={tempGoals.steps || ''} onChange={e => setTempGoals(p => ({ ...p, steps: parseInt(e.target.value) || 0 }))} placeholder="10000" className="w-full bg-white/10 rounded-xl px-4 py-3" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingGoals(false)} className="flex-1 py-3 bg-white/10 rounded-xl">Cancelar</button>
                    <button onClick={saveGoals} className="flex-1 py-3 bg-emerald-500 rounded-xl font-medium">Guardar</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: 'Calorías diarias', value: data.user.goals?.calories || 2200, unit: 'kcal', color: 'bg-orange-500' },
                    { label: 'Proteína diaria', value: data.user.goals?.protein || 180, unit: 'g', color: 'bg-red-500' },
                    { label: 'Carbohidratos', value: data.user.goals?.carbs || 220, unit: 'g', color: 'bg-yellow-500' },
                    { label: 'Grasas', value: data.user.goals?.fats || 70, unit: 'g', color: 'bg-purple-500' },
                    { label: 'Horas de sueño', value: data.user.goals?.sleep || 8, unit: 'h', color: 'bg-blue-500' },
                    { label: 'Vasos de agua', value: data.user.goals?.water || 8, unit: '', color: 'bg-cyan-500' },
                    { label: 'Pasos diarios', value: (data.user.goals?.steps || 10000).toLocaleString(), unit: '', color: 'bg-green-500', icon: '👟' }
                  ].map((goal, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">{goal.label} {goal.icon || ''}</span>
                        <span className="font-medium">{goal.value}{goal.unit}</span>
                      </div>
                      <ProgressBar value={100} max={100} color={goal.color} />
                    </div>
                  ))}
                  <button onClick={() => { setTempGoals(data.user.goals || {}); setEditingGoals(true); }} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors">
                    ✏️ Editar metas
                  </button>
                </div>
              )}
            </Card>
          </Section>

          {/* Additional Goals */}
          <Section title="METAS DE HÁBITOS" icon={CheckSquare} iconColor="text-emerald-400">
            <Card>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Entrenos por semana</span>
                  <span className="font-bold">{workoutsThisWeek} / 4</span>
                </div>
                <ProgressBar value={workoutsThisWeek} max={4} color="bg-violet-500" />

                <div className="flex justify-between items-center mt-4">
                  <span className="text-white/60">Tasa de hábitos</span>
                  <span className="font-bold">{Math.round(completionRate)}% / 80%</span>
                </div>
                <ProgressBar value={completionRate} max={80} color="bg-emerald-500" />
              </div>
            </Card>
          </Section>
        </AnimatedMount>
      )}

      {/* AREAS VIEW */}
      {subView === 'areas' && (
        <AnimatedMount delay={50}>
          <Section title="ÁREAS ACTIVAS" icon={LayoutGrid} iconColor="text-fuchsia-400">
            <p className="text-sm text-white/50 mb-3">Resumen del estado de cada área</p>
            <div className="space-y-3">
              {[
                { id: 'nutrition', name: 'Nutrición', icon: '🍽️', color: '#F59E0B', stat: `${Math.round(avgWater * 250)}ml agua avg`, status: parseFloat(avgWater) >= 6 ? 'good' : 'warning' },
                { id: 'workout', name: 'Entreno', icon: '💪', color: '#8B5CF6', stat: `${workoutsThisWeek} esta semana`, status: workoutsThisWeek >= 3 ? 'good' : workoutsThisWeek >= 1 ? 'warning' : 'bad' },
                { id: 'habits', name: 'Hábitos', icon: '✅', color: '#10B981', stat: `${Math.round(completionRate)}% completado`, status: completionRate >= 70 ? 'good' : completionRate >= 40 ? 'warning' : 'bad' },
                { id: 'work', name: 'Trabajo', icon: '💼', color: '#3B82F6', stat: `${workTasks.filter(t => !t.completed).length} pendientes`, status: workTasks.filter(t => !t.completed && t.eisenhower === 'q1').length === 0 ? 'good' : 'warning' },
                { id: 'personal', name: 'Personal', icon: '📋', color: '#06B6D4', stat: `${pendingPersonal} tareas`, status: personalTasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length === 0 ? 'good' : 'warning' },
                { id: 'finances', name: 'Finanzas', icon: '💰', color: '#22C55E', stat: monthlyBudget > 0 ? `${Math.round((monthExpenses / monthlyBudget) * 100)}% presupuesto` : 'Sin presupuesto', status: monthlyBudget === 0 || monthExpenses <= monthlyBudget ? 'good' : 'bad' },
                { id: 'relationships', name: 'Relaciones', icon: '👥', color: '#EC4899', stat: `${relNeedsAttention} pendientes`, status: relNeedsAttention <= 2 ? 'good' : relNeedsAttention <= 5 ? 'warning' : 'bad' },
                { id: 'consciousness', name: 'Consciencia', icon: '🧘', color: '#A855F7', stat: `${consXP} XP total`, status: 'good' },
                { id: 'body', name: 'Cuerpo', icon: '⚖️', color: '#14B8A6', stat: latestWeight ? `${latestWeight.weight}kg` : 'Sin registro', status: 'neutral' }
              ].filter(area => activeAreas.includes(area.id)).map(area => (
                <Card key={area.id} className="py-3 flex items-center gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: area.color }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: area.color + '20' }}>
                    {area.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{area.name}</p>
                    <p className="text-xs text-white/40">{area.stat}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${area.status === 'good' ? 'bg-emerald-500' : area.status === 'warning' ? 'bg-amber-500' : area.status === 'bad' ? 'bg-red-500' : 'bg-white/20'}`} />
                </Card>
              ))}
            </div>
          </Section>
        </AnimatedMount>
      )}

      {/* Add Weight Modal */}
      <Modal isOpen={showAddWeight} onClose={() => setShowAddWeight(false)} title="Registrar peso"
        footer={<button onClick={saveWeight} className="w-full py-4 bg-teal-500 rounded-xl font-medium">Guardar</button>}
      >
        <div className="text-center">
          <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="70.0" className="w-full bg-white/10 rounded-xl p-4 text-3xl font-bold text-center outline-none" />
          <p className="text-white/40 mt-2">kg</p>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================================
// FINANCES SCREEN
// ============================================================================


export default ControlScreen;
