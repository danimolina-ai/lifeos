// Shared UI Components for LifeOS
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, ChevronDown, Plus, X, Check, Zap, Play, Pause, RotateCcw, Timer, Trash2, Sparkles, AlertCircle } from 'lucide-react';

// Animated mount wrapper
export const AnimatedMount = ({ children, delay = 0, className = '' }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), delay);
        return () => clearTimeout(t);
    }, [delay]);
    return (
        <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}>
            {children}
        </div>
    );
};

// Progress ring SVG
export const ProgressRing = ({ progress, size = 60, stroke = 6, color = '#8B5CF6' }) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
    );
};

// Card component
export const Card = ({ children, className = '', onClick, gradient }) => (
    <div
        onClick={onClick}
        className={`
      bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 
      transition-all duration-300
      ${onClick ? 'cursor-pointer hover:bg-white/10 active:scale-[0.98]' : ''} 
      ${gradient || ''}
      ${className}
    `}
    >
        {children}
    </div>
);

// Section component
export const Section = ({ title, icon: Icon, iconColor = 'text-violet-400', action, actionLabel, children, className = '' }) => (
    <div className={className}>
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
                <span className="font-semibold text-sm">{title}</span>
            </div>
            {action && (
                <button onClick={action} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    {actionLabel} <ChevronRight className="w-3 h-3" />
                </button>
            )}
        </div>
        {children}
    </div>
);

// Progress bar
export const ProgressBar = ({ value, max, color = 'bg-violet-500', height = 'h-2', showLabel = false, label = '' }) => {
    const pct = Math.min((value / max) * 100, 100);
    const isOver = value > max;
    return (
        <div className="space-y-1">
            {showLabel && (
                <div className="flex justify-between text-xs">
                    <span className="text-white/60">{label}</span>
                    <span className={isOver ? 'text-red-400' : 'text-white/80'}>{value}/{max}</span>
                </div>
            )}
            <div className={`${height} bg-white/10 rounded-full overflow-hidden`}>
                <div
                    className={`h-full rounded-full transition-all duration-700 ${isOver ? 'bg-red-500' : color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

// Day score circular indicator
export const DayScore = ({ score, size = 'md' }) => {
    const sizes = { sm: 50, md: 70, lg: 90 };
    const strokes = { sm: 4, md: 5, lg: 6 };
    const s = sizes[size];
    const stroke = strokes[size];
    const r = (s - stroke) / 2;
    const c = r * 2 * Math.PI;
    const offset = c - (score / 100) * c;
    const color = score >= 80 ? '#10B981' : score >= 60 ? '#84CC16' : score >= 40 ? '#F59E0B' : '#EF4444';

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={s} height={s} className="transform -rotate-90">
                <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
                <circle
                    cx={s / 2} cy={s / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                    strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
                    className="transition-all duration-1000"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`font-bold ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl'}`}>{score}</span>
            </div>
        </div>
    );
};

// Mini sparkline chart
export const MiniChart = ({ data, color = '#8B5CF6', height = 40 }) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(' ');

    return (
        <svg viewBox="0 0 100 100" className="w-full" style={{ height }} preserveAspectRatio="none">
            <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
        </svg>
    );
};

