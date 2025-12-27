// Pricing Page - Free + Pro Plans with Competitor Comparison
import { Link } from 'react-router-dom'
import SalesLayout from '../../components/sales/SalesLayout'
import { Check, X, Star } from 'lucide-react'

const freeFeatures = [
    '8 áreas de vida integradas',
    'Dashboard unificado',
    'Tracking básico de nutrición',
    'Hábitos con streaks',
    'Lista de tareas básica',
    'Journaling diario',
    'Sincronización en la nube',
    'Sin anuncios'
]

const proFeatures = [
    'Todo lo del plan gratuito',
    'Nutrición avanzada: macros detallados + historial',
    'Entrenamiento: 400+ ejercicios + PRs + progresión',
    'Hábitos: estadísticas avanzadas + correlaciones',
    'Trabajo: matriz Eisenhower + OKRs + Deep Work',
    'Finanzas: presupuestos + gráficos + tendencias',
    'Consciencia: viajes guiados + rituales completos',
    'Relaciones: CRM completo + recordatorios',
    'Backup automático',
    'Exportación completa de datos',
    'Soporte prioritario',
    'Acceso a beta features'
]

// Comprehensive competitor comparison
const competitors = [
    {
        area: '🍎 Nutrición',
        apps: [
            { name: 'MyFitnessPal Premium', price: 79.99, period: 'año', features: 'Calorías, macros, recetas' },
            { name: 'Yazio Pro', price: 49.99, period: 'año', features: 'Tracking, planes, ayuno' },
            { name: 'Cronometer Gold', price: 49.99, period: 'año', features: 'Micronutrientes detallados' }
        ]
    },
    {
        area: '💪 Entrenamiento',
        apps: [
            { name: 'Strong Pro', price: 69.99, period: 'año', features: 'Rutinas, pesos, PRs' },
            { name: 'JEFIT Elite', price: 79.99, period: 'año', features: 'Ejercicios, rutinas, social' },
            { name: 'Hevy Pro', price: 69.99, period: 'año', features: 'Tracking, gráficos, PRs' }
        ]
    },
    {
        area: '✅ Hábitos',
        apps: [
            { name: 'Streaks', price: 5.99, period: 'único', features: '12 hábitos máximo' },
            { name: 'Habitify Premium', price: 45.99, period: 'año', features: 'Ilimitados, stats' },
            { name: 'Fabulous Premium', price: 79.99, period: 'año', features: 'Coaching, rutinas' }
        ]
    },
    {
        area: '💼 Productividad',
        apps: [
            { name: 'Todoist Pro', price: 48, period: 'año', features: 'Proyectos, etiquetas, filtros' },
            { name: 'Things 3', price: 49.99, period: 'único', features: 'GTD, proyectos, áreas' },
            { name: 'TickTick Premium', price: 35.99, period: 'año', features: 'Tareas, calendario, pomodoro' }
        ]
    },
    {
        area: '💰 Finanzas',
        apps: [
            { name: 'YNAB', price: 99, period: 'año', features: 'Presupuesto, metas, sync' },
            { name: 'Copilot', price: 69.99, period: 'año', features: 'Tracking, categorías, trends' },
            { name: 'Fintonic Premium', price: 29.99, period: 'año', features: 'Gastos, alertas, scoring' }
        ]
    },
    {
        area: '🧘 Mindfulness',
        apps: [
            { name: 'Headspace', price: 69.99, period: 'año', features: 'Meditación, sueño, enfoque' },
            { name: 'Calm', price: 69.99, period: 'año', features: 'Meditación, historias, música' },
            { name: 'Day One Premium', price: 34.99, period: 'año', features: 'Journaling, fotos, backup' }
        ]
    },
    {
        area: '👥 Relaciones',
        apps: [
            { name: 'Monica CRM', price: 90, period: 'año', features: 'Contactos, notas, tasks' },
            { name: 'Clay', price: 120, period: 'año', features: 'CRM personal, sync, AI' },
            { name: 'Covve Premium', price: 59.99, period: 'año', features: 'Networking, CRM' }
        ]
    }
]

