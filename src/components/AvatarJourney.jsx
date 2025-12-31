import React from 'react';
import { Star, Lock, Check } from 'lucide-react';

/**
 * AvatarJourney Component - Shows level progression as a visual path
 * Displays all 5 levels with dotted/solid lines based on progress
 */

// Avatar level data for each area (imported from AreaAvatars)
const areaLevels = {
    rest: [
        { emoji: '😴', title: 'Dormilón', description: 'Primeros pasos en el descanso' },
        { emoji: '🌙', title: 'Soñador', description: 'Estableciendo rutina de sueño' },
        { emoji: '🌟', title: 'Nocturno', description: 'Sueño consistente' },
        { emoji: '✨', title: 'Restaurador', description: 'Descanso óptimo' },
        { emoji: '🌌', title: 'Maestro del Sueño', description: 'Dominio total del descanso' },
    ],
    nutrition: [
        { emoji: '🥗', title: 'Aprendiz', description: 'Aprendiendo a comer bien' },
        { emoji: '🍎', title: 'Fresco', description: 'Comiendo más sano' },
        { emoji: '🥑', title: 'Natural', description: 'Dieta equilibrada' },
        { emoji: '🌿', title: 'Vital', description: 'Nutrición optimizada' },
        { emoji: '🌱', title: 'Maestro Chef', description: 'Experto en nutrición' },
    ],
    workout: [
        { emoji: '🚶', title: 'Principiante', description: 'Empezando a moverse' },
        { emoji: '🏃', title: 'Activo', description: 'Ejercicio regular' },
        { emoji: '💪', title: 'Atleta', description: 'Fuerza creciente' },
        { emoji: '🏋️', title: 'Guerrero', description: 'Entrenamiento intenso' },
        { emoji: '⚡', title: 'Titán', description: 'Rendimiento élite' },
    ],
    consciousness: [
        { emoji: '🌀', title: 'Buscador', description: 'Iniciando el viaje interior' },
        { emoji: '🧘', title: 'Meditador', description: 'Práctica regular' },
        { emoji: '☯️', title: 'Equilibrado', description: 'Paz mental' },
        { emoji: '🔮', title: 'Visionario', description: 'Claridad profunda' },
        { emoji: '✨', title: 'Iluminado', description: 'Conciencia plena' },
    ],
    work: [
        { emoji: '📝', title: 'Novato', description: 'Organizando tareas' },
        { emoji: '💼', title: 'Profesional', description: 'Productividad estable' },
        { emoji: '🎯', title: 'Enfocado', description: 'Trabajo profundo' },
        { emoji: '🚀', title: 'Productivo', description: 'Alto rendimiento' },
        { emoji: '👑', title: 'CEO', description: 'Liderazgo total' },
    ],
    habits: [
        { emoji: '📋', title: 'Iniciando', description: 'Primeros hábitos' },
        { emoji: '✅', title: 'Constante', description: 'Manteniendo rutinas' },
        { emoji: '🔄', title: 'Automático', description: 'Hábitos arraigados' },
        { emoji: '⭐', title: 'Disciplinado', description: 'Consistencia total' },
        { emoji: '🏆', title: 'Leyenda', description: 'Maestro de hábitos' },
    ],
    personal: [
        { emoji: '📝', title: 'Desordenado', description: 'Empezando a organizar' },
        { emoji: '📋', title: 'Organizado', description: 'Sistema básico' },
        { emoji: '📁', title: 'Sistemático', description: 'Todo en su lugar' },
        { emoji: '🗂️', title: 'Eficiente', description: 'Gestión óptima' },
        { emoji: '💎', title: 'Maestro', description: 'Control total' },
    ],
    learning: [
        { emoji: '📖', title: 'Curioso', description: 'Mente abierta' },
        { emoji: '📚', title: 'Estudiante', description: 'Aprendizaje activo' },
        { emoji: '🎓', title: 'Académico', description: 'Conocimiento profundo' },
        { emoji: '🧠', title: 'Erudito', description: 'Sabiduría amplia' },
        { emoji: '🦉', title: 'Sabio', description: 'Maestro del conocimiento' },
    ],
    finances: [
        { emoji: '💵', title: 'Gastador', description: 'Aprendiendo a ahorrar' },
        { emoji: '💰', title: 'Ahorrador', description: 'Guardando dinero' },
        { emoji: '📈', title: 'Inversor', description: 'Haciendo crecer capital' },
        { emoji: '💎', title: 'Próspero', description: 'Libertad financiera' },
        { emoji: '👑', title: 'Magnate', description: 'Riqueza establecida' },
    ],
    relationships: [
        { emoji: '👋', title: 'Solitario', description: 'Abriendo puertas' },
        { emoji: '💕', title: 'Amigable', description: 'Conexiones iniciales' },
        { emoji: '🤝', title: 'Conectado', description: 'Relaciones sólidas' },
        { emoji: '💖', title: 'Querido', description: 'Vínculos profundos' },
        { emoji: '💝', title: 'Alma Social', description: 'Red de amor' },
    ],
    creativity: [
        { emoji: '✏️', title: 'Bocetador', description: 'Primeras ideas' },
        { emoji: '💡', title: 'Creativo', description: 'Flujo de ideas' },
        { emoji: '🎨', title: 'Artista', description: 'Expresión libre' },
        { emoji: '🌈', title: 'Innovador', description: 'Originalidad' },
        { emoji: '⚡', title: 'Genio', description: 'Creatividad ilimitada' },
    ],
    experiences: [
        { emoji: '🚶', title: 'Observador', description: 'Mirando el mundo' },
        { emoji: '🌟', title: 'Explorador', description: 'Primeras aventuras' },
        { emoji: '🗺️', title: 'Aventurero', description: 'Buscando experiencias' },
        { emoji: '🌍', title: 'Viajero', description: 'Conociendo el mundo' },
        { emoji: '🚀', title: 'Legendario', description: 'Vida extraordinaria' },
    ],
};

