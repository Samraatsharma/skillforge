'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Lock, ChevronRight, AlertCircle, Play, ArrowRight, LayoutDashboard, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import SFDockMagnify from '@/components/effects/SF-Dock-Magnify';
import SFScrambleGhostText from '@/components/effects/SF-ScrambleGhostText';
import SFScrollDrift from '@/components/effects/SF-Scroll-Drift';
import SFHeatmap from '@/components/addons/SF-Heatmap';
import SFStatsCard from '@/components/addons/SF-StatsCard';
import SFMentor from '@/components/addons/SF-Mentor';
import SFPortfolioGen from '@/components/addons/SF-PortfolioGen';
import SFATSAnalyzer from '@/components/addons/SF-ATSAnalyzer';
import SFAchievementCard from '@/components/addons/SF-AchievementCard';
import { onSkillMastered } from '@/lib/gamification';
import OSWindow from '@/components/os/OSWindow';
import OSIcon from '@/components/os/OSIcon';
import OSTaskbar from '@/components/os/OSTaskbar';
import IdentityWidget from '@/components/identity/IdentityWidget';
import { sfx } from '@/utils/soundFX';
import { useRouter } from 'next/navigation';
import { Briefcase, Activity } from 'lucide-react';
import RealityStream from '@/components/RealityStreams/RealityStream';
import EvolutionOverlay from '@/components/identity/EvolutionOverlay';

interface SkillNode {
    id: string;
    name: string;
    status: 'locked' | 'unlocked' | 'mastered';
    description?: string;
}

// Extended Database for Infinite Generation
const EXTENDED_SKILL_DB = [
    'React', 'TypeScript', 'Next.js', 'Tailwind',
    'Node.js', 'Python', 'Go', 'Rust',
    'Docker', 'Kubernetes', 'AWS', 'Terraform',
    'GraphQL', 'PostgreSQL', 'Redis', 'Kafka',
    'System Design', 'Microservices', 'CI/CD', 'Testing',
    'Algorithms', 'Data Structures', 'Security', 'Auth',
    'Performance', 'Accessibility', 'SEO', 'Analytics'
];

