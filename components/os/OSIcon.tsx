'use client';
import { sfx } from '@/utils/soundFX';
import { cn } from '@/lib/utils';

interface OSIconProps {
    label: string;
    icon: any;
    onClick: () => void;
    color?: string;
}

export default function OSIcon({ label, icon: Icon, onClick, color = "text-white" }: OSIconProps) {
    return (
        <button
            onClick={() => {
                sfx.play('open');
                onClick();
            }}
            onMouseEnter={() => sfx.play('hover')}
            className="group flex flex-col items-center gap-2 w-24 p-2 rounded-xl hover:bg-white/5 transition-all active:scale-95"
        >
            <div className={cn(
                "w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                `group-hover:shadow-[0_0_20px_rgba(var(--${color}-rgb),0.4)]`
            )}>
                <Icon className={cn("w-7 h-7", color)} />
            </div>
            <span className="text-xs font-mono font-medium text-gray-300 bg-black/50 px-2 py-0.5 rounded shadow-sm group-hover:text-white transition-colors">
                {label}
            </span>
        </button>
    );
}
