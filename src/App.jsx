// Main App with Auth
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AppPage from './pages/AppPage'

// Demo banner component
function DemoBanner() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 text-black text-center py-1.5 text-sm font-medium">
            🎭 Modo Demo - <a href="/login" className="underline font-bold">Inicia sesión</a> para guardar tus datos
        </div>
    )
}

// User Avatar component
function UserAvatar() {
    const { user, loading } = useAuth()

    if (loading || !user) return null

    const initial = user.email.charAt(0).toUpperCase()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <button
            onClick={handleLogout}
            className="group relative"
            title={`${user.email} - Click para cerrar sesión`}
        >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white/10 group-hover:ring-white/30 group-hover:scale-105 transition-all">
                {initial}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-800" />
        </button>
    )
}

// Global Header - like Notion/Slack style
function GlobalHeader() {
    const goToSettings = () => {
        window.dispatchEvent(new CustomEvent('goToSettings'))
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span className="text-white/80 font-medium text-sm">Life OS</span>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={goToSettings}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Configuración"
                >
                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <UserAvatar />
            </div>
        </header>
    )
}

// Demo wrapper with banner
function DemoWrapper() {
    return (
        <div className="pt-8">
            <DemoBanner />
            <AppPage />
        </div>
    )
}

// App wrapper with global header
function AppWithHeader() {
    return (
        <>
            <GlobalHeader />
            <div className="pt-12">
                <AppPage />
            </div>
        </>
    )
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Demo Route - with banner */}
                    <Route path="/demo" element={<DemoWrapper />} />

                    {/* App Route - requires login, shows header */}
                    <Route
                        path="/app"
                        element={
                            <ProtectedRoute>
                                <AppWithHeader />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default redirect to app */}
                    <Route path="/" element={<Navigate to="/app" replace />} />
                    <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
