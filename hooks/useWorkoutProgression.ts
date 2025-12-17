'use client';

import { useState, useEffect } from 'react';

interface ExerciseProgression {
    id: string; // matches exercise ID
    easyCount: number; // Consecutive "Easy" ratings
    currentDurationOverride?: number; // If set, overrides standard duration
}

export function useWorkoutProgression() {
    const [progressions, setProgressions] = useState<Record<string, ExerciseProgression>>({});

    useEffect(() => {
        const saved = localStorage.getItem('exercise_progressions');
        if (saved) {
            setProgressions(JSON.parse(saved));
        }
    }, []);

    const saveProgressions = (newProgs: Record<string, ExerciseProgression>) => {
        setProgressions(newProgs);
        localStorage.setItem('exercise_progressions', JSON.stringify(newProgs));
    };

    const recordRating = (exerciseId: string, rating: 'easy' | 'good' | 'hard', standardDuration: number) => {
        const current = progressions[exerciseId] || { id: exerciseId, easyCount: 0 };
        let newProg = { ...current };

        if (rating === 'easy') {
            newProg.easyCount += 1;
            // Logic: If 3 consecutive "Easy", increase difficulty
            if (newProg.easyCount >= 3) {
                const currentDuration = newProg.currentDurationOverride || standardDuration;
                // Increase by ~10% or minimum 5 seconds, round to nearest 5
                const increase = Math.max(5, Math.ceil((currentDuration * 0.1) / 5) * 5);
                newProg.currentDurationOverride = currentDuration + increase;
                newProg.easyCount = 0; // Reset counter after level up

                // Optional: We could return a "Level Up!" flag here to show UI feedback
            }
        } else if (rating === 'hard') {
            // Reset easy count if it was building up
            newProg.easyCount = 0;
            // Optional: If 'hard' consistently, could de-load, but let's stick to overload for now
        } else {
            // 'good' maintains status quo
            newProg.easyCount = 0; // Reset streak if just "good"
        }

        saveProgressions({
            ...progressions,
            [exerciseId]: newProg
        });

        return newProg;
    };

    const getDuration = (exerciseId: string, standardDuration: number) => {
        return progressions[exerciseId]?.currentDurationOverride || standardDuration;
    };

    return {
        recordRating,
        getDuration
    };
}
