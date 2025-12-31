// Learning Database - Curated resources for each life area
// Organized by tier: simple (beginner), pro (intermediate), hero (advanced)

export const LEARNING_DATABASE = {
    finances: {
        books: [
            // Simple Tier
            { id: 'fin-b-1', title: 'Padre Rico, Padre Pobre', author: 'Robert Kiyosaki', tier: 'simple', cover: '💰', description: 'Fundamentos de educación financiera y mentalidad de riqueza', pages: 336 },
            { id: 'fin-b-2', title: 'El Hombre Más Rico de Babilonia', author: 'George S. Clason', tier: 'simple', cover: '🏛️', description: 'Principios atemporales de ahorro e inversión', pages: 144 },
            { id: 'fin-b-3', title: 'Los Secretos de la Mente Millonaria', author: 'T. Harv Eker', tier: 'simple', cover: '🧠', description: 'Cómo dominar el juego interior de la riqueza', pages: 232 },
            // Pro Tier
            { id: 'fin-b-4', title: 'El Inversor Inteligente', author: 'Benjamin Graham', tier: 'pro', cover: '📈', description: 'La biblia del value investing', pages: 640 },
            { id: 'fin-b-5', title: 'Psicología del Dinero', author: 'Morgan Housel', tier: 'pro', cover: '🎭', description: 'Lecciones atemporales sobre riqueza, codicia y felicidad', pages: 256 },
            { id: 'fin-b-6', title: 'Un Paso por Delante de Wall Street', author: 'Peter Lynch', tier: 'pro', cover: '🏃', description: 'Cómo utilizar lo que ya sabes para ganar dinero', pages: 304 },
            // Hero Tier
            { id: 'fin-b-7', title: 'The Intelligent Asset Allocator', author: 'William Bernstein', tier: 'hero', cover: '⚖️', description: 'Construcción de carteras para inversores sofisticados', pages: 224 },
            { id: 'fin-b-8', title: 'Security Analysis', author: 'Benjamin Graham', tier: 'hero', cover: '🔬', description: 'El texto definitivo sobre análisis fundamental', pages: 766 },
        ],
        audiobooks: [
            { id: 'fin-a-1', title: 'Piense y Hágase Rico', author: 'Napoleon Hill', tier: 'simple', cover: '💭', duration: '9h 35m', platform: 'Audible' },
            { id: 'fin-a-2', title: 'El Cuadrante del Flujo del Dinero', author: 'Robert Kiyosaki', tier: 'pro', cover: '🔄', duration: '7h 12m', platform: 'Audible' },
            { id: 'fin-a-3', title: 'The Millionaire Fastlane', author: 'MJ DeMarco', tier: 'hero', cover: '🚀', duration: '12h 45m', platform: 'Audible' },
        ],
        courses: [
            { id: 'fin-c-1', title: 'Finanzas Personales 101', platform: 'Coursera', tier: 'simple', cover: '🎓', duration: '4 weeks', url: 'https://coursera.org' },
            { id: 'fin-c-2', title: 'Investment Management', platform: 'Coursera', tier: 'pro', cover: '📊', duration: '6 weeks', url: 'https://coursera.org' },
            { id: 'fin-c-3', title: 'Financial Markets', platform: 'Yale/Coursera', tier: 'hero', cover: '🏦', duration: '7 weeks', url: 'https://coursera.org' },
        ]
    },

    nutrition: {
        books: [
            { id: 'nut-b-1', title: 'Cocina Comida Real', author: 'Carlos Ríos', tier: 'simple', cover: '🥗', description: 'Guía práctica para comer comida real', pages: 320 },
            { id: 'nut-b-2', title: 'El Método del Plato', author: 'Harvard', tier: 'simple', cover: '🍽️', description: 'Guía visual para una alimentación saludable', pages: 180 },
            { id: 'nut-b-3', title: 'La Dieta del Metabolismo Acelerado', author: 'Haylie Pomroy', tier: 'pro', cover: '🔥', description: 'Come más, pierde más', pages: 304 },
            { id: 'nut-b-4', title: 'Nutrición y Salud', author: 'José Mataix', tier: 'pro', cover: '📚', description: 'Manual académico de nutrición', pages: 782 },
            { id: 'nut-b-5', title: 'The Obesity Code', author: 'Jason Fung', tier: 'hero', cover: '⚖️', description: 'Descifrando los secretos de la pérdida de peso', pages: 328 },
        ],
        audiobooks: [
            { id: 'nut-a-1', title: 'Atomic Habits (Nutrición)', author: 'James Clear', tier: 'simple', cover: '⚛️', duration: '5h 35m', platform: 'Audible' },
            { id: 'nut-a-2', title: 'How Not to Die', author: 'Michael Greger', tier: 'pro', cover: '💚', duration: '17h 9m', platform: 'Audible' },
        ],
        courses: [
            { id: 'nut-c-1', title: 'Stanford Introduction to Food and Health', platform: 'Coursera', tier: 'simple', cover: '🎓', duration: '5 weeks', url: 'https://coursera.org' },
            { id: 'nut-c-2', title: 'Nutrición y Dietética', platform: 'edX', tier: 'pro', cover: '📊', duration: '8 weeks', url: 'https://edx.org' },
        ]
    },

    workout: {
        books: [
            { id: 'wrk-b-1', title: 'Starting Strength', author: 'Mark Rippetoe', tier: 'simple', cover: '🏋️', description: 'La guía definitiva para principiantes en fuerza', pages: 380 },
            { id: 'wrk-b-2', title: 'Anatomía del Entrenamiento de la Fuerza', author: 'Frederic Delavier', tier: 'simple', cover: '💪', description: 'Guía visual de ejercicios', pages: 192 },
            { id: 'wrk-b-3', title: 'The New Encyclopedia of Modern Bodybuilding', author: 'Arnold Schwarzenegger', tier: 'pro', cover: '🏆', description: 'La biblia del culturismo', pages: 800 },
            { id: 'wrk-b-4', title: 'Science and Practice of Strength Training', author: 'Vladimir Zatsiorsky', tier: 'hero', cover: '🔬', description: 'Ciencia del entrenamiento avanzado', pages: 264 },
        ],
        audiobooks: [
            { id: 'wrk-a-1', title: 'Can\'t Hurt Me', author: 'David Goggins', tier: 'simple', cover: '🔥', duration: '13h 37m', platform: 'Audible' },
            { id: 'wrk-a-2', title: 'Endure', author: 'Alex Hutchinson', tier: 'pro', cover: '🏃', duration: '11h 9m', platform: 'Audible' },
        ],
        courses: [
            { id: 'wrk-c-1', title: 'Exercise Physiology', platform: 'Coursera', tier: 'pro', cover: '🎓', duration: '6 weeks', url: 'https://coursera.org' },
            { id: 'wrk-c-2', title: 'Strength & Conditioning Coach Certification', platform: 'NSCA', tier: 'hero', cover: '📜', duration: '12 weeks', url: 'https://nsca.com' },
        ]
    },

    habits: {
        books: [
            { id: 'hab-b-1', title: 'Hábitos Atómicos', author: 'James Clear', tier: 'simple', cover: '⚛️', description: 'Pequeños cambios, resultados extraordinarios', pages: 320 },
            { id: 'hab-b-2', title: 'El Poder de los Hábitos', author: 'Charles Duhigg', tier: 'simple', cover: '🔄', description: 'Por qué hacemos lo que hacemos', pages: 416 },
            { id: 'hab-b-3', title: 'Tiny Habits', author: 'BJ Fogg', tier: 'pro', cover: '🌱', description: 'Los pequeños cambios que lo cambian todo', pages: 320 },
            { id: 'hab-b-4', title: 'Deep Work', author: 'Cal Newport', tier: 'pro', cover: '🎯', description: 'Reglas para el éxito en un mundo distraído', pages: 304 },
            { id: 'hab-b-5', title: 'The Compound Effect', author: 'Darren Hardy', tier: 'hero', cover: '📈', description: 'El efecto compuesto en la vida', pages: 176 },
        ],
        audiobooks: [
            { id: 'hab-a-1', title: 'Make Your Bed', author: 'William H. McRaven', tier: 'simple', cover: '🛏️', duration: '1h 53m', platform: 'Audible' },
            { id: 'hab-a-2', title: 'The 5 AM Club', author: 'Robin Sharma', tier: 'pro', cover: '🌅', duration: '11h 43m', platform: 'Audible' },
        ],
        courses: [
            { id: 'hab-c-1', title: 'The Science of Well-Being', platform: 'Yale/Coursera', tier: 'simple', cover: '🎓', duration: '10 weeks', url: 'https://coursera.org' },
            { id: 'hab-c-2', title: 'Learning How to Learn', platform: 'Coursera', tier: 'pro', cover: '🧠', duration: '4 weeks', url: 'https://coursera.org' },
        ]
    },

    consciousness: {
        books: [
            { id: 'con-b-1', title: 'El Poder del Ahora', author: 'Eckhart Tolle', tier: 'simple', cover: '🌟', description: 'Una guía para la iluminación espiritual', pages: 236 },
            { id: 'con-b-2', title: 'Meditaciones', author: 'Marco Aurelio', tier: 'simple', cover: '🏛️', description: 'Sabiduría estoica atemporal', pages: 256 },
            { id: 'con-b-3', title: 'El Monje que Vendió su Ferrari', author: 'Robin Sharma', tier: 'simple', cover: '🧘', description: 'Una fábula sobre seguir tus sueños', pages: 224 },
            { id: 'con-b-4', title: 'Sapiens', author: 'Yuval Noah Harari', tier: 'pro', cover: '🌍', description: 'Una breve historia de la humanidad', pages: 496 },
            { id: 'con-b-5', title: 'El Arte de la Guerra', author: 'Sun Tzu', tier: 'pro', cover: '⚔️', description: 'Estrategia y sabiduría ancestral', pages: 128 },
            { id: 'con-b-6', title: 'Siddhartha', author: 'Hermann Hesse', tier: 'hero', cover: '🕉️', description: 'Un viaje espiritual hacia la iluminación', pages: 152 },
            { id: 'con-b-7', title: 'El Libro Tibetano de la Vida y la Muerte', author: 'Sogyal Rinpoche', tier: 'hero', cover: '☯️', description: 'Guía espiritual profunda', pages: 464 },
        ],
        audiobooks: [
            { id: 'con-a-1', title: 'Mindfulness para Principiantes', author: 'Jon Kabat-Zinn', tier: 'simple', cover: '🧘', duration: '2h 30m', platform: 'Audible' },
            { id: 'con-a-2', title: 'Waking Up', author: 'Sam Harris', tier: 'pro', cover: '👁️', duration: '5h 53m', platform: 'Audible' },
            { id: 'con-a-3', title: 'The Untethered Soul', author: 'Michael Singer', tier: 'hero', cover: '🕊️', duration: '6h 11m', platform: 'Audible' },
        ],
        courses: [
            { id: 'con-c-1', title: 'Introduction to Mindfulness', platform: 'Headspace', tier: 'simple', cover: '🧠', duration: '30 days', url: 'https://headspace.com' },
            { id: 'con-c-2', title: 'Buddhism and Modern Psychology', platform: 'Coursera', tier: 'pro', cover: '📿', duration: '6 weeks', url: 'https://coursera.org' },
            { id: 'con-c-3', title: 'Waking Up App Introductory Course', platform: 'Waking Up', tier: 'hero', cover: '🌀', duration: '28 days', url: 'https://wakingup.com' },
        ]
    },

    relationships: {
        books: [
            { id: 'rel-b-1', title: 'Cómo Ganar Amigos e Influir sobre las Personas', author: 'Dale Carnegie', tier: 'simple', cover: '🤝', description: 'Clásico sobre habilidades sociales', pages: 288 },
            { id: 'rel-b-2', title: 'Los 5 Lenguajes del Amor', author: 'Gary Chapman', tier: 'simple', cover: '❤️', description: 'Cómo expresar y recibir amor', pages: 208 },
            { id: 'rel-b-3', title: 'Comunicación No Violenta', author: 'Marshall Rosenberg', tier: 'pro', cover: '🕊️', description: 'Un lenguaje de vida', pages: 264 },
            { id: 'rel-b-4', title: 'Attached', author: 'Amir Levine', tier: 'pro', cover: '🔗', description: 'La ciencia del apego adulto', pages: 304 },
            { id: 'rel-b-5', title: 'The Seven Principles for Making Marriage Work', author: 'John Gottman', tier: 'hero', cover: '💍', description: 'Basado en décadas de investigación', pages: 320 },
        ],
        audiobooks: [
            { id: 'rel-a-1', title: 'Crucial Conversations', author: 'Kerry Patterson', tier: 'pro', cover: '💬', duration: '5h 17m', platform: 'Audible' },
            { id: 'rel-a-2', title: 'Never Split the Difference', author: 'Chris Voss', tier: 'hero', cover: '🎯', duration: '8h 7m', platform: 'Audible' },
        ],
        courses: [
            { id: 'rel-c-1', title: 'The Science of Love', platform: 'edX', tier: 'simple', cover: '💝', duration: '6 weeks', url: 'https://edx.org' },
            { id: 'rel-c-2', title: 'Relationship Coach Certification', platform: 'ICF', tier: 'hero', cover: '📜', duration: '16 weeks', url: 'https://coachfederation.org' },
        ]
    },

    personal: {
        books: [
            { id: 'per-b-1', title: 'Esencialismo', author: 'Greg McKeown', tier: 'simple', cover: '⭕', description: 'Menos pero mejor', pages: 272 },
            { id: 'per-b-2', title: 'Getting Things Done', author: 'David Allen', tier: 'simple', cover: '✅', description: 'El arte de la productividad sin estrés', pages: 352 },
            { id: 'per-b-3', title: 'El Método Bullet Journal', author: 'Ryder Carroll', tier: 'pro', cover: '📓', description: 'Registra el pasado, ordena el presente, diseña el futuro', pages: 320 },
            { id: 'per-b-4', title: 'Four Thousand Weeks', author: 'Oliver Burkeman', tier: 'hero', cover: '⏰', description: 'Gestión del tiempo para mortales', pages: 288 },
        ],
        audiobooks: [
            { id: 'per-a-1', title: 'The Life-Changing Magic of Tidying Up', author: 'Marie Kondo', tier: 'simple', cover: '✨', duration: '4h 50m', platform: 'Audible' },
            { id: 'per-a-2', title: 'Digital Minimalism', author: 'Cal Newport', tier: 'pro', cover: '📱', duration: '6h 58m', platform: 'Audible' },
        ],
        courses: [
            { id: 'per-c-1', title: 'Work Smarter, Not Harder', platform: 'Skillshare', tier: 'simple', cover: '💡', duration: '2 hours', url: 'https://skillshare.com' },
            { id: 'per-c-2', title: 'Time Management Fundamentals', platform: 'LinkedIn Learning', tier: 'pro', cover: '📊', duration: '3 hours', url: 'https://linkedin.com/learning' },
        ]
    },

    work: {
        books: [
            { id: 'wrk-b-1', title: 'Lean Startup', author: 'Eric Ries', tier: 'simple', cover: '🚀', description: 'Cómo crear empresas exitosas', pages: 336 },
            { id: 'wrk-b-2', title: 'De Cero a Uno', author: 'Peter Thiel', tier: 'simple', cover: '1️⃣', description: 'Notas sobre startups', pages: 224 },
            { id: 'wrk-b-3', title: 'The Hard Thing About Hard Things', author: 'Ben Horowitz', tier: 'pro', cover: '💎', description: 'Construir un negocio cuando no hay respuestas fáciles', pages: 304 },
            { id: 'wrk-b-4', title: 'Good to Great', author: 'Jim Collins', tier: 'pro', cover: '📈', description: 'Por qué algunas empresas dan el salto', pages: 320 },
            { id: 'wrk-b-5', title: 'The Innovator\'s Dilemma', author: 'Clayton Christensen', tier: 'hero', cover: '🔮', description: 'Cuando las nuevas tecnologías hacen fracasar a las grandes empresas', pages: 288 },
        ],
        audiobooks: [
            { id: 'wrk-a-1', title: 'Rework', author: 'Jason Fried', tier: 'simple', cover: '🔧', duration: '2h 50m', platform: 'Audible' },
            { id: 'wrk-a-2', title: 'The 4-Hour Workweek', author: 'Tim Ferriss', tier: 'pro', cover: '🌴', duration: '13h 1m', platform: 'Audible' },
        ],
        courses: [
            { id: 'wrk-c-1', title: 'Entrepreneurship Specialization', platform: 'Wharton/Coursera', tier: 'pro', cover: '🎓', duration: '16 weeks', url: 'https://coursera.org' },
            { id: 'wrk-c-2', title: 'Y Combinator Startup School', platform: 'YC', tier: 'hero', cover: '🚀', duration: '10 weeks', url: 'https://startupschool.org' },
        ]
    },

    creativity: {
        books: [
            { id: 'cre-b-1', title: 'El Camino del Artista', author: 'Julia Cameron', tier: 'simple', cover: '🎨', description: 'Un curso espiritual para desbloquear tu creatividad', pages: 272 },
            { id: 'cre-b-2', title: 'Roba Como Un Artista', author: 'Austin Kleon', tier: 'simple', cover: '✂️', description: '10 cosas que nadie te dijo sobre ser creativo', pages: 160 },
            { id: 'cre-b-3', title: 'Big Magic', author: 'Elizabeth Gilbert', tier: 'simple', cover: '✨', description: 'Vida creativa más allá del miedo', pages: 304 },
            { id: 'cre-b-4', title: 'The War of Art', author: 'Steven Pressfield', tier: 'pro', cover: '⚔️', description: 'Romper los bloqueos y ganar tus batallas creativas', pages: 190 },
            { id: 'cre-b-5', title: 'Creatividad S.A.', author: 'Ed Catmull', tier: 'pro', cover: '🎬', description: 'Cómo llevar la inspiración hasta el infinito y más allá', pages: 368 },
            { id: 'cre-b-6', title: 'Flow', author: 'Mihaly Csikszentmihalyi', tier: 'hero', cover: '🌊', description: 'La psicología de la experiencia óptima', pages: 336 },
        ],
        audiobooks: [
            { id: 'cre-a-1', title: 'Creatividad', author: 'Ed Catmull', tier: 'simple', cover: '🎬', duration: '12h 52m', platform: 'Audible' },
            { id: 'cre-a-2', title: 'The War of Art', author: 'Steven Pressfield', tier: 'pro', cover: '⚔️', duration: '2h 51m', platform: 'Audible' },
            { id: 'cre-a-3', title: 'Big Magic', author: 'Elizabeth Gilbert', tier: 'pro', cover: '✨', duration: '5h 6m', platform: 'Audible' },
        ],
        courses: [
            { id: 'cre-c-1', title: 'Learning How to Learn', platform: 'Coursera', tier: 'simple', cover: '🧠', duration: '4 weeks', url: 'https://coursera.org' },
            { id: 'cre-c-2', title: 'Creative Writing Specialization', platform: 'Wesleyan/Coursera', tier: 'pro', cover: '✍️', duration: '20 weeks', url: 'https://coursera.org' },
            { id: 'cre-c-3', title: 'Design Thinking', platform: 'IDEO/Coursera', tier: 'hero', cover: '💡', duration: '5 weeks', url: 'https://coursera.org' },
        ]
    }
};

