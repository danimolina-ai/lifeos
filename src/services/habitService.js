// Habit Service - Habits and Habit Logs
import { supabase } from '../lib/supabase'

export const habitService = {
    // ========== HABITS ==========

    // Get all user habits
    async getHabits(userId) {
        const { data, error } = await supabase
            .from('user_habits')
            .select('*')
            .eq('user_id', userId)
            .order('created_at')

        return { data, error }
    },

    // Create habit
    async createHabit(userId, habitData) {
        const { data, error } = await supabase
            .from('user_habits')
            .insert({
                user_id: userId,
                ...habitData
            })
            .select()
            .single()

        return { data, error }
    },

    // Update habit
    async updateHabit(habitId, updates) {
        const { data, error } = await supabase
            .from('user_habits')
            .update(updates)
            .eq('id', habitId)
            .select()
            .single()

        return { data, error }
    },

    // Delete habit
    async deleteHabit(habitId) {
        const { error } = await supabase
            .from('user_habits')
            .delete()
            .eq('id', habitId)

        return { error }
    },

    // ========== HABIT LOGS ==========

    // Get habit logs for a date
    async getLogsByDate(userId, date) {
        const { data, error } = await supabase
            .from('user_habit_logs')
            .select('*, habit:user_habits(*)')
            .eq('user_id', userId)
            .eq('date', date)

        return { data, error }
    },

    // Get habit logs for date range
    async getLogsByDateRange(userId, startDate, endDate) {
        const { data, error } = await supabase
            .from('user_habit_logs')
            .select('*, habit:user_habits(*)')
            .eq('user_id', userId)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false })

        return { data, error }
    },

    // Get logs for specific habit
    async getLogsByHabit(userId, habitId) {
        const { data, error } = await supabase
            .from('user_habit_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('habit_id', habitId)
            .order('date', { ascending: false })

        return { data, error }
    },

    // Toggle habit completion
    async toggleHabit(userId, habitId, date) {
        // Check if log exists
        const { data: existing } = await supabase
            .from('user_habit_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('habit_id', habitId)
            .eq('date', date)
            .single()

        if (existing) {
            // Toggle completion
            const { data, error } = await supabase
                .from('user_habit_logs')
                .update({
                    completed: !existing.completed,
                    completed_at: !existing.completed ? new Date().toISOString() : null
                })
                .eq('id', existing.id)
                .select()
                .single()

            return { data, error }
        } else {
            // Create new log
            const { data, error } = await supabase
                .from('user_habit_logs')
                .insert({
                    user_id: userId,
                    habit_id: habitId,
                    date,
                    completed: true,
                    completed_at: new Date().toISOString()
                })
                .select()
                .single()

            return { data, error }
        }
    },

    // Get habit streak
    async getHabitStreak(userId, habitId) {
        const { data, error } = await supabase
            .from('user_habit_logs')
            .select('date, completed')
            .eq('user_id', userId)
            .eq('habit_id', habitId)
            .eq('completed', true)
            .order('date', { ascending: false })
            .limit(365)

        if (error) return { streak: 0, error }

        // Calculate streak
        let streak = 0
        const today = new Date().toISOString().split('T')[0]
        let currentDate = new Date(today)

        for (const log of data) {
            const logDate = new Date(log.date).toISOString().split('T')[0]
            const checkDate = currentDate.toISOString().split('T')[0]

            if (logDate === checkDate) {
                streak++
                currentDate.setDate(currentDate.getDate() - 1)
            } else {
                break
            }
        }

        return { streak, error: null }
    }
}
