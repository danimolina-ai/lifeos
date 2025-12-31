// MealsScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo } from 'react';
import { Utensils, Plus, Check, ChevronRight, ChevronLeft, Edit3, Trash2, Search, Camera, Zap, Target, Star, Clock, Copy, BookOpen, Calendar, MoreHorizontal, ChevronDown } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { FOOD_DATABASE, FOOD_CATEGORIES } from '../data/foodDatabase';
import { Card, Modal, AnimatedMount, ProgressBar, EmptyState, MiniChart } from '../components/ui';

const MealsScreen = ({ data, setData, showToast }) => {
  const today = getToday();

  // Views: diary, search, saved, history, insights, planner
  const [view, setView] = useState('diary');
  const [showAdd, setShowAdd] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFoodDetail, setShowFoodDetail] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [activeMealType, setActiveMealType] = useState('lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [scannedBarcode, setScannedBarcode] = useState('');

  // New: Food selection flow states
  const [selectedFood, setSelectedFood] = useState(null); // Food being configured before adding
  const [servingQuantity, setServingQuantity] = useState(1);
  const [addMode, setAddMode] = useState('search'); // 'search', 'manual', 'scan'

  // New: Multi-day planning states
  const [showPlanner, setShowPlanner] = useState(false);
  const [plannedDays, setPlannedDays] = useState([]);

  // Camera/Scanner state
  const [cameraStream, setCameraStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  // New meal state
  const [newMeal, setNewMeal] = useState({
    meal_type: 'lunch',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber: '',
    sodium: '',
    sugar: ''
  });

  // Quick add state
  const [quickAdd, setQuickAdd] = useState({ calories: '', protein: '', carbs: '', fats: '' });

  // Settings
  const [localGoals, setLocalGoals] = useState({
    calories: data.user.goals?.calories || 2200,
    protein: data.user.goals?.protein || 180,
    carbs: data.user.goals?.carbs || 250,
    fats: data.user.goals?.fats || 70,
    fiber: data.user.goals?.fiber || 30,
    water: data.user.goals?.water || 8,
    mealMode: data.user.goals?.mealMode || 'separate', // 'separate' or 'single'
    mealSlots: data.user.goals?.mealSlots || ['breakfast', 'lunch', 'snack', 'dinner'],
    caloriesPerMeal: data.user.goals?.caloriesPerMeal || {
      breakfast: 500,
      lunch: 700,
      snack: 300,
      dinner: 700
    }
  });

  // All possible meal types
  const allMealTypes = [
    { type: 'breakfast', label: 'Desayuno', emoji: '🌅', icon: Coffee, time: '07:00 - 10:00' },
    { type: 'lunch', label: 'Comida', emoji: '☀️', icon: Sun, time: '12:00 - 15:00' },
    { type: 'snack', label: 'Snack', emoji: '🍎', icon: Coffee, time: 'Entre comidas' },
    { type: 'dinner', label: 'Cena', emoji: '🌙', icon: Moon, time: '19:00 - 22:00' }
  ];

  // Active meal types based on settings
  const mealTypes = localGoals.mealMode === 'single'
    ? [{ type: 'all', label: 'Todas las comidas', emoji: '🍽️', icon: Utensils, time: 'Todo el día' }]
    : allMealTypes.filter(m => localGoals.mealSlots.includes(m.type));

  // Get today's meals
  const meals = data.meals.filter(m => m.day_id === today);

  // Calculations
  const totalCals = meals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProt = meals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalCarbs = meals.reduce((s, m) => s + (m.carbs || 0), 0);
  const totalFats = meals.reduce((s, m) => s + (m.fats || 0), 0);
  const totalFiber = meals.reduce((s, m) => s + (m.fiber || 0), 0);

  const remainingCals = localGoals.calories - totalCals;
  const remainingProt = localGoals.protein - totalProt;
  const remainingCarbs = localGoals.carbs - totalCarbs;
  const remainingFats = localGoals.fats - totalFats;

  // Macro percentages for pie chart
  const totalMacrosCals = (totalProt * 4) + (totalCarbs * 4) + (totalFats * 9);
  const protPercent = totalMacrosCals > 0 ? Math.round((totalProt * 4 / totalMacrosCals) * 100) : 0;
  const carbsPercent = totalMacrosCals > 0 ? Math.round((totalCarbs * 4 / totalMacrosCals) * 100) : 0;
  const fatsPercent = totalMacrosCals > 0 ? Math.round((totalFats * 9 / totalMacrosCals) * 100) : 0;

  // Logging streak
  const getLoggingStreak = () => {
    let streak = 0;
    let checkDate = today;
    while (true) {
      const dayMeals = data.meals.filter(m => m.day_id === checkDate);
      if (dayMeals.length === 0) break;
      streak++;
      checkDate = getDateOffset(checkDate, -1);
    }
    return streak;
  };
  const loggingStreak = getLoggingStreak();

  // Saved meals (meals marked as favorite or frequently used)
  const savedMeals = data.savedMeals || [];

  // Recent foods (last 10 unique foods)
  const recentFoods = useMemo(() => {
    const seen = new Set();
    return data.meals
      .filter(m => m.name)
      .reverse()
      .filter(m => {
        if (seen.has(m.name.toLowerCase())) return false;
        seen.add(m.name.toLowerCase());
        return true;
      })
      .slice(0, 10);
  }, [data.meals]);

  // Frequent foods (most logged)
  const frequentFoods = useMemo(() => {
    const counts = {};
    data.meals.forEach(m => {
      if (m.name) {
        const key = m.name.toLowerCase();
        counts[key] = counts[key] || { ...m, count: 0 };
        counts[key].count++;
      }
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [data.meals]);

  // Water tracking
  const dayData = data.days[today] || {};
  const waterGlasses = dayData.water_glasses || 0;

  const addWater = () => {
    setData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [today]: { ...prev.days[today], water_glasses: (prev.days[today]?.water_glasses || 0) + 1 }
      }
    }));
  };

  const removeWater = () => {
    if (waterGlasses <= 0) return;
    setData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [today]: { ...prev.days[today], water_glasses: Math.max(0, (prev.days[today]?.water_glasses || 0) - 1) }
      }
    }));
  };

  // Handlers
  const saveSettings = () => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, goals: { ...prev.user.goals, ...localGoals } }
    }));
    setShowSettings(false);
    showToast('Objetivos actualizados');
  };

  const saveMeal = () => {
    if (!newMeal.name) return;
    const meal = {
      id: generateId(),
      day_id: today,
      ...newMeal,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      calories: parseInt(newMeal.calories) || 0,
      protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0,
      fats: parseInt(newMeal.fats) || 0,
      fiber: parseInt(newMeal.fiber) || 0,
      sodium: parseInt(newMeal.sodium) || 0,
      sugar: parseInt(newMeal.sugar) || 0
    };
    setData(prev => ({ ...prev, meals: [...prev.meals, meal] }));
    setShowAdd(false);
    setNewMeal({ meal_type: 'lunch', name: '', calories: '', protein: '', carbs: '', fats: '', fiber: '', sodium: '', sugar: '' });
    showToast('Comida añadida');
  };

  const saveQuickAdd = () => {
    if (!quickAdd.calories && !quickAdd.protein && !quickAdd.carbs && !quickAdd.fats) return;

    // Auto-calculate calories if only macros provided
    let cals = parseInt(quickAdd.calories) || 0;
    const prot = parseInt(quickAdd.protein) || 0;
    const carb = parseInt(quickAdd.carbs) || 0;
    const fat = parseInt(quickAdd.fats) || 0;

    if (cals === 0 && (prot || carb || fat)) {
      cals = (prot * 4) + (carb * 4) + (fat * 9);
    }

    const meal = {
      id: generateId(),
      day_id: today,
      meal_type: activeMealType,
      name: 'Quick Add',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      calories: cals,
      protein: prot,
      carbs: carb,
      fats: fat,
      isQuickAdd: true
    };
    setData(prev => ({ ...prev, meals: [...prev.meals, meal] }));
    setShowQuickAdd(false);
    setQuickAdd({ calories: '', protein: '', carbs: '', fats: '' });
    showToast('Añadido');
  };

  const logRecentFood = (food) => {
    const meal = {
      id: generateId(),
      day_id: today,
      meal_type: activeMealType,
      name: food.name,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fats: food.fats || 0
    };
    setData(prev => ({ ...prev, meals: [...prev.meals, meal] }));
    setView('diary');
    showToast('Añadido');
  };

  const deleteMeal = (id) => {
    setData(prev => ({ ...prev, meals: prev.meals.filter(m => m.id !== id) }));
    showToast('Eliminado');
  };

  const saveMealToFavorites = (meal) => {
    const savedMeal = {
      id: generateId(),
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats
    };
    setData(prev => ({
      ...prev,
      savedMeals: [...(prev.savedMeals || []), savedMeal]
    }));
    showToast('Guardado en favoritos');
  };

  // ========== NEW: Select food from database and configure ==========
  const selectFoodFromDatabase = (food) => {
    setSelectedFood(food);
    setServingQuantity(1);
    setSearchQuery('');
  };

  const confirmAddSelectedFood = () => {
    if (!selectedFood) return;

    const meal = {
      id: generateId(),
      day_id: today,
      meal_type: activeMealType,
      name: selectedFood.name,
      serving: selectedFood.serving,
      servings: servingQuantity,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      calories: Math.round(selectedFood.calories * servingQuantity),
      protein: Math.round(selectedFood.protein * servingQuantity),
      carbs: Math.round(selectedFood.carbs * servingQuantity),
      fats: Math.round(selectedFood.fats * servingQuantity),
      fiber: Math.round((selectedFood.fiber || 0) * servingQuantity),
      sugar: Math.round((selectedFood.sugar || 0) * servingQuantity),
      sodium: Math.round((selectedFood.sodium || 0) * servingQuantity),
      foodId: selectedFood.id
    };

    setData(prev => ({ ...prev, meals: [...prev.meals, meal] }));
    setSelectedFood(null);
    setServingQuantity(1);
    setShowAdd(false);
    showToast('Añadido');
  };

  // ========== NEW: Real barcode scanner with camera ==========
  const videoRef = React.useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      });
      setCameraStream(stream);
      setIsScanning(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      showToast('No se pudo acceder a la cámara');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsScanning(false);
    setShowScanner(false);
  };

  const searchByBarcode = (barcode) => {
    const found = FOOD_DATABASE.find(f => f.barcode === barcode);
    if (found) {
      selectFoodFromDatabase(found);
      stopCamera();
      showToast(`Encontrado: ${found.name}`);
    } else {
      showToast('Código no encontrado en la base de datos');
    }
    setScannedBarcode('');
  };

  // ========== NEW: Multi-day meal planning ==========
  const plannedMeals = data.plannedMeals || [];
  const todayPlannedMeals = plannedMeals.filter(m => m.day_id === today && !m.confirmed);

  const planMealForDays = (food, days) => {
    const newPlannedMeals = days.map(day => ({
      id: generateId(),
      day_id: day,
      meal_type: activeMealType,
      name: food.name,
      serving: food.serving,
      servings: servingQuantity,
      calories: Math.round(food.calories * servingQuantity),
      protein: Math.round(food.protein * servingQuantity),
      carbs: Math.round(food.carbs * servingQuantity),
      fats: Math.round(food.fats * servingQuantity),
      confirmed: false,
      plannedAt: new Date().toISOString()
    }));

    setData(prev => ({
      ...prev,
      plannedMeals: [...(prev.plannedMeals || []), ...newPlannedMeals]
    }));

    setShowPlanner(false);
    setPlannedDays([]);
    setSelectedFood(null);
    showToast(`Planificado para ${days.length} días`);
  };

  const confirmPlannedMeal = (plannedMeal) => {
    // Move from planned to actual meals
    const meal = {
      id: generateId(),
      day_id: today,
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

  const deletePlannedMeal = (id) => {
    setData(prev => ({
      ...prev,
      plannedMeals: prev.plannedMeals.filter(m => m.id !== id)
    }));
    showToast('Eliminado');
  };

  // Get next 7 days for planning
  const next7Days = Array.from({ length: 7 }, (_, i) => getDateOffset(today, i));

  // Toggle day selection for planning
  const togglePlannedDay = (day) => {
    setPlannedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Circular progress component for macros
  const MacroRing = ({ value, max, color, label, unit = 'g', size = 70 }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const remaining = max - value;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold">{Math.round(remaining)}</span>
            <span className="text-[8px] text-white/40">{unit}</span>
          </div>
        </div>
        <p className="text-xs text-white/60 mt-1">{label}</p>
        <p className="text-[10px] text-white/40">{value}/{max}</p>
      </div>
    );
  };

  // DIARY VIEW
  if (view === 'diary') {
    return (
      <div className="space-y-4 pb-24">
        {/* Header */}
        <AnimatedMount>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Nutrición</h1>
                {loggingStreak > 0 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 rounded-full">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-xs font-medium text-orange-400">{loggingStreak}</span>
                  </div>
                )}
              </div>
              <p className="text-white/50 text-sm">{formatDate(today)}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* User Icon - only shown when logged in */}
              {(() => {
                const { user, loading } = useAuth();
                if (loading || !user) return null;
                const initial = user.email.charAt(0).toUpperCase();
                return (
                  <button
                    onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }}
                    className="relative group"
                    title={`${user.email} - Click para cerrar sesión`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/30 ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                      {initial}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
                  </button>
                );
              })()}
              <button onClick={() => setShowHelp(true)} className="p-2 hover:bg-white/10 rounded-full">
                <BookOpen className="w-5 h-5 text-white/50" />
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/10 rounded-full">
                <Settings className="w-5 h-5 text-white/50" />
              </button>
            </div>
          </div>
        </AnimatedMount>

        {/* Main Calories Card with Macro Rings */}
        <AnimatedMount delay={50}>
          <Card className="bg-gradient-to-br from-orange-500/20 via-red-500/10 to-violet-500/20 border-orange-500/30">
            {/* Top: Calories remaining */}
            <div className="text-center mb-4">
              <p className="text-5xl font-bold">{remainingCals}</p>
              <p className="text-sm text-white/60">Calorías restantes</p>
            </div>

            {/* Calories breakdown */}
            <div className="flex items-center justify-center gap-8 text-sm mb-4">
              <div className="text-center">
                <p className="text-white/40">Base</p>
                <p className="font-medium">{localGoals.calories}</p>
              </div>
              <div className="text-white/20">-</div>
              <div className="text-center">
                <p className="text-white/40">Comida</p>
                <p className="font-medium text-orange-400">{totalCals}</p>
              </div>
              <div className="text-white/20">=</div>
              <div className="text-center">
                <p className="text-white/40">Restante</p>
                <p className={`font-medium ${remainingCals >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{remainingCals}</p>
              </div>
            </div>

            {/* Macro rings */}
            <div className="flex justify-around">
              <MacroRing value={totalProt} max={localGoals.protein} color="#10B981" label="Proteína" />
              <MacroRing value={totalCarbs} max={localGoals.carbs} color="#3B82F6" label="Carbs" />
              <MacroRing value={totalFats} max={localGoals.fats} color="#F59E0B" label="Grasas" />
            </div>
          </Card>
        </AnimatedMount>

        {/* Quick Actions */}
        <AnimatedMount delay={75}>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowQuickAdd(true); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm">Quick Add</span>
            </button>
            <button
              onClick={() => setView('search')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Buscar</span>
            </button>
            <button
              onClick={() => setView('saved')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Guardados</span>
            </button>
          </div>
        </AnimatedMount>

        {/* Water Tracker */}
        <AnimatedMount delay={100}>
          <Card className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-medium">Agua</p>
                  <p className="text-xs text-white/40">{waterGlasses} de {localGoals.water} vasos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={removeWater}
                  disabled={waterGlasses <= 0}
                  className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-cyan-400 font-bold text-lg leading-none">−</span>
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: localGoals.water }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-4 rounded-sm transition-colors ${i < waterGlasses ? 'bg-cyan-400' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={addWater}
                  className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-cyan-400 font-bold text-lg leading-none">+</span>
                </button>
              </div>
            </div>
          </Card>
        </AnimatedMount>

        {/* Planned meals pending confirmation */}
        {todayPlannedMeals.length > 0 && (
          <AnimatedMount delay={110}>
            <Card className="border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-amber-400" />
                <p className="font-medium">Comidas planificadas</p>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{todayPlannedMeals.length}</span>
              </div>
              <div className="space-y-2">
                {todayPlannedMeals.map(meal => (
                  <div key={meal.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{meal.name}</p>
                      <p className="text-xs text-white/40">
                        {meal.servings}x {meal.serving} · {meal.calories} kcal
                      </p>
                    </div>
                    <button
                      onClick={() => deletePlannedMeal(meal.id)}
                      className="p-2 hover:bg-white/10 rounded-lg"
                    >
                      <X className="w-4 h-4 text-white/40" />
                    </button>
                    <button
                      onClick={() => confirmPlannedMeal(meal)}
                      className="px-4 py-2 bg-emerald-500 rounded-lg text-sm font-medium flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Confirmar
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedMount>
        )}

        {/* Meal Sections */}
        {mealTypes.map(({ type, label, emoji, time }, index) => {
          const typeMeals = meals.filter(m => m.meal_type === type);
          const typePlanned = todayPlannedMeals.filter(m => m.meal_type === type);
          const mealCals = typeMeals.reduce((s, m) => s + (m.calories || 0), 0);
          const mealGoal = localGoals.caloriesPerMeal?.[type] || 500;
          const isExpanded = expandedMeal === type;

          return (
            <AnimatedMount key={type} delay={125 + index * 25}>
              <Card className="overflow-hidden">
                {/* Header - clickable to expand */}
                <button
                  onClick={() => setExpandedMeal(isExpanded ? null : type)}
                  className="w-full flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-xl relative">
                    {emoji}
                    {typePlanned.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {typePlanned.length}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{label}</p>
                      {typeMeals.length > 0 && (
                        <span className="text-xs text-white/40">({typeMeals.length})</span>
                      )}
                    </div>
                    <p className="text-xs text-white/40">{time}</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className="font-bold">{mealCals}</p>
                    <p className="text-xs text-white/40">/{mealGoal} kcal</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-white/30 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* Planned meals for this type */}
                    {typePlanned.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-amber-400 mb-2">📅 PLANIFICADO</p>
                        <div className="space-y-2">
                          {typePlanned.map(meal => (
                            <div key={meal.id} className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                              <div className="flex-1">
                                <p className="text-sm">{meal.name}</p>
                                <p className="text-xs text-white/40">{meal.calories} kcal</p>
                              </div>
                              <button
                                onClick={() => confirmPlannedMeal(meal)}
                                className="px-3 py-1.5 bg-emerald-500 rounded-lg text-xs font-medium"
                              >
                                ✓ Hecho
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meal items */}
                    {typeMeals.length > 0 ? (
                      <div className="space-y-2 mb-3">
                        {typeMeals.map(meal => (
                          <SwipeableItem
                            key={meal.id}
                            onDelete={() => deleteMeal(meal.id)}
                            rightAction={() => saveMealToFavorites(meal)}
                            rightActionIcon={<Award className="w-4 h-4" />}
                            rightActionColor="bg-amber-500"
                          >
                            <div
                              onClick={() => setShowFoodDetail(meal)}
                              className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">{meal.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-white/40">{meal.time}</span>
                                  {meal.isQuickAdd && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded">Quick</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold">{meal.calories} kcal</p>
                                <p className="text-[10px] text-white/40">
                                  P:{meal.protein || 0} · C:{meal.carbs || 0} · G:{meal.fats || 0}
                                </p>
                              </div>
                            </div>
                          </SwipeableItem>
                        ))}
                      </div>
                    ) : null}

                    {/* Add food button */}
                    <button
                      onClick={() => {
                        setActiveMealType(type);
                        setNewMeal(p => ({ ...p, meal_type: type }));
                        setShowAdd(true);
                      }}
                      className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/50 text-sm hover:border-white/40 hover:text-white/70 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Añadir alimento
                    </button>
                  </div>
                )}
              </Card>
            </AnimatedMount>
          );
        })}

        {/* Macro Distribution */}
        {totalCals > 0 && (
          <AnimatedMount delay={250}>
            <Card>
              <p className="text-sm text-white/60 mb-3">Distribución de macros</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${protPercent}%` }}
                  />
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${carbsPercent}%` }}
                  />
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${fatsPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-emerald-400">Prot {protPercent}%</span>
                <span className="text-blue-400">Carbs {carbsPercent}%</span>
                <span className="text-amber-400">Grasas {fatsPercent}%</span>
              </div>
            </Card>
          </AnimatedMount>
        )}

        {/* Bottom navigation for views */}
        <AnimatedMount delay={275}>
          <div className="flex gap-2">
            <button
              onClick={() => setView('history')}
              className="flex-1 py-3 bg-white/5 rounded-xl text-sm text-white/60 hover:bg-white/10"
            >
              📅 Historial
            </button>
            <button
              onClick={() => setView('insights')}
              className="flex-1 py-3 bg-white/5 rounded-xl text-sm text-white/60 hover:bg-white/10"
            >
              📊 Insights
            </button>
          </div>
        </AnimatedMount>

        {/* Modals */}
        {/* Add Food Modal - NEW INTEGRATED FLOW */}
        <Modal
          isOpen={showAdd}
          onClose={() => { setShowAdd(false); setSelectedFood(null); setSearchQuery(''); setAddMode('search'); }}
          title={selectedFood ? "Configurar porción" : "Añadir alimento"}
        >
          {/* If food is selected, show configuration */}
          {selectedFood ? (
            <div className="space-y-4">
              {/* Selected food info */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4">
                <p className="font-bold text-lg">{selectedFood.name}</p>
                <p className="text-sm text-white/50">{selectedFood.serving}</p>
              </div>

              {/* Meal type selector */}
              <div>
                <p className="text-xs text-white/40 mb-2">Añadir a:</p>
                <div className="flex gap-2">
                  {mealTypes.map(({ type, emoji, label }) => (
                    <button
                      key={type}
                      onClick={() => setActiveMealType(type)}
                      className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeMealType === type ? 'bg-orange-500' : 'bg-white/10'}`}
                    >
                      <span>{emoji}</span>
                      <span className="text-[10px]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <p className="text-xs text-white/40 mb-2">Cantidad de porciones:</p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setServingQuantity(Math.max(0.1, servingQuantity - 0.25))}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold hover:bg-white/20"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <input
                      type="number"
                      value={servingQuantity}
                      onChange={(e) => setServingQuantity(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                      className="w-20 text-4xl font-bold bg-transparent text-center outline-none"
                      step="0.1"
                      min="0.1"
                    />
                    <p className="text-xs text-white/40">{selectedFood.serving}</p>
                  </div>
                  <button
                    onClick={() => setServingQuantity(servingQuantity + 0.25)}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick quantity buttons */}
              <div className="flex gap-2">
                {[0.5, 1, 1.5, 2, 3].map(q => (
                  <button
                    key={q}
                    onClick={() => setServingQuantity(q)}
                    className={`flex-1 py-2 rounded-lg text-sm ${servingQuantity === q ? 'bg-orange-500' : 'bg-white/10'}`}
                  >
                    {q}x
                  </button>
                ))}
              </div>

              {/* Calculated nutrition */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-center mb-3">
                  <p className="text-3xl font-bold text-orange-400">{Math.round(selectedFood.calories * servingQuantity)}</p>
                  <p className="text-xs text-white/40">calorías</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-bold text-emerald-400">{Math.round(selectedFood.protein * servingQuantity)}g</p>
                    <p className="text-[10px] text-white/40">Proteína</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">{Math.round(selectedFood.carbs * servingQuantity)}g</p>
                    <p className="text-[10px] text-white/40">Carbs</p>
                  </div>
                  <div>
                    <p className="font-bold text-amber-400">{Math.round(selectedFood.fats * servingQuantity)}g</p>
                    <p className="text-[10px] text-white/40">Grasas</p>
                  </div>
                </div>
              </div>

              {/* Multi-day planning option */}
              <button
                onClick={() => setShowPlanner(true)}
                className="w-full py-3 bg-white/5 rounded-xl text-sm text-white/60 flex items-center justify-center gap-2 hover:bg-white/10"
              >
                <Calendar className="w-4 h-4" />
                Planificar para varios días
              </button>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedFood(null); setSearchQuery(''); }}
                  className="flex-1 py-4 bg-white/10 rounded-xl font-medium"
                >
                  Cambiar
                </button>
                <button
                  onClick={confirmAddSelectedFood}
                  className="flex-1 py-4 bg-orange-500 rounded-xl font-medium"
                >
                  Añadir
                </button>
              </div>
            </div>
          ) : (
            /* Food search/selection view */
            <div className="space-y-4">
              {/* Mode tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setAddMode('search')}
                  className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${addMode === 'search' ? 'bg-orange-500' : 'bg-white/10'}`}
                >
                  <Search className="w-4 h-4" />
                  Buscar
                </button>
                <button
                  onClick={() => { setAddMode('scan'); startCamera(); }}
                  className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${addMode === 'scan' ? 'bg-orange-500' : 'bg-white/10'}`}
                >
                  <Camera className="w-4 h-4" />
                  Escanear
                </button>
                <button
                  onClick={() => setAddMode('manual')}
                  className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${addMode === 'manual' ? 'bg-orange-500' : 'bg-white/10'}`}
                >
                  <Edit3 className="w-4 h-4" />
                  Manual
                </button>
              </div>

              {/* Meal type selector */}
              <div className="flex gap-2">
                {mealTypes.map(({ type, emoji }) => (
                  <button
                    key={type}
                    onClick={() => setActiveMealType(type)}
                    className={`flex-1 py-2 rounded-lg ${activeMealType === type ? 'bg-orange-500' : 'bg-white/10'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {addMode === 'search' && (
                <>
                  {/* Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar alimento..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/10 rounded-xl p-4 pl-12 outline-none"
                      autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  </div>

                  {/* Category filter */}
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                    {FOOD_CATEGORIES.slice(0, 6).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${selectedCategory === cat.id ? 'bg-orange-500' : 'bg-white/10'
                          }`}
                      >
                        {cat.emoji}
                      </button>
                    ))}
                  </div>

                  {/* Search results */}
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {FOOD_DATABASE
                      .filter(food => {
                        const matchesQuery = !searchQuery || food.name.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
                        return matchesQuery && matchesCategory;
                      })
                      .slice(0, 15)
                      .map(food => (
                        <button
                          key={food.id}
                          onClick={() => selectFoodFromDatabase(food)}
                          className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 text-left"
                        >
                          <div>
                            <p className="font-medium text-sm">{food.name}</p>
                            <p className="text-xs text-white/40">{food.serving}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-400">{food.calories}</p>
                            <p className="text-[10px] text-white/40">kcal</p>
                          </div>
                        </button>
                      ))
                    }
                  </div>

                  {/* Recent foods */}
                  {!searchQuery && recentFoods.length > 0 && (
                    <div>
                      <p className="text-xs text-white/40 mb-2">RECIENTES</p>
                      <div className="space-y-2">
                        {recentFoods.slice(0, 5).map(food => (
                          <button
                            key={food.id}
                            onClick={() => selectFoodFromDatabase(food)}
                            className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 text-left"
                          >
                            <div>
                              <p className="font-medium text-sm">{food.name}</p>
                              <p className="text-xs text-white/40">P:{food.protein}g · C:{food.carbs}g · G:{food.fats}g</p>
                            </div>
                            <p className="font-bold text-orange-400">{food.calories}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {addMode === 'scan' && (
                <div className="space-y-4">
                  {/* Camera preview */}
                  <div className="aspect-[4/3] bg-black rounded-xl overflow-hidden relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Scan overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-32 border-2 border-orange-500 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-orange-500/50 animate-pulse" />
                      </div>
                    </div>
                    {!cameraStream && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <button
                          onClick={startCamera}
                          className="px-6 py-3 bg-orange-500 rounded-xl font-medium flex items-center gap-2"
                        >
                          <Camera className="w-5 h-5" />
                          Activar cámara
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-sm text-white/50">
                    Apunta al código de barras del producto
                  </p>

                  {/* Manual barcode entry */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="O introduce el código..."
                      value={scannedBarcode}
                      onChange={(e) => setScannedBarcode(e.target.value)}
                      className="flex-1 bg-white/10 rounded-xl p-3 outline-none"
                    />
                    <button
                      onClick={() => searchByBarcode(scannedBarcode)}
                      disabled={!scannedBarcode}
                      className="px-4 bg-orange-500 rounded-xl font-medium disabled:opacity-50"
                    >
                      Buscar
                    </button>
                  </div>

                  {/* Sample codes */}
                  <div>
                    <p className="text-xs text-white/40 mb-2">Códigos de ejemplo:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: '8410000000001', name: 'Pollo' },
                        { code: '8410000000023', name: 'Yogur' },
                        { code: '8410000000045', name: 'Avena' },
                        { code: '8410000000088', name: 'Aguacate' }
                      ].map(item => (
                        <button
                          key={item.code}
                          onClick={() => searchByBarcode(item.code)}
                          className="px-3 py-1.5 bg-white/5 rounded-lg text-xs hover:bg-white/10"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {addMode === 'manual' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre del alimento"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/10 rounded-xl p-4 outline-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-white/40 mb-1">Calorías</p>
                      <input
                        type="number"
                        placeholder="0"
                        value={newMeal.calories}
                        onChange={(e) => setNewMeal(p => ({ ...p, calories: e.target.value }))}
                        className="w-full bg-transparent outline-none text-xl font-bold"
                      />
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-emerald-400 mb-1">Proteína (g)</p>
                      <input
                        type="number"
                        placeholder="0"
                        value={newMeal.protein}
                        onChange={(e) => setNewMeal(p => ({ ...p, protein: e.target.value }))}
                        className="w-full bg-transparent outline-none text-xl font-bold"
                      />
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-blue-400 mb-1">Carbs (g)</p>
                      <input
                        type="number"
                        placeholder="0"
                        value={newMeal.carbs}
                        onChange={(e) => setNewMeal(p => ({ ...p, carbs: e.target.value }))}
                        className="w-full bg-transparent outline-none text-xl font-bold"
                      />
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-amber-400 mb-1">Grasas (g)</p>
                      <input
                        type="number"
                        placeholder="0"
                        value={newMeal.fats}
                        onChange={(e) => setNewMeal(p => ({ ...p, fats: e.target.value }))}
                        className="w-full bg-transparent outline-none text-xl font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={saveMeal}
                    disabled={!newMeal.name}
                    className={`w-full py-4 rounded-xl font-medium ${newMeal.name ? 'bg-orange-500' : 'bg-white/10 text-white/30'}`}
                  >
                    Añadir
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Multi-day Planner Modal */}
        <Modal
          isOpen={showPlanner}
          onClose={() => { setShowPlanner(false); setPlannedDays([]); }}
          title="Planificar comida"
        >
          {selectedFood && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="font-medium">{selectedFood.name}</p>
                <p className="text-sm text-white/40">{servingQuantity}x {selectedFood.serving} · {Math.round(selectedFood.calories * servingQuantity)} kcal</p>
              </div>

              <div>
                <p className="text-sm text-white/60 mb-3">Selecciona los días:</p>
                <div className="grid grid-cols-7 gap-2">
                  {next7Days.map((day, i) => {
                    const isSelected = plannedDays.includes(day);
                    const dayName = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][new Date(day).getDay()];
                    const dayNum = new Date(day).getDate();
                    const isToday = day === today;

                    return (
                      <button
                        key={day}
                        onClick={() => togglePlannedDay(day)}
                        className={`p-2 rounded-lg flex flex-col items-center ${isSelected
                          ? 'bg-orange-500'
                          : isToday
                            ? 'bg-white/20'
                            : 'bg-white/5'
                          }`}
                      >
                        <span className="text-[10px] text-white/60">{dayName}</span>
                        <span className="font-bold">{dayNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {plannedDays.length > 0 && (
                <div className="bg-orange-500/10 rounded-xl p-3 text-center">
                  <p className="text-sm">
                    Se planificará para <span className="font-bold text-orange-400">{plannedDays.length} días</span>
                  </p>
                  <p className="text-xs text-white/40">Deberás confirmar cada día cuando comas</p>
                </div>
              )}

              <button
                onClick={() => planMealForDays(selectedFood, plannedDays)}
                disabled={plannedDays.length === 0}
                className={`w-full py-4 rounded-xl font-medium ${plannedDays.length > 0 ? 'bg-orange-500' : 'bg-white/10 text-white/30'
                  }`}
              >
                Planificar
              </button>
            </div>
          )}
        </Modal>

        {/* Quick Add Modal */}
        <Modal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} title="Quick Add">
          <p className="text-sm text-white/50 mb-4">Añade calorías o macros rápidamente. Si solo introduces macros, las calorías se calcularán automáticamente.</p>

          {/* Meal type selector */}
          <div className="flex gap-2 mb-4">
            {mealTypes.map(({ type, emoji }) => (
              <button
                key={type}
                onClick={() => setActiveMealType(type)}
                className={`flex-1 py-2 rounded-lg ${activeMealType === type ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/40 mb-1">Calorías</p>
              <input
                type="number"
                placeholder="0"
                value={quickAdd.calories}
                onChange={(e) => setQuickAdd(p => ({ ...p, calories: e.target.value }))}
                className="w-full bg-transparent outline-none text-3xl font-bold text-center"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-emerald-400 mb-1">Prot (g)</p>
                <input
                  type="number"
                  placeholder="0"
                  value={quickAdd.protein}
                  onChange={(e) => setQuickAdd(p => ({ ...p, protein: e.target.value }))}
                  className="w-full bg-transparent outline-none text-lg font-bold text-center"
                />
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-blue-400 mb-1">Carbs (g)</p>
                <input
                  type="number"
                  placeholder="0"
                  value={quickAdd.carbs}
                  onChange={(e) => setQuickAdd(p => ({ ...p, carbs: e.target.value }))}
                  className="w-full bg-transparent outline-none text-lg font-bold text-center"
                />
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-amber-400 mb-1">Grasas (g)</p>
                <input
                  type="number"
                  placeholder="0"
                  value={quickAdd.fats}
                  onChange={(e) => setQuickAdd(p => ({ ...p, fats: e.target.value }))}
                  className="w-full bg-transparent outline-none text-lg font-bold text-center"
                />
              </div>
            </div>
          </div>

          <button
            onClick={saveQuickAdd}
            className="w-full py-4 bg-violet-500 rounded-xl font-medium mt-4"
          >
            Añadir
          </button>
        </Modal>

        {/* Food Detail Modal */}
        <Modal isOpen={!!showFoodDetail} onClose={() => setShowFoodDetail(null)} title="Detalle">
          {showFoodDetail && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{showFoodDetail.name}</p>
                <p className="text-sm text-white/40">{showFoodDetail.time} · {mealTypes.find(m => m.type === showFoodDetail.meal_type)?.label}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-orange-400">{showFoodDetail.calories}</p>
                <p className="text-sm text-white/40">calorías</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{showFoodDetail.protein || 0}g</p>
                  <p className="text-xs text-white/40">Proteína</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">{showFoodDetail.carbs || 0}g</p>
                  <p className="text-xs text-white/40">Carbs</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-400">{showFoodDetail.fats || 0}g</p>
                  <p className="text-xs text-white/40">Grasas</p>
                </div>
              </div>

              {(showFoodDetail.fiber || showFoodDetail.sugar || showFoodDetail.sodium) && (
                <div className="grid grid-cols-3 gap-3">
                  {showFoodDetail.fiber > 0 && (
                    <div className="bg-white/5 rounded-xl p-2 text-center">
                      <p className="font-bold">{showFoodDetail.fiber}g</p>
                      <p className="text-[10px] text-white/40">Fibra</p>
                    </div>
                  )}
                  {showFoodDetail.sugar > 0 && (
                    <div className="bg-white/5 rounded-xl p-2 text-center">
                      <p className="font-bold">{showFoodDetail.sugar}g</p>
                      <p className="text-[10px] text-white/40">Azúcar</p>
                    </div>
                  )}
                  {showFoodDetail.sodium > 0 && (
                    <div className="bg-white/5 rounded-xl p-2 text-center">
                      <p className="font-bold">{showFoodDetail.sodium}mg</p>
                      <p className="text-[10px] text-white/40">Sodio</p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => { saveMealToFavorites(showFoodDetail); setShowFoodDetail(null); }}
                className="w-full py-3 bg-amber-500/20 text-amber-400 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                Guardar en favoritos
              </button>
            </div>
          )}
        </Modal>

        {/* Settings Modal */}
        <Modal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          title="Configuración Nutrición"
          footer={
            <button onClick={saveSettings} className="w-full py-4 bg-orange-500 rounded-xl font-medium">
              Guardar cambios
            </button>
          }
        >
          <div className="space-y-4">
            {/* Meal Mode Toggle */}
            <div>
              <label className="text-sm text-white/60 mb-2 block">Modo de registro</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLocalGoals(p => ({ ...p, mealMode: 'separate' }))}
                  className={`p-3 rounded-xl text-sm ${localGoals.mealMode === 'separate' ? 'bg-orange-500' : 'bg-white/10'}`}
                >
                  <p className="font-medium">Por comidas</p>
                  <p className="text-[10px] text-white/60">Desayuno, Comida, etc.</p>
                </button>
                <button
                  onClick={() => setLocalGoals(p => ({ ...p, mealMode: 'single' }))}
                  className={`p-3 rounded-xl text-sm ${localGoals.mealMode === 'single' ? 'bg-orange-500' : 'bg-white/10'}`}
                >
                  <p className="font-medium">Banco único</p>
                  <p className="text-[10px] text-white/60">Todo junto</p>
                </button>
              </div>
            </div>

            {/* Meal slots selector (only if separate mode) */}
            {localGoals.mealMode === 'separate' && (
              <div>
                <label className="text-sm text-white/60 mb-2 block">Comidas del día</label>
                <div className="grid grid-cols-2 gap-2">
                  {allMealTypes.map(meal => {
                    const isActive = localGoals.mealSlots.includes(meal.type);
                    return (
                      <button
                        key={meal.type}
                        onClick={() => {
                          setLocalGoals(p => ({
                            ...p,
                            mealSlots: isActive
                              ? p.mealSlots.filter(s => s !== meal.type)
                              : [...p.mealSlots, meal.type]
                          }));
                        }}
                        className={`p-2 rounded-xl flex items-center gap-2 ${isActive ? 'bg-orange-500/20 border border-orange-500' : 'bg-white/5'}`}
                      >
                        <span>{meal.emoji}</span>
                        <span className="text-sm">{meal.label}</span>
                        {isActive && <Check className="w-4 h-4 ml-auto text-orange-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              <label className="text-sm text-white/60 mb-2 block">Objetivo calorías diarias</label>
              <input
                type="number"
                value={localGoals.calories}
                onChange={(e) => setLocalGoals(p => ({ ...p, calories: parseInt(e.target.value) || 0 }))}
                className="w-full bg-white/10 rounded-xl p-4 outline-none text-2xl font-bold text-center"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-emerald-400 mb-1 block">Proteína (g)</label>
                <input
                  type="number"
                  value={localGoals.protein}
                  onChange={(e) => setLocalGoals(p => ({ ...p, protein: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-white/10 rounded-xl p-3 outline-none text-center font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-blue-400 mb-1 block">Carbs (g)</label>
                <input
                  type="number"
                  value={localGoals.carbs}
                  onChange={(e) => setLocalGoals(p => ({ ...p, carbs: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-white/10 rounded-xl p-3 outline-none text-center font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-amber-400 mb-1 block">Grasas (g)</label>
                <input
                  type="number"
                  value={localGoals.fats}
                  onChange={(e) => setLocalGoals(p => ({ ...p, fats: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-white/10 rounded-xl p-3 outline-none text-center font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Fibra (g)</label>
                <input
                  type="number"
                  value={localGoals.fiber}
                  onChange={(e) => setLocalGoals(p => ({ ...p, fiber: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-white/10 rounded-xl p-3 outline-none text-center"
                />
              </div>
              <div>
                <label className="text-[10px] text-cyan-400 mb-1 block">Vasos agua</label>
                <input
                  type="number"
                  value={localGoals.water}
                  onChange={(e) => setLocalGoals(p => ({ ...p, water: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-white/10 rounded-xl p-3 outline-none text-center"
                />
              </div>
            </div>
          </div>
        </Modal>

        {/* Help Modal */}
        <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Guía de Nutrición">
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <p className="font-bold text-orange-400 mb-1">🍽️ Diario</p>
              <p className="text-white/60">Vista principal con tus calorías y macros del día.</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="font-bold text-emerald-400 mb-1">📊 Macronutrientes</p>
              <p className="text-white/60">
                <strong>Proteína</strong>: Músculos (1.6-2.2g/kg)<br />
                <strong>Carbos</strong>: Energía<br />
                <strong>Grasas</strong>: Hormonas
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="font-bold text-blue-400 mb-1">⚡ Quick Add</p>
              <p className="text-white/60">Añade calorías rápido sin buscar alimentos.</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="font-bold text-cyan-400 mb-1">💧 Agua</p>
              <p className="text-white/60">Meta: 8 vasos (2L) al día.</p>
            </div>
            <div className="p-3 bg-violet-500/20 rounded-xl">
              <p className="font-bold mb-1">💡 Consejos</p>
              <p className="text-white/60">
                • Registra ANTES de comer<br />
                • Pesa alimentos al inicio<br />
                • Prioriza proteína<br />
                • Consistencia &gt; perfección
              </p>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // SEARCH VIEW
  if (view === 'search') {
    // Search in database
    const databaseResults = FOOD_DATABASE.filter(food => {
      const matchesQuery = !searchQuery ||
        food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' ||
        food.category === selectedCategory;
      return matchesQuery && matchesCategory;
    }).slice(0, 30);

    // Search in recent/frequent
    const filteredRecent = searchQuery
      ? recentFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : recentFoods;
    const filteredFrequent = searchQuery
      ? frequentFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : frequentFoods;

    // Log food from database
    const logDatabaseFood = (food, servings = 1) => {
      const meal = {
        id: generateId(),
        day_id: today,
        meal_type: activeMealType,
        name: food.name,
        serving: food.serving,
        servings: servings,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        calories: Math.round(food.calories * servings),
        protein: Math.round(food.protein * servings),
        carbs: Math.round(food.carbs * servings),
        fats: Math.round(food.fats * servings),
        fiber: Math.round((food.fiber || 0) * servings),
        sugar: Math.round((food.sugar || 0) * servings),
        sodium: Math.round((food.sodium || 0) * servings),
        foodId: food.id
      };
      setData(prev => ({ ...prev, meals: [...prev.meals, meal] }));
      setView('diary');
      showToast('Añadido');
    };

    // Barcode search
    const searchByBarcode = (barcode) => {
      const found = FOOD_DATABASE.find(f => f.barcode === barcode);
      if (found) {
        logDatabaseFood(found);
      } else {
        showToast('Código no encontrado');
      }
      setShowScanner(false);
      setScannedBarcode('');
    };

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('diary')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Buscar alimento</h1>
          </div>
        </AnimatedMount>

        {/* Search bar with scanner button */}
        <AnimatedMount delay={50}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar alimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 rounded-xl p-4 pl-12 outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="p-4 bg-orange-500 rounded-xl"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </AnimatedMount>

        {/* Category filter */}
        <AnimatedMount delay={75}>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {FOOD_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${selectedCategory === cat.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white/70'
                  }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </AnimatedMount>

        {/* Meal type selector */}
        <AnimatedMount delay={100}>
          <div className="flex gap-2">
            {mealTypes.map(({ type, emoji, label }) => (
              <button
                key={type}
                onClick={() => setActiveMealType(type)}
                className={`flex-1 py-2 rounded-lg text-sm ${activeMealType === type ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </AnimatedMount>

        {/* Database results */}
        {databaseResults.length > 0 && (
          <AnimatedMount delay={125}>
            <Section title="BASE DE DATOS" icon={BookOpen} iconColor="text-blue-400">
              <div className="space-y-2">
                {databaseResults.map(food => (
                  <Card
                    key={food.id}
                    onClick={() => logDatabaseFood(food)}
                    className="py-3 cursor-pointer hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{food.name}</p>
                        <p className="text-xs text-white/40">{food.serving}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          P:{food.protein}g · C:{food.carbs}g · G:{food.fats}g
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-400">{food.calories}</p>
                        <p className="text-[10px] text-white/40">kcal</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          </AnimatedMount>
        )}

        {/* Recent */}
        {filteredRecent.length > 0 && (
          <AnimatedMount delay={150}>
            <Section title="RECIENTES" icon={Clock} iconColor="text-violet-400">
              <div className="space-y-2">
                {filteredRecent.map(food => (
                  <Card key={food.id} onClick={() => logRecentFood(food)} className="py-3 cursor-pointer hover:bg-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-xs text-white/40">P:{food.protein || 0} · C:{food.carbs || 0} · G:{food.fats || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-400">{food.calories}</p>
                        <p className="text-xs text-white/40">kcal</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          </AnimatedMount>
        )}

        {/* Frequent */}
        {filteredFrequent.length > 0 && (
          <AnimatedMount delay={175}>
            <Section title="FRECUENTES" icon={Flame} iconColor="text-orange-400">
              <div className="space-y-2">
                {filteredFrequent.map(food => (
                  <Card key={food.name} onClick={() => logRecentFood(food)} className="py-3 cursor-pointer hover:bg-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-xs text-white/40">Registrado {food.count} veces</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-400">{food.calories}</p>
                        <p className="text-xs text-white/40">kcal</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          </AnimatedMount>
        )}

        {/* Create new */}
        <AnimatedMount delay={200}>
          <button
            onClick={() => { setView('diary'); setShowAdd(true); }}
            className="w-full py-4 bg-white/10 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/20"
          >
            <Plus className="w-5 h-5" />
            Crear alimento personalizado
          </button>
        </AnimatedMount>

        {/* Barcode Scanner Modal */}
        <Modal isOpen={showScanner} onClose={() => setShowScanner(false)} title="Escanear código">
          <div className="space-y-4">
            <div className="aspect-square bg-black/50 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-orange-500 rounded-lg opacity-50" />
              <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-orange-500 animate-pulse" />
              <Camera className="w-16 h-16 text-white/20" />
            </div>
            <p className="text-center text-sm text-white/50">
              Apunta al código de barras del producto
            </p>

            {/* Manual barcode entry */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2">O introduce el código manualmente:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código de barras..."
                  value={scannedBarcode}
                  onChange={(e) => setScannedBarcode(e.target.value)}
                  className="flex-1 bg-white/10 rounded-xl p-3 outline-none"
                />
                <button
                  onClick={() => searchByBarcode(scannedBarcode)}
                  className="px-4 bg-orange-500 rounded-xl font-medium"
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Sample barcodes for demo */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2">Prueba estos códigos de ejemplo:</p>
              <div className="flex flex-wrap gap-2">
                {['8410000000001', '8410000000023', '8410000000045', '8410000000088'].map(code => (
                  <button
                    key={code}
                    onClick={() => searchByBarcode(code)}
                    className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white/60 hover:bg-white/10"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // SAVED VIEW
  if (view === 'saved') {
    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('diary')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Alimentos guardados</h1>
          </div>
        </AnimatedMount>

        {savedMeals.length > 0 ? (
          <AnimatedMount delay={50}>
            <div className="space-y-2">
              {savedMeals.map(meal => (
                <Card key={meal.id} onClick={() => logRecentFood(meal)} className="py-3 cursor-pointer hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="font-medium">{meal.name}</p>
                        <p className="text-xs text-white/40">P:{meal.protein || 0} · C:{meal.carbs || 0} · G:{meal.fats || 0}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-400">{meal.calories}</p>
                      <p className="text-xs text-white/40">kcal</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </AnimatedMount>
        ) : (
          <AnimatedMount delay={50}>
            <EmptyState
              icon={Award}
              title="Sin favoritos"
              description="Guarda tus alimentos favoritos para acceso rápido"
            />
          </AnimatedMount>
        )}
      </div>
    );
  }

  // HISTORY VIEW
  if (view === 'history') {
    const last7Days = Array.from({ length: 7 }, (_, i) => getDateOffset(today, -i));

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('diary')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Historial</h1>
          </div>
        </AnimatedMount>

        {last7Days.map((date, i) => {
          const dayMeals = data.meals.filter(m => m.day_id === date);
          const dayCals = dayMeals.reduce((s, m) => s + (m.calories || 0), 0);
          const dayProt = dayMeals.reduce((s, m) => s + (m.protein || 0), 0);
          const isToday = date === today;

          return (
            <AnimatedMount key={date} delay={50 + i * 25}>
              <Card className={isToday ? 'border-orange-500/30' : ''}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{isToday ? 'Hoy' : formatShortDate(date)}</p>
                    <p className="text-xs text-white/40">{dayMeals.length} registros</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-400">{dayCals} kcal</p>
                    <p className="text-xs text-white/40">{dayProt}g proteína</p>
                  </div>
                </div>
                <ProgressBar value={dayCals} max={localGoals.calories} color="bg-orange-500" />
              </Card>
            </AnimatedMount>
          );
        })}
      </div>
    );
  }

  // INSIGHTS VIEW
  if (view === 'insights') {
    const last7Days = Array.from({ length: 7 }, (_, i) => getDateOffset(today, -i)).reverse();
    const weekCals = last7Days.map(d => data.meals.filter(m => m.day_id === d).reduce((s, m) => s + (m.calories || 0), 0));
    const weekProt = last7Days.map(d => data.meals.filter(m => m.day_id === d).reduce((s, m) => s + (m.protein || 0), 0));
    const avgCals = Math.round(weekCals.reduce((a, b) => a + b, 0) / 7);
    const avgProt = Math.round(weekProt.reduce((a, b) => a + b, 0) / 7);

    return (
      <div className="space-y-4 pb-24">
        <AnimatedMount>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('diary')} className="p-2 hover:bg-white/10 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Insights</h1>
          </div>
        </AnimatedMount>

        <AnimatedMount delay={50}>
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20">
            <p className="text-sm text-white/60 mb-2">Promedio semanal</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-400">{avgCals}</p>
                <p className="text-xs text-white/40">kcal/día</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400">{avgProt}g</p>
                <p className="text-xs text-white/40">proteína/día</p>
              </div>
            </div>
          </Card>
        </AnimatedMount>

        <AnimatedMount delay={100}>
          <Card>
            <p className="text-sm text-white/60 mb-3">Calorías últimos 7 días</p>
            <MiniChart data={weekCals} color="#F97316" height={80} showDots />
            <div className="flex justify-between mt-2 text-[10px] text-white/40">
              {last7Days.map(d => (
                <span key={d}>{new Date(d).getDate()}</span>
              ))}
            </div>
          </Card>
        </AnimatedMount>

        <AnimatedMount delay={150}>
          <Card>
            <p className="text-sm text-white/60 mb-3">Proteína últimos 7 días</p>
            <MiniChart data={weekProt} color="#10B981" height={80} showDots />
            <div className="flex justify-between mt-2 text-[10px] text-white/40">
              {last7Days.map(d => (
                <span key={d}>{new Date(d).getDate()}</span>
              ))}
            </div>
          </Card>
        </AnimatedMount>

        <AnimatedMount delay={200}>
          <Card>
            <p className="text-sm text-white/60 mb-2">Racha de registro</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loggingStreak} días</p>
                <p className="text-xs text-white/40">seguidos registrando</p>
              </div>
            </div>
          </Card>
        </AnimatedMount>
      </div>
    );
  }

  return null;
};

// MEALS HELP MODAL - rendered conditionally in all views
const MealsHelpModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Guía de Nutrición">
    <div className="space-y-4 text-sm">
      <div className="p-3 bg-orange-500/10 rounded-xl">
        <p className="font-bold text-orange-400 mb-1">🍽️ Diario</p>
        <p className="text-white/60">Vista principal con tus calorías y macros del día. Registra cada comida.</p>
      </div>

      <div className="p-3 bg-white/5 rounded-xl">
        <p className="font-bold text-emerald-400 mb-1">📊 Macronutrientes</p>
        <p className="text-white/60">
          <strong>Proteína</strong>: Construcción muscular (1.6-2.2g/kg peso)<br />
          <strong>Carbohidratos</strong>: Energía principal<br />
          <strong>Grasas</strong>: Hormonas y absorción vitaminas
        </p>
      </div>

      <div className="p-3 bg-white/5 rounded-xl">
        <p className="font-bold text-blue-400 mb-1">⚡ Quick Add</p>
        <p className="text-white/60">Añade calorías/macros rápido sin buscar alimentos específicos.</p>
      </div>

      <div className="p-3 bg-white/5 rounded-xl">
        <p className="font-bold text-violet-400 mb-1">🔍 Buscar</p>
        <p className="text-white/60">Base de datos de alimentos. Busca por nombre y selecciona porciones.</p>
      </div>

      <div className="p-3 bg-white/5 rounded-xl">
        <p className="font-bold text-amber-400 mb-1">⭐ Guardados</p>
        <p className="text-white/60">Tus comidas favoritas para añadir rápidamente.</p>
      </div>

      <div className="p-3 bg-white/5 rounded-xl">
        <p className="font-bold text-cyan-400 mb-1">💧 Agua</p>
        <p className="text-white/60">Registra vasos de agua. Meta: 8 vasos (2L) al día.</p>
      </div>

      <div className="p-3 bg-violet-500/20 rounded-xl">
        <p className="font-bold mb-1">💡 Consejos</p>
        <p className="text-white/60">
          • Registra ANTES de comer para mejor control<br />
          • Pesa alimentos al inicio para aprender porciones<br />
          • Prioriza proteína en cada comida<br />
          • La consistencia importa más que la perfección
        </p>
      </div>
    </div>
  </Modal>
);

// ============================================================================
// WORKOUT SCREEN
// ============================================================================

// ============================================================================
// WORKOUT SCREEN - COMPLETE VERSION
// ============================================================================
// ============================================================================
// PLATE CALCULATOR COMPONENT
// ============================================================================
const PlateCalculator = () => {
  const [targetWeight, setTargetWeight] = useState(60);
  const [barWeight, setBarWeight] = useState(20);

  const plates = useMemo(() => {
    const available = [25, 20, 15, 10, 5, 2.5, 1.25];
    const perSide = (targetWeight - barWeight) / 2;
    if (perSide <= 0) return [];

    const result = [];
    let remaining = perSide;

    for (const plate of available) {
      while (remaining >= plate) {
        result.push(plate);
        remaining -= plate;
      }
    }

    return result;
  }, [targetWeight, barWeight]);

  const actualWeight = barWeight + (plates.reduce((s, p) => s + p, 0) * 2);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-white/60 mb-2 block">Peso objetivo (kg)</label>
        <input
          type="number"
          value={targetWeight}
          onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
          className="w-full bg-white/10 rounded-xl p-3 outline-none text-xl font-bold text-center"
          step="2.5"
        />
      </div>

      <div>
        <label className="text-sm text-white/60 mb-2 block">Peso de la barra</label>
        <div className="flex gap-2">
          {[15, 20].map(w => (
            <button
              key={w}
              onClick={() => setBarWeight(w)}
              className={`flex-1 py-2 rounded-lg ${barWeight === w ? 'bg-violet-500' : 'bg-white/10'}`}
            >
              {w}kg
            </button>
          ))}
        </div>
      </div>

      {plates.length > 0 ? (
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-sm text-white/60 mb-3">Discos por lado:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {plates.map((plate, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                  ${plate >= 20 ? 'bg-red-500' : plate >= 15 ? 'bg-yellow-500' : plate >= 10 ? 'bg-green-500' : plate >= 5 ? 'bg-blue-500' : 'bg-white/30'}`}
              >
                {plate}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-white/40 mt-3">
            Peso real: {actualWeight}kg
            {actualWeight !== targetWeight && ` (${targetWeight - actualWeight > 0 ? '-' : '+'}${Math.abs(targetWeight - actualWeight).toFixed(2)}kg)`}
          </p>
        </div>
      ) : (
        <p className="text-center text-white/40 py-4">Solo la barra</p>
      )}
    </div>
  );
};

// ============================================================================
// HABITS SCREEN - Elite Atomic Habits System
// ============================================================================


export default MealsScreen;
