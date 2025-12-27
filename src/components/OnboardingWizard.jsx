// Elite Onboarding Wizard
// Designed with psychological, persuasion, and storytelling principles
import { useState } from 'react'
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react'

// Area configurations with questions
const AREAS_CONFIG = {
    nutrition: {
        emoji: '🍎',
        title: 'Nutrición',
        subtitle: 'Control total de lo que comes',
        color: 'from-orange-500 to-amber-500',
        questions: [
            {
                id: 'goal',
                question: '¿Cuál es tu objetivo nutricional?',
                type: 'choice',
                options: [
                    { value: 'lose', label: '🔥 Perder grasa', desc: 'Déficit calórico controlado' },
                    { value: 'gain', label: '💪 Ganar músculo', desc: 'Superávit con alta proteína' },
                    { value: 'maintain', label: '⚖️ Mantener', desc: 'Equilibrio perfecto' },
                    { value: 'health', label: '🥗 Comer más sano', desc: 'Sin contar calorías' }
                ]
            },
            {
                id: 'calories',
                question: '¿Cuántas calorías diarias buscas?',
                type: 'slider',
                min: 1200,
                max: 4000,
                step: 50,
                default: 2200,
                suffix: ' kcal'
            },
            {
                id: 'protein',
                question: '¿Cuánta proteína en gramos?',
                type: 'slider',
                min: 50,
                max: 300,
                step: 5,
                default: 150,
                suffix: 'g'
            }
        ]
    },
    workout: {
        emoji: '💪',
        title: 'Entrenamiento',
        subtitle: 'Construye tu mejor versión física',
        color: 'from-red-500 to-rose-500',
        questions: [
            {
                id: 'days',
                question: '¿Cuántos días entrenas por semana?',
                type: 'choice',
                options: [
                    { value: 2, label: '2 días' },
                    { value: 3, label: '3 días' },
                    { value: 4, label: '4 días' },
                    { value: 5, label: '5 días' },
                    { value: 6, label: '6 días' }
                ]
            },
            {
                id: 'type',
                question: '¿Qué tipo de entrenamiento?',
                type: 'choice',
                options: [
                    { value: 'strength', label: '🏋️ Fuerza', desc: 'Pesas y resistencia' },
                    { value: 'cardio', label: '🏃 Cardio', desc: 'Aeróbico y resistencia' },
                    { value: 'mixed', label: '⚡ Mixto', desc: 'Lo mejor de ambos' }
                ]
            },
            {
                id: 'location',
                question: '¿Dónde entrenas?',
                type: 'choice',
                options: [
                    { value: 'gym', label: '🏢 Gimnasio' },
                    { value: 'home', label: '🏠 Casa' },
                    { value: 'both', label: '🔄 Ambos' }
                ]
            }
        ]
    },
    habits: {
        emoji: '✅',
        title: 'Hábitos',
        subtitle: 'Automatiza tu excelencia',
        color: 'from-emerald-500 to-green-500',
        questions: [
            {
                id: 'count',
                question: '¿Cuántos hábitos nuevos quieres desarrollar?',
                type: 'choice',
                options: [
                    { value: 1, label: '1 hábito', desc: 'Enfoque máximo' },
                    { value: 3, label: '3 hábitos', desc: 'Equilibrio perfecto' },
                    { value: 5, label: '5 hábitos', desc: 'Transformación total' }
                ]
            },
            {
                id: 'focus',
                question: '¿En qué área te cuesta más ser consistente?',
                type: 'choice',
                options: [
                    { value: 'morning', label: '🌅 Rutina matutina' },
                    { value: 'exercise', label: '💪 Ejercicio' },
                    { value: 'sleep', label: '😴 Sueño' },
                    { value: 'focus', label: '🎯 Concentración' }
                ]
            }
        ]
    },
    work: {
        emoji: '💼',
        title: 'Trabajo',
        subtitle: 'Productividad de élite',
        color: 'from-violet-500 to-purple-500',
        questions: [
            {
                id: 'style',
                question: '¿Cómo trabajas mejor?',
                type: 'choice',
                options: [
                    { value: 'projects', label: '📁 Por proyectos', desc: 'Organización por contexto' },
                    { value: 'tasks', label: '📝 Tareas sueltas', desc: 'Lista única' },
                    { value: 'both', label: '🔄 Ambos', desc: 'Flexibilidad total' }
                ]
            },
            {
                id: 'deepWork',
                question: '¿Cuántas horas de trabajo profundo buscas al día?',
                type: 'choice',
                options: [
                    { value: 2, label: '2 horas' },
                    { value: 4, label: '4 horas' },
                    { value: 6, label: '6 horas' }
                ]
            }
        ]
    },
    personal: {
        emoji: '🏠',
        title: 'Personal',
        subtitle: 'Tu vida fuera del trabajo',
        color: 'from-cyan-500 to-teal-500',
        questions: [
            {
                id: 'areas',
                question: '¿Qué áreas personales quieres organizar?',
                type: 'multi',
                options: [
                    { value: 'home', label: '🏠 Hogar' },
                    { value: 'admin', label: '📋 Trámites' },
                    { value: 'health', label: '❤️ Salud' },
                    { value: 'learning', label: '📚 Aprendizaje' }
                ]
            }
        ]
    },
    finances: {
        emoji: '💰',
        title: 'Finanzas',
        subtitle: 'Libertad financiera',
        color: 'from-yellow-500 to-orange-500',
        questions: [
            {
                id: 'budget',
                question: '¿Cuál es tu presupuesto mensual?',
                type: 'slider',
                min: 500,
                max: 10000,
                step: 100,
                default: 2000,
                prefix: '€'
            },
            {
                id: 'tracking',
                question: '¿Qué quieres trackear?',
                type: 'multi',
                options: [
                    { value: 'expenses', label: '💸 Gastos' },
                    { value: 'income', label: '💵 Ingresos' },
                    { value: 'savings', label: '🐷 Ahorros' },
                    { value: 'investments', label: '📈 Inversiones' }
                ]
            }
        ]
    },
    consciousness: {
        emoji: '🧘',
        title: 'Consciencia',
        subtitle: 'Claridad mental',
        color: 'from-indigo-500 to-blue-500',
        questions: [
            {
                id: 'practices',
                question: '¿Qué prácticas te interesan?',
                type: 'multi',
                options: [
                    { value: 'meditation', label: '🧘 Meditación' },
                    { value: 'journaling', label: '✍️ Journaling' },
                    { value: 'gratitude', label: '🙏 Gratitud' },
                    { value: 'breathing', label: '🌬️ Respiración' }
                ]
            }
        ]
    },
    relationships: {
        emoji: '👥',
        title: 'Relaciones',
        subtitle: 'Conexiones significativas',
        color: 'from-pink-500 to-rose-500',
        questions: [
            {
                id: 'focus',
                question: '¿Qué relaciones quieres cultivar?',
                type: 'multi',
                options: [
                    { value: 'family', label: '👨‍👩‍👧 Familia' },
                    { value: 'friends', label: '👥 Amigos' },
                    { value: 'partner', label: '❤️ Pareja' },
                    { value: 'professional', label: '💼 Profesionales' }
                ]
            }
        ]
    }
}