// Pillar colors for the journey path
const pillarColors = {
    origen: {
        solid: 'bg-gradient-to-r from-orange-500 to-red-500',
        dot: 'bg-orange-500',
        text: 'text-orange-400',
        border: 'border-orange-500'
    },
    camino: {
        solid: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        dot: 'bg-blue-500',
        text: 'text-blue-400',
        border: 'border-blue-500'
    },
    destino: {
        solid: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        dot: 'bg-emerald-500',
        text: 'text-emerald-400',
        border: 'border-emerald-500'
    }
};

const areaPillars = {
    rest: 'origen', nutrition: 'origen', workout: 'origen', consciousness: 'origen',
    work: 'camino', habits: 'camino', personal: 'camino', learning: 'camino',
    finances: 'destino', relationships: 'destino', creativity: 'destino', experiences: 'destino'
};

const AvatarJourney = ({ areaId, score = 0, compact = false }) => {
    const levels = areaLevels[areaId] || areaLevels.habits;
    const pillar = areaPillars[areaId] || 'camino';
    const colors = pillarColors[pillar];

    // Calculate current level (0-4) based on score
    const currentLevel = Math.min(4, Math.floor(score / 20));
    const progressInLevel = (score % 20) / 20 * 100;

    if (compact) {
        // Compact horizontal version - full width with level names
        return (
            <div className="bg-white/5 rounded-xl p-3 w-full">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{levels[currentLevel].emoji}</span>
                        <div>
                            <p className={`text-sm font-medium ${colors.text}`}>{levels[currentLevel].title}</p>
                            <p className="text-[10px] text-white/40">{levels[currentLevel].description}</p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium ${colors.text} bg-white/10 px-2 py-1 rounded-lg`}>
                        Nivel {currentLevel + 1}/5
                    </span>
                </div>

                {/* Progress path - full width */}
                <div className="flex items-start w-full">
                    {levels.map((level, i) => {
                        const isCompleted = i < currentLevel;
                        const isCurrent = i === currentLevel;
                        const isFuture = i > currentLevel;

                        return (
                            <React.Fragment key={i}>
                                {/* Level Column */}
                                <div className="flex flex-col items-center flex-1 min-w-0">
                                    {/* Level Node */}
                                    <div className={`
                      relative w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-base md:text-lg
                      transition-all duration-300
                      ${isCompleted ? `${colors.solid} shadow-lg` : ''}
                      ${isCurrent ? `${colors.solid} shadow-lg ring-2 ring-white/50 scale-110` : ''}
                      ${isFuture ? 'bg-white/10 opacity-50' : ''}
                    `}>
                                        {level.emoji}
                                        {isCompleted && (
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <Check className="w-2 h-2 text-white" />
                                            </div>
                                        )}
                                        {isFuture && (
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white/20 rounded-full flex items-center justify-center">
                                                <Lock className="w-2 h-2 text-white/50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Level Name below node */}
                                    <p className={`text-[9px] md:text-[10px] mt-1.5 text-center truncate w-full px-0.5
                      ${isCurrent ? colors.text + ' font-medium' : ''}
                      ${isCompleted ? 'text-white/60' : ''}
                      ${isFuture ? 'text-white/30' : ''}
                    `}>
                                        {level.title}
                                    </p>
                                </div>

                                {/* Connector Line */}
                                {i < levels.length - 1 && (
                                    <div className="flex items-center h-8 md:h-10 px-0.5">
                                        <div className="w-2 md:w-4 h-1 rounded-full overflow-hidden bg-white/10">
                                            {i < currentLevel && (
                                                <div className={`h-full w-full ${colors.solid}`} />
                                            )}
                                            {i === currentLevel && (
                                                <div
                                                    className={`h-full ${colors.solid}`}
                                                    style={{ width: `${progressInLevel}%` }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Requirements hint */}
                <p className="text-[10px] text-white/30 text-center mt-2">
                    {currentLevel < 4 ? `Siguiente: ${levels[currentLevel + 1].title} (${(currentLevel + 1) * 20}+ puntos)` : '¡Nivel máximo alcanzado!'}
                </p>
            </div>
        );
    }


    // Full vertical journey view
    return (
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <Star className={`w-4 h-4 ${colors.text}`} />
                    Tu Viaje
                </h3>
                <span className={`text-sm ${colors.text}`}>{score}% completado</span>
            </div>

            <div className="relative">
                {/* Background path line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/10" />

                {/* Completed path overlay */}
                <div
                    className={`absolute left-6 top-6 w-0.5 ${colors.solid}`}
                    style={{
                        height: `${Math.min(100, (currentLevel / 4) * 100 + (progressInLevel / 4))}%`
                    }}
                />

                <div className="space-y-4">
                    {levels.map((level, i) => {
                        const isCompleted = i < currentLevel;
                        const isCurrent = i === currentLevel;
                        const isFuture = i > currentLevel;

                        return (
                            <div
                                key={i}
                                className={`
                  relative flex items-center gap-4 p-3 rounded-xl transition-all
                  ${isCurrent ? 'bg-white/10 scale-[1.02]' : ''}
                  ${isFuture ? 'opacity-50' : ''}
                `}
                            >
                                {/* Level Circle */}
                                <div className={`
                  relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  ${isCompleted ? `${colors.solid} shadow-lg` : ''}
                  ${isCurrent ? `${colors.solid} shadow-lg ring-2 ring-white/50` : ''}
                  ${isFuture ? 'bg-white/10' : ''}
                `}>
                                    {level.emoji}
                                </div>

                                {/* Level Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-medium ${isFuture ? 'text-white/40' : ''}`}>
                                            {level.title}
                                        </p>
                                        {isCompleted && (
                                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                                                ✓ Completado
                                            </span>
                                        )}
                                        {isCurrent && (
                                            <span className={`text-[10px] px-2 py-0.5 ${colors.text} bg-white/10 rounded-full`}>
                                                Actual
                                            </span>
                                        )}
                                        {isFuture && (
                                            <Lock className="w-3 h-3 text-white/30" />
                                        )}
                                    </div>
                                    <p className="text-xs text-white/40">{level.description}</p>

                                    {/* Progress bar for current level */}
                                    {isCurrent && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-[10px] text-white/40 mb-1">
                                                <span>Progreso</span>
                                                <span>{Math.round(progressInLevel)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${colors.solid} transition-all duration-500`}
                                                    style={{ width: `${progressInLevel}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Level Number */}
                                <div className={`text-xs ${isFuture ? 'text-white/20' : colors.text}`}>
                                    Lv.{i + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export { areaLevels, pillarColors, areaPillars };
export default AvatarJourney;
