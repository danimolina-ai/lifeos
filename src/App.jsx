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
    const { user } = useAuth()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    if (!user) return null

    return (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl px-4 py-2">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">{user.email}</span>
            <button
                onClick={handleLogout}
                className="ml-2 p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Cerrar sesión"
            >
                <LogOut className="w-4 h-4 text-red-400" />
            </button>
        </div>
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
