// Epic Pre-Login Landing Page - Visceral & Confrontational
// "This is what I've been searching for my whole life"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000, suffix = '' }) => {
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

    return <span>{count.toLocaleString()}{suffix}</span>
}

// Life area card component
const AreaCard = ({ emoji, title, description, features, color }) => (
    <div className={`group p-6 rounded-3xl bg-gradient-to-br ${color} border border-white/10 hover:scale-[1.02] transition-all duration-500`}>
        <div className="text-5xl mb-4">{emoji}</div>
        <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
        <p className="text-white/70 text-sm mb-4">{description}</p>
        <ul className="space-y-2">
            {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                    <span className="text-emerald-400">✓</span> {f}
                </li>
            ))}
        </ul>
    </div>
)

// Testimonial card
const TestimonialCard = ({ name, role, text, avatar, result }) => (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
        <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl">
                {avatar}
            </div>
            <div>
                <p className="text-white font-bold">{name}</p>
                <p className="text-white/40 text-sm">{role}</p>
            </div>
        </div>
        <p className="text-white/80 text-lg italic mb-4">"{text}"</p>
        {result && (
            <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-emerald-400 font-medium">📈 {result}</p>
            </div>
        )}
    </div>
)

// Before/After comparison
const BeforeAfter = ({ before, after, emoji }) => (
    <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 font-bold text-sm mb-2">❌ ANTES</p>
            <p className="text-white/70">{before}</p>
        </div>
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-400 font-bold text-sm mb-2">✅ DESPUÉS</p>
            <p className="text-white/70">{after}</p>
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
        {
            emoji: '🍎',
            title: 'Nutrición',
            description: 'Control total de lo que entra en tu cuerpo.',
            color: 'from-orange-500/20 to-amber-500/10',
            features: ['Tracking de calorías y macros', 'Base de datos de 500+ alimentos', 'Comidas guardadas', 'Planificación semanal']
        },
        {
            emoji: '💪',
            title: 'Entrenamiento',
            description: 'Rutinas que generan resultados reales.',
            color: 'from-red-500/20 to-rose-500/10',
            features: ['400+ ejercicios con instrucciones', 'Tracking de pesos y progreso', 'Templates de rutinas', 'Records personales']
        },
        {
            emoji: '✅',
            title: 'Hábitos',
            description: 'Automatiza tu excelencia diaria.',
            color: 'from-emerald-500/20 to-green-500/10',
            features: ['Streaks y rachas', 'Recordatorios inteligentes', 'Identidad asociada', 'Estadísticas de adherencia']
        },
        {
            emoji: '💼',
            title: 'Trabajo',
            description: 'Productividad de élite sin burnout.',
            color: 'from-violet-500/20 to-purple-500/10',
            features: ['Matriz de Eisenhower', 'Proyectos con OKRs', 'Bloques de Deep Work', 'Inbox cero']
        },
        {
            emoji: '🏠',
            title: 'Personal',
            description: 'Tu vida fuera del trabajo, organizada.',
            color: 'from-cyan-500/20 to-teal-500/10',
            features: ['Tareas por categoría', 'Subtareas ilimitadas', 'Fechas y recordatorios', 'Proyectos personales']
        },
        {
            emoji: '💰',
            title: 'Finanzas',
            description: 'Claridad total sobre tu dinero.',
            color: 'from-yellow-500/20 to-orange-500/10',
            features: ['Tracking de ingresos/gastos', 'Presupuestos mensuales', 'Categorías personalizadas', 'Gráficos de evolución']
        },
        {
            emoji: '🧘',
            title: 'Consciencia',
            description: 'Claridad mental y paz interior.',
            color: 'from-indigo-500/20 to-blue-500/10',
            features: ['Journaling diario', 'Práctica de gratitud', 'Reflexión nocturna', 'Tracking de mood']
        },
        {
            emoji: '👥',
            title: 'Relaciones',
            description: 'Conexiones que importan.',
            color: 'from-pink-500/20 to-rose-500/10',
            features: ['CRM personal', 'Frecuencia de contacto', 'Cumpleaños y fechas', 'Notas e intereses']
        }
    ]

    const testimonials = [
        {
            name: 'Carlos M.',
            role: 'Emprendedor, 34 años',
            text: 'Llevaba años saltando de app en app. Notion, Todoist, MyFitnessPal, Strong... un caos. Life OS lo unificó todo. Por primera vez siento que controlo mi vida, no que ella me controla a mí.',
            avatar: 'C',
            result: '-12kg en 4 meses, productividad x2'
        },
        {
            name: 'Laura S.',
            role: 'Diseñadora UX, 28 años',
            text: 'El dashboard de "Hoy" es adictivo. Ver todas mis áreas de vida en una sola pantalla me hace imposible esconderme de mí misma. Eso es exactamente lo que necesitaba.',
            avatar: 'L',
            result: 'Streak de 127 días en hábitos'
        },
        {
            name: 'Miguel R.',
            role: 'Developer, 31 años',
            text: 'La sección de consciencia cambió mi vida. El journaling diario + gratitud me sacó de un episodio de burnout. Ahora es sagrado para mí.',
            avatar: 'M',
            result: 'De burnout a claridad mental en 2 meses'
        },
        {
            name: 'Ana G.',
            role: 'Product Manager, 29 años',
            text: 'Por fin entiendo a dónde va mi dinero. La sección de finanzas es simple pero brutalmente efectiva. Ahorro 400€ más al mes sin sentir que me privo de nada.',
            avatar: 'A',
            result: '+€400/mes de ahorro'
        }
    ]

    const beforeAfterData = [
        {
            before: 'Abres 7 apps diferentes cada mañana. Pierdes 20 minutos solo configurando tu día.',
            after: 'Un dashboard. 2 minutos. Todo tu día planificado y visible.'
        },
        {
            before: 'Comes sin saber qué estás metiendo en tu cuerpo. Culpa después de cada comida.',
            after: 'Control total. Sabes exactamente tus calorías, proteína y progreso.'
        },
        {
            before: 'Terminas el día agotado pero con la sensación de no haber avanzado en nada importante.',
            after: 'Cierre del día con wins concretos. Claridad sobre lo que lograste.'
        },
        {
            before: 'El dinero desaparece y no sabes a dónde. Ansiedad financiera constante.',
            after: 'Cada euro trackeado. Presupuesto claro. Paz financiera.'
        }
    ]

    return (
        <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-violet-950/50 via-zinc-950 to-fuchsia-950/30 pointer-events-none" />

            {/* Floating orbs */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" style={{ transform: `translateY(${-scrollY * 0.15}px)` }} />
            <div className="fixed top-1/2 right-1/4 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" style={{ transform: `translateY(${scrollY * 0.08}px)` }} />

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

            {/* ========== HERO SECTION - CONFRONTATIONAL ========== */}
            <section className="relative min-h-screen flex items-center justify-center pt-16">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/60 text-sm">+10,000 personas ya tomaron el control</span>
                    </div>

                    {/* Main headline - Confrontational */}
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        Tu vida tiene <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">8 áreas</span>.
                        <br />
                        <span className="text-white/50">¿Cuántas controlas</span> <span className="italic text-white">realmente</span>?
                    </h1>

                    {/* Subheadline - Visceral */}
                    <p className="text-xl md:text-2xl text-white/60 mb-6 max-w-3xl mx-auto">
                        Seamos honestos.
                        <span className="text-white font-medium"> Sabes exactamente qué deberías estar haciendo.</span>
                        <br className="hidden md:block" />
                        El problema es que tu vida está fragmentada en 15 apps diferentes,
                        <br className="hidden md:block" />
                        y <span className="text-red-400">ninguna te da la visión completa</span>.
                    </p>

                    <p className="text-lg text-white/40 mb-12 max-w-2xl mx-auto">
                        Life OS no es otra app de productividad. Es <span className="text-white">el sistema operativo para tu vida</span>.
                        <br />
                        Un lugar para todo. Todo en un lugar.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-10 py-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-violet-500/25"
                        >
                            Empieza tu transformación
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button
                            onClick={() => navigate('/demo')}
                            className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-medium hover:bg-white/10 transition-colors"
                        >
                            Ver demo sin registro
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-center">
                        <div>
                            <p className="text-4xl font-black text-white"><AnimatedCounter target={10847} />+</p>
                            <p className="text-white/40 text-sm">Usuarios activos</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div>
                            <p className="text-4xl font-black text-white"><AnimatedCounter target={8} /></p>
                            <p className="text-white/40 text-sm">Áreas de vida integradas</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div>
                            <p className="text-4xl font-black text-white"><AnimatedCounter target={4.9} suffix="/5" /></p>
                            <p className="text-white/40 text-sm">Valoración media</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div>
                            <p className="text-4xl font-black text-emerald-400">100%</p>
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

            {/* ========== PROBLEM AGITATION - THE PAIN ========== */}
            <section className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-red-400 font-bold text-sm mb-4 tracking-wider">EL PROBLEMA QUE NO QUIERES VER</p>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">
                            El <span className="text-red-400">97%</span> de las personas
                            <br />
                            viven en <span className="line-through text-white/30">piloto automático</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            Reaccionando a la vida en lugar de diseñarla.
                            <br />
                            Apagando fuegos en lugar de construir algo significativo.
                        </p>
                    </div>

                    {/* Pain points - Visual */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                            <div className="text-4xl mb-4">🍔</div>
                            <h3 className="text-xl font-bold text-white mb-2">Nutrición descontrolada</h3>
                            <p className="text-white/50">Comes sin saber qué. Culpa después. Promesas de "mañana empiezo". Ciclo infinito.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                            <div className="text-4xl mb-4">📱</div>
                            <h3 className="text-xl font-bold text-white mb-2">Tiempo evaporado</h3>
                            <p className="text-white/50">3 horas de scroll. 0 tareas importantes completadas. "¿Dónde se fue el día?"</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                            <div className="text-4xl mb-4">💸</div>
                            <h3 className="text-xl font-bold text-white mb-2">Dinero invisible</h3>
                            <p className="text-white/50">El sueldo entra... y se evapora. "¿En qué me lo gasté?" Ansiedad financiera constante.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                            <div className="text-4xl mb-4">😴</div>
                            <h3 className="text-xl font-bold text-white mb-2">Agotamiento sin propósito</h3>
                            <p className="text-white/50">Terminas cada día destruido, pero con la sensación de no haber avanzado en nada importante.</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-2xl text-white/40 mb-4">No es falta de voluntad.</p>
                        <p className="text-3xl font-bold text-white">Es falta de <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">sistema</span>.</p>
                    </div>
                </div>
            </section>

            {/* ========== BEFORE / AFTER TRANSFORMATION ========== */}
            <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-emerald-400 font-bold text-sm mb-4 tracking-wider">LA TRANSFORMACIÓN</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Del caos al <span className="text-emerald-400">control total</span>
                        </h2>
                        <p className="text-xl text-white/50">
                            Así es como cambia tu día a día con Life OS
                        </p>
                    </div>

                    <div className="space-y-6">
                        {beforeAfterData.map((item, i) => (
                            <BeforeAfter key={i} {...item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== THE 8 AREAS - DETAILED ========== */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-violet-400 font-bold text-sm mb-4 tracking-wider">EL SISTEMA</p>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">8 áreas</span>. Un sistema.
                            <br />
                            Control total.
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            Life OS integra las 8 dimensiones fundamentales de tu vida.
                            <br />
                            <span className="text-white">Cada área diseñada con obsesión por el detalle.</span>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {areas.map((area, i) => (
                            <AreaCard key={i} {...area} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== WHY THIS IS DIFFERENT ========== */}
            <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-cyan-400 font-bold text-sm mb-4 tracking-wider">¿POR QUÉ ESTO ES DIFERENTE?</p>
                    <h2 className="text-4xl md:text-5xl font-black mb-12">
                        Lo que <span className="text-cyan-400">otras apps</span> no entienden
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-3xl mb-4">🧩</div>
                            <h3 className="text-lg font-bold mb-2">Fragmentación mata</h3>
                            <p className="text-white/50 text-sm">
                                Cuando tu vida está en 12 apps diferentes, pierdes la visión de conjunto.
                                Life OS lo unifica <span className="text-white">todo</span>.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-3xl mb-4">🎯</div>
                            <h3 className="text-lg font-bold mb-2">Un dashboard, no 15</h3>
                            <p className="text-white/50 text-sm">
                                La magia está en ver TODO tu día en una sola vista.
                                Nutrición, entrenamientos, hábitos, tareas, finanzas... <span className="text-white">todo junto</span>.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-3xl mb-4">🏆</div>
                            <h3 className="text-lg font-bold mb-2">Score diario</h3>
                            <p className="text-white/50 text-sm">
                                Gamificación inteligente. Cada día tiene una puntuación.
                                <span className="text-white"> Compites contigo mismo.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== SOCIAL PROOF - TESTIMONIALS ========== */}
            <section className="relative py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-fuchsia-400 font-bold text-sm mb-4 tracking-wider">TESTIMONIOS REALES</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Miles ya están <span className="text-fuchsia-400">transformando</span> sus vidas
                        </h2>
                        <p className="text-xl text-white/50">
                            No nos creas a nosotros. Escucha a quienes ya dieron el paso.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== THE PROMISE ========== */}
            <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="text-6xl mb-8">🎯</div>
                    <h2 className="text-4xl md:text-5xl font-black mb-8">
                        La promesa de <span className="text-emerald-400">Life OS</span>
                    </h2>

                    <div className="space-y-6 text-left">
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <h3 className="font-bold text-lg mb-1">2 minutos para planificar tu día</h3>
                                <p className="text-white/50">No más 20 minutos saltando entre apps. Un dashboard. Todo visible.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5">
                            <span className="text-2xl">📊</span>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Visibilidad total sobre tu vida</h3>
                                <p className="text-white/50">Por primera vez verás todas las áreas en un solo lugar. Imposible esconderte de ti mismo.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5">
                            <span className="text-2xl">🔥</span>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Resultados en la primera semana</h3>
                                <p className="text-white/50">No en 3 meses. En 7 días sentirás la diferencia de tener un sistema.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== FAQ ========== */}
            <section className="relative py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-white/40 font-bold text-sm mb-4 tracking-wider">PREGUNTAS FRECUENTES</p>
                        <h2 className="text-4xl font-black">
                            Resolvemos tus dudas
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: '¿Es realmente gratis?', a: 'Sí. Life OS es 100% gratis para siempre. Sin versión premium, sin features bloqueadas, sin anuncios. Esto es un proyecto de pasión.' },
                            { q: '¿Por qué debería confiar en esto?', a: 'Tus datos están encriptados y se sincronizan de forma segura. Además, puedes exportar todo en cualquier momento. Sin lock-in.' },
                            { q: '¿Cuánto tiempo toma configurarlo?', a: 'El onboarding toma menos de 2 minutos. Seleccionas qué áreas te interesan, respondes unas preguntas rápidas, y listo.' },
                            { q: '¿Funciona en móvil?', a: 'Sí. Life OS es una web app responsive que funciona perfecto en móvil, tablet y escritorio. Sin necesidad de descargar nada.' },
                            { q: '¿Puedo usarlo solo para algunas áreas?', a: 'Absolutamente. Activas solo las áreas que te interesan. Si solo quieres nutrición y entrenamientos, perfecto. El sistema se adapta a ti.' }
                        ].map((faq, i) => (
                            <details key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                                <summary className="font-bold flex items-center justify-between list-none">
                                    {faq.q}
                                    <span className="text-white/40 group-open:rotate-45 transition-transform text-xl">+</span>
                                </summary>
                                <p className="mt-4 text-white/60">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== FINAL CTA - EPIC ========== */}
            <section className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent border border-white/10">
                        <p className="text-white/40 text-sm mb-4">EL MOMENTO ES AHORA</p>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">
                            ¿Listo para tomar el
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">control de tu vida</span>?
                        </h2>
                        <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                            El mejor momento para empezar fue hace un año.
                            <br />
                            <span className="text-white font-medium">El segundo mejor momento es ahora.</span>
                        </p>

                        <button
                            onClick={() => navigate('/register')}
                            className="group px-12 py-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-black text-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-2xl shadow-violet-500/30"
                        >
                            Comenzar mi transformación
                            <span className="group-hover:translate-x-2 transition-transform">→</span>
                        </button>

                        <p className="text-white/30 text-sm mt-6">
                            ✓ Sin tarjeta de crédito · ✓ Setup en 2 minutos · ✓ Gratis para siempre
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <span className="text-white/60 font-medium">Life OS</span>
                    </div>
                    <p className="text-white/30 text-sm text-center md:text-right">
                        El sistema operativo para tu vida.
                        <br className="md:hidden" />
                        <span className="hidden md:inline"> · </span>
                        Hecho con obsesión por el detalle.
                    </p>
                </div>
            </footer>
        </div>
    )
}
