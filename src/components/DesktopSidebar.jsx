import React, { useState } from 'react';
import {
    Sun, Calendar, Activity, BarChart3, Settings, LayoutGrid, LayoutDashboard,
    Brain, Users, Wallet, User, Dumbbell, Briefcase, Target, Utensils,
    Lightbulb, BookOpen, LogOut, ChevronDown, ChevronRight
} from 'lucide-react';

/**
 * Desktop Sidebar - Navigation for desktop layout with collapsible sections
 * Only visible on screens ≥1024px
 */
const DesktopSidebar = ({
    screen,
    setScreen,
    hubItems = [],
    data,
    onLogout
}) => {
    // Collapsible state for each pillar
    const [collapsed, setCollapsed] = useState({
        origen: false,
        camino: false,
        destino: false
    });

    const togglePillar = (pillar) => {
        setCollapsed(prev => ({ ...prev, [pillar]: !prev[pillar] }));
    };

    // Main navigation items
    const navItems = [
        { id: 'today', icon: Sun, label: 'Acción', color: 'text-amber-400' },
        { id: 'calendar', icon: Calendar, label: 'Calendario', color: 'text-blue-400' },
        { id: 'control', icon: Activity, label: 'Control', color: 'text-emerald-400' },
        { id: 'panel', icon: LayoutDashboard, label: 'Panel', color: 'text-violet-400' },
    ];

    // Pillar definitions
    const pillars = [
        {
            id: 'origen',
            emoji: '🔥',
            label: 'Origen',
            color: 'text-orange-400',
            hoverColor: 'hover:bg-orange-500/10',
            description: 'Base energética'
        },
        {
            id: 'camino',
            emoji: '🔥',
            label: 'Camino',
            color: 'text-blue-400',
            hoverColor: 'hover:bg-blue-500/10',
            description: 'Acciones diarias'
        },
        {
            id: 'destino',
            emoji: '✨',
            label: 'Destino',
            color: 'text-emerald-400',
            hoverColor: 'hover:bg-emerald-500/10',
            description: 'Resultados'
        },
    ];

    // Check if any item in pillar is active
    const isPillarActive = (pillarId) => {
        return hubItems.filter(h => h.pillar === pillarId).some(h => h.id === screen);
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-zinc-900/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Life OS</h1>
                        <p className="text-xs text-white/50">v5.2</p>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                {/* Primary Nav */}
                <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2 px-3">Principal</p>
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = screen === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setScreen(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Collapsible Pillar Sections */}
                {pillars.map((pillar) => {
                    const pillarItems = hubItems.filter(h => h.pillar === pillar.id);
                    const isActive = isPillarActive(pillar.id);
                    const isCollapsed = collapsed[pillar.id];

                    if (pillarItems.length === 0) return null;

                    return (
                        <div key={pillar.id} className="mb-3">
                            {/* Pillar Header - Clickable */}
                            <button
                                onClick={() => togglePillar(pillar.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${pillar.hoverColor} ${isActive ? 'bg-white/5' : ''}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{pillar.emoji}</span>
                                    <span className={`text-[11px] uppercase tracking-wider font-medium ${pillar.color}`}>
                                        {pillar.label}
                                    </span>
                                    <span className="text-[9px] text-white/30">
                                        ({pillarItems.length})
                                    </span>
                                </div>
                                {isCollapsed ? (
                                    <ChevronRight className="w-4 h-4 text-white/30" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-white/30" />
                                )}
                            </button>

                            {/* Pillar Items - Collapsible */}
                            {!isCollapsed && (
                                <div className="mt-1 ml-2 space-y-1 border-l border-white/10 pl-2">
                                    {pillarItems.map((item) => {
                                        const isItemActive = screen === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setScreen(item.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isItemActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center`}>
                                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                                </div>
                                                <span className="text-sm text-white/80">{item.label}</span>
                                                {item.badge && (
                                                    <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{item.badge}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}


                {/* Settings */}
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2 px-3">Sistema</p>
                    <button
                        onClick={() => setScreen('settings')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${screen === 'settings'
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium text-sm">Configuración</span>
                    </button>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">
                        {data?.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{data?.user?.name || 'Usuario'}</p>
                        <p className="text-xs text-white/40">Premium</p>
                    </div>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default DesktopSidebar;
