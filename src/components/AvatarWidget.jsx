import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Zap, TrendingUp, Crown, ChevronRight } from 'lucide-react';

/**
 * AvatarWidget Component - Dynamic avatar based on life areas progress
 * Shows different visual states based on user's overall progress across all areas
 */
const AvatarWidget = ({
    areaScores = {},
    totalXP = 0,
    userName = 'Usuario',
    isCompact = false,
    onClick
}) => {
    const [animating, setAnimating] = useState(false);

    // Calculate overall score (average of all areas)
    const scoreValues = Object.values(areaScores);
    const overallScore = scoreValues.length > 0
        ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
        : 50;

    // Calculate level based on XP (100 XP per level)
    const level = Math.floor(totalXP / 100) + 1;
    const xpToNextLevel = 100 - (totalXP % 100);
    const levelProgress = (totalXP % 100);

    // Determine avatar state based on overall score
    const getAvatarState = () => {
        if (overallScore >= 90) return {
            state: 'legendary',
            emoji: '👑',
            label: 'Legendario',
            color: 'from-amber-400 via-yellow-300 to-amber-500',
            glow: 'shadow-amber-500/50',
            description: '¡Eres imparable!'
        };
        if (overallScore >= 80) return {
            state: 'epic',
            emoji: '🔥',
            label: 'Épico',
            color: 'from-violet-500 via-purple-500 to-fuchsia-500',
            glow: 'shadow-violet-500/50',
            description: 'Dominando todas las áreas'
        };
        if (overallScore >= 70) return {
            state: 'excellent',
            emoji: '⚡',
            label: 'Excelente',
            color: 'from-blue-500 via-cyan-400 to-teal-400',
            glow: 'shadow-blue-500/40',
            description: 'Buen equilibrio de vida'
        };
        if (overallScore >= 60) return {
            state: 'good',
            emoji: '✨',
            label: 'Bueno',
            color: 'from-emerald-500 to-green-400',
            glow: 'shadow-emerald-500/30',
            description: 'Vas por buen camino'
        };
        if (overallScore >= 40) return {
            state: 'growing',
            emoji: '🌱',
            label: 'Creciendo',
            color: 'from-lime-500 to-green-500',
            glow: 'shadow-lime-500/20',
            description: 'Construyendo hábitos'
        };
        return {
            state: 'starting',
            emoji: '🌟',
            label: 'Iniciando',
            color: 'from-gray-400 to-gray-500',
            glow: 'shadow-gray-500/20',
            description: '¡Empieza tu viaje!'
        };
    };

    // Get dominant area (highest score)
    const getDominantArea = () => {
        const areaEmojis = {
            rest: { emoji: '🌙', label: 'Descanso', color: 'indigo' },
            nutrition: { emoji: '🍎', label: 'Nutrición', color: 'orange' },
            workout: { emoji: '🏋️', label: 'Deporte', color: 'violet' },
            consciousness: { emoji: '✨', label: 'Conciencia', color: 'purple' },
            work: { emoji: '💼', label: 'Trabajo', color: 'blue' },
            habits: { emoji: '✅', label: 'Hábitos', color: 'emerald' },
            personal: { emoji: '📋', label: 'Personal', color: 'cyan' },
            learning: { emoji: '📚', label: 'Aprender', color: 'amber' },
            finances: { emoji: '💰', label: 'Finanzas', color: 'green' },
            relationships: { emoji: '💕', label: 'Relaciones', color: 'pink' },
            creativity: { emoji: '💡', label: 'Creatividad', color: 'fuchsia' },
            experiences: { emoji: '🌟', label: 'Experiencias', color: 'yellow' }
        };

        let maxScore = 0;
        let dominantAreaId = 'habits';

        Object.entries(areaScores).forEach(([areaId, score]) => {
            if (score > maxScore) {
                maxScore = score;
                dominantAreaId = areaId;
            }
        });

        return areaEmojis[dominantAreaId] || areaEmojis.habits;
    };

    const avatarState = getAvatarState();
    const dominantArea = getDominantArea();

    // Trigger animation on level up
    useEffect(() => {
        if (levelProgress === 0 && level > 1) {
            setAnimating(true);
            setTimeout(() => setAnimating(false), 1000);
        }
    }, [level]);

    if (isCompact) {
        // Compact version for sidebar/header
        return (
            <div
                className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${avatarState.color} cursor-pointer hover:scale-105 transition-transform shadow-lg ${avatarState.glow}`}
                onClick={onClick}
            >
                <div className="relative">
                    <span className="text-3xl">{dominantArea.emoji}</span>
                    <span className="absolute -bottom-1 -right-1 text-sm">{avatarState.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{userName}</p>
                    <p className="text-[10px] text-white/80">Nivel {level} · {avatarState.label}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-white">{overallScore}%</p>
                </div>
            </div>
        );
    }

    // Full version for profile/dashboard
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${avatarState.color} p-1 shadow-xl ${avatarState.glow} ${animating ? 'animate-pulse' : ''}`}>
            <div className="bg-zinc-900/90 backdrop-blur-sm rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarState.color} flex items-center justify-center shadow-lg`}>
                                <span className="text-4xl">{dominantArea.emoji}</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center border-2 border-white/20">
                                <span className="text-sm">{avatarState.emoji}</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{userName}</p>
                            <div className="flex items-center gap-2">
                                <Crown className="w-3 h-3 text-amber-400" />
                                <span className="text-xs text-white/60">Nivel {level} · {avatarState.label}</span>
                            </div>
                            <p className="text-[10px] text-white/40 mt-0.5">{avatarState.description}</p>
                        </div>
                    </div>
                    {onClick && (
                        <button
                            onClick={onClick}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white/40" />
                        </button>
                    )}
                </div>

                {/* Level Progress */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/40">Progreso de nivel</span>
                        <span className="text-white/60">{levelProgress}/100 XP</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${avatarState.color} transition-all duration-500`}
                            style={{ width: `${levelProgress}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-white/30 mt-1">{xpToNextLevel} XP para nivel {level + 1}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                        <TrendingUp className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                        <p className="text-lg font-bold">{overallScore}%</p>
                        <p className="text-[9px] text-white/40">Score</p>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                        <Zap className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                        <p className="text-lg font-bold">{totalXP}</p>
                        <p className="text-[9px] text-white/40">XP Total</p>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                        <Star className="w-4 h-4 mx-auto text-violet-400 mb-1" />
                        <p className="text-lg font-bold">{level}</p>
                        <p className="text-[9px] text-white/40">Nivel</p>
                    </div>
                </div>

                {/* Dominant Area Highlight */}
                <div className="mt-3 p-2 bg-white/5 rounded-lg flex items-center gap-2">
                    <span className="text-xl">{dominantArea.emoji}</span>
                    <div className="flex-1">
                        <p className="text-xs font-medium">Área dominante: {dominantArea.label}</p>
                        <p className="text-[10px] text-white/40">Tu punto más fuerte esta semana</p>
                    </div>
                    <Sparkles className={`w-4 h-4 text-${dominantArea.color}-400`} />
                </div>
            </div>
        </div>
    );
};

export default AvatarWidget;
