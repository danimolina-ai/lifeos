// TodayScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Moon, Zap, Check, X, Flame, TrendingUp, Award, Coffee, Sun, Sunset, Edit3, Trash2, Plus, Play, Pause, RotateCcw, Settings, Sparkles, ArrowRight, RefreshCw, Timer, Trophy, Scale, BookOpen, Droplets, Brain, Clock, AlertCircle, Utensils, Dumbbell, Target, Calendar, Heart, Star, Users, Wallet, Briefcase } from 'lucide-react';
import { getToday, getDateOffset, formatDate, formatShortDate, generateId, isToday, isPast, getWeekDates, getGreeting } from '../utils/date';
import { calculateDayScore, getHabitStreak } from '../utils/score';
import { getScoreColor, getScoreHexColor, formatMinutes } from '../utils/formatting';
import { shouldDoHabitOnDay, getStreakWithFreeze, getMissedYesterday, getMasteryLevel } from '../utils/habits';
import { Card, Modal, AnimatedMount, ProgressBar, ProgressRing, DayScore, MiniChart, EnergyIndicator, WaterTracker, MoodSelector, EmptyState, SwipeableItem, Toast } from '../components/ui';
import { AccordionSection } from '../components/ui/AccordionSection';
import { SleepInput } from '../components/ui/SleepInput';

