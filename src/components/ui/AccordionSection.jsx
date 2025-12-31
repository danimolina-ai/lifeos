// AccordionSection - Collapsible section for Today screen
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const AccordionSection = ({
    title,
    icon: Icon,
    iconColor = 'text-violet-400',
    action,
    actionLabel,
    summary,
    summaryRight,
    progress = null,
    progressColor = 'bg-violet-500',
    urgent = false,
    children,
    defaultOpen = false,
    storageKey = null,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(() => {
        if (storageKey) {
            try {
                const saved = localStorage.getItem(`accordion_${storageKey}`);
                if (saved !== null) return JSON.parse(saved);
            } catch { }
        }
        return defaultOpen;
    });

    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(`accordion_${storageKey}`, JSON.stringify(isOpen));
        }
    }, [isOpen, storageKey]);

    const getProgressColorClass = (val) => {
        if (val >= 80) return 'bg-emerald-500';
        if (val >= 60) return 'bg-lime-500';
        if (val >= 40) return 'bg-amber-500';
        if (val >= 20) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${urgent ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-white/10'} ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center gap-3 p-3 transition-all active:scale-[0.99] ${isOpen ? 'bg-white/5' : 'bg-white/[0.02] hover:bg-white/5'}`}
            >
                <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${urgent ? 'bg-amber-500/20' : 'bg-white/10'}`}>
                    {Icon && <Icon className={`w-4 h-4 ${urgent ? 'text-amber-400' : iconColor}`} />}
                    {urgent && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{title}</span>
                        {summaryRight && (
                            <span className={`text-xs font-medium ${progress !== null
                                ? (progress >= 80 ? 'text-emerald-400' : progress >= 50 ? 'text-amber-400' : 'text-white/50')
                                : 'text-white/50'
                                }`}>
                                {summaryRight}
                            </span>
                        )}
                    </div>

                    {!isOpen && (
                        <div className="flex items-center gap-2 mt-1">
                            {progress !== null && (
                                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                                    <div
                                        className={`h-full rounded-full transition-all ${progressColor || getProgressColorClass(progress)}`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                            )}
                            {summary && (
                                <span className="text-[11px] text-white/40 truncate">{summary}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {action && isOpen && (
                        <button
                            onClick={(e) => { e.stopPropagation(); action(); }}
                            className="text-[10px] text-violet-400 hover:text-violet-300 px-2 py-1 bg-violet-500/20 rounded hover:bg-violet-500/30 transition-colors"
                        >
                            {actionLabel}
                        </button>
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-white/10 rotate-180' : 'bg-transparent'}`}>
                        <ChevronDown className="w-4 h-4 text-white/40" />
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="px-3 pb-3">
                    {children}
                </div>
            )}
        </div>
    );
};

export default AccordionSection;
