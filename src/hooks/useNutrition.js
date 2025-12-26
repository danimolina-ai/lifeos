// Custom hook for nutrition data
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { foodService } from '../services'

export function useNutrition() {
    const { user } = useAuth()
    const [foods, setFoods] = useState([])
    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Load all foods (global + custom)
    useEffect(() => {
        if (!user) return

        async function loadFoods() {
            const { data, error } = await foodService.getAllFoods(user.id)
            if (error) {
                setError(error.message)
            } else {
                setFoods(data || [])
            }
            setLoading(false)
        }

        loadFoods()
    }, [user])

    // Load meals for current date
    const loadMeals = async (date) => {
        if (!user) return

        const { data, error } = await foodService.getMealsByDate(user.id, date)
        if (error) {
            setError(error.message)
        } else {
            setMeals(data || [])
        }
    }

    // Add meal
    const addMeal = async (mealData) => {
        if (!user) return

        const { data, error } = await foodService.createMeal(user.id, mealData)
        if (error) {
            setError(error.message)
            return { error }
        }

        // Reload meals for that date
        await loadMeals(mealData.date)
        return { data }
    }

    // Update meal
    const updateMeal = async (mealId, updates) => {
        const { data, error } = await foodService.updateMeal(mealId, updates)
        if (error) {
            setError(error.message)
            return { error }
        }

        // Update local state
        setMeals(prev => prev.map(m => m.id === mealId ? data : m))
        return { data }
    }

    // Delete meal
    const deleteMeal = async (mealId, date) => {
        const { error } = await foodService.deleteMeal(mealId)
        if (error) {
            setError(error.message)
            return { error }
        }

        // Reload meals
        await loadMeals(date)
        return { error: null }
    }

    // Add custom food
    const addCustomFood = async (foodData) => {
        if (!user) return

        const { data, error } = await foodService.createCustomFood(user.id, foodData)
        if (error) {
            setError(error.message)
            return { error }
        }

        // Add to local state
        setFoods(prev => [...prev, { ...data, source: 'custom' }])
        return { data }
    }

    // Delete custom food
    const deleteCustomFood = async (foodId) => {
        const { error } = await foodService.deleteCustomFood(foodId)
        if (error) {
            setError(error.message)
            return { error }
        }

        // Remove from local state
        setFoods(prev => prev.filter(f => f.id !== foodId))
        return { error: null }
    }

    return {
        foods,
        meals,
        loading,
        error,
        loadMeals,
        addMeal,
        updateMeal,
        deleteMeal,
        addCustomFood,
        deleteCustomFood
    }
}
