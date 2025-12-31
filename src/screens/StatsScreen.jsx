// StatsScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Flame, Utensils, Dumbbell, Target, ChevronLeft, ChevronRight, Award, Zap } from 'lucide-react';
import { getToday, getDateOffset, formatDate, getWeekDates } from '../utils/date';
import { calculateDayScore } from '../utils/score';
import { getScoreColor, getScoreHexColor } from '../utils/formatting';
import { Card, AnimatedMount, ProgressRing, MiniChart, ProgressBar } from '../components/ui';

const StatsScreen = ({ data, setScreen }) => {
  const [view, setView] = useState('general'); // general, entreno, nutricion, habitos, cuerpo, bienestar
  const today = getToday();

  // Active areas from user settings
  const activeAreas = data.user.activeAreas || ['nutrition', 'workout', 'habits', 'work', 'personal', 'body', 'finances', 'consciousness', 'relationships'];

  // ===================== DATA CALCULATIONS =====================
  // General
  const dayData = data.days[today];
  const todayMeals = data.meals.filter(m => m.day_id === today);
  const todayWorkout = (data.workouts || []).find(w => w.day_id === today);
  const todayTasks = data.tasks.filter(t => t.day_id === today);
  const todayHabitLogs = data.habitLogs?.filter(l => l.date === today) || [];
  const dayScore = calculateDayScore(dayData, todayHabitLogs, todayMeals, todayTasks, todayWorkout, data.user.goals);

  // Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => getDateOffset(today, -i));
  const last30Days = Array.from({ length: 30 }, (_, i) => getDateOffset(today, -i));

  // Workout stats
  const completedWorkouts = (data.workouts || []).filter(w => w.is_completed);
  const workoutsThisWeek = completedWorkouts.filter(w => last7Days.includes(w.day_id)).length;
  const workoutsThisMonth = completedWorkouts.filter(w => last30Days.includes(w.day_id)).length;
  const totalVolume = completedWorkouts.reduce((sum, w) => {
    return sum + (w.exercises?.reduce((exSum, ex) => {
      return exSum + ex.sets.filter(s => s.completed).reduce((setSum, s) => setSum + ((s.weight || 0) * (s.reps || 0)), 0);
    }, 0) || 0);
  }, 0);
  const weeklyVolume = completedWorkouts.filter(w => last7Days.includes(w.day_id)).reduce((sum, w) => {
    return sum + (w.exercises?.reduce((exSum, ex) => {
      return exSum + ex.sets.filter(s => s.completed).reduce((setSum, s) => setSum + ((s.weight || 0) * (s.reps || 0)), 0);
    }, 0) || 0);
  }, 0);

  // Nutrition stats
  const avgCalories = last7Days.reduce((sum, d) => {
    const dayMeals = data.meals.filter(m => m.day_id === d);
    return sum + dayMeals.reduce((s, m) => s + (m.calories || 0), 0);
  }, 0) / 7;
  const avgProtein = last7Days.reduce((sum, d) => {
    const dayMeals = data.meals.filter(m => m.day_id === d);
    return sum + dayMeals.reduce((s, m) => s + (m.protein || 0), 0);
  }, 0) / 7;
  const proteinAdherence = data.user.goals?.protein ? Math.round((avgProtein / data.user.goals.protein) * 100) : 0;

  // Habits stats
  const habitsCompleted = todayHabitLogs.filter(l => l.completed).length;
  const bestStreak = Math.max(...data.habits.map(h => getHabitStreak(h.id, data.habitLogs || [], today)), 0);
  const habitCompletionRate = last7Days.reduce((sum, d) => {
    const dayLogs = data.habitLogs?.filter(l => l.date === d) || [];
    const completed = dayLogs.filter(l => l.completed).length;
    return sum + (data.habits.length > 0 ? completed / data.habits.length : 0);
  }, 0) / 7 * 100;

  // Body stats
  const weights = (data.bodyMetrics || []).sort((a, b) => a.date.localeCompare(b.date)).map(m => m.weight);
  const latestWeight = (data.bodyMetrics || []).sort((a, b) => b.date.localeCompare(a.date))[0];
  const oldestWeight = (data.bodyMetrics || []).sort((a, b) => a.date.localeCompare(b.date))[0];
  const weightChange = latestWeight && oldestWeight ? (latestWeight.weight - oldestWeight.weight).toFixed(1) : null;

  // Sleep/Energy stats
  const avgSleep = last7Days.reduce((sum, d) => sum + (data.days[d]?.sleep_hours || 0), 0) / 7;
  const avgEnergy = last7Days.reduce((sum, d) => sum + (data.days[d]?.energy_level || 0), 0) / 7;
  const sleepData = last7Days.map(d => data.days[d]?.sleep_hours || 0).reverse();

  // Score history
  const scoreHistory = last7Days.map(d => {
    const dd = data.days[d];
    const dm = data.meals.filter(m => m.day_id === d);
    const dw = (data.workouts || []).find(w => w.day_id === d);
    const dt = data.tasks.filter(t => t.day_id === d);
    const dh = data.habitLogs?.filter(l => l.date === d) || [];
    return calculateDayScore(dd, dh, dm, dt, dw, data.user.goals);
  }).reverse();

  // ===================== NEW AREAS STATS =====================
  // Relationships stats
  const relationships = data.relationships || [];
  const frequencyDays = { daily: 1, weekly: 7, biweekly: 14, monthly: 30, quarterly: 90 };
  const relNeedsAttention = relationships.filter(r => {
    if (!r.interactions?.length) return true;
    const sorted = [...r.interactions].sort((a, b) => b.date.localeCompare(a.date));
    const days = Math.floor((new Date(today) - new Date(sorted[0].date)) / (1000 * 60 * 60 * 24));
    return days >= (frequencyDays[r.contactFrequency] || 7);
  }).length;
  const totalInteractions = relationships.reduce((sum, r) => sum + (r.interactions?.length || 0), 0);

  // Personal tasks stats
  const personalTasks = data.personalTasks || [];
  const completedPersonal = personalTasks.filter(t => t.completed).length;
  const pendingPersonal = personalTasks.filter(t => !t.completed).length;
  const overduePersonal = personalTasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;

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
  const consPractices = cons.practices?.length || 0;
  const consGratitudeCount = Object.keys(cons.gratitude || {}).length;

  // ===================== CATEGORY CARDS =====================
  const allCategories = [
    { id: 'entreno', areaId: 'workout', name: 'Entreno', icon: Dumbbell, color: 'violet', value: workoutsThisWeek, label: 'esta semana' },
    { id: 'nutricion', areaId: 'nutrition', name: 'Nutrición', icon: Utensils, color: 'orange', value: `${Math.round(avgCalories)}`, label: 'kcal/día avg' },
    { id: 'habitos', areaId: 'habits', name: 'Hábitos', icon: CheckSquare, color: 'emerald', value: `${Math.round(habitCompletionRate)}%`, label: 'completado' },
    { id: 'cuerpo', areaId: 'body', name: 'Cuerpo', icon: Scale, color: 'teal', value: latestWeight?.weight || '-', label: 'kg actual' },
    { id: 'bienestar', areaId: null, name: 'Bienestar', icon: Moon, color: 'blue', value: avgSleep.toFixed(1), label: 'h sueño avg' },
    { id: 'relaciones', areaId: 'relationships', name: 'Relaciones', icon: Heart, color: 'pink', value: relationships.length, label: `${relNeedsAttention} pendientes` },
    { id: 'personal', areaId: 'personal', name: 'Personal', icon: Calendar, color: 'cyan', value: completedPersonal, label: `${pendingPersonal} pendientes` },
    { id: 'finanzas', areaId: 'finances', name: 'Finanzas', icon: Wallet, color: 'green', value: `${monthlyBudget > 0 ? Math.round((monthExpenses / monthlyBudget) * 100) : 0}%`, label: 'presupuesto' },
    { id: 'consciencia', areaId: 'consciousness', name: 'Consciencia', icon: Sparkles, color: 'purple', value: consXP, label: 'XP total' },
  ];

  // Filter categories by active areas (bienestar is always visible as it's general)
  const categories = allCategories.filter(cat => !cat.areaId || activeAreas.includes(cat.areaId));

  // ===================== RENDER: GENERAL VIEW =====================
  if (view === 'general') {
    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <h1 className="text-2xl font-bold">Estadísticas</h1>
          <p className="text-white/50 text-sm">Vista general</p>
        </AnimatedMount>

        {/* Today's Score */}
        <AnimatedMount delay={50}>
          <Card className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-violet-500/30">
            <div className="flex items-center gap-4">
              <DayScore score={dayScore} size="lg" />
              <div className="flex-1">
                <p className="font-medium">Score de hoy</p>
                <p className="text-sm text-white/50">
                  {dayScore >= 80 ? '¡Excelente día!' : dayScore >= 60 ? 'Buen día' : dayScore >= 40 ? 'Día normal' : 'Puedes mejorar'}
                </p>
              </div>
            </div>
            {scoreHistory.some(s => s > 0) && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-white/40 mb-2">Últimos 7 días</p>
                <MiniChart data={scoreHistory} color="#8B5CF6" height={40} />
              </div>
            )}
          </Card>
        </AnimatedMount>

        {/* Category Cards */}
        <AnimatedMount delay={75}>
          <p className="text-sm text-white/60 mb-2">Categorías</p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, i) => (
              <Card
                key={cat.id}
                onClick={() => setView(cat.id)}
                className={`hover:bg-white/10 cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-${cat.color}-500/20 flex items-center justify-center`}>
                    <cat.icon className={`w-5 h-5 text-${cat.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold">{cat.value}</p>
                    <p className="text-xs text-white/40">{cat.label}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </div>
              </Card>
            ))}
          </div>
        </AnimatedMount>

        {/* Quick Stats */}
        <AnimatedMount delay={100}>
          <Card>
            <p className="font-medium mb-3">Resumen general</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Días trackeados</span>
                <span className="font-medium">{Object.keys(data.days).length}</span>
              </div>
              {activeAreas.includes('workout') && (
                <div className="flex justify-between">
                  <span className="text-white/60">Entrenos completados</span>
                  <span className="font-medium">{completedWorkouts.length}</span>
                </div>
              )}
              {activeAreas.includes('habits') && (
                <div className="flex justify-between">
                  <span className="text-white/60">Mejor racha hábitos</span>
                  <span className="font-medium">{bestStreak} días 🔥</span>
                </div>
              )}
              {activeAreas.includes('workout') && (
                <div className="flex justify-between">
                  <span className="text-white/60">Volumen total levantado</span>
                  <span className="font-medium">{totalVolume.toLocaleString()} kg</span>
                </div>
              )}
              {activeAreas.includes('relationships') && (
                <div className="flex justify-between">
                  <span className="text-white/60">Interacciones registradas</span>
                  <span className="font-medium">{totalInteractions}</span>
                </div>
              )}
              {activeAreas.includes('personal') && (
                <div className="flex justify-between">
                  <span className="text-white/60">Tareas completadas</span>
                  <span className="font-medium">{completedPersonal}</span>
                </div>
              )}
              {activeAreas.includes('consciousness') && (
                <div className="flex justify-between">
                  <span className="text-white/60">Prácticas consciencia</span>
                  <span className="font-medium">{consPractices}</span>
                </div>
              )}
              {activeAreas.includes('consciousness') && (
                <div className="flex justify-between">
                  <span className="text-white/60">Días de gratitud</span>
                  <span className="font-medium">{consGratitudeCount} 🙏</span>
                </div>
              )}
            </div>
          </Card>
        </AnimatedMount>
      </div>
    );
  }

  // ===================== RENDER: ENTRENO STATS =====================
  if (view === 'entreno') {
    const prs = data.personalRecords || [];
    const uniqueExercises = [...new Set(prs.map(p => p.exerciseId || p.exercise))].filter(Boolean);

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('general')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Entreno</h1>
              <p className="text-white/50 text-sm">Estadísticas detalladas</p>
            </div>
          </div>
        </AnimatedMount>

        {/* Main Stats */}
        <AnimatedMount delay={50}>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30">
              <p className="text-xs text-white/50">Esta semana</p>
              <p className="text-3xl font-bold">{workoutsThisWeek}</p>
              <p className="text-sm text-white/60">entrenos</p>
            </Card>
            <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30">
              <p className="text-xs text-white/50">Este mes</p>
              <p className="text-3xl font-bold">{workoutsThisMonth}</p>
              <p className="text-sm text-white/60">entrenos</p>
            </Card>
          </div>
        </AnimatedMount>

        {/* Volume */}
        <AnimatedMount delay={75}>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span className="font-medium">Volumen</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{weeklyVolume.toLocaleString()}</p>
                <p className="text-xs text-white/40">kg esta semana</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVolume.toLocaleString()}</p>
                <p className="text-xs text-white/40">kg total</p>
              </div>
            </div>
          </Card>
        </AnimatedMount>

        {/* PRs */}
        {uniqueExercises.length > 0 && (
          <AnimatedMount delay={100}>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Personal Records</span>
              </div>
              <div className="space-y-2">
                {uniqueExercises.slice(0, 8).map(exId => {
                  const pr = prs.filter(p => (p.exerciseId || p.exercise) === exId).sort((a, b) => (b.weight || 0) - (a.weight || 0))[0];
                  const exercise = getExerciseById(exId);
                  return (
                    <div key={exId} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-sm">{exercise?.name || pr?.exerciseName || pr?.exercise || exId}</p>
                        {pr?.date && <p className="text-xs text-white/40">{formatShortDate(pr.date)}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-400">{pr?.weight}kg x{pr?.reps}</p>
                        {pr?.estimated1RM && <p className="text-xs text-white/40">~{pr.estimated1RM}kg 1RM</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </AnimatedMount>
        )}

        {completedWorkouts.length === 0 && (
          <EmptyState icon={Dumbbell} title="Sin datos" description="Completa entrenos para ver estadísticas" />
        )}
      </div>
    );
  }

  // ===================== RENDER: NUTRICION STATS =====================
  if (view === 'nutricion') {
    const calorieHistory = last7Days.map(d => data.meals.filter(m => m.day_id === d).reduce((s, m) => s + (m.calories || 0), 0)).reverse();
    const proteinHistory = last7Days.map(d => data.meals.filter(m => m.day_id === d).reduce((s, m) => s + (m.protein || 0), 0)).reverse();

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('general')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Nutrición</h1>
              <p className="text-white/50 text-sm">Estadísticas detalladas</p>
            </div>
          </div>
        </AnimatedMount>

        {/* Averages */}
        <AnimatedMount delay={50}>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
              <Flame className="w-5 h-5 text-orange-400 mb-2" />
              <p className="text-2xl font-bold">{Math.round(avgCalories)}</p>
              <p className="text-xs text-white/40">kcal/día promedio</p>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30">
              <Zap className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-2xl font-bold">{Math.round(avgProtein)}g</p>
              <p className="text-xs text-white/40">proteína/día promedio</p>
            </Card>
          </div>
        </AnimatedMount>

        {/* Adherence */}
        <AnimatedMount delay={75}>
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Adherencia proteína</span>
              <span className={`font-bold ${proteinAdherence >= 80 ? 'text-emerald-400' : proteinAdherence >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {proteinAdherence}%
              </span>
            </div>
            <ProgressBar value={proteinAdherence} max={100} color={proteinAdherence >= 80 ? 'bg-emerald-500' : proteinAdherence >= 50 ? 'bg-yellow-500' : 'bg-red-500'} />
            <p className="text-xs text-white/40 mt-2">Objetivo: {data.user.goals?.protein || 0}g/día</p>
          </Card>
        </AnimatedMount>

        {/* Charts */}
        {calorieHistory.some(c => c > 0) && (
          <AnimatedMount delay={100}>
            <Card>
              <p className="font-medium mb-2">Calorías últimos 7 días</p>
              <MiniChart data={calorieHistory} color="#F97316" height={60} />
            </Card>
          </AnimatedMount>
        )}

        {data.meals.length === 0 && (
          <EmptyState icon={Utensils} title="Sin datos" description="Registra comidas para ver estadísticas" />
        )}
      </div>
    );
  }

  // ===================== RENDER: HABITOS STATS =====================
  if (view === 'habitos') {
    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('general')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Hábitos</h1>
              <p className="text-white/50 text-sm">Estadísticas detalladas</p>
            </div>
          </div>
        </AnimatedMount>

        {/* Main Stats */}
        <AnimatedMount delay={50}>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-center">
              <p className="text-3xl font-bold">{Math.round(habitCompletionRate)}%</p>
              <p className="text-xs text-white/40">completado 7 días</p>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-center">
              <p className="text-3xl font-bold">{bestStreak}</p>
              <p className="text-xs text-white/40">mejor racha 🔥</p>
            </Card>
          </div>
        </AnimatedMount>

        {/* Per Habit Stats */}
        {data.habits.length > 0 && (
          <AnimatedMount delay={75}>
            <Card>
              <p className="font-medium mb-3">Por hábito</p>
              <div className="space-y-3">
                {data.habits.map(habit => {
                  const streak = getHabitStreak(habit.id, data.habitLogs || [], today);
                  const completedDays = last30Days.filter(d =>
                    data.habitLogs?.find(l => l.habit_id === habit.id && l.date === d && l.completed)
                  ).length;
                  const rate = Math.round((completedDays / 30) * 100);

                  return (
                    <div key={habit.id} className="p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{habit.icon}</span>
                          <span className="text-sm font-medium">{habit.name}</span>
                        </div>
                        {streak > 0 && <span className="text-xs text-orange-400">{streak} 🔥</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <ProgressBar value={rate} max={100} color="bg-emerald-500" height="h-1.5" />
                        <span className="text-xs text-white/60 w-12 text-right">{rate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </AnimatedMount>
        )}

        {data.habits.length === 0 && (
          <EmptyState icon={CheckSquare} title="Sin hábitos" description="Crea hábitos para ver estadísticas" />
        )}
      </div>
    );
  }

  // ===================== RENDER: CUERPO STATS =====================
  if (view === 'cuerpo') {
    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('general')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Cuerpo</h1>
              <p className="text-white/50 text-sm">Estadísticas detalladas</p>
            </div>
          </div>
        </AnimatedMount>

        {latestWeight ? (
          <>
            {/* Current */}
            <AnimatedMount delay={50}>
              <Card className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/50">Peso actual</p>
                    <p className="text-4xl font-bold">{latestWeight.weight} kg</p>
                    <p className="text-xs text-white/40">{formatShortDate(latestWeight.date)}</p>
                  </div>
                  {weightChange && (
                    <div className="text-right">
                      <p className="text-xs text-white/50">Cambio total</p>
                      <p className={`text-2xl font-bold ${parseFloat(weightChange) < 0 ? 'text-emerald-400' : parseFloat(weightChange) > 0 ? 'text-red-400' : 'text-white/60'}`}>
                        {parseFloat(weightChange) > 0 ? '+' : ''}{weightChange} kg
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </AnimatedMount>

            {/* Chart */}
            {weights.length > 1 && (
              <AnimatedMount delay={75}>
                <Card>
                  <p className="font-medium mb-3">Evolución</p>
                  <MiniChart data={weights.slice(-30)} color="#14B8A6" height={100} />
                  <div className="flex justify-between text-xs text-white/40 mt-2">
                    <span>Min: {Math.min(...weights).toFixed(1)} kg</span>
                    <span>Max: {Math.max(...weights).toFixed(1)} kg</span>
                  </div>
                </Card>
              </AnimatedMount>
            )}
          </>
        ) : (
          <EmptyState icon={Scale} title="Sin datos" description="Registra tu peso para ver estadísticas" action="Ir a Cuerpo" onAction={() => setScreen('body')} />
        )}
      </div>
    );
  }

  // ===================== RENDER: BIENESTAR STATS =====================
  if (view === 'bienestar') {
    const moodData = last7Days.map(d => data.journals?.find(j => j.date === d)?.mood || 0).reverse();
    const avgMood = moodData.filter(m => m > 0).reduce((s, m) => s + m, 0) / (moodData.filter(m => m > 0).length || 1);
    const moodEmojis = ['', '😫', '😔', '😐', '🙂', '😄'];

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('general')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Bienestar</h1>
              <p className="text-white/50 text-sm">Estadísticas detalladas</p>
            </div>
          </div>
        </AnimatedMount>

        {/* Sleep & Energy */}
        <AnimatedMount delay={50}>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30">
              <Moon className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-2xl font-bold">{avgSleep.toFixed(1)}h</p>
              <p className="text-xs text-white/40">sueño promedio</p>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <Zap className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">{avgEnergy.toFixed(1)}/5</p>
              <p className="text-xs text-white/40">energía promedio</p>
            </Card>
          </div>
        </AnimatedMount>

        {/* Sleep Chart */}
        {sleepData.some(s => s > 0) && (
          <AnimatedMount delay={75}>
            <Card>
              <p className="font-medium mb-2">Sueño últimos 7 días</p>
              <MiniChart data={sleepData} color="#3B82F6" height={60} />
              <p className="text-xs text-white/40 mt-2">Objetivo: {data.user.goals?.sleep || 8}h</p>
            </Card>
          </AnimatedMount>
        )}

        {/* Mood */}
        {moodData.some(m => m > 0) && (
          <AnimatedMount delay={100}>
            <Card>
              <p className="font-medium mb-3">Estado de ánimo</p>
              <div className="flex items-center justify-center gap-2 text-3xl mb-2">
                {moodEmojis[Math.round(avgMood)] || '😐'}
              </div>
              <p className="text-center text-sm text-white/60">Promedio: {avgMood.toFixed(1)}/5</p>
            </Card>
          </AnimatedMount>
        )}
      </div>
    );
  }

  // Fallback
  return null;
};

// ============================================================================
// RELATIONSHIPS SCREEN - Gestión de Relaciones Personales
// ============================================================================


export default StatsScreen;
