// Data structures for LifeOS
import { getToday, getDateOffset } from '../utils/date';

// Empty data template for new users (clean slate)
export const EMPTY_DATA = {
    user: {
        name: '',
        onboardingComplete: true,
        goals: { calories: 2200, protein: 180, carbs: 220, fats: 70, water: 8, sleep: 8, steps: 10000 },
        mantra: '',
        activeAreas: ['nutrition', 'workout', 'habits', 'work', 'personal', 'body', 'finances', 'consciousness', 'relationships'],
        demoDataEnabled: false
    },
    days: {},
    meals: [],
    savedMeals: [],
    plannedMeals: [],
    customFoods: [],
    recipes: [],
    workouts: [],
    habits: [],
    habitLogs: [],
    projects: [],
    tasks: [],
    workoutTemplates: [],
    bodyMetrics: [],
    personalRecords: [],
    journals: [],
    personalTasks: [],
    personalCategories: [],
    relationships: [],
    finances: { transactions: [], monthlyBudget: 0 },
    // TIER 1 fixes - previously missing fields
    workTasks: [],
    workProjects: [],
    scheduledWorkouts: {},
    recurringWorkouts: {},
    goals: { annual: [], quarterly: [], monthly: [] }
};

// Demo data for demonstration purposes
export const DEFAULT_DATA = {
    user: {
        name: 'Demo',
        onboardingComplete: true,
        goals: { calories: 2200, protein: 180, carbs: 220, fats: 70, water: 8, sleep: 8, steps: 10000 },
        mantra: 'Cada día cuenta',
        activeAreas: ['nutrition', 'workout', 'habits', 'work', 'personal', 'body', 'finances', 'consciousness', 'relationships'],
        demoDataEnabled: true
    },
    days: {},
    meals: [],
    savedMeals: [],
    plannedMeals: [],
    customFoods: [],
    recipes: [],
    workouts: [],
    habits: [],
    habitLogs: [],
    projects: [],
    tasks: [],
    workoutTemplates: [],
    bodyMetrics: [],
    personalRecords: [],
    journals: [],
    personalTasks: [],
    personalCategories: [],
    relationships: [],
    finances: { transactions: [], monthlyBudget: 0 }
};

// Sample data for habits
export const SAMPLE_HABITS = [
    { name: 'Meditar 10min', category: 'mental', icon: '🧘', frequency: 'daily' },
    { name: 'Leer 30min', category: 'learning', icon: '📚', frequency: 'daily' },
    { name: '10k pasos', category: 'health', icon: '🚶', frequency: 'daily' },
    { name: 'No móvil 1h mañana', category: 'discipline', icon: '📵', frequency: 'daily' },
    { name: '3L agua', category: 'health', icon: '💧', frequency: 'daily' },
    { name: 'Estiramientos', category: 'health', icon: '🤸', frequency: 'daily' },
];

// Sample projects
export const SAMPLE_PROJECTS = [
    { name: 'Trabajo', color: '#8B5CF6' },
    { name: 'Personal', color: '#10B981' },
    { name: 'Side Project', color: '#F59E0B' }
];

// Sample exercises
export const SAMPLE_EXERCISES = [
    { name: 'Bench Press', category: 'chest', muscle: 'Pecho' },
    { name: 'Squat', category: 'legs', muscle: 'Piernas' },
    { name: 'Deadlift', category: 'back', muscle: 'Espalda' },
    { name: 'Overhead Press', category: 'shoulders', muscle: 'Hombros' },
    { name: 'Barbell Row', category: 'back', muscle: 'Espalda' },
    { name: 'Pull Ups', category: 'back', muscle: 'Espalda' },
    { name: 'Incline DB Press', category: 'chest', muscle: 'Pecho' },
    { name: 'Lateral Raises', category: 'shoulders', muscle: 'Hombros' },
    { name: 'Tricep Pushdown', category: 'arms', muscle: 'Brazos' },
    { name: 'Bicep Curls', category: 'arms', muscle: 'Brazos' },
    { name: 'Leg Press', category: 'legs', muscle: 'Piernas' },
    { name: 'Romanian Deadlift', category: 'legs', muscle: 'Piernas' },
];

// Workout templates
export const WORKOUT_TEMPLATES = [
    {
        name: 'Push Day', category: 'push', exercises: [
            { name: 'Bench Press', targetSets: 3, targetReps: '8' },
            { name: 'Overhead Press', targetSets: 3, targetReps: '8' },
            { name: 'Incline DB Press', targetSets: 3, targetReps: '8' },
            { name: 'Lateral Raises', targetSets: 3, targetReps: '8' },
            { name: 'Tricep Pushdown', targetSets: 3, targetReps: '8' }
        ]
    },
    {
        name: 'Pull Day', category: 'pull', exercises: [
            { name: 'Deadlift', targetSets: 3, targetReps: '8' },
            { name: 'Barbell Row', targetSets: 3, targetReps: '8' },
            { name: 'Pull Ups', targetSets: 3, targetReps: '8' },
            { name: 'Bicep Curls', targetSets: 3, targetReps: '8' }
        ]
    },
    {
        name: 'Leg Day', category: 'legs', exercises: [
            { name: 'Squat', targetSets: 3, targetReps: '8' },
            { name: 'Romanian Deadlift', targetSets: 3, targetReps: '8' },
            { name: 'Leg Press', targetSets: 3, targetReps: '8' }
        ]
    },
];

