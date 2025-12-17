'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, Salad, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Workout', href: '/', icon: Dumbbell },
        { name: 'Nutrition', href: '/nutrition', icon: Salad },
        { name: 'Progress', href: '/progress', icon: TrendingUp },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/90 p-4 pb-8 backdrop-blur-md safe-area-pb">
            <div className="mx-auto flex max-w-md justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-colors",
                                isActive ? "text-neon-blue" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
