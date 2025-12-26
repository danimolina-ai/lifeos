// User Service - Profile and Settings
import { supabase } from '../lib/supabase'

export const userService = {
    // Get user profile
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single()

        return { data, error }
    },

    // Update user profile
    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()

        return { data, error }
    },

    // Update goals
    async updateGoals(userId, goals) {
        return this.updateProfile(userId, { goals })
    },

    // Update mantra
    async updateMantra(userId, mantra) {
        return this.updateProfile(userId, { mantra })
    },

    // Update active areas
    async updateActiveAreas(userId, activeAreas) {
        return this.updateProfile(userId, { active_areas: activeAreas })
    },

    // Mark onboarding as completed
    async completeOnboarding(userId) {
        return this.updateProfile(userId, { onboarding_completed: true })
    }
}
