'use client';

import { useState } from 'react';
import { Exercise } from '@/lib/workoutData';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button'; // Will create simple button/utility

interface ExerciseCardProps {
    exercise: Exercise;
    isCompleted: boolean;
    onToggle: () => void;
    onStartTimer?: () => void;
}

export function ExerciseCard({ exercise, isCompleted, onToggle, onStartTimer }: ExerciseCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={cn(
            "w-full rounded-xl border p-4 transition-colors",
            isCompleted
                ? "border-neon-green/30 bg-neon-green/5"
                : "border-zinc-800 bg-zinc-900"
        )}>
            <div className="flex items-start justify-between gap-4">
                <button onClick={onToggle} className="flex-shrink-0 pt-1 text-zinc-500 hover:text-neon-green transition-colors">
                    {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-neon-green" />
                    ) : (
                        <Circle className="h-6 w-6" />
                    )}
                </button>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <h3 className={cn("font-semibold", isCompleted && "text-zinc-500 line-through")}>
                            {exercise.title}
                        </h3>
                        {exercise.durationSeconds && (
                            <span className="flex items-center gap-1 text-xs font-mono text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded-full">
                                <Timer className="h-3 w-3" />
                                {exercise.reps}
                            </span>
                        )}
                        {!exercise.durationSeconds && (
                            <span className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full">
                                {exercise.reps}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-zinc-400">{exercise.description}</p>

                    {isExpanded && (
                        <div className="mt-3 rounded-lg bg-zinc-950/50 p-3 text-sm border-l-2 border-neon-blue">
                            <span className="block text-xs font-bold text-neon-blue mb-1 uppercase tracking-wider">Technical Cue</span>
                            <p className="text-zinc-300">{exercise.technicalCue}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
                        >
                            {isExpanded ? (
                                <>Hide Technicals <ChevronUp className="h-3 w-3" /></>
                            ) : (
                                <>Show Technicals <ChevronDown className="h-3 w-3" /></>
                            )}
                        </button>

                        {(exercise.type === 'time' || exercise.type === 'hold') && onStartTimer && (
                            <button onClick={onStartTimer} className="ml-auto text-xs text-neon-blue hover:underline">
                                Start Timer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
