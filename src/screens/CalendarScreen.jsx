// CalendarScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Check, Utensils, Dumbbell, Target, X, Edit3, Trash2 } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { calculateDayScore } from '../utils/score';
import { getScoreColor, getScoreHexColor } from '../utils/formatting';
import { Card, Modal, AnimatedMount, ProgressBar, EmptyState } from '../components/ui';

const CalendarScreen = ({ data, setData, setScreen, showToast }) => {
  const today = getToday();
  const [view, setView] = useState('week'); // 'day', 'week', 'month', 'quarter'
  const [selectedDate, setSelectedDate] = useState(today);
  const [showEventDetail, setShowEventDetail] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPendingPanel, setShowPendingPanel] = useState(false);
  const [weekMode, setWeekMode] = useState(7); // 4 or 7 days

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthNamesShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const dayLabelsFull = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  // Get visible dates based on weekMode
  const getVisibleDates = (baseDate, mode) => {
    if (mode === 7) {
      return getWeekDates(baseDate);
    } else {
      const dates = [];
      const base = new Date(baseDate + 'T12:00:00');
      for (let i = 0; i < 4; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
      }
      return dates;
    }
  };

  // Helper: check if habit should show on day
  const shouldDoHabitOnDay = (habit, date) => {
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();
    if (!habit.frequency || habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (habit.frequency === 'weekend') return dayOfWeek === 0 || dayOfWeek === 6;
    if (habit.frequency === 'custom') return (habit.customDays || [1, 2, 3, 4, 5, 6, 0]).includes(dayOfWeek);
    return true;
  };

  // ========== SCHEDULED EVENTS (with specific time) ==========
  const getScheduledEvents = (date) => {
    const events = [];

    // Work tasks WITH scheduled time
    (data.workTasks || []).filter(t =>
      (t.dueDate === date || t.scheduledDate === date) && t.scheduledTime
    ).forEach(task => {
      const project = (data.workProjects || []).find(p => p.id === task.project_id);
      events.push({
        id: `task-${task.id}`, type: 'task', sourceId: task.id, title: task.title,
        time: task.scheduledTime, duration: task.timeEstimate || 60,
        color: project?.color || '#8B5CF6', icon: '💼',
        completed: task.status === 'done', priority: task.priority,
        project: project?.name
      });
    });

    // Habits WITH specific time
    (data.habits || []).forEach(habit => {
      if (!shouldDoHabitOnDay(habit, date)) return;
      if (!habit.time) return; // Skip habits without time
      const log = (data.habitLogs || []).find(l => l.habit_id === habit.id && l.date === date);
      events.push({
        id: `habit-${habit.id}-${date}`, type: 'habit', sourceId: habit.id, title: habit.name,
        time: habit.time, duration: 15, color: '#10B981', icon: habit.icon || '✅',
        completed: log?.completed || false
      });
    });

    // Workouts WITH scheduled time
    const workout = (data.workouts || []).find(w => w.day_id === date);
    if (workout && workout.scheduledTime) {
      events.push({
        id: `workout-${workout.id}`, type: 'workout', sourceId: workout.id, title: workout.name,
        time: workout.scheduledTime, duration: 60, color: '#A855F7', icon: '💪',
        completed: workout.is_completed
      });
    }

    // Meals (always have implicit times)
    const mealSlots = [
      { key: 'desayuno', time: '08:00', label: 'Desayuno', icon: '🍳' },
      { key: 'almuerzo', time: '13:30', label: 'Almuerzo', icon: '🍽️' },
      { key: 'cena', time: '20:30', label: 'Cena', icon: '🌙' }
    ];
    const dayMeals = (data.meals || []).filter(m => m.day_id === date);
    mealSlots.forEach(slot => {
      const meals = dayMeals.filter(m => m.meal_type === slot.key);
      if (meals.length > 0) {
        const cals = meals.reduce((s, m) => s + (m.calories || 0), 0);
        events.push({
          id: `meal-${date}-${slot.key}`, type: 'meal', title: `${slot.label} (${cals} kcal)`,
          time: slot.time, duration: 30, color: '#F59E0B', icon: slot.icon, completed: true
        });
      }
    });

    return events.sort((a, b) => a.time.localeCompare(b.time));
  };

  // ========== PENDING TASKS (without specific time) ==========
  const getPendingTasks = (date) => {
    const pending = [];

    // Work tasks WITHOUT time
    (data.workTasks || []).filter(t =>
      (t.dueDate === date || t.scheduledDate === date) && !t.scheduledTime && t.status !== 'done'
    ).forEach(task => {
      const project = (data.workProjects || []).find(p => p.id === task.project_id);
      pending.push({
        id: task.id, type: 'work', title: task.title,
        icon: '💼', color: project?.color || '#8B5CF6',
        priority: task.priority, project: project?.name
      });
    });

    // Daily tasks (from Today screen)
    (data.tasks || []).filter(t => t.day_id === date && !t.completed).forEach(task => {
      pending.push({
        id: task.id, type: 'daily', title: task.title,
        icon: '📋', color: '#6366F1'
      });
    });

    // Personal tasks for this date
    (data.personalTasks || []).filter(t => t.dueDate === date && !t.completed).forEach(task => {
      const catIcons = { casa: '🏠', vehiculo: '🚗', salud: '🏥', tramites: '📋', compras: '🛒', cuidado: '👤', gestiones: '📞' };
      pending.push({
        id: task.id, type: 'personal', title: task.title,
        icon: catIcons[task.category] || '📌', color: '#14B8A6',
        important: task.important
      });
    });

    // Habits WITHOUT time (not completed)
    (data.habits || []).forEach(habit => {
      if (!shouldDoHabitOnDay(habit, date)) return;
      if (habit.time) return; // Skip habits with time
      const log = (data.habitLogs || []).find(l => l.habit_id === habit.id && l.date === date);
      if (!log?.completed) {
        pending.push({
          id: habit.id, type: 'habit', title: habit.name,
          icon: habit.icon || '✅', color: '#10B981'
        });
      }
    });

    // Workout WITHOUT time (not completed)
    const workout = (data.workouts || []).find(w => w.day_id === date);
    if (workout && !workout.scheduledTime && !workout.is_completed) {
      pending.push({
        id: workout.id, type: 'workout', title: workout.name,
        icon: '💪', color: '#A855F7'
      });
    }

    return pending;
  };

  const toggleEvent = (event) => {
    if (event.type === 'task') {
      setData(prev => ({ ...prev, workTasks: prev.workTasks.map(t => t.id === event.sourceId ? { ...t, status: t.status === 'done' ? 'todo' : 'done', completedDate: t.status !== 'done' ? today : null } : t) }));
    } else if (event.type === 'habit') {
      const dateFromId = event.id.split('-').pop();
      const existingLog = data.habitLogs?.find(l => l.habit_id === event.sourceId && l.date === dateFromId);
      if (existingLog) {
        setData(prev => ({ ...prev, habitLogs: prev.habitLogs.map(l => l.id === existingLog.id ? { ...l, completed: !l.completed } : l) }));
      } else {
        setData(prev => ({ ...prev, habitLogs: [...(prev.habitLogs || []), { id: crypto.randomUUID(), habit_id: event.sourceId, date: dateFromId, completed: true }] }));
      }
    } else if (event.type === 'workout') {
      setData(prev => ({ ...prev, workouts: prev.workouts.map(w => w.id === event.sourceId ? { ...w, is_completed: !w.is_completed } : w) }));
    }
    showToast(event.completed ? 'Desmarcado' : '✓ Completado');
  };

  const getEventStyle = (event) => {
    const [h, m] = event.time.split(':').map(Number);
    const startMinutes = (h - 6) * 60 + m;
    const top = (startMinutes / (17 * 60)) * 100;
    const height = Math.max((event.duration / (17 * 60)) * 100, 3.5);
    return { top: `${top}%`, height: `${height}%` };
  };

  const goWeek = (dir) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir * weekMode);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // ========== WEEK VIEW ==========
  const renderWeekView = () => {
    const visibleDates = getVisibleDates(selectedDate, weekMode);
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const nowPosition = ((currentHour - 6) * 60 + currentMinute) / (17 * 60) * 100;
    const periodPending = visibleDates.reduce((sum, date) => sum + getPendingTasks(date).length, 0);

    const getDayLabel = (date) => {
      const d = new Date(date + 'T12:00:00');
      const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
      return weekMode === 7 ? dayLabels[dayIdx] : dayLabelsFull[dayIdx];
    };

    return (
      <div className="space-y-2">
        {/* Week navigation with mode toggle */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => goWeek(-1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex items-center gap-3">
            <p className="text-sm text-white/60">
              {new Date(visibleDates[0] + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} - {new Date(visibleDates[visibleDates.length - 1] + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            </p>
            {/* 4/7 toggle */}
            <div className="flex bg-white/10 rounded-lg p-0.5">
              <button onClick={() => setWeekMode(4)} className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${weekMode === 4 ? 'bg-violet-500' : 'text-white/50'}`}>4d</button>
              <button onClick={() => setWeekMode(7)} className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${weekMode === 7 ? 'bg-violet-500' : 'text-white/50'}`}>7d</button>
            </div>
          </div>
          <button onClick={() => goWeek(1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Day headers with pending badges */}
        <div className="flex">
          <div className="w-10 flex-shrink-0" />
          {visibleDates.map((date) => {
            const d = new Date(date + 'T12:00:00');
            const isToday = date === today;
            const pendingCount = getPendingTasks(date).length;
            return (
              <button key={date} onClick={() => { setSelectedDate(date); setView('day'); }}
                className={`flex-1 text-center py-2 relative ${isToday ? 'bg-violet-500/20 rounded-t-xl' : 'hover:bg-white/5'}`}>
                <p className={`text-[10px] ${isToday ? 'text-violet-400' : 'text-white/40'}`}>{getDayLabel(date)}</p>
                <p className={`${weekMode === 4 ? 'text-xl' : 'text-lg'} font-bold ${isToday ? 'text-violet-400' : ''}`}>{d.getDate()}</p>
                {pendingCount > 0 && (
                  <div className={`absolute -top-1 -right-1 ${weekMode === 4 ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px]'} bg-amber-500 rounded-full font-bold text-black flex items-center justify-center`}>
                    {pendingCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Timeline grid */}
        <div className="relative bg-zinc-900/50 rounded-xl overflow-hidden" style={{ height: '420px' }}>
          <div className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className="relative" style={{ height: `${hours.length * 50}px` }}>
              {hours.map((hour, idx) => (
                <div key={hour} className="absolute w-full flex" style={{ top: `${idx * 50}px`, height: '50px' }}>
                  <div className="w-10 flex-shrink-0 text-[10px] text-white/30 text-right pr-2 -mt-2">{hour}:00</div>
                  <div className="flex-1 border-t border-white/5" />
                </div>
              ))}

              {visibleDates.includes(today) && nowPosition >= 0 && nowPosition <= 100 && (
                <div className="absolute left-10 right-0 flex items-center z-20" style={{ top: `${nowPosition}%` }}>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="flex-1 h-0.5 bg-red-500" />
                </div>
              )}

              <div className="absolute left-10 right-0 top-0 bottom-0 flex">
                {visibleDates.map((date) => {
                  const events = getScheduledEvents(date);
                  const isToday = date === today;
                  return (
                    <div key={date} className={`flex-1 relative border-l border-white/5 ${isToday ? 'bg-violet-500/5' : ''}`}>
                      {events.map(event => (
                        <button key={event.id} onClick={() => setShowEventDetail(event)}
                          className={`absolute left-0.5 right-0.5 rounded-md px-1 py-0.5 text-left overflow-hidden transition-all hover:opacity-90 ${event.completed ? 'opacity-50' : ''}`}
                          style={{ ...getEventStyle(event), backgroundColor: event.color + '40', borderLeft: `3px solid ${event.color}` }}>
                          <p className={`${weekMode === 4 ? 'text-[10px]' : 'text-[9px]'} font-medium truncate ${event.completed ? 'line-through' : ''}`}>{event.icon} {event.title}</p>
                          <p className={`${weekMode === 4 ? 'text-[9px]' : 'text-[8px]'} text-white/50`}>{event.time}</p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pending summary */}
        {periodPending > 0 && (
          <button onClick={() => setShowPendingPanel(true)}
            className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between hover:bg-amber-500/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black font-bold text-lg">
                {periodPending}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Pendientes sin hora</p>
                <p className="text-xs text-white/50">Tareas flexibles ({weekMode === 7 ? 'semana' : '4 días'})</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400" />
          </button>
        )}
      </div>
    );
  };

  // ========== DAY VIEW ==========
  const renderDayView = () => {
    const events = getScheduledEvents(selectedDate);
    const pending = getPendingTasks(selectedDate);
    const dateInfo = new Date(selectedDate + 'T12:00:00');
    const dayName = dateInfo.toLocaleDateString('es-ES', { weekday: 'long' });
    const isToday = selectedDate === today;
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const nowPosition = ((currentHour - 6) * 60 + currentMinute) / (17 * 60) * 100;

    return (
      <div className="space-y-3">
        {/* Date header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedDate(getDateOffset(selectedDate, -1))} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => setSelectedDate(today)} className="text-center">
            <p className="text-3xl font-bold">{dateInfo.getDate()}</p>
            <p className="text-sm text-white/60 capitalize">{dayName}</p>
            {isToday && <span className="text-[10px] text-violet-400 font-medium">HOY</span>}
          </button>
          <button onClick={() => setSelectedDate(getDateOffset(selectedDate, 1))} className="p-2 hover:bg-white/10 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Pending tasks panel (flexible/no time) */}
        {pending.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
                  {pending.length}
                </div>
                <span className="text-sm font-medium text-amber-200">Pendiente (flexible)</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {pending.slice(0, 4).map(task => (
                <div key={`${task.type}-${task.id}`} className="flex items-center gap-2 bg-black/20 rounded-lg px-2 py-1.5">
                  <span className="text-sm">{task.icon}</span>
                  <span className="text-sm flex-1 truncate">{task.title}</span>
                  {task.priority === 'high' && <span className="text-red-400 text-xs font-bold">!</span>}
                </div>
              ))}
              {pending.length > 4 && (
                <p className="text-xs text-amber-400/70 text-center">+{pending.length - 4} más</p>
              )}
            </div>
          </div>
        )}

        {/* Timeline (scheduled events only) */}
        <div className="relative bg-zinc-900/50 rounded-xl overflow-hidden" style={{ height: pending.length > 0 ? '320px' : '400px' }}>
          <div className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className="relative" style={{ height: `${hours.length * 50}px` }}>
              {hours.map((hour, idx) => (
                <div key={hour} className="absolute w-full flex items-start" style={{ top: `${idx * 50}px`, height: '50px' }}>
                  <div className="w-12 flex-shrink-0 text-xs text-white/30 text-right pr-2 -mt-2">{hour}:00</div>
                  <div className="flex-1 border-t border-white/10" />
                </div>
              ))}

              {isToday && nowPosition >= 0 && nowPosition <= 100 && (
                <div className="absolute left-12 right-0 flex items-center z-20" style={{ top: `${nowPosition}%` }}>
                  <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5" />
                  <div className="flex-1 h-0.5 bg-red-500" />
                </div>
              )}

              <div className="absolute left-14 right-2 top-0 bottom-0">
                {events.length > 0 ? events.map(event => (
                  <button key={event.id} onClick={() => setShowEventDetail(event)}
                    className={`absolute left-0 right-0 rounded-lg px-3 py-2 text-left overflow-hidden transition-all hover:scale-[1.02] ${event.completed ? 'opacity-50' : ''}`}
                    style={{ ...getEventStyle(event), backgroundColor: event.color + '30', borderLeft: `4px solid ${event.color}`, minHeight: '40px' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{event.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${event.completed ? 'line-through' : ''}`}>{event.title}</p>
                        <p className="text-[10px] text-white/50">{event.time} · {event.duration}min</p>
                      </div>
                      {event.completed && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </button>
                )) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/30 text-sm">Sin eventos programados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setShowAddModal(true)} className="w-full py-3 bg-violet-500/20 rounded-xl text-violet-400 font-medium flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> Añadir evento
        </button>
      </div>
    );
  };

  // ========== PENDING PANEL (slide from right) ==========
  const renderPendingPanel = () => {
    if (!showPendingPanel) return null;

    const visibleDates = getVisibleDates(selectedDate, weekMode);
    const byDate = visibleDates.map(date => ({
      date,
      label: new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      isToday: date === today,
      tasks: getPendingTasks(date)
    })).filter(d => d.tasks.length > 0);

    return (
      <div className="fixed inset-0 bg-black/80 z-50" onClick={() => setShowPendingPanel(false)}>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-zinc-900 overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-zinc-900 p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold">📋 Pendientes sin hora</h3>
            <button onClick={() => setShowPendingPanel(false)} className="p-1"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-4 space-y-4">
            {byDate.map(day => (
              <div key={day.date}>
                <div className={`flex items-center gap-2 mb-2 ${day.isToday ? 'text-violet-400' : 'text-white/60'}`}>
                  <span className="text-sm font-medium capitalize">{day.label}</span>
                  <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{day.tasks.length}</span>
                </div>
                <div className="space-y-1.5">
                  {day.tasks.map(task => (
                    <div key={`${task.type}-${task.id}`}
                      className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2"
                      style={{ borderLeft: `3px solid ${task.color}` }}>
                      <span>{task.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{task.title}</p>
                        {task.project && <p className="text-[10px] text-white/40">{task.project}</p>}
                      </div>
                      {task.priority === 'high' && <span className="text-red-400 text-xs font-bold">!</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {byDate.length === 0 && (
              <div className="text-center py-8 text-white/40">
                <p>✨ Todo programado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ========== MONTH VIEW ==========
  const renderMonthView = () => {
    const year = new Date(selectedDate).getFullYear();
    const month = new Date(selectedDate).getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const firstDayMon = firstDay === 0 ? 6 : firstDay - 1;

    const goMonth = (dir) => {
      const d = new Date(selectedDate);
      d.setMonth(d.getMonth() + dir);
      setSelectedDate(d.toISOString().split('T')[0]);
    };

    // Calculate month stats
    let totalScheduled = 0, totalPending = 0, totalWorkouts = 0, completedWorkouts = 0;
    let totalHabits = 0, completedHabits = 0, totalTasksDone = 0;
    const upcomingDeadlines = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      totalScheduled += getScheduledEvents(dateStr).length;
      totalPending += getPendingTasks(dateStr).length;

      const workout = (data.workouts || []).find(w => w.day_id === dateStr);
      if (workout) {
        totalWorkouts++;
        if (workout.is_completed) completedWorkouts++;
      }

      // Habits for this day
      (data.habits || []).forEach(habit => {
        if (shouldDoHabitOnDay(habit, dateStr)) {
          totalHabits++;
          const log = (data.habitLogs || []).find(l => l.habit_id === habit.id && l.date === dateStr);
          if (log?.completed) completedHabits++;
        }
      });

      // Completed tasks
      (data.workTasks || []).forEach(task => {
        if (task.status === 'done' && task.completedDate === dateStr) totalTasksDone++;
        // Upcoming deadlines
        if (task.dueDate === dateStr && task.status !== 'done' && dateStr >= today) {
          const project = (data.workProjects || []).find(p => p.id === task.project_id);
          upcomingDeadlines.push({ ...task, project, dateStr });
        }
      });
    }

    // Get weeks in month for mini view
    const weeksInMonth = Math.ceil((firstDayMon + daysInMonth) / 7);

    return (
      <div className="space-y-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => goMonth(-1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-center">
            <p className="text-2xl font-bold">{monthNames[month]}</p>
            <p className="text-sm text-white/50">{year}</p>
          </div>
          <button onClick={() => goMonth(1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {dayLabels.map(d => <div key={d} className="text-xs text-white/40 py-1 font-medium">{d}</div>)}
        </div>

        {/* Days grid with more info */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayMon }, (_, i) => <div key={`e-${i}`} className="aspect-square" />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === today;
            const isPast = dateStr < today;
            const scheduled = getScheduledEvents(dateStr);
            const pending = getPendingTasks(dateStr);
            const workout = (data.workouts || []).find(w => w.day_id === dateStr);
            const hasDeadline = (data.workTasks || []).some(t => t.dueDate === dateStr && t.status !== 'done');

            return (
              <button key={day} onClick={() => { setSelectedDate(dateStr); setView('day'); }}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative transition-all
                  ${isToday ? 'bg-violet-500 ring-2 ring-violet-400 ring-offset-1 ring-offset-zinc-900' : ''}
                  ${isPast && !isToday ? 'text-white/30 bg-white/5' : ''}
                  ${!isPast && !isToday ? 'bg-white/5 hover:bg-white/10' : ''}`}>
                <span className={`font-semibold ${isToday ? 'text-white' : ''}`}>{day}</span>
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-full">
                  {scheduled.length > 0 && <div className="w-1 h-1 rounded-full bg-violet-400" />}
                  {pending.length > 0 && <div className="w-1 h-1 rounded-full bg-amber-400" />}
                  {workout && <div className={`w-1 h-1 rounded-full ${workout.is_completed ? 'bg-emerald-400' : 'bg-purple-400'}`} />}
                  {hasDeadline && <div className="w-1 h-1 rounded-full bg-red-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 text-[10px] text-white/50">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-violet-400" /><span>Prog.</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span>Pend.</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-400" /><span>Entreno</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><span>Deadline</span></div>
        </div>

        {/* Upcoming Deadlines this month */}
        {upcomingDeadlines.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-xs font-medium text-red-400 mb-2">🎯 Deadlines este mes ({upcomingDeadlines.length})</p>
            <div className="space-y-1.5 max-h-24 overflow-y-auto">
              {upcomingDeadlines.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center gap-2 text-xs">
                  <span className="text-white/40">{new Date(task.dueDate + 'T12:00:00').getDate()}</span>
                  <span className="truncate flex-1">{task.title}</span>
                  {task.project && <span className="text-white/30 text-[10px]">{task.project.icon}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Month Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">Entrenos</span>
              <span className="text-lg font-bold text-purple-400">{completedWorkouts}/{totalWorkouts}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${totalWorkouts ? (completedWorkouts / totalWorkouts) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">Hábitos</span>
              <span className="text-lg font-bold text-emerald-400">{completedHabits}/{totalHabits}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${totalHabits ? (completedHabits / totalHabits) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">Tareas completadas</span>
              <span className="text-lg font-bold text-violet-400">{totalTasksDone}</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">Pendientes</span>
              <span className="text-lg font-bold text-amber-400">{totalPending}</span>
            </div>
          </div>
        </div>

        {/* Week navigator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: weeksInMonth }, (_, i) => {
            const weekStart = i * 7 - firstDayMon + 1;
            const weekEnd = Math.min(weekStart + 6, daysInMonth);
            const validStart = Math.max(1, weekStart);
            return (
              <button key={i} onClick={() => {
                const midDay = Math.floor((validStart + weekEnd) / 2);
                setSelectedDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(midDay).padStart(2, '0')}`);
                setView('week');
              }}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs">
                Sem {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ========== QUARTER VIEW ==========
  const renderQuarterView = () => {
    const year = new Date(selectedDate).getFullYear();
    const currentQuarter = Math.floor(new Date(selectedDate).getMonth() / 3) + 1;
    const quarterStart = new Date(year, (currentQuarter - 1) * 3, 1);
    const quarterEnd = new Date(year, currentQuarter * 3, 0);

    // Get quarter days for stats
    const quarterDays = [];
    let d = new Date(quarterStart);
    while (d <= quarterEnd) {
      quarterDays.push(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 1);
    }

    // Comprehensive stats
    const totalWorkouts = (data.workouts || []).filter(w => quarterDays.includes(w.day_id)).length;
    const quarterWorkouts = (data.workouts || []).filter(w => quarterDays.includes(w.day_id) && w.is_completed).length;
    const quarterTasksDone = (data.workTasks || []).filter(t => t.status === 'done' && quarterDays.includes(t.completedDate)).length;
    const activeProjects = (data.workProjects || []).filter(p => p.status === 'active');

    // Habits stats
    let totalHabits = 0, completedHabits = 0;
    quarterDays.forEach(dateStr => {
      (data.habits || []).forEach(habit => {
        if (shouldDoHabitOnDay(habit, dateStr)) {
          totalHabits++;
          const log = (data.habitLogs || []).find(l => l.habit_id === habit.id && l.date === dateStr);
          if (log?.completed) completedHabits++;
        }
      });
    });

    // Upcoming deadlines in quarter
    const upcomingDeadlines = (data.workTasks || [])
      .filter(t => t.dueDate && quarterDays.includes(t.dueDate) && t.dueDate >= today && t.status !== 'done')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);

    // Quarter progress
    const now = new Date();
    const quarterProgress = Math.max(0, Math.min(100, Math.round((now - quarterStart) / (quarterEnd - quarterStart) * 100)));

    const goQuarter = (dir) => {
      const newQ = currentQuarter + dir;
      if (newQ < 1) setSelectedDate(`${year - 1}-11-15`);
      else if (newQ > 4) setSelectedDate(`${year + 1}-02-15`);
      else setSelectedDate(`${year}-${String((newQ - 1) * 3 + 2).padStart(2, '0')}-15`);
    };

    // Mini calendar renderer
    const renderMiniMonth = (monthOffset) => {
      const monthNum = (currentQuarter - 1) * 3 + monthOffset;
      const monthYear = year;
      const daysInMonth = new Date(monthYear, monthNum + 1, 0).getDate();
      const firstDay = new Date(monthYear, monthNum, 1).getDay();
      const firstDayMon = firstDay === 0 ? 6 : firstDay - 1;
      const isCurrentMonth = monthNum === new Date().getMonth() && monthYear === new Date().getFullYear();

      return (
        <div key={monthOffset} className={`bg-white/5 rounded-xl p-2 ${isCurrentMonth ? 'ring-1 ring-violet-500' : ''}`}>
          <button onClick={() => { setSelectedDate(`${monthYear}-${String(monthNum + 1).padStart(2, '0')}-15`); setView('month'); }}
            className={`w-full text-center mb-1 font-medium text-sm hover:text-violet-400 ${isCurrentMonth ? 'text-violet-400' : ''}`}>
            {monthNamesShort[monthNum]}
          </button>
          <div className="grid grid-cols-7 gap-px">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(l => (
              <div key={l} className="text-[7px] text-white/30 text-center">{l}</div>
            ))}
            {Array.from({ length: firstDayMon }, (_, i) => <div key={`e-${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${monthYear}-${String(monthNum + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === today;
              const hasEvent = getScheduledEvents(dateStr).length > 0 || getPendingTasks(dateStr).length > 0;
              const hasWorkout = (data.workouts || []).some(w => w.day_id === dateStr);
              const hasDeadline = (data.workTasks || []).some(t => t.dueDate === dateStr && t.status !== 'done');

              return (
                <button key={day} onClick={() => { setSelectedDate(dateStr); setView('day'); }}
                  className={`aspect-square flex items-center justify-center text-[8px] rounded-sm transition-all
                    ${isToday ? 'bg-violet-500 text-white font-bold' : ''}
                    ${hasDeadline && !isToday ? 'bg-red-500/30' : ''}
                    ${hasWorkout && !isToday && !hasDeadline ? 'bg-purple-500/20' : ''}
                    ${hasEvent && !isToday && !hasDeadline && !hasWorkout ? 'bg-white/10' : ''}
                    ${!isToday ? 'hover:bg-white/20' : ''}`}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* Quarter header */}
        <div className="flex items-center justify-between">
          <button onClick={() => goQuarter(-1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-center">
            <p className="text-3xl font-bold">Q{currentQuarter}</p>
            <p className="text-sm text-white/50">{monthNamesShort[(currentQuarter - 1) * 3]} - {monthNamesShort[currentQuarter * 3 - 1]} {year}</p>
          </div>
          <button onClick={() => goQuarter(1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Quarter selector */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map(q => (
            <button key={q} onClick={() => setSelectedDate(`${year}-${String((q - 1) * 3 + 2).padStart(2, '0')}-15`)}
              className={`w-11 h-11 rounded-xl font-bold text-lg transition-all ${q === currentQuarter ? 'bg-violet-500' : 'bg-white/10 hover:bg-white/20'}`}>
              Q{q}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>{monthNamesShort[(currentQuarter - 1) * 3]}</span>
            <span className="font-medium">{quarterProgress}%</span>
            <span>{monthNamesShort[currentQuarter * 3 - 1]}</span>
          </div>
          <div className="bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all" style={{ width: `${quarterProgress}%` }} />
          </div>
        </div>

        {/* Mini calendars */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(renderMiniMonth)}
        </div>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-xs font-medium text-red-400 mb-2 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" /> Próximos Deadlines
            </p>
            <div className="space-y-1.5">
              {upcomingDeadlines.map(task => {
                const project = (data.workProjects || []).find(p => p.id === task.project_id);
                const daysUntil = Math.ceil((new Date(task.dueDate) - new Date(today)) / (1000 * 60 * 60 * 24));
                return (
                  <div key={task.id} className="flex items-center gap-2 text-xs">
                    <span className={`font-medium ${daysUntil <= 3 ? 'text-red-400' : daysUntil <= 7 ? 'text-amber-400' : 'text-white/60'}`}>
                      {daysUntil === 0 ? 'HOY' : daysUntil === 1 ? 'Mañana' : `${daysUntil}d`}
                    </span>
                    <span className="truncate flex-1">{task.title}</span>
                    {project && <span style={{ color: project.color }}>{project.icon}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quarter Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">💪 Entrenos</span>
              <span className="text-lg font-bold text-purple-400">{quarterWorkouts}/{totalWorkouts}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${totalWorkouts ? (quarterWorkouts / totalWorkouts) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">✅ Hábitos</span>
              <span className="text-lg font-bold text-emerald-400">{Math.round(totalHabits ? (completedHabits / totalHabits) * 100 : 0)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${totalHabits ? (completedHabits / totalHabits) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">📋 Tareas done</span>
              <span className="text-xl font-bold text-violet-400">{quarterTasksDone}</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">📁 Proyectos</span>
              <span className="text-xl font-bold text-orange-400">{activeProjects.length}</span>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">Proyectos Activos</h4>
            <div className="space-y-2">
              {activeProjects.slice(0, 4).map(project => {
                const projectTasks = (data.workTasks || []).filter(t => t.project_id === project.id);
                const done = projectTasks.filter(t => t.status === 'done').length;
                const progress = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;
                const nextDeadline = projectTasks.filter(t => t.dueDate && t.status !== 'done').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

                return (
                  <button key={project.id} onClick={() => setScreen('work')} className="w-full bg-white/5 rounded-xl p-3 text-left hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-sm">{project.icon} {project.name}</span>
                      <span className="text-sm font-bold" style={{ color: project.color || '#8B5CF6' }}>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
                      <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: project.color || '#8B5CF6' }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-white/40">
                      <span>{done}/{projectTasks.length} tareas</span>
                      {nextDeadline && <span className="text-amber-400">📅 {new Date(nextDeadline.dueDate + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Goals if any */}
        {data.goals?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">Objetivos Q{currentQuarter}</h4>
            <div className="space-y-1.5">
              {data.goals.slice(0, 4).map(goal => (
                <div key={goal.id} className="bg-white/5 rounded-xl p-2.5 flex items-center justify-between">
                  <span className="text-sm">{goal.icon || '🎯'} {goal.name || goal.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${(goal.progress || 0) >= 100 ? 'bg-emerald-500/20 text-emerald-400' :
                    (goal.progress || 0) >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10'
                    }`}>{goal.progress || 0}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ========== EVENT DETAIL ==========
  const renderEventDetail = () => {
    if (!showEventDetail) return null;
    const e = showEventDetail;
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-end" onClick={() => setShowEventDetail(null)}>
        <div className="bg-zinc-900 rounded-t-3xl w-full p-4" onClick={ev => ev.stopPropagation()}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: e.color + '30' }}>{e.icon}</div>
            <div className="flex-1"><h3 className="font-bold text-lg">{e.title}</h3><p className="text-sm text-white/50">{e.time} · {e.duration}min</p></div>
            <button onClick={() => setShowEventDetail(null)} className="p-2"><X className="w-5 h-5" /></button>
          </div>
          <button onClick={() => { toggleEvent(e); setShowEventDetail({ ...e, completed: !e.completed }); }}
            className={`w-full py-3 rounded-xl font-medium mb-3 ${e.completed ? 'bg-emerald-500' : 'bg-white/10'}`}>
            {e.completed ? '✓ Completado' : 'Marcar como completado'}
          </button>
          <button onClick={() => { setShowEventDetail(null); setScreen(e.type === 'task' ? 'work' : e.type === 'habit' ? 'habits' : e.type === 'workout' ? 'workout' : 'meals'); }}
            className="w-full py-2 text-sm text-white/50">Ir a {e.type === 'task' ? 'Trabajo' : e.type === 'habit' ? 'Hábitos' : e.type === 'workout' ? 'Entreno' : 'Nutrición'} →</button>
        </div>
      </div>
    );
  };

  // ========== ADD MODAL ==========
  const renderAddModal = () => {
    if (!showAddModal) return null;
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
        <div className="bg-zinc-900 rounded-2xl w-full max-w-sm" onClick={ev => ev.stopPropagation()}>
          <div className="p-4 border-b border-white/10 text-center font-bold">Añadir evento</div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { icon: '💼', label: 'Tarea trabajo', screen: 'work' },
              { icon: '💪', label: 'Entreno', screen: 'workout' },
              { icon: '🍽️', label: 'Comida', screen: 'meals' },
              { icon: '✅', label: 'Hábito', screen: 'habits' },
              { icon: '📌', label: 'Personal', screen: 'personal' },
              { icon: '📋', label: 'Tarea día', screen: 'today' }
            ].map(opt => (
              <button key={opt.screen} onClick={() => { setShowAddModal(false); setScreen(opt.screen); }}
                className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10">
                <span className="text-2xl">{opt.icon}</span>
                <p className="text-sm mt-1">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24">
      <AnimatedMount>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Calendario</h1>
          <div className="flex bg-white/10 rounded-xl p-1">
            <button onClick={() => setView('day')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'day' ? 'bg-violet-500' : ''}`}>Día</button>
            <button onClick={() => setView('week')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'week' ? 'bg-violet-500' : ''}`}>Sem</button>
            <button onClick={() => setView('month')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'month' ? 'bg-violet-500' : ''}`}>Mes</button>
            <button onClick={() => setView('quarter')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'quarter' ? 'bg-violet-500' : ''}`}>Q</button>
          </div>
        </div>
      </AnimatedMount>

      <AnimatedMount delay={50}>
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
        {view === 'quarter' && renderQuarterView()}
      </AnimatedMount>

      {renderEventDetail()}
      {renderAddModal()}
      {renderPendingPanel()}
    </div>
  );
};

// ============================================================================
// GOALS SCREEN - Annual, Quarterly, Monthly Goals (inside Control)
// ============================================================================



export default CalendarScreen;
