// AppWrapper - Loads data from Supabase and passes to AppPage
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNutrition } from '../hooks/useNutrition'
import { useDayMetrics } from '../hooks/useDayMetrics'
import AppPage from './AppPage'

// Helper to get today's date
const getToday = () => new Date().toISOString().split('T')[0]

export default function AppWrapper() {
    const { user } = useAuth()
    const [selectedDate, setSelectedDate] = useState(getToday())

    // Load nutrition data
    const {
        foods: allFoods,
        meals,
        loading: nutritionLoading,
        loadMeals,
        addMeal,
        updateMeal,
        deleteMeal,
        addCustomFood,
        deleteCustomFood
    } = useNutrition()

    // Load day metrics
    const {
        dayData,
        loading: dayLoading,
        updateEnergyLevel,
        updateSleep,
        updateWater,
        updateSteps,
        updateFocusNote
    } = useDayMetrics(selectedDate)

    // Load meals when date changes
    useEffect(() => {
        if (user) {
            loadMeals(selectedDate)
        }
    }, [selectedDate, user])

    // Show loading state
    if (nutritionLoading || dayLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-300">Cargando datos...</p>
                </div>
            </div>
        )
    }

    // Prepare data for AppPage
    const supabaseData = {
        // Nutrition
        allFoods,
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        addCustomFood,
        deleteCustomFood,

        // Day metrics
        dayData,
        updateEnergyLevel,
        updateSleep,
        updateWater,
        updateSteps,
        updateFocusNote,

        // Date management
        selectedDate,
        setSelectedDate,

        // User
        user
    }

    return <AppPage supabaseData={supabaseData} />
}
