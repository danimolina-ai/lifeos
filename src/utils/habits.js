// Habit utilities for LifeOS
import { getDateOffset } from './date';

/**
 * Check if a habit should be done on a given day based on its frequency
 * @param {object} habit - Habit object with frequency settings
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {boolean} Whether habit should be done on this day
 */
export const shouldDoHabitOnDay = (habit, dateStr) => {
    if (!habit) return false;

    const frequency = habit.frequency || 'daily';
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // 0 = Sunday

    switch (frequency) {
        case 'daily':
            return true;
        case 'weekdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5;
        case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6;
        case 'custom':
            // habit.customDays is array of day numbers [0,1,2,3,4,5,6]
            return (habit.customDays || []).includes(dayOfWeek);
        default:
            return true;
    }
};

/**
 * Calculate streak with freeze days allowed
 * @param {string} habitId - Habit ID
 * @param {Array} habits - All habits
 * @param {Array} habitLogs - All habit logs
 * @param {string} today - Today's date string
 * @param {number} freezeDays - Number of freeze days allowed
 * @returns {object} { current: number, freezeUsed: number }
 */
export const getStreakWithFreeze = (habitId, habits, habitLogs, today, freezeDays = 2) => {
    const logs = habitLogs?.filter(l => l.habit_id === habitId && l.completed) || [];
    if (logs.length === 0) return { current: 0, freezeUsed: 0 };

    const sortedDates = [...new Set(logs.map(l => l.date))].sort().reverse();
    let streak = 0;
    let freezeUsed = 0;
    let currentDate = new Date(today);
    const habit = habits.find(h => h.id === habitId);
    const todayLog = logs.find(l => l.date === today);

    if (!todayLog && shouldDoHabitOnDay(habit, today)) {
        currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let i = 0; i < 365; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const wasCompleted = sortedDates.includes(dateStr);
        const shouldDo = shouldDoHabitOnDay(habit, dateStr);

        if (shouldDo) {
            if (wasCompleted) streak++;
            else if (freezeUsed < freezeDays) freezeUsed++;
            else break;
        }
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return { current: streak, freezeUsed };
};

/**
 * Check if habit was missed yesterday
 * @param {string} habitId - Habit ID
 * @param {Array} habits - All habits
 * @param {Array} habitLogs - All habit logs
 * @param {string} today - Today's date string
 * @returns {boolean} Whether habit was missed yesterday
 */
export const getMissedYesterday = (habitId, habits, habitLogs, today) => {
    const yesterday = getDateOffset(today, -1);
    const habit = habits.find(h => h.id === habitId);
    if (!shouldDoHabitOnDay(habit, yesterday)) return false;
    const log = habitLogs?.find(l => l.habit_id === habitId && l.date === yesterday && l.completed);
    return !log;
};

/**
 * Calculate mastery level for a habit (1-5)
 * @param {string} habitId - Habit ID  
 * @param {Array} habits - All habits
 * @param {Array} habitLogs - All habit logs
 * @param {string} today - Today's date string
 * @returns {number} Mastery level 1-5
 */
export const getMasteryLevel = (habitId, habits, habitLogs, today) => {
    const totalCompletions = habitLogs?.filter(l => l.habit_id === habitId && l.completed).length || 0;
    const streak = getStreakWithFreeze(habitId, habits, habitLogs, today);
    const score = (totalCompletions * 0.3) + (streak.current * 2);

    if (score >= 100) return 5;
    if (score >= 60) return 4;
    if (score >= 30) return 3;
    if (score >= 15) return 2;
    return 1;
};

/**
 * Get gratitude streak (consecutive days with gratitude entries)
 * @param {object} days - Days data object
 * @param {string} today - Today's date string
 * @returns {number} Streak count
 */
export const getGratitudeStreak = (days, today) => {
    let streak = 0;
    let checkDate = today;

    for (let i = 0; i < 365; i++) {
        const day = days[checkDate];
        if (day?.gratitude && day.gratitude.length > 0) {
            streak++;
            checkDate = getDateOffset(checkDate, -1);
        } else {
            break;
        }
    }

    return streak;
};
