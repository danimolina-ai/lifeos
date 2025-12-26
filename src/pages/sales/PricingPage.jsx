// Pricing Page - Free Forever
import { Link } from 'react-router-dom'
import SalesLayout from '../../components/sales/SalesLayout'
import { Check } from 'lucide-react'

const allFeatures = [
    '8 áreas de vida integradas',
    'Dashboard unificado',
    'Nutrición: tracking de calorías y macros',
    'Entrenamiento: 400+ ejercicios',
    'Hábitos: streaks y estadísticas',
    'Trabajo: matriz Eisenhower + proyectos',
    'Personal: tareas y subtareas',
    'Finanzas: ingresos y gastos',
    'Consciencia: journaling y gratitud',
    'Relaciones: CRM personal',
    'Sincronización en la nube',
    'Acceso desde cualquier dispositivo',
    'Exportación de datos',
    'Sin anuncios',
    'Sin límites de uso',
    'Actualizaciones gratuitas'
]

const comparisons = [
    { app: 'MyFitnessPal Premium', price: '€9.99/mes', for: 'Solo nutrición' },
    { app: 'Todoist Pro', price: '€4/mes', for: 'Solo tareas' },
    { app: 'Strong Pro', price: '€4.99/mes', for: 'Solo entrenos' },
    { app: 'Notion Plus', price: '€8/mes', for: 'Notas y docs' },
    { app: 'YNAB', price: '€14.99/mes', for: 'Solo finanzas' }
]

const faqs = [
    { q: '¿Realmente es gratis para siempre?', a: 'Sí, 100%. Life OS es un proyecto de pasión. No hay versión premium, no hay features bloqueadas, no hay "prueba gratis de 7 días". Todo está incluido, siempre.' },
    { q: '¿Cómo se sostiene económicamente?', a: 'Life OS es un proyecto personal, no una startup buscando inversores. Los costes de servidor son mínimos gracias a la arquitectura elegida. Si algún día necesitamos ayuda, será a través de donaciones voluntarias, nunca bloqueando features.' },
    { q: '¿Mis datos están seguros?', a: 'Tus datos se almacenan encriptados en Supabase (infraestructura de primer nivel). Puedes exportar todo en cualquier momento. No vendemos datos a terceros.' },
    { q: '¿Puedo usar solo algunas áreas?', a: 'Absolutamente. En el onboarding eliges qué áreas te interesan. Si solo quieres nutrición y entrenamientos, solo verás eso. El sistema se adapta a ti.' },
    { q: '¿Hay app móvil?', a: 'Life OS es una web app progresiva (PWA). Funciona como una app nativa en móvil, tablet y escritorio. Puedes añadirla a tu pantalla de inicio. No hay que descargar nada de las stores.' }
]

export default function PricingPage() {
    return (
        <SalesLayout>
            {/* Hero */}
            <section className="py-24 px-6 text-center">
                <p className="text-emerald-400 font-bold text-sm mb-4 tracking-wider">PRECIOS</p>
                <h1 className="text-4xl md:text-6xl font-black mb-6">
                    Gratis. <span className="text-emerald-400">Para siempre.</span>
                    <br />
                    <span className="text-white/50">Sin trampa.</span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">
                    Todas las características. Todos los usuarios.
                    Sin versión premium. Sin anuncios. Sin trucos.
                </p>
            </section>

            {/* Pricing Card */}
            <section className="pb-16 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-zinc-900/50 to-transparent border border-emerald-500/30">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 font-medium text-sm mb-4">
                                ✨ Plan Único
                            </div>
                            <div className="flex items-end justify-center gap-2">
                                <span className="text-6xl font-black">€0</span>
                                <span className="text-white/40 pb-2">/mes, por siempre</span>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mb-8">
                            {allFeatures.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span className="text-white/70 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/register"
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                        >
                            Empezar gratis ahora →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-center mb-8">
                        Lo que pagarías usando apps separadas
                    </h2>

                    <div className="space-y-3 mb-8">
                        {comparisons.map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div>
                                    <p className="font-medium">{c.app}</p>
                                    <p className="text-white/40 text-sm">{c.for}</p>
                                </div>
                                <p className="text-red-400 font-bold">{c.price}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                        <p className="text-red-400 font-bold text-2xl mb-2">
                            Total: ~€41.97/mes
                        </p>
                        <p className="text-white/50">
                            Y aún así, tus datos estarían fragmentados en 5 apps diferentes.
                        </p>
                    </div>

                    <div className="mt-6 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <p className="text-emerald-400 font-bold text-2xl mb-2">
                            Life OS: €0/mes
                        </p>
                        <p className="text-white/50">
                            Todo en uno. Para siempre. Sin fragmentación.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-center mb-8">
                        Preguntas sobre precios
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
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

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        ¿Qué estás esperando?
                    </h2>
                    <p className="text-white/50 text-lg mb-8">
                        Es gratis. No hay riesgo. El único coste es no probarlo.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        Crear mi cuenta gratis →
                    </Link>
                </div>
            </section>
        </SalesLayout>
    )
}
