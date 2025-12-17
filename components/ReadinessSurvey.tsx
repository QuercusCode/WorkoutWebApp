'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Battery, BatteryCharging, BatteryWarning } from 'lucide-react';

interface ReadinessSurveyProps {
    onComplete: (readinessScore: number) => void;
}

export function ReadinessSurvey({ onComplete }: ReadinessSurveyProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastCheck = localStorage.getItem('readiness_check_date');

        // Open if not checked today
        if (lastCheck !== today) {
            setIsOpen(true);
        }
    }, []);

    const handleSelection = (score: number) => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('readiness_check_date', today);
        localStorage.setItem('readiness_score', score.toString());
        setIsOpen(false);
        onComplete(score);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4 text-center">Morning Readiness Check</h2>
                <p className="text-zinc-400 text-center mb-8">
                    Honesty is key. How is your body feeling today?
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleSelection(3)}
                        className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-green-500/20 hover:border-green-500 hover:bg-green-500/10 transition-all text-left group"
                    >
                        <div className="p-3 rounded-full bg-green-500/20 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-colors">
                            <BatteryCharging className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="block text-white font-bold">Peak Condition</span>
                            <span className="text-xs text-zinc-500">I'm ready to crush it. No pain.</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelection(2)}
                        className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-yellow-500/20 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all text-left group"
                    >
                        <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                            <Battery className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="block text-white font-bold">Moderate</span>
                            <span className="text-xs text-zinc-500">A bit sore, but functional.</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelection(1)}
                        className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 transition-all text-left group"
                    >
                        <div className="p-3 rounded-full bg-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-black transition-colors">
                            <BatteryWarning className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="block text-white font-bold">Recovery Needed</span>
                            <span className="text-xs text-zinc-500">High fatigue or pain.</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
