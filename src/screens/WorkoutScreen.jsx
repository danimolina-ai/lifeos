// WorkoutScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo, useRef } from 'react';
import { Dumbbell, Plus, Check, ChevronRight, ChevronLeft, Edit3, Trash2, Play, Pause, RotateCcw, Timer, Target, TrendingUp, Trophy, Search, Calendar, Clock, Zap, Star, MoreHorizontal, Filter, Copy } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { formatTimer, formatSeconds } from '../utils/formatting';
import { EXERCISE_DATABASE, getExerciseById, getExercisesByMuscle, getAllExercises } from '../data/exerciseDatabase';
import { Card, Modal, AnimatedMount, ProgressBar, EmptyState, RestTimer, ProgressRing } from '../components/ui';

const WorkoutScreen = ({ data, setData, showToast }) => {
  const today = getToday();


  // Main state
  const [view, setView] = useState('home'); // home, routines, routine-builder, exercise-library, workout, history
  const [workout, setWorkout] = useState((data.workouts || []).find(w => w.day_id === today && !w.is_completed));
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(today);
  const [scheduleMode, setScheduleMode] = useState("single");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedRoutineForSchedule, setSelectedRoutineForSchedule] = useState(null);


  // Workout state
  const [activeEx, setActiveEx] = useState(0);
  const [restTimer, setRestTimer] = useState(null);
  const [restDuration, setRestDuration] = useState(data.user.workoutSettings?.defaultRest || 90);
  const [elapsedTime, setElapsedTime] = useState(0);


  // Settings state
  const [localSettings, setLocalSettings] = useState({
    defaultRest: data.user.workoutSettings?.defaultRest || 90,
    autoStartRest: data.user.workoutSettings?.autoStartRest ?? true,
    showWarmupSets: data.user.workoutSettings?.showWarmupSets ?? true
  });


  const saveSettings = () => {
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        workoutSettings: localSettings
      }
    }));
    setRestDuration(localSettings.defaultRest);
    setShowSettings(false);
    showToast('Configuración guardada');
  };


  // Modals
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showExerciseDetail, setShowExerciseDetail] = useState(null);
  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [showWarmupCalc, setShowWarmupCalc] = useState(null);
  const [exerciseFilter, setExerciseFilter] = useState({ muscle: null, equipment: null, search: '' });


  // Sync workout
  useEffect(() => {
    const active = (data.workouts || []).find(w => w.day_id === today && !w.is_completed);
    setWorkout(active);
    if (active && view === 'home') setView('workout');
  }, [data.workouts, today]);


  // Elapsed time - only runs when workout has started
  useEffect(() => {
    if (!workout || workout.is_completed || !workout.started_at) {
      setElapsedTime(0);
      return;
    }
    const start = new Date(workout.started_at).getTime();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [workout?.id, workout?.is_completed, workout?.started_at]);


  // Rest timer countdown
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return;
    const interval = setInterval(() => {
      setRestTimer(t => {
        if (t <= 1) {
          showToast('¡Descanso terminado! 💪');
          return null;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer]);


  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };


  // Get user routines or defaults
  const routines = data.workoutRoutines?.length > 0 ? data.workoutRoutines : DEFAULT_ROUTINES;

  // Scheduled workouts
  const scheduledWorkouts = data.scheduledWorkouts || [];
  const todayDayOfWeek = new Date(today).getDay();
  const recurringWorkouts = data.recurringWorkouts || [];
  const todayScheduled = scheduledWorkouts.find(s => s.date === today);
  const todayRecurring = recurringWorkouts.find(r => r.dayOfWeek === todayDayOfWeek);
  const todayRoutine = todayScheduled ? routines.find(r => r.id === todayScheduled.routineId) : todayRecurring ? routines.find(r => r.id === todayRecurring.routineId) : null;
  // Get unique folders, filtering out undefined/empty and adding 'General' for routines without folder
  const allFolders = [...new Set(routines.map(r => r.folder).filter(f => f))];
  const hasUnfolderedRoutines = routines.some(r => !r.folder);
  const folders = hasUnfolderedRoutines ? [...allFolders, 'General'] : allFolders;


  // PR functions - compatible with old and new data formats
  const getPR = (exerciseId) => {
    const records = data.personalRecords?.filter(p =>
      p.exerciseId === exerciseId || p.exercise === exerciseId
    ) || [];
    return records.sort((a, b) => (b.weight || 0) - (a.weight || 0))[0];
  };


  const checkAndSavePR = (exerciseId, weight, reps) => {
    if (!weight || !reps) return false;
    const currentPR = getPR(exerciseId);


    if (!currentPR || weight > currentPR.weight || (weight === currentPR.weight && reps > currentPR.reps)) {
      const exercise = getExerciseById(exerciseId);
      setData(prev => ({
        ...prev,
        personalRecords: [...(prev.personalRecords || []), {
          id: generateId(),
          exerciseId,
          exerciseName: exercise?.name || exerciseId,
          weight,
          reps,
          date: today,
          estimated1RM: Math.round(weight * (36 / (37 - Math.min(reps, 12))))
        }]
      }));
      showToast(`🏆 Nuevo PR: ${exercise?.name} ${weight}kg x${reps}!`);
      return true;
    }
    return false;

  };


  // Get last workout data for exercise
  const getLastPerformance = (exerciseId) => {
    for (const w of (data.workouts || []).filter(w => w.is_completed).sort((a, b) => b.day_id.localeCompare(a.day_id))) {
      const ex = w.exercises?.find(e => e.exerciseId === exerciseId);
      if (ex?.sets.some(s => s.completed)) {
        return { date: w.day_id, sets: ex.sets.filter(s => s.completed) };
      }
    }
    return null;
  };


  // Get exercise history
  const getExerciseHistory = (exerciseId) => {
    return (data.workouts || [])
      .filter(w => w.is_completed)
      .map(w => {
        const ex = w.exercises?.find(e => e.exerciseId === exerciseId);
        if (!ex) return null;
        const completedSets = ex.sets.filter(s => s.completed && s.weight && s.reps);
        if (!completedSets.length) return null;
        const bestSet = completedSets.sort((a, b) => b.weight - a.weight)[0];
        const volume = completedSets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
        return { date: w.day_id, bestSet, volume, sets: completedSets.length };
      })
      .filter(Boolean)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 15);
  };


  // Start workout from routine
  const startWorkout = (routine) => {
    const newWorkout = {
      id: generateId(),
      day_id: today,
      routineId: routine.id,
      name: routine.name,
      started_at: null,
      is_completed: false,
      exercises: routine.exercises.map(e => {
        const lastPerf = getLastPerformance(e.exerciseId);
        const exerciseInfo = getExerciseById(e.exerciseId);


        return {
          id: generateId(),
          exerciseId: e.exerciseId,
          name: exerciseInfo?.name || e.exerciseId,
          targetSets: e.targetSets,
          targetReps: e.targetReps,
          restSeconds: e.restSeconds || 90,
          supersetWith: e.supersetWith || null,
          notes: e.notes || '',
          sets: Array.from({ length: e.targetSets }, (_, i) => ({
            id: generateId(),
            weight: lastPerf?.sets[i]?.weight || null,
            reps: null,
            rpe: null,
            setType: 'normal',
            completed: false
          }))
        };
      })
    };

    setData(prev => ({ ...prev, workouts: [...prev.workouts, newWorkout] }));
    setView('workout');
    showToast('Entreno iniciado 💪');

  };


  // Start empty workout
  const startEmptyWorkout = () => {
    const newWorkout = {
      id: generateId(),
      day_id: today,
      name: 'Entreno libre',
      started_at: new Date().toISOString(),
      is_completed: false,
      exercises: []
    };
    setData(prev => ({ ...prev, workouts: [...prev.workouts, newWorkout] }));
    setView('workout');
    showToast('Entreno iniciado 💪');
  };


  // Add exercise to workout
  const addExerciseToWorkout = (exerciseId) => {
    if (!workout) return;
    const exerciseInfo = getExerciseById(exerciseId);
    const lastPerf = getLastPerformance(exerciseId);


    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === workout.id ? {
        ...w,
        exercises: [...w.exercises, {
          id: generateId(),
          exerciseId,
          name: exerciseInfo?.name || exerciseId,
          targetSets: 3,
          targetReps: '8',
          restSeconds: 90,
          notes: '',
          sets: Array.from({ length: 3 }, (_, i) => ({
            id: generateId(),
            weight: lastPerf?.sets[i]?.weight || 20,
            reps: lastPerf?.sets[i]?.reps || 8,
            rpe: null,
            setType: 'normal',
            completed: false
          }))
        }]
      } : w)
    }));
    setShowExercisePicker(false);
    showToast('Ejercicio añadido');

  };


  // Toggle set
  const toggleSet = (exIndex, setIndex) => {
    if (!workout) return;
    const exercise = workout.exercises[exIndex];
    const set = exercise.sets[setIndex];


    if (!set.completed && set.weight && set.reps) {
      checkAndSavePR(exercise.exerciseId, set.weight, set.reps);
    }

    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === workout.id ? {
        ...w,
        exercises: w.exercises.map((e, ei) => ei === exIndex ? {
          ...e,
          sets: e.sets.map((s, si) => si === setIndex ? { ...s, completed: !s.completed } : s)
        } : e)
      } : w)
    }));

    if (!set.completed) {
      setRestTimer(exercise.restSeconds || 90);
      setRestDuration(exercise.restSeconds || 90);
    }

  };


  // Update set
  const updateSet = (exIndex, setIndex, field, value) => {
    if (!workout) return;
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === workout.id ? {
        ...w,
        exercises: w.exercises.map((e, ei) => ei === exIndex ? {
          ...e,
          sets: e.sets.map((s, si) => si === setIndex ? { ...s, [field]: value } : s)
        } : e)
      } : w)
    }));
  };


  // Add set
  const addSet = (exIndex) => {
    if (!workout) return;
    const exercise = workout.exercises[exIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];


    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === workout.id ? {
        ...w,
        exercises: w.exercises.map((e, ei) => ei === exIndex ? {
          ...e,
          sets: [...e.sets, {
            id: generateId(),
            weight: lastSet?.weight || 20,
            reps: lastSet?.reps || 8,
            rpe: null,
            setType: 'normal',
            completed: false
          }]
        } : e)
      } : w)
    }));

  };


  // Remove set
  const removeSet = (exIndex) => {
    if (!workout) return;
    const exercise = workout.exercises[exIndex];
    if (exercise.sets.length <= 1) return;


    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === workout.id ? {
        ...w,
        exercises: w.exercises.map((e, ei) => ei === exIndex ? {
          ...e,
          sets: e.sets.slice(0, -1)
        } : e)
      } : w)
    }));

  };


  // Delete exercise
  const deleteExercise = (exIndex) => {
    if (!workout || workout.exercises.length <= 1) return;
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === workout.id ? {
        ...w,
        exercises: w.exercises.filter((_, i) => i !== exIndex)
      } : w)
    }));
    if (activeEx >= exIndex && activeEx > 0) setActiveEx(activeEx - 1);
  };


  // Complete workout
  const completeWorkout = () => {
    if (!workout) return;
    const duration = elapsedTime;


    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === workout.id ? {
        ...w,
        is_completed: true,
        finished_at: new Date().toISOString(),
        duration_seconds: duration
      } : w)
    }));

    setView('home');
    showToast('¡Entreno completado! 🎉');

  };


  // Cancel workout
  const cancelWorkout = () => {
    if (!workout) return;
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.filter(w => w.id !== workout.id)
    }));
    setView('home');
    showToast('Entreno cancelado');
  };


  // Save routine
  const saveRoutine = (routine) => {
    setData(prev => ({
      ...prev,
      workoutRoutines: prev.workoutRoutines
        ? [...prev.workoutRoutines.filter(r => r.id !== routine.id), routine]
        : [routine]
    }));
    setEditingRoutine(null);
    setView('routines');
    showToast('Rutina guardada');
  };


  // Delete routine
  const deleteRoutine = (routineId) => {
    setData(prev => ({
      ...prev,
      workoutRoutines: (prev.workoutRoutines || []).filter(r => r.id !== routineId)
    }));
    showToast('Rutina eliminada');
  };

  // Schedule workout for a specific date
  const scheduleWorkout = (routineId, date) => {
    setData(prev => ({
      ...prev,
      scheduledWorkouts: [...(prev.scheduledWorkouts || []).filter(s => s.date !== date), { id: crypto.randomUUID(), routineId, date }]
    }));
    showToast('Entreno programado');
    setShowScheduler(false);
  };

  const removeScheduledWorkout = (date) => {
    setData(prev => ({ ...prev, scheduledWorkouts: (prev.scheduledWorkouts || []).filter(s => s.date !== date) }));
    showToast('Programación eliminada');
  };

  const scheduleRecurring = (routineId, days) => {
    setData(prev => ({
      ...prev,
      recurringWorkouts: [...(prev.recurringWorkouts || []).filter(r => !days.includes(r.dayOfWeek)), ...days.map(d => ({ id: crypto.randomUUID(), routineId, dayOfWeek: d }))]
    }));
    showToast('Programación recurrente guardada');
    setShowScheduler(false);
    setSelectedDays([]);
    setSelectedRoutineForSchedule(null);
    setScheduleMode('single');
  };

  const removeRecurring = (dayOfWeek) => {
    setData(prev => ({ ...prev, recurringWorkouts: (prev.recurringWorkouts || []).filter(r => r.dayOfWeek !== dayOfWeek) }));
  };


  // Calculate workout totals
  const getWorkoutTotals = () => {
    if (!workout) return { sets: 0, totalSets: 0, volume: 0 };


    let completedSets = 0, totalSets = 0, volume = 0;

    workout.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.setType !== 'warmup') {
          totalSets++;
          if (set.completed) {
            completedSets++;
            if (set.weight && set.reps) volume += set.weight * set.reps;
          }
        }
      });
    });

    return { sets: completedSets, totalSets, volume };

  };


  // Filter exercises
  const getFilteredExercises = () => {
    let exercises = getAllExercises();


    if (exerciseFilter.muscle) {
      exercises = exercises.filter(e => e.muscle === exerciseFilter.muscle);
    }
    if (exerciseFilter.equipment) {
      exercises = exercises.filter(e => e.equipment === exerciseFilter.equipment);
    }
    if (exerciseFilter.search) {
      const search = exerciseFilter.search.toLowerCase();
      exercises = exercises.filter(e => e.name.toLowerCase().includes(search));
    }

    return exercises;

  };


  // =========================================================================
  // RENDER: HOME
  // =========================================================================



  // =========================================================================
  // SCHEDULER VIEW (with routine preview)
  // =========================================================================
  if (showScheduler) {
    const selectedRoutineData = selectedRoutineForSchedule ? routines.find(r => r.id === selectedRoutineForSchedule) : null;

    return (
      <div className="space-y-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedRoutineData && (
              <button onClick={() => setSelectedRoutineForSchedule(null)} className="p-2 hover:bg-white/10 rounded-xl">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold">{selectedRoutineData ? 'Programar' : 'Seleccionar Rutina'}</h1>
          </div>
          <button onClick={() => { setShowScheduler(false); setSelectedRoutineForSchedule(null); setSelectedDays([]); setScheduleMode('single'); }} className="p-2 hover:bg-white/10 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!selectedRoutineData ? (
          <>
            {/* Routine list */}
            <div className="space-y-2">
              {routines.map(routine => (
                <Card key={routine.id} className="hover:bg-white/5 cursor-pointer transition-all" onClick={() => setSelectedRoutineForSchedule(routine.id)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{routine.name}</p>
                      <p className="text-sm text-white/50">{routine.folder} · {routine.exercises?.length || 0} ejercicios</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Current schedule */}
            {(data.recurringWorkouts || []).length > 0 && (
              <Card>
                <p className="text-sm font-medium mb-3">📆 Programación actual</p>
                <div className="space-y-2">
                  {[{ id: 1, n: 'Lunes' }, { id: 2, n: 'Martes' }, { id: 3, n: 'Miércoles' }, { id: 4, n: 'Jueves' }, { id: 5, n: 'Viernes' }, { id: 6, n: 'Sábado' }, { id: 0, n: 'Domingo' }].map(d => {
                    const rec = (data.recurringWorkouts || []).find(r => r.dayOfWeek === d.id);
                    if (!rec) return null;
                    const rtn = routines.find(r => r.id === rec.routineId);
                    return (
                      <div key={d.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span><span className="text-white/50">{d.n}:</span> {rtn?.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeRecurring(d.id); }} className="text-red-400 p-1 hover:bg-red-500/20 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Routine preview */}
            <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/30 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">{selectedRoutineData.name}</p>
                  <p className="text-sm text-white/50">{selectedRoutineData.folder} · {selectedRoutineData.exercises?.length || 0} ejercicios</p>
                </div>
              </div>

              {/* Exercise list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(selectedRoutineData.exercises || []).map((ex, idx) => {
                  const exInfo = getExerciseById(ex.exerciseId);
                  return (
                    <div key={idx} className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
                      <span className="text-lg">{exInfo?.muscleEmoji || '💪'}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{exInfo?.name || ex.exerciseId}</p>
                        <p className="text-xs text-white/40">{ex.targetSets} series × {ex.targetReps} reps</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Schedule options */}
            <Card>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setScheduleMode('single')} className={`flex-1 py-2 rounded-xl text-sm font-medium ${scheduleMode === 'single' ? 'bg-violet-500' : 'bg-white/10'}`}>
                  📅 Fecha única
                </button>
                <button onClick={() => setScheduleMode('recurring')} className={`flex-1 py-2 rounded-xl text-sm font-medium ${scheduleMode === 'recurring' ? 'bg-violet-500' : 'bg-white/10'}`}>
                  🔄 Recurrente
                </button>
              </div>

              {scheduleMode === 'single' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Fecha</label>
                    <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} min={today} className="w-full bg-white/10 rounded-xl p-3 outline-none" />
                  </div>
                  <button onClick={() => scheduleWorkout(selectedRoutineForSchedule, scheduleDate)} className="w-full py-3 bg-violet-500 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" /> Programar para {scheduleDate === today ? 'hoy' : new Date(scheduleDate + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Días de la semana</label>
                    <div className="flex gap-2 justify-between">
                      {[{ id: 1, s: 'L', n: 'Lunes' }, { id: 2, s: 'M', n: 'Martes' }, { id: 3, s: 'X', n: 'Miércoles' }, { id: 4, s: 'J', n: 'Jueves' }, { id: 5, s: 'V', n: 'Viernes' }, { id: 6, s: 'S', n: 'Sábado' }, { id: 0, s: 'D', n: 'Domingo' }].map(d => (
                        <button key={d.id} onClick={() => setSelectedDays(p => p.includes(d.id) ? p.filter(x => x !== d.id) : [...p, d.id])} className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${selectedDays.includes(d.id) ? 'bg-violet-500 scale-110' : 'bg-white/10'}`} title={d.n}>
                          {d.s}
                        </button>
                      ))}
                    </div>
                    {selectedDays.length > 0 && (
                      <p className="text-xs text-white/40 mt-2">
                        {selectedDays.sort((a, b) => a - b).map(id => [{ id: 0, n: 'Dom' }, { id: 1, n: 'Lun' }, { id: 2, n: 'Mar' }, { id: 3, n: 'Mié' }, { id: 4, n: 'Jue' }, { id: 5, n: 'Vie' }, { id: 6, n: 'Sáb' }].find(d => d.id === id)?.n).join(', ')}
                      </p>
                    )}
                  </div>
                  <button onClick={() => scheduleRecurring(selectedRoutineForSchedule, selectedDays)} disabled={selectedDays.length === 0} className="w-full py-3 bg-violet-500 rounded-xl font-bold disabled:opacity-30 flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5" /> Programar {selectedDays.length} día{selectedDays.length !== 1 ? 's' : ''} por semana
                  </button>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    );
  }

  if (view === 'home') {
    const recentWorkouts = data.workouts
      .filter(w => w.is_completed)
      .sort((a, b) => b.day_id.localeCompare(a.day_id))
      .slice(0, 5);


    const weekWorkouts = (data.workouts || []).filter(w => {
      const weekDates = getWeekDates();
      return weekDates.includes(w.day_id) && w.is_completed;
    }).length;

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Entreno</h1>
              <p className="text-white/50 text-sm">{formatDate(today)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHelp(true)}
                className="p-3 hover:bg-white/10 rounded-xl"
              >
                <BookOpen className="w-5 h-5 text-white/50" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 hover:bg-white/10 rounded-xl"
              >
                <Settings className="w-5 h-5 text-white/50" />
              </button>
              <button
                onClick={() => { console.log("Scheduler button clicked, current showScheduler:", showScheduler); setShowScheduler(true); }}
                className="p-3 hover:bg-white/10 rounded-xl"
              >
                <Clock className="w-5 h-5 text-white/50" />
              </button>
              <button
                onClick={() => setView('routines')}
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </AnimatedMount>

        {/* Scheduled for today */}
        {todayRoutine && !workout && (
          <AnimatedMount delay={50}>
            <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-amber-400 font-medium">PROGRAMADO HOY</p>
                  <p className="font-bold text-lg">{todayRoutine.name}</p>
                </div>
                <button onClick={() => todayScheduled ? removeScheduledWorkout(today) : removeRecurring(todayDayOfWeek)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
              <button onClick={() => startWorkout(todayRoutine)} className="w-full py-3 bg-amber-500 rounded-xl font-bold text-black flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Empezar
              </button>
            </Card>
          </AnimatedMount>
        )}

        {/* Quick start */}
        <AnimatedMount delay={50}>
          <Card className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-violet-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-lg">Empezar entreno</p>
                <p className="text-sm text-white/50">{weekWorkouts} entrenos esta semana</p>
              </div>
              <button
                onClick={startEmptyWorkout}
                className="px-4 py-2 bg-violet-500 rounded-xl font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Libre
              </button>
            </div>

            {/* Quick routine buttons */}
            <div className="grid grid-cols-3 gap-2">
              {routines.slice(0, 3).map(routine => (
                <button
                  key={routine.id}
                  onClick={() => startWorkout(routine)}
                  className="p-3 bg-white/10 rounded-xl text-center hover:bg-white/20 transition-all"
                >
                  <Dumbbell className="w-5 h-5 mx-auto mb-1 text-violet-400" />
                  <p className="text-xs font-medium truncate">{routine.name}</p>
                </button>
              ))}
            </div>
            {routines.length > 3 && (
              <button
                onClick={() => setView('routines')}
                className="w-full mt-2 py-2 text-sm text-violet-400 hover:text-violet-300 flex items-center justify-center gap-1"
              >
                Ver todas ({routines.length} rutinas) <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </Card>
        </AnimatedMount>

        {/* Recent workouts */}
        {recentWorkouts.length > 0 && (
          <AnimatedMount delay={100}>
            <Section title="RECIENTES" icon={Clock} iconColor="text-blue-400" action={() => setView('history')} actionLabel="Ver todo">
              <div className="space-y-2">
                {recentWorkouts.map(w => {
                  const volume = w.exercises?.reduce((sum, ex) =>
                    sum + ex.sets.filter(s => s.completed).reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0)
                    , 0) || 0;

                  return (
                    <Card key={w.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{w.name}</p>
                          <p className="text-xs text-white/40">{formatShortDate(w.day_id)}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p>{w.exercises?.length || 0} ejercicios</p>
                          <p className="text-xs text-white/40">
                            {volume > 0 ? `${volume.toLocaleString()}kg` : ''}
                            {w.duration_seconds ? ` · ${formatTime(w.duration_seconds)}` : ''}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Section>
          </AnimatedMount>
        )}

        {/* PRs */}
        {data.personalRecords?.length > 0 && (
          <AnimatedMount delay={150}>
            <Section title="PERSONAL RECORDS" icon={Trophy} iconColor="text-yellow-400">
              <Card>
                <div className="space-y-2">
                  {[...new Set(data.personalRecords.map(p => p.exerciseId || p.exercise))].filter(Boolean).slice(0, 5).map(exId => {
                    const pr = getPR(exId) || data.personalRecords.find(p => (p.exerciseId || p.exercise) === exId);
                    if (!pr) return null;
                    const exercise = getExerciseById(exId);
                    return (
                      <div key={exId} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-sm">{exercise?.name || pr.exerciseName || pr.exercise || exId}</p>
                          <p className="text-xs text-white/40">{pr.date ? formatShortDate(pr.date) : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-400">{pr.weight}kg x{pr.reps}</p>
                          {pr.estimated1RM && <p className="text-xs text-white/40">~{pr.estimated1RM}kg 1RM</p>}
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </Card>
            </Section>
          </AnimatedMount>
        )}

        {/* Exercise library link */}
        <AnimatedMount delay={200}>
          <Card onClick={() => setView('exercise-library')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Librería de ejercicios</p>
                  <p className="text-sm text-white/50">{getAllExercises().length}+ ejercicios</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </div>
          </Card>
        </AnimatedMount>

        {/* Settings Modal */}
        <Modal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          title="Configuración Entreno"
          footer={
            <button onClick={saveSettings} className="w-full py-4 bg-violet-500 rounded-xl font-medium">
              Guardar cambios
            </button>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-2 block">Descanso por defecto (segundos)</label>
              <div className="flex gap-2">
                {[60, 90, 120, 180].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setLocalSettings(p => ({ ...p, defaultRest: sec }))}
                    className={`flex-1 py-3 rounded-xl font-medium ${localSettings.defaultRest === sec ? 'bg-violet-500' : 'bg-white/10'}`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Auto-iniciar descanso</p>
                <p className="text-sm text-white/50">Al completar una serie</p>
              </div>
              <button
                onClick={() => setLocalSettings(p => ({ ...p, autoStartRest: !p.autoStartRest }))}
                className={`w-12 h-7 rounded-full transition-colors ${localSettings.autoStartRest ? 'bg-violet-500' : 'bg-white/20'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings.autoStartRest ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Mostrar series de calentamiento</p>
                <p className="text-sm text-white/50">Sugerir progresión</p>
              </div>
              <button
                onClick={() => setLocalSettings(p => ({ ...p, showWarmupSets: !p.showWarmupSets }))}
                className={`w-12 h-7 rounded-full transition-colors ${localSettings.showWarmupSets ? 'bg-violet-500' : 'bg-white/20'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings.showWarmupSets ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </Modal>

        {/* Help Modal */}
        <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Guía de Entreno">
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-violet-500/10 rounded-xl">
              <p className="font-bold text-violet-400 mb-1">🏋️ Entreno libre</p>
              <p className="text-white/60">Empieza un entreno vacío y añade ejercicios sobre la marcha.</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="font-bold text-fuchsia-400 mb-1">📋 Rutinas</p>
              <p className="text-white/60">Crea plantillas de entrenos. Organízalas en carpetas (Push, Pull, Legs).</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="font-bold text-emerald-400 mb-1">📝 Durante el entreno</p>
              <p className="text-white/60">
                • Toca el set para marcarlo completo<br />
                • Edita reps/peso tocando los números<br />
                • Timer de descanso automático<br />
                • Desliza para eliminar sets
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="font-bold text-blue-400 mb-1">📊 Progresión</p>
              <p className="text-white/60">
                • El historial muestra tus récords<br />
                • Intenta superar tu última sesión<br />
                • Añade peso o reps gradualmente
              </p>
            </div>
            <div className="p-3 bg-violet-500/20 rounded-xl">
              <p className="font-bold mb-1">💡 Tips</p>
              <p className="text-white/60">
                • Calienta con 2-3 series ligeras<br />
                • 3-5 series × 6-12 reps para hipertrofia<br />
                • Descansa 90-180s entre series pesadas<br />
                • Registra cada set para ver progreso
              </p>
            </div>
          </div>
        </Modal>
      </div>
    );

  }


  // =========================================================================
  // RENDER: ROUTINES
  // =========================================================================
  if (view === 'routines') {
    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">Rutinas</h1>
            </div>
            <button
              onClick={() => {
                setEditingRoutine({ id: generateId(), name: '', folder: '', exercises: [] });
                setView('routine-builder');
              }}
              className="bg-violet-500 rounded-full p-3"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </AnimatedMount>


        {folders.map((folder, fi) => (
          <AnimatedMount key={folder} delay={50 + fi * 25}>
            <Section title={folder.toUpperCase()} icon={Calendar} iconColor="text-violet-400">
              <div className="space-y-2">
                {routines.filter(r => folder === 'General' ? !r.folder : r.folder === folder).map(routine => (
                  <Card key={routine.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3" onClick={() => startWorkout(routine)}>
                        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                          <p className="font-medium">{routine.name}</p>
                          <p className="text-sm text-white/50">{routine.exercises.length} ejercicios</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingRoutine(routine); setView('routine-builder'); }}
                          className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startWorkout(routine)}
                          className="p-2 bg-violet-500 rounded-lg"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          </AnimatedMount>
        ))}
      </div>
    );

  }


  // =========================================================================
  // RENDER: ROUTINE BUILDER
  // =========================================================================
  if (view === 'routine-builder' && editingRoutine) {
    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setView('routines')} className="p-2 hover:bg-white/10 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold">{editingRoutine.name || 'Nueva rutina'}</h1>
            </div>
            <button
              onClick={() => saveRoutine(editingRoutine)}
              disabled={!editingRoutine.name || editingRoutine.exercises.length === 0}
              className="px-4 py-2 bg-violet-500 rounded-xl font-medium disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </AnimatedMount>


        {/* Routine info */}
        <AnimatedMount delay={50}>
          <Card>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre de la rutina"
                value={editingRoutine.name}
                onChange={(e) => setEditingRoutine(r => ({ ...r, name: e.target.value }))}
                className="w-full bg-white/10 rounded-xl p-3 outline-none"
              />
              <input
                type="text"
                placeholder="Carpeta (ej: Push Pull Legs)"
                value={editingRoutine.folder}
                onChange={(e) => setEditingRoutine(r => ({ ...r, folder: e.target.value }))}
                className="w-full bg-white/10 rounded-xl p-3 outline-none"
              />
            </div>
          </Card>
        </AnimatedMount>

        {/* Exercises */}
        <AnimatedMount delay={75}>
          <Section title="EJERCICIOS" icon={Dumbbell} iconColor="text-violet-400">
            <div className="space-y-2">
              {editingRoutine.exercises.map((ex, i) => {
                const exerciseInfo = getExerciseById(ex.exerciseId);
                return (
                  <Card key={i} className="py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="font-medium">{exerciseInfo?.name || ex.exerciseId}</span>
                      </div>
                      <button
                        onClick={() => setEditingRoutine(r => ({
                          ...r,
                          exercises: r.exercises.filter((_, idx) => idx !== i)
                        }))}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <label className="text-xs text-white/40">Sets</label>
                        <input
                          type="number"
                          value={ex.targetSets}
                          onChange={(e) => setEditingRoutine(r => ({
                            ...r,
                            exercises: r.exercises.map((x, idx) => idx === i ? { ...x, targetSets: parseInt(e.target.value) || 3 } : x)
                          }))}
                          className="w-full bg-white/10 rounded-lg p-2 outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40">Reps</label>
                        <input
                          type="text"
                          value={ex.targetReps}
                          onChange={(e) => setEditingRoutine(r => ({
                            ...r,
                            exercises: r.exercises.map((x, idx) => idx === i ? { ...x, targetReps: e.target.value } : x)
                          }))}
                          className="w-full bg-white/10 rounded-lg p-2 outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40">Descanso</label>
                        <select
                          value={ex.restSeconds}
                          onChange={(e) => setEditingRoutine(r => ({
                            ...r,
                            exercises: r.exercises.map((x, idx) => idx === i ? { ...x, restSeconds: parseInt(e.target.value) } : x)
                          }))}
                          className="w-full bg-white/10 rounded-lg p-2 outline-none"
                        >
                          {[30, 45, 60, 90, 120, 150, 180, 240, 300].map(s => (
                            <option key={s} value={s}>{s < 60 ? `${s}s` : `${s / 60}min`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Card>
                );
              })}

              <button
                onClick={() => setShowExercisePicker(true)}
                className="w-full p-4 border border-dashed border-white/20 rounded-xl text-white/50 flex items-center justify-center gap-2 hover:bg-white/5"
              >
                <Plus className="w-5 h-5" /> Añadir ejercicio
              </button>
            </div>
          </Section>
        </AnimatedMount>

        {/* Delete routine */}
        {editingRoutine.id && data.workoutRoutines?.find(r => r.id === editingRoutine.id) && (
          <AnimatedMount delay={100}>
            <button
              onClick={() => { deleteRoutine(editingRoutine.id); setView('routines'); }}
              className="w-full p-4 border border-red-500/30 rounded-xl text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/10"
            >
              <Trash2 className="w-5 h-5" /> Eliminar rutina
            </button>
          </AnimatedMount>
        )}

        {/* Exercise picker modal */}
        <Modal isOpen={showExercisePicker} onClose={() => setShowExercisePicker(false)} title="Añadir ejercicio">
          {/* Filters */}
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Buscar ejercicio..."
              value={exerciseFilter.search}
              onChange={(e) => setExerciseFilter(f => ({ ...f, search: e.target.value }))}
              className="w-full bg-white/10 rounded-xl p-3 outline-none"
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setExerciseFilter(f => ({ ...f, muscle: null }))}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${!exerciseFilter.muscle ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                Todos
              </button>
              {Object.entries(EXERCISE_DATABASE).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setExerciseFilter(f => ({ ...f, muscle: f.muscle === key ? null : key }))}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${exerciseFilter.muscle === key ? 'bg-violet-500' : 'bg-white/10'}`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise list */}
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {getFilteredExercises().map(ex => (
              <button
                key={ex.id}
                onClick={() => {
                  setEditingRoutine(r => ({
                    ...r,
                    exercises: [...(r.exercises || []), {
                      exerciseId: ex.id,
                      targetSets: 3,
                      targetReps: '8-12',
                      restSeconds: 90
                    }]
                  }));
                  setShowExercisePicker(false);
                }}
                className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-left"
              >
                <span className="text-xl">{ex.muscleEmoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{ex.name}</p>
                  <p className="text-xs text-white/40">{ex.muscleName} · {EQUIPMENT_TYPES[ex.equipment]?.name}</p>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      </div>
    );

  }


  // =========================================================================
  // RENDER: EXERCISE LIBRARY
  // =========================================================================
  if (view === 'exercise-library') {
    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Ejercicios</h1>
          </div>
        </AnimatedMount>


        {/* Search */}
        <AnimatedMount delay={25}>
          <input
            type="text"
            placeholder="Buscar ejercicio..."
            value={exerciseFilter.search}
            onChange={(e) => setExerciseFilter(f => ({ ...f, search: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-4 outline-none"
          />
        </AnimatedMount>

        {/* Muscle filters */}
        <AnimatedMount delay={50}>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setExerciseFilter(f => ({ ...f, muscle: null }))}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${!exerciseFilter.muscle ? 'bg-violet-500' : 'bg-white/10'}`}
            >
              Todos
            </button>
            {Object.entries(EXERCISE_DATABASE).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setExerciseFilter(f => ({ ...f, muscle: f.muscle === key ? null : key }))}
                className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap flex items-center gap-2 ${exerciseFilter.muscle === key ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </AnimatedMount>

        {/* Exercise list by muscle */}
        {(exerciseFilter.muscle ? [exerciseFilter.muscle] : Object.keys(EXERCISE_DATABASE)).map((muscleKey, mi) => {
          const muscle = EXERCISE_DATABASE[muscleKey];
          let exercises = muscle.exercises;

          if (exerciseFilter.search) {
            const search = exerciseFilter.search.toLowerCase();
            exercises = exercises.filter(e => e.name.toLowerCase().includes(search));
          }

          if (exercises.length === 0) return null;

          return (
            <AnimatedMount key={muscleKey} delay={75 + mi * 25}>
              <Section title={`${muscle.emoji} ${muscle.name.toUpperCase()}`}>
                <div className="space-y-2">
                  {exercises.map(ex => {
                    const pr = getPR(ex.id);
                    return (
                      <Card
                        key={ex.id}
                        className="py-3"
                        onClick={() => setShowExerciseDetail(ex)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              <span>{EQUIPMENT_TYPES[ex.equipment]?.icon}</span>
                            </div>
                            <div>
                              <p className="font-medium">{ex.name}</p>
                              <p className="text-xs text-white/40">{EQUIPMENT_TYPES[ex.equipment]?.name}</p>
                            </div>
                          </div>
                          {pr && (
                            <div className="text-right">
                              <p className="text-sm font-bold text-yellow-400">{pr.weight}kg</p>
                              <p className="text-xs text-white/40">PR</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </Section>
            </AnimatedMount>
          );
        })}

        {/* Exercise detail modal */}
        <Modal isOpen={!!showExerciseDetail} onClose={() => setShowExerciseDetail(null)} title={showExerciseDetail?.name}>
          {showExerciseDetail && (
            <div className="space-y-4">
              {/* Equipment & muscle */}
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">
                  {EQUIPMENT_TYPES[showExerciseDetail.equipment]?.icon} {EQUIPMENT_TYPES[showExerciseDetail.equipment]?.name}
                </span>
              </div>

              {/* Instructions */}
              <div>
                <p className="text-sm text-white/60 mb-2">Cómo ejecutarlo</p>
                <p className="text-sm">{showExerciseDetail.instructions}</p>
              </div>

              {/* PR */}
              {getPR(showExerciseDetail.id) && (
                <Card className="bg-yellow-500/10 border-yellow-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="font-medium">Tu PR</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">{getPR(showExerciseDetail.id).weight}kg x {getPR(showExerciseDetail.id).reps}</p>
                      <p className="text-xs text-white/40">{formatShortDate(getPR(showExerciseDetail.id).date)}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* History */}
              {getExerciseHistory(showExerciseDetail.id).length > 0 && (
                <div>
                  <p className="text-sm text-white/60 mb-2">Historial</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getExerciseHistory(showExerciseDetail.id).map((entry, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-sm">
                        <span className="text-white/60">{formatShortDate(entry.date)}</span>
                        <span>{entry.bestSet.weight}kg x{entry.bestSet.reps} · {entry.volume}kg vol</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    );

  }


  // =========================================================================
  // RENDER: HISTORY
  // =========================================================================
  if (view === 'history') {
    const allWorkouts = data.workouts
      .filter(w => w.is_completed)
      .sort((a, b) => b.day_id.localeCompare(a.day_id));


    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Historial</h1>
              <p className="text-white/50 text-sm">{allWorkouts.length} entrenos completados</p>
            </div>
          </div>
        </AnimatedMount>

        {allWorkouts.length > 0 ? (
          <div className="space-y-2">
            {allWorkouts.map((w, i) => {
              const volume = w.exercises?.reduce((sum, ex) =>
                sum + ex.sets.filter(s => s.completed).reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0)
                , 0) || 0;

              return (
                <AnimatedMount key={w.id} delay={i * 30}>
                  <Card className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{w.name}</p>
                        <p className="text-xs text-white/40">{formatDate(w.day_id)}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>{w.exercises?.length || 0} ejercicios</p>
                        <p className="text-xs text-white/40">{volume > 0 ? `${volume.toLocaleString()}kg` : ''}</p>
                      </div>
                    </div>
                  </Card>
                </AnimatedMount>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="Sin historial"
            description="Completa tu primer entreno para verlo aquí"
          />
        )}
      </div>
    );

  }



  // =========================================================================
  // RENDER: ACTIVE WORKOUT
  // =========================================================================
  if (view === 'workout' && workout) {
    const totals = getWorkoutTotals();
    const progress = totals.totalSets > 0 ? (totals.sets / totals.totalSets) * 100 : 0;

    // PREVIEW MODE - workout not started yet
    if (!workout.started_at) {
      return (
        <div className="space-y-4 pb-32">
          <AnimatedMount>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{workout.name}</h1>
                <p className="text-white/50 text-sm">{workout.exercises.length} ejercicios · Preview</p>
              </div>
              <button
                onClick={cancelWorkout}
                className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </AnimatedMount>

          {/* Exercise preview list */}
          <AnimatedMount delay={25}>
            <div className="space-y-2">
              {workout.exercises.map((ex, i) => (
                <Card key={ex.id}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-lg font-bold text-violet-400">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{ex.name}</p>
                      <p className="text-sm text-white/40">{ex.targetSets} sets × {ex.targetReps} reps</p>
                    </div>
                    {getPR(ex.exerciseId) && (
                      <span className="text-sm text-yellow-400">🏆 {getPR(ex.exerciseId).weight}kg</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </AnimatedMount>

          {/* Add exercise button */}
          <AnimatedMount delay={50}>
            <button
              onClick={() => setShowExercisePicker(true)}
              className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:border-violet-500/50 hover:text-violet-400 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Añadir ejercicio
            </button>
          </AnimatedMount>

          {/* Start button */}
          <AnimatedMount delay={75}>
            <button
              onClick={() => {
                setData(prev => ({
                  ...prev,
                  workouts: prev.workouts.map(w => w.id === workout.id ? {
                    ...w,
                    started_at: new Date().toISOString()
                  } : w)
                }));
                showToast('¡Entreno iniciado! 💪');
              }}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" /> Comenzar entreno
            </button>
          </AnimatedMount>
        </div>
      );
    }

    // TRACKING MODE - workout has started
    return (
      <div className="space-y-4 pb-32">
        {/* Header */}
        <AnimatedMount>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{workout.name}</h1>
              <p className="text-white/50 text-sm">{workout.exercises.length} ejercicios</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-lg font-mono">
                  <Timer className="w-4 h-4 text-violet-400" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
              </div>
              <button
                onClick={cancelWorkout}
                className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </AnimatedMount>

        {/* Progress */}
        <AnimatedMount delay={25}>
          <Card className="py-3">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-white/60">Progreso</span>
              <span className="font-medium">{totals.sets}/{totals.totalSets} sets · {totals.volume.toLocaleString()}kg</span>
            </div>
            <ProgressBar value={totals.sets} max={totals.totalSets || 1} color="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          </Card>
        </AnimatedMount>

        {/* Rest timer */}
        {restTimer !== null && (
          <AnimatedMount>
            <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">Descanso</span>
                </div>
                <span className="text-2xl font-mono font-bold">{formatTime(restTimer)}</span>
              </div>
              <ProgressBar value={restTimer} max={restDuration} color="bg-blue-500" />
              <div className="flex gap-2 mt-3">
                <button onClick={() => setRestTimer(t => t + 30)} className="flex-1 py-2 bg-white/10 rounded-lg text-sm">+30s</button>
                <button onClick={() => setRestTimer(null)} className="flex-1 py-2 bg-white/10 rounded-lg text-sm">Saltar</button>
              </div>
            </Card>
          </AnimatedMount>
        )}

        {/* Exercises */}
        {workout.exercises.map((ex, exIndex) => {
          const exCompleted = ex.sets.filter(s => s.completed && s.setType !== 'warmup').length;
          const exTotal = ex.sets.filter(s => s.setType !== 'warmup').length;
          const pr = getPR(ex.exerciseId);
          const lastPerf = getLastPerformance(ex.exerciseId);
          const isActive = activeEx === exIndex;
          const exVolume = ex.sets.filter(s => s.completed).reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);

          return (
            <AnimatedMount key={ex.id} delay={50 + exIndex * 20}>
              <Card
                onClick={() => setActiveEx(exIndex)}
                className={`transition-all ${isActive ? 'border-violet-500/50 bg-violet-500/5' : ''}`}
              >
                {/* Exercise header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${exCompleted === exTotal && exTotal > 0 ? 'bg-emerald-500' : 'bg-white/10'}
                  `}>
                      {exIndex + 1}
                    </div>
                    <div>
                      <p className="font-medium">{ex.name}</p>
                      <p className="text-xs text-white/40">
                        {exCompleted}/{exTotal} · {ex.targetReps}
                        {exVolume > 0 && ` · ${exVolume}kg`}
                      </p>
                    </div>
                  </div>
                  {exCompleted === exTotal && exTotal > 0 && <Check className="w-5 h-5 text-emerald-400" />}
                </div>

                {/* Info badges */}
                <div className="flex gap-2 mb-3 text-xs flex-wrap">
                  {pr && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg">
                      🏆 PR: {pr.weight}kg
                    </span>
                  )}
                  {lastPerf && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowExerciseDetail(getExerciseById(ex.exerciseId)); }}
                      className="px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20"
                    >
                      📊 Último: {lastPerf.sets[0]?.weight}kg
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowPlateCalc(true); }}
                    className="px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20"
                  >
                    🧮 Discos
                  </button>
                </div>

                {/* Sets - when active */}
                {isActive && (
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-1 text-xs text-white/40 px-1">
                      <span className="col-span-1">SET</span>
                      <span className="col-span-3 text-center">KG</span>
                      <span className="col-span-3 text-center">REPS</span>
                      <span className="col-span-2 text-center">TIPO</span>
                      <span className="col-span-3"></span>
                    </div>

                    {/* Set rows */}
                    {ex.sets.map((set, setIndex) => {
                      const lastSet = lastPerf?.sets[setIndex];
                      const setTypeInfo = SET_TYPES[set.setType] || SET_TYPES.normal;

                      return (
                        <div
                          key={set.id}
                          className={`grid grid-cols-12 gap-1 items-center p-2 rounded-lg ${set.completed ? 'bg-emerald-500/20' : setTypeInfo.color
                            }`}
                        >
                          <span className={`col-span-1 text-center text-sm font-medium ${setTypeInfo.textColor || ''}`}>
                            {set.setType === 'warmup' ? 'W' : setIndex + 1 - ex.sets.slice(0, setIndex).filter(s => s.setType === 'warmup').length}
                          </span>
                          <input
                            type="number"
                            placeholder={lastSet?.weight?.toString() || '-'}
                            value={set.weight || ''}
                            onChange={(e) => updateSet(exIndex, setIndex, 'weight', parseFloat(e.target.value) || null)}
                            onClick={(e) => e.stopPropagation()}
                            className="col-span-3 bg-white/10 rounded-lg px-2 py-1.5 text-center outline-none text-sm w-full"
                          />
                          <input
                            type="number"
                            placeholder={ex.targetReps?.split('-')[0] || '-'}
                            value={set.reps || ''}
                            onChange={(e) => updateSet(exIndex, setIndex, 'reps', parseInt(e.target.value) || null)}
                            onClick={(e) => e.stopPropagation()}
                            className="col-span-3 bg-white/10 rounded-lg px-2 py-1.5 text-center outline-none text-sm w-full"
                          />
                          <select
                            value={set.setType}
                            onChange={(e) => updateSet(exIndex, setIndex, 'setType', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="col-span-2 bg-white/10 rounded-lg px-1 py-1.5 text-center outline-none text-xs appearance-none"
                          >
                            {Object.entries(SET_TYPES).map(([key, type]) => (
                              <option key={key} value={key}>{type.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSet(exIndex, setIndex); }}
                            className={`col-span-3 h-9 rounded-lg flex items-center justify-center transition-all
                            ${set.completed ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}
                          `}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button onClick={(e) => { e.stopPropagation(); addSet(exIndex); }} className="flex-1 py-2 border border-dashed border-white/20 rounded-lg text-sm text-white/50">+ Set</button>
                      {ex.sets.length > 1 && (
                        <button onClick={(e) => { e.stopPropagation(); removeSet(exIndex); }} className="px-3 py-2 bg-white/5 rounded-lg text-sm text-white/50 hover:bg-red-500/20 hover:text-red-400">-</button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); deleteExercise(exIndex); }} className="px-3 py-2 bg-white/5 rounded-lg text-sm text-white/50 hover:bg-red-500/20 hover:text-red-400">🗑️</button>
                    </div>
                  </div>
                )}
              </Card>
            </AnimatedMount>
          );
        })}

        {/* Add exercise */}
        <button
          onClick={() => setShowExercisePicker(true)}
          className="w-full p-4 border border-dashed border-white/20 rounded-xl text-white/50 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Añadir ejercicio
        </button>

        {/* Complete */}
        {progress >= 30 && (
          <button
            onClick={completeWorkout}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 py-4 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" /> Completar entreno
          </button>
        )}

        {/* Exercise picker */}
        <Modal isOpen={showExercisePicker} onClose={() => setShowExercisePicker(false)} title="Añadir ejercicio">
          <input
            type="text"
            placeholder="Buscar..."
            value={exerciseFilter.search}
            onChange={(e) => setExerciseFilter(f => ({ ...f, search: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-3 outline-none mb-3"
          />
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            <button onClick={() => setExerciseFilter(f => ({ ...f, muscle: null }))} className={`px-3 py-1 rounded-lg text-sm ${!exerciseFilter.muscle ? 'bg-violet-500' : 'bg-white/10'}`}>Todos</button>
            {Object.entries(EXERCISE_DATABASE).map(([key, cat]) => (
              <button key={key} onClick={() => setExerciseFilter(f => ({ ...f, muscle: key }))} className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${exerciseFilter.muscle === key ? 'bg-violet-500' : 'bg-white/10'}`}>{cat.emoji}</button>
            ))}
          </div>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {getFilteredExercises().map(ex => (
              <button key={ex.id} onClick={() => addExerciseToWorkout(ex.id)} className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-left">
                <span>{ex.muscleEmoji}</span>
                <div className="flex-1">
                  <p>{ex.name}</p>
                  <p className="text-xs text-white/40">{ex.muscleName}</p>
                </div>
                {getPR(ex.id) && <span className="text-xs text-yellow-400">{getPR(ex.id).weight}kg</span>}
              </button>
            ))}
          </div>
        </Modal>

        {/* Plate calculator */}

        <Modal isOpen={showPlateCalc} onClose={() => setShowPlateCalc(false)} title="Calculadora de discos">
          <PlateCalculator />
        </Modal>
      </div>
    );

  }


  // Fallback: show loading or redirect - this shouldn't normally happen
  // If we get here, view is 'workout' but workout is null, or view is 'routine-builder' but editingRoutine is null
  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-col items-center justify-center py-20">
        <Dumbbell className="w-12 h-12 text-white/20 mb-4" />
        <p className="text-white/40 mb-4">Cargando...</p>
        <button
          onClick={() => setView('home')}
          className="px-4 py-2 bg-violet-500 rounded-xl"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};


export default WorkoutScreen;
