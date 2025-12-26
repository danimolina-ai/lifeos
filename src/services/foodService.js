// Food Service - Foods, Meals, and Nutrition
import { supabase } from '../lib/supabase'

export const foodService = {
    // ========== GLOBAL FOODS ==========

    // Get all global foods
    async getGlobalFoods() {
        const { data, error } = await supabase
            .from('global_foods')
            .select('*')
            .order('name')

        return { data, error }
    },

    // Get global foods by category
    async getGlobalFoodsByCategory(category) {
        const { data, error } = await supabase
            .from('global_foods')
            .select('*')
            .eq('category', category)
            .order('name')

        return { data, error }
    },

    // ========== CUSTOM FOODS ==========

    // Get user's custom foods
    async getCustomFoods(userId) {
        const { data, error } = await supabase
            .from('user_custom_foods')
            .select('*')
            .eq('user_id', userId)
            .order('name')

        return { data, error }
    },

    // Create custom food
    async createCustomFood(userId, foodData) {
        const { data, error } = await supabase
            .from('user_custom_foods')
            .insert({
                user_id: userId,
                ...foodData
            })
            .select()
            .single()

        return { data, error }
    },

    // Update custom food
    async updateCustomFood(foodId, updates) {
        const { data, error } = await supabase
            .from('user_custom_foods')
            .update(updates)
            .eq('id', foodId)
            .select()
            .single()

        return { data, error }
    },

    // Delete custom food
    async deleteCustomFood(foodId) {
        const { error } = await supabase
            .from('user_custom_foods')
            .delete()
            .eq('id', foodId)

        return { error }
    },

    // Get all foods (global + custom)
    async getAllFoods(userId) {
        const [globalResult, customResult] = await Promise.all([
            this.getGlobalFoods(),
            this.getCustomFoods(userId)
        ])

        if (globalResult.error || customResult.error) {
            return {
                data: null,
                error: globalResult.error || customResult.error
            }
        }

        const allFoods = [
            ...globalResult.data.map(f => ({ ...f, source: 'global' })),
            ...customResult.data.map(f => ({ ...f, source: 'custom' }))
        ]

        return { data: allFoods, error: null }
    },

    // ========== MEALS ==========

    // Get meals for a date
    async getMealsByDate(userId, date) {
        const { data, error } = await supabase
            .from('user_meals')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date)
            .order('time')

        return { data, error }
    },

    // Get meals for date range
    async getMealsByDateRange(userId, startDate, endDate) {
        const { data, error } = await supabase
            .from('user_meals')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false })
            .order('time')

        return { data, error }
    },

    // Create meal
    async createMeal(userId, mealData) {
        const { data, error } = await supabase
            .from('user_meals')
            .insert({
                user_id: userId,
                ...mealData
            })
            .select()
            .single()

        return { data, error }
    },

    // Update meal
    async updateMeal(mealId, updates) {
        const { data, error } = await supabase
            .from('user_meals')
            .update(updates)
            .eq('id', mealId)
            .select()
            .single()

        return { data, error }
    },

    // Delete meal
    async deleteMeal(mealId) {
        const { error } = await supabase
            .from('user_meals')
            .delete()
            .eq('id', mealId)

        return { error }
    },

    // ========== FOOD CATEGORIES ==========

    async getCategories() {
        const { data, error } = await supabase
            .from('food_categories')
            .select('*')
            .order('order_index')

        return { data, error }
    }
}
