// AppWrapper - Loads data from Supabase and syncs with localStorage
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNutrition } from '../hooks/useNutrition'
import { useDayMetrics } from '../hooks/useDayMetrics'
import AppPage from './AppPage'

// Helper to get today's date
const getToday = () => new Date().toISOString().split('T')[0]

// Custom hook to sync Supabase data with localStorage
function useSupabaseSync() {
    const { user } = useAuth()
    const [selectedDate, setSelectedDate] = useState(getToday())

    const {
        foods: allFoods,
        meals,
        loading: nutritionLoading,
        loadMeals,
    } = useNutrition()

    const {
        dayData,
        loading: dayLoading,
    } = useDayMetrics(selectedDate)

    // Load meals when date changes
    useEffect(() => {
        if (user) {
            loadMeals(selectedDate)
        }
    }, [selectedDate, user])

    // Sync Supabase data to localStorage format
    useEffect(() => {
        if (!user || nutritionLoading || dayLoading) return

        const storedData = JSON.parse(localStorage.getItem('lifeOS_v56') || '{}')

        // Merge Supabase data into localStorage format
        const updatedData = {
            ...storedData,
            meals: meals || storedData.meals || [],
            days: {
                ...(storedData.days || {}),
                [selectedDate]: dayData || storedData.days?.[selectedDate] || {}
            },
            user: {
                ...(storedData.user || {}),
                name: user.user_metadata?.name || storedData.user?.name || 'Usuario'
            }
        }

        localStorage.setItem('lifeOS_v56', JSON.stringify(updatedData))
    }, [meals, dayData, user, nutritionLoading, dayLoading, selectedDate])

    return { loading: nutritionLoading || dayLoading }
}

export default function AppWrapper() {
    const { loading } = useSupabaseSync()

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-300">Cargando datos...</p>
                </div>
            </div>
        )
    }

    // Render AppPage normally - it will read from localStorage which now has Supabase data
    return <AppPage />
}