// Helper functions
export const getResourcesByArea = (area) => LEARNING_DATABASE[area] || { books: [], audiobooks: [], courses: [] };

export const getResourcesByTier = (area, tier) => {
    const resources = getResourcesByArea(area);
    const tiers = ['simple', 'pro', 'hero'];
    const tierIndex = tiers.indexOf(tier);

    // Include all resources up to and including the specified tier
    const filterByTier = (items) => items.filter(item => tiers.indexOf(item.tier) <= tierIndex);

    return {
        books: filterByTier(resources.books),
        audiobooks: filterByTier(resources.audiobooks),
        courses: filterByTier(resources.courses)
    };
};

export const getAllResources = () => {
    const all = { books: [], audiobooks: [], courses: [] };
    Object.keys(LEARNING_DATABASE).forEach(area => {
        const resources = LEARNING_DATABASE[area];
        all.books.push(...resources.books.map(r => ({ ...r, area })));
        all.audiobooks.push(...resources.audiobooks.map(r => ({ ...r, area })));
        all.courses.push(...resources.courses.map(r => ({ ...r, area })));
    });
    return all;
};

export const getResourceById = (id) => {
    const allResources = getAllResources();
    return [...allResources.books, ...allResources.audiobooks, ...allResources.courses].find(r => r.id === id);
};

