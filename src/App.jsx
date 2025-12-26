// Main App with Auth
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AppPage from './pages/AppPage'
import { LogOut, User } from 'lucide-react'

// Session indicator component
function SessionIndicator() {
    const { user, loading } = useAuth()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    if (loading) return null

    // User is logged in - show email and logout
    if (user) {
        return (
            <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-emerald-400 truncate max-w-[120px] sm:max-w-none">{user.email}</span>
                <button
                    onClick={handleLogout}
                    className="p-1 sm:p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Cerrar sesión"
                >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                </button>
            </div>
        )
    }

    // User is NOT logged in - show demo mode indicator
    return (
        <a
            href="/login"
            className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-xl px-3 py-1.5 hover:bg-amber-500/20 transition-colors"
        >
            <span className="text-xs sm:text-sm text-amber-400 font-medium">🎭 Demo</span>
            <span className="text-xs text-amber-400/70 hidden sm:inline">Click para login</span>
        </a>
    )
}

// App wrapper with session indicator
function AppWithSession() {
    return (
        <div className="relative">
            <SessionIndicator />
            <AppPage />
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* App Route - accessible to all */}
                    <Route path="/app" element={<AppWithSession />} />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/app" replace />} />
                    <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
