import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getStats } from '@/lib/gamification';

export default function SFHeatmap() {
    const [heatmap, setHeatmap] = useState<Record<string, number>>({});

    useEffect(() => {
        const stats = getStats();
        setHeatmap(stats.heatmap);
    }, []);

    // Generate last 365 days (or fewer for mobile)
    const days = Array.from({ length: 90 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (89 - i));
        return d.toISOString().split('T')[0];
    });

    return (
        <div className="p-4 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
            <h3 className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-widest">Neural Activity Pattern</h3>
            <div className="flex flex-wrap gap-1 justify-center">
                {days.map(date => {
                    const count = heatmap[date] || 0;
                    return (
                        <div
                            key={date}
                            title={`${date}: ${count} actions`}
                            className={cn(
                                "w-2 h-2 rounded-sm transition-all duration-300",
                                count === 0 ? "bg-gray-800/50" :
                                    count < 3 ? "bg-neon-purple/40" :
                                        count < 6 ? "bg-neon-purple/70 shadow-[0_0_5px_rgba(188,19,254,0.4)]" :
                                            "bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,0.6)]"
                            )}
                        />
                    );
                })}
            </div>
        </div>
    );
}
