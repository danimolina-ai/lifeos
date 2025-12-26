// Storage Wrapper - Syncs localStorage to Supabase for authenticated users
// This wrapper intercepts localStorage calls and saves to Supabase in background
import { supabase } from './supabase'

let currentUser = null
let isInitialized = false

// Initialize: get current user and set up listener
const init = async () => {
    if (isInitialized) return

    try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        currentUser = session?.user || null

        if (currentUser) {
            // Load data from Supabase and merge with localStorage
            await loadFromSupabase()
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            currentUser = session?.user || null

            if (event === 'SIGNED_IN' && currentUser) {
                await loadFromSupabase()
            }
        })

        isInitialized = true
    } catch (err) {
        console.error('[Storage] Init error:', err)
    }
}

// Load user data from Supabase
const loadFromSupabase = async () => {
    if (!currentUser) return

    try {
        const { data, error } = await supabase
            .from('user_data')
            .select('data')
            .eq('user_id', currentUser.id)
            .eq('key', 'lifeOS_v58')
            .single()

        if (data && !error) {
            // Save to localStorage (this won't trigger infinite loop because we check)
            const currentData = localStorage.getItem('lifeOS_v58')
            const newData = JSON.stringify(data.data)

            if (currentData !== newData) {
                localStorage.setItem('lifeOS_v58', newData)
                // Reload page to sync UI with new data
                window.location.reload()
            }
        }
    } catch (err) {
        // No data yet, that's ok
        console.log('[Storage] No existing data in Supabase')
    }
}

// Save to Supabase (debounced to avoid too many writes)
let saveTimeout = null
const saveToSupabase = async (key, value) => {
    if (!currentUser || key !== 'lifeOS_v58') return

    // Clear previous timeout
    if (saveTimeout) clearTimeout(saveTimeout)

    // Debounce: wait 2 seconds before saving
    saveTimeout = setTimeout(async () => {
        try {
            const parsedValue = JSON.parse(value)

            const { error } = await supabase
                .from('user_data')
                .upsert({
                    user_id: currentUser.id,
                    key: key,
                    data: parsedValue,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,key'
                })

            if (error) {
                console.error('[Storage] Save error:', error)
            } else {
                console.log('[Storage] Saved to Supabase')
            }
        } catch (err) {
            console.error('[Storage] Save error:', err)
        }
    }, 2000)
}

// Intercept localStorage.setItem
const originalSetItem = localStorage.setItem.bind(localStorage)
localStorage.setItem = function (key, value) {
    // Call original
    originalSetItem(key, value)

    // Also save to Supabase if user is logged in
    if (currentUser && key === 'lifeOS_v58') {
        saveToSupabase(key, value)
    }
}

// Initialize on load
init()

export { currentUser, init }