export const RESOURCE_TYPES = [
    { id: 'book', label: 'Libro', icon: '📚', color: 'bg-blue-500' },
    { id: 'audiobook', label: 'Audiolibro', icon: '🎧', color: 'bg-purple-500' },
    { id: 'course', label: 'Curso', icon: '🎓', color: 'bg-emerald-500' }
];

export const RESOURCE_STATUS = [
    { id: 'unread', label: 'Por leer', icon: '📋' },
    { id: 'reading', label: 'Leyendo', icon: '📖' },
    { id: 'completed', label: 'Completado', icon: '✅' },
    { id: 'abandoned', label: 'Abandonado', icon: '❌' }
];

export const AREAS = [
    { id: 'finances', label: 'Finanzas', icon: '💰', color: 'emerald' },
    { id: 'nutrition', label: 'Nutrición', icon: '🥗', color: 'orange' },
    { id: 'workout', label: 'Deporte', icon: '💪', color: 'violet' },
    { id: 'habits', label: 'Hábitos', icon: '✅', color: 'emerald' },
    { id: 'consciousness', label: 'Consciencia', icon: '🧘', color: 'purple' },
    { id: 'relationships', label: 'Relaciones', icon: '❤️', color: 'pink' },
    { id: 'personal', label: 'Personal', icon: '📅', color: 'cyan' },
    { id: 'work', label: 'Trabajo', icon: '💼', color: 'blue' },
    { id: 'creativity', label: 'Creatividad', icon: '🎨', color: 'fuchsia' }
];

// XP rewards
export const LEARNING_XP = {
    addResource: 5,
    startReading: 10,
    updateProgress: 2,
    completeResource: 50,
    addNotes: 10,
    rateResource: 5,
    weekStreak: 100
};