const TodayScreen = ({ data, setData, setScreen, showToast }) => {
  // Date navigation
  const [viewDate, setViewDate] = useState(getToday());
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week'
  const [editingSet, setEditingSet] = useState(null); // For inline set editing
  const [showWorkoutOptions, setShowWorkoutOptions] = useState(false); // Workout menu
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear()); // Year for calendar view

  // Work section states
  const [quickTaskInput, setQuickTaskInput] = useState('');
  const [showDetailedAdd, setShowDetailedAdd] = useState(false);
  const [editingWorkTask, setEditingWorkTask] = useState(null);
  const [focusTimer, setFocusTimer] = useState(null);
  const [focusTimeLeft, setFocusTimeLeft] = useState(0);
  const [newDetailedTask, setNewDetailedTask] = useState({
    title: '', description: '', project_id: '', priority: 'medium',
    eisenhower: 'q2', status: 'todo', timeEstimate: 30, dueDate: '', isDeepWork: false
  });

  // Consciousness inline states
  const [consGratitudeInputs, setConsGratitudeInputs] = useState(['', '', '']);
  const [consJournalText, setConsJournalText] = useState('');
  const [consJournalMood, setConsJournalMood] = useState(null);
  const [consBreathingActive, setConsBreathingActive] = useState(false);
  const [consBreathPhase, setConsBreathPhase] = useState('idle');
  const [consBreathTimer, setConsBreathTimer] = useState(0);
  const [consBreathRound, setConsBreathRound] = useState(0);
  const [consBreathTechnique, setConsBreathTechnique] = useState('478');
  const [consExpandedCard, setConsExpandedCard] = useState(null); // 'gratitude', 'journal', 'breathing', 'practice'
  const [consPracticeNotes, setConsPracticeNotes] = useState('');

  // Relationships states
  const [relExpandedCard, setRelExpandedCard] = useState(null);
  const [relShowAddContact, setRelShowAddContact] = useState(false);
  const [relNewContact, setRelNewContact] = useState({ name: '', category: 'close_friend', contactFrequency: 'weekly' });
  const [relInteractionNote, setRelInteractionNote] = useState('');

  // Personal tasks states  
  const [personalExpandedTask, setPersonalExpandedTask] = useState(null);
  const [personalNewSubtask, setPersonalNewSubtask] = useState('');
  const [personalShowAddTask, setPersonalShowAddTask] = useState(false);
  const [personalNewTask, setPersonalNewTask] = useState({ title: '', category: 'home', dueDate: '', priority: 'medium' });

  // Finance quick-add states
  const [financeShowQuickAdd, setFinanceShowQuickAdd] = useState(false);
  const [financeQuickAmount, setFinanceQuickAmount] = useState('');
  const [financeQuickCategory, setFinanceQuickCategory] = useState('food');
  const [financeQuickType, setFinanceQuickType] = useState('expense');
  const [financeQuickDescription, setFinanceQuickDescription] = useState('');

  // Notifications state - track dismissed notifications for this session
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());

  // Template selection modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateModalView, setTemplateModalView] = useState('select'); // 'select' or 'create'
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateExercises, setNewTemplateExercises] = useState([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');

  // Workout tracking states
  const [workoutElapsedTime, setWorkoutElapsedTime] = useState(0);
  const [workoutRestTimer, setWorkoutRestTimer] = useState(null);
  const [workoutRestDuration, setWorkoutRestDuration] = useState(90);
  const [workoutActiveEx, setWorkoutActiveEx] = useState(0);
  const [showWorkoutExercisePicker, setShowWorkoutExercisePicker] = useState(false);
  const [workoutExerciseFilter, setWorkoutExerciseFilter] = useState({ search: '', muscle: null });
  const [showPlateCalc, setShowPlateCalc] = useState(false);

  const today = getToday();
  const isViewingToday = viewDate === today;

  // Focus timer effect
  useEffect(() => {
    if (focusTimer && focusTimeLeft > 0) {
      const interval = setInterval(() => {
        setFocusTimeLeft(t => {
          if (t <= 1) {
            clearInterval(interval);
            setFocusTimer(null);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            showToast('🍅 Pomodoro completado!');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [focusTimer, focusTimeLeft]);

  // Breathing timer effect for consciousness section
  useEffect(() => {
    if (!consBreathingActive || consBreathPhase === 'idle') return;

    const breathTechniques = {
      '478': { inhale: 4, hold: 7, exhale: 8, holdOut: 0, rounds: 4 },
      'box': { inhale: 4, hold: 4, exhale: 4, holdOut: 4, rounds: 4 }
    };
    const technique = breathTechniques[consBreathTechnique];

    const targetTime = consBreathPhase === 'inhale' ? technique.inhale :
      consBreathPhase === 'hold' ? technique.hold :
        consBreathPhase === 'exhale' ? technique.exhale : technique.holdOut;

    const interval = setInterval(() => {
      setConsBreathTimer(t => {
        if (t >= targetTime - 0.1) {
          // Move to next phase
          let nextPhase;
          if (consBreathPhase === 'inhale') nextPhase = technique.hold > 0 ? 'hold' : 'exhale';
          else if (consBreathPhase === 'hold') nextPhase = 'exhale';
          else if (consBreathPhase === 'exhale') nextPhase = technique.holdOut > 0 ? 'holdOut' : 'inhale';
          else nextPhase = 'inhale';

          // Check if round complete
          if (nextPhase === 'inhale' && consBreathPhase !== 'inhale') {
            if (consBreathRound >= technique.rounds - 1) {
              // Session complete
              setConsBreathingActive(false);
              setConsBreathPhase('idle');
              setConsBreathRound(0);
              return 0;
            }
            setConsBreathRound(r => r + 1);
          }

          setConsBreathPhase(nextPhase);
          return 0;
        }
        return t + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [consBreathingActive, consBreathPhase, consBreathTechnique, consBreathRound]);

  // Navigation handlers
  const goToPrevDay = () => setViewDate(getDateOffset(viewDate, -1));
  const goToNextDay = () => setViewDate(getDateOffset(viewDate, 1));
  const goToToday = () => setViewDate(today);

  // Get relative day name
  const getRelativeDayName = () => {
    const diffDays = Math.round((new Date(viewDate) - new Date(today)) / (1000 * 60 * 60 * 24));
    switch (diffDays) {
      case -2: return 'Antes de ayer';
      case -1: return 'Ayer';
      case 0: return 'Acción';
      case 1: return 'Mañana';
      case 2: return 'Pasado mañana';
      default: return null;
    }
  };

  // Format date for display
  const formatViewDate = () => {
    const relativeName = getRelativeDayName();
    const date = new Date(viewDate);
    const dayMonth = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    if (relativeName) {
      return `${relativeName}, ${dayMonth}`;
    }

    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dayMonth}`;
  };

  // Check if viewing future
  const isViewingFuture = viewDate > today;

  // Get planned meals for future dates
  const plannedMealsForDate = (data.plannedMeals || []).filter(m => m.day_id === viewDate && !m.confirmed);

  // Get or create day data
  const dayData = data.days[viewDate] || {
    energy_level: 3,
    sleep_hours: 0,
    sleep_quality: 0,
    water_glasses: 0,
    focus_note: ''
  };

  // Filter data for current view date
  const dayMeals = (data.meals || []).filter(m => m.day_id === viewDate);
  const dayWorkout = (data.workouts || []).find(w => w.day_id === viewDate);
  const dayTasks = (data.tasks || []).filter(t => t.day_id === viewDate);
  const dayJournal = data.journals?.find(j => j.date === viewDate);

  // Detect active workout (not completed) for today
  const activeWorkout = (data.workouts || []).find(w => w.day_id === viewDate && !w.is_completed);

  // Elapsed time effect for active workout - only runs when workout has started
  useEffect(() => {
    if (activeWorkout && !activeWorkout.is_completed && activeWorkout.started_at) {
      const startTime = new Date(activeWorkout.started_at).getTime();
      const updateElapsed = () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setWorkoutElapsedTime(elapsed);
      };
      updateElapsed();
      const interval = setInterval(updateElapsed, 1000);
      return () => clearInterval(interval);
    } else {
      setWorkoutElapsedTime(0);
    }
  }, [activeWorkout?.id, activeWorkout?.is_completed, activeWorkout?.started_at]);

  // Rest timer countdown effect
  useEffect(() => {
    if (workoutRestTimer !== null && workoutRestTimer > 0) {
      const timer = setTimeout(() => {
        setWorkoutRestTimer(t => {
          if (t <= 1) {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            return null;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [workoutRestTimer]);

  // Workout helper: Format time
  const formatWorkoutTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Workout helper: Get workout totals
  const getWorkoutTotals = () => {
    if (!activeWorkout) return { sets: 0, totalSets: 0, volume: 0 };
    let sets = 0, totalSets = 0, volume = 0;
    activeWorkout.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.setType !== 'warmup') totalSets++;
        if (set.completed && set.setType !== 'warmup') sets++;
        if (set.completed) volume += (set.weight || 0) * (set.reps || 0);
      });
    });
    return { sets, totalSets, volume };
  };

  // Workout helper: Toggle set complete
  const workoutToggleSet = (exIndex, setIndex) => {
    if (!activeWorkout) return;
    const exercise = activeWorkout.exercises[exIndex];
    const set = exercise.sets[setIndex];

    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === activeWorkout.id ? {
        ...w,
        exercises: w.exercises.map((e, ei) => ei === exIndex ? {
          ...e,
          sets: e.sets.map((s, si) => si === setIndex ? { ...s, completed: !s.completed } : s)
        } : e)
      } : w)
    }));

    if (!set.completed) {
      setWorkoutRestTimer(exercise.restSeconds || 90);
      setWorkoutRestDuration(exercise.restSeconds || 90);
    }
  };

  // Workout helper: Update set field
  const workoutUpdateSet = (exIndex, setIndex, field, value) => {
    if (!activeWorkout) return;
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === activeWorkout.id ? {
        ...w,
        exercises: w.exercises.map((e, ei) => ei === exIndex ? {
          ...e,
          sets: e.sets.map((s, si) => si === setIndex ? { ...s, [field]: value } : s)
        } : e)
      } : w)
    }));
  };

  // Workout helper: Add set
  const workoutAddSet = (exIndex) => {
    if (!activeWorkout) return;
    const exercise = activeWorkout.exercises[exIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];

    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === activeWorkout.id ? {
        ...w,
        exercises: w.exercises.map((e, ei) => ei === exIndex ? {
          ...e,
          sets: [...e.sets, {
            id: `set-${Date.now()}-${Math.random().toString(36).slice(2)}`,
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

  // Workout helper: Remove set
  const workoutRemoveSet = (exIndex) => {
    if (!activeWorkout) return;
    const exercise = activeWorkout.exercises[exIndex];
    if (exercise.sets.length <= 1) return;

    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === activeWorkout.id ? {
        ...w,
        exercises: w.exercises.map((e, ei) => ei === exIndex ? {
          ...e,
          sets: e.sets.slice(0, -1)
        } : e)
      } : w)
    }));
  };

  // Workout helper: Delete exercise
  const workoutDeleteExercise = (exIndex) => {
    if (!activeWorkout || activeWorkout.exercises.length <= 1) return;
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === activeWorkout.id ? {
        ...w,
        exercises: w.exercises.filter((_, i) => i !== exIndex)
      } : w)
    }));
    if (workoutActiveEx >= exIndex && workoutActiveEx > 0) setWorkoutActiveEx(workoutActiveEx - 1);
  };

  // Workout helper: Add exercise to workout
  const workoutAddExercise = (exerciseId) => {
    if (!activeWorkout) return;
    const exDb = getExerciseById(exerciseId);
    if (!exDb) return;

    const newEx = {
      id: `ex-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      exerciseId,
      name: exDb.name,
      targetSets: 3,
      targetReps: '8-12',
      restSeconds: 90,
      notes: '',
      sets: Array.from({ length: 3 }, () => ({
        id: `set-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        weight: null, reps: null, rpe: null, setType: 'normal', completed: false
      }))
    };

    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === activeWorkout.id ? {
        ...w,
        exercises: [...w.exercises, newEx]
      } : w)
    }));
    setShowWorkoutExercisePicker(false);
    setWorkoutActiveEx(activeWorkout.exercises.length);
  };

  // Workout helper: Complete workout
  const workoutComplete = () => {
    if (!activeWorkout) return;
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === activeWorkout.id ? {
        ...w,
        is_completed: true,
        finished_at: new Date().toISOString(),
        duration_seconds: workoutElapsedTime
      } : w)
    }));
    showToast('¡Entreno completado! 🎉');
    setWorkoutElapsedTime(0);
    setWorkoutRestTimer(null);
    setWorkoutActiveEx(0);
  };

  // Workout helper: Cancel workout
  const workoutCancel = () => {
    if (!activeWorkout) return;
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.filter(w => w.id !== activeWorkout.id)
    }));
    showToast('Entreno cancelado');
    setWorkoutElapsedTime(0);
    setWorkoutRestTimer(null);
    setWorkoutActiveEx(0);
  };

  // Workout helper: Get filtered exercises
  const getFilteredExercises = () => {
    let exercises = getAllExercises();
    if (workoutExerciseFilter.muscle) {
      exercises = exercises.filter(e => e.muscle === workoutExerciseFilter.muscle);
    }
    if (workoutExerciseFilter.search) {
      exercises = exercises.filter(e => e.name.toLowerCase().includes(workoutExerciseFilter.search.toLowerCase()));
    }
    return exercises;
  };

  // Workout helper: Get PR for exercise
  const getExercisePR = (exerciseId) => {
    let bestWeight = 0;
    let bestReps = 0;
    let prDate = null;
    (data.workouts || []).filter(w => w.is_completed).forEach(w => {
      w.exercises?.forEach(ex => {
        if (ex.exerciseId === exerciseId) {
          ex.sets?.filter(s => s.completed).forEach(set => {
            if ((set.weight || 0) > bestWeight) {
              bestWeight = set.weight;
              bestReps = set.reps || 0;
              prDate = w.day_id;
            }
          });
        }
      });
    });
    return bestWeight > 0 ? { weight: bestWeight, reps: bestReps, date: prDate } : null;
  };

  // Workout helper: Get last performance
  const getLastPerformance = (exerciseId) => {
    const workouts = (data.workouts || [])
      .filter(w => w.is_completed && w.exercises?.some(e => e.exerciseId === exerciseId))
      .sort((a, b) => b.day_id.localeCompare(a.day_id));
    if (workouts.length === 0) return null;
    const ex = workouts[0].exercises?.find(e => e.exerciseId === exerciseId);
    return ex ? { ...ex, date: workouts[0].day_id } : null;
  };

  // Workout helper: Start workout (set started_at timestamp)
  const workoutStart = () => {
    if (!activeWorkout) return;
    setData(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === activeWorkout.id ? {
        ...w,
        started_at: new Date().toISOString()
      } : w)
    }));
    showToast('¡Entreno iniciado! 💪');
  };

  // Get routines (use defaults if no custom routines exist) - same logic as WorkoutScreen
  const routines = data.workoutRoutines?.length > 0 ? data.workoutRoutines : DEFAULT_ROUTINES;

  // Get habit logs for this day (initialize if needed)
  const dayHabitLogs = useMemo(() => {
    return (data.habits || []).map(habit => {
      const existingLog = data.habitLogs?.find(l => l.habit_id === habit.id && l.date === viewDate);
      return existingLog || { habit_id: habit.id, date: viewDate, completed: false };
    });
  }, [data.habits, data.habitLogs, viewDate]);

  // Elite habit helpers
  const shouldDoHabitOnDay = (habit, date) => {
    const dayOfWeek = new Date(date).getDay();
    if (!habit.frequency || habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (habit.frequency === 'weekend') return dayOfWeek === 0 || dayOfWeek === 6;
    if (habit.frequency === 'custom') return (habit.customDays || [1, 2, 3, 4, 5, 6, 0]).includes(dayOfWeek);
    return true;
  };

  const getStreakWithFreeze = (habitId, freezeDays = 2) => {
    const logs = data.habitLogs?.filter(l => l.habit_id === habitId && l.completed) || [];
    if (logs.length === 0) return { current: 0, best: 0 };
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
        if (wasCompleted) streak++;
        else if (freezeUsed < freezeDays) freezeUsed++;
        else break;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return { current: streak, freezeUsed };
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
    const streak = getStreakWithFreeze(habitId);
    const score = (totalCompletions * 0.3) + (streak.current * 2);
    if (score >= 100) return 5;
    if (score >= 60) return 4;
    if (score >= 30) return 3;
    if (score >= 15) return 2;
    return 1;
  };

  // Habits that should be done on viewDate
  const todayHabits = data.habits.filter(h => shouldDoHabitOnDay(h, viewDate));
  const todayHabitsCompleted = dayHabitLogs.filter(l => {
    const habit = data.habits.find(h => h.id === l.habit_id);
    return l.completed && shouldDoHabitOnDay(habit, viewDate);
  }).length;

  // Check for "never miss twice" alerts
  const habitsWithAlert = data.habits.filter(h => getMissedYesterday(h.id) && !dayHabitLogs.find(l => l.habit_id === h.id)?.completed);

  // Calculations
  const totalCals = dayMeals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProt = dayMeals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalCarbs = dayMeals.reduce((s, m) => s + (m.carbs || 0), 0);
  const totalFats = dayMeals.reduce((s, m) => s + (m.fats || 0), 0);
  const habitsCompleted = todayHabitsCompleted;
  const tasksCompleted = dayTasks.filter(t => t.completed).length;
  const dayScore = calculateDayScore(dayData, dayHabitLogs, dayMeals, dayTasks, dayWorkout, data.user.goals);

  const latestWeight = data.bodyMetrics?.sort((a, b) => b.date.localeCompare(a.date))[0];
  const prevWeight = data.bodyMetrics?.sort((a, b) => b.date.localeCompare(a.date))[1];
  const weightChange = latestWeight && prevWeight ? (latestWeight.weight - prevWeight.weight).toFixed(1) : null;

  // Week overview
  const weekDates = getWeekDates(viewDate);
  const weekDayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  // Modals
  const [showSleep, setShowSleep] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('lunch');

  // Meal search states
  const [mealSearchQuery, setMealSearchQuery] = useState('');
  const [mealCategory, setMealCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState(null);
  const [mealServings, setMealServings] = useState(1);
  const [mealAddMode, setMealAddMode] = useState('search'); // 'search', 'scan', 'new'
  const [newFood, setNewFood] = useState({ name: '', serving: '100g', calories: '', protein: '', carbs: '', fats: '', barcode: '', category: 'other' });
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [showCreateFromScan, setShowCreateFromScan] = useState(false);

  // Combined food database (built-in + user custom)
  const customFoods = data.customFoods || [];
  const allFoods = [...FOOD_DATABASE, ...customFoods];

  // Get active meal types from user settings
  const mealMode = data.user.goals?.mealMode || 'separate';
  const activeMealSlots = data.user.goals?.mealSlots || ['breakfast', 'lunch', 'snack', 'dinner'];
  const allMealTypes = [
    { type: 'breakfast', emoji: '🌅', label: 'Desayuno' },
    { type: 'lunch', emoji: '☀️', label: 'Comida' },
    { type: 'snack', emoji: '🍎', label: 'Snack' },
    { type: 'dinner', emoji: '🌙', label: 'Cena' }
  ];
  const visibleMealTypes = mealMode === 'single'
    ? [{ type: 'all', emoji: '🍽️', label: 'Comidas' }]
    : allMealTypes.filter(m => activeMealSlots.includes(m.type));

  // Get active areas from settings
  const activeAreas = data.user.activeAreas || ['nutrition', 'workout', 'habits', 'work', 'personal', 'body', 'finances', 'consciousness', 'relationships'];

  const [focusNote, setFocusNote] = useState(dayData.focus_note || '');
  const [journalData, setJournalData] = useState(dayJournal || {
    mood: 3,
    energy: 3,
    wins: ['', '', ''],
    gratitude: '',
    learning: '',
    tomorrow: ['', '', ''],
    reflection: ''
  });

  // Greeting
  const greeting = getGreeting();

  // Handlers
  const updateDay = (updates) => {
    setData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [viewDate]: { ...dayData, ...updates }
      }
    }));
  };

  // Confirm planned meal
  const confirmPlannedMeal = (plannedMeal) => {
    const meal = {
      id: generateId(),
      day_id: viewDate,
      meal_type: plannedMeal.meal_type,
      name: plannedMeal.name,
      serving: plannedMeal.serving,
      servings: plannedMeal.servings,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      calories: plannedMeal.calories,
      protein: plannedMeal.protein,
      carbs: plannedMeal.carbs,
      fats: plannedMeal.fats,
      fromPlanned: true
    };

    setData(prev => ({
      ...prev,
      meals: [...prev.meals, meal],
      plannedMeals: prev.plannedMeals.map(m =>
        m.id === plannedMeal.id ? { ...m, confirmed: true } : m
      )
    }));

    showToast('Comida confirmada');
  };

  // Delete planned meal
  const deletePlannedMeal = (id) => {
    setData(prev => ({
      ...prev,
      plannedMeals: prev.plannedMeals.filter(m => m.id !== id)
    }));
    showToast('Planificación eliminada');
  };

  const toggleHabit = (habitId, useMinVersion = false) => {
    const existingLog = data.habitLogs?.find(l => l.habit_id === habitId && l.date === viewDate);
    const habit = data.habits.find(h => h.id === habitId);

    if (existingLog) {
      const wasCompleted = existingLog.completed;
      setData(prev => ({
        ...prev,
        habitLogs: prev.habitLogs.map(l =>
          l.habit_id === habitId && l.date === viewDate
            ? { ...l, completed: !l.completed, completedAt: !l.completed ? new Date().toISOString() : null, usedMinVersion: useMinVersion }
            : l
        )
      }));
      // Celebration when completing (not uncompleting)
      if (!wasCompleted) {
        showToast(`${habit?.icon || '✅'} ¡${habit?.name || 'Hábito'} completado!`, 'celebration');
      }
    } else {
      setData(prev => ({
        ...prev,
        habitLogs: [...(prev.habitLogs || []), {
          id: generateId(),
          habit_id: habitId,
          date: viewDate,
          completed: true,
          completedAt: new Date().toISOString(),
          usedMinVersion: useMinVersion
        }]
      }));
      // Celebration for new completion
      showToast(`${habit?.icon || '✅'} ¡${habit?.name || 'Hábito'} completado!`, 'celebration');
    }
  };

  const toggleTask = (taskId) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const updateWater = (glasses) => {
    updateDay({ water_glasses: glasses });
  };

  // Finance quick-add handler
  const addQuickTransaction = (amount, type = 'expense', category = 'food', description = '') => {
    const financeMode = data.finances?.financeMode || 'personal';
    const transactionKey = financeMode === 'business' ? 'businessTransactions' : 'personalTransactions';
    const currency = data.finances?.currency || '€';

    const transaction = {
      id: generateId(),
      amount: parseFloat(amount),
      type,
      category,
      description: description || (type === 'expense' ? 'Gasto rápido' : 'Ingreso rápido'),
      date: viewDate
    };

    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: [...(prev.finances?.[transactionKey] || prev.finances?.transactions || []), transaction]
      }
    }));

    showToast(`${type === 'expense' ? '💸' : '💰'} ${type === 'expense' ? '-' : '+'}${amount}${currency}`);
    setFinanceShowQuickAdd(false);
    setFinanceQuickAmount('');
    setFinanceQuickDescription('');
  };

  const saveJournal = () => {
    const entry = {
      id: dayJournal?.id || generateId(),
      date: viewDate,
      ...journalData
    };
    setData(prev => ({
      ...prev,
      journals: dayJournal
        ? prev.journals.map(j => j.id === entry.id ? entry : j)
        : [...(prev.journals || []), entry]
    }));
    setShowJournal(false);
    showToast('Diario guardado');
  };

  // Workout info
  const workoutProgress = dayWorkout?.exercises?.reduce((acc, ex) => {
    const completed = ex.sets.filter(s => s.completed).length;
    const total = ex.sets.length;
    return { completed: acc.completed + completed, total: acc.total + total };
  }, { completed: 0, total: 0 }) || { completed: 0, total: 0 };

  const nextExercise = dayWorkout?.exercises?.find(ex =>
    ex.sets.some(s => !s.completed)
  );

  // ========================================================================
  // TIER 3: CORRELATION ENGINE - Cross-Area Insights
  // ========================================================================
  const getCorrelations = useMemo(() => {
    const correlations = [];
    const last14Days = Array.from({ length: 14 }, (_, i) => getDateOffset(getToday(), -i));

    // Helper: Get average for a metric over days
    const getAverageForDays = (days, getter) => {
      const values = days.map(d => getter(d)).filter(v => v !== null && v !== undefined && !isNaN(v));
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    };

    // 3.1 SLEEP → ENERGY correlation
    const todaySleep = dayData?.sleep_hours;
    const todayEnergy = dayData?.energy_level;
    if (todaySleep && todayEnergy !== undefined) {
      const avgEnergy = getAverageForDays(last14Days, d => data.days[d]?.energy_level);
      const avgSleep = getAverageForDays(last14Days, d => data.days[d]?.sleep_hours);

      if (avgEnergy && avgSleep) {
        if (todaySleep >= 7 && todayEnergy > avgEnergy) {
          correlations.push({
            id: 'sleep-energy-good',
            icon: '😴→⚡',
            text: `Dormiste ${todaySleep}h → Tu energía es ${Math.round((todayEnergy / avgEnergy - 1) * 100)}% mayor que tu media`,
            type: 'success',
            area: 'sleep'
          });
        } else if (todaySleep < 6 && avgSleep >= 7) {
          correlations.push({
            id: 'sleep-energy-bad',
            icon: '⚠️💤',
            text: `Solo ${todaySleep}h de sueño (tu media es ${avgSleep.toFixed(1)}h). Espera menos energía hoy`,
            type: 'warning',
            area: 'sleep'
          });
        }
      }
    }

    // 3.2 HABITS → Score/Momentum
    if (dayHabitLogs.length > 0 && data.habits.length > 0) {
      const last7Completion = last14Days.slice(0, 7).map(d => {
        const dayLogs = data.habitLogs?.filter(l => l.date === d && l.completed) || [];
        return data.habits.length > 0 ? dayLogs.length / data.habits.length : 0;
      });
      const weeklyAvg = last7Completion.reduce((a, b) => a + b, 0) / 7;
      const todayRate = dayHabitLogs.filter(h => h.completed).length / data.habits.length;

      if (weeklyAvg >= 0.8) {
        correlations.push({
          id: 'habits-streak',
          icon: '🔥',
          text: `¡${Math.round(weeklyAvg * 100)}% esta semana! Tu consistencia impulsa resultados`,
          type: 'success',
          area: 'habits'
        });
      } else if (todayRate > weeklyAvg + 0.2 && todayRate >= 0.5) {
        correlations.push({
          id: 'habits-improving',
          icon: '📈',
          text: `Hoy llevas ${Math.round(todayRate * 100)}% vs ${Math.round(weeklyAvg * 100)}% de media. ¡Sigue así!`,
          type: 'success',
          area: 'habits'
        });
      }
    }

    // 3.3 CALORIES → Weight trend
    const bodyMetrics = data.bodyMetrics || [];
    if (dayMeals.length > 0 && bodyMetrics.length >= 2 && data.user.goals?.calories) {
      const totalCals = dayMeals.reduce((s, m) => s + (m.calories || 0), 0);
      const calGoal = data.user.goals.calories;
      const sortedMetrics = [...bodyMetrics].sort((a, b) => a.date.localeCompare(b.date));
      const recentWeight = sortedMetrics[sortedMetrics.length - 1];
      const olderWeight = sortedMetrics[sortedMetrics.length - 2];

      if (recentWeight && olderWeight) {
        const weightChange = recentWeight.weight - olderWeight.weight;
        const daysBetween = Math.max(1, Math.abs((new Date(recentWeight.date) - new Date(olderWeight.date)) / (1000 * 60 * 60 * 24)));

        if (totalCals < calGoal * 0.85 && weightChange < 0) {
          correlations.push({
            id: 'cal-weight-deficit',
            icon: '📉',
            text: `Déficit calórico (${totalCals}/${calGoal}) → ${Math.abs(weightChange).toFixed(1)}kg perdidos en ${Math.round(daysBetween)} días`,
            type: 'info',
            area: 'nutrition'
          });
        } else if (totalCals > calGoal * 1.15 && weightChange > 0) {
          correlations.push({
            id: 'cal-weight-surplus',
            icon: '📊',
            text: `Superávit calórico → +${weightChange.toFixed(1)}kg en ${Math.round(daysBetween)} días`,
            type: 'warning',
            area: 'nutrition'
          });
        }
      }
    }

    // 3.4 MEDITATION/CONSCIOUSNESS → Sleep quality
    const yesterdayDate = getDateOffset(viewDate, -1);
    const yesterdayData = data.days[yesterdayDate];
    if (yesterdayData?.meditation_done && todaySleep) {
      const avgSleep = getAverageForDays(last14Days, d => data.days[d]?.sleep_hours);
      if (avgSleep && todaySleep > avgSleep) {
        correlations.push({
          id: 'meditation-sleep',
          icon: '🧘→😴',
          text: `Meditaste ayer → ${todaySleep}h de sueño (+${(todaySleep - avgSleep).toFixed(1)}h vs tu media)`,
          type: 'success',
          area: 'consciousness'
        });
      }
    }

    // 3.5 WORKOUT → Next day energy
    const yesterdayWorkout = data.workouts?.find(w => w.day_id === yesterdayDate && w.is_completed);
    if (yesterdayWorkout && todayEnergy) {
      const avgEnergy = getAverageForDays(last14Days, d => data.days[d]?.energy_level);
      if (avgEnergy && todayEnergy >= avgEnergy) {
        correlations.push({
          id: 'workout-energy',
          icon: '💪→⚡',
          text: `Entrenaste ayer → Energía ${todayEnergy > avgEnergy ? 'por encima de' : 'igual a'} tu media`,
          type: 'success',
          area: 'workout'
        });
      }
    }

    // 3.6 RELATIONSHIPS → Mood (social health)
    const relationships = data.relationships || [];
    const recentInteractions = relationships.reduce((count, rel) => {
      const recent = (rel.interactions || []).filter(i => {
        const daysDiff = (new Date(getToday()) - new Date(i.date)) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      });
      return count + recent.length;
    }, 0);

    if (recentInteractions >= 5 && todayEnergy && todayEnergy >= 3) {
      correlations.push({
        id: 'relationships-mood',
        icon: '👥→😊',
        text: `${recentInteractions} interacciones esta semana → Bienestar social alto`,
        type: 'success',
        area: 'relationships'
      });
    } else if (recentInteractions === 0 && relationships.length > 0) {
      const needsAttention = relationships.filter(r => r.contactFrequency && r.interactions?.length === 0).length;
      if (needsAttention > 0) {
        correlations.push({
          id: 'relationships-neglected',
          icon: '👥⚠️',
          text: `${needsAttention} relaciones sin contacto reciente. ¿Tiempo para conectar?`,
          type: 'warning',
          area: 'relationships'
        });
      }
    }

    return correlations;
  }, [data, dayData, dayMeals, dayHabitLogs, viewDate]);

  // Legacy getInsight for compatibility (now uses correlations)
  const getInsight = () => {
    if (getCorrelations.length > 0) {
      return getCorrelations[0]; // Return first correlation as primary insight
    }
    // Fallback to old logic
    if (dayData.sleep_hours >= 7 && habitsCompleted >= data.habits.length * 0.8) {
      return { text: "Gran día! Buen descanso + hábitos = éxito asegurado 🚀", type: "success" };
    }
    if (dayData.sleep_hours < 6 && dayData.sleep_hours > 0) {
      return { text: `Solo ${dayData.sleep_hours}h de sueño. Prioriza descansar hoy 😴`, type: "warning" };
    }
    if (tasksCompleted === dayTasks.length && dayTasks.length > 0) {
      return { text: "¡Todas las tareas completadas! Eres imparable 🔥", type: "success" };
    }
    return null;
  };

  const insight = getInsight();

  return (
    <div className="space-y-4 pb-24">
      {/* Header with date navigation */}
      <AnimatedMount>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={goToPrevDay}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            {/* Toggle Día/Semana/Mes/Trimestre */}
            <div className="flex bg-white/10 rounded-lg p-0.5 mb-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'day' ? 'bg-violet-500 text-white' : 'text-white/60'}`}
              >
                Día
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'week' ? 'bg-violet-500 text-white' : 'text-white/60'}`}
              >
                Sem
              </button>
            </div>
            <button
              onClick={goToToday}
              className="flex flex-col items-center"
            >
              <span className={`text-sm font-medium ${isViewingToday ? 'text-violet-400' : 'text-white/60'}`}>
                {formatViewDate()}
              </span>
              {!isViewingToday && (
                <span className="text-[10px] text-violet-400 mt-0.5">Volver a hoy</span>
              )}
            </button>
          </div>

          <button
            onClick={goToNextDay}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Future date indicator */}
        {isViewingFuture && (
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <p className="text-sm text-amber-200">Estás viendo un día futuro - planificación</p>
          </div>
        )}

        {/* Planned meals for this date */}
        {plannedMealsForDate.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 mb-3">
            <p className="text-sm font-medium text-orange-400 mb-2">🍽️ Comidas planificadas</p>
            <div className="space-y-1">
              {plannedMealsForDate.map(meal => (
                <div key={meal.id} className="flex justify-between text-sm">
                  <span className="text-white/70">{meal.name}</span>
                  <span className="text-orange-400">{meal.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {isViewingToday ? `${greeting.icon} ${greeting.text}` : '📅'}, {data.user.name.split(' ')[0]}
            </h1>
            {data.user.mantra && isViewingToday && (
              <p className="text-white/40 text-sm italic mt-1">"{data.user.mantra}"</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <DayScore score={dayScore} size="md" />
          </div>
        </div>
      </AnimatedMount>

      {/* === NOTIFICATIONS SECTION === */}
      {/* Insights/Correlations appear here in a dedicated area */}
      {(() => {
        const showCorrelations = getCorrelations.length > 0 && !dismissedNotifications.has('correlations');
        const showInsight = getCorrelations.length === 0 && insight && !dismissedNotifications.has('insight');

        if (!showCorrelations && !showInsight) return null;

        return (
          <AnimatedMount delay={50}>
            <div className="mt-3 space-y-2">
              {/* Correlations insights - Card format with header */}
              {showCorrelations && (
                <div className="bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border border-violet-500/20 rounded-xl p-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-medium text-violet-300">Conexiones detectadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">{getCorrelations.length} insight{getCorrelations.length > 1 ? 's' : ''}</span>
                      <button
                        onClick={() => setDismissedNotifications(prev => new Set([...prev, 'correlations']))}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-white/40 hover:text-white/70" />
                      </button>
                    </div>
                  </div>
                  {/* Insight messages */}
                  <div className="space-y-2">
                    {getCorrelations.slice(0, 3).map((corr) => (
                      <div
                        key={corr.id}
                        className={`flex items-start gap-2 p-2 rounded-lg ${corr.type === 'success' ? 'bg-emerald-500/10' :
                          corr.type === 'warning' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                          }`}
                      >
                        <span className="text-base flex-shrink-0">{corr.icon}</span>
                        <p className="text-xs text-white/80">{corr.text}</p>
                      </div>
                    ))}

                    {getCorrelations.length > 3 && (
                      <p className="text-xs text-white/30 text-center">+{getCorrelations.length - 3} más...</p>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback single insight */}
              {showInsight && (
                <div className={`rounded-xl px-3 py-2 border ${insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' :
                  insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                    'bg-blue-500/10 border-blue-500/20'
                  }`}>
                  <div className="flex items-center gap-2">
                    <Brain className={`w-4 h-4 flex-shrink-0 ${insight.type === 'success' ? 'text-emerald-400' :
                      insight.type === 'warning' ? 'text-amber-400' : 'text-blue-400'
                      }`} />
                    <p className="text-xs text-white/80 flex-1">{insight.text}</p>
                    <button
                      onClick={() => setDismissedNotifications(prev => new Set([...prev, 'insight']))}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5 text-white/40 hover:text-white/70" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </AnimatedMount>
        );
      })()}


      {/* Conditional: Week View */}

      {viewMode === 'week' ? (
        <>
          {/* Week Days Row - Interactive Calendar */}
          <AnimatedMount delay={50}>
            <div className="flex gap-1.5">
              {weekDates.map((date, i) => {
                const isCurrentDay = date === getToday();
                const isPastDay = date < getToday();
                const isSelected = date === viewDate;
                const dayInfo = data.days[date];
                const dayHabitsData = data.habitLogs?.filter(l => l.date === date) || [];
                const dayMealsData = data.meals.filter(m => m.day_id === date);
                const dayTasksData = data.tasks.filter(t => t.day_id === date);
                const dayWorkoutData = (data.workouts || []).find(w => w.day_id === date);
                const score = calculateDayScore(dayInfo, dayHabitsData, dayMealsData, dayTasksData, dayWorkoutData, data.user.goals);

                const hasWorkout = !!dayWorkoutData;
                const workoutDone = dayWorkoutData?.is_completed;
                const habitsCount = dayHabitsData.filter(l => l.completed).length;
                const totalHabits = data.habits.filter(h => {
                  if (h.frequency === 'weekly') return i === 0;
                  if (h.frequency === 'weekdays') return i < 5;
                  return true;
                }).length;

                return (
                  <button
                    key={date}
                    onClick={() => { setViewDate(date); setViewMode('day'); }}
                    className={`flex-1 py-2 px-1 rounded-xl text-center transition-all relative overflow-hidden ${isCurrentDay ? 'bg-violet-500 ring-2 ring-violet-400 ring-offset-1 ring-offset-zinc-900' :
                      isSelected ? 'bg-white/20' :
                        'bg-white/5 hover:bg-white/10'
                      }`}
                  >
                    <p className={`text-[10px] font-medium mb-0.5 ${isCurrentDay ? 'text-white' : 'text-white/50'}`}>
                      {weekDayNames[i]}
                    </p>
                    <p className={`text-lg font-bold ${isCurrentDay ? 'text-white' : ''}`}>
                      {new Date(date).getDate()}
                    </p>

                    {/* Score indicator */}
                    {(isPastDay || isCurrentDay) && score > 0 && (
                      <div className="flex justify-center gap-0.5 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${score >= 70 ? 'bg-emerald-400' : score >= 40 ? 'bg-amber-400' : 'bg-red-400'}`} />
                      </div>
                    )}

                    {/* Mini indicators */}
                    <div className="flex justify-center gap-1 mt-1">
                      {hasWorkout && (
                        <div className={`w-1 h-1 rounded-full ${workoutDone ? 'bg-violet-400' : 'bg-white/30'}`} />
                      )}
                      {totalHabits > 0 && (
                        <div className={`w-1 h-1 rounded-full ${habitsCount >= totalHabits ? 'bg-emerald-400' : habitsCount > 0 ? 'bg-amber-400' : 'bg-white/20'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </AnimatedMount>

          {/* Week Score Card */}
          <AnimatedMount delay={75}>
            {(() => {
              const weekStats = weekDates.map(date => {
                const isPastOrToday = date <= getToday();
                const dayInfo = data.days[date];
                const dayHabitsData = data.habitLogs?.filter(l => l.date === date) || [];
                const dayMealsData = data.meals.filter(m => m.day_id === date);
                const dayTasksData = data.tasks.filter(t => t.day_id === date);
                const dayWorkoutData = (data.workouts || []).find(w => w.day_id === date);
                return {
                  date,
                  isPastOrToday,
                  score: isPastOrToday ? calculateDayScore(dayInfo, dayHabitsData, dayMealsData, dayTasksData, dayWorkoutData, data.user.goals) : 0,
                  workout: dayWorkoutData,
                  workoutCompleted: dayWorkoutData?.is_completed,
                  habits: dayHabitsData.filter(l => l.completed).length,
                  habitsTotal: data.habits.length,
                  tasks: dayTasksData.filter(t => t.completed).length,
                  tasksTotal: dayTasksData.length,
                  calories: dayMealsData.reduce((s, m) => s + (m.calories || 0), 0),
                  protein: dayMealsData.reduce((s, m) => s + (m.protein || 0), 0),
                  water: dayInfo?.water_glasses || 0,
                  sleep: dayInfo?.sleep_hours || 0
                };
              });

              const pastDays = weekStats.filter(d => d.isPastOrToday);
              const avgScore = pastDays.length > 0 ? Math.round(pastDays.reduce((s, d) => s + d.score, 0) / pastDays.length) : 0;
              const weekWorkouts = weekStats.filter(d => d.workoutCompleted).length;
              const plannedWorkouts = weekStats.filter(d => d.workout).length;
              const weekHabitsCompleted = weekStats.reduce((s, d) => s + d.habits, 0);
              const weekHabitsTotal = data.habits.length * pastDays.length;
              const weekTasksCompleted = weekStats.reduce((s, d) => s + d.tasks, 0);
              const weekTasksTotal = weekStats.reduce((s, d) => s + d.tasksTotal, 0);
              const avgCalories = pastDays.length > 0 ? Math.round(pastDays.reduce((s, d) => s + d.calories, 0) / pastDays.length) : 0;
              const avgProtein = pastDays.length > 0 ? Math.round(pastDays.reduce((s, d) => s + d.protein, 0) / pastDays.length) : 0;
              const avgSleep = pastDays.length > 0 ? (pastDays.reduce((s, d) => s + d.sleep, 0) / pastDays.length).toFixed(1) : 0;
              const avgWater = pastDays.length > 0 ? Math.round(pastDays.reduce((s, d) => s + d.water, 0) / pastDays.length) : 0;

              const habitsPercent = weekHabitsTotal > 0 ? Math.round((weekHabitsCompleted / weekHabitsTotal) * 100) : 0;
              const calorieGoal = data.user.goals?.calories || 2000;
              const proteinGoal = data.user.goals?.protein || 150;
              const waterGoal = data.user.goals?.water || 8;

              // Week info
              const weekStart = new Date(weekDates[0]);
              const weekEnd = new Date(weekDates[6]);
              const weekNumber = Math.ceil((((weekStart - new Date(weekStart.getFullYear(), 0, 1)) / 86400000) + new Date(weekStart.getFullYear(), 0, 1).getDay() + 1) / 7);
              const totalWeeksInYear = 52;

              // Previous week calculation for comparison
              const prevWeekStart = new Date(weekStart);
              prevWeekStart.setDate(prevWeekStart.getDate() - 7);
              const prevWeekDates = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(prevWeekStart);
                d.setDate(d.getDate() + i);
                return d.toISOString().split('T')[0];
              });

              const prevWeekStats = prevWeekDates.map(date => {
                const dayInfo = data.days[date];
                const dayHabitsData = data.habitLogs?.filter(l => l.date === date) || [];
                const dayMealsData = data.meals.filter(m => m.day_id === date);
                const dayTasksData = data.tasks.filter(t => t.day_id === date);
                const dayWorkoutData = (data.workouts || []).find(w => w.day_id === date);
                return calculateDayScore(dayInfo, dayHabitsData, dayMealsData, dayTasksData, dayWorkoutData, data.user.goals);
              });
              const prevWeekAvg = prevWeekStats.length > 0 ? Math.round(prevWeekStats.reduce((s, d) => s + d, 0) / 7) : 0;
              const weekDiff = avgScore - prevWeekAvg;

              // Year overview - calculate score for each week of the year
              const yearStart = new Date(new Date().getFullYear(), 0, 1);
              const currentWeekNum = weekNumber;
              const weekScores = [];

              for (let w = 1; w <= currentWeekNum; w++) {
                const wStart = new Date(yearStart);
                wStart.setDate(wStart.getDate() + (w - 1) * 7);
                let weekTotal = 0;
                let daysWithData = 0;

                for (let d = 0; d < 7; d++) {
                  const date = new Date(wStart);
                  date.setDate(date.getDate() + d);
                  const dateStr = date.toISOString().split('T')[0];

                  if (date <= new Date()) {
                    const dayInfo = data.days[dateStr];
                    const dayHabitsData = data.habitLogs?.filter(l => l.date === dateStr) || [];
                    const dayMealsData = data.meals.filter(m => m.day_id === dateStr);
                    const dayTasksData = data.tasks.filter(t => t.day_id === dateStr);
                    const dayWorkoutData = (data.workouts || []).find(wk => wk.day_id === dateStr);
                    const score = calculateDayScore(dayInfo, dayHabitsData, dayMealsData, dayTasksData, dayWorkoutData, data.user.goals);
                    if (score > 0) {
                      weekTotal += score;
                      daysWithData++;
                    }
                  }
                }

                weekScores.push({
                  week: w,
                  score: daysWithData > 0 ? Math.round(weekTotal / daysWithData) : 0,
                  hasData: daysWithData > 0
                });
              }

              // Best and worst days
              const bestDay = pastDays.length > 0 ? pastDays.reduce((best, d) => d.score > best.score ? d : best, pastDays[0]) : null;
              const worstDay = pastDays.length > 0 ? pastDays.filter(d => d.score > 0).reduce((worst, d) => d.score < worst.score ? d : worst, pastDays[0]) : null;

              // Streak calculation
              let currentStreak = 0;
              for (let i = pastDays.length - 1; i >= 0; i--) {
                if (pastDays[i].score >= 50) currentStreak++;
                else break;
              }

              // Get color for score
              const getScoreColor = (score) => {
                if (score >= 80) return 'bg-emerald-500';
                if (score >= 60) return 'bg-lime-500';
                if (score >= 40) return 'bg-amber-500';
                if (score >= 20) return 'bg-orange-500';
                return 'bg-red-500';
              };

              return (
                <div className="space-y-3">
                  {/* Main Score Card with week range */}
                  <Card className="bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 border-violet-500/30">
                    <div className="flex items-center gap-4">
                      <DayScore score={avgScore} size="lg" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-lg font-bold">Semana {weekNumber}</p>
                          <span className="text-xs text-white/40">de {totalWeeksInYear} · {new Date().getFullYear()}</span>
                        </div>
                        <p className="text-sm text-white/50">
                          {weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {weekDiff !== 0 && prevWeekAvg > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${weekDiff > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {weekDiff > 0 ? '↑' : '↓'} {Math.abs(weekDiff)} vs anterior
                            </span>
                          )}
                          {currentStreak > 1 && (
                            <span className="text-xs text-violet-400">🔥 {currentStreak} días buenos</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Year Overview - Week dots with month labels, 4 months per row */}
                  <Card className="py-2 px-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium text-white/70">📅 {new Date().getFullYear()}</span>
                      <span className="text-[9px] text-white/30">Sem {currentWeekNum}/{totalWeeksInYear}</span>
                    </div>

                    {(() => {
                      const year = new Date().getFullYear();
                      const months = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
                      const today = new Date(getToday());
                      const currentMonthIndex = today.getMonth();

                      const getWeekColor = (score) => {
                        if (score >= 90) return 'bg-emerald-400';
                        if (score >= 80) return 'bg-emerald-500';
                        if (score >= 70) return 'bg-lime-400';
                        if (score >= 60) return 'bg-lime-500';
                        if (score >= 50) return 'bg-yellow-400';
                        if (score >= 40) return 'bg-amber-400';
                        if (score >= 30) return 'bg-amber-500';
                        if (score >= 20) return 'bg-orange-400';
                        if (score >= 10) return 'bg-orange-500';
                        return 'bg-red-500';
                      };

                      const weeksByMonth = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((name, monthIndex) => {
                        const weeksInMonth = [];
                        for (let w = 1; w <= 52; w++) {
                          const jan1 = new Date(year, 0, 1);
                          const daysToFirstThursday = (4 - jan1.getDay() + 7) % 7;
                          const firstThursday = new Date(year, 0, 1 + daysToFirstThursday);
                          const thursday = new Date(firstThursday);
                          thursday.setDate(firstThursday.getDate() + (w - 1) * 7);
                          if (thursday.getMonth() === monthIndex) {
                            const ws = weekScores.find(s => s.week === w) || { week: w, score: 0, hasData: false };
                            weeksInMonth.push({ ...ws, isFuture: w > currentWeekNum });
                          }
                        }
                        return { name: months[monthIndex], monthIndex, weeks: weeksInMonth };
                      });

                      const rows = [weeksByMonth.slice(0, 4), weeksByMonth.slice(4, 8), weeksByMonth.slice(8, 12)];

                      return (
                        <div className="space-y-1.5">
                          {rows.map((row, ri) => (
                            <div key={ri} className="flex">
                              {row.map((month, mi) => (
                                <div key={mi} className="flex-1 flex items-center gap-1">
                                  <span className={`text-[9px] w-3 ${month.monthIndex === currentMonthIndex ? 'text-violet-400 font-bold' : 'text-white/40'}`}>{month.name}</span>
                                  <div className="flex" style={{ gap: '2px' }}>
                                    {month.weeks.map((ws, wi) => (
                                      <div
                                        key={wi}
                                        style={{
                                          width: '8px', height: '8px', borderRadius: '50%',
                                          backgroundColor: ws.isFuture ? '#6b7280' : !ws.hasData ? '#9ca3af' : undefined,
                                          boxShadow: ws.week === weekNumber ? '0 0 0 2px white' : undefined
                                        }}
                                        className={`${!ws.isFuture && ws.hasData ? getWeekColor(ws.score) : ''}`}
                                        title={`S${ws.week}: ${ws.score}pts`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/10">
                      <div className="flex items-center gap-0.5 text-[8px] text-white/30">
                        <span>0</span>
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <div className="w-2 h-2 rounded-full bg-lime-500" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>100</span>
                      </div>
                      <div className="text-[9px] text-white/50">
                        {(() => {
                          const wd = weekScores.filter(w => w.hasData);
                          const perfect = wd.filter(w => w.score >= 80).length;
                          const good = wd.filter(w => w.score >= 60).length;
                          const avg = wd.length > 0 ? Math.round(wd.reduce((a, b) => a + b.score, 0) / wd.length) : 0;
                          return <><span className="text-emerald-400">{perfect}</span> 💎 · <span className="text-lime-400">{good}</span> ✓ · x̄ {avg}</>;
                        })()}
                      </div>
                    </div>
                  </Card>

                  {/* Weekly Progress Bars */}
                  <Card>
                    <div className="space-y-3">
                      {/* Habits */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60 flex items-center gap-1">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> Hábitos
                          </span>
                          <span className={habitsPercent >= 80 ? 'text-emerald-400' : habitsPercent >= 50 ? 'text-amber-400' : 'text-white/60'}>
                            {weekHabitsCompleted}/{weekHabitsTotal} ({habitsPercent}%)
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${habitsPercent >= 80 ? 'bg-emerald-500' : habitsPercent >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${habitsPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Workouts */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60 flex items-center gap-1">
                            <Dumbbell className="w-3.5 h-3.5 text-violet-400" /> Entrenos
                          </span>
                          <span className={weekWorkouts >= plannedWorkouts ? 'text-emerald-400' : 'text-white/60'}>
                            {weekWorkouts}/{plannedWorkouts || '-'} completados
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full transition-all"
                            style={{ width: plannedWorkouts > 0 ? `${(weekWorkouts / plannedWorkouts) * 100}%` : '0%' }}
                          />
                        </div>
                      </div>

                      {/* Nutrition */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60 flex items-center gap-1">
                            <Utensils className="w-3.5 h-3.5 text-orange-400" /> Nutrición
                          </span>
                          <span className="text-white/60">
                            {avgCalories} kcal · {avgProtein}g prot /día
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${avgCalories >= calorieGoal * 0.8 ? 'bg-orange-500' : 'bg-orange-500/50'}`}
                              style={{ width: `${Math.min((avgCalories / calorieGoal) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${avgProtein >= proteinGoal * 0.8 ? 'bg-red-500' : 'bg-red-500/50'}`}
                              style={{ width: `${Math.min((avgProtein / proteinGoal) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Stats Grid - MEDIA SEMANAL */}
                  <Card>
                    <p className="text-xs text-white/40 mb-2 text-center">📊 MEDIA DIARIA DE LA SEMANA</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center py-2 bg-white/5 rounded-lg">
                        <Moon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <p className="text-lg font-bold">{avgSleep}</p>
                        <p className="text-[10px] text-white/40">h sueño</p>
                      </div>
                      <div className="text-center py-2 bg-white/5 rounded-lg">
                        <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                        <p className="text-lg font-bold">{avgWater}</p>
                        <p className="text-[10px] text-white/40">vasos/día</p>
                      </div>
                      <div className="text-center py-2 bg-white/5 rounded-lg">
                        <Target className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <p className="text-lg font-bold">{weekTasksCompleted}</p>
                        <p className="text-[10px] text-white/40">tareas</p>
                      </div>
                      <div className="text-center py-2 bg-white/5 rounded-lg">
                        <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                        <p className="text-lg font-bold">{avgCalories}</p>
                        <p className="text-[10px] text-white/40">kcal/día</p>
                      </div>
                    </div>
                    {/* Comparison with previous week */}
                    {prevWeekAvg > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-center">
                        <p className="text-xs text-white/40">
                          vs semana anterior: {' '}
                          <span className={weekDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {weekDiff >= 0 ? '+' : ''}{weekDiff} puntos
                          </span>
                          {weekDiff > 5 && ' 🚀'}
                          {weekDiff < -5 && ' 📉'}
                        </p>
                      </div>
                    )}
                  </Card>

                  {/* Day-by-Day Breakdown */}
                  <Card>
                    <p className="text-sm font-medium text-white/60 mb-3">📊 Detalle por día</p>
                    <div className="space-y-2">
                      {weekStats.map((day, i) => {
                        if (!day.isPastOrToday) return null;
                        const isCurrentDay = day.date === getToday();
                        return (
                          <button
                            key={day.date}
                            onClick={() => { setViewDate(day.date); setViewMode('day'); }}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isCurrentDay ? 'bg-violet-500' : 'bg-white/10'
                              }`}>
                              {weekDayNames[i]}
                            </div>

                            <div className="flex-1">
                              <div className="flex gap-1.5">
                                {/* Workout indicator */}
                                <div className={`px-1.5 py-0.5 rounded text-[10px] ${day.workoutCompleted ? 'bg-violet-500/30 text-violet-300' :
                                  day.workout ? 'bg-white/10 text-white/40' : 'hidden'
                                  }`}>
                                  {day.workoutCompleted ? '💪' : '🏋️'}
                                </div>

                                {/* Habits indicator */}
                                <div className={`px-1.5 py-0.5 rounded text-[10px] ${day.habits >= day.habitsTotal ? 'bg-emerald-500/30 text-emerald-300' :
                                  day.habits > 0 ? 'bg-amber-500/30 text-amber-300' : 'bg-white/10 text-white/40'
                                  }`}>
                                  {day.habits}/{day.habitsTotal}
                                </div>

                                {/* Nutrition indicator */}
                                {day.calories > 0 && (
                                  <div className="px-1.5 py-0.5 rounded text-[10px] bg-orange-500/30 text-orange-300">
                                    {day.calories} kcal
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Score */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${day.score >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                              day.score >= 40 ? 'bg-amber-500/20 text-amber-400' :
                                day.score > 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/40'
                              }`}>
                              {day.score}
                            </div>

                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </button>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Insights */}
                  {bestDay && worstDay && bestDay.date !== worstDay.date && (
                    <Card className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border-white/10">
                      <p className="text-sm font-medium text-white/60 mb-2">💡 Insights</p>
                      <div className="space-y-2 text-sm">
                        <p className="text-emerald-400">
                          🏆 Mejor día: {new Date(bestDay.date).toLocaleDateString('es-ES', { weekday: 'long' })} ({bestDay.score} pts)
                        </p>
                        {worstDay.score < bestDay.score && (
                          <p className="text-amber-400">
                            📉 Día más flojo: {new Date(worstDay.date).toLocaleDateString('es-ES', { weekday: 'long' })} ({worstDay.score} pts)
                          </p>
                        )}
                        {avgSleep < 7 && (
                          <p className="text-blue-400">
                            😴 Promedio de sueño bajo ({avgSleep}h) - intenta llegar a 7-8h
                          </p>
                        )}
                        {habitsPercent < 70 && (
                          <p className="text-white/50">
                            📋 Consistencia de hábitos mejorable - enfócate en los esenciales
                          </p>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              );
            })()}
          </AnimatedMount>
        </>
      ) : (
        <>
          {/* Focus of the day */}
          <AnimatedMount delay={50}>
            <Card
              onClick={() => isViewingToday && setShowFocus(true)}
              className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-violet-500/20"
            >
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-violet-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-violet-400 font-medium mb-1">FOCO DEL DÍA</p>
                  {dayData.focus_note ? (
                    <p className="text-white">{dayData.focus_note}</p>
                  ) : (
                    <p className="text-white/40 italic">
                      {isViewingToday ? 'Toca para definir tu prioridad...' : 'Sin foco definido'}
                    </p>
                  )}
                </div>
                {isViewingToday && <Edit3 className="w-4 h-4 text-white/30" />}
              </div>
            </Card>
          </AnimatedMount>

          {/* Status Grid: Sleep, Energy, Water, Weight */}
          <AnimatedMount delay={75}>
            <div className="grid grid-cols-4 gap-2">
              {/* Sleep */}
              <Card onClick={() => isViewingToday && setShowSleep(true)} className="text-center py-3">
                <Moon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{dayData.sleep_hours || '-'}</p>
                <p className="text-[10px] text-white/40">horas</p>
              </Card>

              {/* Energy */}
              <Card className="text-center py-3">
                <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <div className="flex justify-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button
                      key={i}
                      onClick={() => isViewingToday && updateDay({ energy_level: i })}
                      className={`w-2 h-2 rounded-full transition-all ${i <= dayData.energy_level ? 'bg-yellow-400' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-white/40">energía</p>
              </Card>

              {/* Water */}
              <Card className="text-center py-3">
                <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{dayData.water_glasses || 0}</p>
                <p className="text-[10px] text-white/40">/{data.user.goals?.water || 8} 💧</p>
              </Card>

              {/* Steps */}
              <Card className="text-center py-3">
                <Footprints className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{((dayData.steps || 0) / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-white/40">/{(data.user.goals?.steps || 10000) / 1000}k 👟</p>
              </Card>
            </div>
          </AnimatedMount>

          {/* Water tracker inline */}
          {isViewingToday && (
            <AnimatedMount delay={85}>
              <Card className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Agua</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: data.user.goals?.water || 8 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => updateWater(i < (dayData.water_glasses || 0) ? i : i + 1)}
                        className={`w-5 h-7 rounded-sm transition-all ${i < (dayData.water_glasses || 0) ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </AnimatedMount>
          )}

          {/* Steps tracker inline */}
          {isViewingToday && (
            <AnimatedMount delay={87}>
              <Card className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Pasos</span>
                    <span className="text-xs text-white/30 flex items-center gap-1">
                      <Watch className="w-3 h-3" />
                      <span>Auto</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateDay({ steps: Math.max(0, (dayData.steps || 0) - 1000) })}
                      className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20"
                    >
                      -
                    </button>
                    <div className="text-center min-w-[60px]">
                      <p className="text-sm font-bold">{(dayData.steps || 0).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => updateDay({ steps: (dayData.steps || 0) + 1000 })}
                      className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((dayData.steps || 0) / (data.user.goals?.steps || 10000)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1 text-right">
                    {Math.round(((dayData.steps || 0) / (data.user.goals?.steps || 10000)) * 100)}% de {(data.user.goals?.steps || 10000).toLocaleString()}
                  </p>
                </div>
              </Card>
            </AnimatedMount>
          )}

          {/* Workout Section */}
          {activeAreas.includes('workout') && (
            <AnimatedMount delay={90}>
              <AccordionSection
                title="ENTRENO"
                icon={Dumbbell}
                iconColor="text-violet-400"
                action={() => setScreen('workout')}
                actionLabel="Ver todo"
                storageKey="workout"
                progress={(() => {
                  if (!dayWorkout) return null;
                  if (dayWorkout.is_completed) return 100;
                  return workoutProgress.total > 0 ? Math.round((workoutProgress.completed / workoutProgress.total) * 100) : 0;
                })()}
                progressColor="bg-violet-500"
                summaryRight={(() => {
                  if (!dayWorkout) return null;
                  if (dayWorkout.is_completed) return '✓';
                  return `${workoutProgress.completed}/${workoutProgress.total}`;
                })()}
                summary={(() => {
                  if (!dayWorkout) return 'Sin entreno programado';
                  if (dayWorkout.is_completed) return `✓ ${dayWorkout.name} completado`;
                  if (workoutProgress.completed > 0) return `${dayWorkout.name} · en progreso`;
                  return dayWorkout.name;
                })()}
              >
                <Card className="mt-2">
                  {dayWorkout?.is_completed ? (
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-emerald-400">¡Entreno completado!</p>
                          <p className="text-sm text-white/50">{dayWorkout.name}</p>
                        </div>
                        <button
                          onClick={() => setShowWorkoutOptions(!showWorkoutOptions)}
                          className="p-1.5 hover:bg-white/10 rounded-lg"
                        >
                          <MoreHorizontal className="w-4 h-4 text-white/40" />
                        </button>
                      </div>

                      {/* Options dropdown */}
                      {showWorkoutOptions && (
                        <div className="mt-3 p-2 bg-white/5 rounded-xl space-y-1">
                          <button
                            onClick={() => {
                              setData(prev => ({
                                ...prev,
                                workouts: prev.workouts.map(w =>
                                  w.id === dayWorkout.id ? {
                                    ...w,
                                    is_completed: false,
                                    exercises: w.exercises.map(ex => ({
                                      ...ex,
                                      sets: ex.sets.map(s => ({ ...s, completed: false }))
                                    }))
                                  } : w
                                )
                              }));
                              setShowWorkoutOptions(false);
                              showToast('Entreno reiniciado');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/10 rounded-lg"
                          >
                            <RotateCcw className="w-4 h-4" /> Reiniciar entreno
                          </button>
                          <button
                            onClick={() => {
                              setData(prev => ({
                                ...prev,
                                workouts: prev.workouts.filter(w => w.id !== dayWorkout.id)
                              }));
                              setShowWorkoutOptions(false);
                              showToast('Entreno eliminado');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" /> Eliminar entreno
                          </button>
                          <button
                            onClick={() => {
                              setScreen('workout');
                              setShowWorkoutOptions(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/10 rounded-lg"
                          >
                            <RefreshCw className="w-4 h-4" /> Cambiar por otro
                          </button>
                        </div>
                      )}
                    </div>
                  ) : activeWorkout && !activeWorkout.started_at ? (
                    /* Workout Preview - before starting */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">{activeWorkout.name}</p>
                          <p className="text-xs text-white/50">{activeWorkout.exercises.length} ejercicios · Preview</p>
                        </div>
                        <button
                          onClick={workoutCancel}
                          className="p-1.5 text-white/40 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Exercise preview list */}
                      <div className="space-y-2">
                        {activeWorkout.exercises.map((ex, i) => (
                          <div key={ex.id} className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{ex.name}</p>
                              <p className="text-xs text-white/40">{ex.targetSets} sets × {ex.targetReps} reps</p>
                            </div>
                            {getExercisePR(ex.exerciseId) && (
                              <span className="text-xs text-yellow-400">🏆 {getExercisePR(ex.exerciseId).weight}kg</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Start button */}
                      <button
                        onClick={workoutStart}
                        className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" /> Comenzar entreno
                      </button>
                    </div>
                  ) : activeWorkout ? (
                    <div className="space-y-4">
                      {/* Workout Header with Timer */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">{activeWorkout.name}</p>
                          <p className="text-xs text-white/50">{activeWorkout.exercises.length} ejercicios</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-violet-400 font-mono">
                            <Timer className="w-4 h-4" />
                            <span>{formatWorkoutTime(workoutElapsedTime)}</span>
                          </div>
                          <button
                            onClick={workoutCancel}
                            className="p-1.5 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                          <span>Progreso</span>
                          <span>{getWorkoutTotals().sets}/{getWorkoutTotals().totalSets} sets · {getWorkoutTotals().volume.toLocaleString()}kg</span>
                        </div>
                        <ProgressBar
                          value={getWorkoutTotals().sets}
                          max={getWorkoutTotals().totalSets || 1}
                          color="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        />
                      </div>

                      {/* Rest Timer */}
                      {workoutRestTimer !== null && (
                        <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-blue-400" />
                              <span className="font-medium text-sm">Descanso</span>
                            </div>
                            <span className="text-xl font-mono font-bold">{formatWorkoutTime(workoutRestTimer)}</span>
                          </div>
                          <ProgressBar value={workoutRestTimer} max={workoutRestDuration} color="bg-blue-500" height="h-1.5" />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => setWorkoutRestTimer(t => t + 30)} className="flex-1 py-1.5 bg-white/10 rounded-lg text-xs">+30s</button>
                            <button onClick={() => setWorkoutRestTimer(null)} className="flex-1 py-1.5 bg-white/10 rounded-lg text-xs">Saltar</button>
                          </div>
                        </div>
                      )}

                      {/* Exercises */}
                      {activeWorkout.exercises.map((ex, exIndex) => {
                        const exCompleted = ex.sets.filter(s => s.completed && s.setType !== 'warmup').length;
                        const exTotal = ex.sets.filter(s => s.setType !== 'warmup').length;
                        const pr = getExercisePR(ex.exerciseId);
                        const lastPerf = getLastPerformance(ex.exerciseId);
                        const isActive = workoutActiveEx === exIndex;
                        const exVolume = ex.sets.filter(s => s.completed).reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);

                        return (
                          <div
                            key={ex.id}
                            onClick={() => setWorkoutActiveEx(exIndex)}
                            className={`p-3 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-violet-500/10 border border-violet-500/30' : 'bg-white/5'}`}
                          >
                            {/* Exercise header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${exCompleted === exTotal && exTotal > 0 ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                  {exIndex + 1}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{ex.name}</p>
                                  <p className="text-xs text-white/40">
                                    {exCompleted}/{exTotal} · {ex.targetReps}{exVolume > 0 && ` · ${exVolume}kg`}
                                  </p>
                                </div>
                              </div>
                              {exCompleted === exTotal && exTotal > 0 && <Check className="w-4 h-4 text-emerald-400" />}
                            </div>

                            {/* Info badges */}
                            {(pr || lastPerf) && (
                              <div className="flex gap-2 mb-2 text-xs flex-wrap">
                                {pr && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">🏆 PR: {pr.weight}kg</span>}
                                {lastPerf && <span className="px-2 py-0.5 bg-white/10 rounded">📊 Último: {lastPerf.sets[0]?.weight}kg</span>}
                              </div>
                            )}

                            {/* Sets - when active */}
                            {isActive && (
                              <div className="mt-3 space-y-2">
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
                                      className={`grid grid-cols-12 gap-1 items-center p-1.5 rounded-lg ${set.completed ? 'bg-emerald-500/20' : setTypeInfo.color}`}
                                    >
                                      <span className={`col-span-1 text-center text-xs font-medium ${setTypeInfo.textColor || ''}`}>
                                        {set.setType === 'warmup' ? 'W' : setIndex + 1 - ex.sets.slice(0, setIndex).filter(s => s.setType === 'warmup').length}
                                      </span>
                                      <input
                                        type="number"
                                        placeholder={lastSet?.weight?.toString() || '-'}
                                        value={set.weight || ''}
                                        onChange={(e) => workoutUpdateSet(exIndex, setIndex, 'weight', parseFloat(e.target.value) || null)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="col-span-3 bg-white/10 rounded-lg px-2 py-1 text-center outline-none text-xs w-full"
                                      />
                                      <input
                                        type="number"
                                        placeholder={ex.targetReps?.split('-')[0] || '-'}
                                        value={set.reps || ''}
                                        onChange={(e) => workoutUpdateSet(exIndex, setIndex, 'reps', parseInt(e.target.value) || null)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="col-span-3 bg-white/10 rounded-lg px-2 py-1 text-center outline-none text-xs w-full"
                                      />
                                      <select
                                        value={set.setType}
                                        onChange={(e) => workoutUpdateSet(exIndex, setIndex, 'setType', e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="col-span-2 bg-white/10 rounded-lg px-1 py-1 text-center outline-none text-xs appearance-none"
                                      >
                                        {Object.entries(SET_TYPES).map(([key, type]) => (
                                          <option key={key} value={key}>{type.name}</option>
                                        ))}
                                      </select>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); workoutToggleSet(exIndex, setIndex); }}
                                        className={`col-span-3 h-7 rounded-lg flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}`}
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}

                                {/* Actions */}
                                <div className="flex gap-2 pt-1">
                                  <button onClick={(e) => { e.stopPropagation(); workoutAddSet(exIndex); }} className="flex-1 py-1.5 border border-dashed border-white/20 rounded-lg text-xs text-white/50">+ Set</button>
                                  {ex.sets.length > 1 && (
                                    <button onClick={(e) => { e.stopPropagation(); workoutRemoveSet(exIndex); }} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white/50 hover:bg-red-500/20 hover:text-red-400">-</button>
                                  )}
                                  <button onClick={(e) => { e.stopPropagation(); workoutDeleteExercise(exIndex); }} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white/50 hover:bg-red-500/20 hover:text-red-400">🗑️</button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Add exercise button */}
                      <button
                        onClick={() => setShowWorkoutExercisePicker(true)}
                        className="w-full p-3 border border-dashed border-white/20 rounded-xl text-white/50 flex items-center justify-center gap-2 text-sm"
                      >
                        <Plus className="w-4 h-4" /> Añadir ejercicio
                      </button>

                      {/* Complete workout button */}
                      {getWorkoutTotals().sets >= Math.floor(getWorkoutTotals().totalSets * 0.3) && (
                        <button
                          onClick={workoutComplete}
                          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                        >
                          <Trophy className="w-5 h-5" /> Completar entreno
                        </button>
                      )}

                      {/* Exercise Picker Modal */}
                      <Modal isOpen={showWorkoutExercisePicker} onClose={() => setShowWorkoutExercisePicker(false)} title="Añadir ejercicio">
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={workoutExerciseFilter.search}
                          onChange={(e) => setWorkoutExerciseFilter(f => ({ ...f, search: e.target.value }))}
                          className="w-full bg-white/10 rounded-xl p-3 outline-none mb-3"
                        />
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                          <button onClick={() => setWorkoutExerciseFilter(f => ({ ...f, muscle: null }))} className={`px-3 py-1 rounded-lg text-sm ${!workoutExerciseFilter.muscle ? 'bg-violet-500' : 'bg-white/10'}`}>Todos</button>
                          {Object.entries(EXERCISE_DATABASE).map(([key, cat]) => (
                            <button key={key} onClick={() => setWorkoutExerciseFilter(f => ({ ...f, muscle: key }))} className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${workoutExerciseFilter.muscle === key ? 'bg-violet-500' : 'bg-white/10'}`}>{cat.emoji}</button>
                          ))}
                        </div>
                        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                          {getFilteredExercises().map(ex => (
                            <button key={ex.id} onClick={() => workoutAddExercise(ex.id)} className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-left">
                              <span>{ex.muscleEmoji}</span>
                              <div className="flex-1">
                                <p>{ex.name}</p>
                                <p className="text-xs text-white/40">{ex.muscleName}</p>
                              </div>
                              {getExercisePR(ex.id) && <span className="text-xs text-yellow-400">{getExercisePR(ex.id).weight}kg</span>}
                            </button>
                          ))}
                        </div>
                      </Modal>

                      {/* Plate Calculator Modal */}
                      <Modal isOpen={showPlateCalc} onClose={() => setShowPlateCalc(false)} title="Calculadora de discos">
                        <PlateCalculator />
                      </Modal>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-white/50 mb-4">Sin entreno programado para hoy</p>

                      {/* Show available templates - always has routines (defaults if no custom) */}
                      {routines.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-white/40 text-sm">Elige una plantilla:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {routines.slice(0, 3).map(template => (
                              <button
                                key={template.id}
                                onClick={() => {
                                  // Create workout from template with proper structure
                                  const newWorkout = {
                                    id: `workout-${Date.now()}`,
                                    day_id: viewDate,
                                    name: template.name,
                                    started_at: null,
                                    is_completed: false,
                                    templateId: template.id,
                                    exercises: (template.exercises || []).map(e => ({
                                      id: `ex-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                      exerciseId: e.exerciseId || e.id,
                                      name: e.name || 'Ejercicio',
                                      targetSets: e.sets || e.targetSets || 3,
                                      targetReps: e.reps || e.targetReps || '8',
                                      restSeconds: e.restSeconds || 90,
                                      notes: e.notes || '',
                                      sets: Array.from({ length: e.sets || e.targetSets || 3 }, () => ({
                                        id: `set-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                        weight: null,
                                        reps: null,
                                        rpe: null,
                                        setType: 'normal',
                                        completed: false
                                      }))
                                    }))
                                  };
                                  setData(prev => ({
                                    ...prev,
                                    workouts: [...(prev.workouts || []), newWorkout]
                                  }));
                                  showToast(`${template.name} iniciado 💪`);
                                }}
                                className="px-4 py-2.5 bg-violet-500/20 border border-violet-500/30 rounded-xl font-medium inline-flex items-center gap-2 hover:bg-violet-500/40 transition-colors"
                              >
                                <Dumbbell className="w-4 h-4 text-violet-400" />
                                {template.name}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2 justify-center mt-2">
                            {routines.length > 3 && (
                              <button
                                onClick={() => setShowTemplateModal(true)}
                                className="px-4 py-2 text-violet-400 text-sm hover:text-violet-300 inline-flex items-center gap-1"
                              >
                                Ver todas ({routines.length}) <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {/* Inline modal with portal */}
                            {showTemplateModal && ReactDOM.createPortal(
                              <div
                                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70"
                                onClick={() => { setShowTemplateModal(false); setTemplateModalView('select'); }}
                              >
                                <div
                                  className="bg-zinc-900 rounded-2xl m-4 max-w-md w-full border border-white/20 max-h-[85vh] flex flex-col"
                                  onClick={e => e.stopPropagation()}
                                >
                                  {/* Header */}
                                  <div className="flex justify-between items-center p-4 border-b border-white/10">
                                    <div className="flex items-center gap-2">
                                      {templateModalView === 'create' && (
                                        <button onClick={() => setTemplateModalView('select')} className="p-1 hover:bg-white/10 rounded">
                                          <ChevronLeft className="w-5 h-5" />
                                        </button>
                                      )}
                                      <h3 className="text-lg font-bold">
                                        {templateModalView === 'select' ? 'Seleccionar Plantilla' : 'Crear Plantilla'}
                                      </h3>
                                    </div>
                                    <button onClick={() => { setShowTemplateModal(false); setTemplateModalView('select'); }} className="p-1 hover:bg-white/10 rounded">
                                      <X className="w-5 h-5" />
                                    </button>
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 overflow-y-auto p-4">
                                    {templateModalView === 'select' ? (
                                      <>
                                        {/* Routine list */}
                                        <div className="space-y-2">
                                          {routines.map(r => (
                                            <button
                                              key={r.id}
                                              onClick={() => {
                                                const newWorkout = {
                                                  id: `workout-${Date.now()}`,
                                                  day_id: viewDate,
                                                  name: r.name,
                                                  started_at: null,
                                                  is_completed: false,
                                                  templateId: r.id,
                                                  exercises: (r.exercises || []).map(e => ({
                                                    id: `ex-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                                    exerciseId: e.exerciseId || e.id,
                                                    name: e.name || 'Ejercicio',
                                                    targetSets: e.sets || e.targetSets || 3,
                                                    targetReps: e.reps || e.targetReps || '8',
                                                    restSeconds: e.restSeconds || 90,
                                                    notes: e.notes || '',
                                                    sets: Array.from({ length: e.sets || e.targetSets || 3 }, () => ({
                                                      id: `set-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                                      weight: null, reps: null, rpe: null, setType: 'normal', completed: false
                                                    }))
                                                  }))
                                                };
                                                setData(prev => ({ ...prev, workouts: [...(prev.workouts || []), newWorkout] }));
                                                setShowTemplateModal(false);
                                                setScreen('workout');
                                                showToast(`${r.name} iniciado - ¡A entrenar! 💪`);
                                              }}
                                              className="w-full p-3 bg-white/10 hover:bg-violet-500/30 rounded-xl text-left flex items-center gap-3"
                                            >
                                              <Dumbbell className="w-5 h-5 text-violet-400" />
                                              <div className="flex-1">
                                                <p className="font-medium">{r.name}</p>
                                                <p className="text-xs text-white/50">{r.exercises?.length || 0} ejercicios</p>
                                              </div>
                                              <ArrowRight className="w-4 h-4 text-white/30" />
                                            </button>
                                          ))}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        {/* Create template form */}
                                        {!showExercisePicker ? (
                                          <div className="space-y-4">
                                            {/* Template name */}
                                            <div>
                                              <label className="text-sm text-white/60 mb-1 block">Nombre de la plantilla</label>
                                              <input
                                                type="text"
                                                value={newTemplateName}
                                                onChange={e => setNewTemplateName(e.target.value)}
                                                placeholder="Ej: Push Day, Leg Day..."
                                                className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/10 focus:border-violet-500 focus:outline-none"
                                              />
                                            </div>

                                            {/* Selected exercises */}
                                            <div>
                                              <label className="text-sm text-white/60 mb-2 block">Ejercicios ({newTemplateExercises.length})</label>
                                              {newTemplateExercises.length > 0 ? (
                                                <div className="space-y-2">
                                                  {newTemplateExercises.map((ex, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                                                      <span className="text-xs text-white/40">{idx + 1}</span>
                                                      <span className="flex-1 text-sm">{ex.name}</span>
                                                      <span className="text-xs text-white/40">{ex.targetSets}x{ex.targetReps}</span>
                                                      <button
                                                        onClick={() => setNewTemplateExercises(prev => prev.filter((_, i) => i !== idx))}
                                                        className="p-1 hover:bg-red-500/20 rounded text-red-400"
                                                      >
                                                        <X className="w-4 h-4" />
                                                      </button>
                                                    </div>
                                                  ))}
                                                </div>
                                              ) : (
                                                <p className="text-white/40 text-sm">Añade ejercicios a tu plantilla</p>
                                              )}
                                              <button
                                                onClick={() => setShowExercisePicker(true)}
                                                className="mt-2 w-full py-2 border border-dashed border-white/20 rounded-xl text-white/60 hover:border-violet-500 hover:text-violet-400 flex items-center justify-center gap-2"
                                              >
                                                <Plus className="w-4 h-4" /> Añadir ejercicio
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          /* Exercise picker */
                                          <div className="space-y-3">
                                            <input
                                              type="text"
                                              value={exerciseSearch}
                                              onChange={e => setExerciseSearch(e.target.value)}
                                              placeholder="Buscar ejercicio..."
                                              className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/10 focus:border-violet-500 focus:outline-none"
                                              autoFocus
                                            />
                                            <div className="max-h-60 overflow-y-auto space-y-1">
                                              {getAllExercises()
                                                .filter(ex => ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()))
                                                .slice(0, 20)
                                                .map(ex => (
                                                  <button
                                                    key={ex.id}
                                                    onClick={() => {
                                                      setNewTemplateExercises(prev => [...prev, {
                                                        exerciseId: ex.id,
                                                        name: ex.name,
                                                        targetSets: 3,
                                                        targetReps: '8-12',
                                                        restSeconds: 90
                                                      }]);
                                                      setShowExercisePicker(false);
                                                      setExerciseSearch('');
                                                    }}
                                                    className="w-full p-2 text-left hover:bg-violet-500/20 rounded-lg flex items-center gap-2"
                                                  >
                                                    <span className="text-lg">{ex.muscleEmoji}</span>
                                                    <span className="flex-1">{ex.name}</span>
                                                  </button>
                                                ))}
                                            </div>
                                            <button
                                              onClick={() => { setShowExercisePicker(false); setExerciseSearch(''); }}
                                              className="w-full py-2 text-white/50 hover:text-white"
                                            >
                                              Cancelar
                                            </button>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>

                                  {/* Footer */}
                                  <div className="p-4 border-t border-white/10">
                                    {templateModalView === 'select' ? (
                                      <button
                                        onClick={() => {
                                          setTemplateModalView('create');
                                          setNewTemplateName('');
                                          setNewTemplateExercises([]);
                                        }}
                                        className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold flex items-center justify-center gap-2"
                                      >
                                        <Plus className="w-5 h-5" /> Crear nueva plantilla
                                      </button>
                                    ) : !showExercisePicker && (
                                      <button
                                        onClick={() => {
                                          if (!newTemplateName.trim()) {
                                            showToast('Añade un nombre a la plantilla', 'info');
                                            return;
                                          }
                                          if (newTemplateExercises.length === 0) {
                                            showToast('Añade al menos un ejercicio', 'info');
                                            return;
                                          }
                                          // Save the new template
                                          const newRoutine = {
                                            id: `routine-${Date.now()}`,
                                            name: newTemplateName.trim(),
                                            exercises: newTemplateExercises,
                                            createdAt: new Date().toISOString()
                                          };
                                          setData(prev => ({
                                            ...prev,
                                            workoutRoutines: [...(prev.workoutRoutines || []), newRoutine]
                                          }));
                                          showToast(`Plantilla "${newTemplateName}" creada 🎉`);
                                          setShowTemplateModal(false);
                                          setTemplateModalView('select');
                                          setNewTemplateName('');
                                          setNewTemplateExercises([]);
                                        }}
                                        disabled={!newTemplateName.trim() || newTemplateExercises.length === 0}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${newTemplateName.trim() && newTemplateExercises.length > 0
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                          : 'bg-white/10 text-white/40'
                                          }`}
                                      >
                                        <Check className="w-5 h-5" /> Guardar plantilla
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>,
                              document.body
                            )}
                            <button
                              onClick={() => {
                                const newWorkout = {
                                  id: `workout-${Date.now()}`,
                                  day_id: viewDate,
                                  name: 'Entreno libre',
                                  started_at: new Date().toISOString(),
                                  is_completed: false,
                                  exercises: []
                                };
                                setData(prev => ({
                                  ...prev,
                                  workouts: [...(prev.workouts || []), newWorkout]
                                }));
                                showToast('Entreno iniciado 💪');
                              }}
                              className="px-4 py-2 text-white/40 text-sm hover:text-white/60 inline-flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" /> Entreno libre
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-white/40 text-sm">¿Qué quieres hacer?</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            <button
                              onClick={() => {
                                // Start empty workout directly
                                const newWorkout = {
                                  id: `workout-${Date.now()}`,
                                  day_id: viewDate,
                                  name: 'Entreno libre',
                                  started_at: new Date().toISOString(),
                                  is_completed: false,
                                  exercises: []
                                };
                                setData(prev => ({
                                  ...prev,
                                  workouts: [...(prev.workouts || []), newWorkout]
                                }));
                                showToast('Entreno iniciado 💪');
                              }}
                              className="px-4 py-2.5 bg-violet-500 rounded-xl font-medium inline-flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Entreno libre
                            </button>
                            <button
                              onClick={() => setShowTemplateModal(true)}
                              className="px-4 py-2.5 bg-white/10 rounded-xl font-medium inline-flex items-center gap-2 hover:bg-white/20"
                            >
                              <Dumbbell className="w-4 h-4" />
                              Usar plantilla
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </AccordionSection>
            </AnimatedMount>
          )
          }

          {/* Consciousness Section */}
          {/* Nutrition Section */}
          {
            activeAreas.includes('nutrition') && (
              <AnimatedMount delay={100}>
                <AccordionSection
                  title="NUTRICIÓN"
                  icon={Utensils}
                  iconColor="text-orange-400"
                  action={() => setScreen('meals')}
                  actionLabel="Ver todo"
                  storageKey="nutrition"
                  progress={Math.round((totalCals / (data.user.goals?.calories || 2000)) * 100)}
                  progressColor="bg-orange-500"
                  summaryRight={`${totalCals}/${data.user.goals?.calories || 2000}`}
                  summary={(() => {
                    const protPct = Math.round((totalProt / (data.user.goals?.protein || 120)) * 100);
                    return `${protPct}% proteína · ${dayMeals.length} comida${dayMeals.length !== 1 ? 's' : ''}`;
                  })()}
                >
                  <Card className="mt-3">
                    {/* Planned meals pending confirmation */}
                    {plannedMealsForDate.length > 0 && (
                      <div className="mb-4 pb-4 border-b border-white/10">
                        <p className="text-xs text-amber-400 mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> PLANIFICADAS PARA HOY
                        </p>
                        <div className="space-y-2">
                          {plannedMealsForDate.map(meal => (
                            <div key={meal.id} className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{meal.name}</p>
                                <p className="text-xs text-white/40">{meal.calories} kcal</p>
                              </div>
                              <button
                                onClick={() => deletePlannedMeal(meal.id)}
                                className="p-1.5 hover:bg-white/10 rounded-lg"
                              >
                                <X className="w-3 h-3 text-white/40" />
                              </button>
                              <button
                                onClick={() => confirmPlannedMeal(meal)}
                                className="px-3 py-1.5 bg-emerald-500 rounded-lg text-xs font-medium"
                              >
                                ✓
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {dayMeals.length > 0 ? (
                      <div className="space-y-3">
                        {/* Calories */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-2xl font-bold">{totalCals}</span>
                            <span className="text-white/40 text-sm">/ {data.user.goals.calories} kcal</span>
                          </div>
                          <span className="text-sm text-white/60">{Math.round((totalCals / data.user.goals.calories) * 100)}%</span>
                        </div>
                        <ProgressBar value={totalCals} max={data.user.goals.calories} color="bg-orange-500" />

                        {/* Macros */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-emerald-400">Prot</span>
                              <span>{totalProt}/{data.user.goals.protein}g</span>
                            </div>
                            <ProgressBar value={totalProt} max={data.user.goals.protein} color="bg-emerald-500" height="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-blue-400">Carbs</span>
                              <span>{totalCarbs}/{data.user.goals.carbs}g</span>
                            </div>
                            <ProgressBar value={totalCarbs} max={data.user.goals.carbs} color="bg-blue-500" height="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-amber-400">Grasas</span>
                              <span>{totalFats}/{data.user.goals.fats}g</span>
                            </div>
                            <ProgressBar value={totalFats} max={data.user.goals.fats} color="bg-amber-500" height="h-1.5" />
                          </div>
                        </div>

                        {/* Meal status with add buttons */}
                        <div className="flex gap-2 pt-2">
                          {visibleMealTypes.map(meal => {
                            const hasMeal = dayMeals.some(m => m.meal_type === meal.type || (meal.type === 'all'));
                            const mealCals = meal.type === 'all'
                              ? totalCals
                              : dayMeals.filter(m => m.meal_type === meal.type).reduce((s, m) => s + (m.calories || 0), 0);
                            return (
                              <button
                                key={meal.type}
                                onClick={() => { setSelectedMealType(meal.type); setShowAddMeal(true); }}
                                className={`flex-1 text-center py-2 rounded-lg transition-all ${hasMeal && mealCals > 0 ? 'bg-emerald-500/20' : 'bg-white/5 hover:bg-white/10'}`}
                              >
                                <span className="text-lg">{meal.emoji}</span>
                                <p className={`text-[10px] ${hasMeal && mealCals > 0 ? 'text-emerald-400' : 'text-white/40'}`}>
                                  {mealCals > 0 ? `${mealCals}` : '+'}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-white/40 mb-3">Sin comidas registradas</p>
                        <button
                          onClick={() => setShowAddMeal(true)}
                          className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-xl flex items-center gap-2 mx-auto hover:bg-orange-500/30"
                        >
                          <Plus className="w-4 h-4" /> Añadir comida
                        </button>
                      </div>
                    )}
                  </Card>
                </AccordionSection>
              </AnimatedMount>
            )
          }

          {/* Habits Section - Elite Design */}
          {
            activeAreas.includes('habits') && (
              <AnimatedMount delay={125}>
                <AccordionSection
                  title="HÁBITOS"
                  icon={CheckSquare}
                  iconColor="text-emerald-400"
                  action={() => setScreen('habits')}
                  actionLabel="Ver todo"
                  storageKey="habits"
                  progress={todayHabits.length > 0 ? Math.round((habitsCompleted / todayHabits.length) * 100) : 0}
                  progressColor="bg-emerald-500"
                  urgent={(() => {
                    // Urgent if any habit missed yesterday and not done today
                    return data.habits.some(h => getMissedYesterday(h.id) && !dayHabitLogs.find(l => l.habit_id === h.id)?.completed);
                  })()}
                  summaryRight={`${habitsCompleted}/${todayHabits.length}`}
                  summary={(() => {
                    const bestStreak = Math.max(...data.habits.map(h => getStreakWithFreeze(h.id).current), 0);
                    const missedCount = data.habits.filter(h => getMissedYesterday(h.id) && !dayHabitLogs.find(l => l.habit_id === h.id)?.completed).length;
                    if (missedCount > 0) return `⚠️ ${missedCount} sin hacer ayer`;
                    return `${bestStreak}🔥 mejor racha`;
                  })()}
                >
                  {/* Global Summary Card */}
                  {data.habits.length > 0 && (
                    <Card className="bg-gradient-to-r from-emerald-500/10 to-violet-500/10 border-emerald-500/20 mb-3">
                      <div className="flex items-center gap-4">
                        {/* Progress Ring */}
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <svg className="w-16 h-16 -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                            <circle
                              cx="32" cy="32" r="28" fill="none"
                              stroke="url(#habitGradient)"
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeDasharray={`${todayHabits.length > 0 ? (habitsCompleted / todayHabits.length) * 176 : 0} 176`}
                            />
                            <defs>
                              <linearGradient id="habitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">{todayHabits.length > 0 ? Math.round((habitsCompleted / todayHabits.length) * 100) : 0}%</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] text-white/40">Hoy</p>
                            <p className="text-lg font-bold">{habitsCompleted}<span className="text-white/40 text-sm">/{todayHabits.length}</span></p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40">Mejor racha</p>
                            <p className="text-lg font-bold text-orange-400">
                              {Math.max(...data.habits.map(h => getStreakWithFreeze(h.id).current), 0)}🔥
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40">Consistencia 30d</p>
                            <p className="text-sm font-medium text-emerald-400">
                              {(() => {
                                const last30 = Array.from({ length: 30 }, (_, i) => getDateOffset(today, -i));
                                let total = 0, completed = 0;
                                last30.forEach(date => {
                                  data.habits.forEach(h => {
                                    if (shouldDoHabitOnDay(h, date)) {
                                      total++;
                                      if (data.habitLogs?.find(l => l.habit_id === h.id && l.date === date && l.completed)) completed++;
                                    }
                                  });
                                });
                                return total > 0 ? Math.round((completed / total) * 100) : 0;
                              })()}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40">Completados</p>
                            <p className="text-sm font-medium text-violet-400">
                              {data.habitLogs?.filter(l => l.completed).length || 0} total
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Week mini calendar */}
                      <div className="flex gap-1 mt-3 pt-3 border-t border-white/10">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => {
                          const weekDates = getWeekDates(viewDate);
                          const date = weekDates[idx];
                          const isToday = date === today;
                          const dayLogs = data.habitLogs?.filter(l => l.date === date && l.completed) || [];
                          const dayHabitsCount = data.habits.filter(h => shouldDoHabitOnDay(h, date)).length;
                          const completedCount = dayLogs.length;
                          const percentage = dayHabitsCount > 0 ? completedCount / dayHabitsCount : 0;

                          return (
                            <div key={idx} className={`flex-1 text-center py-1.5 rounded-lg ${isToday ? 'bg-white/10' : ''}`}>
                              <p className="text-[9px] text-white/40">{day}</p>
                              <div className={`w-5 h-5 mx-auto mt-1 rounded-full flex items-center justify-center text-[10px] font-medium
                        ${percentage === 1 ? 'bg-emerald-500 text-white' :
                                  percentage > 0 ? 'bg-emerald-500/30 text-emerald-300' :
                                    'bg-white/5 text-white/30'}
                      `}>
                                {percentage === 1 ? '✓' : completedCount}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Motivational nudge when no habits completed yet */}
                      {isViewingToday && habitsCompleted === 0 && todayHabits.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-center">
                          <p className="text-sm text-white/60">
                            💪 <span className="text-emerald-400">¡Pequeños pasos!</span> Empieza con uno
                          </p>
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Never Miss Twice Alert */}
                  {isViewingToday && habitsWithAlert.length > 0 && (
                    <Card className="bg-red-500/10 border-red-500/30 mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-red-300 font-medium">¡No falles dos veces!</p>
                          <p className="text-xs text-red-400/70">
                            {habitsWithAlert.map(h => h.icon + ' ' + h.name).join(', ')}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Habits List */}
                  <Card>
                    {/* Meta-habits (auto from other areas) */}
                    {(() => {
                      // Helper for gradual colors
                      const getMetaColor = (progress) => {
                        if (progress >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-400', bgLight: 'bg-emerald-500/20' };
                        if (progress >= 60) return { bg: 'bg-lime-500', text: 'text-lime-400', bgLight: 'bg-lime-500/20' };
                        if (progress >= 40) return { bg: 'bg-amber-500', text: 'text-amber-400', bgLight: 'bg-amber-500/20' };
                        if (progress >= 20) return { bg: 'bg-orange-500', text: 'text-orange-400', bgLight: 'bg-orange-500/20' };
                        return { bg: 'bg-red-500', text: 'text-red-400', bgLight: 'bg-red-500/20' };
                      };

                      const metaHabits = [
                        {
                          id: 'meta_nutrition',
                          name: 'Nutrición',
                          icon: '🥗',
                          area: 'nutrition',
                          target: 80,
                          progress: () => {
                            const todayMealsData = data.meals.filter(m => m.day_id === viewDate);
                            const totalCals = todayMealsData.reduce((s, m) => s + (m.calories || 0), 0);
                            const targetCals = data.user.goals?.calories || 2000;
                            return Math.min(120, Math.round((totalCals / targetCals) * 100));
                          }
                        },
                        {
                          id: 'meta_protein',
                          name: 'Proteína',
                          icon: '💪',
                          area: 'nutrition',
                          target: 80,
                          progress: () => {
                            const todayMealsData = data.meals.filter(m => m.day_id === viewDate);
                            const totalProt = todayMealsData.reduce((s, m) => s + (m.protein || 0), 0);
                            const targetProt = data.user.goals?.protein || 120;
                            return Math.min(120, Math.round((totalProt / targetProt) * 100));
                          }
                        },
                        {
                          id: 'meta_workout',
                          name: 'Entreno',
                          icon: '🏋️',
                          area: 'workout',
                          target: 70,
                          progress: () => {
                            const todayWorkout = (data.workouts || []).find(w => w.day_id === viewDate);
                            if (!todayWorkout) return 0;
                            if (todayWorkout.is_completed) return 100;
                            const completedSets = todayWorkout.exercises?.reduce((sum, ex) =>
                              sum + ex.sets.filter(s => s.completed).length, 0) || 0;
                            const totalSets = todayWorkout.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) || 1;
                            // Even starting counts
                            if (completedSets > 0) return Math.max(30, Math.round((completedSets / totalSets) * 100));
                            return 0;
                          }
                        },
                        {
                          id: 'meta_water',
                          name: 'Agua',
                          icon: '💧',
                          area: 'nutrition',
                          target: 75,
                          progress: () => {
                            const dayDataWater = data.days[viewDate];
                            const waterGoal = data.user.goals?.water || 8;
                            return Math.min(120, Math.round(((dayDataWater?.water_glasses || 0) / waterGoal) * 100));
                          }
                        },
                        {
                          id: 'meta_steps',
                          name: '10k pasos',
                          icon: '🚶',
                          area: 'body',
                          target: 80,
                          progress: () => {
                            const dayDataSteps = data.days[viewDate];
                            const stepsGoal = data.user.goals?.steps || 10000;
                            return Math.min(120, Math.round(((dayDataSteps?.steps || 0) / stepsGoal) * 100));
                          }
                        }
                      ];

                      const visibleMetas = metaHabits.filter(m => activeAreas.includes(m.area));
                      if (visibleMetas.length === 0) return null;

                      return (
                        <div className="mb-3 pb-3 border-b border-white/10">
                          <p className="text-[10px] text-white/40 mb-2 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> OBJETIVOS AUTO <span className="text-[8px] ml-1">(80% = ✓)</span>
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {visibleMetas.map(meta => {
                              const progress = meta.progress();
                              const colors = getMetaColor(progress);
                              const hitTarget = progress >= meta.target;

                              return (
                                <div
                                  key={meta.id}
                                  className={`flex items-center gap-2 p-2 rounded-lg transition-all ${colors.bgLight}`}
                                >
                                  <span className="text-lg">{meta.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className={`text-xs font-medium ${colors.text}`}>{meta.name}</span>
                                      <span className={`text-[10px] font-bold ${colors.text}`}>{progress}%</span>
                                    </div>
                                    <div className="relative w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                      <div
                                        className="absolute top-0 bottom-0 w-px bg-white/40"
                                        style={{ left: `${meta.target}%` }}
                                      />
                                      <div
                                        className={`h-full rounded-full transition-all ${colors.bg}`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                  {hitTarget && <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Regular habits */}
                    {todayHabits.length > 0 ? (
                      <div className="space-y-2">
                        {todayHabits.map(habit => {
                          const log = dayHabitLogs.find(l => l.habit_id === habit.id);
                          const isCompleted = log?.completed || false;
                          const usedMinVersion = log?.usedMinVersion || false;
                          const streak = getStreakWithFreeze(habit.id);
                          const missedYesterday = getMissedYesterday(habit.id);
                          const masteryLevel = getMasteryLevel(habit.id);
                          const stackedHabit = habit.stackedTo ? data.habits.find(h => h.id === habit.stackedTo) : null;

                          return (
                            <div
                              key={habit.id}
                              className={`relative flex items-center gap-3 p-2.5 rounded-xl transition-all
                        ${isCompleted ? (usedMinVersion ? 'bg-emerald-500/10' : 'bg-emerald-500/20') : 'bg-white/5'}
                        ${missedYesterday && !isCompleted ? 'ring-1 ring-red-500/50' : ''}
                      `}
                            >
                              {/* Missed yesterday indicator */}
                              {missedYesterday && !isCompleted && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                              )}

                              {/* Checkbox */}
                              <button
                                onClick={() => isViewingToday && toggleHabit(habit.id)}
                                disabled={!isViewingToday}
                                className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all
                          ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-emerald-400'}
                        `}
                              >
                                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-lg">{habit.icon}</span>}
                              </button>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm truncate ${isCompleted ? 'line-through text-white/50' : ''}`}>
                                    {habit.name}
                                  </span>
                                  {/* Mastery dots */}
                                  <div className="flex gap-0.5 flex-shrink-0">
                                    {[1, 2, 3, 4, 5].map(l => (
                                      <div key={l} className={`w-1 h-1 rounded-full ${l <= masteryLevel ? 'bg-violet-400' : 'bg-white/10'}`} />
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-0.5">
                                  {streak.current > 0 && (
                                    <span className="text-[10px] text-orange-400">{streak.current}🔥</span>
                                  )}
                                  {stackedHabit && (
                                    <span className="text-[10px] text-white/30">→ {stackedHabit.icon}</span>
                                  )}
                                  {habit.time && (
                                    <span className="text-[10px] text-white/20">{habit.time}</span>
                                  )}
                                  {usedMinVersion && isCompleted && (
                                    <span className="text-[10px] text-emerald-400/60">⚡ mínimo</span>
                                  )}
                                </div>
                              </div>

                              {/* Min version button */}
                              {!isCompleted && habit.minVersion && isViewingToday && (
                                <button
                                  onClick={() => toggleHabit(habit.id, true)}
                                  className="px-2 py-1 bg-emerald-500/20 rounded-lg text-[10px] text-emerald-400 flex-shrink-0 hover:bg-emerald-500/30"
                                  title={habit.minVersion}
                                >
                                  ⚡ 2min
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : data.habits.length > 0 ? (
                      <div className="text-center py-4">
                        <p className="text-white/40 text-sm">Sin hábitos para hoy</p>
                        <p className="text-[10px] text-white/30 mt-1">
                          {data.habits.length} hábito{data.habits.length > 1 ? 's' : ''} configurado{data.habits.length > 1 ? 's' : ''} para otros días
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-white/40 mb-2">Construye tu identidad</p>
                        <button
                          onClick={() => setScreen('habits')}
                          className="text-sm text-violet-400 flex items-center gap-1 mx-auto"
                        >
                          <Plus className="w-4 h-4" /> Crear primer hábito
                        </button>
                      </div>
                    )}
                  </Card>
                </AccordionSection>
              </AnimatedMount>
            )
          }

          {/* Work Section - EPIC VERSION */}
          {
            activeAreas.includes('work') && (
              <AnimatedMount delay={150}>
                {(() => {
                  // Work data
                  const workTasks = data.workTasks || [];
                  const workProjects = data.workProjects || [];
                  const todayTasks = workTasks.filter(t => t.dueDate === viewDate || t.scheduledDate === viewDate);
                  const todayPending = todayTasks.filter(t => !t.completed);
                  const todayCompleted = todayTasks.filter(t => t.completed);
                  const q1Tasks = workTasks.filter(t => t.eisenhower === 'q1' && !t.completed);
                  const overdueTasks = workTasks.filter(t => t.dueDate && t.dueDate < viewDate && !t.completed);
                  const inboxTasks = workTasks.filter(t => !t.project_id && !t.dueDate && !t.completed);
                  const doingTasks = workTasks.filter(t => t.status === 'doing' && !t.completed);

                  // Deep work stats
                  const deepWorkToday = workTasks
                    .filter(t => t.isDeepWork && t.completed && t.completedAt?.startsWith(viewDate))
                    .reduce((sum, t) => sum + (t.timeEstimate || 0), 0);
                  const deepWorkGoal = data.user?.workSettings?.dailyDeepWorkGoal || 4;

                  // Eat the Frog - most important task
                  const frogTask = todayPending.find(t => t.eisenhower === 'q1') ||
                    todayPending.find(t => t.priority === 'high') ||
                    todayPending[0];

                  const getProject = (id) => workProjects.find(p => p.id === id);

                  const toggleWorkTask = (taskId) => {
                    setData(prev => ({
                      ...prev,
                      workTasks: prev.workTasks.map(t =>
                        t.id === taskId ? {
                          ...t,
                          completed: !t.completed,
                          completedAt: !t.completed ? new Date().toISOString() : null,
                          status: !t.completed ? 'done' : 'todo'
                        } : t
                      )
                    }));
                    showToast('✓ Tarea actualizada');
                  };

                  const addQuickTask = () => {
                    if (!quickTaskInput.trim()) return;
                    const newTask = {
                      id: crypto.randomUUID(),
                      title: quickTaskInput.trim(),
                      description: '',
                      project_id: '',
                      priority: 'medium',
                      eisenhower: '',
                      status: 'backlog',
                      timeEstimate: 30,
                      dueDate: '',
                      scheduledDate: '',
                      isDeepWork: false,
                      completed: false,
                      completedAt: null,
                      createdAt: new Date().toISOString()
                    };
                    setData(prev => ({
                      ...prev,
                      workTasks: [...(prev.workTasks || []), newTask]
                    }));
                    setQuickTaskInput('');
                    showToast('📥 Añadido a Inbox');
                  };

                  const addDetailedTask = () => {
                    if (!newDetailedTask.title.trim()) return;
                    const newTask = {
                      id: crypto.randomUUID(),
                      ...newDetailedTask,
                      scheduledDate: newDetailedTask.dueDate,
                      completed: false,
                      completedAt: null,
                      createdAt: new Date().toISOString()
                    };
                    setData(prev => ({
                      ...prev,
                      workTasks: [...(prev.workTasks || []), newTask]
                    }));
                    setShowDetailedAdd(false);
                    setNewDetailedTask({
                      title: '', description: '', project_id: '', priority: 'medium',
                      eisenhower: 'q2', status: 'todo', timeEstimate: 30, dueDate: viewDate, isDeepWork: false
                    });
                    showToast('✓ Tarea creada');
                  };

                  const updateTask = (taskId, updates) => {
                    setData(prev => ({
                      ...prev,
                      workTasks: prev.workTasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
                    }));
                  };

                  const deleteTask = (taskId) => {
                    setData(prev => ({
                      ...prev,
                      workTasks: prev.workTasks.filter(t => t.id !== taskId)
                    }));
                    setEditingWorkTask(null);
                    showToast('Tarea eliminada');
                  };

                  const changeTaskStatus = (taskId, newStatus) => {
                    const updates = { status: newStatus };
                    if (newStatus === 'done') {
                      updates.completed = true;
                      updates.completedAt = new Date().toISOString();
                    }
                    updateTask(taskId, updates);
                    showToast('→ ' + (newStatus === 'backlog' ? 'Backlog' : newStatus === 'todo' ? 'Por hacer' : newStatus === 'doing' ? 'En progreso' : 'Hecho'));
                  };

                  const rescheduleTask = (taskId, newDate) => {
                    updateTask(taskId, { dueDate: newDate, scheduledDate: newDate });
                    showToast('📅 Reprogramada');
                  };

                  const startFocusTimer = (task, minutes = 25) => {
                    setFocusTimer(task);
                    setFocusTimeLeft(minutes * 60);
                    showToast(`🍅 Focus: ${minutes}min en "${task.title}"`);
                  };

                  const formatTimer = (seconds) => {
                    const m = Math.floor(seconds / 60);
                    const s = seconds % 60;
                    return `${m}:${s.toString().padStart(2, '0')}`;
                  };

                  // Task Item Component
                  const TaskItem = ({ task, showActions = true, highlight = false }) => {
                    const project = getProject(task.project_id);
                    const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
                    const isEditing = editingWorkTask?.id === task.id;
                    const isFocusing = focusTimer?.id === task.id;

                    return (
                      <div className={`rounded-xl transition-all ${highlight ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30' :
                        isFocusing ? 'bg-violet-500/20 border border-violet-500/50' :
                          isOverdue ? 'bg-red-500/10' : 'bg-white/5'
                        } ${task.completed ? 'opacity-60' : ''}`}>
                        <div className="flex items-start gap-3 p-3">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleWorkTask(task.id)}
                            disabled={!isViewingToday}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all flex-shrink-0
                      ${task.completed ? 'bg-violet-500 border-violet-500' :
                                task.priority === 'high' ? 'border-red-400' :
                                  task.priority === 'medium' ? 'border-yellow-400' : 'border-white/30'}
                    `}
                          >
                            {task.completed && <Check className="w-3 h-3" />}
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium ${task.completed ? 'line-through text-white/50' : ''}`}>
                                {highlight && !task.completed && <span className="text-amber-400">🐸 </span>}
                                {task.title}
                              </p>
                              {showActions && isViewingToday && !task.completed && (
                                <button
                                  onClick={() => setEditingWorkTask(isEditing ? null : task)}
                                  className="p-1 hover:bg-white/10 rounded flex-shrink-0"
                                >
                                  <MoreHorizontal className="w-4 h-4 text-white/40" />
                                </button>
                              )}
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {project && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: project.color + '30', color: project.color }}>
                                  {project.name}
                                </span>
                              )}
                              {task.eisenhower === 'q1' && <span className="text-[10px] text-red-400">🔥</span>}
                              {task.isDeepWork && <Brain className="w-3 h-3 text-violet-400" />}
                              {task.timeEstimate && (
                                <span className="text-[10px] text-white/30">{task.timeEstimate}min</span>
                              )}
                              {isOverdue && <span className="text-[10px] text-red-400">⚠️ {task.dueDate}</span>}
                              {isFocusing && (
                                <span className="text-[10px] text-violet-400 font-mono bg-violet-500/20 px-1.5 rounded">
                                  🍅 {formatTimer(focusTimeLeft)}
                                </span>
                              )}
                            </div>

                            {/* Status pills */}
                            {showActions && !task.completed && isViewingToday && (
                              <div className="flex items-center gap-1.5 mt-2">
                                {['backlog', 'todo', 'doing', 'done'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => changeTaskStatus(task.id, status)}
                                    className={`px-2 py-0.5 rounded text-[9px] transition-all ${task.status === status ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'
                                      }`}
                                  >
                                    {status === 'backlog' ? '📋' : status === 'todo' ? '📌' : status === 'doing' ? '🔄' : '✅'}
                                  </button>
                                ))}
                                {!isFocusing && (
                                  <button
                                    onClick={() => startFocusTimer(task)}
                                    className="px-2 py-0.5 rounded text-[9px] bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                                  >
                                    🍅 Focus
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expanded actions */}
                        {isEditing && (
                          <div className="px-3 pb-3 pt-0 space-y-2 border-t border-white/10 mt-1">
                            {/* Reschedule */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/40 w-16">Fecha:</span>
                              <div className="flex gap-1 flex-wrap flex-1">
                                <button onClick={() => rescheduleTask(task.id, today)}
                                  className={`px-2 py-1 rounded text-[10px] ${task.dueDate === today ? 'bg-violet-500' : 'bg-white/10'}`}>
                                  Hoy
                                </button>
                                <button onClick={() => rescheduleTask(task.id, getDateOffset(today, 1))}
                                  className={`px-2 py-1 rounded text-[10px] ${task.dueDate === getDateOffset(today, 1) ? 'bg-violet-500' : 'bg-white/10'}`}>
                                  Mañana
                                </button>
                                <button onClick={() => rescheduleTask(task.id, getDateOffset(today, 7))}
                                  className="px-2 py-1 rounded text-[10px] bg-white/10">
                                  +1 sem
                                </button>
                                <button onClick={() => rescheduleTask(task.id, '')}
                                  className="px-2 py-1 rounded text-[10px] bg-white/10">
                                  Sin fecha
                                </button>
                              </div>
                            </div>

                            {/* Priority */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/40 w-16">Prioridad:</span>
                              <div className="flex gap-1">
                                {['high', 'medium', 'low'].map(p => (
                                  <button key={p} onClick={() => updateTask(task.id, { priority: p })}
                                    className={`px-2 py-1 rounded text-[10px] ${task.priority === p ?
                                      (p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-yellow-500' : 'bg-blue-500') : 'bg-white/10'}`}>
                                    {p === 'high' ? '🔴 Alta' : p === 'medium' ? '🟡 Media' : '🔵 Baja'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Eisenhower */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/40 w-16">Matriz:</span>
                              <div className="flex gap-1 flex-wrap">
                                {[
                                  { id: 'q1', label: '🔥 Hacer', color: 'bg-red-500' },
                                  { id: 'q2', label: '📅 Planificar', color: 'bg-blue-500' },
                                  { id: 'q3', label: '👤 Delegar', color: 'bg-amber-500' },
                                  { id: 'q4', label: '🗑️ Eliminar', color: 'bg-zinc-600' }
                                ].map(q => (
                                  <button key={q.id} onClick={() => updateTask(task.id, { eisenhower: q.id })}
                                    className={`px-2 py-1 rounded text-[10px] ${task.eisenhower === q.id ? q.color : 'bg-white/10'}`}>
                                    {q.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Project */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/40 w-16">Proyecto:</span>
                              <div className="flex gap-1 flex-wrap flex-1">
                                <button onClick={() => updateTask(task.id, { project_id: '' })}
                                  className={`px-2 py-1 rounded text-[10px] ${!task.project_id ? 'bg-violet-500' : 'bg-white/10'}`}>
                                  Ninguno
                                </button>
                                {workProjects.slice(0, 4).map(p => (
                                  <button key={p.id} onClick={() => updateTask(task.id, { project_id: p.id })}
                                    className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 ${task.project_id === p.id ? 'bg-violet-500' : 'bg-white/10'}`}>
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                    {p.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Deep Work toggle */}
                            <div className="flex items-center justify-between">
                              <button onClick={() => updateTask(task.id, { isDeepWork: !task.isDeepWork })}
                                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${task.isDeepWork ? 'bg-violet-500' : 'bg-white/10'}`}>
                                <Brain className="w-3 h-3" /> Deep Work
                              </button>
                              <button onClick={() => deleteTask(task.id)}
                                className="px-3 py-1.5 rounded-lg text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <AccordionSection
                      title="TRABAJO"
                      icon={Briefcase}
                      iconColor="text-violet-400"
                      action={() => setScreen('work')}
                      actionLabel="Kanban"
                      storageKey="work"
                      progress={todayTasks.length > 0 ? Math.round((todayCompleted.length / todayTasks.length) * 100) : null}
                      progressColor="bg-violet-500"
                      urgent={overdueTasks.length > 0 || q1Tasks.length > 0}
                      summaryRight={todayTasks.length > 0 ? `${todayCompleted.length}/${todayTasks.length}` : null}
                      summary={(() => {
                        if (overdueTasks.length > 0) return `⚠️ ${overdueTasks.length} vencida${overdueTasks.length > 1 ? 's' : ''}`;
                        if (q1Tasks.length > 0) return `🔥 ${q1Tasks.length} urgente${q1Tasks.length > 1 ? 's' : ''}`;
                        if (doingTasks.length > 0) return `🔄 ${doingTasks.length} en progreso`;
                        if (todayPending.length > 0) return `${todayPending.length} pendiente${todayPending.length > 1 ? 's' : ''}`;
                        if (todayCompleted.length > 0) return '✓ Todo completado';
                        if (inboxTasks.length > 0) return `📥 ${inboxTasks.length} en inbox`;
                        return 'Sin tareas';
                      })()}
                    >
                      {/* Stats Card */}
                      <Card className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 border-violet-500/20 mb-3">
                        <div className="flex items-center gap-4">
                          {/* Progress Ring */}
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <svg className="w-14 h-14 -rotate-90">
                              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                              <circle
                                cx="28" cy="28" r="24" fill="none"
                                stroke="#8b5cf6"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray={`${todayTasks.length > 0 ? (todayCompleted.length / todayTasks.length) * 151 : 0} 151`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold">
                                {todayTasks.length > 0 ? Math.round((todayCompleted.length / todayTasks.length) * 100) : 0}%
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <div>
                              <p className="text-[10px] text-white/40">Hoy</p>
                              <p className="text-lg font-bold">{todayCompleted.length}<span className="text-white/40 text-xs">/{todayTasks.length}</span></p>
                            </div>
                            <div>
                              <p className="text-[10px] text-white/40">En progreso</p>
                              <p className="text-lg font-bold text-amber-400">{doingTasks.length}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-white/40">Deep Work</p>
                              <p className="text-sm font-bold text-violet-400">
                                {Math.floor(deepWorkToday / 60)}h{deepWorkToday % 60 > 0 ? ` ${deepWorkToday % 60}m` : ''}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Focus Timer Active */}
                        {focusTimer && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">🍅</span>
                                <div>
                                  <p className="text-xs text-white/60">Enfocado en:</p>
                                  <p className="text-sm font-medium">{focusTimer.title}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-mono font-bold text-violet-400">
                                  {formatTimer(focusTimeLeft)}
                                </span>
                                <button
                                  onClick={() => { setFocusTimer(null); setFocusTimeLeft(0); }}
                                  className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>

                      {/* Quick Add */}
                      {isViewingToday && (
                        <Card className="mb-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={quickTaskInput}
                              onChange={(e) => setQuickTaskInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addQuickTask()}
                              placeholder="Añadir rápido a inbox..."
                              className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 text-sm outline-none focus:bg-white/10 transition-all"
                            />
                            <button
                              onClick={addQuickTask}
                              disabled={!quickTaskInput.trim()}
                              className="px-3 py-2 bg-white/10 rounded-xl hover:bg-white/20 disabled:opacity-50 transition-all"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setShowDetailedAdd(true)}
                              className="px-3 py-2 bg-violet-500 rounded-xl hover:bg-violet-600 transition-all"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                          </div>
                        </Card>
                      )}

                      {/* Tasks */}
                      <Card>
                        <div className="space-y-3">
                          {/* Eat the Frog */}
                          {frogTask && !frogTask.completed && (
                            <div>
                              <p className="text-[10px] text-amber-400 font-medium mb-1.5 flex items-center gap-1">
                                🐸 EAT THE FROG
                              </p>
                              <TaskItem task={frogTask} highlight />
                            </div>
                          )}

                          {/* Overdue */}
                          {overdueTasks.length > 0 && (
                            <div>
                              <p className="text-[10px] text-red-400 font-medium mb-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> VENCIDAS ({overdueTasks.length})
                              </p>
                              <div className="space-y-2">
                                {overdueTasks.slice(0, 3).map(task => (
                                  <TaskItem key={task.id} task={task} />
                                ))}
                                {overdueTasks.length > 3 && (
                                  <button onClick={() => setScreen('work')} className="text-xs text-red-400 pl-2">
                                    +{overdueTasks.length - 3} más
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* In Progress */}
                          {doingTasks.length > 0 && (
                            <div>
                              <p className="text-[10px] text-amber-400 font-medium mb-1.5">🔄 EN PROGRESO ({doingTasks.length})</p>
                              <div className="space-y-2">
                                {doingTasks.slice(0, 3).map(task => (
                                  <TaskItem key={task.id} task={task} />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Today's remaining */}
                          {todayPending.filter(t => t.id !== frogTask?.id && t.status !== 'doing').length > 0 && (
                            <div>
                              <p className="text-[10px] text-white/40 font-medium mb-1.5">
                                HOY ({todayPending.filter(t => t.id !== frogTask?.id && t.status !== 'doing').length})
                              </p>
                              <div className="space-y-2">
                                {todayPending
                                  .filter(t => t.id !== frogTask?.id && t.status !== 'doing')
                                  .slice(0, 4)
                                  .map(task => (
                                    <TaskItem key={task.id} task={task} />
                                  ))}
                                {todayPending.filter(t => t.id !== frogTask?.id && t.status !== 'doing').length > 4 && (
                                  <button onClick={() => setScreen('work')} className="text-xs text-violet-400 pl-2">
                                    +{todayPending.filter(t => t.id !== frogTask?.id && t.status !== 'doing').length - 4} más
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Completed today */}
                          {todayCompleted.length > 0 && (
                            <div>
                              <p className="text-[10px] text-emerald-400 font-medium mb-1.5">✓ COMPLETADAS ({todayCompleted.length})</p>
                              <div className="space-y-1">
                                {todayCompleted.slice(0, 2).map(task => (
                                  <TaskItem key={task.id} task={task} showActions={false} />
                                ))}
                                {todayCompleted.length > 2 && (
                                  <p className="text-[10px] text-white/30 pl-2">+{todayCompleted.length - 2} más</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Inbox preview */}
                          {inboxTasks.length > 0 && todayPending.length === 0 && overdueTasks.length === 0 && (
                            <div>
                              <p className="text-[10px] text-white/40 font-medium mb-1.5">📥 INBOX ({inboxTasks.length})</p>
                              <div className="space-y-2">
                                {inboxTasks.slice(0, 3).map(task => (
                                  <TaskItem key={task.id} task={task} />
                                ))}
                                {inboxTasks.length > 3 && (
                                  <button onClick={() => setScreen('work')} className="text-xs text-violet-400 pl-2">
                                    +{inboxTasks.length - 3} por procesar
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Empty state */}
                          {todayTasks.length === 0 && overdueTasks.length === 0 && inboxTasks.length === 0 && (
                            <div className="text-center py-4">
                              <p className="text-2xl mb-2">🎯</p>
                              <p className="text-white/40">Sin tareas pendientes</p>
                              <p className="text-[10px] text-white/30 mt-1">¡Buen trabajo!</p>
                            </div>
                          )}
                        </div>
                      </Card>

                      {/* Detailed Add Modal */}
                      {showDetailedAdd && (
                        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center p-4" onClick={() => setShowDetailedAdd(false)}>
                          <div className="bg-zinc-900 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                              <h3 className="text-lg font-semibold">Nueva tarea</h3>
                              <button onClick={() => setShowDetailedAdd(false)} className="p-2 hover:bg-white/10 rounded-xl">
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="p-4 space-y-4">
                              {/* Title */}
                              <input
                                type="text"
                                value={newDetailedTask.title}
                                onChange={(e) => setNewDetailedTask(p => ({ ...p, title: e.target.value }))}
                                placeholder="¿Qué necesitas hacer?"
                                className="w-full bg-white/10 rounded-xl px-4 py-3 text-lg outline-none"
                                autoFocus
                              />

                              {/* Description */}
                              <textarea
                                value={newDetailedTask.description}
                                onChange={(e) => setNewDetailedTask(p => ({ ...p, description: e.target.value }))}
                                placeholder="Notas o descripción..."
                                className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm outline-none h-20 resize-none"
                              />

                              {/* Date */}
                              <div>
                                <p className="text-xs text-white/40 mb-2">Fecha</p>
                                <div className="flex gap-2 flex-wrap">
                                  {[
                                    { label: 'Hoy', value: today },
                                    { label: 'Mañana', value: getDateOffset(today, 1) },
                                    { label: 'Esta semana', value: getDateOffset(today, 7) },
                                    { label: 'Sin fecha', value: '' }
                                  ].map(d => (
                                    <button key={d.label}
                                      onClick={() => setNewDetailedTask(p => ({ ...p, dueDate: d.value }))}
                                      className={`px-3 py-2 rounded-xl text-sm ${newDetailedTask.dueDate === d.value ? 'bg-violet-500' : 'bg-white/10'}`}>
                                      {d.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Project */}
                              <div>
                                <p className="text-xs text-white/40 mb-2">Proyecto</p>
                                <div className="flex gap-2 flex-wrap">
                                  <button
                                    onClick={() => setNewDetailedTask(p => ({ ...p, project_id: '' }))}
                                    className={`px-3 py-2 rounded-xl text-sm ${!newDetailedTask.project_id ? 'bg-violet-500' : 'bg-white/10'}`}>
                                    Sin proyecto
                                  </button>
                                  {workProjects.map(p => (
                                    <button key={p.id}
                                      onClick={() => setNewDetailedTask(prev => ({ ...prev, project_id: p.id }))}
                                      className={`px-3 py-2 rounded-xl text-sm flex items-center gap-2 ${newDetailedTask.project_id === p.id ? 'bg-violet-500' : 'bg-white/10'}`}>
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                      {p.name}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Priority */}
                              <div>
                                <p className="text-xs text-white/40 mb-2">Prioridad</p>
                                <div className="flex gap-2">
                                  {[
                                    { id: 'high', label: '🔴 Alta', color: 'bg-red-500' },
                                    { id: 'medium', label: '🟡 Media', color: 'bg-yellow-500' },
                                    { id: 'low', label: '🔵 Baja', color: 'bg-blue-500' }
                                  ].map(p => (
                                    <button key={p.id}
                                      onClick={() => setNewDetailedTask(prev => ({ ...prev, priority: p.id }))}
                                      className={`flex-1 py-2.5 rounded-xl text-sm ${newDetailedTask.priority === p.id ? p.color : 'bg-white/10'}`}>
                                      {p.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Eisenhower */}
                              <div>
                                <p className="text-xs text-white/40 mb-2">Matriz Eisenhower</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    { id: 'q1', label: '🔥 Hacer ya', desc: 'Urgente + Importante' },
                                    { id: 'q2', label: '📅 Planificar', desc: 'Importante' },
                                    { id: 'q3', label: '👤 Delegar', desc: 'Urgente' },
                                    { id: 'q4', label: '🗑️ Eliminar', desc: 'Ninguno' }
                                  ].map(q => (
                                    <button key={q.id}
                                      onClick={() => setNewDetailedTask(prev => ({ ...prev, eisenhower: q.id }))}
                                      className={`p-2 rounded-xl text-left ${newDetailedTask.eisenhower === q.id ? 'bg-violet-500' : 'bg-white/10'}`}>
                                      <p className="text-sm font-medium">{q.label}</p>
                                      <p className="text-[10px] text-white/50">{q.desc}</p>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Time estimate + Deep work */}
                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <p className="text-xs text-white/40 mb-2">Duración</p>
                                  <div className="flex gap-1">
                                    {[15, 30, 60, 120].map(t => (
                                      <button key={t}
                                        onClick={() => setNewDetailedTask(prev => ({ ...prev, timeEstimate: t }))}
                                        className={`flex-1 py-2 rounded-xl text-xs ${newDetailedTask.timeEstimate === t ? 'bg-violet-500' : 'bg-white/10'}`}>
                                        {t < 60 ? `${t}m` : `${t / 60}h`}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-white/40 mb-2">Tipo</p>
                                  <button
                                    onClick={() => setNewDetailedTask(prev => ({ ...prev, isDeepWork: !prev.isDeepWork }))}
                                    className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${newDetailedTask.isDeepWork ? 'bg-violet-500' : 'bg-white/10'}`}>
                                    <Brain className="w-4 h-4" /> Deep
                                  </button>
                                </div>
                              </div>

                              {/* Submit */}
                              <button
                                onClick={addDetailedTask}
                                disabled={!newDetailedTask.title.trim()}
                                className="w-full py-3 bg-violet-500 rounded-xl font-semibold hover:bg-violet-600 disabled:opacity-50 transition-all">
                                Crear tarea
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </AccordionSection>
                  );
                })()}
              </AnimatedMount>
            )
          }

          {/* Finances Section */}
          {
            activeAreas.includes('finances') && (() => {
              // Finance mode and data
              const financeMode = data.finances?.financeMode || 'personal';
              const personalEnabled = data.finances?.personalEnabled ?? true;
              const businessEnabled = data.finances?.businessEnabled ?? false;
              const currency = data.finances?.currency || '€';
              const thisMonth = viewDate.substring(0, 7);

              // Get transactions based on current mode
              const transactions = financeMode === 'business'
                ? (data.finances?.businessTransactions || [])
                : (data.finances?.personalTransactions || data.finances?.transactions || []);

              const monthTransactions = transactions.filter(t => t.date?.startsWith(thisMonth));
              const monthExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
              const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
              const todayTransactions = transactions.filter(t => t.date === viewDate);
              const todayExpenses = todayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

              // Mode-specific calculations
              const emergencyFund = data.finances?.emergencyFund || { targetMonths: 6, currentAmount: 0 };
              const avgMonthlyExpense = monthExpenses > 0 ? monthExpenses : 1500;
              const monthsCovered = emergencyFund.currentAmount / avgMonthlyExpense;

              const taxSettings = data.finances?.taxSettings || { ivaRate: 21, irpfRate: 15, reservePercentage: 30 };
              const taxReserve = monthIncome * (taxSettings.reservePercentage / 100);
              const netProfit = monthIncome - monthExpenses - taxReserve;

              // Categories based on mode
              const expenseCategories = financeMode === 'business'
                ? [
                  { id: 'supplies', name: 'Material', icon: '📦' },
                  { id: 'services', name: 'Servicios', icon: '💼' },
                  { id: 'marketing', name: 'Marketing', icon: '📣' },
                  { id: 'travel', name: 'Viajes', icon: '✈️' },
                  { id: 'other', name: 'Otro', icon: '📋' }
                ]
                : [
                  { id: 'food', name: 'Comida', icon: '🍔' },
                  { id: 'transport', name: 'Transporte', icon: '🚗' },
                  { id: 'shopping', name: 'Compras', icon: '🛍️' },
                  { id: 'entertainment', name: 'Ocio', icon: '🎬' },
                  { id: 'other', name: 'Otro', icon: '📦' }
                ];

              const incomeCategories = financeMode === 'business'
                ? [
                  { id: 'client', name: 'Cliente', icon: '👤' },
                  { id: 'project', name: 'Proyecto', icon: '📁' },
                  { id: 'retainer', name: 'Retención', icon: '📅' },
                  { id: 'other', name: 'Otro', icon: '💰' }
                ]
                : [
                  { id: 'salary', name: 'Salario', icon: '💵' },
                  { id: 'freelance', name: 'Freelance', icon: '💻' },
                  { id: 'investment', name: 'Inversiones', icon: '📈' },
                  { id: 'other', name: 'Otro', icon: '💰' }
                ];

              // Toggle finance mode
              const toggleFinanceMode = (newMode) => {
                setData(prev => ({
                  ...prev,
                  finances: {
                    ...prev.finances,
                    financeMode: newMode
                  }
                }));
              };

              return (
                <AnimatedMount delay={175}>
                  <AccordionSection
                    title={financeMode === 'business' ? 'EMPRESA' : 'FINANZAS'}
                    icon={financeMode === 'business' ? Briefcase : Wallet}
                    iconColor={financeMode === 'business' ? 'text-blue-400' : 'text-green-400'}
                    action={() => setScreen('finances')}
                    actionLabel="Ver todo"
                    storageKey="finances"
                    summaryRight={monthIncome > 0 ? `+${monthIncome.toFixed(0)}${currency}` : `-${monthExpenses.toFixed(0)}${currency}`}
                    summary={financeMode === 'business'
                      ? `Neto: ${netProfit >= 0 ? '+' : ''}${netProfit.toFixed(0)}${currency}`
                      : `Balance: ${(monthIncome - monthExpenses) >= 0 ? '+' : ''}${(monthIncome - monthExpenses).toFixed(0)}${currency}`
                    }
                  >
                    <Card className="mt-2">
                      <div className="space-y-3">
                        {/* Mode Toggle - only show if both modes are enabled */}
                        {personalEnabled && businessEnabled && (
                          <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                            <button
                              onClick={() => toggleFinanceMode('personal')}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${financeMode === 'personal'
                                ? 'bg-green-500 text-white'
                                : 'text-white/50 hover:text-white/70'
                                }`}
                            >
                              👤 Personal
                            </button>
                            <button
                              onClick={() => toggleFinanceMode('business')}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${financeMode === 'business'
                                ? 'bg-blue-500 text-white'
                                : 'text-white/50 hover:text-white/70'
                                }`}
                            >
                              💼 Empresa
                            </button>
                          </div>
                        )}

                        {/* Monthly overview */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-white/40">Gastos mes</p>
                            <p className="text-xl font-bold text-red-400">-{monthExpenses.toFixed(0)}{currency}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/40">Ingresos mes</p>
                            <p className="text-lg font-bold text-green-400">+{monthIncome.toFixed(0)}{currency}</p>
                          </div>
                        </div>

                        {/* Mode-specific info card */}
                        {financeMode === 'personal' && emergencyFund.currentAmount > 0 && (
                          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🛡️</span>
                              <div className="flex-1">
                                <p className="text-xs text-white/60">Fondo de emergencia</p>
                                <p className="text-sm font-medium text-emerald-400">
                                  {monthsCovered.toFixed(1)} meses cubiertos
                                </p>
                              </div>
                              <span className="text-sm text-white/40">{emergencyFund.currentAmount.toFixed(0)}{currency}</span>
                            </div>
                          </div>
                        )}

                        {financeMode === 'business' && monthIncome > 0 && (
                          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📊</span>
                              <div className="flex-1">
                                <p className="text-xs text-white/60">Reserva impuestos ({taxSettings.reservePercentage}%)</p>
                                <p className="text-sm font-medium text-blue-400">
                                  {taxReserve.toFixed(0)}{currency}
                                </p>
                              </div>
                              <span className={`text-sm font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                Neto: {netProfit.toFixed(0)}{currency}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Quick add buttons - always visible when viewing today */}
                        {isViewingToday && (
                          <div className="pt-2 border-t border-white/10">
                            {!financeShowQuickAdd ? (
                              <div className="space-y-2">
                                {/* Quick expense row */}
                                <div>
                                  <p className="text-xs text-white/40 mb-1.5">💸 Gasto rápido:</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {[5, 10, 20, 50].map(amount => (
                                      <button
                                        key={amount}
                                        onClick={() => addQuickTransaction(amount, 'expense', expenseCategories[0].id)}
                                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg text-sm font-medium transition-colors"
                                      >
                                        {amount}{currency}
                                      </button>
                                    ))}
                                    <button
                                      onClick={() => { setFinanceQuickType('expense'); setFinanceShowQuickAdd(true); }}
                                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg text-sm transition-colors"
                                    >
                                      Otro...
                                    </button>
                                  </div>
                                </div>
                                {/* Quick income row */}
                                <div>
                                  <p className="text-xs text-white/40 mb-1.5">💰 Ingreso rápido:</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {[50, 100, 500, 1000].map(amount => (
                                      <button
                                        key={amount}
                                        onClick={() => addQuickTransaction(amount, 'income', incomeCategories[0].id)}
                                        className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/40 text-green-300 rounded-lg text-sm font-medium transition-colors"
                                      >
                                        +{amount}{currency}
                                      </button>
                                    ))}
                                    <button
                                      onClick={() => { setFinanceQuickType('income'); setFinanceShowQuickAdd(true); }}
                                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg text-sm transition-colors"
                                    >
                                      Otro...
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm">{financeQuickType === 'expense' ? '💸 Nuevo gasto' : '💰 Nuevo ingreso'}</span>
                                  <span className={`px-2 py-0.5 rounded text-xs ${financeMode === 'business' ? 'bg-blue-500/30 text-blue-300' : 'bg-green-500/30 text-green-300'}`}>
                                    {financeMode === 'business' ? 'Empresa' : 'Personal'}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    value={financeQuickAmount}
                                    onChange={(e) => setFinanceQuickAmount(e.target.value)}
                                    placeholder="Cantidad"
                                    className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500"
                                    autoFocus
                                  />
                                  <select
                                    value={financeQuickCategory}
                                    onChange={(e) => setFinanceQuickCategory(e.target.value)}
                                    className="bg-white/10 rounded-lg px-2 py-2 text-sm outline-none"
                                  >
                                    {(financeQuickType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <input
                                  type="text"
                                  value={financeQuickDescription}
                                  onChange={(e) => setFinanceQuickDescription(e.target.value)}
                                  placeholder="Descripción (opcional)"
                                  className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      if (financeQuickAmount) {
                                        addQuickTransaction(financeQuickAmount, financeQuickType, financeQuickCategory, financeQuickDescription);
                                      }
                                    }}
                                    disabled={!financeQuickAmount}
                                    className={`flex-1 py-2 ${financeQuickType === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} disabled:opacity-50 rounded-lg text-sm font-medium transition-colors`}
                                  >
                                    {financeQuickType === 'expense' ? '💸 Guardar gasto' : '💰 Guardar ingreso'}
                                  </button>
                                  <button
                                    onClick={() => { setFinanceShowQuickAdd(false); setFinanceQuickAmount(''); setFinanceQuickDescription(''); }}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Today's transactions */}
                        {todayTransactions.length > 0 && (
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-xs text-white/40 mb-2">Movimientos de hoy:</p>
                            <div className="space-y-1">
                              {todayTransactions.slice(0, 4).map(t => (
                                <div key={t.id} className="flex items-center justify-between text-sm">
                                  <span className="text-white/70">{t.description || t.category}</span>
                                  <span className={t.type === 'expense' ? 'text-red-400' : 'text-green-400'}>
                                    {t.type === 'expense' ? '-' : '+'}{t.amount}{currency}
                                  </span>
                                </div>
                              ))}
                              {todayTransactions.length > 4 && (
                                <p className="text-xs text-white/30 text-center">+{todayTransactions.length - 4} más</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </AccordionSection>
                </AnimatedMount>
              );
            })()
          }

          {/* Insights moved to NOTIFICATIONS SECTION at top of TodayScreen */}


          {/* ==================== PERSONAL TASKS ==================== */}
          {
            activeAreas.includes('personal') && (() => {
              const personalTasks = data.personalTasks || [];
              const defaultCategories = [
                { id: 'home', name: 'Hogar', icon: '🏠', color: '#10B981' },
                { id: 'admin', name: 'Admin', icon: '📋', color: '#6366F1' },
                { id: 'health', name: 'Salud', icon: '❤️', color: '#EF4444' },
                { id: 'social', name: 'Social', icon: '👥', color: '#F59E0B' },
                { id: 'travel', name: 'Viajes', icon: '✈️', color: '#3B82F6' },
                { id: 'learning', name: 'Aprendizaje', icon: '📚', color: '#8B5CF6' },
                { id: 'projects', name: 'Proyectos', icon: '🚀', color: '#EC4899' }
              ];
              const personalCategories = (data.personalCategories && data.personalCategories.length > 0)
                ? data.personalCategories
                : defaultCategories;

              const todayTasks = personalTasks.filter(t => !t.completed && t.dueDate === viewDate);
              const overdueTasks = personalTasks.filter(t => !t.completed && t.dueDate && t.dueDate < viewDate);
              const upcomingTasks = personalTasks.filter(t => !t.completed && t.dueDate && t.dueDate > viewDate).slice(0, 2);
              const noDueTasks = personalTasks.filter(t => !t.completed && !t.dueDate).slice(0, 2);
              const allPending = [...overdueTasks, ...todayTasks, ...upcomingTasks.slice(0, 2), ...noDueTasks.slice(0, 1)];
              const completedToday = personalTasks.filter(t => t.completed && t.completedAt?.startsWith(viewDate)).length;

              const getCat = (id) => personalCategories.find(c => c.id === id) || defaultCategories[0];

              const togglePersonalTask = (id) => {
                setData(prev => ({
                  ...prev,
                  personalTasks: prev.personalTasks.map(t =>
                    t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t
                  )
                }));
                showToast('✓ Tarea completada');
              };

              const toggleSubtask = (taskId, subtaskId) => {
                setData(prev => ({
                  ...prev,
                  personalTasks: prev.personalTasks.map(t =>
                    t.id === taskId ? {
                      ...t,
                      subtasks: (t.subtasks || []).map(st =>
                        st.id === subtaskId ? { ...st, completed: !st.completed } : st
                      )
                    } : t
                  )
                }));
              };

              const addSubtask = (taskId) => {
                if (!personalNewSubtask.trim()) return;
                setData(prev => ({
                  ...prev,
                  personalTasks: prev.personalTasks.map(t =>
                    t.id === taskId ? {
                      ...t,
                      subtasks: [...(t.subtasks || []), { id: `st-${Date.now()}`, title: personalNewSubtask, completed: false }]
                    } : t
                  )
                }));
                setPersonalNewSubtask('');
              };

              const addPersonalTask = () => {
                if (!personalNewTask.title.trim()) return;
                const newTask = {
                  id: `pt-${Date.now()}`,
                  ...personalNewTask,
                  completed: false,
                  subtasks: [],
                  notes: '',
                  createdAt: viewDate
                };
                setData(prev => ({ ...prev, personalTasks: [...prev.personalTasks, newTask] }));
                setPersonalNewTask({ title: '', category: 'home', dueDate: '', priority: 'medium' });
                setPersonalShowAddTask(false);
                showToast('✓ Tarea añadida');
              };

              return (
                <AnimatedMount delay={180}>
                  <AccordionSection
                    title="PERSONAL"
                    icon={Calendar}
                    iconColor="text-cyan-400"
                    storageKey="personal"
                    progress={allPending.length > 0 ? Math.round((completedToday / (completedToday + allPending.length)) * 100) : null}
                    progressColor="bg-cyan-500"
                    urgent={overdueTasks.length > 0}
                    summary={
                      overdueTasks.length > 0
                        ? `⚠️ ${overdueTasks.length} vencida${overdueTasks.length > 1 ? 's' : ''}`
                        : todayTasks.length > 0
                          ? `${todayTasks.length} para hoy`
                          : allPending.length > 0
                            ? `${allPending.length} pendiente${allPending.length > 1 ? 's' : ''}`
                            : '✨ Todo al día'
                    }
                  >
                    <div className="mt-2 space-y-2">
                      {allPending.length === 0 && !personalShowAddTask ? (
                        <Card className="text-center py-4">
                          <p className="text-white/40 text-sm">Sin tareas pendientes</p>
                          <button
                            onClick={() => setPersonalShowAddTask(true)}
                            className="text-cyan-400 text-sm mt-1 flex items-center gap-1 mx-auto"
                          >
                            <Plus className="w-4 h-4" /> Añadir
                          </button>
                        </Card>
                      ) : (
                        <>
                          {allPending.slice(0, 5).map(task => {
                            const cat = getCat(task.category);
                            const isOverdue = task.dueDate && task.dueDate < viewDate;
                            const isExpanded = personalExpandedTask === task.id;
                            const subtasks = task.subtasks || [];
                            const completedSubtasks = subtasks.filter(st => st.completed).length;

                            return (
                              <Card
                                key={task.id}
                                className={`py-2 transition-all ${isOverdue ? 'border-red-500/30' : ''} ${isExpanded ? 'border-cyan-500/50' : ''}`}
                                style={{ borderLeftWidth: '3px', borderLeftColor: cat.color }}
                              >
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => togglePersonalTask(task.id)}
                                    className="w-5 h-5 rounded-full border-2 border-white/30 flex items-center justify-center hover:border-cyan-400 transition-all flex-shrink-0"
                                  >
                                  </button>
                                  <div
                                    className="flex-1 min-w-0 cursor-pointer"
                                    onClick={() => setPersonalExpandedTask(isExpanded ? null : task.id)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium truncate">{task.title}</p>
                                      {subtasks.length > 0 && (
                                        <span className="text-[10px] text-white/40 bg-white/10 px-1.5 py-0.5 rounded">
                                          {completedSubtasks}/{subtasks.length}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px]" style={{ color: cat.color }}>{cat.icon} {cat.name}</span>
                                      {task.dueDate && (
                                        <span className={`text-[10px] ${isOverdue ? 'text-red-400' : 'text-white/40'}`}>
                                          {task.dueDate === viewDate ? 'Hoy' : isOverdue ? '⚠️ Vencida' : new Date(task.dueDate).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronDown className={`w-4 h-4 text-white/30 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Expanded: Subtasks */}
                                {isExpanded && (
                                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                                    {/* Existing subtasks */}
                                    {subtasks.map(st => (
                                      <div key={st.id} className="flex items-center gap-2 ml-7">
                                        <button
                                          onClick={() => toggleSubtask(task.id, st.id)}
                                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${st.completed ? 'bg-cyan-500 border-cyan-500' : 'border-white/30'}`}
                                        >
                                          {st.completed && <Check className="w-3 h-3" />}
                                        </button>
                                        <span className={`text-sm ${st.completed ? 'text-white/40 line-through' : ''}`}>{st.title}</span>
                                      </div>
                                    ))}

                                    {/* Add subtask */}
                                    <div className="flex items-center gap-2 ml-7">
                                      <input
                                        type="text"
                                        value={personalNewSubtask}
                                        onChange={(e) => setPersonalNewSubtask(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addSubtask(task.id)}
                                        placeholder="+ Añadir subtarea..."
                                        className="flex-1 bg-white/5 rounded px-2 py-1 text-sm"
                                      />
                                      {personalNewSubtask && (
                                        <button
                                          onClick={() => addSubtask(task.id)}
                                          className="text-cyan-400 text-sm"
                                        >
                                          Añadir
                                        </button>
                                      )}
                                    </div>

                                    {/* Notes */}
                                    {task.notes && (
                                      <p className="text-xs text-white/40 ml-7 italic">📝 {task.notes}</p>
                                    )}
                                  </div>
                                )}
                              </Card>
                            );
                          })}

                          {allPending.length > 5 && (
                            <p className="text-center text-xs text-cyan-400">
                              +{allPending.length - 5} más
                            </p>
                          )}
                        </>
                      )}

                      {/* Add task form */}
                      {personalShowAddTask ? (
                        <Card className="py-3 space-y-2">
                          <input
                            type="text"
                            value={personalNewTask.title}
                            onChange={(e) => setPersonalNewTask(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="¿Qué necesitas hacer?"
                            className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <select
                              value={personalNewTask.category}
                              onChange={(e) => setPersonalNewTask(prev => ({ ...prev, category: e.target.value }))}
                              className="flex-1 bg-white/5 rounded-lg px-2 py-2 text-sm"
                            >
                              {personalCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                              ))}
                            </select>
                            <input
                              type="date"
                              value={personalNewTask.dueDate}
                              onChange={(e) => setPersonalNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                              className="flex-1 bg-white/5 rounded-lg px-2 py-2 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPersonalShowAddTask(false)}
                              className="flex-1 py-2 bg-white/10 rounded-lg text-sm"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={addPersonalTask}
                              disabled={!personalNewTask.title.trim()}
                              className="flex-1 py-2 bg-cyan-500 rounded-lg text-sm font-medium disabled:opacity-30"
                            >
                              Añadir
                            </button>
                          </div>
                        </Card>
                      ) : allPending.length > 0 && (
                        <button
                          onClick={() => setPersonalShowAddTask(true)}
                          className="w-full py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-400 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Añadir tarea
                        </button>
                      )}
                    </div>
                  </AccordionSection>
                </AnimatedMount>
              );
            })()
          }

          {/* ==================== RELATIONSHIPS ==================== */}
          {
            activeAreas.includes('relationships') && (() => {
              const relationships = data.relationships || [];

              // Same categories as RelationshipsScreen
              const categories = {
                partner: { name: 'Pareja', icon: '💑', color: '#EC4899' },
                family: { name: 'Familia', icon: '👨‍👩‍👧‍👦', color: '#F59E0B' },
                friends: { name: 'Amigos', icon: '👥', color: '#3B82F6' },
                professional: { name: 'Profesional', icon: '🤝', color: '#8B5CF6' },
                community: { name: 'Comunidad', icon: '🌱', color: '#10B981' }
              };

              // Same love languages as RelationshipsScreen
              const loveLanguages = {
                words: { name: 'Palabras', icon: '💬' },
                time: { name: 'Tiempo', icon: '⏰' },
                gifts: { name: 'Regalos', icon: '🎁' },
                service: { name: 'Servicio', icon: '🛠️' },
                touch: { name: 'Contacto', icon: '🤗' }
              };

              const frequencyDays = { daily: 1, weekly: 7, biweekly: 14, monthly: 30, quarterly: 90 };

              // Calculate days since last contact (using interactions array like RelationshipsScreen)
              const getDaysSinceContact = (rel) => {
                // Check interactions first
                if (rel.interactions?.length > 0) {
                  const sorted = [...rel.interactions].sort((a, b) => b.date.localeCompare(a.date));
                  const lastDate = sorted[0].date;
                  return Math.floor((new Date(viewDate) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
                }
                // Fallback to lastContact field
                if (rel.lastContact) {
                  return Math.floor((new Date(viewDate) - new Date(rel.lastContact)) / (1000 * 60 * 60 * 24));
                }
                return null;
              };

              // Check if needs attention
              const needsAttentionCheck = (rel) => {
                const days = getDaysSinceContact(rel);
                if (days === null) return true;
                const targetDays = frequencyDays[rel.contactFrequency] || 7;
                return days >= targetDays;
              };

              // Get health score (1-5)
              const getHealthScore = (rel) => {
                const days = getDaysSinceContact(rel);
                if (days === null) return 1;
                const targetDays = frequencyDays[rel.contactFrequency] || 7;
                const ratio = days / targetDays;
                if (ratio <= 0.5) return 5;
                if (ratio <= 1) return 4;
                if (ratio <= 1.5) return 3;
                if (ratio <= 2) return 2;
                return 1;
              };

              // Calculate who needs attention
              const needsAttention = relationships.filter(needsAttentionCheck).sort((a, b) => {
                const daysA = getDaysSinceContact(a) ?? 999;
                const daysB = getDaysSinceContact(b) ?? 999;
                return daysB - daysA;
              });

              // Upcoming birthdays (next 30 days)
              const upcomingBirthdays = relationships.filter(r => {
                if (!r.birthday) return false;
                const bday = new Date(r.birthday);
                const thisYear = new Date(viewDate);
                thisYear.setMonth(bday.getMonth());
                thisYear.setDate(bday.getDate());
                if (thisYear < new Date(viewDate)) thisYear.setFullYear(thisYear.getFullYear() + 1);
                const daysUntil = Math.floor((thisYear - new Date(viewDate)) / (1000 * 60 * 60 * 24));
                return daysUntil >= 0 && daysUntil <= 30;
              }).map(r => {
                const bday = new Date(r.birthday);
                const thisYear = new Date(viewDate);
                thisYear.setMonth(bday.getMonth());
                thisYear.setDate(bday.getDate());
                if (thisYear < new Date(viewDate)) thisYear.setFullYear(thisYear.getFullYear() + 1);
                const daysUntil = Math.floor((thisYear - new Date(viewDate)) / (1000 * 60 * 60 * 24));
                return { ...r, daysUntil };
              }).sort((a, b) => a.daysUntil - b.daysUntil);

              // Log interaction (compatible with RelationshipsScreen)
              const logInteraction = (relId) => {
                const interaction = {
                  id: `int-${Date.now()}`,
                  date: viewDate,
                  type: 'inperson',
                  notes: relInteractionNote,
                  quality: 3,
                  timestamp: new Date().toISOString()
                };
                setData(prev => ({
                  ...prev,
                  relationships: prev.relationships.map(r =>
                    r.id === relId ? {
                      ...r,
                      lastContact: viewDate,
                      interactions: [...(r.interactions || []), interaction]
                    } : r
                  )
                }));
                setRelInteractionNote('');
                setRelExpandedCard(null);
                showToast('✓ Contacto registrado');
              };

              // Add new contact (compatible with RelationshipsScreen)
              const addContact = () => {
                if (!relNewContact.name.trim()) return;
                const newRel = {
                  id: `rel-${Date.now()}`,
                  name: relNewContact.name,
                  category: relNewContact.category,
                  contactFrequency: relNewContact.contactFrequency,
                  loveLanguage: relNewContact.loveLanguage || '',
                  birthday: relNewContact.birthday || '',
                  anniversary: '',
                  notes: '',
                  interests: '',
                  pendingTopics: '',
                  healthRating: 3,
                  interactions: [],
                  createdAt: new Date().toISOString()
                };
                setData(prev => ({ ...prev, relationships: [...(prev.relationships || []), newRel] }));
                setRelNewContact({ name: '', category: 'friends', contactFrequency: 'weekly', birthday: '', loveLanguage: '' });
                setRelShowAddContact(false);
                showToast('✓ Contacto añadido');
              };

              return (
                <AnimatedMount delay={182}>
                  <AccordionSection
                    title="RELACIONES"
                    icon={Users}
                    iconColor="text-pink-400"
                    storageKey="relationships"
                    action={() => setScreen('relationships')}
                    actionLabel="Ver todo"
                    progress={relationships.length > 0 ? Math.round(((relationships.length - needsAttention.length) / relationships.length) * 100) : null}
                    progressColor="bg-pink-500"
                    urgent={needsAttention.length > 2}
                    summary={
                      needsAttention.length > 0
                        ? `${needsAttention.length} necesita${needsAttention.length > 1 ? 'n' : ''} atención`
                        : upcomingBirthdays.length > 0
                          ? `🎂 ${upcomingBirthdays[0].name} en ${upcomingBirthdays[0].daysUntil}d`
                          : '✨ Conexiones al día'
                    }
                    summaryRight={relationships.length > 0 ? `${relationships.length} 👥` : null}
                  >
                    <div className="mt-2 space-y-2">

                      {/* Upcoming birthdays alert */}
                      {upcomingBirthdays.length > 0 && upcomingBirthdays[0].daysUntil <= 7 && (
                        <Card className="py-2 border-amber-500/30 bg-amber-500/10">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🎂</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{upcomingBirthdays[0].name}</p>
                              <p className="text-xs text-amber-400">
                                {upcomingBirthdays[0].daysUntil === 0 ? '¡Hoy!' : `En ${upcomingBirthdays[0].daysUntil} día${upcomingBirthdays[0].daysUntil > 1 ? 's' : ''}`}
                              </p>
                            </div>
                            {upcomingBirthdays.length > 1 && (
                              <span className="text-xs text-white/40">+{upcomingBirthdays.length - 1} más</span>
                            )}
                          </div>
                        </Card>
                      )}

                      {/* Needs attention list */}
                      {needsAttention.length > 0 ? (
                        needsAttention.slice(0, 4).map(rel => {
                          const cat = categories[rel.category] || categories.friends;
                          const daysSince = getDaysSinceContact(rel);
                          const health = getHealthScore(rel);
                          const isExpanded = relExpandedCard === rel.id;

                          return (
                            <Card
                              key={rel.id}
                              className={`py-2 transition-all ${isExpanded ? 'border-pink-500/50' : ''}`}
                              style={{ borderLeftWidth: '3px', borderLeftColor: cat.color }}
                            >
                              <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setRelExpandedCard(isExpanded ? null : rel.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                                    style={{ backgroundColor: cat.color + '30' }}
                                  >
                                    {cat.icon}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">{rel.name}</p>
                                      {rel.loveLanguage && <span className="text-xs">{loveLanguages[rel.loveLanguage]?.icon}</span>}
                                    </div>
                                    <p className="text-[10px] text-white/40">
                                      {daysSince !== null ? (
                                        daysSince === 0 ? 'Hoy' : `Hace ${daysSince} día${daysSince > 1 ? 's' : ''}`
                                      ) : 'Sin contacto'}
                                      <span className="mx-1">•</span>
                                      <span style={{ color: cat.color }}>{cat.name}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {/* Health bars */}
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                      <div
                                        key={i}
                                        className={`w-1 h-3 rounded-full ${i <= health ? 'bg-pink-500' : 'bg-white/10'}`}
                                      />
                                    ))}
                                  </div>
                                  <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>

                              {/* Expanded: Quick actions */}
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                                  {/* Info row */}
                                  <div className="flex gap-2 text-xs">
                                    {rel.birthday && (
                                      <span className="px-2 py-1 bg-white/5 rounded-lg">
                                        🎂 {new Date(rel.birthday).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                                      </span>
                                    )}
                                    {rel.contactFrequency && (
                                      <span className="px-2 py-1 bg-white/5 rounded-lg">
                                        🔄 {frequencyDays[rel.contactFrequency] === 1 ? 'Diario' :
                                          frequencyDays[rel.contactFrequency] === 7 ? 'Semanal' :
                                            frequencyDays[rel.contactFrequency] === 14 ? 'Quincenal' :
                                              frequencyDays[rel.contactFrequency] === 30 ? 'Mensual' : 'Trimestral'}
                                      </span>
                                    )}
                                  </div>

                                  {/* Notes/Interests */}
                                  {(rel.notes || rel.interests || rel.pendingTopics) && (
                                    <div className="bg-white/5 rounded-lg p-2 space-y-1">
                                      {rel.interests && (
                                        <p className="text-xs text-white/60">
                                          <span className="text-white/40">Intereses:</span> {rel.interests}
                                        </p>
                                      )}
                                      {rel.pendingTopics && (
                                        <p className="text-xs text-amber-400/80">
                                          <span className="text-white/40">Pendiente:</span> {rel.pendingTopics}
                                        </p>
                                      )}
                                      {rel.notes && (
                                        <p className="text-xs text-white/50 italic">📝 {rel.notes}</p>
                                      )}
                                    </div>
                                  )}

                                  {/* Love language tip */}
                                  {rel.loveLanguage && (
                                    <p className="text-[10px] text-pink-400/70 flex items-center gap-1">
                                      💡 Tip: {loveLanguages[rel.loveLanguage]?.icon} {loveLanguages[rel.loveLanguage]?.name}
                                    </p>
                                  )}

                                  {/* Interaction input */}
                                  <input
                                    type="text"
                                    value={relInteractionNote}
                                    onChange={(e) => setRelInteractionNote(e.target.value)}
                                    placeholder="Nota del contacto (opcional)..."
                                    className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm"
                                  />

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => logInteraction(rel.id)}
                                      className="flex-1 py-2 bg-pink-500 rounded-lg text-sm font-medium"
                                    >
                                      ✓ Registrar contacto
                                    </button>
                                    <button
                                      onClick={() => setScreen('relationships')}
                                      className="py-2 px-3 bg-white/10 rounded-lg text-sm"
                                    >
                                      Ver más
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Card>
                          );
                        })
                      ) : (
                        <Card className="py-4 text-center">
                          <p className="text-white/40 text-sm">✨ Todas las relaciones al día</p>
                        </Card>
                      )}

                      {needsAttention.length > 4 && (
                        <p className="text-center text-xs text-pink-400">
                          +{needsAttention.length - 4} más necesitan atención
                        </p>
                      )}

                      {/* Add contact button or form */}
                      {relShowAddContact ? (
                        <Card className="py-3 space-y-2">
                          <input
                            type="text"
                            value={relNewContact.name}
                            onChange={(e) => setRelNewContact(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nombre"
                            className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <select
                              value={relNewContact.category}
                              onChange={(e) => setRelNewContact(prev => ({ ...prev, category: e.target.value }))}
                              className="flex-1"
                            >
                              {Object.entries(categories).map(([id, cat]) => (
                                <option key={id} value={id}>{cat.icon} {cat.name}</option>
                              ))}
                            </select>
                            <select
                              value={relNewContact.contactFrequency}
                              onChange={(e) => setRelNewContact(prev => ({ ...prev, contactFrequency: e.target.value }))}
                              className="flex-1"
                            >
                              <option value="daily">Diario</option>
                              <option value="weekly">Semanal</option>
                              <option value="biweekly">Quincenal</option>
                              <option value="monthly">Mensual</option>
                              <option value="quarterly">Trimestral</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-[10px] text-white/40 mb-1 block">Cumpleaños</label>
                              <input
                                type="date"
                                value={relNewContact.birthday || ''}
                                onChange={(e) => setRelNewContact(prev => ({ ...prev, birthday: e.target.value }))}
                                className="w-full"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-[10px] text-white/40 mb-1 block">Lenguaje de amor</label>
                              <select
                                value={relNewContact.loveLanguage || ''}
                                onChange={(e) => setRelNewContact(prev => ({ ...prev, loveLanguage: e.target.value }))}
                                className="w-full"
                              >
                                <option value="">-- Opcional --</option>
                                {Object.entries(loveLanguages).map(([id, lang]) => (
                                  <option key={id} value={id}>{lang.icon} {lang.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setRelShowAddContact(false)}
                              className="flex-1 py-2 bg-white/10 rounded-lg text-sm"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={addContact}
                              disabled={!relNewContact.name.trim()}
                              className="flex-1 py-2 bg-pink-500 rounded-lg text-sm font-medium disabled:opacity-30"
                            >
                              Añadir
                            </button>
                          </div>
                        </Card>
                      ) : (
                        <button
                          onClick={() => setRelShowAddContact(true)}
                          className="w-full py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-sm text-pink-400 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Añadir contacto
                        </button>
                      )}
                    </div>
                  </AccordionSection>
                </AnimatedMount>
              );
            })()
          }

          {/* ==================== SPIRIT ==================== */}
          {
            activeAreas.includes('consciousness') && (() => {
              const cons = data.consciousness || {};
              const gratitudeToday = cons.gratitude?.[viewDate] || [];
              const journalToday = cons.journal?.[viewDate];
              const breathingToday = cons.breathingSessions?.filter(s => s.date === viewDate).length || 0;
              const practiceToday = cons.practices?.find(p => p.date === viewDate);

              // Path info
              const pathId = cons.activePath;
              const pathPaused = cons.pathPaused;
              const startingLevel = cons.startingLevel || 0;
              const currentLevel = cons.currentLevel || 0;
              const effectiveLevel = startingLevel + currentLevel;

              // Get path details
              const pathsData = {
                hawkins: { name: 'Escala de Conciencia', icon: '⚡', color: '#8B5CF6' },
                maslow: { name: 'Pirámide de Maslow', icon: '🏔️', color: '#10B981' },
                wilber: { name: 'Espiral Dinámica', icon: '🌀', color: '#F59E0B' }
              };
              const activePath = pathId ? pathsData[pathId] : null;

              // Calculate gratitude streak
              const getGratitudeStreak = () => {
                let streak = 0;
                let checkDate = viewDate;
                while (cons.gratitude?.[checkDate]?.some(g => g)) {
                  streak++;
                  const d = new Date(checkDate);
                  d.setDate(d.getDate() - 1);
                  checkDate = d.toISOString().split('T')[0];
                }
                return streak;
              };
              const streak = getGratitudeStreak();

              const completedItems = [
                gratitudeToday?.filter(g => g).length >= 3,
                !!journalToday?.text,
                breathingToday > 0,
                !!practiceToday
              ].filter(Boolean).length;

              // Breathing techniques
              const breathTechniques = {
                '478': { name: '4-7-8', inhale: 4, hold: 7, exhale: 8, holdOut: 0, rounds: 4 },
                'box': { name: 'Box', inhale: 4, hold: 4, exhale: 4, holdOut: 4, rounds: 4 }
              };

              // Save gratitude
              const saveConsGratitude = () => {
                const items = consGratitudeInputs.filter(g => g.trim());
                if (items.length === 0) return;
                setData(prev => ({
                  ...prev,
                  consciousness: {
                    ...prev.consciousness,
                    gratitude: { ...(prev.consciousness?.gratitude || {}), [viewDate]: items }
                  }
                }));
                setConsGratitudeInputs(['', '', '']);
                setConsExpandedCard(null);
                showToast('🙏 Gratitud guardada');
              };

              // Save journal
              const saveConsJournal = () => {
                if (!consJournalText.trim()) return;
                setData(prev => ({
                  ...prev,
                  consciousness: {
                    ...prev.consciousness,
                    journal: { ...(prev.consciousness?.journal || {}), [viewDate]: { text: consJournalText, mood: consJournalMood, timestamp: new Date().toISOString() } }
                  }
                }));
                setConsJournalText('');
                setConsJournalMood(null);
                setConsExpandedCard(null);
                showToast('📔 Reflexión guardada');
              };

              // Complete breathing session
              const completeBreathing = () => {
                setData(prev => ({
                  ...prev,
                  consciousness: {
                    ...prev.consciousness,
                    breathingSessions: [...(prev.consciousness?.breathingSessions || []), { date: viewDate, technique: consBreathTechnique, timestamp: new Date().toISOString() }]
                  }
                }));
                setConsBreathingActive(false);
                setConsBreathPhase('idle');
                setConsBreathTimer(0);
                setConsBreathRound(0);
                setConsExpandedCard(null);
                showToast('🧘 Sesión completada');
              };

              const moods = [
                { id: 'amazing', emoji: '🤩' },
                { id: 'happy', emoji: '😊' },
                { id: 'calm', emoji: '😌' },
                { id: 'meh', emoji: '😐' },
                { id: 'anxious', emoji: '😰' },
                { id: 'sad', emoji: '😢' }
              ];

              const journalPrompts = [
                "¿Qué te hizo sentir vivo hoy?",
                "¿Qué aprendiste de ti mismo?",
                "¿Por qué estás agradecido ahora?"
              ];

              // Hawkins levels for summary display
              const hawkinsLevelNames = [
                { name: 'Vergüenza', calibration: 20 },
                { name: 'Culpa', calibration: 30 },
                { name: 'Apatía', calibration: 50 },
                { name: 'Pena', calibration: 75 },
                { name: 'Miedo', calibration: 100 },
                { name: 'Deseo', calibration: 125 },
                { name: 'Ira', calibration: 150 },
                { name: 'Orgullo', calibration: 175 },
                { name: 'Coraje', calibration: 200 },
                { name: 'Neutralidad', calibration: 250 },
                { name: 'Voluntad', calibration: 310 },
                { name: 'Aceptación', calibration: 350 },
                { name: 'Razón', calibration: 400 },
                { name: 'Amor', calibration: 500 },
                { name: 'Alegría', calibration: 540 },
                { name: 'Paz', calibration: 600 },
                { name: 'Iluminación', calibration: '700+' }
              ];
              const currentLevelData = pathId === 'hawkins' ? hawkinsLevelNames[effectiveLevel] : null;

              return (
                <AnimatedMount delay={185}>
                  <AccordionSection
                    title="CONSCIENCIA"
                    icon={Sparkles}
                    iconColor="text-violet-400"
                    storageKey="consciousness"
                    progress={Math.round((completedItems / 4) * 100)}
                    progressColor="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    summary={
                      activePath && !pathPaused
                        ? `${currentLevelData?.name || 'Nivel ' + (effectiveLevel + 1)} • Cal. ${currentLevelData?.calibration || ''}`
                        : completedItems > 0
                          ? `${completedItems}/4 prácticas`
                          : 'Empieza tu práctica'
                    }
                    summaryRight={streak > 0 ? `🔥 ${streak}` : null}
                  >
                    <div className="mt-2 space-y-2">

                      {/* GRATITUDE - Expandable */}
                      <Card
                        className={`py-2 transition-all ${gratitudeToday?.length >= 3 ? 'border-emerald-500/30' : ''} ${consExpandedCard === 'gratitude' ? 'border-violet-500/50' : ''}`}
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setConsExpandedCard(consExpandedCard === 'gratitude' ? null : 'gratitude')}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${gratitudeToday?.length >= 3 ? 'bg-emerald-500/20' : 'bg-violet-500/20'} flex items-center justify-center`}>
                              <span className="text-lg">🙏</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Gratitud</p>
                              <p className="text-[10px] text-white/40">
                                {gratitudeToday?.length || 0}/3 escritas
                                {streak > 1 && <span className="text-amber-400 ml-2">🔥 {streak}</span>}
                              </p>
                            </div>
                          </div>
                          {gratitudeToday?.length >= 3 ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${consExpandedCard === 'gratitude' ? 'rotate-180' : ''}`} />
                          )}
                        </div>

                        {/* Expanded: Gratitude inputs */}
                        {consExpandedCard === 'gratitude' && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            {gratitudeToday?.length >= 3 ? (
                              <div className="space-y-1">
                                {gratitudeToday.map((g, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                    <span className="text-emerald-400">✓</span>
                                    <span>{g}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <>
                                {consGratitudeInputs.map((input, i) => (
                                  <input
                                    key={i}
                                    type="text"
                                    value={input}
                                    onChange={(e) => {
                                      const newInputs = [...consGratitudeInputs];
                                      newInputs[i] = e.target.value;
                                      setConsGratitudeInputs(newInputs);
                                    }}
                                    placeholder={`${i + 1}. Agradezco...`}
                                    className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm"
                                  />
                                ))}
                                <button
                                  onClick={saveConsGratitude}
                                  disabled={!consGratitudeInputs.some(g => g.trim())}
                                  className="w-full py-2 bg-violet-500 rounded-lg text-sm font-medium disabled:opacity-30"
                                >
                                  Guardar
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </Card>

                      {/* JOURNAL - Expandable */}
                      <Card
                        className={`py-2 transition-all ${journalToday?.text ? 'border-amber-500/30' : ''} ${consExpandedCard === 'journal' ? 'border-violet-500/50' : ''}`}
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setConsExpandedCard(consExpandedCard === 'journal' ? null : 'journal')}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${journalToday?.text ? 'bg-amber-500/20' : 'bg-violet-500/20'} flex items-center justify-center`}>
                              <span className="text-lg">📔</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Reflexión</p>
                              <p className="text-[10px] text-white/40">
                                {journalToday?.text ? `${journalToday.mood ? moods.find(m => m.id === journalToday.mood)?.emoji : ''} Escrito` : 'Reflexiona tu día'}
                              </p>
                            </div>
                          </div>
                          {journalToday?.text ? (
                            <Check className="w-5 h-5 text-amber-400" />
                          ) : (
                            <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${consExpandedCard === 'journal' ? 'rotate-180' : ''}`} />
                          )}
                        </div>

                        {/* Expanded: Journal input */}
                        {consExpandedCard === 'journal' && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                            {journalToday?.text ? (
                              <div className="bg-white/5 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">{moods.find(m => m.id === journalToday.mood)?.emoji}</span>
                                </div>
                                <p className="text-sm text-white/70">{journalToday.text}</p>
                              </div>
                            ) : (
                              <>
                                <div className="bg-violet-500/10 rounded-lg p-2">
                                  <p className="text-xs text-violet-400 italic">
                                    "{journalPrompts[new Date().getDay() % journalPrompts.length]}"
                                  </p>
                                </div>
                                <div className="flex gap-1 justify-center">
                                  {moods.map(mood => (
                                    <button
                                      key={mood.id}
                                      onClick={() => setConsJournalMood(mood.id)}
                                      className={`p-1.5 rounded-lg text-lg transition-all ${consJournalMood === mood.id ? 'bg-violet-500 scale-110' : 'bg-white/5'}`}
                                    >
                                      {mood.emoji}
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  value={consJournalText}
                                  onChange={(e) => setConsJournalText(e.target.value)}
                                  placeholder="Escribe tu reflexión..."
                                  rows={3}
                                  className="w-full bg-white/5 rounded-lg p-3 text-sm resize-none"
                                />
                                <button
                                  onClick={saveConsJournal}
                                  disabled={!consJournalText.trim()}
                                  className="w-full py-2 bg-violet-500 rounded-lg text-sm font-medium disabled:opacity-30"
                                >
                                  Guardar
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </Card>

                      {/* BREATHING - Expandable */}
                      <Card
                        className={`py-2 transition-all ${breathingToday > 0 ? 'border-blue-500/30' : ''} ${consExpandedCard === 'breathing' ? 'border-violet-500/50' : ''}`}
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => !consBreathingActive && setConsExpandedCard(consExpandedCard === 'breathing' ? null : 'breathing')}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${breathingToday > 0 ? 'bg-blue-500/20' : 'bg-violet-500/20'} flex items-center justify-center`}>
                              <span className="text-lg">🧘</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Respiración</p>
                              <p className="text-[10px] text-white/40">
                                {consBreathingActive
                                  ? `${breathTechniques[consBreathTechnique].name} - ${consBreathPhase}`
                                  : breathingToday > 0
                                    ? `${breathingToday} sesión${breathingToday > 1 ? 'es' : ''} hoy`
                                    : 'Calma tu mente'}
                              </p>
                            </div>
                          </div>
                          {breathingToday > 0 && !consBreathingActive ? (
                            <Check className="w-5 h-5 text-blue-400" />
                          ) : (
                            <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${consExpandedCard === 'breathing' ? 'rotate-180' : ''}`} />
                          )}
                        </div>

                        {/* Expanded: Breathing */}
                        {(consExpandedCard === 'breathing' || consBreathingActive) && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            {!consBreathingActive ? (
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  {Object.entries(breathTechniques).map(([id, tech]) => (
                                    <button
                                      key={id}
                                      onClick={() => setConsBreathTechnique(id)}
                                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${consBreathTechnique === id ? 'bg-violet-500' : 'bg-white/10'}`}
                                    >
                                      {tech.name}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  onClick={() => {
                                    setConsBreathingActive(true);
                                    setConsBreathPhase('inhale');
                                    setConsBreathTimer(0);
                                    setConsBreathRound(0);
                                  }}
                                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium"
                                >
                                  Comenzar
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-3 transition-all duration-1000 ${consBreathPhase === 'inhale' ? 'scale-110 bg-blue-500/40' :
                                  consBreathPhase === 'hold' ? 'scale-110 bg-violet-500/40' :
                                    consBreathPhase === 'exhale' ? 'scale-90 bg-cyan-500/40' :
                                      'scale-90 bg-white/10'
                                  }`}>
                                  <div className="text-center">
                                    <p className="text-xs text-white/50 capitalize">{consBreathPhase}</p>
                                    <p className="text-2xl font-bold">{Math.ceil(consBreathTimer)}</p>
                                  </div>
                                </div>
                                <p className="text-xs text-white/40 mb-3">
                                  Ronda {consBreathRound + 1} / {breathTechniques[consBreathTechnique].rounds}
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setConsBreathingActive(false);
                                      setConsBreathPhase('idle');
                                      setConsBreathTimer(0);
                                      setConsBreathRound(0);
                                    }}
                                    className="flex-1 py-2 bg-white/10 rounded-lg text-sm"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={completeBreathing}
                                    className="flex-1 py-2 bg-emerald-500 rounded-lg text-sm font-medium"
                                  >
                                    Completar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>

                      {/* Active Path - Expandable with practice */}
                      {activePath && !pathPaused && (() => {
                        // Hawkins levels data with full content for TodayScreen
                        const hawkinsLevels = [
                          {
                            name: 'Vergüenza', calibration: 20, minimumDays: 14,
                            teaching: 'La vergüenza es el nivel más bajo de consciencia. Aquí sientes que eres fundamentalmente defectuoso, que hay algo mal en tu existencia misma.',
                            signs: ['Evitas mirarte al espejo o en fotos', 'Sientes que no mereces cosas buenas', 'Te escondes de situaciones sociales'],
                            trap: 'Creer que si te escondes lo suficiente, el dolor desaparecerá.',
                            exit: 'Reconocer que la vergüenza es una emoción, no una verdad sobre quién eres.',
                            practice: 'Hoy, cuando notes vergüenza, no huyas. Respira y di: "Esto también es parte de ser humano."',
                            affirmation: 'Tengo derecho a existir, incluso con mis imperfecciones.',
                            journalQuestion: '¿Qué parte de mí he estado escondiendo por vergüenza?'
                          },
                          {
                            name: 'Culpa', calibration: 30, minimumDays: 14,
                            teaching: 'En culpa, ya no te escondes pero te castigas. Crees que mereces sufrir por lo que hiciste o dejaste de hacer.',
                            signs: ['Te disculpas excesivamente', 'Revives errores pasados constantemente', 'Sientes que debes compensar algo'],
                            trap: 'Pensar que sufrir lo suficiente eventualmente te redimirá.',
                            exit: 'Entender que el perdón (especialmente el auto-perdón) es posible.',
                            practice: 'Escribe una carta de perdón a ti mismo por algo que aún te pesa. No tienes que enviarla.',
                            affirmation: 'Merezco perdón, empezando por el mío propio.',
                            journalQuestion: '¿Qué error pasado sigo cargando que ya es hora de soltar?'
                          },
                          {
                            name: 'Apatía', calibration: 50, minimumDays: 14,
                            teaching: 'La apatía es desesperanza cristalizada. Ya no sientes vergüenza ni culpa porque dejaste de intentar.',
                            signs: ['Nada parece importar', 'Dices "¿para qué?" frecuentemente', 'Descuidas tu cuidado personal'],
                            trap: 'La comodidad de no intentar nada para no fallar en nada.',
                            exit: 'Una chispa de deseo, aunque sea pequeña: querer algo.',
                            practice: 'Haz UNA cosa pequeña hoy, aunque no "sientas" hacerla. Lava un plato. Da una vuelta a la manzana.',
                            affirmation: 'Cada pequeño paso cuenta, aunque no lo sienta.',
                            journalQuestion: '¿Qué pequeña cosa me gustaría que fuera diferente?'
                          },
                          {
                            name: 'Pena', calibration: 75, minimumDays: 10,
                            teaching: 'En pena hay energía de nuevo, pero es energía de pérdida. Sientes, y lo que sientes es tristeza.',
                            signs: ['Lloras con facilidad o desearías poder llorar', 'Vives en el pasado', 'Sientes un vacío persistente'],
                            trap: 'Identificarte con tus pérdidas, hacer de la tristeza tu identidad.',
                            exit: 'Permitir la tristeza sin aferrarte a ella. Dejarla fluir.',
                            practice: 'Permite 5 minutos de tristeza consciente. Pon un timer si quieres. Después, nota que sigues aquí.',
                            affirmation: 'Mis pérdidas me han formado, pero no me definen.',
                            journalQuestion: '¿Qué pérdida necesito honrar y comenzar a soltar?'
                          },
                          {
                            name: 'Miedo', calibration: 100, minimumDays: 10,
                            teaching: 'El miedo indica que hay algo que valoras lo suficiente como para temer perderlo. Es energía de supervivencia.',
                            signs: ['Anticipas lo peor constantemente', 'Evitas situaciones por "si acaso"', 'Tu cuerpo está frecuentemente tenso'],
                            trap: 'Organizar tu vida alrededor de evitar lo que temes.',
                            exit: 'Descubrir que puedes sentir miedo y actuar de todos modos.',
                            practice: 'Identifica UN miedo concreto hoy. Pregúntate: "¿Qué haría si no tuviera este miedo?"',
                            affirmation: 'El miedo es información, no una orden.',
                            journalQuestion: '¿Qué haría diferente si no tuviera miedo?'
                          },
                          {
                            name: 'Deseo', calibration: 125, minimumDays: 10,
                            teaching: 'El deseo es la primera energía realmente hacia afuera. Quieres algo. El problema es que crees que eso te completará.',
                            signs: ['Siempre quieres más de algo', 'La satisfacción dura poco', 'Comparas lo que tienes con lo que otros tienen'],
                            trap: 'Creer que el próximo logro/compra/relación finalmente te hará feliz.',
                            exit: 'Distinguir entre deseos del ego y necesidades genuinas.',
                            practice: 'Nota tres deseos que surjan hoy. Por cada uno pregunta: "¿Qué necesidad más profunda hay debajo?"',
                            affirmation: 'Mis deseos me señalan algo, pero no me controlan.',
                            journalQuestion: '¿Qué creo que me falta para estar completo?'
                          },
                          {
                            name: 'Ira', calibration: 150, minimumDays: 10,
                            teaching: 'La ira es poder. Por primera vez tienes energía para cambiar las cosas. El riesgo es destruir en vez de construir.',
                            signs: ['Te frustras fácilmente', 'Culpas a otros de tus problemas', 'Sientes que el mundo es injusto contigo'],
                            trap: 'Quedarte en la queja y el resentimiento sin pasar a la acción constructiva.',
                            exit: 'Canalizar la energía de la ira hacia cambio real, no hacia destrucción.',
                            practice: 'Canaliza la energía de cualquier frustración en algo físico: limpia, ordena, camina rápido.',
                            affirmation: 'Mi ira tiene un mensaje; puedo escucharlo sin ser consumido.',
                            journalQuestion: '¿Qué me está diciendo mi ira que necesita cambiar?'
                          },
                          {
                            name: 'Orgullo', calibration: 175, minimumDays: 10,
                            teaching: 'El orgullo se siente bien comparado con los niveles anteriores. Pero depende de circunstancias externas y de compararte con otros.',
                            signs: ['Necesitas tener razón', 'Te cuesta admitir errores', 'Tu autoestima sube y baja según logros'],
                            trap: 'Basar tu valor en ser "mejor que" otros.',
                            exit: 'Desarrollar autoestima basada en quién eres, no en cómo te comparas.',
                            practice: 'Practica decir "no sé" o "me equivoqué" al menos una vez hoy, genuinamente.',
                            affirmation: 'No necesito tener razón para tener valor.',
                            journalQuestion: '¿En qué área necesito soltar la necesidad de tener razón?'
                          },
                          {
                            name: 'Coraje', calibration: 200, minimumDays: 7,
                            teaching: '¡Felicidades! Cruzaste la línea del 200. Aquí la vida deja de ser algo que te pasa y empieza a ser algo que creas.',
                            signs: ['Tomas responsabilidad de tu vida', 'Ves problemas como desafíos', 'Actúas a pesar del miedo'],
                            trap: 'Forzar resultados, creer que todo depende solo de tu esfuerzo.',
                            exit: 'Combinar acción con aceptación de lo que no controlas.',
                            practice: 'Haz algo que te dé un poco de miedo pero que sabes que es correcto. Empieza pequeño.',
                            affirmation: 'Tengo el poder de cambiar mi vida, un paso a la vez.',
                            journalQuestion: '¿Qué acción he estado postergando por miedo?'
                          },
                          {
                            name: 'Neutralidad', calibration: 250, minimumDays: 7,
                            teaching: 'En neutralidad descubres que puedes estar bien independientemente de las circunstancias. Dejas de necesitar que las cosas sean de cierta manera.',
                            signs: ['Los problemas te afectan menos', 'Eres flexible ante cambios', 'No necesitas controlar todo'],
                            trap: 'Confundir desapego con indiferencia.',
                            exit: 'Mantener preferencias sin convertirlas en exigencias.',
                            practice: 'Ante cada situación hoy, pausa y pregunta: "¿Puedo estar bien sin importar cómo resulte esto?"',
                            affirmation: 'Estoy bien independientemente de las circunstancias.',
                            journalQuestion: '¿A qué resultado estoy demasiado apegado?'
                          },
                          {
                            name: 'Voluntad', calibration: 310, minimumDays: 7,
                            teaching: 'La voluntad es decir SÍ a la vida. No es fuerza de voluntad (eso es coraje), es disponibilidad genuina.',
                            signs: ['Estás abierto a aprender', 'Dices sí más que no', 'La vida fluye más fácilmente'],
                            trap: 'Decir sí a todo sin discernimiento.',
                            exit: 'Desarrollar criterio sobre dónde poner tu energía.',
                            practice: 'Di "sí" genuinamente a algo que normalmente resistirías. Observa qué cambia.',
                            affirmation: 'La vida me apoya cuando yo apoyo a la vida.',
                            journalQuestion: '¿A qué he estado diciendo "no" que podría intentar?'
                          },
                          {
                            name: 'Aceptación', calibration: 350, minimumDays: 7,
                            teaching: 'Aceptación no es resignación. Es trabajar con la realidad tal como es, no como desearías que fuera.',
                            signs: ['No luchas contra lo que es', 'Ves la perfección en la imperfección', 'Perdonas con más facilidad'],
                            trap: 'Usar aceptación como excusa para no actuar.',
                            exit: 'Aceptar Y actuar: trabajar desde donde estás hacia donde quieres ir.',
                            practice: 'Elige una situación difícil y di internamente: "Esto es lo que es. ¿Qué puedo hacer desde aquí?"',
                            affirmation: 'Acepto la realidad tal como es y trabajo desde ahí.',
                            journalQuestion: '¿Qué situación estoy resistiendo que necesito aceptar primero?'
                          },
                          {
                            name: 'Razón', calibration: 400, minimumDays: 7,
                            teaching: 'La razón es el pico del intelecto. Aquí puedes entender sistemas complejos y ver patrones que otros no ven.',
                            signs: ['Analizas las cosas profundamente', 'Valoras datos y lógica', 'Puedes ver múltiples perspectivas'],
                            trap: 'Creer que todo puede entenderse con la mente. Parálisis por análisis.',
                            exit: 'Reconocer los límites del intelecto. Abrirse a otras formas de conocer.',
                            practice: 'Ante un problema, separa hechos de interpretaciones. Lista ambos en columnas separadas.',
                            affirmation: 'Mi mente es una herramienta poderosa al servicio de algo mayor.',
                            journalQuestion: '¿Dónde estoy sobre-analizando en vez de actuar o sentir?'
                          },
                          {
                            name: 'Amor', calibration: 500, minimumDays: 7,
                            teaching: 'Amor incondicional. No es una emoción, es una forma de ver. Ves la esencia detrás de las formas.',
                            signs: ['Sientes conexión con extraños', 'Ves lo mejor en las personas', 'El perdón es natural'],
                            trap: 'Negar el mal o el sufrimiento por querer ver solo amor.',
                            exit: 'Integrar amor con discernimiento. Amar no significa permitir todo.',
                            practice: 'Envía genuinamente buenos deseos a alguien difícil. No por ellos, sino por lo que hace en ti.',
                            affirmation: 'El amor no es algo que busco; es lo que soy cuando dejo de buscar.',
                            journalQuestion: '¿A quién me cuesta amar y qué me enseña eso de mí?'
                          },
                          {
                            name: 'Alegría', calibration: 540, minimumDays: 7,
                            teaching: 'La alegría no depende de nada externo. Es el estado natural cuando dejas de interferir.',
                            signs: ['Sonríes sin razón aparente', 'Todo parece más vivo y brillante', 'La gratitud es constante'],
                            trap: 'Apegarte a la alegría y temerle a perderla.',
                            exit: 'Dejar que la alegría venga y vaya sin aferrarte.',
                            practice: 'Busca la perfección oculta en algo "ordinario" hoy: una taza de café, la luz en una ventana.',
                            affirmation: 'La alegría está disponible ahora, sin condiciones.',
                            journalQuestion: '¿Dónde estoy buscando alegría fuera cuando ya está aquí?'
                          },
                          {
                            name: 'Paz', calibration: 600, minimumDays: 7,
                            teaching: 'La paz trasciende la alegría. No hay nada que lograr, nada que probar. Todo simplemente es.',
                            signs: ['Silencio mental profundo', 'Sensación de completitud', 'El tiempo parece diferente'],
                            trap: 'Quedarse en la paz sin compartirla.',
                            exit: 'Permitir que la paz se exprese a través de ti hacia el mundo.',
                            practice: 'Dedica 10 minutos a no hacer nada. No meditar, no respirar conscientemente. Solo ser.',
                            affirmation: 'La paz no es algo que logro; es lo que queda cuando dejo de luchar.',
                            journalQuestion: '¿Qué pasaría si dejara de esforzarme por un momento?'
                          },
                          {
                            name: 'Iluminación', calibration: '700+', minimumDays: 7,
                            teaching: 'La consciencia pura. No hay separación entre tú y el todo. Extremadamente raro de forma permanente.',
                            signs: ['No hay "yo" separado', 'Todo es percibido como uno', 'Presencia radiante natural'],
                            trap: 'No hay trampa aquí. Pero tampoco hay nadie para quedar atrapado.',
                            exit: 'No hay salida porque no hay lugar adonde ir.',
                            practice: 'Vive este día como si cada momento fuera exactamente como debe ser. Porque lo es.',
                            affirmation: 'Todo es uno. No hay nada que buscar.',
                            journalQuestion: '¿Quién soy cuando dejo de definirme?'
                          }
                        ];

                        const currentLevelData = hawkinsLevels[effectiveLevel] || hawkinsLevels[0];

                        // Calculate days in level
                        const practicesInLevel = (cons.practices || []).filter(p =>
                          p.pathId === pathId && p.levelName === currentLevelData.name
                        );
                        const daysWithPractice = new Set(practicesInLevel.map(p => p.date)).size;
                        const minDays = currentLevelData.minimumDays || 7;

                        // XP calculation
                        const currentXP = cons.currentXP || 0;
                        const xpForNextLevel = 100 * (currentLevel + 1);

                        // Log practice function
                        const logConsPractice = () => {
                          setData(prev => ({
                            ...prev,
                            consciousness: {
                              ...prev.consciousness,
                              practices: [
                                ...(prev.consciousness?.practices || []),
                                {
                                  id: Date.now(),
                                  date: viewDate,
                                  pathId: pathId,
                                  levelName: currentLevelData.name,
                                  practice: currentLevelData.practice,
                                  notes: consPracticeNotes,
                                  xp: 25,
                                  timestamp: new Date().toISOString()
                                }
                              ],
                              totalXP: (prev.consciousness?.totalXP || 0) + 25,
                              currentXP: (prev.consciousness?.currentXP || 0) + 25
                            }
                          }));
                          setConsPracticeNotes('');
                          setConsExpandedCard(null);
                          showToast('⚡ +25 XP - Práctica completada');
                        };

                        return (
                          <Card
                            className={`py-2 border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 transition-all ${consExpandedCard === 'practice' ? 'border-violet-500/50' : ''}`}
                          >
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => setConsExpandedCard(consExpandedCard === 'practice' ? null : 'practice')}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                  <span className="text-lg">{activePath.icon}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{currentLevelData.name}</p>
                                  <p className="text-[10px] text-white/40">
                                    Nivel {effectiveLevel + 1} • Cal. {currentLevelData.calibration}
                                    {practiceToday && <span className="text-emerald-400 ml-2">✓ Hecho</span>}
                                  </p>
                                </div>
                              </div>
                              {practiceToday ? (
                                <Check className="w-5 h-5 text-violet-400" />
                              ) : (
                                <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${consExpandedCard === 'practice' ? 'rotate-180' : ''}`} />
                              )}
                            </div>

                            {/* Expanded: Full level content */}
                            {consExpandedCard === 'practice' && (
                              <div className="mt-3 pt-3 border-t border-white/10 space-y-3">

                                {/* Progress stats */}
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-white/5 rounded-lg p-2 text-center">
                                    <p className="text-lg font-bold">{daysWithPractice}</p>
                                    <p className="text-[10px] text-white/40">días practicando</p>
                                  </div>
                                  <div className="flex-1 bg-white/5 rounded-lg p-2 text-center">
                                    <p className="text-lg font-bold">{minDays}</p>
                                    <p className="text-[10px] text-white/40">mínimo</p>
                                  </div>
                                  <div className="flex-1 bg-white/5 rounded-lg p-2 text-center">
                                    <p className="text-lg font-bold">{currentXP}</p>
                                    <p className="text-[10px] text-white/40">XP</p>
                                  </div>
                                </div>

                                {/* XP Progress bar */}
                                <div>
                                  <div className="flex justify-between text-[10px] text-white/40 mb-1">
                                    <span>Progreso XP</span>
                                    <span>{currentXP}/{xpForNextLevel}</span>
                                  </div>
                                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
                                      style={{ width: `${Math.min(100, (currentXP / xpForNextLevel) * 100)}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Teaching */}
                                <div className="bg-white/5 rounded-lg p-3">
                                  <p className="text-xs text-violet-400 mb-1">📖 Enseñanza</p>
                                  <p className="text-xs text-white/70 leading-relaxed">{currentLevelData.teaching}</p>
                                </div>

                                {/* Signs */}
                                <div className="bg-amber-500/10 rounded-lg p-3">
                                  <p className="text-xs text-amber-400 mb-2">⚡ Señales de este nivel</p>
                                  <div className="space-y-1">
                                    {currentLevelData.signs.map((sign, i) => (
                                      <p key={i} className="text-xs text-white/60 flex items-start gap-2">
                                        <span className="text-amber-400">•</span> {sign}
                                      </p>
                                    ))}
                                  </div>
                                </div>

                                {/* Trap & Exit */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-red-500/10 rounded-lg p-2">
                                    <p className="text-[10px] text-red-400 mb-1">🚫 Trampa</p>
                                    <p className="text-[10px] text-white/60">{currentLevelData.trap}</p>
                                  </div>
                                  <div className="bg-emerald-500/10 rounded-lg p-2">
                                    <p className="text-[10px] text-emerald-400 mb-1">🚪 Salida</p>
                                    <p className="text-[10px] text-white/60">{currentLevelData.exit}</p>
                                  </div>
                                </div>

                                {/* Journal Question */}
                                <div className="bg-cyan-500/10 rounded-lg p-3">
                                  <p className="text-xs text-cyan-400 mb-1">💭 Pregunta de reflexión</p>
                                  <p className="text-sm italic text-white/70">"{currentLevelData.journalQuestion}"</p>
                                </div>

                                {/* Practice section */}
                                {practiceToday ? (
                                  <div className="bg-emerald-500/10 rounded-lg p-3">
                                    <p className="text-xs text-emerald-400 mb-1">✓ Práctica completada hoy</p>
                                    <p className="text-xs text-white/60">{practiceToday.practice}</p>
                                    {practiceToday.notes && (
                                      <p className="text-xs text-white/40 mt-2 italic">"{practiceToday.notes}"</p>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    <div className="bg-violet-500/10 rounded-lg p-3">
                                      <p className="text-xs text-violet-400 mb-1">🎯 Práctica del día</p>
                                      <p className="text-sm text-white/80">{currentLevelData.practice}</p>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-2">
                                      <p className="text-xs italic text-white/50">"{currentLevelData.affirmation}"</p>
                                    </div>

                                    <textarea
                                      value={consPracticeNotes}
                                      onChange={(e) => setConsPracticeNotes(e.target.value)}
                                      placeholder="Notas sobre tu práctica (opcional)..."
                                      rows={2}
                                      className="w-full bg-white/5 rounded-lg p-2 text-sm resize-none"
                                    />

                                    <button
                                      onClick={logConsPractice}
                                      className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg text-sm font-medium"
                                    >
                                      Completar práctica (+25 XP)
                                    </button>
                                  </>
                                )}

                                {/* Link to full screen */}
                                <button
                                  onClick={() => setScreen('consciousness')}
                                  className="w-full py-1.5 text-xs text-violet-400 hover:text-violet-300"
                                >
                                  Ver camino completo →
                                </button>
                              </div>
                            )}
                          </Card>
                        );
                      })()}

                      {/* Quick link to start path if none active */}
                      {!activePath && (
                        <button
                          onClick={() => setScreen('consciousness')}
                          className="w-full py-2 bg-violet-500/20 border border-violet-500/30 rounded-lg text-sm text-violet-400"
                        >
                          + Comenzar un camino de consciencia
                        </button>
                      )}
                    </div>
                  </AccordionSection>
                </AnimatedMount>
              );
            })()
          }

          {/* Year Overview - 365 days calendar - at the end for reflection */}
          <AnimatedMount delay={195}>
            {(() => {
              const yearStart = new Date(calendarYear, 0, 1);
              const todayDate = new Date(getToday());
              const viewingDate = new Date(viewDate);
              const thisYear = new Date().getFullYear();

              const dayOfYear = calendarYear === viewingDate.getFullYear()
                ? Math.floor((viewingDate - yearStart) / (1000 * 60 * 60 * 24)) + 1
                : null;
              const totalDays = ((calendarYear % 4 === 0 && calendarYear % 100 !== 0) || calendarYear % 400 === 0) ? 366 : 365;

              const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
              const monthData = months.map((name, monthIndex) => {
                const daysInMonth = new Date(calendarYear, monthIndex + 1, 0).getDate();
                const days = [];

                for (let d = 1; d <= daysInMonth; d++) {
                  const date = new Date(calendarYear, monthIndex, d);
                  const dateStr = date.toISOString().split('T')[0];

                  if (date <= todayDate) {
                    const dayInfo = data.days[dateStr];
                    const dayHabitsData = data.habitLogs?.filter(l => l.date === dateStr) || [];
                    const dayMealsData = data.meals.filter(m => m.day_id === dateStr);
                    const dayTasksData = data.tasks.filter(t => t.day_id === dateStr);
                    const dayWorkoutData = (data.workouts || []).find(w => w.day_id === dateStr);
                    const score = calculateDayScore(dayInfo, dayHabitsData, dayMealsData, dayTasksData, dayWorkoutData, data.user.goals);
                    days.push({ day: d, date: dateStr, score, hasData: score > 0 });
                  } else {
                    days.push({ day: d, date: dateStr, score: 0, hasData: false, isFuture: true });
                  }
                }

                const daysWithData = days.filter(d => d.hasData);
                const avgScore = daysWithData.length > 0 ? Math.round(daysWithData.reduce((s, d) => s + d.score, 0) / daysWithData.length) : 0;

                return { name, monthIndex, days, daysInMonth, avgScore, daysWithData: daysWithData.length };
              });

              const allDaysWithData = monthData.flatMap(m => m.days.filter(d => d.hasData));
              const avgScore = allDaysWithData.length > 0 ? Math.round(allDaysWithData.reduce((s, d) => s + d.score, 0) / allDaysWithData.length) : 0;
              const goodDays = allDaysWithData.filter(d => d.score >= 60).length;
              const perfectDays = allDaysWithData.filter(d => d.score >= 80).length;

              const getScoreColor = (score) => {
                if (score >= 90) return 'bg-emerald-400';
                if (score >= 80) return 'bg-emerald-500';
                if (score >= 70) return 'bg-lime-400';
                if (score >= 60) return 'bg-lime-500';
                if (score >= 50) return 'bg-yellow-400';
                if (score >= 40) return 'bg-amber-400';
                if (score >= 30) return 'bg-amber-500';
                if (score >= 20) return 'bg-orange-400';
                if (score >= 10) return 'bg-orange-500';
                return 'bg-red-500';
              };

              const currentMonth = calendarYear === thisYear ? new Date().getMonth() : -1;
              const viewingMonth = calendarYear === viewingDate.getFullYear() ? viewingDate.getMonth() : -1;

              return (
                <Card className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setCalendarYear(calendarYear - 1)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
                    </button>
                    <div className="text-center flex items-center gap-2">
                      <span className="text-xs font-medium text-white/70">📅 Tu año {calendarYear}</span>
                      {dayOfYear && (
                        <span className="text-[9px] text-white/30">día {dayOfYear}/{totalDays}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setCalendarYear(calendarYear + 1)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                    </button>
                  </div>

                  <div className="space-y-1.5 overflow-x-auto">
                    {monthData.map((month, i) => {
                      const isCurrentMonth = i === currentMonth;
                      const isViewingMonth = i === viewingMonth;

                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span className={`text-[11px] w-8 flex-shrink-0 ${isCurrentMonth ? 'text-violet-400 font-bold' : isViewingMonth ? 'text-white font-medium' : 'text-white/50'}`}>
                            {month.name}
                          </span>
                          <div className="flex items-center gap-[2px] flex-shrink-0">
                            {month.days.map((day, di) => {
                              const isViewing = day.date === viewDate;
                              const isToday = day.date === getToday();

                              return (
                                <div
                                  key={di}
                                  onClick={() => setViewDate(day.date)}
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: day.isFuture ? '#6b7280' : !day.hasData ? '#9ca3af' : undefined,
                                    boxShadow: isViewing ? '0 0 0 1.5px white' : isToday ? '0 0 0 1.5px #a78bfa' : undefined
                                  }}
                                  className={`cursor-pointer flex-shrink-0 ${!day.isFuture && day.hasData ? getScoreColor(day.score) : ''
                                    }`}
                                  title={`${day.day} ${month.name}: ${day.score} pts`}
                                />
                              );
                            })}
                          </div>
                          <span className={`text-[11px] ml-auto flex-shrink-0 font-medium ${month.avgScore >= 70 ? 'text-emerald-400' :
                            month.avgScore >= 50 ? 'text-amber-400' :
                              month.avgScore > 0 ? 'text-red-400' : 'text-white/30'
                            }`}>
                            {month.avgScore > 0 ? month.avgScore : '-'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1 text-[8px] text-white/40">
                      <span>0</span>
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-lime-500" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>100</span>
                    </div>
                    <div className="text-[9px] text-white/50">
                      {allDaysWithData.length > 0 ? (
                        <>
                          <span className="text-emerald-400">{perfectDays}</span> 💎 · <span className="text-lime-400">{goodDays}</span> ✓ · x̄ {avgScore}
                        </>
                      ) : (
                        <span>Sin datos</span>
                      )}
                    </div>
                  </div>

                  <p className="text-[8px] text-white/30 text-right mt-1">💎 perfectos (80+) · ✓ buenos (60+) · x̄ media</p>
                </Card>
              );
            })()}
          </AnimatedMount>

          {/* Cierre del día - Evening Review */}
          <AnimatedMount delay={200}>
            <Card
              onClick={() => setShowJournal(true)}
              className={`bg-gradient-to-r ${dayJournal ? 'from-amber-500/20 to-orange-500/20 border-amber-500/30' : 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${dayJournal ? 'bg-amber-500/20' : 'bg-indigo-500/20'} flex items-center justify-center`}>
                    <Moon className={`w-5 h-5 ${dayJournal ? 'text-amber-400' : 'text-indigo-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium">Cierre del día</p>
                    <p className="text-sm text-white/50">
                      {dayJournal
                        ? `${['', '😫', '😔', '😐', '🙂', '😄'][dayJournal.mood || 3]} Completado`
                        : 'Reflexiona y prepara mañana'}
                    </p>
                  </div>
                </div>
                {dayJournal ? (
                  <Check className="w-5 h-5 text-amber-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/30" />
                )}
              </div>
              {dayJournal && dayJournal.wins && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-1">Wins de hoy:</p>
                  <p className="text-sm text-white/70 line-clamp-1">
                    {Array.isArray(dayJournal.wins)
                      ? dayJournal.wins.filter(w => w).join(' • ')
                      : dayJournal.wins}
                  </p>
                </div>
              )}
            </Card>
          </AnimatedMount>

          {/* Quick Add FAB */}
        </>
      )}

      {/* Quick Add FAB */}
      {
        isViewingToday && viewMode === 'day' && (
          <button
            onClick={() => setShowQuickAdd(true)}
            className="fixed bottom-28 right-6 w-14 h-14 bg-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 hover:bg-violet-600 transition-colors z-40"
          >
            <Plus className="w-6 h-6" />
          </button>
        )
      }

      {/* Modals */}
      <Modal isOpen={showSleep} onClose={() => setShowSleep(false)} title="Registrar sueño">
        <SleepInput
          hours={dayData.sleep_hours}
          quality={dayData.sleep_quality}
          onSave={(data) => {
            updateDay({ sleep_hours: data.hours, sleep_quality: data.quality });
            setShowSleep(false);
            showToast('Sueño registrado');
          }}
        />
      </Modal>

      <Modal isOpen={showFocus} onClose={() => setShowFocus(false)} title="Foco del día">
        <textarea
          value={focusNote}
          onChange={(e) => setFocusNote(e.target.value)}
          placeholder="¿Cuál es tu prioridad principal hoy?"
          rows={3}
          className="w-full bg-white/10 rounded-xl p-4 outline-none resize-none"
          autoFocus
        />
        <button
          onClick={() => {
            updateDay({ focus_note: focusNote });
            setShowFocus(false);
            showToast('Foco guardado');
          }}
          className="w-full bg-violet-500 py-4 rounded-xl font-medium"
        >
          Guardar
        </button>
      </Modal>

      <Modal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
        title="Cierre del día"
        footer={
          <button onClick={saveJournal} className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 py-4 rounded-xl font-medium">
            Guardar cierre del día
          </button>
        }
      >
        <div className="space-y-5">
          {/* Mood & Energy */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/60 mb-2">¿Cómo te sientes?</p>
              <MoodSelector value={journalData.mood} onChange={(m) => setJournalData(j => ({ ...j, mood: m }))} />
            </div>
            <div>
              <p className="text-sm text-white/60 mb-2">Nivel de energía</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setJournalData(j => ({ ...j, energy: level }))}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all ${journalData.energy >= level
                      ? 'bg-yellow-500 text-black'
                      : 'bg-white/10 text-white/40'
                      }`}
                  >
                    ⚡
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Wins */}
          <div>
            <p className="text-sm text-white/60 mb-2">🏆 3 Victorias de hoy</p>
            <p className="text-xs text-white/40 mb-2">¿Qué salió bien? Celebra tus logros.</p>
            <div className="space-y-2">
              {[0, 1, 2].map(i => (
                <input
                  key={i}
                  type="text"
                  value={Array.isArray(journalData.wins) ? journalData.wins[i] || '' : ''}
                  onChange={(e) => {
                    const newWins = Array.isArray(journalData.wins) ? [...journalData.wins] : ['', '', ''];
                    newWins[i] = e.target.value;
                    setJournalData(j => ({ ...j, wins: newWins }));
                  }}
                  placeholder={`Victoria ${i + 1}`}
                  className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm"
                />
              ))}
            </div>
          </div>

          {/* Gratitud */}
          <div>
            <p className="text-sm text-white/60 mb-2">🙏 Gratitud</p>
            <textarea
              value={journalData.gratitude}
              onChange={(e) => setJournalData(j => ({ ...j, gratitude: e.target.value }))}
              placeholder="¿Por qué estás agradecido hoy?"
              rows={2}
              className="w-full bg-white/10 rounded-xl p-3 outline-none resize-none text-sm"
            />
          </div>

          {/* Aprendizaje */}
          <div>
            <p className="text-sm text-white/60 mb-2">💡 Aprendizaje del día</p>
            <textarea
              value={journalData.learning}
              onChange={(e) => setJournalData(j => ({ ...j, learning: e.target.value }))}
              placeholder="¿Qué has aprendido? ¿Qué harías diferente?"
              rows={2}
              className="w-full bg-white/10 rounded-xl p-3 outline-none resize-none text-sm"
            />
          </div>

          {/* Top 3 para mañana */}
          <div>
            <p className="text-sm text-white/60 mb-2">🎯 Top 3 para mañana</p>
            <p className="text-xs text-white/40 mb-2">Las 3 cosas más importantes que harás.</p>
            <div className="space-y-2">
              {[0, 1, 2].map(i => (
                <input
                  key={i}
                  type="text"
                  value={Array.isArray(journalData.tomorrow) ? journalData.tomorrow[i] || '' : ''}
                  onChange={(e) => {
                    const newTomorrow = Array.isArray(journalData.tomorrow) ? [...journalData.tomorrow] : ['', '', ''];
                    newTomorrow[i] = e.target.value;
                    setJournalData(j => ({ ...j, tomorrow: newTomorrow }));
                  }}
                  placeholder={`Prioridad ${i + 1}`}
                  className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm"
                />
              ))}
            </div>
          </div>

          {/* Reflexión libre */}
          <div>
            <p className="text-sm text-white/60 mb-2">📝 Reflexión libre</p>
            <textarea
              value={journalData.reflection}
              onChange={(e) => setJournalData(j => ({ ...j, reflection: e.target.value }))}
              placeholder="Pensamientos, ideas, notas..."
              rows={3}
              className="w-full bg-white/10 rounded-xl p-3 outline-none resize-none text-sm"
            />
          </div>
        </div>
      </Modal>

      <Modal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} title="Añadir rápido">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setShowQuickAdd(false); setScreen('meals'); }}
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10"
          >
            <Utensils className="w-8 h-8 text-orange-400" />
            <span>Comida</span>
          </button>
          <button
            onClick={() => { setShowQuickAdd(false); setScreen('workout'); }}
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10"
          >
            <Dumbbell className="w-8 h-8 text-violet-400" />
            <span>Entreno</span>
          </button>
          <button
            onClick={() => { setShowQuickAdd(false); setScreen('habits'); }}
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10"
          >
            <CheckSquare className="w-8 h-8 text-emerald-400" />
            <span>Hábito</span>
          </button>
          <button
            onClick={() => { setShowQuickAdd(false); setScreen('work'); }}
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10"
          >
            <Target className="w-8 h-8 text-blue-400" />
            <span>Tarea</span>
          </button>
        </div>
      </Modal>

      {/* Add Meal Modal - Full functionality with tabs */}
      <Modal isOpen={showAddMeal} onClose={() => { setShowAddMeal(false); setSelectedFood(null); setMealSearchQuery(''); setMealAddMode('search'); setNewFood({ name: '', serving: '100g', calories: '', protein: '', carbs: '', fats: '', barcode: '', category: 'other' }); setShowCreateFromScan(false); setScannedBarcode(''); }} title={selectedFood ? "Configurar porción" : "Añadir comida"}>
        {selectedFood ? (
          /* Food configuration view */
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4">
              <p className="font-bold text-lg">{selectedFood.name}</p>
              <p className="text-sm text-white/50">{selectedFood.serving}</p>
            </div>

            {/* Meal type selector */}
            <div className="flex gap-2">
              {visibleMealTypes.map(m => (
                <button
                  key={m.type}
                  onClick={() => setSelectedMealType(m.type)}
                  className={`flex-1 py-2 rounded-lg text-xl ${selectedMealType === m.type ? 'bg-orange-500' : 'bg-white/10'}`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setMealServings(Math.max(0.25, mealServings - 0.25))}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold"
              >-</button>
              <div className="text-center">
                <input
                  type="number"
                  value={mealServings}
                  onChange={(e) => setMealServings(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-16 text-3xl font-bold bg-transparent text-center outline-none"
                  step="0.25"
                />
                <p className="text-xs text-white/40">{selectedFood.serving}</p>
              </div>
              <button
                onClick={() => setMealServings(mealServings + 0.25)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold"
              >+</button>
            </div>

            {/* Calculated nutrition */}
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">{Math.round(selectedFood.calories * mealServings)} kcal</p>
              <div className="flex justify-center gap-4 mt-2 text-sm">
                <span className="text-emerald-400">P: {Math.round(selectedFood.protein * mealServings)}g</span>
                <span className="text-blue-400">C: {Math.round(selectedFood.carbs * mealServings)}g</span>
                <span className="text-amber-400">G: {Math.round(selectedFood.fats * mealServings)}g</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFood(null)}
                className="flex-1 py-3 bg-white/10 rounded-xl"
              >Cambiar</button>
              <button
                onClick={() => {
                  const meal = {
                    id: generateId(),
                    day_id: viewDate,
                    meal_type: selectedMealType,
                    name: selectedFood.name,
                    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                    calories: Math.round(selectedFood.calories * mealServings),
                    protein: Math.round(selectedFood.protein * mealServings),
                    carbs: Math.round(selectedFood.carbs * mealServings),
                    fats: Math.round(selectedFood.fats * mealServings)
                  };
                  setData(prev => ({ ...prev, meals: [...prev.meals, meal] }));
                  setSelectedFood(null);
                  setShowAddMeal(false);
                  setMealServings(1);
                  showToast('Comida añadida');
                }}
                className="flex-1 py-3 bg-orange-500 rounded-xl font-medium"
              >Añadir</button>
            </div>
          </div>
        ) : (
          /* Search/Scan/Manual view */
          <div className="space-y-4">
            {/* Mode tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setMealAddMode('search')}
                className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${mealAddMode === 'search' ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
              <button
                onClick={() => setMealAddMode('scan')}
                className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${mealAddMode === 'scan' ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <Camera className="w-4 h-4" />
                Escanear
              </button>
              <button
                onClick={() => setMealAddMode('new')}
                className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${mealAddMode === 'new' ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <Plus className="w-4 h-4" />
                Nuevo
              </button>
            </div>

            {/* Meal type selector */}
            <div className="flex gap-2">
              {visibleMealTypes.map(m => (
                <button
                  key={m.type}
                  onClick={() => setSelectedMealType(m.type)}
                  className={`flex-1 py-2 rounded-lg text-xl ${selectedMealType === m.type ? 'bg-orange-500' : 'bg-white/10'}`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>

            {mealAddMode === 'search' && (
              <>
                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar alimento..."
                    value={mealSearchQuery}
                    onChange={(e) => setMealSearchQuery(e.target.value)}
                    className="w-full bg-white/10 rounded-xl p-4 pl-12 outline-none"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                </div>

                {/* Category filters */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {FOOD_CATEGORIES.slice(0, 6).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setMealCategory(mealCategory === cat.id ? 'all' : cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${mealCategory === cat.id ? 'bg-orange-500' : 'bg-white/10'}`}
                    >
                      {cat.emoji}
                    </button>
                  ))}
                </div>

                {/* Search results */}
                <div className="max-h-52 overflow-y-auto space-y-2">
                  {allFoods
                    .filter(food => {
                      const matchesQuery = !mealSearchQuery || food.name.toLowerCase().includes(mealSearchQuery.toLowerCase());
                      const matchesCategory = mealCategory === 'all' || food.category === mealCategory;
                      return matchesQuery && matchesCategory;
                    })
                    .slice(0, 15)
                    .map(food => (
                      <button
                        key={food.id}
                        onClick={() => { setSelectedFood(food); setMealServings(1); }}
                        className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 text-left"
                      >
                        <div>
                          <p className="font-medium text-sm">{food.name}</p>
                          <p className="text-xs text-white/40">{food.serving} {food.isCustom && <span className="text-violet-400">• Tuyo</span>}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-400">{food.calories}</p>
                          <p className="text-[10px] text-white/40">kcal</p>
                        </div>
                      </button>
                    ))
                  }
                </div>
              </>
            )}

            {mealAddMode === 'scan' && (
              <div className="space-y-4">
                <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="w-48 h-32 border-2 border-orange-500/50 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
                  </div>
                  <p className="absolute bottom-2 text-xs text-white/40">Cámara no disponible en preview</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Introduce código de barras..."
                    value={scannedBarcode}
                    onChange={(e) => setScannedBarcode(e.target.value)}
                    className="flex-1 bg-white/10 rounded-xl p-3 outline-none"
                  />
                  <button
                    onClick={() => {
                      const found = allFoods.find(f => f.barcode === scannedBarcode);
                      if (found) {
                        setSelectedFood(found);
                        setMealServings(1);
                        showToast(`Encontrado: ${found.name}`);
                        setScannedBarcode('');
                      } else {
                        // Not found - offer to create new
                        setNewFood(prev => ({ ...prev, barcode: scannedBarcode }));
                        setShowCreateFromScan(true);
                      }
                    }}
                    disabled={!scannedBarcode}
                    className="px-4 bg-orange-500 rounded-xl font-medium disabled:opacity-50"
                  >
                    Buscar
                  </button>
                </div>

                {/* Create new from scan prompt */}
                {showCreateFromScan && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                    <p className="text-sm text-amber-200 mb-2">Código no encontrado: {newFood.barcode}</p>
                    <button
                      onClick={() => {
                        setMealAddMode('new');
                        setShowCreateFromScan(false);
                      }}
                      className="w-full py-2 bg-amber-500 rounded-lg text-sm font-medium"
                    >
                      Crear alimento nuevo con este código
                    </button>
                  </div>
                )}

                <div>
                  <p className="text-xs text-white/40 mb-2">Códigos de ejemplo:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { code: '8410000000001', name: 'Pollo' },
                      { code: '8410000000023', name: 'Yogur' },
                      { code: '8410000000045', name: 'Avena' }
                    ].map(item => (
                      <button
                        key={item.code}
                        onClick={() => {
                          const found = allFoods.find(f => f.barcode === item.code);
                          if (found) {
                            setSelectedFood(found);
                            setMealServings(1);
                          }
                        }}
                        className="px-3 py-1.5 bg-white/5 rounded-lg text-xs hover:bg-white/10"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mealAddMode === 'new' && (
              <div className="space-y-3">
                <p className="text-xs text-white/50">Crear nuevo alimento en tu base de datos</p>

                <input
                  type="text"
                  placeholder="Nombre del alimento *"
                  value={newFood.name}
                  onChange={(e) => setNewFood(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/10 rounded-xl p-4 outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Porción (ej: 100g)"
                    value={newFood.serving}
                    onChange={(e) => setNewFood(p => ({ ...p, serving: e.target.value }))}
                    className="bg-white/10 rounded-xl p-3 outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Código barras (opc)"
                    value={newFood.barcode}
                    onChange={(e) => setNewFood(p => ({ ...p, barcode: e.target.value }))}
                    className="bg-white/10 rounded-xl p-3 outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-white/40 mb-1">Calorías *</p>
                    <input
                      type="number"
                      placeholder="0"
                      value={newFood.calories}
                      onChange={(e) => setNewFood(p => ({ ...p, calories: e.target.value }))}
                      className="w-full bg-transparent outline-none text-xl font-bold"
                    />
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-emerald-400 mb-1">Proteína (g)</p>
                    <input
                      type="number"
                      placeholder="0"
                      value={newFood.protein}
                      onChange={(e) => setNewFood(p => ({ ...p, protein: e.target.value }))}
                      className="w-full bg-transparent outline-none text-xl font-bold"
                    />
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-blue-400 mb-1">Carbs (g)</p>
                    <input
                      type="number"
                      placeholder="0"
                      value={newFood.carbs}
                      onChange={(e) => setNewFood(p => ({ ...p, carbs: e.target.value }))}
                      className="w-full bg-transparent outline-none text-xl font-bold"
                    />
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-amber-400 mb-1">Grasas (g)</p>
                    <input
                      type="number"
                      placeholder="0"
                      value={newFood.fats}
                      onChange={(e) => setNewFood(p => ({ ...p, fats: e.target.value }))}
                      className="w-full bg-transparent outline-none text-xl font-bold"
                    />
                  </div>
                </div>

                {/* Category selector */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {FOOD_CATEGORIES.slice(0, 6).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setNewFood(p => ({ ...p, category: cat.id }))}
                      className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${newFood.category === cat.id ? 'bg-orange-500' : 'bg-white/10'}`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (!newFood.name || !newFood.calories) return;

                    // Create new food in database
                    const foodItem = {
                      id: `custom_${generateId()}`,
                      name: newFood.name,
                      serving: newFood.serving || '100g',
                      calories: parseInt(newFood.calories) || 0,
                      protein: parseInt(newFood.protein) || 0,
                      carbs: parseInt(newFood.carbs) || 0,
                      fats: parseInt(newFood.fats) || 0,
                      category: newFood.category || 'other',
                      barcode: newFood.barcode || null,
                      isCustom: true
                    };

                    // Also create meal entry
                    const meal = {
                      id: generateId(),
                      day_id: viewDate,
                      meal_type: selectedMealType,
                      name: foodItem.name,
                      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                      calories: foodItem.calories,
                      protein: foodItem.protein,
                      carbs: foodItem.carbs,
                      fats: foodItem.fats
                    };

                    setData(prev => ({
                      ...prev,
                      customFoods: [...(prev.customFoods || []), foodItem],
                      meals: [...prev.meals, meal]
                    }));

                    setNewFood({ name: '', serving: '100g', calories: '', protein: '', carbs: '', fats: '', barcode: '', category: 'other' });
                    setShowAddMeal(false);
                    setShowCreateFromScan(false);
                    showToast('Alimento creado y registrado');
                  }}
                  disabled={!newFood.name || !newFood.calories}
                  className={`w-full py-4 rounded-xl font-medium ${newFood.name && newFood.calories ? 'bg-orange-500' : 'bg-white/10 text-white/30'}`}
                >
                  Crear y registrar
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div >
  );
};


// ============================================================================
// MEALS SCREEN
// ============================================================================


export default TodayScreen;
