'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '@/utils/soundFX';
import { Dna, ArrowUpCircle, Sparkles } from 'lucide-react';
import SFScrambleGhostText from '@/components/effects/SF-ScrambleGhostText';

interface EvolutionOverlayProps {
    prevRank: string;
    newRank: string;
    onComplete: () => void;
}

export default function EvolutionOverlay({ prevRank, newRank, onComplete }: EvolutionOverlayProps) {
    const [step, setStep] = useState(0);

    // Sequence
    useEffect(() => {
        // Step 0: Init (0s)
        // Step 1: DNA Animation (1s)
        // Step 2: Text Reveal (3s)
        // Step 3: Complete (6s)

        const t1 = setTimeout(() => setStep(1), 500);
        const t2 = setTimeout(() => setStep(2), 2500);
        const t3 = setTimeout(() => setStep(3), 5500);
        const t4 = setTimeout(onComplete, 7000);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="text-center relative">

                {/* Background Glow */}
                <div className="absolute inset-0 bg-neon-purple/20 blur-[100px] animate-pulse" />

                <AnimatePresence mode="wait">

                    {step === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-white font-mono text-xl animate-pulse"
                        >
                            🧬 IDENTITY INSTABILITY DETECTED...
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 5, opacity: 0 }}
                            className="flex justify-center"
                        >
                            <Dna className="w-32 h-32 text-neon-cyan animate-spin duration-[3s]" />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-black/50 border border-white/20 p-8 rounded-2xl backdrop-blur-md"
                        >
                            <h3 className="text-gray-400 font-mono text-sm mb-2">EVOLUTION COMPLETE</h3>
                            <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
                                <SFScrambleGhostText text={newRank.toUpperCase()} />
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-4 text-neon-cyan font-mono text-xs">
                                <ArrowUpCircle className="w-4 h-4" />
                                <span>CAPABILITIES EXPANDED</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
