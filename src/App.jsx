// Main App with Auth
import { useState } from 'react'
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

// User Avatar with Profile Dropdown Menu
function UserAvatar() {
    const { user, loading } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)

    if (loading || !user) return null

    const initial = user.email.charAt(0).toUpperCase()
    const username = user.email.split('@')[0]
    const domain = user.email.split('@')[1]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <div className="relative">
            {/* Avatar Button */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="group relative"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white/10 group-hover:ring-white/30 group-hover:scale-105 transition-all">
                    {initial}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-800" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 top-12 z-50 w-72 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        {/* User Info Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    {initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold truncate">{username}</p>
                                    <p className="text-white/50 text-xs truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            {/* Account Info */}
                            <div className="px-3 py-2 mb-1">
                                <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Cuenta</p>
                            </div>

                            <button
                                onClick={() => { window.dispatchEvent(new CustomEvent('goToSettings')); setMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                            >
                                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">Configuración</p>
                                    <p className="text-white/40 text-xs">Preferencias de la app</p>
                                </div>
                            </button>

                            {/* Separator */}
                            <div className="my-2 border-t border-white/5" />

                            {/* App Info */}
                            <div className="px-3 py-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-white/30">Life OS</span>
                                    <span className="text-white/30">v5.2.0</span>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="my-2 border-t border-white/5" />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-left group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-red-400 text-sm font-medium">Cerrar sesión</p>
                                    <p className="text-white/40 text-xs">Salir de tu cuenta</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
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
