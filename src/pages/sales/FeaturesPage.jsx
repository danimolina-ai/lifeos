// Features Page - Detailed features showcase
import { Link } from 'react-router-dom'
import SalesLayout from '../../components/sales/SalesLayout'

const features = [
    {
        id: 'nutrition',
        emoji: '🍎',
        title: 'Nutrición',
        tagline: 'Control total sobre lo que comes',
        color: 'from-orange-500 to-amber-500',
        description: 'Trackea cada comida, entiende tus macros, y toma el control de tu alimentación sin volverte loco.',
        features: [
            { title: 'Base de datos 500+ alimentos', desc: 'Busca y añade alimentos en segundos con datos nutricionales precisos' },
            { title: 'Tracking de calorías y macros', desc: 'Visualiza proteínas, carbohidratos y grasas en tiempo real' },
            { title: 'Comidas guardadas', desc: 'Guarda tus comidas frecuentes para añadirlas con un click' },
            { title: 'Planificación semanal', desc: 'Planifica tus comidas con antelación y mantén el control' },
            { title: 'Vista por día/semana', desc: 'Analiza tus patrones alimenticios a lo largo del tiempo' },
            { title: 'Objetivos personalizados', desc: 'Define tus metas de calorías y macros según tus objetivos' }
        ]
    },
    {
        id: 'workout',
        emoji: '💪',
        title: 'Entrenamiento',
        tagline: 'Rutinas que generan resultados',
        color: 'from-red-500 to-rose-500',
        description: 'Diseña rutinas personalizadas, trackea tu progreso, y rompe tus records personales.',
        features: [
            { title: '400+ ejercicios', desc: 'Base de datos completa con instrucciones y músculos trabajados' },
            { title: 'Tracking de pesos y series', desc: 'Registra cada set con pesos, reps y notas' },
            { title: 'Templates de rutinas', desc: 'Crea y guarda rutinas para reutilizar' },
            { title: 'Records personales', desc: 'Visualiza tus PRs y cuándo los batiste' },
            { title: 'Historial de entrenamientos', desc: 'Revisa todos tus workouts pasados' },
            { title: 'Progreso visual', desc: 'Gráficos de evolución por ejercicio' }
        ]
    },
    {
        id: 'habits',
        emoji: '✅',
        title: 'Hábitos',
        tagline: 'Automatiza tu excelencia',
        color: 'from-emerald-500 to-green-500',
        description: 'Construye identidad a través de pequeñas acciones diarias. El sistema de hábitos más adictivo que probarás.',
        features: [
            { title: 'Streaks y rachas', desc: 'Mantén la motivación con rachas visuales' },
            { title: 'Identidad asociada', desc: 'Conecta cada hábito con la persona que quieres ser' },
            { title: 'Frecuencia flexible', desc: 'Hábitos diarios, semanales o personalizados' },
            { title: 'Estadísticas de adherencia', desc: 'Visualiza tu % de cumplimiento' },
            { title: 'Vista calendario', desc: 'Historial visual de hábitos completados' },
            { title: 'Iconos personalizados', desc: 'Haz cada hábito único y recognizable' }
        ]
    },
    {
        id: 'work',
        emoji: '💼',
        title: 'Trabajo',
        tagline: 'Productividad de élite',
        color: 'from-violet-500 to-purple-500',
        description: 'Gestiona proyectos, prioriza con la matriz de Eisenhower, y domina el Deep Work.',
        features: [
            { title: 'Matriz de Eisenhower', desc: 'Prioriza tareas por urgencia e importancia' },
            { title: 'Proyectos con OKRs', desc: 'Define objetivos y resultados clave' },
            { title: 'Bloques de Deep Work', desc: 'Marca tareas que requieren enfoque profundo' },
            { title: 'Inbox Zero', desc: 'Procesa tareas de tu bandeja de entrada' },
            { title: 'Contextos de trabajo', desc: 'Filtra por @oficina, @casa, @computer...' },
            { title: 'Estimación de tiempo', desc: 'Planifica cuánto llevará cada tarea' }
        ]
    },
    {
        id: 'personal',
        emoji: '🏠',
        title: 'Personal',
        tagline: 'Tu vida fuera del trabajo',
        color: 'from-cyan-500 to-teal-500',
        description: 'Gestiona todo lo que no es trabajo: hogar, trámites, salud, aprendizaje...',
        features: [
            { title: 'Categorías personalizadas', desc: 'Organiza por áreas de tu vida' },
            { title: 'Subtareas ilimitadas', desc: 'Desglosa tareas complejas' },
            { title: 'Fechas límite', desc: 'No olvides nada importante' },
            { title: 'Prioridades', desc: 'Sabe qué hacer primero' },
            { title: 'Vista por categoría', desc: 'Filtra y enfócate' },
            { title: 'Notas y detalles', desc: 'Añade contexto a cada tarea' }
        ]
    },
    {
        id: 'finances',
        emoji: '💰',
        title: 'Finanzas',
        tagline: 'Claridad sobre tu dinero',
        color: 'from-yellow-500 to-orange-500',
        description: 'Trackea ingresos y gastos, establece presupuestos, y toma el control de tu economía.',
        features: [
            { title: 'Tracking de transacciones', desc: 'Registra cada ingreso y gasto' },
            { title: 'Categorías de gastos', desc: 'Sabe a dónde va tu dinero' },
            { title: 'Presupuesto mensual', desc: 'Define límites y respétalos' },
            { title: 'Balance en tiempo real', desc: 'Visualiza tu situación actual' },
            { title: 'Historial mensual', desc: 'Compara meses y evolución' },
            { title: 'Gráficos de gastos', desc: 'Visualización por categoría' }
        ]
    },
    {
        id: 'consciousness',
        emoji: '🧘',
        title: 'Consciencia',
        tagline: 'Claridad mental',
        color: 'from-indigo-500 to-blue-500',
        description: 'Journaling, gratitud, y reflexión. El espacio para conectar contigo mismo.',
        features: [
            { title: 'Journaling diario', desc: 'Escribe y procesa tus pensamientos' },
            { title: 'Práctica de gratitud', desc: '3 cosas por las que agradecer' },
            { title: 'Cierre del día', desc: 'Reflexiona sobre tus wins y aprendizajes' },
            { title: 'Tracking de mood', desc: 'Registra cómo te sientes cada día' },
            { title: 'Historial de reflexiones', desc: 'Revisa tu evolución mental' },
            { title: 'Prompts guiados', desc: 'Preguntas para reflexionar' }
        ]
    },
    {
        id: 'relationships',
        emoji: '👥',
        title: 'Relaciones',
        tagline: 'Conexiones significativas',
        color: 'from-pink-500 to-rose-500',
        description: 'Un CRM personal para mantener vivas las relaciones que importan.',
        features: [
            { title: 'CRM personal', desc: 'Gestiona todos tus contactos importantes' },
            { title: 'Frecuencia de contacto', desc: 'Sabe cuándo hablar con quién' },
            { title: 'Cumpleaños y fechas', desc: 'Nunca olvides una fecha importante' },
            { title: 'Notas e intereses', desc: 'Recuerda detalles personales' },
            { title: 'Historial de interacciones', desc: 'Cuándo hablaste por última vez' },
            { title: 'Categorías', desc: 'Familia, amigos, profesional...' }
        ]
    }
]

