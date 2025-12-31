// SettingsScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState } from 'react';
import { Settings, User, Moon, Sun, Bell, Shield, Trash2, LogOut, ChevronRight, Check, Edit3, Globe, Palette } from 'lucide-react';
import { getToday, generateId } from '../utils/date';
import { Card, Modal, AnimatedMount } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

const SettingsScreen = ({ data, setData, showToast }) => {
  const [showReset, setShowReset] = useState(false);
  const [showEditGoals, setShowEditGoals] = useState(false);
  const [showEditAreas, setShowEditAreas] = useState(false);
  const [goals, setGoals] = useState(data.user.goals);

  // All available areas
  const allAreas = [
    { id: 'nutrition', label: 'Nutrición', icon: Utensils, color: 'text-orange-400', description: 'Comidas, calorías, macros' },
    { id: 'workout', label: 'Entreno', icon: Dumbbell, color: 'text-violet-400', description: 'Ejercicios, rutinas, PRs' },
    { id: 'habits', label: 'Hábitos', icon: CheckSquare, color: 'text-emerald-400', description: 'Seguimiento diario de hábitos' },
    { id: 'work', label: 'Trabajo', icon: Briefcase, color: 'text-blue-400', description: 'Tareas, proyectos, GTD' },
    { id: 'personal', label: 'Personal', icon: Calendar, color: 'text-cyan-400', description: 'Recados, citas, gestiones' },
    { id: 'finances', label: 'Finanzas', icon: Wallet, color: 'text-green-400', description: 'Gastos, ingresos, presupuesto' },
    { id: 'relationships', label: 'Relaciones', icon: Users, color: 'text-pink-400', description: 'CRM personal, contactos' },
    { id: 'consciousness', label: 'Consciencia', icon: Sparkles, color: 'text-purple-400', description: 'Desarrollo personal, meditación' },
    { id: 'body', label: 'Cuerpo', icon: Scale, color: 'text-teal-400', description: 'Peso, medidas, bienestar' }
  ];

  const activeAreas = data.user.activeAreas || allAreas.map(a => a.id);

  const toggleArea = (areaId) => {
    const newAreas = activeAreas.includes(areaId)
      ? activeAreas.filter(a => a !== areaId)
      : [...activeAreas, areaId];

    // Ensure at least one area is active
    if (newAreas.length === 0) {
      showToast('Debe haber al menos un área activa');
      return;
    }

    setData(prev => ({
      ...prev,
      user: { ...prev.user, activeAreas: newAreas }
    }));
  };

  const reset = () => {
    localStorage.removeItem('lifeOS_v58');
    window.location.reload();
  };

  const saveGoals = () => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, goals }
    }));
    setShowEditGoals(false);
    showToast('Objetivos actualizados');
  };

  return (
    <div className="space-y-4 pb-24">
      <AnimatedMount>
        <h1 className="text-2xl font-bold">Configuración</h1>
      </AnimatedMount>

      <AnimatedMount delay={50}>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold">
              {data.user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-xl font-bold">{data.user.name}</p>
              <p className="text-sm text-white/50">Life OS v5.0</p>
            </div>
          </div>
        </Card>
      </AnimatedMount>

      {data.user.mantra && (
        <AnimatedMount delay={75}>
          <Card className="bg-violet-500/10 border-violet-500/20">
            <p className="text-sm text-white/60 mb-1">Tu mantra</p>
            <p className="italic">"{data.user.mantra}"</p>
          </Card>
        </AnimatedMount>
      )}

      {/* Areas Configuration */}
      <AnimatedMount delay={85}>
        <Card onClick={() => setShowEditAreas(true)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Áreas de vida</p>
              <p className="text-xs text-white/40 mt-0.5">{activeAreas.length} de {allAreas.length} activas</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30" />
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {allAreas.filter(a => activeAreas.includes(a.id)).map(area => {
              const Icon = area.icon;
              return (
                <div key={area.id} className={`flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-xs ${area.color}`}>
                  <Icon className="w-3 h-3" />
                  {area.label}
                </div>
              );
            })}
          </div>
        </Card>
      </AnimatedMount>

      <AnimatedMount delay={100}>
        <Card onClick={() => setShowEditGoals(true)}>
          <div className="flex items-center justify-between">
            <p className="font-medium">Objetivos diarios</p>
            <ChevronRight className="w-5 h-5 text-white/30" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Calorías</span>
              <span>{data.user.goals.calories} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Proteína</span>
              <span>{data.user.goals.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Agua</span>
              <span>{data.user.goals.water || 8} vasos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Carbs</span>
              <span>{data.user.goals.carbs}g</span>
            </div>
          </div>
        </Card>
      </AnimatedMount>

      <AnimatedMount delay={125}>
        <Card>
          <p className="font-medium mb-3">Datos almacenados</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Hábitos</span>
              <span>{data.habits.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Registros de hábitos</span>
              <span>{data.habitLogs?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Entrenos</span>
              <span>{data.workouts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Comidas</span>
              <span>{data.meals.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Tareas trabajo</span>
              <span>{data.workTasks?.length || data.tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Tareas personales</span>
              <span>{data.personalTasks?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Relaciones</span>
              <span>{data.relationships?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Interacciones</span>
              <span>{(data.relationships || []).reduce((s, r) => s + (r.interactions?.length || 0), 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Registros peso</span>
              <span>{data.bodyMetrics?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">PRs</span>
              <span>{data.personalRecords?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Transacciones</span>
              <span>{data.finances?.transactions?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Prácticas consciencia</span>
              <span>{data.consciousness?.practices?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Días gratitud</span>
              <span>{Object.keys(data.consciousness?.gratitude || {}).length}</span>
            </div>
          </div>
        </Card>
      </AnimatedMount>

      <AnimatedMount delay={150}>
        <Card className="border-red-500/30">
          <p className="font-medium mb-3 text-red-400">Zona peligrosa</p>
          <button
            onClick={() => setShowReset(true)}
            className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/30"
          >
            <RefreshCw className="w-4 h-4" />
            Resetear todos los datos
          </button>
        </Card>
      </AnimatedMount>

      <Modal isOpen={showReset} onClose={() => setShowReset(false)} title="¿Estás seguro?">
        <p className="text-white/60 mb-4">Se eliminarán permanentemente todos tus datos. Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <button onClick={() => setShowReset(false)} className="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20">
            Cancelar
          </button>
          <button onClick={reset} className="flex-1 py-3 bg-red-500 rounded-xl hover:bg-red-600">
            Eliminar todo
          </button>
        </div>
      </Modal>

      <Modal isOpen={showEditGoals} onClose={() => setShowEditGoals(false)} title="Editar objetivos">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Calorías diarias</label>
            <div className="flex items-center gap-4">
              <input type="range" min="1200" max="4000" step="50" value={goals.calories} onChange={(e) => setGoals(g => ({ ...g, calories: parseInt(e.target.value) }))} className="flex-1 accent-violet-500" />
              <span className="text-xl font-bold w-20 text-right">{goals.calories}</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Proteína (g)</label>
            <div className="flex items-center gap-4">
              <input type="range" min="50" max="300" step="5" value={goals.protein} onChange={(e) => setGoals(g => ({ ...g, protein: parseInt(e.target.value) }))} className="flex-1 accent-violet-500" />
              <span className="text-xl font-bold w-20 text-right">{goals.protein}g</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Carbohidratos (g)</label>
            <div className="flex items-center gap-4">
              <input type="range" min="50" max="400" step="10" value={goals.carbs} onChange={(e) => setGoals(g => ({ ...g, carbs: parseInt(e.target.value) }))} className="flex-1 accent-violet-500" />
              <span className="text-xl font-bold w-20 text-right">{goals.carbs}g</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Grasas (g)</label>
            <div className="flex items-center gap-4">
              <input type="range" min="30" max="150" step="5" value={goals.fats} onChange={(e) => setGoals(g => ({ ...g, fats: parseInt(e.target.value) }))} className="flex-1 accent-violet-500" />
              <span className="text-xl font-bold w-20 text-right">{goals.fats}g</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Vasos de agua</label>
            <div className="flex items-center gap-4">
              <input type="range" min="4" max="12" step="1" value={goals.water || 8} onChange={(e) => setGoals(g => ({ ...g, water: parseInt(e.target.value) }))} className="flex-1 accent-blue-500" />
              <span className="text-xl font-bold w-20 text-right">{goals.water || 8} 💧</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block flex items-center gap-2">
              Pasos diarios <Watch className="w-3 h-3 text-white/40" /> <Smartphone className="w-3 h-3 text-white/40" />
            </label>
            <div className="flex items-center gap-4">
              <input type="range" min="5000" max="20000" step="1000" value={goals.steps || 10000} onChange={(e) => setGoals(g => ({ ...g, steps: parseInt(e.target.value) }))} className="flex-1 accent-green-500" />
              <span className="text-xl font-bold w-24 text-right">{((goals.steps || 10000) / 1000).toFixed(0)}k 👟</span>
            </div>
            <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
              <Watch className="w-3 h-3" /> Se sincronizará automáticamente con Apple Watch / Google Fit
            </p>
          </div>
        </div>
        <button onClick={saveGoals} className="w-full bg-violet-500 py-4 rounded-xl font-medium mt-4">
          Guardar cambios
        </button>
      </Modal>

      {/* Edit Areas Modal */}
      <Modal isOpen={showEditAreas} onClose={() => setShowEditAreas(false)} title="Áreas de vida">
        <p className="text-sm text-white/50 mb-4">Activa las áreas que quieres trabajar. Las áreas desactivadas se ocultarán de toda la app.</p>
        <div className="space-y-2">
          {allAreas.map(area => {
            const Icon = area.icon;
            const isActive = activeAreas.includes(area.id);
            return (
              <button
                key={area.id}
                onClick={() => toggleArea(area.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-white/10 border border-white/20' : 'bg-white/5 opacity-50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
                  <Icon className={`w-5 h-5 ${area.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{area.label}</p>
                  <p className="text-xs text-white/40">{area.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-500' : 'bg-white/10'}`}>
                  {isActive && <Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================// Main App Component
export default function LifeOSApp() {
  const [rawData, setData] = useLocalStorage('lifeOS_v58', EMPTY_DATA);
  const [screen, setScreen] = useState('today');
  const [toast, setToast] = useState(null);
  const [hubOpen, setHubOpen] = useState(false); // Hub menu state - must be before any conditional returns
  const [showTour, setShowTour] = useState(false); // Interactive tour state

  // Normalize data to ensure all arrays exist (protects against corrupted localStorage)
  const data = useMemo(() => ({
    ...EMPTY_DATA,
    ...rawData,
    user: { ...EMPTY_DATA.user, ...(rawData?.user || {}) },
    meals: rawData?.meals || [],
    workouts: rawData?.workouts || [],
    tasks: rawData?.tasks || [],
    habits: rawData?.habits || [],
    habitLogs: rawData?.habitLogs || [],
    projects: rawData?.projects || [],
    journals: rawData?.journals || [],
    bodyMetrics: rawData?.bodyMetrics || [],
    relationships: rawData?.relationships || [],
    workoutTemplates: rawData?.workoutTemplates || [],
    savedMeals: rawData?.savedMeals || [],
    plannedMeals: rawData?.plannedMeals || [],
    customFoods: rawData?.customFoods || [],
    recipes: rawData?.recipes || [],
    personalTasks: rawData?.personalTasks || [],
    personalCategories: rawData?.personalCategories || [],
    personalRecords: rawData?.personalRecords || [],
    workTasks: rawData?.workTasks || [],
    workProjects: rawData?.workProjects || [],
    days: rawData?.days || {},
    scheduledWorkouts: Array.isArray(rawData?.scheduledWorkouts) ? rawData.scheduledWorkouts : [],
    recurringWorkouts: Array.isArray(rawData?.recurringWorkouts) ? rawData.recurringWorkouts : [],
    finances: { transactions: [], monthlyBudget: 0, ...(rawData?.finances || {}) },
    goals: { annual: [], quarterly: [], monthly: [], ...(rawData?.goals || {}) }
  }), [rawData]);

  // Listen for goToSettings event from global header
  useEffect(() => {
    const handleGoToSettings = () => setScreen('settings');
    window.addEventListener('goToSettings', handleGoToSettings);
    return () => window.removeEventListener('goToSettings', handleGoToSettings);
  }, []);

  // Listen for startTour event from profile menu
  useEffect(() => {
    const handleStartTour = () => setShowTour(true);
    window.addEventListener('startTour', handleStartTour);
    return () => window.removeEventListener('startTour', handleStartTour);
  }, []);

  // Auto-start tour after onboarding - DISABLED until tour is more complete
  // useEffect(() => {
  //   if (data.user?.onboardingComplete && !data.user?.tourCompleted) {
  //     const timer = setTimeout(() => setShowTour(true), 500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [data.user?.onboardingComplete, data.user?.tourCompleted]);



  // Listen for toggleDemoData event from profile menu
  useEffect(() => {
    const handleToggleDemoData = () => {
      const isDemoEnabled = data.user?.demoDataEnabled;
      if (isDemoEnabled) {
        // Deactivate demo - clear all data except user settings
        setData(prev => ({
          ...EMPTY_DATA,
          user: {
            ...prev.user,
            demoDataEnabled: false
          }
        }));
        setToast({ message: 'Datos demo desactivados', type: 'success' });
      } else {
        // Activate demo - load demo data
        const demoData = generateDemoData();
        setData(prev => ({
          ...demoData,
          user: {
            ...demoData.user,
            name: prev.user?.name || 'Demo',
            mantra: prev.user?.mantra || demoData.user.mantra,
            goals: prev.user?.goals || demoData.user.goals,
            demoDataEnabled: true
          }
        }));
        setToast({ message: 'Datos demo activados - ahora puedes ver todo en acción', type: 'success' });
      }
    };
    window.addEventListener('toggleDemoData', handleToggleDemoData);
    return () => window.removeEventListener('toggleDemoData', handleToggleDemoData);
  }, [data, setData]);

  // Migration: Add new features to activeAreas if not present
  useEffect(() => {
    // Add 'consciousness' to activeAreas if not present
    if (data.user?.activeAreas && !data.user.activeAreas.includes('consciousness')) {
      setData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          activeAreas: [...prev.user.activeAreas, 'consciousness']
        }
      }));
    }

    // Add 'personal' to activeAreas if not present
    if (data.user?.activeAreas && !data.user.activeAreas.includes('personal')) {
      setData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          activeAreas: [...prev.user.activeAreas, 'personal']
        },
        personalTasks: prev.personalTasks || []
      }));
    }

    // Add 'relationships' to activeAreas if not present
    if (data.user?.activeAreas && !data.user.activeAreas.includes('relationships')) {
      setData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          activeAreas: [...prev.user.activeAreas, 'relationships']
        }
      }));
    }

    // Initialize empty arrays if not present (no demo data)
    if (!data.relationships) {
      setData(prev => ({ ...prev, relationships: [] }));
    }

    if (!data.personalCategories) {
      setData(prev => ({
        ...prev,
        personalCategories: [
          { id: 'home', name: 'Hogar', icon: '🏠', color: '#10B981' },
          { id: 'admin', name: 'Admin', icon: '📋', color: '#6366F1' },
          { id: 'health', name: 'Salud', icon: '❤️', color: '#EF4444' },
          { id: 'social', name: 'Social', icon: '👥', color: '#F59E0B' },
          { id: 'travel', name: 'Viajes', icon: '✈️', color: '#3B82F6' },
          { id: 'learning', name: 'Aprendizaje', icon: '📚', color: '#8B5CF6' },
          { id: 'projects', name: 'Proyectos', icon: '🚀', color: '#EC4899' }
        ]
      }));
    }

    // Add subtasks to existing personalTasks if not present
    if (data.personalTasks && data.personalTasks.some(t => !t.subtasks)) {
      setData(prev => ({
        ...prev,
        personalTasks: prev.personalTasks.map(t => ({
          ...t,
          subtasks: t.subtasks || []
        }))
      }));
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  if (!data.user.onboardingComplete) {
    return <OnboardingWizard data={data} setData={setData} onComplete={() => setScreen('today')} />;
  }

  const screens = {
    today: <TodayScreen data={data} setData={setData} setScreen={setScreen} showToast={showToast} />,
    meals: <MealsScreen data={data} setData={setData} showToast={showToast} />,
    workout: <WorkoutScreen data={data} setData={setData} showToast={showToast} />,
    habits: <HabitsScreen data={data} setData={setData} showToast={showToast} />,
    work: <WorkScreen data={data} setData={setData} showToast={showToast} />,
    personal: <PersonalScreen data={data} setData={setData} showToast={showToast} />,
    body: <BodyScreen data={data} setData={setData} showToast={showToast} />,
    control: <ControlScreen data={data} setData={setData} showToast={showToast} />,
    finances: <FinancesScreen data={data} setData={setData} showToast={showToast} />,
    calendar: <CalendarScreen data={data} setData={setData} setScreen={setScreen} showToast={showToast} />,
    weekly: <WeeklyScreen data={data} />,
    stats: <StatsScreen data={data} setScreen={setScreen} />,
    settings: <SettingsScreen data={data} setData={setData} showToast={showToast} />,
    consciousness: <ConsciousnessScreen data={data} setData={setData} showToast={showToast} />,
    relationships: <RelationshipsScreen data={data} setData={setData} showToast={showToast} />,
  };

  // Calculate badge for habits
  const today = getToday();
  const todayHabitLogs = data.habitLogs?.filter(l => l.date === today) || [];
  const habitsRemaining = data.habits.length - todayHabitLogs.filter(l => l.completed).length;

  // Calculate badge for personal tasks
  const personalTasksDue = (data.personalTasks || []).filter(t => !t.completed && t.dueDate && t.dueDate <= today).length;


  // Active areas from user settings
  const activeAreas = data.user.activeAreas || ['nutrition', 'workout', 'habits', 'work', 'personal', 'body', 'finances', 'consciousness', 'relationships'];

  // Map screen ids to area ids
  const screenToArea = {
    'meals': 'nutrition',
    'workout': 'workout',
    'habits': 'habits',
    'work': 'work',
    'personal': 'personal',
    'body': 'body',
    'finances': 'finances',
    'consciousness': 'consciousness'
  };

  // Hub menu items - filtered by active areas
  const allHubItems = [
    { id: 'consciousness', areaId: 'consciousness', icon: Sparkles, label: 'Conciencia', color: 'text-violet-400', bg: 'bg-violet-900' },
    { id: 'relationships', areaId: 'relationships', icon: Heart, label: 'Relaciones', color: 'text-pink-400', bg: 'bg-pink-900' },
    { id: 'finances', areaId: 'finances', icon: Wallet, label: 'Finanzas', color: 'text-green-400', bg: 'bg-green-900' },
    { id: 'personal', areaId: 'personal', icon: Calendar, label: 'Personal', color: 'text-cyan-400', bg: 'bg-cyan-900', badge: personalTasksDue > 0 ? personalTasksDue : null },
    { id: 'workout', areaId: 'workout', icon: Dumbbell, label: 'Entreno', color: 'text-violet-400', bg: 'bg-violet-900' },
    { id: 'work', areaId: 'work', icon: Briefcase, label: 'Trabajo', color: 'text-blue-400', bg: 'bg-blue-900' },
    { id: 'habits', areaId: 'habits', icon: CheckSquare, label: 'Hábitos', color: 'text-emerald-400', bg: 'bg-emerald-900', badge: habitsRemaining > 0 ? habitsRemaining : null },
    { id: 'meals', areaId: 'nutrition', icon: Utensils, label: 'Comidas', color: 'text-orange-400', bg: 'bg-orange-900' },
  ];

  const hubItems = allHubItems.filter(item => activeAreas.includes(item.areaId));

  const handleHubSelect = (id) => {
    setScreen(id);
    setHubOpen(false);
  };

  // Check if current screen is a hub screen
  const hubScreenIds = [...hubItems.map(h => h.id), 'settings'];
  const isHubScreen = hubScreenIds.includes(screen);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/50 via-zinc-950 to-fuchsia-950/30 pointer-events-none" />

      {/* Settings button - moved to global header, keeping this hidden */}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Main content */}
      <div className="relative max-w-md mx-auto px-4 pt-6">
        {screens[screen]}
      </div>

      {/* Hub overlay */}
      {hubOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={() => setHubOpen(false)}
        />
      )}

      {/* Hub menu - Grid layout for 7 items */}
      {hubOpen && (
        <div
          className="fixed bottom-24 left-1/2 z-50 bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 p-4 shadow-2xl"
          style={{
            transform: 'translateX(-50%)',
            animation: 'hub-menu-appear 0.2s ease-out'
          }}
        >
          {/* Top row - 4 items */}
          <div className="flex gap-3 mb-3">
            {hubItems.slice(0, 4).map((item, i) => (
              <button
                key={item.id}
                onClick={() => handleHubSelect(item.id)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/10 transition-all group"
                style={{ animation: `hub-item-appear 0.2s ease-out ${i * 0.03}s both` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} border border-white/20 flex items-center justify-center group-hover:scale-105 group-hover:border-white/40 transition-all relative shadow-lg`}>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold shadow">
                      {item.badge}
                    </span>
                  )}
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-[11px] text-white/70 font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom row - remaining items centered */}
          <div className="flex justify-center gap-3">
            {hubItems.slice(4).map((item, i) => (
              <button
                key={item.id}
                onClick={() => handleHubSelect(item.id)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/10 transition-all group"
                style={{ animation: `hub-item-appear 0.2s ease-out ${(i + 4) * 0.03}s both` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} border border-white/20 flex items-center justify-center group-hover:scale-105 group-hover:border-white/40 transition-all relative shadow-lg`}>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold shadow">
                      {item.badge}
                    </span>
                  )}
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-[11px] text-white/70 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 z-50" data-tour="navigation">
        <div className="max-w-md mx-auto flex justify-around py-2 px-4">
          <NavItem icon={Sun} label="Acción" active={screen === 'today' || screen === 'weekly'} onClick={() => { setHubOpen(false); setScreen('today'); }} />
          <NavItem icon={Calendar} label="Calendario" active={screen === 'calendar'} onClick={() => { setHubOpen(false); setScreen('calendar'); }} />

          {/* Center Áreas Button */}
          <button
            data-tour="hub"
            onClick={() => setHubOpen(!hubOpen)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
          >
            <div
              className={`w-14 h-14 -mt-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${hubOpen
                ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600 rotate-45 scale-110'
                : isHubScreen
                  ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600'
                  : 'bg-gradient-to-br from-zinc-800 to-zinc-700 border border-white/20'
                }`}
              style={{
                boxShadow: hubOpen
                  ? '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)'
                  : '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              <LayoutGrid className={`w-6 h-6 text-white transition-transform duration-300 ${hubOpen ? 'rotate-90' : ''}`} />
            </div>
            <span className={`text-xs mt-0.5 transition-colors ${hubOpen || isHubScreen ? 'text-violet-400' : 'text-white/50'}`}>
              Áreas
            </span>
          </button>

          <NavItem icon={Activity} label="Control" active={screen === 'control'} onClick={() => { setHubOpen(false); setScreen('control'); }} />
          <NavItem icon={BarChart3} label="Stats" active={screen === 'stats'} onClick={() => { setHubOpen(false); setScreen('stats'); }} />
        </div>
      </div>

      {/* Interactive Tour */}
      {showTour && (
        <InteractiveTour
          onComplete={() => {
            // Mark tour as completed
            setData(prev => ({
              ...prev,
              user: { ...prev.user, tourCompleted: true }
            }));
            setShowTour(false);
            showToast('¡Tour completado! Explora cada área cuando quieras 🎉', 'success');
          }}
          onSkip={() => {
            // Mark tour as completed even if skipped
            setData(prev => ({
              ...prev,
              user: { ...prev.user, tourCompleted: true }
            }));
            setShowTour(false);
          }}
        />
      )}

      {/* Animations */}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-down {
          from { transform: translateY(-20px) translateX(-50%); opacity: 0; }
          to { transform: translateY(0) translateX(-50%); opacity: 1; }
        }
        @keyframes hub-menu-appear {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(20px) scale(0.9);
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        @keyframes hub-item-appear {
          from { 
            opacity: 0; 
            transform: scale(0.8);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        
        /* Custom date input styling */
        input[type="date"] {
          color-scheme: dark;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: white;
          font-size: 0.875rem;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.5);
          cursor: pointer;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          filter: invert(1) opacity(0.8);
        }
        input[type="date"]:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }
        
        /* Custom select styling */
        select {
          color-scheme: dark;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1rem;
          padding-right: 2rem;
        }
        select:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }
        select option {
          background: #1a1a2e;
          color: white;
          padding: 0.5rem;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}


export default SettingsScreen;
