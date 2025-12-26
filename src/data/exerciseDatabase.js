// ============================================================================
// EXERCISE DATABASE - COMPLETE LIBRARY
// ============================================================================

export const EXERCISE_DATABASE = {
    chest: {
        name: 'Pecho',
        emoji: '🫁',
        exercises: [
            { id: 'bench_press', name: 'Press Banca', equipment: 'barbell', instructions: 'Acostado en banco, baja la barra al pecho y empuja hacia arriba' },
            { id: 'incline_bench', name: 'Press Inclinado', equipment: 'barbell', instructions: 'Banco a 30-45°, baja al pecho superior y empuja' },
            { id: 'decline_bench', name: 'Press Declinado', equipment: 'barbell', instructions: 'Banco declinado, baja al pecho inferior y empuja' },
            { id: 'db_bench', name: 'Press Mancuernas', equipment: 'dumbbell', instructions: 'Mancuernas a los lados, baja y empuja verticalmente' },
            { id: 'db_incline', name: 'Press Inclinado Mancuernas', equipment: 'dumbbell', instructions: 'Banco inclinado, press con mancuernas' },
            { id: 'db_fly', name: 'Aperturas Mancuernas', equipment: 'dumbbell', instructions: 'Brazos abiertos, junta las mancuernas arriba' },
            { id: 'cable_fly', name: 'Cruces en Polea', equipment: 'cable', instructions: 'Poleas altas, cruza los cables frente al pecho' },
            { id: 'pec_deck', name: 'Pec Deck', equipment: 'machine', instructions: 'Junta los codos frente al pecho en la máquina' },
            { id: 'push_ups', name: 'Flexiones', equipment: 'bodyweight', instructions: 'Manos al ancho de hombros, baja el pecho al suelo' },
            { id: 'dips_chest', name: 'Fondos (Pecho)', equipment: 'bodyweight', instructions: 'Inclinado hacia adelante, baja y empuja' },
        ]
    },
    back: {
        name: 'Espalda',
        emoji: '🔙',
        exercises: [
            { id: 'deadlift', name: 'Peso Muerto', equipment: 'barbell', instructions: 'Barra pegada, espalda recta, levanta con piernas y espalda' },
            { id: 'barbell_row', name: 'Remo con Barra', equipment: 'barbell', instructions: 'Inclinado 45°, tira la barra hacia el abdomen' },
            { id: 'pull_ups', name: 'Dominadas', equipment: 'bodyweight', instructions: 'Agarre prono, tira hasta que la barbilla pase la barra' },
            { id: 'chin_ups', name: 'Dominadas Supinas', equipment: 'bodyweight', instructions: 'Agarre supino, tira hacia arriba' },
            { id: 'lat_pulldown', name: 'Jalón al Pecho', equipment: 'cable', instructions: 'Tira la barra hacia el pecho, codos hacia abajo' },
            { id: 'seated_row', name: 'Remo Sentado', equipment: 'cable', instructions: 'Tira hacia el abdomen, aprieta escápulas' },
            { id: 'db_row', name: 'Remo Mancuerna', equipment: 'dumbbell', instructions: 'Rodilla en banco, tira la mancuerna al costado' },
            { id: 't_bar_row', name: 'Remo en T', equipment: 'barbell', instructions: 'Agarra la barra en V, tira hacia el pecho' },
            { id: 'face_pull', name: 'Face Pull', equipment: 'cable', instructions: 'Tira hacia la cara, codos altos' },
            { id: 'hyperextension', name: 'Hiperextensiones', equipment: 'bodyweight', instructions: 'Sube el torso desde posición inclinada' },
        ]
    },
    shoulders: {
        name: 'Hombros',
        emoji: '🎯',
        exercises: [
            { id: 'ohp', name: 'Press Militar', equipment: 'barbell', instructions: 'De pie, empuja la barra sobre la cabeza' },
            { id: 'db_shoulder_press', name: 'Press Hombro Mancuernas', equipment: 'dumbbell', instructions: 'Sentado o de pie, empuja mancuernas arriba' },
            { id: 'arnold_press', name: 'Press Arnold', equipment: 'dumbbell', instructions: 'Rota las mancuernas mientras empujas arriba' },
            { id: 'lateral_raise', name: 'Elevaciones Laterales', equipment: 'dumbbell', instructions: 'Brazos a los lados, sube hasta horizontal' },
            { id: 'front_raise', name: 'Elevaciones Frontales', equipment: 'dumbbell', instructions: 'Brazos al frente, sube hasta horizontal' },
            { id: 'rear_delt_fly', name: 'Pájaros', equipment: 'dumbbell', instructions: 'Inclinado, abre los brazos hacia atrás' },
            { id: 'upright_row', name: 'Remo al Mentón', equipment: 'barbell', instructions: 'Tira la barra hacia la barbilla, codos altos' },
            { id: 'shrugs', name: 'Encogimientos', equipment: 'dumbbell', instructions: 'Sube los hombros hacia las orejas' },
            { id: 'cable_lateral', name: 'Lateral en Polea', equipment: 'cable', instructions: 'Polea baja, eleva lateral con cable' },
        ]
    },
    legs: {
        name: 'Piernas',
        emoji: '🦵',
        exercises: [
            { id: 'squat', name: 'Sentadilla', equipment: 'barbell', instructions: 'Barra en espalda, baja hasta paralelo y sube' },
            { id: 'front_squat', name: 'Sentadilla Frontal', equipment: 'barbell', instructions: 'Barra en deltoides, baja recto y sube' },
            { id: 'leg_press', name: 'Prensa', equipment: 'machine', instructions: 'Empuja la plataforma con las piernas' },
            { id: 'hack_squat', name: 'Hack Squat', equipment: 'machine', instructions: 'Espalda en respaldo, baja y sube' },
            { id: 'rdl', name: 'Peso Muerto Rumano', equipment: 'barbell', instructions: 'Piernas semi-rectas, baja la barra por las piernas' },
            { id: 'leg_curl', name: 'Curl Femoral', equipment: 'machine', instructions: 'Acostado, flexiona las piernas' },
            { id: 'leg_extension', name: 'Extensión Cuádriceps', equipment: 'machine', instructions: 'Sentado, extiende las piernas' },
            { id: 'lunges', name: 'Zancadas', equipment: 'dumbbell', instructions: 'Da un paso y baja la rodilla trasera' },
            { id: 'bulgarian_split', name: 'Sentadilla Búlgara', equipment: 'dumbbell', instructions: 'Pie trasero elevado, baja y sube' },
            { id: 'calf_raise', name: 'Elevación de Gemelos', equipment: 'machine', instructions: 'Sube en punta de pies' },
            { id: 'hip_thrust', name: 'Hip Thrust', equipment: 'barbell', instructions: 'Espalda en banco, empuja cadera arriba' },
        ]
    },
    arms: {
        name: 'Brazos',
        emoji: '💪',
        exercises: [
            { id: 'barbell_curl', name: 'Curl con Barra', equipment: 'barbell', instructions: 'Flexiona los codos, sube la barra' },
            { id: 'db_curl', name: 'Curl Mancuernas', equipment: 'dumbbell', instructions: 'Alterna o simultáneo, sube las mancuernas' },
            { id: 'hammer_curl', name: 'Curl Martillo', equipment: 'dumbbell', instructions: 'Agarre neutro, flexiona los codos' },
            { id: 'preacher_curl', name: 'Curl Predicador', equipment: 'barbell', instructions: 'Codos en banco Scott, curl' },
            { id: 'cable_curl', name: 'Curl en Polea', equipment: 'cable', instructions: 'Polea baja, curl con cable' },
            { id: 'tricep_pushdown', name: 'Extensión Tríceps Polea', equipment: 'cable', instructions: 'Polea alta, extiende los codos' },
            { id: 'skull_crusher', name: 'Rompecráneos', equipment: 'barbell', instructions: 'Acostado, baja la barra a la frente' },
            { id: 'overhead_tricep', name: 'Extensión Tríceps Overhead', equipment: 'dumbbell', instructions: 'Mancuerna sobre la cabeza, extiende' },
            { id: 'dips_tricep', name: 'Fondos (Tríceps)', equipment: 'bodyweight', instructions: 'Cuerpo recto, baja y empuja' },
            { id: 'close_grip_bench', name: 'Press Agarre Cerrado', equipment: 'barbell', instructions: 'Manos juntas en banca, press' },
        ]
    },
    core: {
        name: 'Core',
        emoji: '🎯',
        exercises: [
            { id: 'plank', name: 'Plancha', equipment: 'bodyweight', type: 'duration', instructions: 'Mantén posición recta sobre antebrazos' },
            { id: 'crunches', name: 'Abdominales', equipment: 'bodyweight', instructions: 'Sube el torso hacia las rodillas' },
            { id: 'leg_raise', name: 'Elevación de Piernas', equipment: 'bodyweight', instructions: 'Colgado o acostado, sube las piernas' },
            { id: 'russian_twist', name: 'Giros Rusos', equipment: 'bodyweight', instructions: 'Sentado, rota el torso lado a lado' },
            { id: 'cable_crunch', name: 'Crunch en Polea', equipment: 'cable', instructions: 'Arrodillado, flexiona el torso hacia abajo' },
            { id: 'ab_wheel', name: 'Rueda Abdominal', equipment: 'other', instructions: 'Rueda hacia adelante y vuelve' },
            { id: 'dead_bug', name: 'Dead Bug', equipment: 'bodyweight', instructions: 'Alterna brazo y pierna opuesta' },
            { id: 'mountain_climber', name: 'Mountain Climbers', equipment: 'bodyweight', instructions: 'En plancha, alterna rodillas al pecho' },
        ]
    }
};

