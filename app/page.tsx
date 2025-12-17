'use client';

import { useState, useEffect } from 'react';
import { getDailyWorkout, Exercise } from '@/lib/workoutData';
import { ExerciseCard } from '@/components/ExerciseCard';
import { CircularProgress } from '@/components/CircularProgress';
import { AdvancedTimer } from '@/components/AdvancedTimer';
import { useWorkoutProgress } from '@/hooks/useWorkoutProgress';
import { Flame, Trophy } from 'lucide-react';
import { FinisherModal } from '@/components/FinisherModal';
import { NotificationManager } from '@/components/NotificationManager';
import { ReadinessSurvey } from '@/components/ReadinessSurvey';

export default function Home() {
  const [workout, setWorkout] = useState(getDailyWorkout());
  const {
    completedExercises,
    toggleExercise,
    progressPercentage,
    streak,
    logWorkout,
    isWorkoutLogged,
    loading
  } = useWorkoutProgress(workout.exercises.length);

  const [timerState, setTimerState] = useState<{
    isOpen: boolean;
    type: 'standard' | 'pelvic-powerhouse';
    duration: number;
  }>({ isOpen: false, type: 'standard', duration: 60 });

  const [finisherOpen, setFinisherOpen] = useState(false);

  // Gamification: Streak Multiplier
  const isEliteStreak = streak >= 10;
  const streakColor = isEliteStreak ? 'text-yellow-400' : 'text-orange-500';
  const streakBg = isEliteStreak ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-zinc-900 border-zinc-800';

  // Update workout if day changes (client-side check)
  useEffect(() => {
    setWorkout(getDailyWorkout());
  }, []);

  const handleStartTimer = (exercise: Exercise) => {
    if (exercise.id === 'maxHoldKegels' || exercise.id === 'rapidFireSqueezes') {
      setTimerState({
        isOpen: true,
        type: 'pelvic-powerhouse',
        duration: 0 // Ignored for pelvic type
      });
    } else {
      setTimerState({
        isOpen: true,
        type: 'standard',
        duration: exercise.durationSeconds || 60
      });
    }
  };

  const handleReadiness = (score: number) => {
    // If score is 1 (Recovery Needed), maybe adjust workout?
    // For now, just logging it or showing a message could be enough.
    if (score === 1) {
      alert("Recovery Mode Suggested: Focus on deep breathing and light stretching today.");
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading protocol...</div>;

  return (
    <div className="flex flex-col gap-8 pb-10">
      <ReadinessSurvey onComplete={handleReadiness} />

      <AdvancedTimer
        isOpen={timerState.isOpen}
        onClose={() => setTimerState({ ...timerState, isOpen: false })}
        type={timerState.type}
        duration={timerState.duration}
        onComplete={() => {
          // Optional: Auto-mark exercise as complete? Setting logic aside for user preference.
        }}
      />

      <FinisherModal isOpen={finisherOpen} onClose={() => setFinisherOpen(false)} />

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Daily Protocol
          </h1>
          <p className="text-zinc-400 text-sm">
            {workout.title}
          </p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors ${streakBg}`}>
          <Flame className={`h-4 w-4 ${streakColor} fill-current`} />
          <span className={`text-sm font-bold ${isEliteStreak ? 'text-yellow-400' : 'text-white'}`}>{streak}</span>
        </div>
      </header>

      {/* Persistence Module: Notifications */}
      <NotificationManager />

      <div className="flex justify-center py-4">
        <CircularProgress
          progress={progressPercentage}
          size={220}
          strokeWidth={12}
          label={`${progressPercentage}%`}
          subLabel="COMPLETED"
          color={isEliteStreak ? '#fbbf24' : undefined} // Yellow for elite
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neon-blue">Mission Objectives</h2>
          <span className="text-xs text-zinc-500 uppercase tracking-wider">{workout.exercises.length} Exercises</span>
        </div>

        <div className="flex flex-col gap-3">
          {workout.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isCompleted={!!completedExercises[exercise.id]}
              onToggle={() => toggleExercise(exercise.id)}
              onStartTimer={() => handleStartTimer(exercise)}
            />
          ))}
        </div>
      </div>

      {progressPercentage === 100 && !isWorkoutLogged && (
        <div className="space-y-3">
          <button
            onClick={() => setFinisherOpen(true)}
            className="w-full bg-zinc-800 border-2 border-dashed border-zinc-700 text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-800/80 hover:border-zinc-500 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
          >
            <Flame className="h-4 w-4" />
            Unleash The Finisher
          </button>

          <button
            onClick={logWorkout}
            className="w-full bg-neon-green text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.3)] animate-pulse hover:scale-[1.02] transition-transform"
          >
            LOG WORKOUT & EXTEND STREAK
          </button>
        </div>
      )}

      {isWorkoutLogged && (
        <div className="w-full bg-zinc-900 border border-zinc-800 text-center py-4 rounded-xl">
          <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-white font-bold">Workout Logged!</p>
          <p className="text-sm text-zinc-500">Rest up for tomorrow.</p>
        </div>
      )}
    </div>
  );
}
