// AppPageV2 - Complete rewrite with 100% Supabase integration
// This replaces AppPage.jsx with a clean, modern implementation
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNutrition } from '../hooks/useNutrition';
import { useDayMetrics } from '../hooks/useDayMetrics';
import {
    Utensils, Dumbbell, Target, CheckSquare, Calendar,
    BarChart3, Plus, ChevronLeft, ChevronRight, Settings,
    LogOut, User, Home
} from 'lucide-react';

// Helper functions
const getToday = () => new Date().toISOString().split('T')[0];
const formatDate = (d) => new Date(d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return { text: 'Buenas noches', icon: '🌙' };
    if (h < 12) return { text: 'Buenos días', icon: '☀️' };
    if (h < 18) return { text: 'Buenas tardes', icon: '🌤️' };
    return { text: 'Buenas noches', icon: '🌙' };
};

export default function AppPageV2() {
    const { user, signOut } = useAuth();
    const [screen, setScreen] = useState('today');
    const [selectedDate, setSelectedDate] = useState(getToday());

    // Load data with hooks
    const {
        foods,
        meals,
        loading: nutritionLoading,
        loadMeals,
        addMeal,
        deleteMeal,
    } = useNutrition();

    const {
        dayData,
        loading: dayLoading,
        updateWater,
        updateSteps,
    } = useDayMetrics(selectedDate);

    // Load meals when date changes
    useEffect(() => {
        if (user) {
            loadMeals(selectedDate);
        }
    }, [selectedDate, user]);

    const greeting = getGreeting();
    const userName = user?.user_metadata?.name || 'Usuario';

    // Navigation items
    const navItems = [
        { id: 'today', label: 'Hoy', icon: Home },
        { id: 'nutrition', label: 'Nutrición', icon: Utensils },
        { id: 'workout', label: 'Entreno', icon: Dumbbell },
        { id: 'habits', label: 'Hábitos', icon: Target },
        { id: 'work', label: 'Trabajo', icon: CheckSquare },
        { id: 'stats', label: 'Stats', icon: BarChart3 },
    ];

    const handleLogout = async () => {
        await signOut();
    };

    if (nutritionLoading || dayLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-300">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            {/* Header */}
            <header className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Life OS</h1>
                            <p className="text-sm text-slate-400">{greeting.icon} {greeting.text}, {userName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-slate-900/30 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-2 overflow-x-auto py-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = screen === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setScreen(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${isActive
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Date Selector */}
                <div className="flex items-center justify-between mb-6 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                    <button
                        onClick={() => {
                            const d = new Date(selectedDate);
                            d.setDate(d.getDate() - 1);
                            setSelectedDate(d.toISOString().split('T')[0]);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-300" />
                    </button>

                    <div className="text-center">
                        <p className="text-lg font-semibold text-white">{formatDate(selectedDate)}</p>
                        <p className="text-sm text-slate-400">{selectedDate}</p>
                    </div>

                    <button
                        onClick={() => {
                            const d = new Date(selectedDate);
                            d.setDate(d.getDate() + 1);
                            setSelectedDate(d.toISOString().split('T')[0]);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                </div>

                {/* Screen Content */}
                {screen === 'today' && (
                    <TodayScreen
                        meals={meals}
                        dayData={dayData}
                        selectedDate={selectedDate}
                    />
                )}

                {screen === 'nutrition' && (
                    <NutritionScreen
                        meals={meals}
                        foods={foods}
                        selectedDate={selectedDate}
                        addMeal={addMeal}
                        deleteMeal={deleteMeal}
                    />
                )}

                {screen === 'workout' && (
                    <div className="text-center py-12 text-slate-400">
                        <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Módulo de Entrenamiento - Próximamente</p>
                    </div>
                )}

                {screen === 'habits' && (
                    <div className="text-center py-12 text-slate-400">
                        <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Módulo de Hábitos - Próximamente</p>
                    </div>
                )}

                {screen === 'work' && (
                    <div className="text-center py-12 text-slate-400">
                        <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Módulo de Trabajo - Próximamente</p>
                    </div>
                )}

                {screen === 'stats' && (
                    <div className="text-center py-12 text-slate-400">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Estadísticas - Próximamente</p>
                    </div>
                )}
            </main>
        </div>
    );
}

// Today Screen Component
function TodayScreen({ meals, dayData, selectedDate }) {
    const totalCalories = meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;
    const totalProtein = meals?.reduce((sum, m) => sum + (m.protein || 0), 0) || 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Calories Card */}
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Calorías</span>
                        <Utensils className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{totalCalories}</p>
                    <p className="text-sm text-slate-400">kcal</p>
                </div>

                {/* Protein Card */}
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Proteína</span>
                        <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{totalProtein}g</p>
                    <p className="text-sm text-slate-400">proteína</p>
                </div>

                {/* Meals Card */}
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Comidas</span>
                        <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{meals?.length || 0}</p>
                    <p className="text-sm text-slate-400">registradas</p>
                </div>
            </div>

            {/* Recent Meals */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Comidas de Hoy</h3>
                {meals && meals.length > 0 ? (
                    <div className="space-y-2">
                        {meals.map((meal) => (
                            <div key={meal.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">{meal.name}</p>
                                    <p className="text-sm text-slate-400">{meal.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white">{meal.calories} kcal</p>
                                    <p className="text-sm text-slate-400">{meal.protein}g proteína</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-8">No hay comidas registradas hoy</p>
                )}
            </div>
        </div>
    );
}

// Nutrition Screen Component  
function NutritionScreen({ meals, foods, selectedDate, addMeal, deleteMeal }) {
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [newMeal, setNewMeal] = useState({
        name: '',
        meal_type: 'almuerzo',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        time: new Date().toTimeString().slice(0, 5)
    });

    const handleAddMeal = async () => {
        if (!newMeal.name) return;

        await addMeal({
            ...newMeal,
            date: selectedDate
        });

        setNewMeal({
            name: '',
            meal_type: 'almuerzo',
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            time: new Date().toTimeString().slice(0, 5)
        });
        setShowAddMeal(false);
    };

    const handleDeleteMeal = async (mealId) => {
        await deleteMeal(mealId, selectedDate);
    };

    const totalCalories = meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;
    const totalProtein = meals?.reduce((sum, m) => sum + (m.protein || 0), 0) || 0;
    const totalCarbs = meals?.reduce((sum, m) => sum + (m.carbs || 0), 0) || 0;
    const totalFats = meals?.reduce((sum, m) => sum + (m.fats || 0), 0) || 0;

    return (
        <div className="space-y-6">
            {/* Macros Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                    <p className="text-slate-400 text-sm mb-1">Calorías</p>
                    <p className="text-2xl font-bold text-white">{totalCalories}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                    <p className="text-slate-400 text-sm mb-1">Proteína</p>
                    <p className="text-2xl font-bold text-blue-400">{totalProtein}g</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                    <p className="text-slate-400 text-sm mb-1">Carbos</p>
                    <p className="text-2xl font-bold text-green-400">{totalCarbs}g</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                    <p className="text-slate-400 text-sm mb-1">Grasas</p>
                    <p className="text-2xl font-bold text-yellow-400">{totalFats}g</p>
                </div>
            </div>

            {/* Add Meal Button */}
            <button
                onClick={() => setShowAddMeal(!showAddMeal)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-colors"
            >
                <Plus className="w-5 h-5" />
                Añadir Comida
            </button>

            {/* Add Meal Form */}
            {showAddMeal && (
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Nueva Comida</h3>

                    <input
                        type="text"
                        placeholder="Nombre de la comida"
                        value={newMeal.name}
                        onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Calorías"
                            value={newMeal.calories || ''}
                            onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            type="number"
                            placeholder="Proteína (g)"
                            value={newMeal.protein || ''}
                            onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            type="number"
                            placeholder="Carbos (g)"
                            value={newMeal.carbs || ''}
                            onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            type="number"
                            placeholder="Grasas (g)"
                            value={newMeal.fats || ''}
                            onChange={(e) => setNewMeal({ ...newMeal, fats: Number(e.target.value) })}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddMeal}
                            className="flex-1 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={() => setShowAddMeal(false)}
                            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Meals List */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Comidas Registradas</h3>
                {meals && meals.length > 0 ? (
                    <div className="space-y-3">
                        {meals.map((meal) => (
                            <div key={meal.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex-1">
                                    <p className="text-white font-medium">{meal.name}</p>
                                    <p className="text-sm text-slate-400">{meal.time} • {meal.meal_type}</p>
                                    <div className="flex gap-4 mt-2 text-sm">
                                        <span className="text-slate-300">{meal.calories} kcal</span>
                                        <span className="text-blue-400">{meal.protein}g P</span>
                                        <span className="text-green-400">{meal.carbs}g C</span>
                                        <span className="text-yellow-400">{meal.fats}g G</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteMeal(meal.id)}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-8">No hay comidas registradas</p>
                )}
            </div>
        </div>
    );
}
