'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface CameraMirrorProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CameraMirror({ isOpen, onClose }: CameraMirrorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen]);

    const startCamera = async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl">
                <div className="relative aspect-[9/16] bg-black">
                    {/* Video Feed */}
                    {error ? (
                        <div className="absolute inset-0 flex items-center justify-center text-red-500 text-center p-4">
                            {error}
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover mirror-mode"  // CSS class for flipping
                            style={{ transform: 'scaleX(-1)' }} // Mirror effect
                        />
                    )}

                    {/* Frame Check Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Center Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-neon-blue/50 transform -translate-x-1/2" />

                        {/* Shoulder Level Lines (approximate) */}
                        <div className="absolute top-[30%] left-0 right-0 h-0.5 bg-neon-green/30 border-t border-dashed border-neon-green/50" />

                        {/* Head Alignment Box */}
                        <div className="absolute top-[10%] left-1/2 w-40 h-48 border-2 border-neon-blue/30 rounded-full transform -translate-x-1/2" />

                        <div className="absolute bottom-8 left-0 right-0 text-center">
                            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border border-white/10">
                                Frame Check Mode
                            </span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                        onClick={() => { stopCamera(); startCamera(); }}
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 backdrop-blur-sm"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 backdrop-blur-sm"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
