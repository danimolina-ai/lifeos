// Book Execution Systems - Interactive learning from curated books
// Each book has lessons with practical exercises to apply the teachings

export const BOOK_EXECUTION_SYSTEMS = {
    'atomic-habits': {
        id: 'atomic-habits',
        area: 'habits',
        book: {
            title: 'Hábitos Atómicos',
            author: 'James Clear',
            cover: '⚛️',
            description: 'Pequeños cambios, resultados extraordinarios',
            amazonUrl: 'https://www.amazon.es/s?k=hábitos+atómicos+james+clear',
            audibleUrl: 'https://www.audible.com/search?keywords=atomic+habits'
        },
        duration: '4 semanas',
        totalLessons: 4,
        lessons: [
            {
                id: 'lesson-1',
                week: 1,
                title: 'Ley 1: Hacerlo Obvio',
                subtitle: 'Diseña tu entorno para el éxito',
                icon: '👁️',
                keyInsights: [
                    'Los hábitos comienzan con una señal',
                    'Lo que ves determina lo que haces',
                    'El entorno es el arquitecto invisible de tu comportamiento'
                ],
                exercises: [
                    {
                        id: 'ex-1-1',
                        type: 'reflection',
                        title: 'Auditoría de hábitos',
                        instruction: 'Lista todos tus hábitos actuales (buenos y malos). Marca cada uno con +, -, o = según si es positivo, negativo o neutro.',
                        placeholder: 'Ej: Levantarme (+), Ver el móvil al despertar (-), Ducharme (=)...',
                        inputType: 'textarea'
                    },
                    {
                        id: 'ex-1-2',
                        type: 'formula',
                        title: 'Intención de implementación',
                        instruction: 'Crea una intención clara para tu nuevo hábito usando la fórmula:',
                        formula: 'Voy a [CONDUCTA] a las [HORA] en [LUGAR]',
                        fields: [
                            { id: 'behavior', label: 'Conducta', placeholder: 'meditar 5 minutos' },
                            { id: 'time', label: 'Hora', placeholder: '7:00 AM' },
                            { id: 'place', label: 'Lugar', placeholder: 'en mi habitación' }
                        ]
                    },
                    {
                        id: 'ex-1-3',
                        type: 'formula',
                        title: 'Habit Stacking (Apilamiento de hábitos)',
                        instruction: 'Conecta tu nuevo hábito a uno que ya haces automáticamente:',
                        formula: 'Después de [HÁBITO ACTUAL], voy a [NUEVO HÁBITO]',
                        fields: [
                            { id: 'current', label: 'Hábito actual', placeholder: 'servirme el café' },
                            { id: 'new', label: 'Nuevo hábito', placeholder: 'escribir 3 cosas por las que estoy agradecido' }
                        ]
                    },
                    {
                        id: 'ex-1-4',
                        type: 'action',
                        title: 'Diseño del entorno',
                        instruction: 'Modifica tu espacio físico para hacer el hábito OBVIO. ¿Qué cambiarás?',
                        placeholder: 'Ej: Dejar el libro de meditación junto a la cama, poner las vitaminas junto al desayuno...',
                        inputType: 'textarea'
                    }
                ],
                weeklyChallenge: {
                    title: 'Reto de la semana',
                    description: 'Implementa tu habit stacking durante 7 días consecutivos',
                    checkpoints: 7
                }
            },
            {
                id: 'lesson-2',
                week: 2,
                title: 'Ley 2: Hacerlo Atractivo',
                subtitle: 'Haz que quieras hacer el hábito',
                icon: '🧲',
                keyInsights: [
                    'Cuanto más atractivo, más probable que lo hagas',
                    'La dopamina impulsa el deseo, no el placer',
                    'Únete a culturas donde tu comportamiento es normal'
                ],
                exercises: [
                    {
                        id: 'ex-2-1',
                        type: 'formula',
                        title: 'Tentación Bundling (Empaquetamiento de tentaciones)',
                        instruction: 'Combina algo que NECESITAS hacer con algo que QUIERES hacer:',
                        formula: 'Después de [HÁBITO QUE NECESITO], haré [HÁBITO QUE QUIERO]',
                        fields: [
                            { id: 'need', label: 'Lo que necesito hacer', placeholder: '30 min de ejercicio' },
                            { id: 'want', label: 'Lo que quiero hacer', placeholder: 'ver mi serie favorita' }
                        ]
                    },
                    {
                        id: 'ex-2-2',
                        type: 'reflection',
                        title: 'Reformula tu identidad',
                        instruction: 'En lugar de "tengo que hacer X", escribe "Soy el tipo de persona que..."',
                        placeholder: 'Ej: Soy el tipo de persona que no se pierde un entrenamiento. Soy alguien que lee todos los días...',
                        inputType: 'textarea'
                    },
                    {
                        id: 'ex-2-3',
                        type: 'list',
                        title: 'Tu tribu ideal',
                        instruction: 'Lista 3 grupos, comunidades o personas que ya tienen el hábito que quieres desarrollar:',
                        items: 3,
                        placeholder: 'Ej: Club de lectura del barrio'
                    }
                ],
                weeklyChallenge: {
                    title: 'Reto de la semana',
                    description: 'Practica el tentación bundling al menos 5 días',
                    checkpoints: 5
                }
            },
            {
                id: 'lesson-3',
                week: 3,
                title: 'Ley 3: Hacerlo Fácil',
                subtitle: 'Reduce la fricción al mínimo',
                icon: '🎯',
                keyInsights: [
                    'La mejor manera de empezar es reducir la fricción',
                    'Prepara tu entorno para la próxima vez',
                    'La regla de los 2 minutos: escala hacia abajo'
                ],
                exercises: [
                    {
                        id: 'ex-3-1',
                        type: 'reflection',
                        title: 'Regla de los 2 minutos',
                        instruction: 'Reduce tu hábito a una versión de 2 minutos o menos:',
                        placeholder: 'Ej: "Leer 30 páginas" → "Leer una página". "Correr 5km" → "Ponerme las zapatillas"...',
                        inputType: 'textarea'
                    },
                    {
                        id: 'ex-3-2',
                        type: 'action',
                        title: 'Preparación del entorno',
                        instruction: 'Prepara tu espacio la noche anterior para que mañana sea FÁCIL empezar. ¿Qué prepararás?',
                        placeholder: 'Ej: Dejar la ropa de deporte lista, preparar la mochila del gym, tener el libro abierto en la mesa...',
                        inputType: 'textarea'
                    },
                    {
                        id: 'ex-3-3',
                        type: 'friction-audit',
                        title: 'Auditoría de fricción',
                        instruction: 'Identifica los pasos entre tú y tu hábito. ¿Cuántos pasos puedes eliminar?',
                        fields: [
                            { id: 'habit', label: 'Hábito', placeholder: 'Hacer ejercicio por la mañana' },
                            { id: 'steps', label: 'Pasos actuales (lista)', placeholder: '1. Buscar ropa, 2. Preparar botella, 3. Buscar auriculares...' },
                            { id: 'eliminate', label: 'Pasos a eliminar', placeholder: 'Tendré todo preparado la noche anterior' }
                        ]
                    }
                ],
                weeklyChallenge: {
                    title: 'Reto de la semana',
                    description: 'Usa la regla de 2 minutos cada día para iniciar tu hábito',
                    checkpoints: 7
                }
            },
            {
                id: 'lesson-4',
                week: 4,
                title: 'Ley 4: Hacerlo Satisfactorio',
                subtitle: 'Celebra y refuerza el hábito',
                icon: '🎉',
                keyInsights: [
                    'Lo que se recompensa, se repite',
                    'El tracking visual es poderoso',
                    'Nunca rompas la cadena dos veces'
                ],
                exercises: [
                    {
                        id: 'ex-4-1',
                        type: 'reflection',
                        title: 'Recompensa inmediata',
                        instruction: 'Diseña una recompensa pequeña pero satisfactoria para después de completar tu hábito:',
                        placeholder: 'Ej: Después de meditar, me preparo mi café favorito. Después de entrenar, 10 min de podcast...',
                        inputType: 'textarea'
                    },
                    {
                        id: 'ex-4-2',
                        type: 'tracker-setup',
                        title: 'Habit Tracker',
                        instruction: 'Crea tu sistema de seguimiento visual. Cada vez que completes el hábito, marca el día.',
                        habitToTrack: true
                    },
                    {
                        id: 'ex-4-3',
                        type: 'contract',
                        title: 'Contrato de hábito',
                        instruction: 'Crea un compromiso formal contigo mismo:',
                        fields: [
                            { id: 'habit', label: 'El hábito que me comprometo a hacer', placeholder: 'Meditar 5 minutos cada mañana' },
                            { id: 'consequence', label: 'Si rompo el compromiso...', placeholder: '...haré 20 flexiones' },
                            { id: 'witness', label: 'Persona que será mi testigo', placeholder: 'Mi pareja / amigo / familiar' }
                        ]
                    }
                ],
                weeklyChallenge: {
                    title: 'Reto de la semana',
                    description: 'Mantén tu cadena de hábitos durante 7 días. Si la rompes, no la rompas dos veces.',
                    checkpoints: 7
                }
            }
        ],
        finalReflection: {
            title: 'Reflexión Final',
            questions: [
                '¿Qué hábito has consolidado durante estas 4 semanas?',
                '¿Cuál de las 4 leyes te resultó más útil?',
                '¿Qué cambios has notado en tu vida?',
                '¿Cuál será tu próximo hábito a desarrollar?'
            ]
        }
    }
};

// Helper to get book system by ID
export const getBookSystem = (bookId) => BOOK_EXECUTION_SYSTEMS[bookId];

// Helper to get all book systems for an area
export const getBookSystemsByArea = (area) =>
    Object.values(BOOK_EXECUTION_SYSTEMS).filter(book => book.area === area);

// Helper to calculate progress
export const calculateBookProgress = (bookId, userProgress) => {
    const book = BOOK_EXECUTION_SYSTEMS[bookId];
    if (!book || !userProgress) return 0;

    const totalExercises = book.lessons.reduce((acc, lesson) => acc + lesson.exercises.length, 0);
    const completedExercises = userProgress.completedExercises?.length || 0;

    return Math.round((completedExercises / totalExercises) * 100);
};
