// Sales Navigation Component
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
    { href: '/venta', label: 'Inicio' },
    { href: '/venta/features', label: 'Características' },
    { href: '/venta/para-quien', label: 'Para Quién' },
    { href: '/venta/precios', label: 'Precios' },
    { href: '/venta/recursos', label: 'Recursos' }
]

export default function SalesNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`text-sm font-medium transition-colors ${location.pathname === link.href
                                    ? 'text-white'
                                    : 'text-white/50 hover:text-white'
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
                <div className="md:hidden absolute top-16 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 py-4">
                    <div className="flex flex-col px-6 space-y-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-lg font-medium ${location.pathname === link.href
                                        ? 'text-white'
                                        : 'text-white/50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="border-white/10" />
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-white/70 text-lg"
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
