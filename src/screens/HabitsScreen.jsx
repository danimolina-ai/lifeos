// HabitsScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useEffect } from 'react';
import { Plus, Check, Target, TrendingUp, Calendar, Settings, ArrowLeft, ChevronLeft, ChevronRight, Flame, Edit3, Trash2, X, ChevronDown, BarChart3, Trophy, Star, Zap, AlertCircle } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId, getWeekDates } from '../utils/date';
import { getScoreColor, getScoreHexColor } from '../utils/formatting';
import { shouldDoHabitOnDay as shouldDoHabitOnDayUtil, getStreakWithFreeze as getStreakWithFreezeUtil, getMissedYesterday as getMissedYesterdayUtil, getMasteryLevel as getMasteryLevelUtil, getGratitudeStreak } from '../utils/habits';
import { Card, Modal, ProgressRing, AnimatedMount, ProgressBar, EmptyState } from '../components/ui';
import { AccordionSection } from '../components/ui/AccordionSection';


const HabitsScreen = ({ data, setData, showToast }) => {
  const today = getToday();
  const [view, setView] = useState('today'); // today, history, detail
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [historyDate, setHistoryDate] = useState(today);

  // Elite habit form
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: '✨',
    identity: '',
    why: '',
    cue: '',
    location: '',
    time: '',
    stackedTo: null,
    minVersion: '',
    fullVersion: '',
    frequency: 'daily',
    customDays: [1, 2, 3, 4, 5, 6, 0],
    category: 'growth',
  });

  const [localSettings, setLocalSettings] = useState({
    showStreaks: data.user?.habitsSettings?.showStreaks ?? true,
    reminderTime: data.user?.habitsSettings?.reminderTime || '09:00',
    freezeDaysPerMonth: data.user?.habitsSettings?.freezeDaysPerMonth || 2,
    showIdentity: data.user?.habitsSettings?.showIdentity ?? true,
  });

  const saveSettings = () => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, habitsSettings: localSettings }
    }));
    setShowSettings(false);
    showToast('Configuración guardada');
  };

  const icons = ['✨', '🧘', '📚', '🚶', '💧', '📵', '✍️', '🤸', '🙏', '💪', '🎯', '⏰', '🏃', '💊', '🥗', '😴', '🎨', '🎸', '💰', '🧹', '📱', '☀️', '🌙', '❤️'];

  const categories = [
    { id: 'health', name: 'Salud', color: 'emerald', icon: '💪' },
    { id: 'mindfulness', name: 'Mente', color: 'violet', icon: '🧘' },
    { id: 'productivity', name: 'Productividad', color: 'blue', icon: '⚡' },
    { id: 'growth', name: 'Crecimiento', color: 'amber', icon: '📈' },
    { id: 'social', name: 'Social', color: 'pink', icon: '❤️' }
  ];

  // ===================== CALCULATIONS =====================

  const getDayLogs = (date) => {
    return data.habits.map(habit => {
      const log = data.habitLogs?.find(l => l.habit_id === habit.id && l.date === date);
      return { habit, log, completed: log?.completed || false, completedAt: log?.completedAt };
    });
  };

  const dayHabitLogs = getDayLogs(today);
  const completedCount = dayHabitLogs.filter(h => h.completed).length;

  const shouldDoHabitOnDay = (habit, date) => {
    const dayOfWeek = new Date(date).getDay();
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (habit.frequency === 'weekend') return dayOfWeek === 0 || dayOfWeek === 6;
    if (habit.frequency === 'custom') return (habit.customDays || []).includes(dayOfWeek);
    return true;
  };

  const todayHabits = data.habits.filter(h => shouldDoHabitOnDay(h, today));
  const todayCompletedCount = dayHabitLogs.filter(h => h.completed && shouldDoHabitOnDay(h.habit, today)).length;

  const getStreakWithFreeze = (habitId, freezeDays = 2) => {
    const logs = data.habitLogs?.filter(l => l.habit_id === habitId && l.completed) || [];
    if (logs.length === 0) return { current: 0, best: 0, freezeUsed: 0 };

    const sortedDates = [...new Set(logs.map(l => l.date))].sort().reverse();
    let streak = 0;
    let freezeUsed = 0;
    let currentDate = new Date(today);

    const habit = data.habits.find(h => h.id === habitId);
    const todayLog = logs.find(l => l.date === today);
    if (!todayLog && shouldDoHabitOnDay(habit, today)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const wasCompleted = sortedDates.includes(dateStr);
      const shouldDo = shouldDoHabitOnDay(habit, dateStr);

      if (shouldDo) {
        if (wasCompleted) {
          streak++;
        } else if (freezeUsed < freezeDays) {
          freezeUsed++;
        } else {
          break;
        }
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }

    let bestStreak = 0;
    let tempStreak = 0;
    const allDates = sortedDates.sort();
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(allDates[i - 1]);
        const currDate = new Date(allDates[i]);
        const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    }

    return { current: streak, best: bestStreak, freezeUsed };
  };

  const getCompletionRate = (habitId, days = 30) => {
    const habit = data.habits.find(h => h.id === habitId);
    if (!habit) return 0;

    let shouldDo = 0;
    let completed = 0;

    for (let i = 0; i < days; i++) {
      const date = getDateOffset(today, -i);
      if (shouldDoHabitOnDay(habit, date)) {
        shouldDo++;
        const log = data.habitLogs?.find(l => l.habit_id === habitId && l.date === date && l.completed);
        if (log) completed++;
      }
    }

    return shouldDo > 0 ? Math.round((completed / shouldDo) * 100) : 0;
  };

  const getFailPatterns = (habitId) => {
    const habit = data.habits.find(h => h.id === habitId);
    if (!habit) return { days: [] };

    const dayFailCount = [0, 0, 0, 0, 0, 0, 0];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 0; i < 90; i++) {
      const date = getDateOffset(today, -i);
      const dayOfWeek = new Date(date).getDay();
      if (shouldDoHabitOnDay(habit, date)) {
        const log = data.habitLogs?.find(l => l.habit_id === habitId && l.date === date && l.completed);
        if (!log) dayFailCount[dayOfWeek]++;
      }
    }

    const maxFails = Math.max(...dayFailCount);
    const failDays = dayFailCount
      .map((count, idx) => ({ day: dayNames[idx], count, idx }))
      .filter(d => d.count > maxFails * 0.5 && d.count > 2)
      .sort((a, b) => b.count - a.count);

    return { days: failDays };
  };

  const getMissedYesterday = (habitId) => {
    const yesterday = getDateOffset(today, -1);
    const habit = data.habits.find(h => h.id === habitId);
    if (!shouldDoHabitOnDay(habit, yesterday)) return false;
    const log = data.habitLogs?.find(l => l.habit_id === habitId && l.date === yesterday && l.completed);
    return !log;
  };

  const getMasteryLevel = (habitId) => {
    const totalCompletions = data.habitLogs?.filter(l => l.habit_id === habitId && l.completed).length || 0;
    const completionRate = getCompletionRate(habitId, 30);
    const streak = getStreakWithFreeze(habitId);

    const score = (totalCompletions * 0.3) + (completionRate * 0.4) + (streak.current * 2);

    if (score >= 100) return 5;
    if (score >= 60) return 4;
    if (score >= 30) return 3;
    if (score >= 15) return 2;
    return 1;
  };

  const isPerfectWeek = () => {
    const weekStart = getDateOffset(today, -6);
    for (let i = 0; i < 7; i++) {
      const date = getDateOffset(weekStart, i);
      for (const habit of data.habits) {
        if (shouldDoHabitOnDay(habit, date)) {
          const log = data.habitLogs?.find(l => l.habit_id === habit.id && l.date === date && l.completed);
          if (!log) return false;
        }
      }
    }
    return data.habits.length > 0;
  };

  // ===================== HANDLERS =====================

  const toggleHabit = (habitId, useMinVersion = false) => {
    const existingLog = data.habitLogs?.find(l => l.habit_id === habitId && l.date === today);

    if (existingLog) {
      setData(prev => ({
        ...prev,
        habitLogs: prev.habitLogs.map(l =>
          l.habit_id === habitId && l.date === today
            ? { ...l, completed: !l.completed, completedAt: !l.completed ? new Date().toISOString() : null, usedMinVersion: useMinVersion }
            : l
        )
      }));
    } else {
      setData(prev => ({
        ...prev,
        habitLogs: [...(prev.habitLogs || []), {
          id: generateId(),
          habit_id: habitId,
          date: today,
          completed: true,
          completedAt: new Date().toISOString(),
          usedMinVersion: useMinVersion
        }]
      }));
    }
  };

  const addHabit = () => {
    if (!newHabit.name) return;

    const habit = {
      id: generateId(),
      ...newHabit,
      created_at: today,
      totalCompletions: 0,
      currentStreak: 0,
      bestStreak: 0,
      freezeDaysUsed: 0
    };

    setData(prev => ({
      ...prev,
      habits: [...prev.habits, habit]
    }));

    setShowAdd(false);
    setNewHabit({
      name: '', icon: '✨', identity: '', why: '', cue: '', location: '', time: '',
      stackedTo: null, minVersion: '', fullVersion: '', frequency: 'daily',
      customDays: [1, 2, 3, 4, 5, 6, 0], category: 'growth'
    });
    showToast('Hábito creado');
  };

  const updateHabit = (habitId, updates) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === habitId ? { ...h, ...updates } : h)
    }));
    showToast('Hábito actualizado');
  };

  const deleteHabit = (id) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id),
      habitLogs: prev.habitLogs?.filter(l => l.habit_id !== id) || []
    }));
    setSelectedHabit(null);
    setView('today');
    showToast('Hábito eliminado');
  };

  // Stats calculations
  const totalCompletions = data.habitLogs?.filter(l => l.completed).length || 0;
  const overallRate = data.habits.length > 0
    ? Math.round(data.habits.reduce((sum, h) => sum + getCompletionRate(h.id, 30), 0) / data.habits.length)
    : 0;
  const bestStreak = Math.max(...data.habits.map(h => getStreakWithFreeze(h.id).best), 0);
  const perfectWeek = isPerfectWeek();

  // ===================== META-HABITS (Auto objectives) =====================

  const metaHabits = [
    {
      id: 'meta_nutrition',
      name: 'Nutrición',
      icon: '🥗',
      type: 'nutrition',
      check: () => {
        const todayMeals = data.meals?.filter(m => m.day_id === today) || [];
        const totalCals = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);
        const targetCals = data.user?.goals?.calories || 2000;
        return totalCals >= targetCals * 0.8;
      },
      progress: () => {
        const todayMeals = data.meals?.filter(m => m.day_id === today) || [];
        const totalCals = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);
        const targetCals = data.user?.goals?.calories || 2000;
        return Math.min(100, Math.round((totalCals / targetCals) * 100));
      }
    },
    {
      id: 'meta_protein',
      name: 'Proteína',
      icon: '💪',
      type: 'nutrition',
      check: () => {
        const todayMeals = data.meals?.filter(m => m.day_id === today) || [];
        const totalProt = todayMeals.reduce((s, m) => s + (m.protein || 0), 0);
        const targetProt = data.user?.goals?.protein || 120;
        return totalProt >= targetProt;
      },
      progress: () => {
        const todayMeals = data.meals?.filter(m => m.day_id === today) || [];
        const totalProt = todayMeals.reduce((s, m) => s + (m.protein || 0), 0);
        const targetProt = data.user?.goals?.protein || 120;
        return Math.min(100, Math.round((totalProt / targetProt) * 100));
      }
    },
    {
      id: 'meta_workout',
      name: 'Entreno',
      icon: '🏋️',
      type: 'workout',
      check: () => {
        const todayWorkout = data.workouts?.find(w => w.day_id === today);
        return todayWorkout?.is_completed || false;
      },
      progress: () => {
        const todayWorkout = data.workouts?.find(w => w.day_id === today);
        if (!todayWorkout) return 0;
        if (todayWorkout.is_completed) return 100;
        const completedSets = todayWorkout.exercises?.reduce((sum, ex) =>
          sum + ex.sets.filter(s => s.completed).length, 0) || 0;
        const totalSets = todayWorkout.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) || 1;
        return Math.round((completedSets / totalSets) * 100);
      }
    },
    {
      id: 'meta_water',
      name: 'Agua',
      icon: '💧',
      type: 'nutrition',
      check: () => {
        const dayData = data.days?.[today];
        const waterGoal = data.user?.goals?.water || 8;
        return (dayData?.water_glasses || 0) >= waterGoal;
      },
      progress: () => {
        const dayData = data.days?.[today];
        const waterGoal = data.user?.goals?.water || 8;
        return Math.min(100, Math.round(((dayData?.water_glasses || 0) / waterGoal) * 100));
      }
    },
    {
      id: 'meta_steps',
      name: '10k pasos',
      icon: '🚶',
      type: 'body',
      check: () => {
        const dayData = data.days?.[today];
        const stepsGoal = data.user?.goals?.steps || 10000;
        return (dayData?.steps || 0) >= stepsGoal;
      },
      progress: () => {
        const dayData = data.days?.[today];
        const stepsGoal = data.user?.goals?.steps || 10000;
        return Math.min(100, Math.round(((dayData?.steps || 0) / stepsGoal) * 100));
      }
    }
  ];

  const activeAreas = data.user?.activeAreas || ['nutrition', 'workout', 'habits', 'work', 'personal', 'body', 'finances', 'consciousness', 'relationships'];
  const visibleMetaHabits = metaHabits.filter(m =>
    (m.type === 'nutrition' && activeAreas.includes('nutrition')) ||
    (m.type === 'workout' && activeAreas.includes('workout')) ||
    (m.type === 'body' && activeAreas.includes('body'))
  );

  // ===================== RENDER ADD MODAL =====================

  const renderAddModal = () => (
    <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nuevo hábito elite">
      {/* Icon selector */}
      <div className="mb-4">
        <p className="text-xs text-white/40 mb-2">Icono</p>
        <div className="flex flex-wrap gap-2">
          {icons.map(i => (
            <button key={i} onClick={() => setNewHabit(p => ({ ...p, icon: i }))} className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center ${newHabit.icon === i ? 'bg-violet-500' : 'bg-white/10'}`}>{i}</button>
          ))}
        </div>
      </div>

      {/* Name */}
      <input
        type="text"
        placeholder="Nombre del hábito *"
        value={newHabit.name}
        onChange={(e) => setNewHabit(p => ({ ...p, name: e.target.value }))}
        className="w-full bg-white/10 rounded-xl p-4 outline-none mb-3"
      />

      {/* Identity */}
      <div className="mb-3">
        <p className="text-xs text-white/40 mb-1">🪪 Identidad (James Clear)</p>
        <input
          type="text"
          placeholder="Soy una persona que..."
          value={newHabit.identity}
          onChange={(e) => setNewHabit(p => ({ ...p, identity: e.target.value }))}
          className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm"
        />
      </div>

      {/* Why */}
      <div className="mb-3">
        <p className="text-xs text-white/40 mb-1">¿Por qué es importante?</p>
        <input
          type="text"
          placeholder="Porque me ayuda a..."
          value={newHabit.why}
          onChange={(e) => setNewHabit(p => ({ ...p, why: e.target.value }))}
          className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm"
        />
      </div>

      {/* Implementation Intention */}
      <div className="mb-3 p-3 bg-white/5 rounded-xl">
        <p className="text-xs text-white/40 mb-2">📍 Implementation Intention</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Después de..."
            value={newHabit.cue}
            onChange={(e) => setNewHabit(p => ({ ...p, cue: e.target.value }))}
            className="bg-white/10 rounded-lg p-2 outline-none text-sm"
          />
          <input
            type="text"
            placeholder="Lugar"
            value={newHabit.location}
            onChange={(e) => setNewHabit(p => ({ ...p, location: e.target.value }))}
            className="bg-white/10 rounded-lg p-2 outline-none text-sm"
          />
        </div>
        <input
          type="time"
          value={newHabit.time}
          onChange={(e) => setNewHabit(p => ({ ...p, time: e.target.value }))}
          className="w-full bg-white/10 rounded-lg p-2 outline-none text-sm mt-2"
        />
      </div>

      {/* Habit Stacking */}
      {data.habits.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-white/40 mb-1">🔗 Encadenar después de:</p>
          <select
            value={newHabit.stackedTo || ''}
            onChange={(e) => setNewHabit(p => ({ ...p, stackedTo: e.target.value || null }))}
            className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm"
          >
            <option value="">Ninguno</option>
            {data.habits.map(h => (
              <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* 2 Minute Rule */}
      <div className="mb-3 p-3 bg-emerald-500/10 rounded-xl">
        <p className="text-xs text-emerald-400 mb-2">⚡ Regla de 2 minutos</p>
        <input
          type="text"
          placeholder="Versión mínima (2 min)"
          value={newHabit.minVersion}
          onChange={(e) => setNewHabit(p => ({ ...p, minVersion: e.target.value }))}
          className="w-full bg-white/10 rounded-lg p-2 outline-none text-sm mb-2"
        />
        <input
          type="text"
          placeholder="Versión completa"
          value={newHabit.fullVersion}
          onChange={(e) => setNewHabit(p => ({ ...p, fullVersion: e.target.value }))}
          className="w-full bg-white/10 rounded-lg p-2 outline-none text-sm"
        />
      </div>

      {/* Frequency */}
      <div className="mb-3">
        <p className="text-xs text-white/40 mb-2">📅 Frecuencia</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'daily', label: 'Diario' },
            { id: 'weekdays', label: 'L-V' },
            { id: 'weekend', label: 'Fines' },
            { id: 'custom', label: 'Custom' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setNewHabit(p => ({ ...p, frequency: f.id }))}
              className={`px-3 py-1.5 rounded-lg text-sm ${newHabit.frequency === f.id ? 'bg-violet-500' : 'bg-white/10'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {newHabit.frequency === 'custom' && (
          <div className="flex gap-1 mt-2">
            {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const dayNum = idx === 0 ? 0 : idx;
                  setNewHabit(p => ({
                    ...p,
                    customDays: p.customDays.includes(dayNum)
                      ? p.customDays.filter(d => d !== dayNum)
                      : [...p.customDays, dayNum]
                  }));
                }}
                className={`w-8 h-8 rounded-lg text-xs ${newHabit.customDays.includes(idx === 0 ? 0 : idx) ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-4">
        <p className="text-xs text-white/40 mb-2">Categoría</p>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setNewHabit(p => ({ ...p, category: c.id }))}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${newHabit.category === c.id ? `bg-${c.color}-500` : 'bg-white/10'}`}
            >
              <span>{c.icon}</span> {c.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={addHabit}
        disabled={!newHabit.name}
        className={`w-full py-4 rounded-xl font-medium ${newHabit.name ? 'bg-violet-500' : 'bg-white/10 text-white/30'}`}
      >
        Crear hábito
      </button>
    </Modal>
  );

  // ===================== RENDER DETAIL VIEW =====================

  const renderDetailView = () => {
    const habit = selectedHabit;
    if (!habit) return null;

    const streak = getStreakWithFreeze(habit.id, localSettings.freezeDaysPerMonth);
    const completionRate = getCompletionRate(habit.id, 30);
    const masteryLevel = getMasteryLevel(habit.id);
    const failPatterns = getFailPatterns(habit.id);
    const missedYesterday = getMissedYesterday(habit.id);
    const habitTotalCompletions = data.habitLogs?.filter(l => l.habit_id === habit.id && l.completed).length || 0;

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = getDateOffset(today, -i);
      const log = data.habitLogs?.find(l => l.habit_id === habit.id && l.date === date);
      const shouldDo = shouldDoHabitOnDay(habit, date);
      return { date, completed: log?.completed, shouldDo, usedMinVersion: log?.usedMinVersion };
    }).reverse();

    const masteryLabels = ['Principiante', 'Aprendiz', 'Intermedio', 'Avanzado', 'Maestro'];
    const masteryColors = ['bg-gray-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'];

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <button onClick={() => { setView('today'); setSelectedHabit(null); }} className="flex items-center gap-2 text-white/50 mb-2">
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{habit.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{habit.name}</h1>
              {habit.identity && <p className="text-sm text-violet-400 italic">"{habit.identity}"</p>}
            </div>
          </div>
        </AnimatedMount>

        {/* Never Miss Twice Alert */}
        {missedYesterday && (
          <AnimatedMount delay={25}>
            <Card className="bg-red-500/20 border-red-500/30">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="font-medium text-red-300">¡No falles dos veces!</p>
                  <p className="text-sm text-red-400/70">Ayer no completaste este hábito. Hoy es crucial.</p>
                </div>
              </div>
            </Card>
          </AnimatedMount>
        )}

        {/* Stats Grid */}
        <AnimatedMount delay={50}>
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center">
              <p className="text-2xl font-bold text-orange-400">{streak.current}</p>
              <p className="text-[10px] text-white/40">Racha actual 🔥</p>
              {streak.freezeUsed > 0 && <p className="text-[9px] text-blue-400">❄️ {streak.freezeUsed} freeze</p>}
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{completionRate}%</p>
              <p className="text-[10px] text-white/40">Último mes</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-bold text-violet-400">{habitTotalCompletions}</p>
              <p className="text-[10px] text-white/40">Total</p>
            </Card>
          </div>
        </AnimatedMount>

        {/* Mastery Level */}
        <AnimatedMount delay={75}>
          <Card>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Nivel de maestría</p>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${masteryColors[masteryLevel - 1]}`}>
                {masteryLabels[masteryLevel - 1]}
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={`flex-1 h-2 rounded ${level <= masteryLevel ? masteryColors[masteryLevel - 1] : 'bg-white/10'}`}
                />
              ))}
            </div>
          </Card>
        </AnimatedMount>

        {/* 30 Day History */}
        <AnimatedMount delay={100}>
          <Card>
            <p className="text-sm font-medium mb-3">Últimos 30 días</p>
            <div className="grid grid-cols-10 gap-1">
              {last30Days.map((day, i) => (
                <div
                  key={i}
                  title={day.date}
                  className={`aspect-square rounded-sm ${!day.shouldDo ? 'bg-white/5' :
                    day.completed ? (day.usedMinVersion ? 'bg-emerald-500/50' : 'bg-emerald-500') :
                      'bg-red-500/30'
                    }`}
                />
              ))}
            </div>
            <div className="flex gap-4 mt-2 text-[9px] text-white/40">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-sm" /> Completo</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500/50 rounded-sm" /> Mínimo</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500/30 rounded-sm" /> Fallado</span>
            </div>
          </Card>
        </AnimatedMount>

        {/* Fail Patterns */}
        {failPatterns.days.length > 0 && (
          <AnimatedMount delay={125}>
            <Card className="bg-amber-500/10 border-amber-500/20">
              <p className="text-sm font-medium text-amber-300 mb-2">⚠️ Patrón de fallos</p>
              <p className="text-xs text-amber-400/70">
                Sueles fallar más los: {failPatterns.days.map(d => d.day).join(', ')}
              </p>
            </Card>
          </AnimatedMount>
        )}

        {/* Implementation Details */}
        {(habit.cue || habit.location || habit.time) && (
          <AnimatedMount delay={150}>
            <Card>
              <p className="text-sm font-medium mb-2">📍 Plan de implementación</p>
              {habit.cue && <p className="text-xs text-white/60">Después de: {habit.cue}</p>}
              {habit.location && <p className="text-xs text-white/60">Lugar: {habit.location}</p>}
              {habit.time && <p className="text-xs text-white/60">Hora: {habit.time}</p>}
            </Card>
          </AnimatedMount>
        )}

        {/* Why */}
        {habit.why && (
          <AnimatedMount delay={175}>
            <Card>
              <p className="text-sm font-medium mb-2">💡 Por qué</p>
              <p className="text-xs text-white/60">{habit.why}</p>
            </Card>
          </AnimatedMount>
        )}

        {/* Delete Button */}
        <AnimatedMount delay={200}>
          <button
            onClick={() => deleteHabit(habit.id)}
            className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Eliminar hábito
          </button>
        </AnimatedMount>
      </div>
    );
  };

  // ===================== RENDER HISTORY VIEW =====================

  const renderHistoryView = () => {
    const weekDates = getWeekDates(historyDate);

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <button onClick={() => setView('today')} className="flex items-center gap-2 text-white/50 mb-2">
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
          <h1 className="text-2xl font-bold">Historial</h1>
        </AnimatedMount>

        {/* Week Navigation */}
        <AnimatedMount delay={50}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setHistoryDate(getDateOffset(historyDate, -7))} className="p-2 hover:bg-white/10 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <p className="text-sm font-medium">
                {new Date(weekDates[0]).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {new Date(weekDates[6]).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </p>
              <button onClick={() => setHistoryDate(getDateOffset(historyDate, 7))} className="p-2 hover:bg-white/10 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-8 gap-1">
              <div />
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={i} className="text-center text-xs text-white/40">{day}</div>
              ))}

              {data.habits.map(habit => (
                <React.Fragment key={habit.id}>
                  <div className="text-sm truncate flex items-center">{habit.icon}</div>
                  {weekDates.map((date, i) => {
                    const log = data.habitLogs?.find(l => l.habit_id === habit.id && l.date === date);
                    const shouldDo = shouldDoHabitOnDay(habit, date);
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded flex items-center justify-center text-xs ${!shouldDo ? 'bg-white/5 text-white/20' :
                          log?.completed ? 'bg-emerald-500 text-white' :
                            'bg-red-500/30 text-red-300'
                          }`}
                      >
                        {shouldDo && (log?.completed ? '✓' : '✗')}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </AnimatedMount>

        {/* Week Summary */}
        <AnimatedMount delay={100}>
          <Card>
            <p className="text-sm font-medium mb-3">Resumen semanal</p>
            {data.habits.map(habit => {
              let weekCompletions = 0;
              let weekShouldDo = 0;
              weekDates.forEach(date => {
                if (shouldDoHabitOnDay(habit, date)) {
                  weekShouldDo++;
                  if (data.habitLogs?.find(l => l.habit_id === habit.id && l.date === date && l.completed)) weekCompletions++;
                }
              });
              const rate = weekShouldDo > 0 ? Math.round((weekCompletions / weekShouldDo) * 100) : 0;

              return (
                <div key={habit.id} className="flex items-center gap-3 py-2">
                  <span>{habit.icon}</span>
                  <span className="flex-1 text-sm">{habit.name}</span>
                  <span className="text-sm text-white/60">{weekCompletions}/{weekShouldDo}</span>
                  <span className={`text-sm font-medium ${rate >= 80 ? 'text-emerald-400' : rate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {rate}%
                  </span>
                </div>
              );
            })}
          </Card>
        </AnimatedMount>
      </div>
    );
  };

  // ===================== EMPTY STATE =====================

  if (!data.habits.length) {
    return (
      <div className="pb-24">
        <AnimatedMount><h1 className="text-2xl font-bold mb-6">Hábitos</h1></AnimatedMount>
        <EmptyState
          icon={CheckSquare}
          title="Construye tu identidad"
          description="Los hábitos son los ladrillos de quien quieres ser"
          action="Crear primer hábito"
          onAction={() => setShowAdd(true)}
        />
        {renderAddModal()}
      </div>
    );
  }

  // ===================== MAIN TODAY VIEW =====================

  if (view === 'detail') return renderDetailView();
  if (view === 'history') return renderHistoryView();

  const habitStats = data.habits.map(habit => {
    const streak = getStreakWithFreeze(habit.id, localSettings.freezeDaysPerMonth);
    const completionRate = getCompletionRate(habit.id, 30);
    const masteryLevel = getMasteryLevel(habit.id);
    const totalDone = data.habitLogs?.filter(l => l.habit_id === habit.id && l.completed).length || 0;
    return { habit, streak, completionRate, masteryLevel, totalDone };
  }).sort((a, b) => b.streak.current - a.streak.current);

  const avgStreak = data.habits.length > 0
    ? Math.round(habitStats.reduce((sum, h) => sum + h.streak.current, 0) / data.habits.length)
    : 0;

  const needsAttention = habitStats.filter(h => h.completionRate < 50).sort((a, b) => a.completionRate - b.completionRate);

  return (
    <div className="space-y-4 pb-24">
      <AnimatedMount>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hábitos</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('history')} className="p-3 hover:bg-white/10 rounded-full">
              <Calendar className="w-5 h-5 text-white/50" />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-3 hover:bg-white/10 rounded-full">
              <Settings className="w-5 h-5 text-white/50" />
            </button>
            <button onClick={() => setShowAdd(true)} className="bg-violet-500 rounded-full p-3">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </AnimatedMount>

      {/* Main Summary Card */}
      <AnimatedMount delay={50}>
        <Card className="bg-gradient-to-br from-emerald-500/20 via-violet-500/10 to-fuchsia-500/20 border-emerald-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="url(#mainGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${todayHabits.length > 0 ? (todayCompletedCount / todayHabits.length) * 214 : 0} 214`}
                />
                <defs>
                  <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{todayHabits.length > 0 ? Math.round((todayCompletedCount / todayHabits.length) * 100) : 0}%</span>
                <span className="text-[9px] text-white/40">hoy</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-lg">{todayCompletedCount}/{todayHabits.length} completados</p>
                {perfectWeek && <span className="text-amber-400 text-sm">🏆</span>}
              </div>
              <p className="text-sm text-white/50">
                {todayCompletedCount === todayHabits.length && todayHabits.length > 0
                  ? '¡Día perfecto! Sigue así 💪'
                  : `${todayHabits.length - todayCompletedCount} pendiente${todayHabits.length - todayCompletedCount !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10">
            <div className="text-center">
              <p className="text-lg font-bold text-orange-400">{bestStreak}</p>
              <p className="text-[9px] text-white/40">Mejor 🔥</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-400">{avgStreak}</p>
              <p className="text-[9px] text-white/40">Media 🔥</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-400">{overallRate}%</p>
              <p className="text-[9px] text-white/40">30 días</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-violet-400">{totalCompletions}</p>
              <p className="text-[9px] text-white/40">Total ✓</p>
            </div>
          </div>
        </Card>
      </AnimatedMount>

      {/* Meta-Habits (Auto from other areas) */}
      {visibleMetaHabits.length > 0 && (
        <AnimatedMount delay={75}>
          <div>
            <p className="text-xs text-white/40 mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" /> OBJETIVOS AUTO <span className="text-white/20">(80% = ✓)</span>
            </p>
            <Card>
              <div className="grid grid-cols-2 gap-2">
                {visibleMetaHabits.map(meta => {
                  const isCompleted = meta.check();
                  const progress = meta.progress();
                  return (
                    <div
                      key={meta.id}
                      className={`flex items-center gap-2 p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/20' : 'bg-white/5'}`}
                    >
                      <span className="text-lg">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${isCompleted ? 'text-emerald-400' : 'text-white/70'}`}>{meta.name}</span>
                          <span className="text-[10px] text-white/40">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-1">
                          <div
                            className={`h-full rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-orange-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      {isCompleted && <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </AnimatedMount>
      )}

      {/* Ranking Rachas */}
      {habitStats.length >= 2 && (
        <AnimatedMount delay={100}>
          <div>
            <p className="text-xs text-white/40 mb-2 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> RANKING RACHAS
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {habitStats.slice(0, 4).map((item, idx) => (
                <Card
                  key={item.habit.id}
                  className={`flex-shrink-0 w-24 text-center cursor-pointer ${idx === 0 ? 'bg-amber-500/10 border-amber-500/30' : ''}`}
                  onClick={() => { setSelectedHabit(item.habit); setView('detail'); }}
                >
                  <span className="text-2xl">{item.habit.icon}</span>
                  <p className="text-lg font-bold text-orange-400 mt-1">{item.streak.current}🔥</p>
                  <p className="text-[9px] text-white/40 truncate">{item.habit.name}</p>
                  {idx === 0 && <p className="text-[8px] text-amber-400 mt-1">👑 Líder</p>}
                </Card>
              ))}
            </div>
          </div>
        </AnimatedMount>
      )}

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <AnimatedMount delay={125}>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <p className="text-sm font-medium text-amber-300">Necesitan atención</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {needsAttention.slice(0, 3).map(item => (
                <button
                  key={item.habit.id}
                  onClick={() => { setSelectedHabit(item.habit); setView('detail'); }}
                  className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg"
                >
                  <span>{item.habit.icon}</span>
                  <span className="text-xs">{item.habit.name}</span>
                  <span className="text-[10px] text-red-400">{item.completionRate}%</span>
                </button>
              ))}
            </div>
          </Card>
        </AnimatedMount>
      )}

      {/* Today's Habits */}
      <AnimatedMount delay={150}>
        <div>
          <p className="text-xs text-white/40 mb-2">HOY</p>
          <div className="space-y-2">
            {data.habits.map(habit => {
              const log = dayHabitLogs.find(h => h.habit.id === habit.id);
              const isCompleted = log?.completed || false;
              const usedMinVersion = log?.usedMinVersion || false;
              const shouldDoToday = shouldDoHabitOnDay(habit, today);
              const streak = getStreakWithFreeze(habit.id, localSettings.freezeDaysPerMonth);
              const missedYesterday = getMissedYesterday(habit.id);
              const masteryLevel = getMasteryLevel(habit.id);
              const stackedHabit = habit.stackedTo ? data.habits.find(h => h.id === habit.stackedTo) : null;
              const completionRate = getCompletionRate(habit.id, 30);

              if (!shouldDoToday) return null;

              return (
                <div key={habit.id} className="relative">
                  {missedYesterday && !isCompleted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse z-10" />
                  )}

                  <SwipeableItem onDelete={() => deleteHabit(habit.id)}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCompleted ? 'bg-emerald-500/20' : 'bg-white/5'} ${missedYesterday && !isCompleted ? 'ring-1 ring-red-500/50' : ''}`}>
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-white/50'
                          }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-xl">{habit.icon}</span>}
                      </button>

                      <button
                        className="flex-1 text-left"
                        onClick={() => { setSelectedHabit(habit); setView('detail'); }}
                      >
                        <div className="flex items-center gap-2">
                          <p className={isCompleted ? 'line-through text-white/50' : 'font-medium'}>{habit.name}</p>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(l => (
                              <div key={l} className={`w-1.5 h-1.5 rounded-full ${l <= masteryLevel ? 'bg-violet-400' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-0.5">
                          {streak.current > 0 && (
                            <span className="text-xs text-orange-400">{streak.current}🔥</span>
                          )}
                          <span className="text-[10px] text-white/30">{completionRate}% mes</span>
                          {stackedHabit && (
                            <span className="text-[10px] text-white/40">→ {stackedHabit.icon}</span>
                          )}
                          {habit.time && (
                            <span className="text-[10px] text-white/30">{habit.time}</span>
                          )}
                          {usedMinVersion && isCompleted && (
                            <span className="text-[10px] text-emerald-400/60">⚡ mínimo</span>
                          )}
                        </div>
                      </button>

                      {!isCompleted && habit.minVersion && (
                        <button
                          onClick={() => toggleHabit(habit.id, true)}
                          className="px-2 py-1 bg-emerald-500/20 rounded-lg text-[10px] text-emerald-400"
                          title="Versión mínima"
                        >
                          ⚡ 2min
                        </button>
                      )}

                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  </SwipeableItem>
                </div>
              );
            })}

            {/* Habits not for today */}
            {data.habits.filter(h => !shouldDoHabitOnDay(h, today)).length > 0 && (
              <div className="pt-2 mt-2 border-t border-white/10">
                <p className="text-[10px] text-white/30 mb-2">No programados hoy:</p>
                <div className="flex flex-wrap gap-2">
                  {data.habits.filter(h => !shouldDoHabitOnDay(h, today)).map(habit => (
                    <button
                      key={habit.id}
                      onClick={() => { setSelectedHabit(habit); setView('detail'); }}
                      className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-white/40"
                    >
                      <span>{habit.icon}</span>
                      <span className="text-xs">{habit.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatedMount>

      {/* Weekly Insights */}
      <AnimatedMount delay={175}>
        <Card>
          <p className="text-sm font-medium mb-3">📊 Esta semana</p>
          <div className="flex gap-1 mb-3">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => {
              const weekDates = getWeekDates(today);
              const date = weekDates[idx];
              const isToday = date === today;
              const dayLogs = data.habitLogs?.filter(l => l.date === date && l.completed) || [];
              const dayHabitsCount = data.habits.filter(h => shouldDoHabitOnDay(h, date)).length;
              const percentage = dayHabitsCount > 0 ? dayLogs.length / dayHabitsCount : 0;

              return (
                <div key={idx} className={`flex-1 text-center py-2 rounded-lg ${isToday ? 'bg-violet-500/20 ring-1 ring-violet-500/50' : ''}`}>
                  <p className="text-[9px] text-white/40">{day}</p>
                  <div className={`w-6 h-6 mx-auto mt-1 rounded-full flex items-center justify-center text-[10px] font-medium
                    ${percentage === 1 ? 'bg-emerald-500 text-white' :
                      percentage >= 0.5 ? 'bg-emerald-500/30 text-emerald-300' :
                        percentage > 0 ? 'bg-amber-500/30 text-amber-300' :
                          'bg-white/5 text-white/30'}
                  `}>
                    {percentage === 1 ? '✓' : Math.round(percentage * 100) || '-'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Week completion rate */}
          {(() => {
            const weekDates = getWeekDates(today);
            let weekTotal = 0, weekCompleted = 0;
            weekDates.forEach(date => {
              data.habits.forEach(h => {
                if (shouldDoHabitOnDay(h, date)) {
                  weekTotal++;
                  if (data.habitLogs?.find(l => l.habit_id === h.id && l.date === date && l.completed)) weekCompleted++;
                }
              });
            });
            const weekRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

            return (
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-sm text-white/60">Completado esta semana</span>
                <span className={`text-sm font-bold ${weekRate >= 80 ? 'text-emerald-400' : weekRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {weekRate}%
                </span>
              </div>
            );
          })()}
        </Card>
      </AnimatedMount>

      {/* Tip Card for Never Miss Twice */}
      {dayHabitLogs.some(h => getMissedYesterday(h.habit.id) && !h.completed) && (
        <AnimatedMount delay={200}>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-300">Regla de oro</p>
                <p className="text-xs text-amber-400/70">"Nunca falles dos veces seguidas" - La recuperación es más importante que la perfección.</p>
              </div>
            </div>
          </Card>
        </AnimatedMount>
      )}

      {renderAddModal()}

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Configuración Hábitos"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Mostrar rachas</p>
              <p className="text-sm text-white/50">Ver días consecutivos</p>
            </div>
            <button
              onClick={() => setLocalSettings(p => ({ ...p, showStreaks: !p.showStreaks }))}
              className={`w-12 h-7 rounded-full transition-colors ${localSettings.showStreaks ? 'bg-violet-500' : 'bg-white/20'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings.showStreaks ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Mostrar identidad</p>
              <p className="text-sm text-white/50">Ver "Soy una persona que..."</p>
            </div>
            <button
              onClick={() => setLocalSettings(p => ({ ...p, showIdentity: !p.showIdentity }))}
              className={`w-12 h-7 rounded-full transition-colors ${localSettings.showIdentity ? 'bg-violet-500' : 'bg-white/20'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings.showIdentity ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Días de gracia por mes (freeze)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="5"
                value={localSettings.freezeDaysPerMonth}
                onChange={(e) => setLocalSettings(p => ({ ...p, freezeDaysPerMonth: parseInt(e.target.value) }))}
                className="flex-1 accent-violet-500"
              />
              <span className="text-xl font-bold w-8">{localSettings.freezeDaysPerMonth}</span>
            </div>
            <p className="text-xs text-white/40 mt-1">Días que puedes fallar sin romper la racha</p>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Hora recordatorio</label>
            <input
              type="time"
              value={localSettings.reminderTime}
              onChange={(e) => setLocalSettings(p => ({ ...p, reminderTime: e.target.value }))}
              className="w-full bg-white/10 rounded-xl p-4 outline-none"
            />
          </div>

          <button onClick={saveSettings} className="w-full py-4 bg-violet-500 rounded-xl font-medium">
            Guardar cambios
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================================
// WORK SCREEN - Elite GTD + Eisenhower System
// ============================================================================


export default HabitsScreen;
