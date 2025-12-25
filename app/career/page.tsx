'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code, Database, Layers, Shield, Terminal, Cpu, PenTool, Globe, Server, Cloud, Smartphone, Brain, Box, LayoutGrid, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import SFDockMagnify from '@/components/effects/SF-Dock-Magnify';

// 1. Expanded Career List (15 items)
const careers = [
    { id: 'frontend', title: 'Frontend Architect', icon: Layers, color: 'text-neon-cyan', border: 'border-neon-cyan/50', keywords: ['react', 'css', 'design', 'ui', 'ux'] },
    { id: 'backend', title: 'Backend Engineer', icon: Database, color: 'text-neon-purple', border: 'border-neon-purple/50', keywords: ['java', 'node', 'db', 'api', 'server'] },
    { id: 'fullstack', title: 'Full Stack Operator', icon: Code, color: 'text-neon-pink', border: 'border-neon-pink/50', keywords: ['react', 'node', 'full', 'stack'] },
    { id: 'devops', title: 'DevOps Engineer', icon: Terminal, color: 'text-yellow-400', border: 'border-yellow-400/50', keywords: ['aws', 'docker', 'kube', 'ci/cd'] },
    { id: 'security', title: 'Cyber Security Analyst', icon: Shield, color: 'text-neon-green', border: 'border-neon-green/50', keywords: ['cyber', 'security', 'hack', 'penetration'] },

    // New Roles
    { id: 'ai-ml', title: 'AI/ML Engineer', icon: Brain, color: 'text-rose-500', border: 'border-rose-500/50', keywords: ['python', 'ai', 'ml', 'tensor', 'pytorch'] },
    { id: 'mobile', title: 'Mobile Developer', icon: Smartphone, color: 'text-blue-400', border: 'border-blue-400/50', keywords: ['ios', 'android', 'swift', 'flutter', 'react native'] },
    { id: 'cloud', title: 'Cloud Architect', icon: Cloud, color: 'text-sky-300', border: 'border-sky-300/50', keywords: ['aws', 'azure', 'gcp', 'cloud'] },
    { id: 'data', title: 'Data Scientist', icon: Server, color: 'text-emerald-400', border: 'border-emerald-400/50', keywords: ['data', 'sql', 'python', 'analytics'] },
    { id: 'game', title: 'Game Developer', icon: Box, color: 'text-orange-500', border: 'border-orange-500/50', keywords: ['unity', 'unreal', 'c++', 'c#', 'game'] },

    { id: 'blockchain', title: 'Blockchain Dev', icon: LinkIcon, color: 'text-indigo-400', border: 'border-indigo-400/50', keywords: ['solidity', 'web3', 'crypto', 'blockchain'] },
    { id: 'ux', title: 'UX/UI Designer', icon: PenTool, color: 'text-pink-300', border: 'border-pink-300/50', keywords: ['figma', 'design', 'ux', 'ui', 'adobe'] },
    { id: 'embedded', title: 'Embedded Systems', icon: Cpu, color: 'text-slate-400', border: 'border-slate-400/50', keywords: ['c', 'embedded', 'iot', 'hardware'] },
    { id: 'web3', title: 'Web3 Engineer', icon: Globe, color: 'text-violet-400', border: 'border-violet-400/50', keywords: ['web3', 'ethereum', 'smart contracts'] },
    { id: 'pm', title: 'Product Manager', icon: LayoutGrid, color: 'text-teal-400', border: 'border-teal-400/50', keywords: ['product', 'agile', 'scrum', 'management'] },

    // Non-Technical / Content Roles
    { id: 'tech-writer', title: 'Technical Writer', icon: PenTool, color: 'text-lime-400', border: 'border-lime-400/50', keywords: ['content', 'writing', 'write', 'writer', 'documentation', 'seo', 'blog', 'copy', 'editing', 'english', 'communications', 'journalism', 'marketing', 'social media', 'creative'] },
    { id: 'da', title: 'Data Analyst', icon: Layers, color: 'text-indigo-400', border: 'border-indigo-400/50', keywords: ['sql', 'excel', 'tableau', 'powerbi'] },
    { id: 'qa', title: 'QA Engineer', icon: Shield, color: 'text-orange-400', border: 'border-orange-400/50', keywords: ['testing', 'selenium', 'cypress', 'manual'] },
    { id: 'sys-admin', title: 'System Admin', icon: Server, color: 'text-gray-400', border: 'border-gray-400/50', keywords: ['linux', 'bash', 'support', 'network'] },
    { id: 'marketing', title: 'Digital Marketer', icon: Globe, color: 'text-pink-500', border: 'border-pink-500/50', keywords: ['seo', 'sem', 'ads', 'social'] },
    { id: 'sales', title: 'Tech Sales Rep', icon: Box, color: 'text-green-500', border: 'border-green-500/50', keywords: ['sales', 'crm', 'communication', 'negotiation'] },
];

