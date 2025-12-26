'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, Brain, Anchor, Activity, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import SFScrambleGhostText from '@/components/effects/SF-ScrambleGhostText';

const NODES = [
    { id: 'frontend', label: 'Frontend Core', x: 20, y: 30, color: 'text-neon-cyan' },
    { id: 'backend', label: 'Backend Logic', x: 50, y: 50, color: 'text-neon-purple' },
    { id: 'softskills', label: 'Communication', x: 80, y: 30, color: 'text-neon-pink' },
    { id: 'projects', label: 'Project Depth', x: 35, y: 70, color: 'text-yellow-400' },
    { id: 'system', label: 'System Arch', x: 65, y: 70, color: 'text-emerald-400' },
];

export default function LivingRoadmapPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
    const [activeNode, setActiveNode] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Initial Float Animation
            nodesRef.current.forEach((node, i) => {
                if (!node) return;

                // Random float
                gsap.to(node, {
                    y: '+=20',
                    x: '+=10',
                    duration: 2 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random()
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        nodesRef.current.forEach((node) => {
            if (!node) return;
            const nodeRect = node.getBoundingClientRect();
            const nodeX = nodeRect.left + nodeRect.width / 2 - rect.left;
            const nodeY = nodeRect.top + nodeRect.height / 2 - rect.top;

            const dist = Math.hypot(mouseX - nodeX, mouseY - nodeY);
            const state = node.dataset.state;

            if (state === 'anchor') return; // Locked nodes don't move

            if (dist < 150) {
                // REPULSION (Avoidance) - Fast approach
                const angle = Math.atan2(mouseY - nodeY, mouseX - nodeX);
                const force = (150 - dist) * 0.5;

                gsap.to(node, {
                    x: `-=${Math.cos(angle) * force}`,
                    y: `-=${Math.sin(angle) * force}`,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            } else if (dist < 300) {
                // ATTRACTION (Curiosity) - Slow, subtle drift towards mouse
                gsap.to(node, {
                    x: `+=${(mouseX - nodeX) * 0.02}`,
                    y: `+=${(mouseY - nodeY) * 0.02}`,
                    duration: 1,
                    ease: 'sine.out'
                });
            }
        });
    };

    const handleNodeClick = (index: number, id: string) => {
        const node = nodesRef.current[index];
        if (!node) return;

        // Toggle Anchor State
        const isAnchored = node.dataset.state === 'anchor';
        node.dataset.state = isAnchored ? 'neutral' : 'anchor';

        if (!isAnchored) {
            // LOCK ANIMATION
            gsap.to(node, {
                scale: 1.2,
                boxShadow: '0 0 30px rgba(0, 243, 255, 0.6)',
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
            setActiveNode(id);
        } else {
            // RELEASE
            gsap.to(node, {
                scale: 1,
                boxShadow: 'none',
                duration: 0.3
            });
            setActiveNode(null);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-black relative overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,0)_0%,_rgba(0,0,0,1)_100%)] pointer-events-none z-10" />

            {/* HUD */}
            <div className="fixed top-8 left-8 z-50">
                <button
                    onClick={() => router.push('/map')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs">EXIT LAB</span>
                </button>
            </div>

            <div className="fixed top-8 right-8 z-50 text-right">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
                    LIVING ROADMAP
                </h1>
                <p className="text-xs text-gray-500 font-mono">REACTIVE MOTION LAB // v4.0</p>
                <div className="mt-2 flex justify-end gap-4 text-[10px] font-mono text-gray-600">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> AVOIDANCE</span>
                    <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> CURIOSITY</span>
                    <span className="flex items-center gap-1"><Anchor className="w-3 h-3" /> ANCHOR</span>
                </div>
            </div>

            {/* NODES */}
            {NODES.map((node, i) => (
                <div
                    key={node.id}
                    ref={el => { nodesRef.current[i] = el; }}
                    onClick={() => handleNodeClick(i, node.id)}
                    data-state="neutral"
                    className={cn(
                        "absolute flex items-center justify-center w-32 h-32 rounded-full border border-white/10 bg-black/50 backdrop-blur-md cursor-pointer select-none transition-colors",
                        node.color
                    )}
                    style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        zIndex: 20
                    }}
                >
                    <div className="text-center pointer-events-none">
                        <Activity className={cn("w-8 h-8 mx-auto mb-2 opacity-50", node.color)} />
                        <span className="font-bold text-sm tracking-wider">{node.label}</span>
                    </div>

                    {/* Ring Animation */}
                    <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-[-10px] border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                </div>
            ))}

            {activeNode && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-neon-cyan p-6 rounded-2xl z-50 animate-in slide-in-from-bottom-10 max-w-md text-center">
                    <h3 className="text-xl font-bold text-white mb-2">
                        <SFScrambleGhostText text={`${activeNode.toUpperCase()} LOCKED`} />
                    </h3>
                    <p className="text-sm text-gray-400">
                        Priority protocol established. This node will now serve as a gravitational anchor for your learning path.
                    </p>
                </div>
            )}
        </div>
    );
}
