'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

const PROTOCOLS = [
    {
        category: 'Pre-Workout',
        title: 'Beetroot Juice Protocol',
        text: '300ml Beetroot Juice (1 hour prior) for Nitric Oxide boost.',
        color: 'text-neon-green',
        bg: 'bg-neon-green/10'
    },
    {
        category: 'Daily',
        title: 'Citrulline Loading',
        text: '2g L-Citrulline via Watermelon or Supplementation.',
        color: 'text-neon-blue',
        bg: 'bg-neon-blue/10'
    },
    {
        category: 'Recovery',
        title: 'Contrast Shower',
        text: 'End every shower with 60 seconds of maximal cold water on the groin and legs to improve vascular elasticity.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        category: 'Diet',
        title: 'Power Foods',
        text: 'Focus on vascular-supporting foods: Spinach, Arugula, Garlic, Dark Chocolate.',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10'
    }
];

export default function NutritionPage() {
    const [search, setSearch] = useState('');

    const filtered = PROTOCOLS.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.text.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 pb-10">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                    Vascularity & Fuel
                </h1>
                <p className="text-zinc-400 text-sm">
                    Optimize blood flow. Feed the frame.
                </p>
            </header>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search protocols..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-blue transition-colors"
                />
            </div>

            <section>
                <h2 className="text-lg font-semibold text-neon-blue mb-4">Performance Bio-hacks</h2>
                <div className="grid gap-4">
                    {filtered.map((item, i) => (
                        <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                            <span className={`text-xs font-bold ${item.color} ${item.bg} px-2 py-0.5 rounded-full uppercase mb-2 inline-block`}>
                                {item.category}
                            </span>
                            <h3 className="text-white font-bold text-lg">{item.title}</h3>
                            <p className="text-zinc-400 mt-1 text-sm">{item.text}</p>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <p className="text-center text-zinc-500 py-8">No protocols found.</p>
                    )}
                </div>
            </section>

            <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
                <h3 className="text-orange-500 font-bold mb-1">Warning: Overtraining</h3>
                <p className="text-sm text-orange-200/70">
                    If your resting heart rate increases by more than 5 bpm or your grip strength declines, take a mandatory rest day.
                </p>
            </div>
        </div>
    );
}
