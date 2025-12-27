// Authentication Context
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true;

        // Timeout fallback - prevent infinite loading on mobile
        // But first check if there's a cached session before giving up
        const loadingTimeout = setTimeout(() => {
            if (isMounted && loading) {
                console.warn('Auth loading timeout - checking localStorage for cached session');
                // Try to get session from localStorage as fallback
                const cachedSession = localStorage.getItem('sb-' + import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
                if (cachedSession) {
                    try {
                        const parsed = JSON.parse(cachedSession);
                        if (parsed?.user) {
                            console.log('Using cached session from localStorage');
                            setUser(parsed.user);
                        }
                    } catch (e) {
                        console.error('Failed to parse cached session');
                    }
                }
                setLoading(false);
            }
        }, 10000); // 10 second timeout (more generous for slow mobile networks)

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (isMounted) {
                setUser(session?.user ?? null);
                setLoading(false);
                clearTimeout(loadingTimeout);
            }
        }).catch((error) => {
            console.error('Auth getSession error:', error);
            if (isMounted) {
                setLoading(false);
                clearTimeout(loadingTimeout);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            clearTimeout(loadingTimeout);
        };
    }, []);



    const signUp = async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name || 'Usuario'
                }
            }
        })
        return { data, error }
    }

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    }

    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email)
        return { data, error }
    }

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
