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

// Force sync from cloud (ignores local timestamp)
const forceSync = async () => {
    if (!currentUser) {
        console.log('[Storage] No user, cannot force sync')
        return false
    }

    try {
        console.log('[Storage] 🔄 FORCING sync from Supabase...')
        updateSyncStatus('syncing')

        const { data, error } = await supabase
            .from('user_data')
            .select('data, updated_at')
            .eq('user_id', currentUser.id)
            .eq('key', 'lifeOS_v58')
            .maybeSingle()

        if (error) {
            console.error('[Storage] Force sync error:', error)
            updateSyncStatus('error')
            return false
        }

        if (data && data.data) {
            console.log('[Storage] ✅ Force sync: Got data from Supabase, applying...')
            const newData = JSON.stringify(data.data)
            const supabaseUpdatedAt = new Date(data.updated_at).getTime()

            const originalSetItem = Object.getPrototypeOf(localStorage).setItem.bind(localStorage)
            originalSetItem('lifeOS_v58', newData)
            originalSetItem('lifeOS_lastSync', supabaseUpdatedAt.toString())

            updateSyncStatus('synced')
            window.location.reload()
            return true
        } else {
            console.log('[Storage] No data in Supabase to sync')
            updateSyncStatus('idle')
            return false
        }
    } catch (err) {
        console.error('[Storage] Force sync error:', err)
        updateSyncStatus('error')
        return false
    }
}

// Expose forceSync globally for debugging
if (typeof window !== 'undefined') {
    window.lifeosSyncForce = forceSync
    window.lifeosSyncStatus = getSyncStatus
}

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
        console.log('[Storage] Loading from Supabase for user:', currentUser.id)
        updateSyncStatus('syncing')

        const { data, error } = await supabase
            .from('user_data')
            .select('data, updated_at')
            .eq('user_id', currentUser.id)
            .eq('key', 'lifeOS_v58')
            .maybeSingle()

        if (error) {
            console.error('[Storage] Load error:', error)
            updateSyncStatus('error')
            setTimeout(() => updateSyncStatus('idle'), 3000)
            return
        }

        // Get local data for comparison
        const localData = localStorage.getItem('lifeOS_v58')
        const localUpdatedAt = parseInt(localStorage.getItem('lifeOS_lastSync') || '0')

        console.log('[Storage] Local lastSync:', localUpdatedAt ? new Date(localUpdatedAt).toISOString() : 'never')

        if (data && data.data) {
            const supabaseUpdatedAt = new Date(data.updated_at).getTime()
            console.log('[Storage] Supabase updated_at:', new Date(supabaseUpdatedAt).toISOString())
            console.log('[Storage] Comparison: Supabase=' + supabaseUpdatedAt + ' vs Local=' + localUpdatedAt)

            // Use Supabase data if it's newer than our last successful sync
            // This ensures changes from other devices always come through
            if (supabaseUpdatedAt > localUpdatedAt) {
                console.log('[Storage] ✅ Supabase has NEWER data, downloading...')
                const newData = JSON.stringify(data.data)

                // Use original setItem to avoid triggering save loop
                const originalSetItem = Object.getPrototypeOf(localStorage).setItem.bind(localStorage)
                originalSetItem('lifeOS_v58', newData)
                originalSetItem('lifeOS_lastSync', supabaseUpdatedAt.toString())

                updateSyncStatus('synced')
                console.log('[Storage] ✅ Data synced from cloud, reloading UI...')

                // Small delay to ensure localStorage is written
                setTimeout(() => {
                    window.location.reload()
                }, 100)
                return
            } else {
                console.log('[Storage] Local data is current (same or newer timestamp)')

                // If we have local data but Supabase doesn't have it or is older,
                // we should push our local data to Supabase
                if (localData && localUpdatedAt > supabaseUpdatedAt) {
                    console.log('[Storage] Local is newer, will sync to cloud on next change')
                }
            }
        } else {
            console.log('[Storage] No data in Supabase yet for this user')

            // If we have local data but nothing in cloud, push it
            if (localData) {
                console.log('[Storage] Pushing local data to cloud...')
                saveToSupabase('lifeOS_v58', localData)
            }
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
let pendingSaveData = null // Track pending data for immediate save on page hide

const saveToSupabase = async (key, value, immediate = false) => {
    if (key !== 'lifeOS_v58') return

    // Get fresh session - try multiple methods
    let userId = currentUser?.id

    // Method 1: Try supabase.auth.getSession()
    if (!userId) {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            userId = session?.user?.id
            if (session?.user) {
                currentUser = session.user
                console.log('[Storage] 🔄 Got session via getSession:', userId)
            }
        } catch (e) {
            console.error('[Storage] getSession failed:', e)
        }
    }

    // Method 2: Try reading from Supabase's localStorage cache
    if (!userId) {
        try {
            // Supabase stores auth in localStorage with a key like sb-{project-ref}-auth-token
            const projectRef = import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0]
            const authKey = `sb-${projectRef}-auth-token`
            const cachedAuth = localStorage.getItem(authKey)
            if (cachedAuth) {
                const parsed = JSON.parse(cachedAuth)
                userId = parsed?.user?.id
                if (userId) {
                    currentUser = parsed.user
                    console.log('[Storage] 🔄 Got user from localStorage cache:', userId)
                }
            }
        } catch (e) {
            console.error('[Storage] localStorage cache read failed:', e)
        }
    }

    if (!userId) {
        console.log('[Storage] ⚠️ No user found via any method, skipping save')
        return
    }

    // Store pending data for emergency save
    pendingSaveData = { key, value, userId }

    // Clear previous timeout
    if (saveTimeout) clearTimeout(saveTimeout)

    updateSyncStatus('syncing')

    // If immediate save requested (e.g., page hiding), save now
    if (immediate) {
        await doSave(key, value, userId)
        return
    }

    // Debounce: wait 500ms before saving (reduced from 2s for mobile)
    saveTimeout = setTimeout(async () => {
        await doSave(key, value, userId)
        pendingSaveData = null
    }, 500)
}

