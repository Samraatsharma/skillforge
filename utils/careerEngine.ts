export type AvatarArchetype = 'Frontend Developer' | 'Backend Engineer' | 'Data Scientist' | 'Cloud Architect';

interface AvatarConfig {
    id: string;
    name: AvatarArchetype;
    roleId: string; // Maps to existing app careers
    description: string;
    colors: {
        primary: string;
        accent: string;
    };
    stats: {
        creativity: number;
        logic: number;
        system: number;
    }
}

export const AVATARS: Record<string, AvatarConfig> = {
    'artisan': {
        id: 'artisan',
        name: 'Frontend Developer',
        roleId: 'frontend',
        description: '[Code: Cyber Artisan] Architect of visual realities and user interfaces.',
        colors: { primary: 'neon-cyan', accent: 'neon-pink' },
        stats: { creativity: 90, logic: 60, system: 40 }
    },
    'coder': {
        id: 'coder',
        name: 'Backend Engineer',
        roleId: 'backend',
        description: '[Code: Quantum Coder] Master of algorithms and server-side logic.',
        colors: { primary: 'neon-purple', accent: 'neon-cyan' },
        stats: { creativity: 40, logic: 95, system: 70 }
    },
    'oracle': {
        id: 'oracle',
        name: 'Data Scientist',
        roleId: 'data',
        description: '[Code: Data Oracle] Seer of patterns within the digital noise.',
        colors: { primary: 'emerald-400', accent: 'neon-purple' },
        stats: { creativity: 30, logic: 90, system: 60 }
    },
    'nexus': {
        id: 'nexus',
        name: 'Cloud Architect',
        roleId: 'cloud',
        description: '[Code: Nexus Architect] Builder of scalable, resilient cloud infrastructures.',
        colors: { primary: 'orange-400', accent: 'neon-cyan' },
        stats: { creativity: 50, logic: 70, system: 95 }
    }
};

export function getCareerScore(masteredCount: number, totalNodes: number): number {
    if (totalNodes === 0) return 0;
    return Math.round((masteredCount / totalNodes) * 100);
}

export function getNextSteps(nodes: any[]): string[] {
    return nodes
        .filter(n => n.status === 'unlocked' || n.status === 'locked')
        .slice(0, 3)
        .map(n => n.name);
}

export function calculateATSImpact(resumeScore: number): string {
    if (resumeScore > 80) return "HIGH IMPACT";
    if (resumeScore > 50) return "MODERATE";
    return "LOW VISIBILITY";
}
