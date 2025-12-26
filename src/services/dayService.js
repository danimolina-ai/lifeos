// Day Service - Daily tracking (energy, sleep, water, steps)
import { supabase } from '../lib/supabase'

export const dayService = {
    // Get day data
    async getDay(userId, date) {
        const { data, error } = await supabase
            .from('user_days')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date)
            .single()

        return { data, error }
    },

    // Get days for date range
    async getDaysByDateRange(userId, startDate, endDate) {
        const { data, error } = await supabase
            .from('user_days')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false })

        return { data, error }
    },

    // Create or update day
    async upsertDay(userId, date, dayData) {
        const { data, error } = await supabase
            .from('user_days')
            .upsert({
                user_id: userId,
                date,
                ...dayData
            }, {
                onConflict: 'user_id,date'
            })
            .select()
            .single()

        return { data, error }
    },

    // Update specific fields
    async updateDay(userId, date, updates) {
        const { data, error } = await supabase
            .from('user_days')
            .update(updates)
            .eq('user_id', userId)
            .eq('date', date)
            .select()
            .single()

        return { data, error }
    },

    // Update energy level
    async updateEnergyLevel(userId, date, energyLevel) {
        return this.upsertDay(userId, date, { energy_level: energyLevel })
    },

    // Update sleep
    async updateSleep(userId, date, sleepHours, sleepQuality) {
        return this.upsertDay(userId, date, {
            sleep_hours: sleepHours,
            sleep_quality: sleepQuality
        })
    },

    // Update water intake
    async updateWater(userId, date, waterGlasses) {
        return this.upsertDay(userId, date, { water_glasses: waterGlasses })
    },

    // Update steps
    async updateSteps(userId, date, steps) {
        return this.upsertDay(userId, date, { steps })
    },

    // Update focus note
    async updateFocusNote(userId, date, focusNote) {
        return this.upsertDay(userId, date, { focus_note: focusNote })
    }
}
