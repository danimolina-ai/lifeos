// Elite Pre-Login Landing Page
// Designed with psychological, persuasion, and storytelling principles
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000 }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const increment = target / (duration / 16)
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
    }, [target, duration])

    return <span>{count.toLocaleString()}</span>
}

// Life area card component
const AreaCard = ({ emoji, title, description, delay }) => (
    <div
        className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 cursor-pointer"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{emoji}</div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-white/50 text-sm">{description}</p>
    </div>
)

// Pain point card
const PainCard = ({ emoji, text }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <span className="text-2xl">{emoji}</span>
        <span className="text-white/70">{text}</span>
    </div>
)

// Testimonial card
const TestimonialCard = ({ name, role, text, avatar }) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-white/80 italic mb-4">"{text}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                {avatar}
            </div>
            <div>
                <p className="text-white font-medium text-sm">{name}</p>
                <p className="text-white/40 text-xs">{role}</p>
            </div>
        </div>
    </div>
)

export default function LandingPage() {
    const navigate = useNavigate()
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const areas = [
        { emoji: '🍎', title: 'Nutrición', description: 'Control total de lo que comes. Calorías, macros, comidas.' },
        { emoji: '💪', title: 'Entrenamiento', description: 'Rutinas personalizadas y progreso físico medible.' },
        { emoji: '✅', title: 'Hábitos', description: 'Automatiza tu excelencia con microhábitos diarios.' },
        { emoji: '💼', title: 'Trabajo', description: 'Proyectos, tareas y productividad de élite.' },
        { emoji: '🏠', title: 'Personal', description: 'Tu vida fuera del trabajo, organizada.' },
        { emoji: '💰', title: 'Finanzas', description: 'Ingresos, gastos y camino a la libertad.' },
        { emoji: '🧘', title: 'Consciencia', description: 'Meditación, journaling y claridad mental.' },
        { emoji: '👥', title: 'Relaciones', description: 'Conexiones que realmente importan.' }
    ]

    const painPoints = [
        { emoji: '🍔', text: 'Comes sin saber qué estás metiendo a tu cuerpo' },
        { emoji: '📱', text: 'Pasas horas en el móvil sin avanzar en lo importante' },
        { emoji: '💸', text: 'El dinero se va y no sabes exactamente a dónde' },
        { emoji: '😴', text: 'Terminas cada día agotado pero sin sentirte productivo' }
    ]

    const testimonials = [
        { name: 'Carlos M.', role: 'Emprendedor', text: 'En 3 meses perdí 8kg y duplicé mi productividad. Life OS cambió mi forma de ver cada día.', avatar: 'C' },
        { name: 'Laura S.', role: 'Diseñadora', text: 'Por fin tengo una visión clara de todas las áreas de mi vida en un solo lugar.', avatar: 'L' },
        { name: 'Miguel R.', role: 'Developer', text: 'El sistema de hábitos es adictivo. No puedo dejar de completar mi racha.', avatar: 'M' }
    ]

    return (
        <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-violet-950/50 via-zinc-950 to-fuchsia-950/30 pointer-events-none" />

            {/* Floating orbs */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" style={{ transform: `translateY(${-scrollY * 0.15}px)` }} />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">✨</span>
                        <span className="text-white font-bold text-xl">Life OS</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full font-medium hover:opacity-90 transition-opacity"
                        >
                            Empezar gratis
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/60 text-sm">El sistema operativo para tu vida</span>
                    </div>

                    {/* Main headline */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Tu vida tiene <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">8 áreas</span>.
                        <br />
                        ¿Cuántas controlas <span className="italic">realmente</span>?
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                        Life OS es el sistema operativo para humanos que quieren dominar cada dimensión de su existencia.
                        <span className="text-white"> Un lugar para todo. Todo en un lugar.</span>
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            Empieza tu transformación
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button
                            onClick={() => navigate('/demo')}
                            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-medium hover:bg-white/10 transition-colors"
                        >
                            Ver demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-12 text-center">
                        <div>
                            <p className="text-3xl font-bold text-white"><AnimatedCounter target={10847} />+</p>
                            <p className="text-white/40 text-sm">Usuarios activos</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div>
                            <p className="text-3xl font-bold text-white"><AnimatedCounter target={8} /></p>
                            <p className="text-white/40 text-sm">Áreas de vida</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div>
                            <p className="text-3xl font-bold text-white">100%</p>
                            <p className="text-white/40 text-sm">Gratis para siempre</p>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
                        <div className="w-1.5 h-3 rounded-full bg-white/40" />
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-violet-400 font-medium mb-4">EL PROBLEMA</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        El 97% de las personas viven en <span className="text-red-400">piloto automático</span>
                    </h2>
                    <p className="text-xl text-white/60 mb-12">
                        Sin un sistema, cada día es una batalla contra el caos. ¿Te suena familiar?
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {painPoints.map((pain, i) => (
                            <PainCard key={i} {...pain} />
                        ))}
                    </div>

                    <p className="text-white/40 mt-12 text-lg">
                        No es falta de voluntad. Es falta de <span className="text-white font-medium">sistema</span>.
                    </p>
                </div>
            </section>

            {/* Solution: 8 Areas Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-emerald-400 font-medium mb-4">LA SOLUCIÓN</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            8 áreas. Un sistema. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Control total.</span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            Life OS integra las 8 dimensiones fundamentales de tu vida en un solo lugar.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        {areas.map((area, i) => (
                            <AreaCard key={i} {...area} delay={i * 100} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="relative py-32 px-6 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-cyan-400 font-medium mb-4">TESTIMONIOS</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Miles ya están <span className="text-cyan-400">transformando</span> sus vidas
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        ¿Listo para tomar el <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">control</span>?
                    </h2>
                    <p className="text-xl text-white/60 mb-12">
                        Tu mejor versión está a una decisión de distancia.
                        <br />
                        <span className="text-white font-medium">El momento es ahora.</span>
                    </p>

                    <button
                        onClick={() => navigate('/register')}
                        className="group px-12 py-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-bold text-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
                    >
                        Crear mi Life OS gratis
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>

                    <p className="text-white/30 text-sm mt-6">
                        Sin tarjeta de crédito · Configuración en 2 minutos · Gratis para siempre
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <span className="text-white/60 font-medium">Life OS</span>
                    </div>
                    <p className="text-white/30 text-sm">
                        © 2024 Life OS. El sistema operativo para tu vida.
                    </p>
                </div>
            </footer>
        </div>
    )
}
