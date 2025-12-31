import { useState, useEffect } from 'react';

/**
 * Hook to detect if a CSS media query matches
 * @param {string} query - CSS media query string (e.g., '(min-width: 1024px)')
 * @returns {boolean} - Whether the media query currently matches
 */
export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);
        const handler = (event) => setMatches(event.matches);

        // Set initial value
        setMatches(mediaQuery.matches);

        // Listen for changes
        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
};

/**
 * Hook to detect if the viewport is desktop size (≥1024px)
 * @returns {boolean} - True if desktop, false if mobile/tablet
 */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

/**
 * Hook to detect if the viewport is tablet size (≥768px and <1024px)
 * @returns {boolean} - True if tablet
 */
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

/**
 * Hook to detect if the viewport is mobile size (<768px)
 * @returns {boolean} - True if mobile
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
