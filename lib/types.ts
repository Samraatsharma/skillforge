export interface SkillNode {
    id: string;
    name: string;
    category: string;
    status: 'locked' | 'unlocked' | 'mastered';
    x: number;
    y: number;
}

export interface UserProfile {
    careerGoal: string;
    skills: string[];
    resumeText?: string;
}

export interface JobMatch {
    score: number;
    missingSkills: string[];
    role: string;
}
