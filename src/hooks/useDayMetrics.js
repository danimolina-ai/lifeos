// Custom hook for daily metrics
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { dayService } from '../services'

export function useDayMetrics(date) {
    const { user } = useAuth()
    const [dayData, setDayData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user || !date) return

        async function loadDayData() {
            setLoading(true)
            const { data, error } = await dayService.getDay(user.id, date)

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found, which is ok
                setError(error.message)
            } else {
                setDayData(data || {
                    energy_level: null,
                    sleep_hours: null,
                    sleep_quality: null,
                    water_glasses: 0,
                    steps: 0,
                    focus_note: ''
                })
            }
            setLoading(false)
        }

        loadDayData()
    }, [user, date])

    const updateEnergyLevel = async (level) => {
        if (!user) return

        const { data, error } = await dayService.updateEnergyLevel(user.id, date, level)
        if (error) {
            setError(error.message)
            return { error }
        }
        setDayData(data)
        return { data }
    }

    const updateSleep = async (hours, quality) => {
        if (!user) return

        const { data, error } = await dayService.updateSleep(user.id, date, hours, quality)
        if (error) {
            setError(error.message)
            return { error }
        }
        setDayData(data)
        return { data }
    }

    const updateWater = async (glasses) => {
        if (!user) return

        const { data, error } = await dayService.updateWater(user.id, date, glasses)
        if (error) {
            setError(error.message)
            return { error }
        }
        setDayData(data)
        return { data }
    }

    const updateSteps = async (steps) => {
        if (!user) return

        const { data, error } = await dayService.updateSteps(user.id, date, steps)
        if (error) {
            setError(error.message)
            return { error }
        }
        setDayData(data)
        return { data }
    }

    const updateFocusNote = async (note) => {
        if (!user) return

        const { data, error } = await dayService.updateFocusNote(user.id, date, note)
        if (error) {
            setError(error.message)
            return { error }
        }
        setDayData(data)
        return { data }
    }

    return {
        dayData,
        loading,
        error,
        updateEnergyLevel,
        updateSleep,
        updateWater,
        updateSteps,
        updateFocusNote
    }
}
