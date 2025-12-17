import { LucideIcon, Dumbbell, Activity, Heart, Hand, Zap } from 'lucide-react';

export interface Exercise {
    id: string;
    title: string;
    reps: string;
    description: string;
    technicalCue: string;
    type: 'reps' | 'time' | 'hold';
    durationSeconds?: number;
}

export interface Workout {
    id: string;
    title: string;
    description: string;
    exercises: Exercise[];
}

export const EXERCISES: Record<string, Exercise> = {
    maxHoldKegels: {
        id: 'maxHoldKegels',
        title: 'Max-Hold Kegels',
        reps: '3x10 (5s hold)',
        description: 'Squeeze and hold the pelvic floor muscles.',
        technicalCue: 'Focus on the perineum. Squeeze as if lifting an object. Maintain deep nasal breathing.',
        type: 'hold',
        durationSeconds: 5,
    },
    rapidFireSqueezes: {
        id: 'rapidFireSqueezes',
        title: 'Rapid-Fire Squeezes',
        reps: '30s',
        description: 'Quick, rhythmic contractions.',
        technicalCue: 'Pulse quickly. Do not sacrifice quality for speed.',
        type: 'time',
        durationSeconds: 30,
    },
    weightedTilts: {
        id: 'weightedTilts',
        title: 'Weighted Pelvic Tilts',
        reps: '3x10',
        description: 'Lying on back, tilt pelvis up with weight.',
        technicalCue: 'Drive through heels. Squeeze glutes at top. Weight sits on pubic bone.',
        type: 'reps',
    },
    wallSlides: {
        id: 'wallSlides',
        title: 'Iron Cross Wall Slides',
        reps: '3x15',
        description: 'Back against wall, arms in W shape sliding to Y.',
        technicalCue: 'Slow is smooth. Keep chin tucked. If elbows leave wall, reset.',
        type: 'reps',
    },
    superman: {
        id: 'superman',
        title: 'Superman Holds',
        reps: '60s',
        description: 'Lift chest and legs while lying face down.',
        technicalCue: 'Gaze down at floor. Think "length" from fingers to toes.',
        type: 'hold',
        durationSeconds: 60,
    },
    doorwayRows: {
        id: 'doorwayRows',
        title: 'Doorway Rows',
        reps: '3x12',
        description: 'Lean back holding door frame, pull self up.',
        technicalCue: 'Pinch shoulder blades together at the top.',
        type: 'reps',
    },
    towelWring: {
        id: 'towelWring',
        title: 'The Towel Wring',
        reps: '60s',
        description: 'Twist a towel aggressively.',
        technicalCue: 'Explosive movement. Change direction every 10s. Focus on forearm burn.',
        type: 'time',
        durationSeconds: 60,
    },
    fingertipPushups: {
        id: 'fingertipPushups',
        title: 'Fingertip Push-ups',
        reps: '3x10',
        description: 'Push-ups on fingertips.',
        technicalCue: 'Spread fingers wide. stiffen the claw.',
        type: 'reps',
    },
    deadHang: {
        id: 'deadHang',
        title: 'Dead Hangs',
        reps: 'Max holds',
        description: 'Hang from a bar.',
        technicalCue: 'Pack shoulders down (don\'t let them shrug to ears).',
        type: 'hold',
        durationSeconds: 60, // default target
    },
    happyBaby: {
        id: 'happyBaby',
        title: 'Happy Baby Pose',
        reps: '60s',
        description: 'Lie on back, grab feet, open hips.',
        technicalCue: 'Relax into the stretch. Deep belly breathing.',
        type: 'hold',
        durationSeconds: 60,
    },
    legsUpWall: {
        id: 'legsUpWall',
        title: 'Legs-Up-The-Wall',
        reps: '5-10 min',
        description: 'Lie on back with legs vertical against wall.',
        technicalCue: 'Focus on lymphatic drainage and nervous system reset.',
        type: 'time',
        durationSeconds: 300,
    },
};

const CIRCUIT_FULL = [
    EXERCISES.maxHoldKegels,
    EXERCISES.rapidFireSqueezes,
    EXERCISES.weightedTilts,
    EXERCISES.wallSlides,
    EXERCISES.superman,
    EXERCISES.doorwayRows,
    EXERCISES.fingertipPushups,
    EXERCISES.towelWring,
    EXERCISES.deadHang,
    EXERCISES.happyBaby,
    EXERCISES.legsUpWall
];

const CIRCUIT_FLOW_CARDIO = [
    EXERCISES.maxHoldKegels,
    EXERCISES.happyBaby,
    // Cardio implied (HIIT timer feature) - listing exercises for checklist
    EXERCISES.rapidFireSqueezes,
];

const CIRCUIT_FRAME = [
    EXERCISES.wallSlides,
    EXERCISES.superman,
    EXERCISES.towelWring,
    EXERCISES.deadHang,
    EXERCISES.doorwayRows,
];

const CIRCUIT_REST = [
    EXERCISES.legsUpWall,
];

export function getDailyWorkout(date: Date = new Date()): Workout {
    const day = date.getDay(); // 0 is Sunday

    // Logic:
    // Mon(1), Wed(3), Fri(5): Full Circuit
    // Tue(2), Thu(4): Flow & Cardio
    // Sat(6): Grip & Posture (Frame)
    // Sun(0): Rest

    if (day === 1 || day === 3 || day === 5) {
        return {
            id: 'high-intensity',
            title: 'High-Intensity Circuit',
            description: 'Full body protocol: Pelvic, Frame, Grip.',
            exercises: CIRCUIT_FULL,
        };
    } else if (day === 2 || day === 4) {
        return {
            id: 'flow-cardio',
            title: 'Flow & Cardio',
            description: 'Pelvic health and cardiovascular system focus.',
            exercises: CIRCUIT_FLOW_CARDIO,
        };
    } else if (day === 6) {
        return {
            id: 'the-frame',
            title: 'The Frame',
            description: 'Posture and grip strength focus.',
            exercises: CIRCUIT_FRAME,
        };
    } else {
        // Sunday
        return {
            id: 'active-recovery',
            title: 'Active Recovery',
            description: 'Rest and reset.',
            exercises: CIRCUIT_REST,
        };
    }
}
