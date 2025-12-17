'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Flame, X, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdvancedTimer } from './AdvancedTimer';

const FINISHERS = [
    { name: 'Claw Pulse', duration: 60, desc: 'Rapid finger extensions.' },
    { name: 'Plank-to-Fingertip', duration: 60, desc: 'Plank, then push up to fingertips.' },
    { name: 'Grip Hang Burnout', duration: 45, desc: 'Dead hang until failure.' },
    { name: 'Pelvic Pulse', duration: 60, desc: 'Rapid engage/release.' }
];

interface FinisherModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FinisherModal({ isOpen, onClose }: FinisherModalProps) {
    const [selectedFinisher, setSelectedFinisher] = useState<typeof FINISHERS[0] | null>(null);
    const [timerOpen, setTimerOpen] = useState(false);

    if (!isOpen) return null;

    const pickFinisher = () => {
        const random = FINISHERS[Math.floor(Math.random() * FINISHERS.length)];
        setSelectedFinisher(random);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-zinc-900 border border-neon-green/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <X className="h-6 w-6" />
                </button>

                {!selectedFinisher ? (
                    <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Flame className="h-8 w-8 text-neon-green" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">The Finisher</h2>
                        <p className="text-zinc-400 mb-8">
                            One final push to exhaust the muscle fibers. Are you ready for a surprise challenge?
                        </p>
                        <Button
                            variant="primary"
                            className="w-full text-lg py-6 bg-neon-green text-black hover:bg-neon-green/90"
                            onClick={pickFinisher}
                        >
                            <Dumbbell className="mr-2 h-5 w-5" />
                            Surprise Me
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-4 animate-in zoom-in slide-in-from-bottom-5">
                        <h3 className="text-zinc-400 uppercase tracking-widest text-sm mb-2">Your Challenge</h3>
                        <h2 className="text-3xl font-bold text-white mb-4 text-neon-green">{selectedFinisher.name}</h2>
                        <p className="text-zinc-300 mb-8 text-lg">{selectedFinisher.desc}</p>

                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                className="w-full py-4 text-lg"
                                onClick={() => setTimerOpen(true)}
                            >
                                Start {selectedFinisher.duration}s Timer
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setSelectedFinisher(null)}
                            >
                                Reroll Challenge
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <AdvancedTimer
                isOpen={timerOpen}
                onClose={() => {
                    setTimerOpen(false);
                    onClose(); // Close modal after timer
                }}
                duration={selectedFinisher?.duration || 60}
                type="standard"
            />
        </div>
    );
}
