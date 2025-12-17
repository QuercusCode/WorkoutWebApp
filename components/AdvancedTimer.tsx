'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

// Timer stages for "Pelvic Powerhouse"
// 1. Max Hold (20s)
// 2. Rest (10s)
// 3. Rapid Fire (30s)

type TimerType = 'standard' | 'pelvic-powerhouse';

interface AdvancedTimerProps {
    type?: TimerType;
    duration?: number; // Standard duration
    onComplete?: () => void;
    onClose: () => void;
    isOpen: boolean;
}

export function AdvancedTimer({ type = 'standard', duration = 60, onComplete, onClose, isOpen }: AdvancedTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);
    const [stage, setStage] = useState(0); // 0: Hold, 1: Rest, 2: Pump (For pelvic)
    const [muted, setMuted] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);

    const PELVIC_STAGES = [
        { label: 'MAX HOLD', duration: 20, color: 'text-neon-blue' },
        { label: 'REST', duration: 10, color: 'text-zinc-500' },
        { label: 'RAPID FIRE', duration: 30, color: 'text-neon-green' },
    ];

    // Initialize Audio Context on user interaction
    const playBell = () => {
        if (muted) return;
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioContextRef.current!;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5);

            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

            osc.start();
            osc.stop(ctx.currentTime + 1.5);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            if (type === 'pelvic-powerhouse') {
                setStage(0);
                setTimeLeft(PELVIC_STAGES[0].duration);
            } else {
                setTimeLeft(duration);
            }
            setIsActive(false);
        }
    }, [isOpen, type, duration]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            // Timer finished or stage finished
            playBell();

            if (type === 'pelvic-powerhouse') {
                if (stage < 2) {
                    const nextStage = stage + 1;
                    setStage(nextStage);
                    setTimeLeft(PELVIC_STAGES[nextStage].duration);
                } else {
                    setIsActive(false);
                    if (onComplete) onComplete();
                }
            } else {
                setIsActive(false);
                if (onComplete) onComplete();
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, stage, type, onComplete, muted]);

    if (!isOpen) return null;

    const currentStage = type === 'pelvic-powerhouse' ? PELVIC_STAGES[stage] : { label: 'TIMER', color: 'text-white', duration };
    const totalDuration = type === 'pelvic-powerhouse' ? PELVIC_STAGES[stage].duration : duration;
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl relative overflow-hidden">
                {/* Progress bar background */}
                <div className="absolute top-0 left-0 h-1 bg-neon-blue transition-all duration-1000 linear" style={{ width: `${progress}%` }} />

                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <X className="h-6 w-6" />
                </button>

                <button onClick={() => setMuted(!muted)} className="absolute top-4 left-4 text-zinc-500 hover:text-white">
                    {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </button>

                <div className="flex flex-col items-center gap-6 mt-4">
                    <div className="text-center">
                        <h3 className={cn("text-lg font-bold tracking-widest", currentStage.color)}>
                            {currentStage.label}
                        </h3>
                        <div className="font-mono text-7xl font-bold text-white tabular-nums my-4">
                            {timeLeft}
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setIsActive(false);
                                if (type === 'pelvic-powerhouse') {
                                    setStage(0);
                                    setTimeLeft(PELVIC_STAGES[0].duration);
                                } else {
                                    setTimeLeft(duration);
                                }
                            }}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>

                        <Button
                            variant="primary"
                            className="flex-1"
                            onClick={() => setIsActive(!isActive)}
                        >
                            {isActive ? (
                                <>
                                    <Pause className="h-4 w-4 mr-2 fill-current" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4 mr-2 fill-current" />
                                    Start
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
