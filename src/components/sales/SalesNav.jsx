// Sales Navigation Component with Features Dropdown
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const navLinks = [
    { href: '/venta', label: 'Inicio' },
    { href: '/venta/para-quien', label: 'Para Quién' },
    { href: '/venta/precios', label: 'Precios' },
    { href: '/venta/recursos', label: 'Recursos' }
]

const featureAreas = [
    { href: '/venta/features/nutricion', label: '🍎 Nutrición', desc: 'Calorías, macros, comidas' },
    { href: '/venta/features/entrenamiento', label: '💪 Entrenamiento', desc: 'Rutinas, pesos, PRs' },
    { href: '/venta/features/habitos', label: '✅ Hábitos', desc: 'Streaks, identidad' },
    { href: '/venta/features/trabajo', label: '💼 Trabajo', desc: 'Tareas, proyectos' },
    { href: '/venta/features/personal', label: '🏠 Personal', desc: 'Vida fuera del trabajo' },
    { href: '/venta/features/finanzas', label: '💰 Finanzas', desc: 'Ingresos, gastos' },
    { href: '/venta/features/consciencia', label: '🧘 Consciencia', desc: 'Journaling, viajes' },
    { href: '/venta/features/relaciones', label: '👥 Relaciones', desc: 'CRM personal' }
]

export default function SalesNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [featuresOpen, setFeaturesOpen] = useState(false)
    const location = useLocation()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/venta" className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <span className="text-white font-bold text-xl">Life OS</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/venta"
                        className={`text-sm font-medium transition-colors ${location.pathname === '/venta' ? 'text-white' : 'text-white/50 hover:text-white'
                            }`}
                    >
                        Inicio
                    </Link>

                    {/* Features Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setFeaturesOpen(true)}
                        onMouseLeave={() => setFeaturesOpen(false)}
                    >
                        <button
                            className={`flex items-center gap-1 text-sm font-medium transition-colors ${location.pathname.includes('/venta/features') ? 'text-white' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            Características
                            <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {featuresOpen && (
                            <div className="absolute top-full left-0 pt-2 w-64">
                                <div className="bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-2xl">
                                    <Link
                                        to="/venta/features"
                                        className="block px-4 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors mb-1"
                                    >
                                        📋 Ver todas
                                    </Link>
                                    <div className="h-px bg-white/10 my-1" />
                                    {featureAreas.map(area => (
                                        <Link
                                            key={area.href}
                                            to={area.href}
                                            className="block px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium">{area.label}</span>
                                            <span className="block text-xs text-white/40">{area.desc}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {navLinks.slice(1).map(link => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`text-sm font-medium transition-colors ${location.pathname === link.href ? 'text-white' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/login"
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors text-sm"
                    >
                        Iniciar sesión
                    </Link>
                    <Link
                        to="/register"
                        className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                        Empezar gratis
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-white/70 hover:text-white"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 py-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col px-6 space-y-2">
                        <Link
                            to="/venta"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-medium py-2 text-white"
                        >
                            Inicio
                        </Link>

                        {/* Features Section */}
                        <div className="py-2">
                            <p className="text-white/40 text-sm mb-2">Características</p>
                            <Link
                                to="/venta/features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 text-white/70"
                            >
                                📋 Ver todas
                            </Link>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {featureAreas.map(area => (
                                    <Link
                                        key={area.href}
                                        to={area.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-3 rounded-xl bg-white/5 text-sm"
                                    >
                                        {area.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {navLinks.slice(1).map(link => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium py-2 text-white/70"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <hr className="border-white/10" />

                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-white/70 text-lg py-2"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-3 text-center bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-medium"
                        >
                            Empezar gratis
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
