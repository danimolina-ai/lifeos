import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Settings, ChevronDown, X } from 'lucide-react';

/**
 * Desktop Header Bar - Top navigation for desktop layout
 * Contains: Search, Date/Time, Dark mode toggle, Notifications, User menu
 */
const DesktopHeaderBar = ({
    data,
    onSearch,
    showSettings,
    setScreen
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Format current date
    const today = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = today.toLocaleDateString('es-ES', dateOptions);
    const formattedTime = today.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Get greeting based on time
    const hour = today.getHours();
    const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

    // Sample notifications (could be dynamic)
    const notifications = [
        { id: 1, text: '3 hábitos pendientes', time: 'Ahora', type: 'habit' },
        { id: 2, text: 'Meta de deep work: 2h restantes', time: '2h', type: 'work' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch && searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    return (
        <header className="h-20 bg-zinc-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between pl-8 pr-4 sticky top-0 z-40">
            {/* Left: Greeting & Date */}
            <div className="flex items-center gap-6 min-w-[200px]">
                <div>
                    <p className="text-xs text-white/50">{greeting}</p>
                    <p className="text-base font-semibold capitalize">{formattedDate}</p>
                </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl ml-8 mr-4">
                <form onSubmit={handleSearch} className="relative">
                    <div className={`flex items-center bg-white/5 rounded-2xl border transition-all ${searchFocused ? 'border-violet-500/50 bg-white/10' : 'border-white/10'
                        }`}>
                        <Search className="w-5 h-5 text-white/40 ml-5" />
                        <input
                            type="text"
                            placeholder="Buscar tareas, hábitos, notas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="p-2 text-white/40 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <kbd className="hidden sm:block text-[10px] bg-white/10 text-white/40 px-2 py-1 rounded mr-4">
                            ⌘K
                        </kbd>
                    </div>
                </form>
            </div>

            {/* Right: Actions - pushed to the right edge */}
            <div className="flex items-center gap-2">
                {/* Time */}
                <div className="text-sm font-mono text-white/60 px-3 py-2 bg-white/5 rounded-xl">
                    {formattedTime}
                </div>


                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <Bell className="w-5 h-5 text-white/60" />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                            <div className="absolute right-0 top-12 w-80 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="font-semibold">Notificaciones</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                                <p className="text-sm">{n.text}</p>
                                                <p className="text-xs text-white/40 mt-1">{n.time}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-white/40">
                                            <p className="text-sm">No hay notificaciones</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Settings */}
                <button
                    onClick={() => setScreen('settings')}
                    className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                >
                    <Settings className="w-5 h-5 text-white/60" />
                </button>

                {/* User Avatar */}
                <div className="relative ml-2">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">
                            {data?.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/40" />
                    </button>

                    {/* User Menu Dropdown */}
                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                            <div className="absolute right-0 top-12 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="p-3 border-b border-white/10">
                                    <p className="font-medium text-sm">{data?.user?.name || 'Usuario'}</p>
                                    <p className="text-xs text-white/40">Premium</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors">
                                        Mi perfil
                                    </button>
                                    <button
                                        onClick={() => { setScreen('settings'); setShowUserMenu(false); }}
                                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Configuración
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DesktopHeaderBar;
