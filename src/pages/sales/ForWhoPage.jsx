// For Who Page - Target Personas
import { Link } from 'react-router-dom'
import SalesLayout from '../../components/sales/SalesLayout'

const personas = [
    {
        emoji: '🏋️',
        title: 'Fitness Enthusiast',
        tagline: 'Tu cuerpo es tu templo',
        color: 'from-red-500/20 to-orange-500/10',
        description: 'Entrenas consistentemente, cuidas tu alimentación, y buscas una forma de trackear todo sin usar 5 apps diferentes.',
        challenges: [
            'MyFitnessPal para comida, Strong para entrenos, otra para hábitos...',
            'Pierdes tiempo alternando entre apps',
            'No ves la conexión entre nutrición, entrenamiento y recuperación'
        ],
        solution: 'Life OS unifica nutrición, entrenamientos, hábitos de sueño, y tracking corporal en un solo lugar. Todo conectado.',
        result: 'Usuarios reportan -8kg en promedio en 3 meses de uso consistente',
        testimonial: {
            text: 'Por fin puedo ver cómo mi alimentación afecta mis entrenamientos y mi energía. Game changer.',
            name: 'Carlos M.',
            role: 'Powerlifter amateur'
        }
    },
    {
        emoji: '💼',
        title: 'Profesional Ocupado',
        tagline: 'Muchas responsabilidades, poco tiempo',
        color: 'from-violet-500/20 to-purple-500/10',
        description: 'Tu agenda está siempre llena. Necesitas un sistema que te ayude a priorizar y no olvidar nada importante.',
        challenges: [
            'Decenas de tareas compitiendo por tu atención',
            'Sensación de estar siempre ocupado pero no avanzar',
            'Trabajo invade vida personal y viceversa'
        ],
        solution: 'Matriz de Eisenhower para priorizar. Separación clara entre trabajo y personal. Cierre del día para desconectar.',
        result: '+3 horas productivas por semana en promedio',
        testimonial: {
            text: 'La matriz de Eisenhower me obligó a ser honesto sobre qué es urgente vs importante. Cambió todo.',
            name: 'Laura S.',
            role: 'Product Manager'
        }
    },
    {
        emoji: '🧘',
        title: 'Mindful Achiever',
        tagline: 'Alto rendimiento con paz interior',
        color: 'from-indigo-500/20 to-blue-500/10',
        description: 'Buscas el éxito, pero no a costa de tu salud mental. Valoras la reflexión, la gratitud, y el autoconocimiento.',
        challenges: [
            'Burnout pasado o miedo a caer en él',
            'Quieres lograr cosas sin sacrificar tu bienestar',
            'Necesitas tiempo para pensar, no solo hacer'
        ],
        solution: 'Sección de consciencia integrada: journaling, gratitud, cierre del día. Todo conectado con tus otras áreas.',
        result: '87% de usuarios reportan mejor claridad mental',
        testimonial: {
            text: 'El cierre del día se convirtió en mi ritual sagrado. 10 minutos que cambiaron mi perspectiva.',
            name: 'Miguel R.',
            role: 'Developer'
        }
    },
    {
        emoji: '💰',
        title: 'Buscador de Control Financiero',
        tagline: 'Quieres saber a dónde va tu dinero',
        color: 'from-yellow-500/20 to-orange-500/10',
        description: 'El dinero entra y se va, y no siempre sabes exactamente cómo. Quieres visibilidad y control.',
        challenges: [
            'Sorpresas negativas a fin de mes',
            'Gastos hormiga que no detectas',
            'Sin presupuesto claro, sin objetivos financieros'
        ],
        solution: 'Tracking simple de ingresos y gastos. Presupuesto mensual. Categorías claras. Sin complicaciones.',
        result: '+€350/mes de ahorro promedio después de 2 meses',
        testimonial: {
            text: 'Solo el hecho de trackear hizo que gastara menos. La visibilidad es poder.',
            name: 'Ana G.',
            role: 'Freelancer'
        }
    },
    {
        emoji: '🚀',
        title: 'Emprendedor / Side Hustler',
        tagline: 'Construyendo algo propio',
        color: 'from-emerald-500/20 to-teal-500/10',
        description: 'Tienes proyectos, ideas, y ambición. Necesitas gestionar múltiples frentes sin que nada se caiga.',
        challenges: [
            'Demasiados proyectos, ideas dispersas',
            'Trabajo principal + side project = caos',
            'No cuidas tu salud mientras construyes'
        ],
        solution: 'Gestión de proyectos con OKRs. Separación clara de contextos. Y las 8 áreas para no olvidar tu salud.',
        result: 'Usuarios lanzan side projects 40% más rápido',
        testimonial: {
            text: 'Life OS me obligó a ser estratégico. No puedo hacer todo, pero ahora hago lo correcto.',
            name: 'Pablo T.',
            role: 'Founder'
        }
    }
]

export default function ForWhoPage() {
    return (
        <SalesLayout>
            {/* Hero */}
            <section className="py-24 px-6 text-center">
                <p className="text-fuchsia-400 font-bold text-sm mb-4 tracking-wider">¿PARA QUIÉN ES LIFE OS?</p>
                <h1 className="text-4xl md:text-6xl font-black mb-6">
                    Diseñado para personas
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">que quieren más</span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">
                    No es para todos. Es para quienes están dispuestos a tomar el control
                    de las 8 áreas fundamentales de su vida.
                </p>
            </section>

            {/* Personas */}
            <section className="pb-24 px-6">
                <div className="max-w-5xl mx-auto space-y-16">
                    {personas.map((persona, index) => (
                        <div
                            key={index}
                            className={`rounded-3xl bg-gradient-to-br ${persona.color} border border-white/10 p-8 md:p-12`}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-5xl">{persona.emoji}</span>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black">{persona.title}</h2>
                                    <p className="text-white/50">{persona.tagline}</p>
                                </div>
                            </div>

                            <p className="text-white/70 text-lg mb-8">{persona.description}</p>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Challenges */}
                                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                                    <h3 className="text-red-400 font-bold mb-4">😫 Tus desafíos</h3>
                                    <ul className="space-y-3">
                                        {persona.challenges.map((c, i) => (
                                            <li key={i} className="flex items-start gap-2 text-white/60">
                                                <span className="text-red-400 mt-1">•</span>
                                                <span>{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Solution */}
                                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <h3 className="text-emerald-400 font-bold mb-4">✅ La solución</h3>
                                    <p className="text-white/60">{persona.solution}</p>
                                    <p className="mt-4 text-emerald-400 font-medium">{persona.result}</p>
                                </div>
                            </div>

                            {/* Testimonial */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-white/80 italic text-lg mb-4">"{persona.testimonial.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold">
                                        {persona.testimonial.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{persona.testimonial.name}</p>
                                        <p className="text-white/40 text-xs">{persona.testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        ¿Te identificas con alguno?
                    </h2>
                    <p className="text-white/50 text-lg mb-8">
                        No importa cuál sea tu punto de partida. Life OS se adapta a ti.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        Descubre cómo puede ayudarte →
                    </Link>
                </div>
            </section>
        </SalesLayout>
    )
}