// Default routine templates
export const DEFAULT_ROUTINES = [
    {
        id: 'ppl_push',
        name: 'Push Day',
        folder: 'Push Pull Legs',
        exercises: [
            { exerciseId: 'bench_press', name: 'Press Banca', targetSets: 4, targetReps: '6-8', restSeconds: 180 },
            { exerciseId: 'ohp', name: 'Press Militar', targetSets: 3, targetReps: '8-10', restSeconds: 120 },
            { exerciseId: 'db_incline', name: 'Press Inclinado Mancuernas', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
            { exerciseId: 'lateral_raise', name: 'Elevaciones Laterales', targetSets: 4, targetReps: '12-15', restSeconds: 60 },
            { exerciseId: 'tricep_pushdown', name: 'Extensión Tríceps Polea', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
            { exerciseId: 'overhead_tricep', name: 'Extensión Tríceps Overhead', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
        ]
    },
    {
        id: 'ppl_pull',
        name: 'Pull Day',
        folder: 'Push Pull Legs',
        exercises: [
            { exerciseId: 'deadlift', name: 'Peso Muerto', targetSets: 4, targetReps: '5-6', restSeconds: 240 },
            { exerciseId: 'barbell_row', name: 'Remo con Barra', targetSets: 4, targetReps: '8-10', restSeconds: 120 },
            { exerciseId: 'lat_pulldown', name: 'Jalón al Pecho', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
            { exerciseId: 'face_pull', name: 'Face Pull', targetSets: 3, targetReps: '15-20', restSeconds: 60 },
            { exerciseId: 'barbell_curl', name: 'Curl con Barra', targetSets: 3, targetReps: '10-12', restSeconds: 60 },
            { exerciseId: 'hammer_curl', name: 'Curl Martillo', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
        ]
    },
    {
        id: 'ppl_legs',
        name: 'Leg Day',
        folder: 'Push Pull Legs',
        exercises: [
            { exerciseId: 'squat', name: 'Sentadilla', targetSets: 4, targetReps: '6-8', restSeconds: 180 },
            { exerciseId: 'rdl', name: 'Peso Muerto Rumano', targetSets: 3, targetReps: '10-12', restSeconds: 120 },
            { exerciseId: 'leg_press', name: 'Prensa', targetSets: 3, targetReps: '12-15', restSeconds: 90 },
            { exerciseId: 'leg_curl', name: 'Curl Femoral', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
            { exerciseId: 'leg_extension', name: 'Extensión Cuádriceps', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
            { exerciseId: 'calf_raise', name: 'Elevación de Gemelos', targetSets: 4, targetReps: '15-20', restSeconds: 45 },
        ]
    },
    {
        id: 'upper',
        name: 'Upper Body',
        folder: 'Upper Lower',
        exercises: [
            { exerciseId: 'bench_press', name: 'Press Banca', targetSets: 4, targetReps: '6-8', restSeconds: 180 },
            { exerciseId: 'barbell_row', name: 'Remo con Barra', targetSets: 4, targetReps: '6-8', restSeconds: 180 },
            { exerciseId: 'ohp', name: 'Press Militar', targetSets: 3, targetReps: '8-10', restSeconds: 120 },
            { exerciseId: 'lat_pulldown', name: 'Jalón al Pecho', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
            { exerciseId: 'db_curl', name: 'Curl Mancuernas', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
            { exerciseId: 'tricep_pushdown', name: 'Extensión Tríceps Polea', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
        ]
    },
    {
        id: 'lower',
        name: 'Lower Body',
        folder: 'Upper Lower',
        exercises: [
            { exerciseId: 'squat', name: 'Sentadilla', targetSets: 4, targetReps: '6-8', restSeconds: 180 },
            { exerciseId: 'rdl', name: 'Peso Muerto Rumano', targetSets: 4, targetReps: '8-10', restSeconds: 120 },
            { exerciseId: 'leg_press', name: 'Prensa', targetSets: 3, targetReps: '12-15', restSeconds: 90 },
            { exerciseId: 'leg_curl', name: 'Curl Femoral', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
            { exerciseId: 'calf_raise', name: 'Elevación de Gemelos', targetSets: 4, targetReps: '15-20', restSeconds: 45 },
        ]
    },
    {
        id: 'full_body',
        name: 'Full Body',
        folder: 'Full Body',
        exercises: [
            { exerciseId: 'squat', name: 'Sentadilla', targetSets: 3, targetReps: '8-10', restSeconds: 150 },
            { exerciseId: 'bench_press', name: 'Press Banca', targetSets: 3, targetReps: '8-10', restSeconds: 150 },
            { exerciseId: 'barbell_row', name: 'Remo con Barra', targetSets: 3, targetReps: '8-10', restSeconds: 120 },
            { exerciseId: 'ohp', name: 'Press Militar', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
            { exerciseId: 'rdl', name: 'Peso Muerto Rumano', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
            { exerciseId: 'db_curl', name: 'Curl Mancuernas', targetSets: 2, targetReps: '12-15', restSeconds: 60 },
        ]
    }
];

// Personal categories
export const DEFAULT_PERSONAL_CATEGORIES = [
    { id: 'home', name: 'Hogar', icon: '🏠', color: '#10B981' },
    { id: 'admin', name: 'Admin', icon: '📋', color: '#6366F1' },
    { id: 'health', name: 'Salud', icon: '❤️', color: '#EF4444' },
    { id: 'social', name: 'Social', icon: '👥', color: '#F59E0B' },
    { id: 'travel', name: 'Viajes', icon: '✈️', color: '#3B82F6' },
    { id: 'learning', name: 'Aprendizaje', icon: '📚', color: '#8B5CF6' },
    { id: 'projects', name: 'Proyectos', icon: '🚀', color: '#EC4899' }
];
