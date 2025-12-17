'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock } from 'lucide-react';
import { Button } from './Button';

export function NotificationManager() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [reminderTime, setReminderTime] = useState('20:00');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
            const savedTime = localStorage.getItem('reminder_time');
            if (savedTime) setReminderTime(savedTime);

            const savedEnabled = localStorage.getItem('notifications_enabled');
            if (savedEnabled === 'true' && Notification.permission === 'granted') {
                setNotificationsEnabled(true);
            }
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notifications');
            return;
        }

        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
            setNotificationsEnabled(true);
            localStorage.setItem('notifications_enabled', 'true');
            // Schedule first notification simulation
            scheduleNotification(reminderTime);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = e.target.value;
        setReminderTime(time);
        localStorage.setItem('reminder_time', time);
        if (notificationsEnabled) {
            scheduleNotification(time);
        }
    };

    const scheduleNotification = (time: string) => {
        // In a real PWA/Native app, this would use the Service Worker or local notification API specific to platform.
        // For this web prototype, we'll confirm setup.
        console.log(`Notification scheduled for ${time}`);
    };

    if (permission === 'denied') {
        return (
            <div className="bg-zinc-900 border border-red-900/30 p-4 rounded-xl flex items-center gap-3 text-sm text-zinc-400">
                <BellOff className="h-5 w-5 text-red-500" />
                <span>Notifications blocked. Enable in settings for reminders.</span>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Bell className="h-4 w-4 text-neon-blue" />
                    Daily Reminders
                </h3>
                {notificationsEnabled && <span className="text-xs text-green-500 font-mono">ACTIVE</span>}
            </div>

            {!notificationsEnabled ? (
                <Button
                    variant="outline"
                    onClick={requestPermission}
                    className="w-full border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                >
                    Enable "Don't Quit" Alerts
                </Button>
            ) : (
                <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-zinc-500" />
                    <input
                        type="time"
                        value={reminderTime}
                        onChange={handleTimeChange}
                        className="bg-black border border-zinc-700 rounded px-2 py-1 text-white focus:outline-none focus:border-neon-blue w-full"
                    />
                </div>
            )}

            <p className="text-xs text-zinc-500 mt-3">
                We'll ping you at {reminderTime} if you haven't crushed your protocol yet.
            </p>
        </div>
    );
}
