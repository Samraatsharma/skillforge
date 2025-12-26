'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Terminal, Activity, Shield, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import OSWindow from '../os/OSWindow';
import { checkStructure } from '@/utils/identityEngine'; // We'll create this next

const SCENARIOS = [
    {
        id: 'scenario-frontend',
        title: '2027 Interview: Frontend Role',
        question: 'Explain how you would optimize a React application that is suffering from significant re-render performance issues on low-end devices.',
        context: 'HR Simulation / Tech Round',
        difficulty: 'HARD'
    },
    {
        id: 'scenario-product',
        title: 'Product Review Meeting',
        question: 'The client wants to add blockchain verification to the login flow. You know this will increase friction by 300%. How do you push back?',
        context: 'Stakeholder Management',
        difficulty: 'MEDIUM'
    },
    {
        id: 'scenario-defense',
        title: 'Defending Portfolio',
        question: 'Why did you choose a monolithic architecture for your last project instead of microservices?',
        context: 'Architecture Defense',
        difficulty: 'HARD'
    }
];

export default function RealityStream() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeScenario, setActiveScenario] = useState<number | null>(null);
    const [response, setResponse] = useState('');
    const [feedback, setFeedback] = useState<any>(null);

    const scenario = activeScenario !== null ? SCENARIOS[activeScenario] : null;

    const handleSubmit = () => {
        if (!response.trim() || !scenario) return;

        // RULE-BASED EVALUATION (No AI)
        const result = checkStructure(response); // To be implemented in identityEngine
        setFeedback(result);

        // Save to LocalStorage
        const history = JSON.parse(localStorage.getItem('reality_streams_history') || '[]');
        history.push({
            scenarioId: scenario.id,
            timestamp: new Date().toISOString(),
            clarity: result.clarity,
            structure: result.structure,
            responseLength: response.length
        });
        localStorage.setItem('reality_streams_history', JSON.stringify(history));
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-50 bg-black border border-neon-pink text-neon-pink p-4 rounded-full shadow-[0_0_20px_rgba(255,0,128,0.4)] hover:scale-110 transition-all group"
            >
                <Activity className="w-6 h-6 animate-pulse" />
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded border border-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    REALITY STREAM
                </span>
            </button>
        );
    }

    return (
        <OSWindow
            title="REALITY_STREAM.exe"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-full max-w-2xl h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <div className="p-6 h-full flex flex-col relative overflow-hidden">
                {/* Background Noise Animation */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

                {!scenario ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        <h2 className="text-2xl font-black text-neon-pink font-mono tracking-widest text-center">
                            SELECT SIMULATION PROTOCOL
                        </h2>
                        <div className="grid gap-4 w-full max-w-md">
                            {SCENARIOS.map((s, i) => (
                                <button
                                    key={s.id}
                                    onClick={() => { setActiveScenario(i); setFeedback(null); setResponse(''); }}
                                    className="bg-white/5 border border-white/10 p-4 rounded-xl text-left hover:bg-white/10 hover:border-white/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-neon-pink/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-neon-pink">{s.title}</h3>
                                            <p className="text-xs text-gray-500 font-mono mt-1">{s.context}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : !feedback ? (
                    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={() => setActiveScenario(null)} className="text-xs font-mono text-gray-500 hover:text-white">&lt; ABORT SIMULATION</button>
                            <span className="bg-neon-pink/20 text-neon-pink px-2 py-1 rounded text-[10px] font-bold tracking-widest border border-neon-pink/30">
                                {scenario.difficulty}
                            </span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2 font-mono">
                                &gt; {scenario.context}:
                            </h3>
                            <p className="text-2xl font-medium text-gray-200 leading-relaxed font-sans">
                                "{scenario.question}"
                            </p>
                        </div>

                        <div className="flex-1 relative">
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder="Structure your response clearly..."
                                className="w-full h-full bg-black/50 border border-white/20 rounded-xl p-4 text-white font-mono focus:border-neon-pink outline-none resize-none placeholder:text-gray-700"
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-mono">
                                {response.split(' ').length} WORDS
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={!response.trim()}
                                className="bg-neon-pink text-black font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                TRANSMIT RESPONSE
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center mb-6 relative">
                            <span className="text-4xl font-black text-white">
                                {feedback.score}
                            </span>
                            <div className="absolute inset-0 rounded-full border-t-4 border-neon-cyan animate-spin duration-[3s]" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">EVALUATION COMPLETE</h2>
                        <p className="text-sm text-gray-400 font-mono mb-8 max-w-sm">
                            {feedback.verdict}
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                            <ScoreMetric label="Clarity" value={feedback.clarity} />
                            <ScoreMetric label="Confidence" value={feedback.confidence} />
                            <ScoreMetric label="Structure" value={feedback.structure} />
                            <ScoreMetric label="Mastery" value={feedback.mastery} />
                        </div>

                        <button
                            onClick={() => { setFeedback(null); setActiveScenario(null); }}
                            className="text-neon-pink font-mono text-sm hover:underline"
                        >
                            RETURN TO SEQUENCE
                        </button>
                    </div>
                )}
            </div>
        </OSWindow>
    );
}

function ScoreMetric({ label, value }: any) {
    return (
        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-xl font-bold text-white">{value}%</div>
        </div>
    );
}