// Motivational messages between steps
const MOTIVATIONAL_MESSAGES = [
    { title: '¡Increíble!', text: 'Ya tienes más claridad que el 90% de las personas. Sigue así.' },
    { title: '¡Vas genial!', text: 'Cada respuesta te acerca más a tu mejor versión.' },
    { title: '¡Excelente!', text: 'Definir lo que quieres es el primer paso para conseguirlo.' },
    { title: '¡Imparable!', text: 'Tu compromiso contigo mismo es admirable.' }
]

// Sample mantras
const SAMPLE_MANTRAS = [
    'Cada día cuenta',
    'Disciplina = Libertad',
    'Una versión mejor de mí',
    'Progreso, no perfección',
    'El momento es ahora'
]

// TIER 2.3: First Win - Quick habits to create immediately
const FIRST_WIN_HABITS = [
    { id: 'water', name: 'Beber 8 vasos de agua', emoji: '💧', category: 'Health', frequency: 'daily', color: 'blue' },
    { id: 'walk', name: 'Caminar 10 minutos', emoji: '🚶', category: 'Fitness', frequency: 'daily', color: 'green' },
    { id: 'gratitude', name: 'Escribir 3 gratitudes', emoji: '🙏', category: 'Mindfulness', frequency: 'daily', color: 'purple' },
    { id: 'read', name: 'Leer 10 páginas', emoji: '📚', category: 'Learning', frequency: 'daily', color: 'amber' },
    { id: 'stretch', name: 'Estirar 5 minutos', emoji: '🧘', category: 'Health', frequency: 'daily', color: 'pink' },
    { id: 'sleep', name: 'Dormir antes de las 11pm', emoji: '😴', category: 'Health', frequency: 'daily', color: 'indigo' }
]

