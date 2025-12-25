
// Ranks based on total XP
export type Rank = 'Apprentice' | 'Journeyman' | 'Artisan' | 'Master Forger';

export const RANKS: { name: Rank; minXP: number; color: string }[] = [
    { name: 'Apprentice', minXP: 0, color: 'text-gray-400' },
    { name: 'Journeyman', minXP: 31, color: 'text-blue-400' },
    { name: 'Artisan', minXP: 71, color: 'text-purple-400' },
    { name: 'Master Forger', minXP: 121, color: 'text-amber-400' }
];

export interface UserStats {
    xp: number;
    rank: Rank;
    streak: number;
    lastActive: string | null; // ISO Date
    careerScore: number;
    skillsMastered: number;
    heatmap: Record<string, number>; // "YYYY-MM-DD": count
}

const STORAGE_KEY = 'skillforge_stats';

// Initialize or Get Stats
export const getStats = (): UserStats => {
    if (typeof window === 'undefined') return emptyStats();

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        const initial = emptyStats();
        saveStats(initial);
        return initial;
    }
    return JSON.parse(raw);
};

const emptyStats = (): UserStats => ({
    xp: 0,
    rank: 'Apprentice',
    streak: 0,
    lastActive: null,
    careerScore: 0,
    skillsMastered: 0,
    heatmap: {}
});

const saveStats = (stats: UserStats) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
};

// Actions
export const addXP = (amount: number) => {
    const stats = getStats();
    stats.xp += amount;

    // Update Rank
    const newRank = RANKS.slice().reverse().find(r => stats.xp >= r.minXP)?.name || 'Apprentice';
    stats.rank = newRank;

    // Update Heatmap & Streak
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastActive !== today) {
        // Simple streak logic: if lastActive was yesterday, +1. Else 1.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (stats.lastActive === yesterdayStr) {
            stats.streak += 1;
        } else {
            stats.streak = 1;
        }
        stats.lastActive = today;
    }
    stats.heatmap[today] = (stats.heatmap[today] || 0) + 1;

    // Recalculate Career Score (Simple heuristic: (Mastered * 5) + (XP * 0.5) capped at 100)
    // Actually user simplified: XP is derived from tasks. Career score can be distinct or same.
    // Let's make career score = skills mastered / total skills * 100 roughly.
    // For now, let's just increment it slowly with XP.
    stats.careerScore = Math.min(100, Math.floor(stats.xp / 2)); // Example logic

    saveStats(stats);
    return stats;
};

export const onSkillMastered = () => {
    const stats = getStats();
    stats.skillsMastered += 1;
    saveStats(stats);
    return addXP(10); // +10 XP per skill
};
