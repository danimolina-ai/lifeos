// Individual Feature Page Template
import { useParams, Link } from 'react-router-dom'
import SalesLayout from '../../components/sales/SalesLayout'

const featureData = {
    nutricion: {
        emoji: '🍎',
        title: 'Nutrición',
        tagline: 'Control total sobre lo que comes',
        color: 'from-orange-500 to-amber-500',
        description: 'No es solo contar calorías. Es entender tu relación con la comida, detectar patrones, y tomar el control de tu alimentación sin volverte loco.',
        screenshot: '/screenshots/nutrition.png',
        levels: {
            simple: 'Check diario: ¿Comí bien hoy? Sí/No/Más o menos',
            pro: 'Tracking de calorías, macros básicos, comidas guardadas',
            hero: 'Cada gramo, cada macro, planificación semanal, base de datos completa'
        },
        features: [
            { title: 'Base de datos 500+ alimentos', desc: 'Busca y añade alimentos en segundos con datos nutricionales precisos', icon: '🔍' },
            { title: 'Tracking de calorías y macros', desc: 'Visualiza proteínas, carbohidratos y grasas en tiempo real', icon: '📊' },
            { title: 'Comidas guardadas', desc: 'Guarda tus comidas frecuentes para añadirlas con un click', icon: '⭐' },
            { title: 'Planificación semanal', desc: 'Planifica tus comidas con antelación y mantén el control', icon: '📅' },
            { title: 'Historial completo', desc: 'Revisa cualquier día pasado y detecta patrones', icon: '📈' },
            { title: 'Objetivos personalizados', desc: 'Define tus metas según tus objetivos (déficit, mantenimiento, superávit)', icon: '🎯' }
        ],
        testimonial: {
            text: 'Por primera vez entiendo lo que como. Ya no hay culpa, solo datos y decisiones informadas.',
            name: 'Carlos M.',
            result: '-12kg en 4 meses'
        }
    },
    entrenamiento: {
        emoji: '💪',
        title: 'Entrenamiento',
        tagline: 'Rutinas que generan resultados reales',
        color: 'from-red-500 to-rose-500',
        description: 'Diseña rutinas personalizadas, trackea tu progreso, y rompe tus records personales. Cada rep cuenta.',
        screenshot: '/screenshots/dashboard.png',
        levels: {
            simple: 'Check: ¿Entrené hoy? Tipo de deporte',
            pro: 'Rutinas, ejercicios, series y reps básicos',
            hero: 'Cada peso, cada serie, PRs, progresión, historial completo'
        },
        features: [
            { title: '400+ ejercicios', desc: 'Base de datos con instrucciones y músculos trabajados', icon: '📚' },
            { title: 'Tracking de pesos y series', desc: 'Registra cada set con pesos, reps y notas', icon: '🏋️' },
            { title: 'Templates de rutinas', desc: 'Crea y guarda rutinas para reutilizar', icon: '📋' },
            { title: 'Records personales', desc: 'Visualiza tus PRs y cuándo los batiste', icon: '🏆' },
            { title: 'Historial de entrenamientos', desc: 'Revisa todos tus workouts pasados', icon: '📅' },
            { title: 'Progreso visual', desc: 'Gráficos de evolución por ejercicio', icon: '📈' }
        ],
        testimonial: {
            text: 'Ver mis PRs subir semana a semana es adictivo. La app hace que quiera ir al gym.',
            name: 'Miguel R.',
            result: '+20kg en bench press en 3 meses'
        }
    },
    habitos: {
        emoji: '✅',
        title: 'Hábitos',
        tagline: 'Automatiza tu excelencia diaria',
        color: 'from-emerald-500 to-green-500',
        description: 'Construye identidad a través de pequeñas acciones diarias. El sistema de hábitos más adictivo que probarás.',
        screenshot: '/screenshots/dashboard.png',
        levels: {
            simple: '3-5 hábitos básicos, check diario',
            pro: 'Hábitos ilimitados, streaks, estadísticas',
            hero: 'Identidad asociada, frecuencias personalizadas, correlaciones'
        },
        features: [
            { title: 'Streaks y rachas', desc: 'Mantén la motivación con rachas visuales', icon: '🔥' },
            { title: 'Identidad asociada', desc: 'Conecta cada hábito con la persona que quieres ser', icon: '🎭' },
            { title: 'Frecuencia flexible', desc: 'Hábitos diarios, semanales o personalizados', icon: '📅' },
            { title: 'Estadísticas de adherencia', desc: 'Visualiza tu % de cumplimiento', icon: '📊' },
            { title: 'Vista calendario', desc: 'Historial visual de hábitos completados', icon: '📆' },
            { title: 'Iconos personalizados', desc: 'Haz cada hábito único y recognizable', icon: '✨' }
        ],
        testimonial: {
            text: 'Romper un streak de 50 días duele tanto que nunca fallas. Eso es genialidad de diseño.',
            name: 'Laura S.',
            result: 'Streak de 127 días en meditación'
        }
    },
    trabajo: {
        emoji: '💼',
        title: 'Trabajo',
        tagline: 'Productividad de élite sin burnout',
        color: 'from-violet-500 to-purple-500',
        description: 'Gestiona proyectos, prioriza con la matriz de Eisenhower, y domina el Deep Work. Haz lo importante, no solo lo urgente.',
        screenshot: '/screenshots/dashboard.png',
        levels: {
            simple: 'Lista de tareas básica para hoy',
            pro: 'Proyectos, fechas, prioridades, categorías',
            hero: 'Matriz Eisenhower, OKRs, Deep Work blocks, contextos'
        },
        features: [
            { title: 'Matriz de Eisenhower', desc: 'Prioriza tareas por urgencia e importancia', icon: '🎯' },
            { title: 'Proyectos con OKRs', desc: 'Define objetivos y resultados clave', icon: '📊' },
            { title: 'Bloques de Deep Work', desc: 'Marca tareas que requieren enfoque profundo', icon: '🧠' },
            { title: 'Inbox Zero', desc: 'Procesa tareas de tu bandeja de entrada', icon: '📥' },
            { title: 'Contextos de trabajo', desc: 'Filtra por @oficina, @casa, @computer...', icon: '📍' },
            { title: 'Estimación de tiempo', desc: 'Planifica cuánto llevará cada tarea', icon: '⏱️' }
        ],
        testimonial: {
            text: 'La matriz de Eisenhower me obligó a ser honesto sobre qué es urgente vs importante. Cambió todo.',
            name: 'Pablo T.',
            result: '+3 horas productivas por semana'
        }
    },
    personal: {
        emoji: '🏠',
        title: 'Personal',
        tagline: 'Tu vida fuera del trabajo, organizada',
        color: 'from-cyan-500 to-teal-500',
        description: 'Gestiona todo lo que no es trabajo: hogar, trámites, salud, aprendizaje, hobbies...',
        screenshot: '/screenshots/dashboard.png',
        levels: {
            simple: 'Lista básica de pendientes personales',
            pro: 'Categorías, fechas límite, prioridades',
            hero: 'Proyectos personales, subtareas, recordatorios'
        },
        features: [
            { title: 'Categorías personalizadas', desc: 'Organiza por áreas: Hogar, Salud, Aprendizaje...', icon: '📁' },
            { title: 'Subtareas ilimitadas', desc: 'Desglosa tareas complejas', icon: '📋' },
            { title: 'Fechas límite', desc: 'No olvides nada importante', icon: '📅' },
            { title: 'Prioridades', desc: 'Sabe qué hacer primero', icon: '🔝' },
            { title: 'Vista por categoría', desc: 'Filtra y enfócate', icon: '🔍' },
            { title: 'Notas y detalles', desc: 'Añade contexto a cada tarea', icon: '📝' }
        ],
        testimonial: {
            text: 'Por fin mi vida personal tiene el mismo nivel de organización que mi trabajo.',
            name: 'Ana G.',
            result: '0 tareas olvidadas en 2 meses'
        }
    },
    finanzas: {
        emoji: '💰',
        title: 'Finanzas',
        tagline: 'Claridad total sobre tu dinero',
        color: 'from-yellow-500 to-amber-500',
        description: 'Trackea ingresos y gastos, establece presupuestos, y toma el control de tu economía. Sin apps bancarias complicadas.',
        screenshot: '/screenshots/dashboard.png',
        levels: {
            simple: '¿Gasté bien hoy? Check rápido',
            pro: 'Categorías de gastos, balance mensual',
            hero: 'Presupuesto detallado, gráficos, objetivos de ahorro'
        },
        features: [
            { title: 'Tracking de transacciones', desc: 'Registra cada ingreso y gasto en segundos', icon: '💳' },
            { title: 'Categorías de gastos', desc: 'Sabe exactamente a dónde va tu dinero', icon: '📊' },
            { title: 'Presupuesto mensual', desc: 'Define límites y respétalos', icon: '📋' },
            { title: 'Balance en tiempo real', desc: 'Visualiza tu situación actual al instante', icon: '💹' },
            { title: 'Historial mensual', desc: 'Compara meses y detecta tendencias', icon: '📈' },
            { title: 'Gráficos de gastos', desc: 'Visualización por categoría', icon: '🥧' }
        ],
        testimonial: {
            text: 'Solo el hecho de trackear hizo que gastara menos. La visibilidad es poder.',
            name: 'María L.',
            result: '+€350/mes de ahorro'
        }
    },
    consciencia: {
        emoji: '🧘',
        title: 'Consciencia',
        tagline: 'Claridad mental y transformación interior',
        color: 'from-indigo-500 to-purple-500',
        description: 'No es solo journaling. Es un sistema completo de claridad mental, reflexión, y transformación interior. El área que lo cambia todo.',
        screenshot: '/screenshots/consciousness.png',
        levels: {
            simple: 'Gratitud diaria (3 cosas)',
            pro: 'Journaling, mood tracking, reflexión nocturna',
            hero: 'Viajes de consciencia, rituales completos, correlaciones'
        },
        features: [
            { title: 'Ritual Matutino', desc: 'Intención del día, gratitud, visualización', icon: '🌅' },
            { title: 'Cierre Nocturno', desc: 'Reflexión, wins del día, preparación de mañana', icon: '🌙' },
            { title: 'Journaling Guiado', desc: 'Prompts que te hacen pensar profundo', icon: '✍️' },
            { title: 'Viajes de Consciencia', desc: 'Rutas de 7-30 días para transformación', icon: '🧭' },
            { title: 'Práctica de Gratitud', desc: 'Entrena tu cerebro para ver lo bueno', icon: '🙏' },
            { title: 'Tracking de Mood', desc: 'Patrones emocionales y correlaciones', icon: '📊' }
        ],
        testimonial: {
            text: 'El cierre del día se convirtió en mi ritual sagrado. 10 minutos que cambiaron mi perspectiva.',
            name: 'Miguel R.',
            result: 'De burnout a claridad mental en 2 meses'
        }
    },
    relaciones: {
        emoji: '👥',
        title: 'Relaciones',
        tagline: 'Conexiones significativas',
        color: 'from-pink-500 to-rose-500',
        description: 'Un CRM personal para mantener vivas las relaciones que importan. Nunca olvides un cumpleaños ni pierdas el contacto con alguien importante.',
        screenshot: '/screenshots/dashboard.png',
        levels: {
            simple: 'Lista de personas importantes',
            pro: 'Frecuencia de contacto, cumpleaños',
            hero: 'Notas detalladas, historial, categorías, recordatorios'
        },
        features: [
            { title: 'CRM personal', desc: 'Gestiona todos tus contactos importantes', icon: '📇' },
            { title: 'Frecuencia de contacto', desc: 'Sabe cuándo hablar con quién', icon: '📅' },
            { title: 'Cumpleaños y fechas', desc: 'Nunca olvides una fecha importante', icon: '🎂' },
            { title: 'Notas e intereses', desc: 'Recuerda detalles personales', icon: '📝' },
            { title: 'Historial de interacciones', desc: 'Cuándo hablaste por última vez', icon: '📞' },
            { title: 'Categorías', desc: 'Familia, amigos, profesional...', icon: '👨‍👩‍👧‍👦' }
        ],
        testimonial: {
            text: 'Reconecté con amigos que había perdido. La app me recordó que no les había escrito en meses.',
            name: 'Sara P.',
            result: '15 relaciones reactivadas'
        }
    }
}