export default function MapPage() {
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
    const [nodes, setNodes] = useState<SkillNode[]>([]);
    const [matchScore, setMatchScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showDashboard, setShowDashboard] = useState(false);
    const [showMentor, setShowMentor] = useState(false);
    const [statsTick, setStatsTick] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Evolution Listener
    const [evolutionEvent, setEvolutionEvent] = useState<any>(null);
    const [identityRank, setIdentityRank] = useState('Wanderer');

    // Check Rank for UX Modifiers
    useEffect(() => {
        const updateState = () => {
            const evt = localStorage.getItem('skillforge_evolution_event');
            if (evt) {
                setEvolutionEvent(JSON.parse(evt));
                localStorage.removeItem('skillforge_evolution_event'); // Consume
            }
            setIdentityRank(localStorage.getItem('skillforge_identity_type') || 'Wanderer');
        };

        window.addEventListener('storage', updateState);
        const interval = setInterval(updateState, 1000); // Poll as backup
        return () => {
            window.removeEventListener('storage', updateState);
            clearInterval(interval);
        };
    }, []);

    // Load and Generate Map
    useEffect(() => {
        const loadMap = async () => {
            const rawData = typeof window !== 'undefined' ? localStorage.getItem('skillforge_user_data') || '' : '';
            const completedIds = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('skillforge_completed_nodes') || '[]') : [];
            const role = typeof window !== 'undefined' ? localStorage.getItem('skillforge_role') : null;

            let aiData: any = null;
            let manualText = '';

            try {
                if (rawData.startsWith('{')) {
                    const parsed = JSON.parse(rawData);
                    if (parsed.analysis) aiData = parsed.analysis;
                    else if (parsed.text) manualText = parsed.text;
                } else {
                    manualText = rawData;
                }
            } catch (e) {
                manualText = rawData;
            }

            let rawSkillList: string[] = [];

            if (role) {
                try {
                    const res = await fetch('/api/roadmap', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.roadmap && Array.isArray(data.roadmap)) {
                            rawSkillList = data.roadmap;
                        }
                    }
                } catch (err) {
                    console.error("Roadmap fetch failed", err);
                }
            }

            if (rawSkillList.length === 0) {
                if (aiData) {
                    setMatchScore(aiData.match_score || 75);
                    const m = aiData.mastered || [];
                    const u = aiData.unlocked || [];
                    const l = aiData.locked || [];
                    rawSkillList = [...m, ...u, ...l];
                } else if (manualText.length > 10) {
                    setMatchScore(40);
                    rawSkillList = EXTENDED_SKILL_DB.slice(0, 15);
                } else {
                    rawSkillList = EXTENDED_SKILL_DB.slice(0, 10);
                }
            }

            rawSkillList = Array.from(new Set(rawSkillList));
            if (rawSkillList.length < 5) rawSkillList = [...rawSkillList, ...EXTENDED_SKILL_DB.slice(0, 10)];

            const generatedNodes: SkillNode[] = rawSkillList.map((skill, index) => {
                const nodeId = `skill-${index}`;
                const isCompleted = completedIds.includes(nodeId);
                let status: SkillNode['status'] = 'locked';

                if (isCompleted) {
                    status = 'mastered';
                } else {
                    const prevId = `skill-${index - 1}`;
                    const prevWasCompleted = index === 0 || completedIds.includes(prevId);
                    if (prevWasCompleted) {
                        status = 'unlocked';
                    }
                }

                return {
                    id: nodeId,
                    name: skill,
                    status,
                    description: status === 'mastered' ? 'Competency verified.' : 'Core protocol module. Complete to proceed.'
                };
            });

            setNodes(generatedNodes);
            setLoading(false);
        };

        loadMap();
    }, []);

    const completeLevel = (node: SkillNode) => {
        if (node.status === 'locked') return;

        window.open(`https://www.google.com/search?q=learn+${node.name}+interactive+tutorial`, '_blank');

        const updatedNodes = nodes.map(n => {
            if (n.id === node.id) return { ...n, status: 'mastered' as const };
            return n;
        });

        const currentIndex = nodes.findIndex(n => n.id === node.id);
        if (currentIndex < nodes.length - 1) {
            updatedNodes[currentIndex + 1].status = 'unlocked';
        }

        setNodes(updatedNodes);
        setSelectedNode(null);

        const newCompletedId = node.id;
        const currentCompleted = JSON.parse(localStorage.getItem('skillforge_completed_nodes') || '[]');
        if (!currentCompleted.includes(newCompletedId)) {
            localStorage.setItem('skillforge_completed_nodes', JSON.stringify([...currentCompleted, newCompletedId]));
            onSkillMastered();

            const masteredCount = updatedNodes.filter(n => n.status === 'mastered').length;
            const total = updatedNodes.length;
            const newScore = Math.round((masteredCount / total) * 100);
            setMatchScore(newScore);

            setStatsTick(prev => prev + 1);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-cyan/20 via-black to-black opacity-40 animate-pulse" />
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-neon-cyan/30 rounded-full animate-ping" />
                <div className="absolute inset-2 border-4 border-t-neon-cyan border-r-neon-purple border-b-neon-pink border-l-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white animate-bounce" />
                </div>
            </div>
            <div className="space-y-2 text-center z-10">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple animate-pulse">
                    CONSTRUCTING NEURAL PATHWAY
                </h2>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-mono text-neon-cyan/70">
                        Analyzing: {typeof window !== 'undefined' ? localStorage.getItem('skillforge_role') || 'PROTOCOL' : 'PROTOCOL'}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 animate-pulse">
                        [||||||||||||||||||||] PROCESSING
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={scrollContainerRef} className={cn(
            "min-h-[200vh] bg-black text-white relative overflow-hidden font-sans selection:bg-neon-cyan/30 selection:text-neon-cyan",
            // UX MODIFIERS BASED ON RANK
            identityRank === 'Ascendant' && "cursor-crosshair",
            identityRank === 'System Weaver' && "[&_.skill-node-line]:animate-pulse"
        )}>

            {/* Evolution Overlay */}
            {evolutionEvent && (
                <EvolutionOverlay
                    prevRank={evolutionEvent.from}
                    newRank={evolutionEvent.to}
                    onComplete={() => setEvolutionEvent(null)}
                />
            )}

            <div className="fixed inset-0 z-0 pointer-events-none">
                <SFScrollDrift />
                <div className={cn(
                    "absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--neon-purple-rgb),0.05),transparent_70%)]",
                    // Dynamic Ambience
                    identityRank === 'Visionary' && "opacity-50 blur-xl",
                    identityRank === 'Phoenix' && "animate-pulse"
                )} />
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="relative z-10 w-full min-h-screen">
                {/* 1. NEURAL MAP NODES */}
                <div
                    className="absolute inset-0 overflow-x-auto overflow-y-hidden flex items-center px-[20vw] scrollbar-hide cursor-grab active:cursor-grabbing z-0"
                    onMouseDown={() => sfx.play('click')}
                >
                    <div className="absolute top-1/2 left-0 h-1 bg-gray-800 w-[5000px] -z-10 transform -translate-y-1/2 skill-node-line" />

                    <div className="flex items-center gap-64 relative py-32 pl-32 pr-64 h-full">
                        {nodes.map((node, i) => (
                            <div key={node.id} className="relative group flex flex-col items-center justify-center w-40">
                                {i < nodes.length - 1 && (
                                    <div className={cn(
                                        "absolute top-1/2 left-1/2 w-64 h-1 -z-10 transform -translate-y-1/2 origin-left transition-all duration-1000",
                                        node.status === 'mastered' ? "bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.5)]" : "bg-gray-800"
                                    )} />
                                )}

                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedNode(node); sfx.play('open'); }}
                                    onMouseEnter={() => sfx.play('hover')}
                                    className={cn(
                                        "relative w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-110 z-10 bg-black",
                                        node.status === 'mastered' ? "border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.4)]" :
                                            node.status === 'unlocked' ? "border-neon-purple animate-pulse shadow-[0_0_20px_rgba(188,19,254,0.6)] scale-110" :
                                                "border-gray-800 text-gray-700 opacity-50 grayscale hover:opacity-100 hover:border-gray-600"
                                    )}
                                    style={{ marginTop: `${Math.sin(i) * 120}px` }}
                                >
                                    {node.status === 'mastered' ? <Check className="w-10 h-10 text-neon-cyan" /> :
                                        node.status === 'locked' ? <Lock className="w-8 h-8" /> :
                                            <Play className="w-10 h-10 text-neon-purple fill-neon-purple" />}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border border-white/20 rounded-full flex items-center justify-center text-xs font-mono text-gray-400">
                                        {i + 1}
                                    </div>
                                </button>

                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 text-center pointer-events-none mt-6"
                                    style={{ marginTop: `${(Math.sin(i) * 120) + 70}px` }}>
                                    <p className={cn(
                                        "text-sm font-bold font-mono transition-colors bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5",
                                        node.status === 'mastered' ? "text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]" :
                                            node.status === 'unlocked' ? "text-neon-purple" : "text-gray-600"
                                    )}>
                                        {node.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. HUD */}
                <div className="fixed top-0 left-0 right-0 p-4 z-[60] flex justify-between items-start pointer-events-none">
                    <div className="pointer-events-auto animate-in slide-in-from-top-5 duration-700">
                        <IdentityWidget />
                    </div>
                    <div className="pointer-events-auto flex gap-4 animate-in slide-in-from-top-5 duration-700 delay-100">
                        <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 text-right">
                            <div className="text-2xl font-black text-neon-pink">
                                <SFScrambleGhostText text={`${matchScore}%`} />
                            </div>
                            <p className="text-[10px] text-neon-pink/70 font-mono">ROLE MATCH</p>
                        </div>
                    </div>
                </div>

                {/* 3. DESKTOP ICONS */}
                <div className="fixed left-4 top-24 bottom-24 flex flex-col gap-4 z-[60] pointer-events-none">
                    <div className="pointer-events-auto animate-in slide-in-from-left-5 duration-500 delay-200">
                        <OSIcon label="Dashboard" icon={LayoutDashboard} onClick={() => setShowDashboard(true)} color="text-neon-cyan" />
                    </div>
                    <div className="pointer-events-auto animate-in slide-in-from-left-5 duration-500 delay-300">
                        <OSIcon label="AI Mentor" icon={Brain} onClick={() => setShowMentor(true)} color="text-neon-purple" />
                    </div>
                    <div className="pointer-events-auto animate-in slide-in-from-left-5 duration-500 delay-400">
                        <OSIcon label="Career Matrix" icon={Briefcase} onClick={() => router.push('/career')} color="text-neon-pink" />
                    </div>
                    <div className="pointer-events-auto animate-in slide-in-from-left-5 duration-500 delay-500">
                        <OSIcon label="Living Roadmap" icon={Activity} onClick={() => router.push('/lab/living-roadmap')} color="text-emerald-400" />
                    </div>
                </div>

                {/* 5. Modules */}
                <RealityStream />

                {/* 4. OS WINDOWS */}
                <OSWindow
                    title="OPERATIVE_DASHBOARD.exe"
                    isOpen={showDashboard}
                    onClose={() => setShowDashboard(false)}
                    className="w-full max-w-5xl h-[80vh]"
                >
                    <div className="p-8 space-y-8">
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan mb-8">
                            OPERATIVE DASHBOARD
                        </h2>
                        <SFStatsCard key={statsTick} />
                        <SFHeatmap />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SFPortfolioGen role={typeof window !== 'undefined' ? localStorage.getItem('skillforge_role') || 'Developer' : 'Developer'} />
                            <SFAchievementCard />
                        </div>
                        <SFATSAnalyzer />
                    </div>
                </OSWindow>

                <OSWindow
                    title={`MODULE_Viewer: ${selectedNode?.id || 'Unknown'}`}
                    isOpen={!!selectedNode}
                    onClose={() => setSelectedNode(null)}
                    className="w-full max-w-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-auto max-h-[80vh]"
                >
                    {selectedNode && (
                        <div className="p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-xs font-mono text-gray-500 mb-1 block">MODULE {selectedNode.id.split('-')[1]}</span>
                                <h3 className={cn("text-3xl font-black mb-6 tracking-tight",
                                    selectedNode.status === 'mastered' ? "text-neon-cyan" :
                                        selectedNode.status === 'unlocked' ? "text-neon-purple" : "text-gray-500"
                                )}>
                                    {selectedNode.name}
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4">
                                        {selectedNode.status === 'mastered' ? <Check className="w-6 h-6 text-neon-cyan shrink-0" /> :
                                            selectedNode.status === 'locked' ? <Lock className="w-6 h-6 text-gray-500 shrink-0" /> :
                                                <AlertCircle className="w-6 h-6 text-neon-purple shrink-0" />}

                                        <div>
                                            <span className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1 block">Access Status</span>
                                            <span className="font-mono text-lg font-bold uppercase">{selectedNode.status}</span>
                                            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                                {selectedNode.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            disabled={selectedNode.status === 'locked'}
                                            onClick={() => { sfx.play('success'); completeLevel(selectedNode); }}
                                            className={cn(
                                                "flex-1 h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300",
                                                selectedNode.status === 'locked'
                                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                                                    : selectedNode.status === 'mastered'
                                                        ? "bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20"
                                                        : "bg-white text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                            )}
                                        >
                                            {selectedNode.status === 'mastered' ? (
                                                <><span>RE-VISIT MODULE</span> <ArrowRight className="w-4 h-4" /></>
                                            ) : selectedNode.status === 'locked' ? (
                                                <><span>LOCKED (Complete Previous)</span> <Lock className="w-4 h-4" /></>
                                            ) : (
                                                <><span>INITIATE PROTOCOL</span> <Play className="w-4 h-4 fill-black" /></>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => { sfx.play('mentor'); setShowMentor(true); }}
                                            className="w-14 h-14 border border-white/20 rounded-xl flex items-center justify-center hover:bg-neon-purple hover:bg-opacity-20 hover:border-neon-purple transition-all group/mentor"
                                            title="Ask AI Mentor"
                                        >
                                            <AlertCircle className="w-6 h-6 text-gray-400 group-hover/mentor:text-neon-purple" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </OSWindow>

                {/* AI Mentor (Floating Widget) */}
                <div className={cn("transition-all duration-300", showMentor ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-10")}>
                    <SFMentor
                        skillName={selectedNode?.name || null}
                        onClose={() => setShowMentor(false)}
                    />
                </div>

                {/* 5. TASKBAR (Bottom) */}
                <OSTaskbar />
            </div>
        </div>
    );
}