const faqs = [
    { q: '¿Puedo empezar gratis y subir a Pro después?', a: 'Sí. El plan gratuito es completamente funcional. Puedes usar Life OS gratis todo el tiempo que quieras y decidir más adelante si quieres las características avanzadas.' },
    { q: '¿Qué pasa con mis datos si cancelo Pro?', a: 'Tus datos nunca se borran. Si cancelas Pro, vuelves al plan gratuito pero conservas todo tu historial. Solo pierdes acceso a las features avanzadas.' },
    { q: '¿Hay descuentos para estudiantes?', a: 'Sí, ofrecemos 50% de descuento para estudiantes con email universitario verificado. Solo €50/año.' },
    { q: '¿Puedo pagar mensualmente?', a: 'Por ahora solo ofrecemos el plan anual. Esto nos permite mantener el precio bajo y enfocarnos en construir el mejor producto posible.' },
    { q: '¿Hay garantía de devolución?', a: 'Sí, 30 días de garantía total. Si no estás satisfecho, te devolvemos el 100% sin preguntas.' }
]

export default function PricingPage() {
    // Calculate total competitor cost
    const totalCompetitorCostYearly = competitors.reduce((total, cat) => {
        const cheapest = Math.min(...cat.apps.map(a => a.price))
        return total + cheapest
    }, 0)

    return (
        <SalesLayout>
            {/* Hero */}
            <section className="py-24 px-6 text-center">
                <p className="text-violet-400 font-bold text-sm mb-4 tracking-wider">PRECIOS</p>
                <h1 className="text-4xl md:text-6xl font-black mb-6">
                    Un precio. <span className="text-violet-400">Toda tu vida.</span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">
                    Deja de pagar por 7 apps diferentes.
                    Unifica todo en un solo sistema por una fracción del precio.
                </p>
            </section>

            {/* Pricing Cards */}
            <section className="pb-16 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                        <div className="mb-6">
                            <p className="text-white/50 text-sm font-medium mb-2">GRATIS</p>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-black">€0</span>
                                <span className="text-white/40 pb-1">/siempre</span>
                            </div>
                            <p className="text-white/50 text-sm mt-2">Perfecto para empezar</p>
                        </div>

                        <div className="space-y-3 mb-8">
                            {freeFeatures.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span className="text-white/70 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/register"
                            className="w-full py-4 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center"
                        >
                            Empezar gratis
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent border-2 border-violet-500/50 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span className="px-4 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full text-sm font-bold flex items-center gap-1">
                                <Star className="w-4 h-4" /> MEJOR VALOR
                            </span>
                        </div>

                        <div className="mb-6 pt-2">
                            <p className="text-violet-400 text-sm font-medium mb-2">PRO</p>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-black">€100</span>
                                <span className="text-white/40 pb-1">/año</span>
                            </div>
                            <p className="text-white/50 text-sm mt-2">
                                Solo €8.33/mes — Ahorra €500+ vs apps separadas
                            </p>
                        </div>

                        <div className="space-y-3 mb-8">
                            {proFeatures.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                                    <span className="text-white/70 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/register"
                            className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                        >
                            Obtener Pro →
                        </Link>
                    </div>
                </div>
            </section>

            {/* MASSIVE Competitor Comparison */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent via-red-500/5 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-red-400 font-bold text-sm mb-4 tracking-wider">LA REALIDAD</p>
                        <h2 className="text-3xl md:text-4xl font-black mb-4">
                            Lo que pagarías usando las apps <span className="text-red-400">del mercado</span>
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto">
                            Hemos analizado las apps más populares en cada categoría.
                            Esto es lo que te costaría tener un sistema completo usando apps separadas.
                        </p>
                    </div>

                    {/* Comparison Table */}
                    <div className="space-y-6 mb-12">
                        {competitors.map((category, catIdx) => (
                            <div key={catIdx} className="overflow-hidden rounded-2xl border border-white/10">
                                <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                                    <h3 className="font-bold text-lg">{category.area}</h3>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {category.apps.map((app, appIdx) => (
                                        <div key={appIdx} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium">{app.name}</p>
                                                <p className="text-white/40 text-sm">{app.features}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-red-400 font-bold">€{app.price}</p>
                                                <p className="text-white/40 text-xs">/{app.period}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Comparison */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <X className="w-8 h-8 text-red-500" />
                                <p className="text-xl font-bold">Apps separadas</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-4xl font-black text-red-400">
                                    €{Math.round(totalCompetitorCostYearly)}+<span className="text-xl">/año</span>
                                </p>
                                <p className="text-white/50 text-sm mt-1">
                                    Usando la opción más barata de cada categoría
                                </p>
                            </div>
                            <ul className="space-y-2 text-white/60 text-sm">
                                <li className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-400" />
                                    7 apps diferentes que gestionar
                                </li>
                                <li className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-400" />
                                    Datos fragmentados sin conexión
                                </li>
                                <li className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-400" />
                                    7 interfaces diferentes que aprender
                                </li>
                                <li className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-400" />
                                    Sin correlaciones entre áreas
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                                    <Check className="w-5 h-5" />
                                </div>
                                <p className="text-xl font-bold">Life OS Pro</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-4xl font-black text-violet-400">
                                    €100<span className="text-xl">/año</span>
                                </p>
                                <p className="text-white/50 text-sm mt-1">
                                    Ahorro de <span className="text-emerald-400 font-bold">€{Math.round(totalCompetitorCostYearly) - 100}</span> al año
                                </p>
                            </div>
                            <ul className="space-y-2 text-white/60 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    Todo en una sola app
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    Datos conectados e inteligentes
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    Una interfaz unificada
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    Correlaciones automáticas entre áreas
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Savings highlight */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                            <span className="text-4xl">💰</span>
                            <div className="text-left">
                                <p className="text-emerald-400 font-bold text-xl">
                                    Ahorra €{Math.round(totalCompetitorCostYearly) - 100} al año
                                </p>
                                <p className="text-white/50 text-sm">
                                    + la tranquilidad de tener todo en un solo lugar
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black text-center mb-8">
                        Life OS incluye TODO esto
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-white/50 font-normal">Característica</th>
                                    <th className="text-center py-4 px-4 text-white/50 font-normal">Apps separadas</th>
                                    <th className="text-center py-4 px-4">
                                        <span className="text-violet-400 font-bold">Life OS</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    ['Tracking de calorías y macros', 'MyFitnessPal €80/año', true],
                                    ['Rutinas de gym con PRs', 'Strong €70/año', true],
                                    ['Hábitos con streaks', 'Habitify €46/año', true],
                                    ['Tareas con Eisenhower', 'Todoist €48/año', true],
                                    ['Presupuesto y gastos', 'YNAB €99/año', true],
                                    ['Meditación y journaling', 'Headspace €70/año', true],
                                    ['CRM personal', 'Monica €90/año', true],
                                    ['Dashboard unificado', '❌ No existe', true],
                                    ['Correlaciones entre áreas', '❌ No existe', true],
                                    ['Todos tus datos conectados', '❌ No existe', true]
                                ].map(([feature, other, lifeos], i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-white/80">{feature}</td>
                                        <td className="py-4 px-4 text-center text-red-400/80 text-sm">{other}</td>
                                        <td className="py-4 px-4 text-center">
                                            {lifeos ? (
                                                <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                                            ) : (
                                                <X className="w-5 h-5 text-red-400 mx-auto" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-white/5">
                                    <td className="py-4 px-4 font-bold">Precio total</td>
                                    <td className="py-4 px-4 text-center text-red-400 font-bold">€500+/año</td>
                                    <td className="py-4 px-4 text-center text-emerald-400 font-bold">€100/año</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-center mb-8">
                        Preguntas frecuentes
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
                        ¿Listo para simplificar tu vida?
                    </h2>
                    <p className="text-white/50 text-lg mb-8">
                        Empieza gratis hoy. Sube a Pro cuando quieras.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            Empezar gratis →
                        </Link>
                        <Link
                            to="/demo"
                            className="px-8 py-4 bg-white/10 border border-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
                        >
                            Ver demo primero
                        </Link>
                    </div>
                </div>
            </section>
        </SalesLayout>
    )
}

