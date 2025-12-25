'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SFScrambleGhostText from '@/components/effects/SF-ScrambleGhostText';

export default function ProcessingPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 5;
            });
        }, 100);

        const timeout = setTimeout(() => {
            router.push('/map');
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="text-4xl font-bold text-neon-green font-mono">
                    <SFScrambleGhostText text="DECRYPTING_DATA..." />
                </div>

                {/* Cyberpunk Progress Bar */}
                <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden border border-neon-green/30 relative">
                    <div
                        className="h-full bg-neon-green relative"
                        style={{ width: `${Math.min(100, progress)}%` }}
                    >
                        <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_1s_infinite]" />
                    </div>
                </div>

                <div className="font-mono text-neon-green/70 text-sm">
                    {Math.floor(progress)}% COMPLETE
                </div>

                <div className="space-y-2 mt-8 text-xs font-mono text-left text-gray-500 max-w-xs mx-auto">
                    <p>&gt; PARSING NEURAL NETWORKS...</p>
                    {progress > 30 && <p>&gt; IDENTIFYING SKILL CLUSTERS...</p>}
                    {progress > 60 && <p>&gt; CALCULATING JOB MATCH SCORE...</p>}
                    {progress > 90 && <p>&gt; OPTIMIZING PATHWAY...</p>}
                </div>
            </div>
        </div>
    );
}
