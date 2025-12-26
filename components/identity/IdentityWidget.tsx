'use client';
import { useEffect, useState } from 'react';
import { User, Cpu, Database, Cloud, ChevronDown } from 'lucide-react';
import { AVATARS } from '@/utils/careerEngine';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { sfx } from '@/utils/soundFX';

export default function IdentityWidget() {
    const router = useRouter();
    const [identity, setIdentity] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('skillforge_identity');
        if (stored) {
            setIdentity(JSON.parse(stored));
        }
    }, []);

    if (!identity) return null;

    const avatar = AVATARS[identity.avatar];
    // Fallback if avatar definition is missing (e.g. key mismatch after rename)
    if (!avatar) return null;

    const Icon = identity.avatar === 'artisan' ? User :
        identity.avatar === 'coder' ? Cpu :
            identity.avatar === 'oracle' ? Database : Cloud;

    // Get dynamic rank or fallback to avatar name
    const rank = typeof window !== 'undefined' ? localStorage.getItem('skillforge_identity_type') : null;
    const rankTitle = rank || avatar.name;

    return (
        <button
            onClick={() => {
                sfx.play('click');
                router.push('/onboarding');
            }}
            className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 pr-4 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group z-[70]"
            title="Update Identity"
        >
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border transition-all group-hover:scale-105",
                `bg-${avatar.colors.primary}/20 border-${avatar.colors.primary} shadow-[0_0_10px_rgba(var(--${avatar.colors.primary}-rgb),0.3)]`
            )}>
                <Icon className={cn("w-5 h-5", `text-${avatar.colors.primary}`)} />
            </div>

            <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-neon-cyan transition-colors flex items-center gap-1">
                    {identity.name} <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className={cn("text-[10px] font-mono whitespace-nowrap", `text-${avatar.colors.primary}`)}>
                    LVL {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('skillforge_completed_nodes') || '[]').length : '0'} • {rankTitle}
                </span>
            </div>
        </button>
    );
}
