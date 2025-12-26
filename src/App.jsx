// Main App with Auth
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
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

// Demo wrapper with banner
function DemoWrapper() {
    return (
        <div className="pt-8">
            <DemoBanner />
            <AppPage />
        </div>
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

                    {/* App Route - requires login */}
                    <Route
                        path="/app"
                        element={
                            <ProtectedRoute>
                                <AppPage />
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