// Actual save function
const doSave = async (key, value, userId) => {
    try {
        console.log('[Storage] 📤 Saving to Supabase for user:', userId)
        const parsedValue = JSON.parse(value)

        const { error } = await supabase
            .from('user_data')
            .upsert({
                user_id: userId,
                key: key,
                data: parsedValue,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,key'
            })

        if (error) {
            console.error('[Storage] ❌ Save error:', error)
            updateSyncStatus('error')
            setTimeout(() => updateSyncStatus('idle'), 3000)
        } else {
            console.log('[Storage] ✅ Saved successfully to Supabase')
            // Update lastSync timestamp so we don't download our own changes
            const originalSetItem = Object.getPrototypeOf(localStorage).setItem.bind(localStorage)
            originalSetItem('lifeOS_lastSync', Date.now().toString())
            updateSyncStatus('synced')
            setTimeout(() => updateSyncStatus('idle'), 2000)
        }
    } catch (err) {
        console.error('[Storage] ❌ Save error:', err)
        updateSyncStatus('error')
        setTimeout(() => updateSyncStatus('idle'), 3000)
    }
}

// CRITICAL: Save immediately when page is about to be hidden (mobile browser switching, closing tab, etc.)
if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && pendingSaveData && pendingSaveData.userId) {
            console.log('[Storage] 📱 Page hiding, saving immediately...')
            // Use sendBeacon or synchronous approach for page unload
            if (navigator.sendBeacon) {
                const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_data?on_conflict=user_id,key`
                const data = JSON.stringify({
                    user_id: pendingSaveData.userId,
                    key: pendingSaveData.key,
                    data: JSON.parse(pendingSaveData.value),
                    updated_at: new Date().toISOString()
                })
                const headers = {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    'Prefer': 'resolution=merge-duplicates'
                }
                // sendBeacon doesn't support custom headers, so we use fetch with keepalive
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: data,
                    keepalive: true
                }).catch(e => console.error('[Storage] Beacon save error:', e))
            } else {
                // Fallback: try immediate save
                doSave(pendingSaveData.key, pendingSaveData.value, pendingSaveData.userId)
            }
            pendingSaveData = null
        }
    })

    // Also handle beforeunload for desktop
    window.addEventListener('beforeunload', () => {
        if (pendingSaveData && pendingSaveData.userId) {
            console.log('[Storage] 📤 Page unloading, saving...')
            // Synchronous XHR as last resort (deprecated but works for unload)
            const xhr = new XMLHttpRequest()
            xhr.open('POST', `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_data?on_conflict=user_id,key`, false)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_ANON_KEY)
            xhr.setRequestHeader('Authorization', `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`)
            xhr.setRequestHeader('Prefer', 'resolution=merge-duplicates')
            try {
                xhr.send(JSON.stringify({
                    user_id: pendingSaveData.userId,
                    key: pendingSaveData.key,
                    data: JSON.parse(pendingSaveData.value),
                    updated_at: new Date().toISOString()
                }))
            } catch (e) {
                console.error('[Storage] Unload save error:', e)
            }
        }
    })
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

export { currentUser, init, getSyncStatus, forceSync }
