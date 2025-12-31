// Score calculation utilities for LifeOS
import { getDateOffset } from './date';

export const calculateDayScore = (dayData, habitLogs, meals, tasks, workout, goals) => {
    let score = 0, max = 0;

    // Sleep (25 points)
    if (dayData?.sleep_hours !== undefined) {
        max += 25;
        const sleepScore = dayData.sleep_hours >= 7 ? 25 : dayData.sleep_hours >= 6 ? 18 : dayData.sleep_hours >= 5 ? 10 : 5;
        score += sleepScore;
    }

    // Habits (25 points)
    if (habitLogs.length > 0) {
        max += 25;
        const completed = habitLogs.filter(h => h.completed).length;
        score += Math.round((completed / habitLogs.length) * 25);
    }

    // Nutrition (25 points) - based on hitting macros
    if (meals.length > 0 && goals) {
        max += 25;
        const totalProt = meals.reduce((s, m) => s + (m.protein || 0), 0);
        const totalCals = meals.reduce((s, m) => s + (m.calories || 0), 0);
        const protScore = Math.min(totalProt / goals.protein, 1) * 15;
        const calScore = totalCals >= goals.calories * 0.8 && totalCals <= goals.calories * 1.1 ? 10 : 5;
        score += Math.round(protScore + calScore);
    }

    // Tasks (15 points)
    if (tasks.length > 0) {
        max += 15;
        const completed = tasks.filter(t => t.completed).length;
        score += Math.round((completed / tasks.length) * 15);
    }

    // Workout (10 points)
    if (workout) {
        max += 10;
        if (workout.is_completed) score += 10;
        else {
            const done = workout.exercises?.reduce((s, e) => s + e.sets.filter(x => x.completed).length, 0) || 0;
            const total = workout.exercises?.reduce((s, e) => s + e.sets.length, 0) || 1;
            score += Math.round((done / total) * 5);
        }
    }

    // Consciousness / Mindfulness (10 points)
    if (dayData) {
        max += 10;
        if (dayData.gratitude && dayData.gratitude.length > 0) score += 5;
        if (dayData.journalEntry || dayData.meditation_done || dayData.breathing_done) score += 5;
    }

    return max > 0 ? Math.round((score / max) * 100) : 0;
};

export const getHabitStreak = (habitId, habitLogs, currentDate) => {
    let streak = 0;
    let checkDate = currentDate;

    while (true) {
        const log = habitLogs.find(l => l.habit_id === habitId && l.date === checkDate);
        if (log?.completed) {
            streak++;
            checkDate = getDateOffset(checkDate, -1);
        } else {
            break;
        }
    }
    return streak;
};
