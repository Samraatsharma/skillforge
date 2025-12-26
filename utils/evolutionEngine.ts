export type IdentityRank = 'Strategist' | 'Architect' | 'Visionary' | 'Oracle' |
    'Builder' | 'Engineer' | 'System Weaver' | 'Forge Master' |
    'Wanderer' | 'Seeker' | 'Pathfinder' | 'Navigator' |
    'Anchorless' | 'Restarter' | 'Resilient' | 'Phoenix' |
    'Phoenix' | 'Catalyst' | 'Vanguard' | 'Ascendant';

export interface EvolutionState {
    rank: IdentityRank;
    stage: number; // 1-4
    nextRank: IdentityRank | null;
    glowColor: string;
    description: string;
    uxModifier: 'gravity' | 'neon' | 'particles' | 'none';
    xpMultiplier: number;
}

export const EVOLUTION_CHAINS: Record<string, IdentityRank[]> = {
    Strategist: ['Strategist', 'Architect', 'Visionary', 'Oracle'],
    Builder: ['Builder', 'Engineer', 'System Weaver', 'Forge Master'],
    Wanderer: ['Wanderer', 'Seeker', 'Pathfinder', 'Navigator'],
    Phoenix: ['Phoenix', 'Catalyst', 'Vanguard', 'Ascendant'], // Merged Anchorless into Phoenix path
    Anchorless: ['Anchorless', 'Restarter', 'Resilient', 'Phoenix'] // Path to Phoenix
};

export const EVOLUTION_METADATA: Record<IdentityRank, Partial<EvolutionState>> = {
    // STRATEGIST PATH
    'Strategist': { glowColor: 'blue-500', uxModifier: 'none', xpMultiplier: 1.0 },
    'Architect': { glowColor: 'blue-400', uxModifier: 'none', xpMultiplier: 1.1 },
    'Visionary': { glowColor: 'indigo-400', uxModifier: 'gravity', xpMultiplier: 1.2 },
    'Oracle': { glowColor: 'violet-500', uxModifier: 'gravity', xpMultiplier: 1.5 },

    // BUILDER PATH
    'Builder': { glowColor: 'emerald-500', uxModifier: 'none', xpMultiplier: 1.0 },
    'Engineer': { glowColor: 'emerald-400', uxModifier: 'neon', xpMultiplier: 1.1 },
    'System Weaver': { glowColor: 'teal-400', uxModifier: 'neon', xpMultiplier: 1.25 },
    'Forge Master': { glowColor: 'cyan-400', uxModifier: 'neon', xpMultiplier: 1.5 },

    // WANDERER PATH
    'Wanderer': { glowColor: 'amber-500', uxModifier: 'none', xpMultiplier: 1.0 },
    'Seeker': { glowColor: 'amber-400', uxModifier: 'particles', xpMultiplier: 1.1 },
    'Pathfinder': { glowColor: 'orange-400', uxModifier: 'particles', xpMultiplier: 1.2 },
    'Navigator': { glowColor: 'red-400', uxModifier: 'particles', xpMultiplier: 1.4 },

    // PHOENIX PATH (Recovery)
    'Anchorless': { glowColor: 'gray-500', uxModifier: 'none', xpMultiplier: 0.8 },
    'Restarter': { glowColor: 'gray-400', uxModifier: 'none', xpMultiplier: 0.9 },
    'Resilient': { glowColor: 'rose-300', uxModifier: 'none', xpMultiplier: 1.0 },
    'Phoenix': { glowColor: 'rose-500', uxModifier: 'particles', xpMultiplier: 1.1 },
    'Catalyst': { glowColor: 'rose-600', uxModifier: 'particles', xpMultiplier: 1.2 },
    'Vanguard': { glowColor: 'fuchsia-500', uxModifier: 'particles', xpMultiplier: 1.3 },
    'Ascendant': { glowColor: 'fuchsia-400', uxModifier: 'gravity', xpMultiplier: 1.6 },
};

export function getEvolutionState(currentRank: string): EvolutionState | null {
    let foundChain: string[] | null = null;

    for (const key in EVOLUTION_CHAINS) {
        if (EVOLUTION_CHAINS[key].includes(currentRank as IdentityRank)) {
            foundChain = EVOLUTION_CHAINS[key];
            break;
        }
    }

    // Fallback if not found (e.g. legacy name)
    if (!foundChain) return null;

    const index = foundChain.indexOf(currentRank as IdentityRank);
    const meta = EVOLUTION_METADATA[currentRank as IdentityRank];

    return {
        rank: currentRank as IdentityRank,
        stage: index + 1,
        nextRank: (index < foundChain.length - 1 ? foundChain[index + 1] : null) as IdentityRank | null,
        glowColor: meta.glowColor || 'gray-500',
        description: `Stage ${index + 1} Identity Form`,
        uxModifier: meta.uxModifier as any || 'none',
        xpMultiplier: meta.xpMultiplier || 1.0
    };
}

export function checkEvolutionTrigger(currentRank: string, score: number, masteredCount: number): IdentityRank | null {
    const state = getEvolutionState(currentRank);
    if (!state || !state.nextRank) return null;

    // SIMPLE EVOLUTION LOGIC (MVP)
    // 1. Score Threshold: Needs Reality Stream score > 75 consistently
    // 2. Mastery Threshold: Needs X nodes mastered

    const requiredMastery = state.stage * 3; // 3, 6, 9...

    if (score > 70 && masteredCount >= requiredMastery) {
        return state.nextRank;
    }

    return null;
}
