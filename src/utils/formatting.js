// Formatting utilities for LifeOS

/**
 * Format minutes as human-readable time
 * @param {number} min - Minutes
 * @returns {string} Formatted time (e.g., "45m", "1h 30m")
 */
export const formatMinutes = (min) =>
    min < 60 ? `${min}m` : `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ''}`;

/**
 * Format seconds as mm:ss or hh:mm:ss
 * @param {number} seconds - Seconds
 * @returns {string} Formatted time
 */
export const formatSeconds = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format timer for workout display
 * @param {number} seconds - Seconds
 * @returns {string} Formatted time (e.g., "1:30")  
 */
export const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get color class based on score (0-100)
 * @param {number} score - Score value
 * @returns {string} CSS color class
 */
export const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-lime-400';
    if (score >= 40) return 'text-amber-400';
    if (score >= 20) return 'text-orange-400';
    return 'text-red-400';
};

/**
 * Get background color class based on score
 * @param {number} score - Score value
 * @returns {string} CSS background color class
 */
export const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-lime-500';
    if (score >= 40) return 'bg-amber-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
};

/**
 * Get hex color based on score (for SVG/charts)
 * @param {number} score - Score value
 * @returns {string} Hex color
 */
export const getScoreHexColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#84CC16';
    if (score >= 40) return '#F59E0B';
    if (score >= 20) return '#F97316';
    return '#EF4444';
};

/**
 * Calculate health score for relationships (1-5)
 * @param {object} relation - Relationship object
 * @returns {number} Health score 1-5
 */
export const getRelationshipHealthScore = (relation) => {
    if (!relation) return 3;

    // Base score from explicit healthRating if exists
    if (relation.healthRating) return relation.healthRating;

    // Calculate based on interaction frequency
    const interactions = relation.interactions || [];
    if (interactions.length === 0) return 2;

    const lastInteraction = interactions[interactions.length - 1];
    if (!lastInteraction) return 2;

    const daysSince = Math.floor(
        (new Date() - new Date(lastInteraction.date)) / (1000 * 60 * 60 * 24)
    );

    // Score based on recency
    if (daysSince <= 7) return 5;
    if (daysSince <= 14) return 4;
    if (daysSince <= 30) return 3;
    if (daysSince <= 60) return 2;
    return 1;
};
