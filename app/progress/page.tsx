'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Save, History } from 'lucide-react';

interface MetricEntry {
    date: string;
    pelvicEndurance: string;
    gripEndurance: string;
    visualRating: number;
}

export default function ProgressPage() {
    const [entries, setEntries] = useState<MetricEntry[]>([]);
    const [formData, setFormData] = useState({
        pelvicEndurance: '',
        gripEndurance: '',
        visualRating: 5
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedEntries = localStorage.getItem('weekly_metrics');
        if (savedEntries) {
            setEntries(JSON.parse(savedEntries));
        }
    }, []);

    const handleSave = () => {
        const newEntry: MetricEntry = {
            date: new Date().toISOString().split('T')[0],
            pelvicEndurance: formData.pelvicEndurance,
            gripEndurance: formData.gripEndurance,
            visualRating: formData.visualRating
        };

        const newEntries = [newEntry, ...entries];
        setEntries(newEntries);
        localStorage.setItem('weekly_metrics', JSON.stringify(newEntries));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);

        // Reset form
        setFormData({
            pelvicEndurance: '',
            gripEndurance: '',
            visualRating: 5
        });
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                    Progress Tracker
                </h1>
                <p className="text-zinc-400 text-sm">
                    What gets measured gets managed.
                </p>
            </header>

            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    Weekly Success Metrics <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">Log Once/Week</span>
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Pelvic Endurance (Max Hold Seconds)</label>
                        <input
                            type="number"
                            className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
                            placeholder="e.g. 45"
                            value={formData.pelvicEndurance}
                            onChange={(e) => setFormData({ ...formData, pelvicEndurance: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Grip Endurance (Dead Hang Seconds)</label>
                        <input
                            type="number"
                            className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
                            placeholder="e.g. 60"
                            value={formData.gripEndurance}
                            onChange={(e) => setFormData({ ...formData, gripEndurance: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Visual Check (Vascularity 1-10)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                className="flex-1 accent-neon-green"
                                value={formData.visualRating}
                                onChange={(e) => setFormData({ ...formData, visualRating: parseInt(e.target.value) })}
                            />
                            <span className="text-xl font-bold text-neon-green w-8">{formData.visualRating}</span>
                        </div>
                    </div>

                    <Button
                        className="w-full mt-2"
                        onClick={handleSave}
                        disabled={!formData.pelvicEndurance || !formData.gripEndurance}
                    >
                        {saved ? 'Saved Successfully!' : <><Save className="h-4 w-4 mr-2" /> Save Metrics</>}
                    </Button>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <History className="h-5 w-5 text-zinc-500" /> History
                </h2>

                <div className="space-y-3">
                    {entries.map((entry, i) => (
                        <div key={i} className="flex flex-col gap-2 bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-1">
                                <span className="text-zinc-400 text-sm">{entry.date}</span>
                                <span className="text-neon-green font-bold text-sm">Rating: {entry.visualRating}/10</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-300">Pelvic Hold: <span className="text-white font-mono">{entry.pelvicEndurance}s</span></span>
                                <span className="text-zinc-300">Dead Hang: <span className="text-white font-mono">{entry.gripEndurance}s</span></span>
                            </div>
                        </div>
                    ))}

                    {entries.length === 0 && (
                        <div className="text-center text-zinc-600 italic py-4">No metrics recorded yet.</div>
                    )}
                </div>
            </section>
        </div>
    );
}
