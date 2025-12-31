import React from 'react';
import {
    Target, CheckSquare, Calendar, Clock, Flame, Zap,
    TrendingUp, ArrowRight, Play, Battery, Sun, Moon,
    Plus, ChevronRight, BarChart3, Crown
} from 'lucide-react';
import RadarChart from './RadarChart';
import AvatarWidget from './AvatarWidget';
import { AllAreasAvatarGrid, AreaAvatarCard } from './AreaAvatars';



/**
 * Desktop Dashboard - Bento-style grid of widgets for the home screen
 * Shows overview of today's key information in organized cards
 */
const DesktopDashboard = ({
    data,
    setScreen,
    onStartFocus,
    showToast,
    hubItems = []
}) => {
    const today = new Date().toISOString().split('T')[0];


    // Get today's data
    const todayTasks = (data.workTasks || []).filter(t => t.due === today && t.status !== 'done');
    const priorityTasks = todayTasks.slice(0, 3);

    const habits = data.habits || [];
    const habitLogs = data.habitLogs || [];
    const todayHabitLogs = habitLogs.filter(l => l.date === today);
    const completedHabits = todayHabitLogs.filter(l => l.completed).length;

    const currentStreak = data.user?.streak || 0;
    const energyLevel = data.user?.energy || 3;

    // Deep work stats
    const deepWorkBlocks = data.deepWorkBlocks || [];
    const todayBlocks = deepWorkBlocks.filter(b => b.date === today);
    const todayDeepWork = todayBlocks.reduce((sum, b) => sum + (b.duration || 0), 0);
    const deepWorkGoal = data.user?.workSettings?.dailyDeepWorkGoal || 4;

    // Upcoming events (simulated)
    const upcomingEvents = [
        { id: 1, title: 'Revisión semanal', time: '10:00', type: 'meeting' },
        { id: 2, title: 'Deep work block', time: '14:00', type: 'focus' },
    ];

    // Widget Card base component
    const WidgetCard = ({ children, className = '', onClick, span = 1 }) => (
        <div
            className={`
        bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5
        hover:bg-white/[0.05] hover:border-white/20 transition-all
        ${onClick ? 'cursor-pointer' : ''}
        ${span === 2 ? 'col-span-2' : ''}
        ${span === 3 ? 'col-span-3' : ''}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );

    // Widget Header
    const WidgetHeader = ({ icon: Icon, title, action, onAction }) => (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-white/60" />
                <h3 className="font-semibold text-sm">{title}</h3>
            </div>
            {action && (
                <button
                    onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                    {action} <ChevronRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );

    return (
        <div className="grid grid-cols-4 gap-4 auto-rows-min">
            {/* Row 1: Focus + Priority Tasks (2 cols) + Calendar (1 col) + Stats (1 col) */}

            {/* Today's Focus - Large Card */}
            <WidgetCard span={2} className="row-span-2">
                <WidgetHeader icon={Target} title="Enfoque del Día" action="Ver todo" onAction={() => setScreen('today')} />

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-2xl font-bold text-violet-400">{priorityTasks.length}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-wide">Pendientes</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-2xl font-bold text-emerald-400">{todayDeepWork}h</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-wide">Deep Work</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-2xl font-bold text-amber-400">{energyLevel}/5</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-wide">Energía</p>
                    </div>
                </div>

                {/* Priority Tasks */}
                <div className="space-y-2">
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Tareas prioritarias</p>
                    {priorityTasks.length > 0 ? (
                        priorityTasks.map((task, i) => (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-violet-500/20 text-violet-400' :
                                    i === 1 ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-white/10 text-white/60'
                                    }`}>
                                    {i + 1}
                                </div>
                                <span className="flex-1 text-sm truncate">{task.title}</span>
                                <button className="p-1.5 rounded-lg hover:bg-white/10">
                                    <Play className="w-4 h-4 text-violet-400" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-white/40">
                            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Sin tareas para hoy</p>
                            <button
                                onClick={() => setScreen('work')}
                                className="mt-3 text-xs text-violet-400 hover:text-violet-300"
                            >
                                + Añadir tarea
                            </button>
                        </div>
                    )}
                </div>

                {/* Start Focus Button */}
                <button
                    onClick={onStartFocus}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-medium text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4" />
                    Iniciar Sesión de Enfoque
                </button>
            </WidgetCard>

            {/* Mini Calendar */}
            <WidgetCard onClick={() => setScreen('calendar')}>
                <WidgetHeader icon={Calendar} title="Calendario" />
                <div className="space-y-2">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                            <div className={`w-1 h-8 rounded-full ${event.type === 'meeting' ? 'bg-blue-500' : 'bg-violet-500'
                                }`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{event.title}</p>
                                <p className="text-xs text-white/40">{event.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </WidgetCard>

            {/* Avatar / Profile Widget */}
            <WidgetCard onClick={() => setScreen('settings')}>
                <WidgetHeader icon={Crown} title="Tu Nivel" />
                <AvatarWidget
                    areaScores={calculateAreaScores()}
                    totalXP={data.user?.totalXP || currentStreak * 10}
                    userName={data.user?.name?.split(' ')[0] || 'Usuario'}
                    isCompact={true}
                    onClick={() => setScreen('stats')}
                />
            </WidgetCard>


            {/* Row 2: Habits + Energy + Quick Actions */}

            {/* Habits Widget */}
            <WidgetCard span={2} onClick={() => setScreen('habits')}>
                <WidgetHeader icon={CheckSquare} title="Hábitos de Hoy" action="Ver todos" onAction={() => setScreen('habits')} />
                <div className="flex items-center gap-4">
                    {/* Progress Ring */}
                    <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="6"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                fill="none"
                                stroke="url(#habitGradient)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={201}
                                strokeDashoffset={201 - (201 * completedHabits / Math.max(habits.length, 1))}
                            />
                            <defs>
                                <linearGradient id="habitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{completedHabits}/{habits.length}</span>
                        </div>
                    </div>

                    {/* Habit List Preview */}
                    <div className="flex-1 space-y-1">
                        {habits.slice(0, 4).map(habit => {
                            const isComplete = todayHabitLogs.some(l => l.habit_id === habit.id && l.completed);
                            return (
                                <div key={habit.id} className="flex items-center gap-2 text-sm">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isComplete ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'
                                        }`}>
                                        {isComplete && <span className="text-[10px]">✓</span>}
                                    </div>
                                    <span className={isComplete ? 'text-white/50 line-through' : ''}>{habit.name}</span>
                                </div>
                            );
                        })}
                        {habits.length > 4 && (
                            <p className="text-xs text-white/40">+{habits.length - 4} más</p>
                        )}
                    </div>
                </div>
            </WidgetCard>

            {/* Energy Level */}
            <WidgetCard onClick={() => setScreen('control')}>
                <WidgetHeader icon={Battery} title="Energía" />
                <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(level => (
                        <div
                            key={level}
                            className={`flex-1 h-8 rounded-lg transition-all ${level <= energyLevel
                                ? level <= 2 ? 'bg-red-500/60' : level <= 3 ? 'bg-yellow-500/60' : 'bg-emerald-500/60'
                                : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
                <p className="text-xs text-white/40 mt-2 text-center">
                    {energyLevel <= 2 ? 'Descanso recomendado' : energyLevel <= 3 ? 'Energía moderada' : 'Alta energía'}
                </p>
            </WidgetCard>

            {/* Quick Actions */}
            <WidgetCard>
                <WidgetHeader icon={Zap} title="Acciones" />
                <div className="space-y-2">
                    <button
                        onClick={() => setScreen('work')}
                        className="w-full flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva tarea
                    </button>
                    <button
                        onClick={() => setScreen('meals')}
                        className="w-full flex items-center gap-2 p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Registrar comida
                    </button>
                    <button
                        onClick={() => setScreen('workout')}
                        className="w-full flex items-center gap-2 p-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Entrenar
                    </button>
                </div>
            </WidgetCard>

            {/* Row 3: Life Radar + Stats Overview */}
            <WidgetCard span={2} onClick={() => setScreen('stats')}>
                <WidgetHeader icon={TrendingUp} title="Radar de Vida" action="Estadísticas" onAction={() => setScreen('stats')} />
                <div className="flex items-center justify-center">
                    <RadarChart
                        data={calculateAreaScores()}
                        areas={hubItems.map(item => ({
                            ...item,
                            emoji: getAreaEmoji(item.id),
                            shortLabel: item.label.substring(0, 6)
                        }))}
                        size={280}
                        showLabels={true}
                        showValues={false}
                    />
                </div>
            </WidgetCard>

            {/* Weekly Stats */}
            <WidgetCard span={2}>
                <WidgetHeader icon={BarChart3} title="Progreso Semanal" action="Ver más" onAction={() => setScreen('stats')} />
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-violet-500/20 flex items-center justify-center">
                            <Target className="w-6 h-6 text-violet-400" />
                        </div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-white/50">Tareas</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <CheckSquare className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-bold">{Math.round((completedHabits / Math.max(habits.length, 1)) * 100)}%</p>
                        <p className="text-xs text-white/50">Hábitos</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold">{deepWorkGoal * 5}h</p>
                        <p className="text-xs text-white/50">Deep Work</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <Flame className="w-6 h-6 text-orange-400" />
                        </div>
                        <p className="text-2xl font-bold">{currentStreak}</p>
                        <p className="text-xs text-white/50">Racha</p>
                    </div>
                </div>
            </WidgetCard>

        </div>


    );

    // Helper function to calculate area scores
    function calculateAreaScores() {
        const scores = {};

        // Habits score
        const habitsScore = habits.length > 0
            ? Math.round((completedHabits / habits.length) * 100)
            : 50;
        scores['habits'] = habitsScore;

        // Work score (based on completed tasks)
        const workTasks = data.workTasks || [];
        const completedWork = workTasks.filter(t => t.status === 'done').length;
        scores['work'] = workTasks.length > 0
            ? Math.round((completedWork / workTasks.length) * 100)
            : 50;

        // Workout score
        const workouts = data.workouts || [];
        const thisWeekWorkouts = workouts.filter(w => {
            const wDate = new Date(w.date);
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return wDate >= weekAgo;
        }).length;
        scores['workout'] = Math.min(100, thisWeekWorkouts * 20); // 5 workouts = 100%

        // Nutrition score
        const meals = data.meals || [];
        const todayMeals = meals.filter(m => m.date === today).length;
        scores['nutrition'] = Math.min(100, todayMeals * 33);

        // Rest score
        const rest = data.rest?.sleepLogs || [];
        const lastSleep = rest[rest.length - 1];
        scores['rest'] = lastSleep ? Math.min(100, (lastSleep.duration / 8) * 100) : 50;

        // Consciousness score
        const consciousness = data.consciousness || {};
        scores['consciousness'] = consciousness.totalXP ? Math.min(100, consciousness.totalXP / 10) : 30;

        // Learning score
        const learning = data.learning || {};
        const readBooks = learning.resources?.filter(r => r.status === 'completed').length || 0;
        scores['learning'] = Math.min(100, readBooks * 25);

        // Personal tasks score
        const personalTasks = data.personalTasks || [];
        const completedPersonal = personalTasks.filter(t => t.completed).length;
        scores['personal'] = personalTasks.length > 0
            ? Math.round((completedPersonal / personalTasks.length) * 100)
            : 50;

        // Finances score (based on savings goals progress)
        const finances = data.finances || {};
        scores['finances'] = finances.savingsGoals?.length > 0 ? 60 : 40;

        // Relationships score
        const relationships = data.relationships || [];
        scores['relationships'] = relationships.length > 0 ? 70 : 40;

        // Creativity score
        const creativeProjects = data.creativeProjects || [];
        scores['creativity'] = creativeProjects.length > 0 ? 65 : 35;

        // Experiences score
        const experiences = data.experiences?.items || [];
        const thisYearExp = experiences.filter(e => e.date?.startsWith(new Date().getFullYear().toString())).length;
        scores['experiences'] = Math.min(100, thisYearExp * 10);

        return scores;
    }

    // Helper to get emoji for each area
    function getAreaEmoji(areaId) {
        const emojis = {
            'rest': '🌙',
            'meals': '🍎',
            'workout': '🏋️',
            'consciousness': '✨',
            'work': '💼',
            'habits': '✅',
            'personal': '📋',
            'learning': '📚',
            'finances': '💰',
            'relationships': '💕',
            'creativity': '💡',
            'experiences': '🌟'
        };
        return emojis[areaId] || '●';
    }
};

export default DesktopDashboard;

