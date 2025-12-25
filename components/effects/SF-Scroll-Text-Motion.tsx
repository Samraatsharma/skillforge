'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function SFScrollTextMotion() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Refs for scattered elements
    const el1 = useRef<HTMLDivElement>(null); // Top Left
    const el2 = useRef<HTMLDivElement>(null); // Top Right
    const el3 = useRef<HTMLDivElement>(null); // Center Title
    const el4 = useRef<HTMLDivElement>(null); // Big Character
    const el5 = useRef<HTMLDivElement>(null); // Bottom Left list
    const el6 = useRef<HTMLDivElement>(null); // Bottom Right list

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=200%', // Increased scroll distance
                    scrub: 1,
                    pin: true,
                },
            });

            // Center Title - SKILL FORGE
            tl.to(el3.current, {
                scale: 15,
                opacity: 0,
                z: 500,
                duration: 2,
                ease: 'power2.in',
            }, 0);

            // Top Left - "v1.0"
            tl.fromTo(el1.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 }, 0
            ).to(el1.current, { y: -200, opacity: 0, duration: 1 }, 1);

            // Top Right - System Status
            tl.fromTo(el2.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1 }, 0.2
            ).to(el2.current, { x: 300, opacity: 0, duration: 1 }, 1.2);

            // Big Character "AI"
            tl.fromTo(el4.current,
                { x: '100%', opacity: 0, scale: 0.5 },
                { x: '0%', opacity: 1, scale: 1, duration: 1.5 }, 0.5
            );

            // Bottom Lists
            tl.fromTo(el5.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 }, 0.3
            );

            tl.fromTo(el6.current,
                { x: 200, opacity: 0 },
                { x: 0, opacity: 1, duration: 1 }, 0.4
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center font-pixel text-white select-none z-20">

            {/* 01 - Top Left Large Number */}
            <div ref={el1} className="absolute top-[10%] left-[5%] text-[6rem] md:text-[8rem] leading-none font-bold opacity-0 text-neon-cyan/20">
                v1.0
            </div>

            {/* 02 - Top Right Status */}
            <div ref={el2} className="absolute top-[15%] right-[10%] text-right opacity-0">
                <p className="text-xl text-neon-pink">SYSTEM ONLINE</p>
                <p className="text-sm mt-2 tracking-widest text-gray-500">RESUME UPLOAD READY</p>
            </div>

            {/* 03 - Center Title */}
            <div ref={el3} className="absolute z-10 flex flex-col items-center justify-center mix-blend-difference">
                <h2 className="text-[12vw] leading-none text-white font-mono uppercase tracking-widest whitespace-nowrap text-glow">
                    SKILL<br />FORGE
                </h2>
                <p className="mt-4 text-xs md:text-sm tracking-[1em] text-neon-cyan/80">AI UPSKILLING DOJO</p>
            </div>

            {/* 04 - Bottom Right Big Character */}
            <div ref={el4} className="absolute bottom-[5%] right-[2%] text-[15rem] md:text-[25rem] leading-none font-bold opacity-0 text-white/5">
                AI
            </div>

            {/* 05 - Bottom Left Tech List */}
            <div ref={el5} className="absolute bottom-[20%] left-[10%] text-left opacity-0 text-gray-400 text-xs md:text-sm space-y-1 font-mono tracking-wider">
                <p className="text-white">MODULES_LOADED:</p>
                <p>SKILL MAPPING</p>
                <p>GAP ANALYSIS</p>
                <p>CAREER SIMULATION</p>
                <p>PATHWAY OPTIMIZATION</p>
                <p>NEURAL NETWORKS</p>
            </div>

            {/* 06 - Vertical Right Text */}
            <div ref={el6} className="absolute bottom-[30%] right-[20%] text-right opacity-0 text-gray-400 text-xs md:text-sm space-y-1 font-mono tracking-wider">
                <p className="text-white">TARGET_STACK:</p>
                <p>REACT</p>
                <p>NEXT.JS</p>
                <p>TAILWIND</p>
                <p>TYPESCRIPT</p>
            </div>

            {/* Grid Overlay for texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        </div>
    );
}
