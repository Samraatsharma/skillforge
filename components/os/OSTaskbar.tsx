'use client';
import { useState, useEffect } from 'react';
import { Home, Grid, User, Settings, Volume2, VolumeX } from 'lucide-react';
import { sfx } from '@/utils/soundFX';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function OSTaskbar() {
    const router = useRouter();
    const [muted, setMuted] = useState(false);
    const [time, setTime] = useState('');

    useEffect(() => {
        // Hydration safe sound check
        setMuted(sfx.isMuted());
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleSound = () => {
        const isMuted = sfx.toggleMute();
        setMuted(isMuted);
    };

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 flex items-center gap-2 shadow-2xl z-[70] hover:scale-[1.02] transition-transform duration-300">
            {/* Start Button */}
            <button
                onClick={() => router.push('/')}
                className="p-3 rounded-full hover:bg-white/10 transition-colors group"
                title="System Home"
            >
                <Home className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-2" />

            {/* Apps */}
            <div className="flex gap-2">
                <TaskbarItem icon={Grid} label="Dashboard" active />
                <TaskbarItem icon={User} label="Profile" />
                <TaskbarItem icon={Settings} label="Settings" />
            </div>

            <div className="w-px h-8 bg-white/10 mx-2" />

            {/* System Tray */}
            <div className="flex items-center gap-4 pl-2">
                <button
                    onClick={toggleSound}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-white font-mono">{time}</span>
                    <span className="text-[10px] text-neon-cyan font-mono">SYS.ONLINE</span>
                </div>
            </div>
        </div>
    );
}

function TaskbarItem({ icon: Icon, label, active }: any) {
    return (
        <button
            onMouseEnter={() => sfx.play('hover')}
            onClick={() => sfx.play('click')}
            className={cn(
                "p-3 rounded-xl transition-all duration-300 relative group",
                active ? "bg-white/10" : "hover:bg-white/5"
            )}
        >
            <Icon className={cn("w-5 h-5 transition-colors", active ? "text-neon-purple" : "text-gray-400 group-hover:text-white")} />
            {active && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-neon-purple rounded-full" />}

            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
            </span>
        </button>
    )
}