// Energy level indicator
export const EnergyIndicator = ({ level, onChange, compact = false }) => {
    const colors = {
        1: 'bg-red-500/30 text-red-400 border-red-500/50',
        2: 'bg-orange-500/30 text-orange-400 border-orange-500/50',
        3: 'bg-yellow-500/30 text-yellow-400 border-yellow-500/50',
        4: 'bg-lime-500/30 text-lime-400 border-lime-500/50',
        5: 'bg-emerald-500/30 text-emerald-400 border-emerald-500/50'
    };

    if (compact) {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <button
                        key={i}
                        onClick={() => onChange?.(i)}
                        className={`w-5 h-5 rounded-full transition-all ${i <= level ? colors[level].split(' ')[0] : 'bg-white/10'}`}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
                <button
                    key={i}
                    onClick={() => onChange?.(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border
            ${i <= level ? colors[level] : 'bg-white/5 border-white/10 text-white/20'}
            ${onChange ? 'hover:scale-110 cursor-pointer' : ''}
          `}
                >
                    <Zap className="w-4 h-4" />
                </button>
            ))}
        </div>
    );
};

// Water tracker
export const WaterTracker = ({ current, target, onChange }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                {Array.from({ length: target }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => onChange?.(i < current ? i : i + 1)}
                        className={`w-4 h-6 rounded-sm transition-all ${i < current ? 'bg-blue-500' : 'bg-white/10'}`}
                    />
                ))}
            </div>
            <span className="text-xs text-white/60">{current}/{target}</span>
        </div>
    );
};

// Mood selector
export const MoodSelector = ({ value, onChange }) => {
    const moods = [
        { emoji: '😫', label: 'Muy mal', color: 'bg-red-500' },
        { emoji: '😔', label: 'Mal', color: 'bg-orange-500' },
        { emoji: '😐', label: 'Normal', color: 'bg-yellow-500' },
        { emoji: '🙂', label: 'Bien', color: 'bg-lime-500' },
        { emoji: '😄', label: 'Genial', color: 'bg-emerald-500' }
    ];

    return (
        <div className="flex gap-2">
            {moods.map((m, i) => (
                <button
                    key={i}
                    onClick={() => onChange?.(i + 1)}
                    className={`flex-1 py-3 rounded-xl text-2xl transition-all ${value === i + 1 ? `${m.color} scale-110` : 'bg-white/5 hover:bg-white/10'}`}
                >
                    {m.emoji}
                </button>
            ))}
        </div>
    );
};

// Navigation item
export const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative
      ${active ? 'text-violet-400' : 'text-white/40 hover:text-white/60'}
    `}
    >
        <Icon className={`w-6 h-6 ${active ? 'scale-110' : ''} transition-transform`} />
        <span className="text-[10px]">{label}</span>
        {badge && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                {badge}
            </div>
        )}
    </button>
);

// Empty state placeholder
export const EmptyState = ({ icon: Icon, title, description, action, onAction }) => (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-lg font-medium text-white/70 mb-2">{title}</h3>
        <p className="text-sm text-white/40 mb-6">{description}</p>
        {action && (
            <button onClick={onAction} className="flex items-center gap-2 px-6 py-3 bg-violet-500 rounded-xl font-medium">
                <Plus className="w-5 h-5" />{action}
            </button>
        )}
    </div>
);

// Modal component with portal
export const Modal = ({ isOpen, onClose, title, children, footer }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed z-[9999] flex items-center justify-center"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={onClose}
        >
            <div className="absolute inset-0 backdrop-blur-sm bg-black/50" />
            <div
                className="relative bg-zinc-900 rounded-2xl flex flex-col shadow-2xl border border-white/10 mx-4"
                style={{ maxHeight: 'calc(100vh - 120px)', width: '100%', maxWidth: '380px' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
                    {children}
                </div>
                {footer && (
                    <div className="p-4 border-t border-white/10">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

// Toast notification
export const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, type === 'celebration' ? 4000 : 3000);
        return () => clearTimeout(t);
    }, [onClose, type]);

    const colors = {
        success: 'bg-emerald-500',
        info: 'bg-blue-500',
        warning: 'bg-amber-500',
        error: 'bg-red-500',
        celebration: 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500'
    };

    const icons = {
        success: <Check className="w-5 h-5" />,
        info: <Sparkles className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
        error: <X className="w-5 h-5" />,
        celebration: <span className="text-xl">🎉</span>
    };

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 ${colors[type]} px-6 py-3 rounded-xl shadow-2xl z-50 animate-slide-down flex items-center gap-2 ${type === 'celebration' ? 'scale-110' : ''}`}>
            {icons[type] || icons.success}
            <span className="font-medium">{message}</span>
            {type === 'celebration' && <span className="text-xl">✨</span>}
        </div>
    );
};

// Rest timer for workouts
export const RestTimer = ({ initialSeconds = 90, onComplete, onCancel }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || seconds <= 0) {
            if (seconds <= 0) onComplete?.();
            return;
        }
        const i = setInterval(() => setSeconds(s => s - 1), 1000);
        return () => clearInterval(i);
    }, [seconds, paused, onComplete]);

    const progress = (seconds / initialSeconds) * 100;

    return (
        <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                            <circle
                                cx="24" cy="24" r="20" fill="none" stroke="#3B82F6" strokeWidth="4"
                                strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - progress / 100)}
                                strokeLinecap="round" className="transition-all duration-1000"
                            />
                        </svg>
                        <Timer className="w-5 h-5 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div>
                        <p className="text-xs text-white/60">Descanso</p>
                        <p className="text-2xl font-mono font-bold">{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setPaused(!paused)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                        {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setSeconds(initialSeconds)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button onClick={onCancel} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Card>
    );
};

// Swipeable item for delete actions
export const SwipeableItem = ({ children, onDelete }) => {
    const [offset, setOffset] = useState(0);

    return (
        <div className="relative overflow-hidden rounded-xl">
            <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
                {onDelete && (
                    <button onClick={onDelete} className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div
                className="relative bg-zinc-900 transition-transform duration-200"
                style={{ transform: `translateX(-${offset}px)` }}
                onTouchStart={(e) => { e.currentTarget.startX = e.touches[0].clientX; }}
                onTouchMove={(e) => {
                    const diff = e.currentTarget.startX - e.touches[0].clientX;
                    if (diff > 0) setOffset(Math.min(diff, 70));
                }}
                onTouchEnd={() => setOffset(offset > 40 ? 70 : 0)}
                onClick={() => offset > 0 && setOffset(0)}
            >
                {children}
            </div>
        </div>
    );
};
