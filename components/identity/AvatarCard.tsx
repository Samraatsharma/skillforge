import { cn } from '@/lib/utils';
import { User, Cpu, Database, Cloud, Zap } from 'lucide-react';
import { AVATARS, AvatarArchetype } from '@/utils/careerEngine';

interface AvatarCardProps {
    type: string;
    selected: boolean;
    onSelect: () => void;
}

export default function AvatarCard({ type, selected, onSelect }: AvatarCardProps) {
    const avatar = AVATARS[type];
    const Icon = type === 'artisan' ? User :
        type === 'coder' ? Cpu :
            type === 'oracle' ? Database : Cloud;

    return (
        <div
            onClick={onSelect}
            className={cn(
                "relative group cursor-pointer transition-all duration-500",
                selected ? "scale-105" : "hover:scale-105 opacity-60 hover:opacity-100"
            )}
        >
            {/* Holographic Border */}
            <div className={cn(
                "absolute -inset-0.5 rounded-2xl opacity-75 blur-sm transition-all duration-500",
                selected ? `bg-${avatar.colors.primary}` : "bg-transparent group-hover:bg-white/20"
            )} />

            <div className="relative h-full bg-black/90 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden">
                {/* Avatar Icon */}
                <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
                    selected ? `bg-${avatar.colors.primary}/20 shadow-[0_0_30px_rgba(var(--${avatar.colors.primary}-rgb),0.5)]` : "bg-white/5"
                )}>
                    <Icon className={cn(
                        "w-10 h-10 transition-colors duration-300",
                        selected ? `text-${avatar.colors.primary}` : "text-gray-500"
                    )} />
                </div>

                <h3 className={cn(
                    "text-lg font-bold mb-1 transition-colors",
                    selected ? "text-white" : "text-gray-400"
                )}>
                    {avatar.name}
                </h3>

                <p className="text-xs text-gray-500 font-mono mb-4 min-h-[40px]">
                    {avatar.description}
                </p>

                {/* Stat Bars */}
                <div className="w-full space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div style={{ width: `${avatar.stats.creativity}%` }} className="h-full bg-yellow-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                        <Cpu className="w-3 h-3 text-cyan-500" />
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div style={{ width: `${avatar.stats.logic}%` }} className="h-full bg-cyan-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
