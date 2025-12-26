// Epic Landing Page - Personal Evolution System
// "Diseñado para tu evolución y desarrollo personal"
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SalesLayout from '../components/sales/SalesLayout'

// Animated counter
const AnimatedCounter = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const increment = target / 125
        const timer = setInterval(() => {
            start += increment
            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [target])
    return <span>{count.toLocaleString()}{suffix}</span>
}

export default function LandingPage() {
    const navigate = useNavigate()
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const levels = [
        {
            name: 'Simple',
            emoji: '🌱',
            color: 'from-emerald-500 to-green-500',
            desc: 'Solo lo esencial. Check diario sin complicaciones.',
            for: 'Para empezar suave o áreas secundarias'
        },
        {
            name: 'Pro',
            emoji: '⚡',
            color: 'from-violet-500 to-purple-500',
            desc: 'Tracking detallado con métricas y progreso.',
            for: 'Para áreas que quieres dominar'
        },
        {
            name: 'Héroe',
            emoji: '🏆',
            color: 'from-amber-500 to-orange-500',
            desc: 'Modo obsesión. Cada dato, cada insight.',
            for: 'Para tu área de transformación principal'
        }
    ]

    const consciousnessFeatures = [
        { emoji: '🌅', title: 'Ritual Matutino', desc: 'Intención del día, gratitud, visualización' },
        { emoji: '🌙', title: 'Cierre Nocturno', desc: 'Reflexión, wins del día, preparación de mañana' },
        { emoji: '✍️', title: 'Journaling Guiado', desc: 'Prompts que te hacen pensar profundo' },
        { emoji: '🧭', title: 'Viajes de Consciencia', desc: 'Rutas de 7-30 días para transformación' },
        { emoji: '🙏', title: 'Práctica de Gratitud', desc: 'Entrena tu cerebro para ver lo bueno' },
        { emoji: '📊', title: 'Tracking de Mood', desc: 'Patrones emocionales y correlaciones' }
    ]

    const dataConnections = [
        { emoji: '📱', title: 'Datos del Móvil', desc: 'Pasos, actividad, screen time automático' },
        { emoji: '⌚', title: 'Wearables', desc: 'Apple Watch, Garmin, Fitbit - sync automático' },
        { emoji: '💤', title: 'Sueño', desc: 'Datos de sueño importados automáticamente' },
        { emoji: '❤️', title: 'Frecuencia Cardíaca', desc: 'HRV, variabilidad, estrés' }
    ]

    const upcomingFeatures = [
        { emoji: '🩸', title: 'Ciclo Menstrual', desc: 'Tracking del periodo para mujeres', tag: 'Próximamente' },
        { emoji: '🤖', title: 'IA Coach', desc: 'Asistente que diseña tu camino', tag: 'Próximamente' },
        { emoji: '📖', title: 'Modo Historia', desc: 'Tu evolución narrada como aventura', tag: 'Próximamente' }
    ]

    return (
        <SalesLayout>
            {/* Floating orbs */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" style={{ transform: `translateY(${-scrollY * 0.15}px)` }} />
            <div className="fixed top-1/2 right-1/4 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" style={{ transform: `translateY(${scrollY * 0.08}px)` }} />

            {/* ========== HERO - EVOLUTION FOCUS ========== */}
            <section className="relative min-h-screen flex items-center justify-center">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/60 text-sm">Sistema de evolución personal</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        No es una app.
                        <br />
                        Es tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">sistema operativo personal</span>.
                    </h1>

                    <p className="text-xl md:text-2xl text-white/60 mb-4 max-w-3xl mx-auto">
                        Diseñado para tu <span className="text-white font-medium">evolución y desarrollo personal</span>.
                        <br className="hidden md:block" />
                        Se adapta a ti. Crece contigo. Te transforma.
                    </p>

                    <p className="text-lg text-white/40 mb-12 max-w-2xl mx-auto">
                        Activa solo las áreas que importan. Elige tu nivel de profundidad.
                        <br />
                        Deja que la IA diseñe tu camino de crecimiento.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-10 py-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-violet-500/25"
                        >
                            Comenzar mi evolución
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button
                            onClick={() => navigate('/demo')}
                            className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-medium hover:bg-white/10 transition-colors"
                        >
                            Ver demo
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-center">
                        <div>
                            <p className="text-4xl font-black text-white"><AnimatedCounter target={8} /></p>
                            <p className="text-white/40 text-sm">Áreas de vida</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div>
                            <p className="text-4xl font-black text-white">3</p>
                            <p className="text-white/40 text-sm">Niveles por área</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div>
                            <p className="text-4xl font-black text-white">∞</p>
                            <p className="text-white/40 text-sm">Combinaciones</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div>
                            <p className="text-4xl font-black text-emerald-400">100%</p>
                            <p className="text-white/40 text-sm">Adaptado a ti</p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
                        <div className="w-1.5 h-3 rounded-full bg-white/40" />
                    </div>
                </div>
            </section>

            {/* ========== THE 3 LEVELS ========== */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-violet-400 font-bold text-sm mb-4 tracking-wider">TÚ ELIGES TU PROFUNDIDAD</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            3 niveles. <span className="text-violet-400">Tú decides.</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            Cada área de tu vida puede tener un nivel diferente.
                            <br />
                            <span className="text-white">Simple</span> para lo secundario, <span className="text-white">Héroe</span> para tu transformación principal.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {levels.map((level, i) => (
                            <div
                                key={i}
                                className={`p-8 rounded-3xl bg-gradient-to-br ${level.color} bg-opacity-20 border border-white/10 hover:scale-[1.02] transition-all`}
                                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))` }}
                            >
                                <div className="text-5xl mb-4">{level.emoji}</div>
                                <h3 className="text-2xl font-black mb-2">{level.name}</h3>
                                <p className="text-white/70 mb-4">{level.desc}</p>
                                <p className="text-sm text-white/40 italic">"{level.for}"</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-white/60">
                            <span className="text-xl mr-2">💡</span>
                            Ejemplo: Nutrición en <span className="text-amber-400 font-bold">Héroe</span>, Finanzas en <span className="text-emerald-400 font-bold">Simple</span>, Trabajo en <span className="text-violet-400 font-bold">Pro</span>.
                            <br />
                            <span className="text-white/40 text-sm">La app se adapta a TUS prioridades.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== CONSCIOUSNESS SECTION ========== */}
            <section className="py-32 px-6 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-indigo-400 font-bold text-sm mb-4 tracking-wider">CONSCIENCIA</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            El área que lo <span className="text-indigo-400">cambia todo</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            No es solo journaling. Es un sistema completo de
                            <span className="text-white"> claridad mental, reflexión, y transformación interior</span>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        {consciousnessFeatures.map((f, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-indigo-500/20 hover:bg-white/10 transition-colors">
                                <div className="text-3xl mb-3">{f.emoji}</div>
                                <h3 className="font-bold mb-1">{f.title}</h3>
                                <p className="text-white/50 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">🧭</div>
                            <div>
                                <h3 className="text-xl font-black mb-2">Viajes de Consciencia</h3>
                                <p className="text-white/70 mb-4">
                                    Rutas guiadas de 7, 14, o 30 días para transformaciones específicas.
                                    Cada viaje tiene un tema: autoconocimiento, gratitud, desapego, propósito...
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs">🔥 Despertar</span>
                                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs">🙏 Gratitud Profunda</span>
                                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs">🎯 Claridad de Propósito</span>
                                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs">⚡ Energía Vital</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== AI STORY MODE ========== */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-fuchsia-400 font-bold text-sm mb-4 tracking-wider">MODO HISTORIA</p>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Tu evolución como <span className="text-fuchsia-400">aventura épica</span>
                    </h2>

                    <div className="p-8 rounded-3xl bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 mb-8">
                        <div className="text-5xl mb-6">🤖 ✨</div>
                        <h3 className="text-2xl font-bold mb-4">IA que diseña tu camino</h3>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
                            Cuéntale a la IA tus metas. Ella analiza tus datos, detecta patrones,
                            y te propone un plan de evolución personalizado.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 text-left">
                            <div className="p-4 rounded-xl bg-white/5">
                                <p className="font-bold mb-1">📊 Analiza</p>
                                <p className="text-white/50 text-sm">Cruza datos de todas tus áreas para encontrar correlaciones</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5">
                                <p className="font-bold mb-1">🎯 Propone</p>
                                <p className="text-white/50 text-sm">Sugiere en qué enfocarte esta semana/mes</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5">
                                <p className="font-bold mb-1">📈 Adapta</p>
                                <p className="text-white/50 text-sm">Ajusta el plan según tu progreso real</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-white/40 text-sm">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                            🚧 En desarrollo
                        </span>
                        <span className="ml-2">Llegará en la próxima gran actualización</span>
                    </p>
                </div>
            </section>

            {/* ========== DATA CONNECTIONS ========== */}
            <section className="py-32 px-6 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-cyan-400 font-bold text-sm mb-4 tracking-wider">DATOS CONECTADOS</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Todo <span className="text-cyan-400">sincronizado</span>. Automático.
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            Conecta tu móvil y tu reloj. Los datos se registran solos.
                            <br />
                            <span className="text-white">Tú solo vive. La app trackea.</span>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {dataConnections.map((d, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20 text-center hover:bg-white/10 transition-colors">
                                <div className="text-4xl mb-3">{d.emoji}</div>
                                <h3 className="font-bold mb-1">{d.title}</h3>
                                <p className="text-white/50 text-sm">{d.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-white/60">
                            <span className="text-xl mr-2">🔗</span>
                            Todos los datos se <span className="text-white font-medium">correlacionan entre sí</span>.
                            <br />
                            <span className="text-white/40 text-sm">¿Duermes mal cuando comes tarde? ¿Entrenas mejor los días que meditas? Life OS te lo muestra.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== COMING SOON ========== */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-amber-400 font-bold text-sm mb-4 tracking-wider">PRÓXIMAMENTE</p>
                        <h2 className="text-3xl md:text-4xl font-black mb-4">
                            Esto solo es el principio
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {upcomingFeatures.map((f, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-amber-500/20 relative overflow-hidden">
                                <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                                    {f.tag}
                                </span>
                                <div className="text-4xl mb-3">{f.emoji}</div>
                                <h3 className="font-bold mb-1">{f.title}</h3>
                                <p className="text-white/50 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== THE 8 AREAS ========== */}
            <section className="py-32 px-6 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-violet-400 font-bold text-sm mb-4 tracking-wider">LAS 8 ÁREAS</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Activa solo las que <span className="text-violet-400">te importan</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            No necesitas usar las 8. Elige 1, 3, o todas.
                            <br />
                            <span className="text-white">Tu sistema, tus reglas.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { emoji: '🍎', name: 'Nutrición', desc: 'Calorías, macros, comidas' },
                            { emoji: '💪', name: 'Entrenamiento', desc: 'Rutinas, pesos, PRs' },
                            { emoji: '✅', name: 'Hábitos', desc: 'Streaks, identidad' },
                            { emoji: '💼', name: 'Trabajo', desc: 'Tareas, proyectos, OKRs' },
                            { emoji: '🏠', name: 'Personal', desc: 'Vida fuera del trabajo' },
                            { emoji: '💰', name: 'Finanzas', desc: 'Ingresos, gastos, presupuesto' },
                            { emoji: '🧘', name: 'Consciencia', desc: 'Journaling, viajes, gratitud' },
                            { emoji: '👥', name: 'Relaciones', desc: 'CRM personal' }
                        ].map((area, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center">
                                <div className="text-3xl mb-2">{area.emoji}</div>
                                <h3 className="font-bold text-sm mb-1">{area.name}</h3>
                                <p className="text-white/40 text-xs">{area.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            to="/venta/features"
                            className="text-violet-400 hover:text-violet-300 font-medium"
                        >
                            Ver todas las características →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========== FINAL CTA ========== */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent border border-white/10">
                        <p className="text-white/40 text-sm mb-4">TU EVOLUCIÓN EMPIEZA AQUÍ</p>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">
                            ¿Listo para
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">transformarte</span>?
                        </h2>
                        <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                            Esto no es otra app de productividad.
                            <br />
                            <span className="text-white font-medium">Es el sistema diseñado para tu evolución.</span>
                        </p>

                        <button
                            onClick={() => navigate('/register')}
                            className="group px-12 py-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-black text-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-2xl shadow-violet-500/30"
                        >
                            Comenzar mi evolución
                            <span className="group-hover:translate-x-2 transition-transform">→</span>
                        </button>

                        <p className="text-white/30 text-sm mt-6">
                            ✓ Gratis para siempre · ✓ Setup en 2 minutos · ✓ Se adapta a ti
                        </p>
                    </div>
                </div>
            </section>
        </SalesLayout>
    )
}
