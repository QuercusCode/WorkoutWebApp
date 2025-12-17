'use client';

import { useState, useEffect } from 'react';

export function useWorkoutProgress(totalExercises: number) {
    const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
    const [streak, setStreak] = useState(0);
    const [isWorkoutLogged, setIsWorkoutLogged] = useState(false);
    const [loading, setLoading] = useState(true);

    // Helper to get today's date key
    const getTodayKey = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const today = getTodayKey();
        const storedProgress = localStorage.getItem(`workout_progress_${today}`);
        const storedStreak = localStorage.getItem('streak_count');
        const lastLogged = localStorage.getItem('last_logged_date');

        if (storedProgress) {
            setCompletedExercises(JSON.parse(storedProgress));
        }

        if (storedStreak) {
            setStreak(parseInt(storedStreak, 10));
        }

        if (lastLogged === today) {
            setIsWorkoutLogged(true);
        }

        setLoading(false);
    }, []);

    const toggleExercise = (id: string) => {
        const today = getTodayKey();
        const newCompleted = { ...completedExercises, [id]: !completedExercises[id] };
        setCompletedExercises(newCompleted);
        localStorage.setItem(`workout_progress_${today}`, JSON.stringify(newCompleted));
    };

    const logWorkout = () => {
        const today = getTodayKey();
        const lastLogged = localStorage.getItem('last_logged_date');

        if (lastLogged === today) return; // Already logged

        // Calculate streak
        let newStreak = streak;
        if (lastLogged) {
            const lastDate = new Date(lastLogged);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate.toDateString() === yesterday.toDateString()) {
                newStreak++;
            } else {
                newStreak = 1; // Reset or start new if gap > 1 day? Prompt implies streak logic. 
                // If missed a day, streak resets.
                // Actually, simply: if not yesterday, reset to 1.
            }
        } else {
            newStreak = 1;
        }

        setStreak(newStreak);
        setIsWorkoutLogged(true);

        localStorage.setItem('streak_count', newStreak.toString());
        localStorage.setItem('last_logged_date', today);
    };

    const completedCount = Object.values(completedExercises).filter(Boolean).length;
    const progressPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

    return {
        completedExercises,
        toggleExercise,
        progressPercentage,
        streak,
        logWorkout,
        isWorkoutLogged,
        loading
    };
}