export default function FeaturesPage() {
    return (
        <SalesLayout>
            {/* Hero */}
            <section className="py-24 px-6 text-center">
                <p className="text-violet-400 font-bold text-sm mb-4 tracking-wider">CARACTERÍSTICAS</p>
                <h1 className="text-4xl md:text-6xl font-black mb-6">
                    Todo lo que necesitas.
                    <br />
                    <span className="text-white/50">Nada que no.</span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">
                    8 áreas de vida, un solo sistema.
                    Cada feature diseñado con obsesión por el detalle.
                </p>
            </section>

            {/* Features Grid */}
            <section className="pb-24 px-6">
                <div className="max-w-6xl mx-auto space-y-24">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}
                        >
                            {/* Image/Mockup placeholder */}
                            <div className="flex-1 w-full">
                                <div className={`aspect-video rounded-3xl bg-gradient-to-br ${feature.color} p-1`}>
                                    <div className="w-full h-full rounded-[1.4rem] bg-zinc-900 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-6xl mb-4">{feature.emoji}</div>
                                            <p className="text-white/40">Screenshot {feature.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl">{feature.emoji}</span>
                                    <div>
                                        <h2 className="text-3xl font-black">{feature.title}</h2>
                                        <p className="text-white/50">{feature.tagline}</p>
                                    </div>
                                </div>

                                <p className="text-white/70 text-lg mb-8">{feature.description}</p>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {feature.features.map((f, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <h4 className="font-bold text-sm mb-1">{f.title}</h4>
                                            <p className="text-white/50 text-xs">{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">
                        ¿Listo para verlo en acción?
                    </h2>
                    <p className="text-white/50 text-lg mb-8">
                        Prueba todas las características gratis. Sin tarjeta de crédito.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            Crear cuenta gratis →
                        </Link>
                        <Link
                            to="/demo"
                            className="px-8 py-4 bg-white/10 border border-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
                        >
                            Ver demo
                        </Link>
                    </div>
                </div>
            </section>
        </SalesLayout>
    )
}
