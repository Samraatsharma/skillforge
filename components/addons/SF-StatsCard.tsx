import { useEffect, useState } from 'react';
import { Trophy, Flame, Target } from 'lucide-react';
import { getStats, RANKS, Rank } from '@/lib/gamification';
import { cn } from '@/lib/utils';

export default function SFStatsCard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        setStats(getStats());
    }, []);

    if (!stats) return null;

    const rankInfo = RANKS.find(r => r.name === stats.rank) || RANKS[0];
    const nextRank = RANKS.find(r => r.minXP > stats.xp) || RANKS[RANKS.length - 1];

    // Progress to next rank
    const progress = Math.min(100, (stats.xp / nextRank.minXP) * 100);

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Rank Card */}
            <div className="col-span-3 md:col-span-1 bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className={cn("absolute inset-0 opacity-10 blur-xl transition-opacity group-hover:opacity-20", rankInfo.color.replace('text-', 'bg-'))} />
                <Trophy className={cn("w-8 h-8 mb-2", rankInfo.color)} />
                <h3 className={cn("text-lg font-black uppercase", rankInfo.color)}>{stats.rank}</h3>
                <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", rankInfo.color.replace('text-', 'bg-'))} style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-1">{stats.xp} / {nextRank.minXP} XP</p>
            </div>

            {/* Streak */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500 mb-1 animate-pulse" />
                <span className="text-2xl font-bold text-white">{stats.streak}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Day Streak</span>
            </div>

            {/* Career Score */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                <Target className="w-6 h-6 text-neon-cyan mb-1" />
                <span className="text-2xl font-bold text-white">{stats.careerScore}%</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Readiness</span>
            </div>
        </div>
    );
}
