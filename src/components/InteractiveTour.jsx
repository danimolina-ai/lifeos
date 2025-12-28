import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

// Tour steps configuration
const TOUR_STEPS = [
    {
        id: 'welcome',
        target: null, // No target, centered modal
        title: '¡Bienvenido a Life OS! 🚀',
        description: 'Te vamos a guiar por las funciones principales de la app. Este tour dura menos de 1 minuto.',
        position: 'center'
    },
    {
        id: 'dayscore',
        target: '[data-tour="dayscore"]',
        title: 'Tu DayScore',
        description: 'Esta es tu puntuación diaria. Se calcula automáticamente basándose en tus hábitos completados, sueño, nutrición y más. ¡Tu meta es llegar al 100%!',
        position: 'bottom'
    },
    {
        id: 'habits',
        target: '[data-tour="habits"]',
        title: 'Tus Hábitos',
        description: 'Aquí ves tus hábitos del día. Toca cada uno para marcarlo como completado. Los hábitos consistentes son la clave del éxito.',
        position: 'top'
    },
    {
        id: 'navigation',
        target: '[data-tour="navigation"]',
        title: 'Navegación Principal',
        description: 'Usa estos botones para moverte entre vistas: Acción, Calendario, Áreas, Control y Estadísticas.',
        position: 'top'
    },
    {
        id: 'hub',
        target: '[data-tour="hub"]',
        title: 'Hub Central',
        description: 'El botón central abre el menú de áreas. Desde aquí puedes acceder rápidamente a Nutrición, Workout, Finanzas, y todas las demás áreas.',
        position: 'top'
    },
    {
        id: 'complete',
        target: null,
        title: '¡Listo para comenzar! 💪',
        description: 'Ya conoces lo básico. Explora cada área, registra tus datos diarios, y observa cómo Life OS te ayuda a optimizar tu vida. ¡Puedes volver a ver este tour desde tu perfil!',
        position: 'center'
    }
];

export default function InteractiveTour({ onComplete, onSkip }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const tooltipRef = useRef(null);

    const step = TOUR_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === TOUR_STEPS.length - 1;
    const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

    // Find and measure target element
    useEffect(() => {
        if (!step.target) {
            setTargetRect(null);
            return;
        }

        const findTarget = () => {
            const element = document.querySelector(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    bottom: rect.bottom,
                    right: rect.right
                });
            } else {
                setTargetRect(null);
            }
        };

        findTarget();
        // Re-measure on scroll/resize
        window.addEventListener('scroll', findTarget, true);
        window.addEventListener('resize', findTarget);

        return () => {
            window.removeEventListener('scroll', findTarget, true);
            window.removeEventListener('resize', findTarget);
        };
    }, [step.target, currentStep]);

    const handleNext = () => {
        if (isLastStep) {
            onComplete?.();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        onSkip?.();
    };

    // Calculate tooltip position
    const getTooltipStyle = () => {
        if (step.position === 'center' || !targetRect) {
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '360px'
            };
        }

        const padding = 16;
        const tooltipHeight = 200; // Approximate
        const tooltipWidth = 320;

        let top, left;

        switch (step.position) {
            case 'bottom':
                top = targetRect.bottom + padding;
                left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
                break;
            case 'top':
                top = targetRect.top - tooltipHeight - padding;
                left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
                left = targetRect.left - tooltipWidth - padding;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
                left = targetRect.right + padding;
                break;
            default:
                top = targetRect.bottom + padding;
                left = targetRect.left;
        }

        // Keep within viewport
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
        top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

        return {
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            maxWidth: `${tooltipWidth}px`
        };
    };

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Overlay with spotlight */}
            <div className="absolute inset-0">
                {targetRect ? (
                    // SVG mask for spotlight effect
                    <svg className="w-full h-full">
                        <defs>
                            <mask id="spotlight-mask">
                                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                <rect
                                    x={targetRect.left - 8}
                                    y={targetRect.top - 8}
                                    width={targetRect.width + 16}
                                    height={targetRect.height + 16}
                                    rx="12"
                                    fill="black"
                                />
                            </mask>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="rgba(0, 0, 0, 0.85)"
                            mask="url(#spotlight-mask)"
                        />
                    </svg>
                ) : (
                    // Simple dark overlay for centered modals
                    <div className="absolute inset-0 bg-black/85" />
                )}
            </div>

            {/* Spotlight ring around target */}
            {targetRect && (
                <div
                    className="absolute border-2 border-violet-400 rounded-xl pointer-events-none animate-pulse"
                    style={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
                    }}
                />
            )}

            {/* Tooltip */}
            <div
                ref={tooltipRef}
                style={getTooltipStyle()}
                className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Progress bar */}
                <div className="h-1 bg-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-bold text-lg">{step.title}</h3>
                        <button
                            onClick={handleSkip}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white/50" />
                        </button>
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed mb-5">
                        {step.description}
                    </p>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {TOUR_STEPS.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep
                                        ? 'bg-violet-400'
                                        : idx < currentStep
                                            ? 'bg-violet-400/50'
                                            : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            {!isFirstStep && (
                                <button
                                    onClick={handlePrev}
                                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Anterior
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white font-medium text-sm transition-colors"
                            >
                                {isLastStep ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        ¡Empezar!
                                    </>
                                ) : (
                                    <>
                                        Siguiente
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step counter */}
                <div className="px-5 pb-3 text-center">
                    <span className="text-xs text-white/40">
                        Paso {currentStep + 1} de {TOUR_STEPS.length}
                    </span>
                </div>
            </div>
        </div>
    );
}
