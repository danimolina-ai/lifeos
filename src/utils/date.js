// Date utilities for LifeOS

export const getToday = () => new Date().toISOString().split('T')[0];

export const getDateOffset = (date, offset) => {
    const d = new Date(date);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
};

export const formatDate = (d) =>
    new Date(d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

export const formatDateShort = (d) =>
    new Date(d).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });

export const formatShortDate = (d) =>
    new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

export const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const isToday = (d) => d === getToday();

export const isPast = (d) => d < getToday();

export const getWeekDates = (baseDate = getToday()) => {
    const d = new Date(baseDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
        const x = new Date(monday);
        x.setDate(monday.getDate() + i);
        return x.toISOString().split('T')[0];
    });
};

export const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return { text: 'Buenas noches', icon: '🌙' };
    if (h < 12) return { text: 'Buenos días', icon: '☀️' };
    if (h < 18) return { text: 'Buenas tardes', icon: '🌤️' };
    return { text: 'Buenas noches', icon: '🌙' };
};
