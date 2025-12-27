// Storage Wrapper - Syncs localStorage to Supabase for authenticated users
// This wrapper intercepts localStorage calls and saves to Supabase in background
import { supabase } from './supabase'

let currentUser = null
let isInitialized = false

// Sync status tracking
let syncStatus = 'idle' // idle, syncing, synced, error
const updateSyncStatus = (status) => {
    syncStatus = status
    window.dispatchEvent(new CustomEvent('syncStatusChange', { detail: status }))
}

// Export sync status getter
const getSyncStatus = () => syncStatus

// Initialize: get current user and set up listener
const init = async () => {
    if (isInitialized) return
    isInitialized = true // Set early to prevent double init

    try {
        console.log('[Storage] Initializing...')

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
            console.error('[Storage] Session error:', sessionError)
            return
        }

        currentUser = session?.user || null
        console.log('[Storage] Current user:', currentUser?.id || 'none')

        if (currentUser) {
            await loadFromSupabase()
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            const previousUser = currentUser
            currentUser = session?.user || null
            console.log('[Storage] Auth change:', event, currentUser?.id || 'none')

            if (event === 'SIGNED_IN' && currentUser && !previousUser) {
                await loadFromSupabase()
            }
        })

    } catch (err) {
        console.error('[Storage] Init error:', err)
        updateSyncStatus('idle')
    }
}

// Load user data from Supabase
const loadFromSupabase = async () => {
    if (!currentUser) {
        console.log('[Storage] No user, skipping load')
        return
    }

    try {
        console.log('[Storage] Loading from Supabase...')
        updateSyncStatus('syncing')

        const { data, error } = await supabase
            .from('user_data')
            .select('data')
            .eq('user_id', currentUser.id)
            .eq('key', 'lifeOS_v58')
            .maybeSingle() // Use maybeSingle instead of single to avoid error when no data

        if (error) {
            console.error('[Storage] Load error:', error)
            updateSyncStatus('error')
            setTimeout(() => updateSyncStatus('idle'), 3000)
            return
        }

        if (data && data.data) {
            console.log('[Storage] Found data in Supabase')
            const currentData = localStorage.getItem('lifeOS_v58')
            const newData = JSON.stringify(data.data)

            if (currentData !== newData) {
                console.log('[Storage] Syncing from Supabase to localStorage')
                // Use original setItem to avoid triggering save loop
                const originalSetItem = Object.getPrototypeOf(localStorage).setItem.bind(localStorage)
                originalSetItem('lifeOS_v58', newData)
                updateSyncStatus('synced')
                // Reload to refresh UI
                window.location.reload()
                return
            }
        } else {
            console.log('[Storage] No data in Supabase yet')
        }

        updateSyncStatus('synced')
        setTimeout(() => updateSyncStatus('idle'), 2000)

    } catch (err) {
        console.error('[Storage] Load error:', err)
        updateSyncStatus('error')
        setTimeout(() => updateSyncStatus('idle'), 3000)
    }
}

// Save to Supabase (debounced to avoid too many writes)
let saveTimeout = null
const saveToSupabase = async (key, value) => {
    if (!currentUser) {
        console.log('[Storage] No user, skipping save')
        return
    }
    if (key !== 'lifeOS_v58') return

    // Clear previous timeout
    if (saveTimeout) clearTimeout(saveTimeout)

    updateSyncStatus('syncing')

    // Debounce: wait 2 seconds before saving
    saveTimeout = setTimeout(async () => {
        try {
            console.log('[Storage] Saving to Supabase...')
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
                updateSyncStatus('error')
                setTimeout(() => updateSyncStatus('idle'), 3000)
            } else {
                console.log('[Storage] Saved successfully')
                updateSyncStatus('synced')
                setTimeout(() => updateSyncStatus('idle'), 2000)
            }
        } catch (err) {
            console.error('[Storage] Save error:', err)
            updateSyncStatus('error')
            setTimeout(() => updateSyncStatus('idle'), 3000)
        }
    }, 2000)
}

// Store original setItem before intercepting
const originalSetItem = localStorage.setItem.bind(localStorage)

// Intercept localStorage.setItem
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

export { currentUser, init, getSyncStatus }