// TIER 2.5: Quick Tour steps
const TOUR_STEPS = [
    { emoji: '🏠', title: 'Hoy', desc: 'Tu centro de mando diario. Ve todo lo importante de un vistazo.' },
    { emoji: '🍎', title: 'Nutrición', desc: 'Trackea comidas, macros y alcanza tus objetivos.' },
    { emoji: '💪', title: 'Gym', desc: 'Registra entrenamientos, PRs y ve tu progreso.' },
    { emoji: '✅', title: 'Hábitos', desc: 'Construye rutinas y mantén rachas.' },
    { emoji: '📊', title: 'Dashboard', desc: 'Visualiza tu progreso y correlaciones.' }
]

export default function OnboardingWizard({ data, setData, onComplete }) {
    // Steps: 0=welcome, 1=name, 2=areas, 3+=area questions, then mantra, firstWin, tour, complete
    const [step, setStep] = useState(0)
    const [name, setName] = useState('')
    const [selectedAreas, setSelectedAreas] = useState([])
    const [areaResponses, setAreaResponses] = useState({})
    const [mantra, setMantra] = useState('')
    const [currentAreaIndex, setCurrentAreaIndex] = useState(0)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [showMotivational, setShowMotivational] = useState(false)
    // TIER 2.3: First Win state
    const [selectedFirstHabit, setSelectedFirstHabit] = useState(null)
    // TIER 2.5: Tour state
    const [currentTourStep, setCurrentTourStep] = useState(0)

    const allAreas = Object.keys(AREAS_CONFIG)

    // Calculate total steps dynamically
    const getQuestionSteps = () => {
        let steps = []
        selectedAreas.forEach(areaId => {
            const area = AREAS_CONFIG[areaId]
            area.questions.forEach((q, qi) => {
                steps.push({ areaId, questionIndex: qi })
            })
        })
        return steps
    }

    const questionSteps = getQuestionSteps()
    // Steps: welcome(0), name(1), areas(2), questions(3 to 3+n-1), mantra, firstWin, tour
    const mantrasStepNumber = 3 + questionSteps.length
    const firstWinStepNumber = mantrasStepNumber + 1
    const tourStepNumber = firstWinStepNumber + 1
    const totalSteps = tourStepNumber + 1

    // Current state helpers
    const isWelcomeStep = step === 0
    const isNameStep = step === 1
    const isAreasStep = step === 2
    const isQuestionStep = step >= 3 && step < mantrasStepNumber
    const isMantrasStep = step === mantrasStepNumber
    const isFirstWinStep = step === firstWinStepNumber
    const isTourStep = step === tourStepNumber

    const getCurrentQuestion = () => {
        if (!isQuestionStep) return null
        const qStep = questionSteps[step - 3]
        if (!qStep) return null
        return {
            ...AREAS_CONFIG[qStep.areaId].questions[qStep.questionIndex],
            area: AREAS_CONFIG[qStep.areaId],
            areaId: qStep.areaId
        }
    }

    const toggleArea = (areaId) => {
        setSelectedAreas(prev =>
            prev.includes(areaId)
                ? prev.filter(a => a !== areaId)
                : [...prev, areaId]
        )
    }

    const handleResponse = (questionId, areaId, value) => {
        setAreaResponses(prev => ({
            ...prev,
            [areaId]: {
                ...prev[areaId],
                [questionId]: value
            }
        }))
    }

    const canProceed = () => {
        if (isWelcomeStep) return true
        if (isNameStep) return name.trim().length >= 2
        if (isAreasStep) return selectedAreas.length >= 1
        if (isQuestionStep) {
            const q = getCurrentQuestion()
            if (!q) return true
            const response = areaResponses[q.areaId]?.[q.id]
            if (q.type === 'multi') return response && response.length > 0
            return response !== undefined
        }
        if (isMantrasStep) return true // Mantra is optional
        if (isFirstWinStep) return selectedFirstHabit !== null // Must select a habit
        if (isTourStep) return true // Tour is just informational
        return true
    }

    const handleNext = () => {
        // Show motivational message occasionally
        if (isQuestionStep && Math.random() > 0.7) {
            setShowMotivational(true)
            setTimeout(() => {
                setShowMotivational(false)
                setStep(step + 1)
            }, 1500)
        } else {
            setStep(step + 1)
        }
    }

    const handleComplete = () => {
        const today = new Date().toISOString().split('T')[0]

        // Build goals from responses
        const goals = {
            calories: areaResponses.nutrition?.calories || 2200,
            protein: areaResponses.nutrition?.protein || 150,
            water: 8,
            sleep: 8,
            steps: 10000
        }

        // TIER 2.3: Create first habit from selection
        const firstHabit = selectedFirstHabit ? {
            id: `habit_${Date.now()}`,
            name: selectedFirstHabit.name,
            icon: selectedFirstHabit.emoji, // Use icon field like the rest of the app
            category: selectedFirstHabit.category?.toLowerCase() || 'health',
            frequency: selectedFirstHabit.frequency || 'daily',
            customDays: [0, 1, 2, 3, 4, 5, 6], // All days
            createdAt: today,
            isActive: true
        } : null

        // Save to data
        setData(prev => ({
            ...prev,
            user: {
                ...prev.user,
                name,
                onboardingComplete: true,
                goals,
                mantra,
                activeAreas: selectedAreas,
                onboardingResponses: areaResponses,
                demoDataEnabled: false
            },
            habits: firstHabit ? [firstHabit, ...(prev.habits || [])] : (prev.habits || []),
            days: {
                [today]: {
                    id: today,
                    energy_level: 3,
                    sleep_hours: 0,
                    sleep_quality: 0,
                    water_glasses: 0,
                    focus_note: ''
                }
            },
            finances: {
                ...prev.finances,
                monthlyBudget: areaResponses.finances?.budget || 2000
            }
        }))

        onComplete()
    }

    // Render choice question
    const renderChoice = (q) => {
        const current = areaResponses[q.areaId]?.[q.id]
        return (
            <div className="grid gap-3">
                {q.options.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => handleResponse(q.id, q.areaId, opt.value)}
                        className={`w-full p-4 rounded-2xl text-left transition-all ${current === opt.value
                            ? 'bg-gradient-to-r ' + q.area.color + ' text-white shadow-lg scale-[1.02]'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <div className="font-medium">{opt.label}</div>
                        {opt.desc && <div className="text-sm opacity-70 mt-1">{opt.desc}</div>}
                    </button>
                ))}
            </div>
        )
    }

    // Render multi-select question
    const renderMulti = (q) => {
        const current = areaResponses[q.areaId]?.[q.id] || []
        return (
            <div className="grid grid-cols-2 gap-3">
                {q.options.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => {
                            const newVal = current.includes(opt.value)
                                ? current.filter(v => v !== opt.value)
                                : [...current, opt.value]
                            handleResponse(q.id, q.areaId, newVal)
                        }}
                        className={`p-4 rounded-2xl text-center transition-all ${current.includes(opt.value)
                            ? 'bg-gradient-to-r ' + q.area.color + ' text-white shadow-lg'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        )
    }

    // Render slider question
    const renderSlider = (q) => {
        const current = areaResponses[q.areaId]?.[q.id] ?? q.default
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <span className="text-5xl font-bold">
                        {q.prefix}{current}{q.suffix}
                    </span>
                </div>
                <input
                    type="range"
                    min={q.min}
                    max={q.max}
                    step={q.step}
                    value={current}
                    onChange={(e) => handleResponse(q.id, q.areaId, parseInt(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none bg-white/10 accent-violet-500"
                />
                <div className="flex justify-between text-sm text-white/40">
                    <span>{q.prefix}{q.min}{q.suffix}</span>
                    <span>{q.prefix}{q.max}{q.suffix}</span>
                </div>
            </div>
        )
    }

    // Motivational overlay
    if (showMotivational) {
        const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
                <div className="fixed inset-0 bg-gradient-to-br from-violet-950/50 via-zinc-950 to-fuchsia-950/30" />
                <div className="relative text-center animate-pulse">
                    <div className="text-6xl mb-4">✨</div>
                    <h2 className="text-3xl font-bold mb-2">{msg.title}</h2>
                    <p className="text-white/60 text-lg">{msg.text}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
            <div className="fixed inset-0 bg-gradient-to-br from-violet-950/50 via-zinc-950 to-fuchsia-950/30 pointer-events-none" />

            <div className="relative flex-1 flex flex-col max-w-lg mx-auto w-full px-6 py-8">
                {/* Progress bar */}
                {step > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between text-xs text-white/40 mb-2">
                            <span>Paso {step} de {totalSteps - 1}</span>
                            <span>{Math.round((step / (totalSteps - 1)) * 100)}%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                                style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Welcome Step */}
                {isWelcomeStep && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="text-7xl mb-6 animate-bounce">✨</div>
                        <h1 className="text-4xl font-bold mb-4">
                            Bienvenid@ a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Life OS</span>
                        </h1>
                        <p className="text-xl text-white/60 mb-8 max-w-md">
                            Tu viaje hacia la mejor versión de ti mismo comienza ahora.
                        </p>
                        <p className="text-white/40 mb-12">
                            Este proceso te tomará menos de 2 minutos.
                        </p>
                        <button
                            onClick={handleNext}
                            className="px-10 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            Comenzar <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Name Step */}
                {isNameStep && (
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-3xl font-bold mb-2">¿Cómo te llamas?</h1>
                        <p className="text-white/50 mb-8">Personalicemos tu experiencia</p>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-2xl outline-none focus:border-violet-500 transition-colors mb-4"
                        />

                        <p className="text-white/30 text-sm">
                            Este nombre aparecerá en tu dashboard cada día 👋
                        </p>
                    </div>
                )}

                {/* Areas Selection Step */}
                {isAreasStep && (
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-3xl font-bold mb-2">¿En qué áreas quieres trabajar?</h1>
                        <p className="text-white/50 mb-6">Selecciona las que te interesen (mínimo 1)</p>

                        <div className="grid grid-cols-2 gap-3 flex-1">
                            {allAreas.map(areaId => {
                                const area = AREAS_CONFIG[areaId]
                                const isSelected = selectedAreas.includes(areaId)
                                return (
                                    <button
                                        key={areaId}
                                        onClick={() => toggleArea(areaId)}
                                        className={`p-4 rounded-2xl text-center transition-all ${isSelected
                                            ? `bg-gradient-to-br ${area.color} shadow-lg scale-[1.02]`
                                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{area.emoji}</div>
                                        <div className="font-medium text-sm">{area.title}</div>
                                        {isSelected && (
                                            <div className="mt-2">
                                                <Check className="w-5 h-5 mx-auto" />
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <p className="text-center text-white/40 text-sm mt-4">
                            {selectedAreas.length} área{selectedAreas.length !== 1 ? 's' : ''} seleccionada{selectedAreas.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {/* Question Steps */}
                {isQuestionStep && (() => {
                    const q = getCurrentQuestion()
                    if (!q) return null
                    return (
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">{q.area.emoji}</span>
                                <span className="text-white/50 font-medium">{q.area.title}</span>
                            </div>

                            <h1 className="text-2xl font-bold mb-8">{q.question}</h1>

                            <div className="flex-1">
                                {q.type === 'choice' && renderChoice(q)}
                                {q.type === 'multi' && renderMulti(q)}
                                {q.type === 'slider' && renderSlider(q)}
                            </div>
                        </div>
                    )
                })()}

                {/* Mantra Step */}
                {isMantrasStep && (
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-3xl font-bold mb-2">Tu mantra personal</h1>
                        <p className="text-white/50 mb-6">
                            Esta frase aparecerá cada día para recordarte tu propósito
                        </p>

                        <textarea
                            value={mantra}
                            onChange={(e) => setMantra(e.target.value)}
                            placeholder="Escribe tu mantra..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl outline-none focus:border-violet-500 resize-none mb-6"
                        />

                        <p className="text-white/40 text-sm mb-4">O elige uno de estos:</p>
                        <div className="flex flex-wrap gap-2">
                            {SAMPLE_MANTRAS.map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMantra(m)}
                                    className={`px-4 py-2 rounded-xl text-sm transition-all ${mantra === m
                                        ? 'bg-violet-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* TIER 2.3: First Win Step - Create first habit */}
                {isFirstWinStep && (
                    <div className="flex-1 flex flex-col">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-4">🎯</div>
                            <h1 className="text-3xl font-bold mb-2">Tu primera victoria</h1>
                            <p className="text-white/50">
                                Elige un hábito simple para empezar. Lo completarás hoy mismo.
                            </p>
                        </div>

                        <div className="grid gap-3 flex-1">
                            {FIRST_WIN_HABITS.map(habit => (
                                <button
                                    key={habit.id}
                                    onClick={() => setSelectedFirstHabit(habit)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${selectedFirstHabit?.id === habit.id
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-[1.02]'
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-3xl">{habit.emoji}</span>
                                    <div>
                                        <div className="font-medium">{habit.name}</div>
                                        <div className="text-sm opacity-70">{habit.category}</div>
                                    </div>
                                    {selectedFirstHabit?.id === habit.id && (
                                        <Check className="w-6 h-6 ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <p className="text-center text-white/30 text-sm mt-4">
                            💡 Los hábitos pequeños construyen grandes transformaciones
                        </p>
                    </div>
                )}

                {/* TIER 2.5: Tour Step - Quick app intro */}
                {isTourStep && (
                    <div className="flex-1 flex flex-col">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-4">🚀</div>
                            <h1 className="text-3xl font-bold mb-2">¡Ya casi está!</h1>
                            <p className="text-white/50">
                                Conoce las áreas principales de Life OS
                            </p>
                        </div>

                        <div className="space-y-4 flex-1">
                            {TOUR_STEPS.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-2xl transition-all ${currentTourStep === idx
                                        ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 scale-[1.02]'
                                        : 'bg-white/5 border border-white/5'
                                        }`}
                                    onClick={() => setCurrentTourStep(idx)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.emoji}</span>
                                        <div>
                                            <div className="font-medium text-white">{item.title}</div>
                                            <div className="text-sm text-white/60">{item.desc}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-white/30 text-sm mt-4">
                            ✨ Explora cada área desde el menú lateral
                        </p>
                    </div>
                )}

                {/* Navigation */}
                {step > 0 && (
                    <div className="flex gap-3 pt-6 mt-auto">
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-5 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {isTourStep ? (
                            <button
                                onClick={handleComplete}
                                className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                            >
                                <Sparkles className="w-5 h-5" /> Comenzar mi viaje
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${canProceed()
                                    ? 'bg-violet-500 hover:bg-violet-600'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                                    }`}
                            >
                                Siguiente <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