export default function FeatureDetailPage() {
    const { areaId } = useParams()
    const feature = featureData[areaId]

    if (!feature) {
        return (
            <SalesLayout>
                <div className="py-32 text-center">
                    <h1 className="text-4xl font-black mb-4">Área no encontrada</h1>
                    <Link to="/venta/features" className="text-violet-400 hover:text-violet-300">
                        ← Ver todas las características
                    </Link>
                </div>
            </SalesLayout>
        )
    }

    return (
        <SalesLayout>
            {/* Hero */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <Link
                        to="/venta/features"
                        className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
                    >
                        ← Todas las características
                    </Link>

                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <div className="text-6xl mb-4">{feature.emoji}</div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4">
                                {feature.title}
                            </h1>
                            <p className={`text-xl bg-gradient-to-r ${feature.color} bg-clip-text text-transparent font-medium mb-4`}>
                                {feature.tagline}
                            </p>
                            <p className="text-white/60 text-lg mb-8">
                                {feature.description}
                            </p>
                            <Link
                                to="/register"
                                className={`inline-flex px-8 py-4 bg-gradient-to-r ${feature.color} rounded-xl font-bold hover:opacity-90 transition-opacity`}
                            >
                                Probar gratis →
                            </Link>
                        </div>

                        <div className="flex-1">
                            <div className={`rounded-3xl bg-gradient-to-br ${feature.color} p-1`}>
                                <img
                                    src={feature.screenshot}
                                    alt={`${feature.title} screenshot`}
                                    className="rounded-[1.3rem] w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3 Levels */}
            <section className="py-16 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        Elige tu nivel de profundidad
                    </h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="text-2xl mb-2">🌱</div>
                            <h3 className="font-bold text-emerald-400 mb-2">Simple</h3>
                            <p className="text-white/60 text-sm">{feature.levels.simple}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                            <div className="text-2xl mb-2">⚡</div>
                            <h3 className="font-bold text-violet-400 mb-2">Pro</h3>
                            <p className="text-white/60 text-sm">{feature.levels.pro}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                            <div className="text-2xl mb-2">🏆</div>
                            <h3 className="font-bold text-amber-400 mb-2">Héroe</h3>
                            <p className="text-white/60 text-sm">{feature.levels.hero}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        Todo lo que incluye
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {feature.features.map((f, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">{f.icon}</span>
                                    <div>
                                        <h3 className="font-bold mb-1">{f.title}</h3>
                                        <p className="text-white/50 text-sm">{f.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className={`p-8 rounded-3xl bg-gradient-to-br ${feature.color} bg-opacity-10 border border-white/10`}>
                        <p className="text-xl italic text-white/80 mb-6">
                            "{feature.testimonial.text}"
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center font-bold text-lg`}>
                                    {feature.testimonial.name[0]}
                                </div>
                                <span className="font-medium">{feature.testimonial.name}</span>
                            </div>
                            <span className="text-emerald-400 font-bold">{feature.testimonial.result}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 text-center">
                <h2 className="text-3xl font-black mb-4">
                    ¿Listo para dominar tu {feature.title.toLowerCase()}?
                </h2>
                <p className="text-white/50 mb-8">
                    Empieza gratis. Elige tu nivel. Evoluciona.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/register"
                        className={`px-8 py-4 bg-gradient-to-r ${feature.color} rounded-xl font-bold hover:opacity-90 transition-opacity`}
                    >
                        Crear cuenta gratis
                    </Link>
                    <Link
                        to="/venta/features"
                        className="px-8 py-4 bg-white/10 border border-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
                    >
                        Ver otras áreas
                    </Link>
                </div>
            </section>
        </SalesLayout>
    )
}