export const EQUIPMENT_TYPES = {
    barbell: { name: 'Barra', icon: '🏋️' },
    dumbbell: { name: 'Mancuernas', icon: '🔩' },
    cable: { name: 'Polea', icon: '🔗' },
    machine: { name: 'Máquina', icon: '⚙️' },
    bodyweight: { name: 'Peso Corporal', icon: '🧘' },
    other: { name: 'Otro', icon: '📦' }
};

export const SET_TYPES = {
    normal: { name: 'Normal', color: 'bg-white/10' },
    warmup: { name: 'Warmup', color: 'bg-yellow-500/20', textColor: 'text-yellow-400' },
    failure: { name: 'Fallo', color: 'bg-red-500/20', textColor: 'text-red-400' },
    drop: { name: 'Drop Set', color: 'bg-purple-500/20', textColor: 'text-purple-400' }
};

// Helper functions
export const getExerciseById = (id) => {
    for (const category of Object.values(EXERCISE_DATABASE)) {
        const exercise = category.exercises.find(e => e.id === id);
        if (exercise) return { ...exercise, category: category.name, categoryEmoji: category.emoji };
    }
    return null;
};

export const getExercisesByMuscle = (muscle) => {
    return EXERCISE_DATABASE[muscle]?.exercises || [];
};

export const getAllExercises = () => {
    const results = [];
    for (const [key, category] of Object.entries(EXERCISE_DATABASE)) {
        for (const exercise of category.exercises) {
            results.push({ ...exercise, muscle: key, muscleName: category.name, muscleEmoji: category.emoji });
        }
    }
    return results;
};
