import React from 'react';

/**
 * ResponsiveScreenLayout - Wrapper component for screen layouts
 * Provides responsive grid layouts for desktop while maintaining mobile-first design
 * 
 * Usage: 
 * <ResponsiveScreenLayout isDesktop={isDesktop}>
 *   {children}
 * </ResponsiveScreenLayout>
 * 
 * For multi-column layouts on desktop:
 * <ResponsiveScreenLayout isDesktop={isDesktop} columns={2}>
 *   <div>Left column content</div>
 *   <div>Right column content</div>
 * </ResponsiveScreenLayout>
 */

export const ResponsiveScreenLayout = ({
    children,
    isDesktop = false,
    columns = 1, // 1, 2, or 3
    gap = 'gap-6',
    className = ''
}) => {
    // Mobile: always single column
    // Desktop: use specified columns
    const gridClass = isDesktop
        ? columns === 3 ? 'grid-cols-3'
            : columns === 2 ? 'grid-cols-2'
                : 'grid-cols-1 max-w-3xl'
        : 'grid-cols-1';

    return (
        <div className={`grid ${gridClass} ${gap} ${className}`}>
            {children}
        </div>
    );
};

/**
 * ResponsiveCard - Card component that spans columns on desktop
 */
export const ResponsiveCard = ({
    children,
    isDesktop = false,
    span = 1, // 1, 2, or 'full'
    className = ''
}) => {
    const spanClass = span === 'full'
        ? 'col-span-full'
        : span === 2
            ? 'md:col-span-2'
            : '';

    return (
        <div className={`${spanClass} ${className}`}>
            {children}
        </div>
    );
};

/**
 * Hook-like utility to get responsive classes
 */
export const getResponsiveClasses = (isDesktop) => ({
    // Container sizes
    container: isDesktop ? 'max-w-5xl' : 'max-w-md',

    // Grid configurations
    grid2: isDesktop ? 'grid grid-cols-2 gap-6' : 'space-y-4',
    grid3: isDesktop ? 'grid grid-cols-3 gap-6' : 'space-y-4',

    // Card sizes
    wideCard: isDesktop ? 'col-span-2' : '',

    // Text sizes - larger on desktop
    heading: isDesktop ? 'text-3xl' : 'text-2xl',
    subheading: isDesktop ? 'text-xl' : 'text-lg',

    // Spacing
    sectionGap: isDesktop ? 'space-y-8' : 'space-y-6',

    // Modal behavior
    modal: isDesktop
        ? 'fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50'
        : 'fixed inset-0 bg-zinc-950 z-50',
    modalContent: isDesktop
        ? 'bg-zinc-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto m-4'
        : 'h-full overflow-y-auto',
});

export default ResponsiveScreenLayout;
