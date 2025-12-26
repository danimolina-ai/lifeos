// Workout Service - Exercises and Workouts
import { supabase } from '../lib/supabase'

export const workoutService = {
    // ========== GLOBAL EXERCISES ==========

    // Get all global exercises
    async getGlobalExercises() {
        const { data, error } = await supabase
            .from('global_exercises')
            .select('*')
            .order('name')

        return { data, error }
    },

    // Get global exercises by muscle group
    async getGlobalExercisesByMuscle(muscleGroup) {
        const { data, error } = await supabase
            .from('global_exercises')
            .select('*')
            .eq('muscle_group', muscleGroup)
            .order('name')

        return { data, error }
    },

    // ========== CUSTOM EXERCISES ==========

    // Get user's custom exercises
    async getCustomExercises(userId) {
        const { data, error } = await supabase
            .from('user_custom_exercises')
            .select('*')
            .eq('user_id', userId)
            .order('name')

        return { data, error }
    },

    // Create custom exercise
    async createCustomExercise(userId, exerciseData) {
        const { data, error } = await supabase
            .from('user_custom_exercises')
            .insert({
                user_id: userId,
                ...exerciseData
            })
            .select()
            .single()

        return { data, error }
    },

    // Update custom exercise
    async updateCustomExercise(exerciseId, updates) {
        const { data, error } = await supabase
            .from('user_custom_exercises')
            .update(updates)
            .eq('id', exerciseId)
            .select()
            .single()

        return { data, error }
    },

    // Delete custom exercise
    async deleteCustomExercise(exerciseId) {
        const { error } = await supabase
            .from('user_custom_exercises')
            .delete()
            .eq('id', exerciseId)

        return { error }
    },

    // Get all exercises (global + custom)
    async getAllExercises(userId) {
        const [globalResult, customResult] = await Promise.all([
            this.getGlobalExercises(),
            this.getCustomExercises(userId)
        ])

        if (globalResult.error || customResult.error) {
            return {
                data: null,
                error: globalResult.error || customResult.error
            }
        }

        const allExercises = [
            ...globalResult.data.map(e => ({ ...e, source: 'global' })),
            ...customResult.data.map(e => ({ ...e, source: 'custom' }))
        ]

        return { data: allExercises, error: null }
    },

    // ========== WORKOUTS ==========

    // Get workouts for a date
    async getWorkoutsByDate(userId, date) {
        const { data, error } = await supabase
            .from('user_workouts')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date)

        return { data, error }
    },

    // Get workouts for date range
    async getWorkoutsByDateRange(userId, startDate, endDate) {
        const { data, error } = await supabase
            .from('user_workouts')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false })

        return { data, error }
    },

    // Create workout
    async createWorkout(userId, workoutData) {
        const { data, error } = await supabase
            .from('user_workouts')
            .insert({
                user_id: userId,
                ...workoutData
            })
            .select()
            .single()

        return { data, error }
    },

    // Update workout
    async updateWorkout(workoutId, updates) {
        const { data, error } = await supabase
            .from('user_workouts')
            .update(updates)
            .eq('id', workoutId)
            .select()
            .single()

        return { data, error }
    },

    // Delete workout
    async deleteWorkout(workoutId) {
        const { error } = await supabase
            .from('user_workouts')
            .delete()
            .eq('id', workoutId)

        return { error }
    },

    // Mark workout as completed
    async completeWorkout(workoutId) {
        return this.updateWorkout(workoutId, { is_completed: true })
    }
}
