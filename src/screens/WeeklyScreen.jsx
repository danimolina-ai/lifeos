// WeeklyScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, ChevronLeft, ChevronRight, Flame, Utensils, Dumbbell, CheckSquare } from 'lucide-react';
import { getToday, getDateOffset, formatDate, getWeekDates } from '../utils/date';
import { calculateDayScore } from '../utils/score';
import { Card, AnimatedMount, ProgressRing, MiniChart } from '../components/ui';


const WeeklyScreen = ({ data }) => {
  const today = getToday();
  const [weekOffset, setWeekOffset] = useState(0);

  const getOffsetWeek = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + (offset * 7));
    return getWeekDates(d.toISOString().split('T')[0]);
  };

  const week = getOffsetWeek(weekOffset);
  const weekDayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const weekStats = week.map(date => {
    const dayData = data.days[date];
    const dayMeals = data.meals.filter(m => m.day_id === date);
    const dayTasks = data.tasks.filter(t => t.day_id === date);
    const dayWorkout = (data.workouts || []).find(w => w.day_id === date);
    const dayHabitLogs = data.habitLogs?.filter(l => l.date === date) || [];

    return {
      date,
      score: calculateDayScore(dayData, dayHabitLogs, dayMeals, dayTasks, dayWorkout, data.user.goals),
      workout: dayWorkout,
      habits: dayHabitLogs.filter(l => l.completed).length,
      tasks: dayTasks.filter(t => t.completed).length,
      calories: dayMeals.reduce((s, m) => s + (m.calories || 0), 0)
    };
  });

  const weekWorkouts = weekStats.filter(d => d.workout?.is_completed).length;
  const weekHabitsTotal = data.habits.length * 7;
  const weekHabitsCompleted = weekStats.reduce((s, d) => s + d.habits, 0);
  const weekTasksCompleted = weekStats.reduce((s, d) => s + d.tasks, 0);
  const avgScore = Math.round(weekStats.reduce((s, d) => s + d.score, 0) / 7);

  return (
    <div className="space-y-4 pb-24">
      <AnimatedMount>
        <div className="flex items-center justify-between">
          <button onClick={() => setWeekOffset(o => o - 1)} className="p-2 hover:bg-white/10 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Semana</h1>
            <p className="text-white/50 text-sm">{formatShortDate(week[0])} - {formatShortDate(week[6])}</p>
          </div>
          <button
            onClick={() => weekOffset < 0 && setWeekOffset(o => o + 1)}
            className={`p-2 rounded-lg ${weekOffset < 0 ? 'hover:bg-white/10' : 'opacity-30'}`}
            disabled={weekOffset >= 0}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </AnimatedMount>

      <AnimatedMount delay={50}>
        <div className="flex gap-1">
          {weekStats.map((day, i) => {
            const isToday = day.date === today;
            const isPastDay = day.date < today;

            return (
              <div
                key={day.date}
                className={`flex-1 py-3 rounded-xl text-center transition-all ${isToday ? 'bg-violet-500' : 'bg-white/5'}`}
              >
                <p className="text-xs text-white/60 mb-1">{weekDayNames[i]}</p>
                <p className="text-lg font-bold">{new Date(day.date).getDate()}</p>
                {isPastDay || isToday ? (
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${day.score >= 70 ? 'bg-emerald-500' :
                    day.score >= 40 ? 'bg-yellow-500' :
                      day.score > 0 ? 'bg-red-500' : 'bg-white/20'
                    }`} />
                ) : (
                  <div className="w-2 h-2 rounded-full mx-auto mt-1 bg-white/10" />
                )}
              </div>
            );
          })}
        </div>
      </AnimatedMount>

      <AnimatedMount delay={75}>
        <Card className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-violet-500/30">
          <div className="flex items-center justify-center gap-4">
            <DayScore score={avgScore} size="lg" />
            <div>
              <p className="text-2xl font-bold">Promedio</p>
              <p className="text-sm text-white/50">
                {avgScore >= 70 ? '¡Gran semana!' : avgScore >= 50 ? 'Buena semana' : 'Puedes mejorar'}
              </p>
            </div>
          </div>
        </Card>
      </AnimatedMount>

      <AnimatedMount delay={100}>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-4 h-4 text-violet-400" />
            <span className="font-medium">Entrenos</span>
          </div>
          <div className="space-y-2">
            {weekStats.map((day, i) => (
              <div
                key={day.date}
                className={`flex items-center justify-between p-2 rounded-lg ${day.workout?.is_completed ? 'bg-emerald-500/20' : 'bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/40 w-6">{weekDayNames[i]}</span>
                  <span className={day.workout ? '' : 'text-white/40'}>
                    {day.workout?.name || 'Descanso'}
                  </span>
                </div>
                {day.workout?.is_completed && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
            ))}
          </div>
        </Card>
      </AnimatedMount>

      <AnimatedMount delay={150}>
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <Dumbbell className="w-6 h-6 text-violet-400 mx-auto mb-2" />
            <p className="text-3xl font-bold">{weekWorkouts}</p>
            <p className="text-xs text-white/40">Entrenos</p>
          </Card>
          <Card className="text-center">
            <CheckSquare className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-3xl font-bold">{weekHabitsTotal > 0 ? Math.round((weekHabitsCompleted / weekHabitsTotal) * 100) : 0}%</p>
            <p className="text-xs text-white/40">Hábitos</p>
          </Card>
          <Card className="text-center">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-3xl font-bold">{weekTasksCompleted}</p>
            <p className="text-xs text-white/40">Tareas</p>
          </Card>
          <Card className="text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-3xl font-bold">{Math.round(weekStats.reduce((s, d) => s + d.calories, 0) / 7)}</p>
            <p className="text-xs text-white/40">kcal/día</p>
          </Card>
        </div>
      </AnimatedMount>
    </div>
  );
};

// ============================================================================
// STATS SCREEN
// ============================================================================
// ============================================================================
// STATS SCREEN
// ============================================================================
// TODO: DESARROLLO FUTURO - STATS EN PROFUNDIDAD
// ============================================================================
// La pantalla de Stats debe tener 2 niveles:
//
// 1. VISTA GENERAL (actual) - Dashboard resumen de todo:
//    - Score del día
//    - Resumen de cada categoría
//    - Gráficos generales
//
// 2. STATS POR CATEGORÍA (por desarrollar) - Submenu con:
//    ┌─────────────────────────────────────────────────────────────────┐
//    │  📊 STATS DETALLADAS                                            │
//    ├─────────────────────────────────────────────────────────────────┤
//    │  🏋️ ENTRENO                                                     │
//    │     - Volumen semanal/mensual (kg totales)                     │
//    │     - Frecuencia de entreno                                    │
//    │     - PRs por ejercicio con gráficos de progresión            │
//    │     - Músculos más/menos trabajados                           │
//    │     - Tiempo promedio de sesión                               │
//    │     - 1RM estimados y su evolución                            │
//    ├─────────────────────────────────────────────────────────────────┤
//    │  🍽️ NUTRICIÓN                                                   │
//    │     - Calorías promedio diarias/semanales                     │
//    │     - Distribución de macros                                  │
//    │     - Adherencia a objetivos                                  │
//    │     - Comidas más frecuentes                                  │
//    │     - Gráficos de tendencia                                   │
//    ├─────────────────────────────────────────────────────────────────┤
//    │  ✅ HÁBITOS                                                     │
//    │     - Tasa de completado por hábito                           │
//    │     - Streaks actuales y máximos                              │
//    │     - Calendario de consistencia (github-style)               │
//    │     - Mejores/peores días de la semana                        │
//    │     - Correlación hábitos vs score del día                    │
//    ├─────────────────────────────────────────────────────────────────┤
//    │  ⚖️ CUERPO                                                      │
//    │     - Gráfico de peso a largo plazo                           │
//    │     - Tendencia (media móvil 7 días)                          │
//    │     - Grasa corporal si disponible                            │
//    │     - Medidas corporales                                      │
//    │     - Correlación peso vs entreno/nutrición                   │
//    ├─────────────────────────────────────────────────────────────────┤
//    │  😴 BIENESTAR                                                   │
//    │     - Horas de sueño promedio                                 │
//    │     - Nivel de energía medio                                  │
//    │     - Correlación sueño vs rendimiento                        │
//    │     - Mood tracking del diario                                │
//    ├─────────────────────────────────────────────────────────────────┤
//    │  📋 PRODUCTIVIDAD                                               │
//    │     - Tareas completadas por día/semana                       │
//    │     - Por proyecto                                            │
//    │     - Tiempo hasta completar                                  │
//    └─────────────────────────────────────────────────────────────────┘
//
// IMPLEMENTACIÓN:
// - Añadir estado [statsView, setStatsView] = useState('general')
// - Crear tabs o cards clickables para cada categoría
// - Cada categoría tiene su propia sub-pantalla con gráficos detallados
// - Usar MiniChart expandido o librería de gráficos más completa
// ============================================================================



export default WeeklyScreen;
