// Resources Page - Guides and Tutorials
import { Link } from 'react-router-dom'
import SalesLayout from '../../components/sales/SalesLayout'

const guides = [
    {
        emoji: '🚀',
        title: 'Guía de Inicio Rápido',
        description: 'Configura tu Life OS en 5 minutos y empieza a ver resultados desde el día 1.',
        time: '5 min',
        type: 'Guía'
    },
    {
        emoji: '🍎',
        title: 'Domina tu Nutrición',
        description: 'Aprende a trackear comidas, configurar macros, y usar las comidas guardadas.',
        time: '10 min',
        type: 'Tutorial'
    },
    {
        emoji: '💪',
        title: 'Entrenamientos Efectivos',
        description: 'Crea rutinas, trackea pesos, y rompe tus records personales.',
        time: '8 min',
        type: 'Tutorial'
    },
    {
        emoji: '✅',
        title: 'Sistema de Hábitos',
        description: 'Construye identidad a través de pequeñas acciones diarias.',
        time: '7 min',
        type: 'Tutorial'
    },
    {
        emoji: '💼',
        title: 'Productividad de Élite',
        description: 'Matriz de Eisenhower, Deep Work, y gestión de proyectos.',
        time: '12 min',
        type: 'Guía'
    },
    {
        emoji: '🧘',
        title: 'Journaling para Claridad',
        description: 'El cierre del día que transformará tu perspectiva.',
        time: '6 min',
        type: 'Tutorial'
    }
]

const tips = [
    {
        title: 'Empieza con 1-2 áreas',
        description: 'No intentes usar las 8 áreas desde el día 1. Elige las más importantes para ti y domínalas primero.'
    },
    {
        title: 'El cierre del día es sagrado',
        description: '5 minutos antes de dormir para reflexionar cambiará tu perspectiva. No lo skippees.'
    },
    {
        title: 'Los hábitos construyen identidad',
        description: 'Cada hábito completado es un voto hacia la persona que quieres ser.'
    },
    {
        title: 'La consistencia > la perfección',
        description: 'Un día malo no arruina tu progreso. No completar streaks es parte del proceso.'
    }
]

export default function ResourcesPage() {
    return (
        <SalesLayout>
            {/* Hero */}
            <section className="py-24 px-6 text-center">
                <p className="text-cyan-400 font-bold text-sm mb-4 tracking-wider">RECURSOS</p>
                <h1 className="text-4xl md:text-6xl font-black mb-6">
                    Aprende a sacar el
                    <br />
                    <span className="text-cyan-400">máximo partido</span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">
                    Guías, tutoriales, y consejos para dominar Life OS
                    y transformar tu vida.
                </p>
            </section>

            {/* Guides Grid */}
            <section className="pb-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8">📚 Guías y Tutoriales</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {guides.map((guide, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-4xl">{guide.emoji}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/50">{guide.type}</span>
                                        <span className="text-white/30 text-xs">{guide.time}</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-violet-400 transition-colors">{guide.title}</h3>
                                <p className="text-white/50 text-sm">{guide.description}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-white/30 mt-8">
                        Más guías próximamente...
                    </p>
                </div>
            </section>

            {/* Pro Tips */}
            <section className="py-16 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">💡 Consejos de Usuarios Expertos</h2>

                    <div className="space-y-4">
                        {tips.map((tip, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-bold mb-2">{tip.title}</h3>
                                <p className="text-white/50">{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Section Placeholder */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">🎬 Video Tutoriales</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto">
                                        <span className="text-2xl">▶️</span>
                                    </div>
                                    <p className="text-white/40">Video próximamente</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        ¿Listo para empezar?
                    </h2>
                    <p className="text-white/50 text-lg mb-8">
                        La mejor forma de aprender es haciendo. Crea tu cuenta y experimenta.
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
                            Probar demo
                        </Link>
                    </div>
                </div>
            </section>
        </SalesLayout>
    )
}
