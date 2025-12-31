import React from 'react';
import { TrendingUp, Star, Crown, Zap } from 'lucide-react';

/**
 * AreaAvatar Component - Unique character for each life area
 * Each area has its own avatar that levels up independently
 */

// Define unique avatar characters for each area
const areaAvatars = {
    rest: {
        emoji: '🌙',
        name: 'Luna',
        description: 'Guardián del descanso',
        levels: [
            { min: 0, char: '😴', title: 'Dormilón' },
            { min: 20, char: '🌙', title: 'Soñador' },
            { min: 40, char: '🌟', title: 'Nocturno' },
            { min: 60, char: '✨', title: 'Restaurador' },
            { min: 80, char: '🌌', title: 'Maestro del Sueño' },
        ],
        color: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-500/20'
    },
    nutrition: {
        emoji: '🍎',
        name: 'Vita',
        description: 'Espíritu de la nutrición',
        levels: [
            { min: 0, char: '🥗', title: 'Aprendiz' },
            { min: 20, char: '🍎', title: 'Fresco' },
            { min: 40, char: '🥑', title: 'Natural' },
            { min: 60, char: '🌿', title: 'Vital' },
            { min: 80, char: '🌱', title: 'Maestro Chef' },
        ],
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-500/20'
    },
    workout: {
        emoji: '💪',
        name: 'Titan',
        description: 'Guerrero del fitness',
        levels: [
            { min: 0, char: '🚶', title: 'Principiante' },
            { min: 20, char: '🏃', title: 'Activo' },
            { min: 40, char: '💪', title: 'Atleta' },
            { min: 60, char: '🏋️', title: 'Guerrero' },
            { min: 80, char: '⚡', title: 'Titán' },
        ],
        color: 'from-violet-500 to-fuchsia-600',
        bgColor: 'bg-violet-500/20'
    },
    consciousness: {
        emoji: '🧘',
        name: 'Zen',
        description: 'Guía de la conciencia',
        levels: [
            { min: 0, char: '🌀', title: 'Buscador' },
            { min: 20, char: '🧘', title: 'Meditador' },
            { min: 40, char: '☯️', title: 'Equilibrado' },
            { min: 60, char: '🔮', title: 'Visionario' },
            { min: 80, char: '✨', title: 'Iluminado' },
        ],
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/20'
    },
    work: {
        emoji: '💼',
        name: 'Pro',
        description: 'Maestro del trabajo',
        levels: [
            { min: 0, char: '📝', title: 'Novato' },
            { min: 20, char: '💼', title: 'Profesional' },
            { min: 40, char: '🎯', title: 'Enfocado' },
            { min: 60, char: '🚀', title: 'Productivo' },
            { min: 80, char: '👑', title: 'CEO' },
        ],
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/20'
    },
    habits: {
        emoji: '✅',
        name: 'Habit',
        description: 'Constructor de hábitos',
        levels: [
            { min: 0, char: '📋', title: 'Iniciando' },
            { min: 20, char: '✅', title: 'Constante' },
            { min: 40, char: '🔄', title: 'Automático' },
            { min: 60, char: '⭐', title: 'Disciplinado' },
            { min: 80, char: '🏆', title: 'Leyenda' },
        ],
        color: 'from-emerald-500 to-green-600',
        bgColor: 'bg-emerald-500/20'
    },
    personal: {
        emoji: '📋',
        name: 'Org',
        description: 'Organizador personal',
        levels: [
            { min: 0, char: '📝', title: 'Desordenado' },
            { min: 20, char: '📋', title: 'Organizado' },
            { min: 40, char: '📁', title: 'Sistemático' },
            { min: 60, char: '🗂️', title: 'Eficiente' },
            { min: 80, char: '💎', title: 'Maestro' },
        ],
        color: 'from-cyan-500 to-teal-500',
        bgColor: 'bg-cyan-500/20'
    },
    learning: {
        emoji: '📚',
        name: 'Sage',
        description: 'Sabio del conocimiento',
        levels: [
            { min: 0, char: '📖', title: 'Curioso' },
            { min: 20, char: '📚', title: 'Estudiante' },
            { min: 40, char: '🎓', title: 'Académico' },
            { min: 60, char: '🧠', title: 'Erudito' },
            { min: 80, char: '🦉', title: 'Sabio' },
        ],
        color: 'from-amber-500 to-yellow-500',
        bgColor: 'bg-amber-500/20'
    },
    finances: {
        emoji: '💰',
        name: 'Cash',
        description: 'Guardián financiero',
        levels: [
            { min: 0, char: '💵', title: 'Gastador' },
            { min: 20, char: '💰', title: 'Ahorrador' },
            { min: 40, char: '📈', title: 'Inversor' },
            { min: 60, char: '💎', title: 'Próspero' },
            { min: 80, char: '👑', title: 'Magnate' },
        ],
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500/20'
    },
    relationships: {
        emoji: '💕',
        name: 'Heart',
        description: 'Conector de almas',
        levels: [
            { min: 0, char: '👋', title: 'Solitario' },
            { min: 20, char: '💕', title: 'Amigable' },
            { min: 40, char: '🤝', title: 'Conectado' },
            { min: 60, char: '💖', title: 'Querido' },
            { min: 80, char: '💝', title: 'Alma Social' },
        ],
        color: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-500/20'
    },
    creativity: {
        emoji: '💡',
        name: 'Spark',
        description: 'Chispa creativa',
        levels: [
            { min: 0, char: '✏️', title: 'Bocetador' },
            { min: 20, char: '💡', title: 'Creativo' },
            { min: 40, char: '🎨', title: 'Artista' },
            { min: 60, char: '🌈', title: 'Innovador' },
            { min: 80, char: '⚡', title: 'Genio' },
        ],
        color: 'from-fuchsia-500 to-purple-600',
        bgColor: 'bg-fuchsia-500/20'
    },
    experiences: {
        emoji: '🌟',
        name: 'Quest',
        description: 'Explorador de vida',
        levels: [
            { min: 0, char: '🚶', title: 'Observador' },
            { min: 20, char: '🌟', title: 'Explorador' },
            { min: 40, char: '🗺️', title: 'Aventurero' },
            { min: 60, char: '🌍', title: 'Viajero' },
            { min: 80, char: '🚀', title: 'Legendario' },
        ],
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-500/20'
    }
};

