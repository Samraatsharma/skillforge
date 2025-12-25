'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Lock, ChevronRight, AlertCircle, Play, ArrowRight, LayoutDashboard, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import SFDockMagnify from '@/components/effects/SF-Dock-Magnify';
import SFScrambleGhostText from '@/components/effects/SF-ScrambleGhostText';
import SFHeatmap from '@/components/addons/SF-Heatmap';
import SFStatsCard from '@/components/addons/SF-StatsCard';
import SFMentor from '@/components/addons/SF-Mentor';
import SFPortfolioGen from '@/components/addons/SF-PortfolioGen';
import SFATSAnalyzer from '@/components/addons/SF-ATSAnalyzer';
import SFAchievementCard from '@/components/addons/SF-AchievementCard';
import { onSkillMastered } from '@/lib/gamification';

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

    // Load and Generate Map
    useEffect(() => {
        const loadMap = async () => {
            const rawData = typeof window !== 'undefined' ? localStorage.getItem('skillforge_user_data') || '' : '';
            const completedIds = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('skillforge_completed_nodes') || '[]') : [];
            const role = typeof window !== 'undefined' ? localStorage.getItem('skillforge_role') : null;

            let aiData: any = null;
            let manualText = '';

            // Parse Input
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

            // Generate Base List
            let rawSkillList: string[] = [];

            // 1. Try AI Roadmap for Role
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

            // 2. Fallback to Resume Analysis / Static
            if (rawSkillList.length === 0) {
                if (aiData) {
                    setMatchScore(aiData.match_score || 75);
                    // Handle potential structure variations
                    const m = aiData.mastered || [];
                    const u = aiData.unlocked || [];
                    const l = aiData.locked || [];
                    rawSkillList = [...m, ...u, ...l];
                } else if (manualText.length > 10) {
                    // Simple simulation
                    setMatchScore(40);
                    rawSkillList = EXTENDED_SKILL_DB.slice(0, 15);
                } else {
                    rawSkillList = EXTENDED_SKILL_DB.slice(0, 10);
                }
            }

            // Deduplicate and Ensure Minimum Length
            rawSkillList = Array.from(new Set(rawSkillList));
            if (rawSkillList.length < 5) rawSkillList = [...rawSkillList, ...EXTENDED_SKILL_DB.slice(0, 10)];

            // Create Nodes
            /* 
               We use 'skill-${index}' to maintain compatibility with existing localStorage data.
            */
            const generatedNodes: SkillNode[] = rawSkillList.map((skill, index) => {
                const nodeId = `skill-${index}`;
                const isCompleted = completedIds.includes(nodeId);
                let status: SkillNode['status'] = 'locked';

                if (isCompleted) {
                    status = 'mastered';
                } else {
                    // Check if previous was mastered or if it's the first one
                    // For resume-based flows, we might respect the analysis 'mastered' list.
                    // But to support the sequential gamification, we enforce the chain unless locally unlocked.

                    // However, if we JUST swtiched to a new Role Roadmap, we should probably start fresh or respect persistence?
                    // Persistence is bound to 'skill-X'. If the list changes content, 'skill-0' is now a different skill.
                    // This is a known issue with indexed-based IDs. Ideally we hash the skill name. 
                    // But for this prototype, we accept that changing roles might mess up 'skill-0' semantics if we don't clear persistence.
                    // We won't clear persistence automatically though to avoid data loss.

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

    // Handle Level Completion
    const completeLevel = (node: SkillNode) => {

        if (node.status === 'locked') return;

        // 1. Open Learning Resource
        window.open(`https://www.google.com/search?q=learn+${node.name}+interactive+tutorial`, '_blank');

        // 2. Mark as Mastered
        const updatedNodes = nodes.map(n => {
            if (n.id === node.id) return { ...n, status: 'mastered' as const };
            return n;
        });

        // 3. Unlock Next Node
        const currentIndex = nodes.findIndex(n => n.id === node.id);
        if (currentIndex < nodes.length - 1) {
            updatedNodes[currentIndex + 1].status = 'unlocked';
        }

        setNodes(updatedNodes);
        setSelectedNode(null);

        // 4. Save Progress & Gamification
        const newCompletedId = node.id;
        const currentCompleted = JSON.parse(localStorage.getItem('skillforge_completed_nodes') || '[]');
        if (!currentCompleted.includes(newCompletedId)) {
            localStorage.setItem('skillforge_completed_nodes', JSON.stringify([...currentCompleted, newCompletedId]));
            onSkillMastered(); // Update XP
            setStatsTick(prev => prev + 1); // Trigger UI update if passing prop
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-cyan/20 via-black to-black opacity-40 animate-pulse" />

            {/* Hexagon Spinner */}
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
        <div className="min-h-screen bg-background relative flex flex-col overflow-hidden">

            {/* Header */}
            <div className="absolute top-0 left-0 p-6 z-20 w-full flex justify-between items-start pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold text-neon-cyan">CAMPAIGN MODE</h2>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                        LEVEL {nodes.filter(n => n.status === 'mastered').length} / {nodes.length}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowMentor(true)}
                        className="bg-black/40 backdrop-blur-md px-4 rounded-xl border border-white/10 flex items-center gap-2 hover:bg-neon-purple/20 hover:border-neon-purple transition-all pointer-events-auto group"
                    >
                        <AlertCircle className="w-5 h-5 text-gray-400 group-hover:text-neon-purple" />
                        <span className="text-xs font-bold text-white hidden md:inline">AI MENTOR</span>
                    </button>

                    <button
                        onClick={() => setShowDashboard(true)}
                        className="bg-black/40 backdrop-blur-md px-4 rounded-xl border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-colors pointer-events-auto"
                    >
                        <LayoutDashboard className="w-5 h-5 text-neon-cyan" />
                        <span className="text-xs font-bold text-white hidden md:inline">DASHBOARD</span>
                    </button>
                    <div className="text-right bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <div className="text-4xl font-black text-neon-pink flex justify-end">
                            <SFScrambleGhostText text={`${matchScore}%`} />
                        </div>
                        <p className="text-xs text-neon-pink/70 font-mono">ROLE MATCH</p>
                    </div>
                </div>
            </div>

            {/* Infinite Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-[20vw] relative scrollbar-hide cursor-grab active:cursor-grabbing"
            >
                {/* Connecting Line (Absolute behind nodes) */}
                <div className="absolute top-1/2 left-0 h-1 bg-gray-800 w-[5000px] -z-10 transform -translate-y-1/2" />

                <div className="flex items-center gap-64 relative py-32 pl-32 pr-64">
                    {nodes.map((node, i) => (
                        <div key={node.id} className="relative group flex flex-col items-center justify-center w-40">

                            {/* Connection Line segment to next status color */}
                            {i < nodes.length - 1 && (
                                <div className={cn(
                                    "absolute top-1/2 left-1/2 w-64 h-1 -z-10 transform -translate-y-1/2 origin-left transition-all duration-1000",
                                    node.status === 'mastered' ? "bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.5)]" : "bg-gray-800"
                                )} />
                            )}

                            {/* Node Button */}
                            <button
                                onClick={() => setSelectedNode(node)}
                                className={cn(
                                    "relative w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-110 z-10 bg-black",
                                    node.status === 'mastered' ? "border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.4)]" :
                                        node.status === 'unlocked' ? "border-neon-purple animate-pulse shadow-[0_0_20px_rgba(188,19,254,0.6)] scale-110" :
                                            "border-gray-800 text-gray-700 opacity-50 grayscale hover:opacity-100 hover:border-gray-600"
                                )}
                                style={{
                                    marginTop: `${Math.sin(i) * 120}px` // Sine wave vertical drift
                                }}
                            >
                                {node.status === 'mastered' ? <Check className="w-10 h-10 text-neon-cyan" /> :
                                    node.status === 'locked' ? <Lock className="w-8 h-8" /> :
                                        <Play className="w-10 h-10 text-neon-purple fill-neon-purple" />}

                                {/* Level Number Badge */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border border-white/20 rounded-full flex items-center justify-center text-xs font-mono text-gray-400">
                                    {i + 1}
                                </div>
                            </button>

                            {/* Label */}
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2 w-56 text-center pointer-events-none mt-6"
                                style={{ marginTop: `${(Math.sin(i) * 120) + 70}px` }}
                            >
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

            {/* Dashboard Modal */}
            {showDashboard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-full max-w-4xl h-[90vh] bg-black border border-white/20 rounded-2xl overflow-y-auto relative p-8 scrollbar-hide">
                        <button
                            onClick={() => setShowDashboard(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan mb-8">
                            OPERATIVE DASHBOARD
                        </h2>

                        <div className="space-y-8">
                            {/* 1. Top Stats */}
                            {/* 1. Top Stats */}
                            <SFStatsCard key={statsTick} />

                            {/* 2. Heatmap */}
                            <SFHeatmap />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 3. Portfolio Generator */}
                                <SFPortfolioGen role={typeof window !== 'undefined' ? localStorage.getItem('skillforge_role') || 'Developer' : 'Developer'} />

                                {/* 4. Achievement Card */}
                                <SFAchievementCard />
                            </div>

                            {/* 5. ATS Analyzer */}
                            <SFATSAnalyzer />
                        </div>
                    </div>
                </div>
            )}

            {/* AI Mentor Drawer */}
            <SFMentor
                skillName={showMentor ? (selectedNode?.name || null) : null}
                onClose={() => setShowMentor(false)}
            />

            {/* Modal / HUD */}
            {selectedNode && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedNode(null)}>
                    <div
                        className="w-full max-w-md bg-black border border-white/20 rounded-2xl p-8 relative shadow-2xl overflow-hidden group"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent pointer-events-none" />

                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            onClick={() => setSelectedNode(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>

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
                                        onClick={() => completeLevel(selectedNode)}
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
                                        onClick={() => setShowMentor(true)}
                                        className="w-14 h-14 border border-white/20 rounded-xl flex items-center justify-center hover:bg-neon-purple hover:bg-opacity-20 hover:border-neon-purple transition-all group/mentor"
                                        title="Ask AI Mentor"
                                    >
                                        <AlertCircle className="w-6 h-6 text-gray-400 group-hover/mentor:text-neon-purple" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll Hint */}
            <div className="absolute bottom-32 w-full text-center text-gray-500 text-xs font-mono animate-pulse pointer-events-none">
                DRAG OR SCROLL TO NAVIGATE PATH
            </div>

            <SFDockMagnify />
        </div>
    );
}