export default function CareerPage() {
    const [recommendedId, setRecommendedId] = useState<string | null>(null);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customRole, setCustomRole] = useState('');

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customRole.trim()) return;
        if (typeof window !== 'undefined') localStorage.setItem('skillforge_role', customRole);
        window.location.href = `/processing`;
    };

    useEffect(() => {
        // 2. Simple Recommendation Engine
        const rawData = typeof window !== 'undefined' ? localStorage.getItem('skillforge_user_data') || '' : '';
        let userKeywords = '';

        try {
            // Extract text for keyword matching
            if (rawData.startsWith('{')) {
                const parsed = JSON.parse(rawData);
                // Combine all text sources
                userKeywords = ((parsed.analysis?.mastered?.join(' ') || '') + ' ' + (parsed.text || '')).toLowerCase();
            } else {
                userKeywords = rawData.toLowerCase();
            }
        } catch (e) { userKeywords = rawData.toLowerCase(); }

        if (userKeywords.length > 3) {
            let maxScore = 0;
            let bestMatchId = '';

            careers.forEach(career => {
                let score = 0;
                career.keywords.forEach(kw => {
                    if (userKeywords.includes(kw)) score++;
                });

                if (score > maxScore) {
                    maxScore = score;
                    bestMatchId = career.id;
                }
            });

            if (bestMatchId && maxScore > 0) {
                console.log("Best match:", bestMatchId, "Score:", maxScore);
                setRecommendedId(bestMatchId);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-8 relative overflow-y-auto">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-purple/10 via-background to-background opacity-50 pointer-events-none" />

            <div className="z-10 w-full max-w-6xl mt-12 mb-24">
                <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center text-glow">SELECT TARGET PROTOCOL</h1>
                <p className="text-gray-500 text-center mb-12 font-mono">CHOOSE YOUR SPECIALIZATION PATH</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {careers.map((career) => (
                        <div
                            key={career.id}
                            onClick={() => {
                                if (typeof window !== 'undefined') localStorage.setItem('skillforge_role', career.id);
                                window.location.href = `/processing`;
                            }}
                            className={cn(
                                "group relative flex items-center gap-4 p-6 rounded-xl glass-panel transition-all duration-300 hover:scale-[1.02]",
                                career.border,
                                recommendedId === career.id ? "bg-white/10 ring-2 ring-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.2)]" : "hover:bg-white/5"
                            )}
                        >
                            {/* Recommendation Badge */}
                            {recommendedId === career.id && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-cyan text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-widest shadow-lg animate-bounce">
                                    RECOMMENDED
                                </div>
                            )}

                            <div className={cn("p-3 rounded-lg bg-white/5", career.color)}>
                                {(() => { const Icon = career.icon; return <Icon className="w-8 h-8" />; })()}
                            </div>
                            <div className="flex-1">
                                <h3 className={cn("text-xl font-bold group-hover:text-white transition-colors", career.color)}>{career.title}</h3>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {career.keywords.slice(0, 3).map(k => (
                                        <span key={k} className="text-[10px] uppercase text-gray-500 bg-black/30 px-1 rounded">{k}</span>
                                    ))}
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}

                    {/* CUSTOM ROLE CARD */}
                    {!showCustomInput ? (
                        <div
                            onClick={() => setShowCustomInput(true)}
                            className="group relative flex items-center gap-4 p-6 rounded-xl glass-panel border-dashed border-2 border-gray-700 hover:border-neon-pink cursor-pointer transition-all duration-300 hover:bg-white/5"
                        >
                            <div className="p-3 rounded-lg bg-white/5 text-gray-400 group-hover:text-neon-pink">
                                <Terminal className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-400 group-hover:text-neon-pink transition-colors">Custom Protocol</h3>
                                <p className="text-xs text-gray-600 mt-1 font-mono">Input specialized role...</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-neon-pink transition-all" />
                        </div>
                    ) : (
                        <div className="relative p-6 rounded-xl glass-panel border border-neon-pink bg-black/50 shadow-[0_0_20px_rgba(255,0,128,0.2)]">
                            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4">
                                <label className="text-xs font-mono text-neon-pink">DEFINE_CUSTOM_ROLE</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full bg-black border border-white/20 rounded-lg p-3 text-white font-bold outline-none focus:border-neon-pink"
                                    placeholder="Ex: Bioinformatics Scientist"
                                    value={customRole}
                                    onChange={(e) => setCustomRole(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomInput(false)}
                                        className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 text-xs font-mono"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 rounded-lg bg-neon-pink text-black font-bold hover:bg-pink-400 text-xs font-mono"
                                    >
                                        INITIATE
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>

            {/* Bottom Dock */}
            <SFDockMagnify />
        </div>
    );
}
