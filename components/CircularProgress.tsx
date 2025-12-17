'use client';

import { cn } from "@/lib/utils";

interface CircularProgressProps {
    progress: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    label?: string;
    subLabel?: string;
    color?: string;
}

export function CircularProgress({
    progress,
    size = 200,
    strokeWidth = 15,
    label,
    subLabel,
    color = "text-neon-green" // Default color class
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    const isHex = color.startsWith('#');

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90 w-full h-full"
                width={size}
                height={size}
            >
                <circle
                    className="text-zinc-800"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn("transition-all duration-1000 ease-out", !isHex && color)}
                    style={isHex ? { color } : undefined}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {label && <span className="text-3xl font-bold text-white">{label}</span>}
                {subLabel && <span className="text-sm text-zinc-400">{subLabel}</span>}
            </div>
        </div>
    );
}