// Get avatar level data for a specific area
const getAvatarLevel = (areaId, score) => {
    const avatar = areaAvatars[areaId] || areaAvatars.habits;
    const levels = avatar.levels;

    // Find the highest level achieved
    let currentLevel = levels[0];
    for (let i = levels.length - 1; i >= 0; i--) {
        if (score >= levels[i].min) {
            currentLevel = levels[i];
            break;
        }
    }

    return {
        ...avatar,
        currentLevel,
        score,
        levelIndex: levels.indexOf(currentLevel),
        maxLevel: levels.length - 1
    };
};

// Single Area Avatar - compact version for sidebar/lists
export const AreaAvatarCompact = ({ areaId, score = 0, onClick }) => {
    const data = getAvatarLevel(areaId, score);

    return (
        <div
            className={`flex items-center gap-2 p-2 rounded-xl ${data.bgColor} cursor-pointer hover:scale-105 transition-transform`}
            onClick={onClick}
        >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${data.color} flex items-center justify-center text-xl shadow-lg`}>
                {data.currentLevel.char}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{data.name}</p>
                <p className="text-[10px] text-white/50 truncate">{data.currentLevel.title}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold">{score}%</p>
            </div>
        </div>
    );
};

// Full Area Avatar Card
export const AreaAvatarCard = ({ areaId, score = 0, xp = 0, onClick }) => {
    const data = getAvatarLevel(areaId, score);
    const levelProgress = ((score - data.currentLevel.min) / 20) * 100; // 20 points per level

    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${data.color} p-[2px] cursor-pointer hover:scale-[1.02] transition-transform shadow-xl`}
            onClick={onClick}
        >
            <div className="bg-zinc-900/95 backdrop-blur-sm rounded-[14px] p-4">
                {/* Avatar Header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center text-3xl shadow-lg`}>
                        {data.currentLevel.char}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-lg">{data.name}</p>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400" />
                            <span className="text-xs text-white/60">Nivel {data.levelIndex + 1}</span>
                        </div>
                        <p className="text-[10px] text-white/40">{data.description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{score}%</p>
                        <p className="text-[10px] text-white/40">Score</p>
                    </div>
                </div>

                {/* Level Title */}
                <div className={`text-center py-2 px-3 rounded-xl ${data.bgColor} mb-3`}>
                    <p className="font-medium">{data.currentLevel.title}</p>
                </div>

                {/* Progress to Next Level */}
                <div>
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                        <span>Progreso al siguiente nivel</span>
                        <span>{Math.min(100, Math.round(levelProgress))}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${data.color} transition-all duration-500`}
                            style={{ width: `${Math.min(100, levelProgress)}%` }}
                        />
                    </div>
                </div>

                {/* Level Badges */}
                <div className="flex justify-center gap-2 mt-3">
                    {data.levels.map((level, i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all
                ${i <= data.levelIndex ? `bg-gradient-to-br ${data.color}` : 'bg-white/10 opacity-50'}`}
                        >
                            {level.char}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// All Avatars Grid - shows all 12 area avatars in a grid
export const AllAreasAvatarGrid = ({ areaScores = {}, onAreaClick }) => {
    const areaOrder = [
        // Origen
        'rest', 'nutrition', 'workout', 'consciousness',
        // Camino
        'work', 'habits', 'personal', 'learning',
        // Destino
        'finances', 'relationships', 'creativity', 'experiences'
    ];

    return (
        <div className="space-y-4">
            {/* Origen */}
            <div>
                <p className="text-xs text-orange-400 font-medium mb-2 flex items-center gap-1">
                    🔥 ORIGEN
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {areaOrder.slice(0, 4).map(areaId => (
                        <AreaAvatarCompact
                            key={areaId}
                            areaId={areaId}
                            score={areaScores[areaId] || 0}
                            onClick={() => onAreaClick?.(areaId)}
                        />
                    ))}
                </div>
            </div>

            {/* Camino */}
            <div>
                <p className="text-xs text-amber-400 font-medium mb-2 flex items-center gap-1">
                    🔥 CAMINO
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {areaOrder.slice(4, 8).map(areaId => (
                        <AreaAvatarCompact
                            key={areaId}
                            areaId={areaId}
                            score={areaScores[areaId] || 0}
                            onClick={() => onAreaClick?.(areaId)}
                        />
                    ))}
                </div>
            </div>

            {/* Destino */}
            <div>
                <p className="text-xs text-yellow-400 font-medium mb-2 flex items-center gap-1">
                    ✨ DESTINO
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {areaOrder.slice(8, 12).map(areaId => (
                        <AreaAvatarCompact
                            key={areaId}
                            areaId={areaId}
                            score={areaScores[areaId] || 0}
                            onClick={() => onAreaClick?.(areaId)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Export the avatar data for use in other components
export { areaAvatars, getAvatarLevel };

export default AreaAvatarCompact;
