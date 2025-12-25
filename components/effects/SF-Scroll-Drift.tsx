'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function SFScrollDrift() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef1 = useRef<HTMLDivElement>(null);
    const textRef2 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (textRef1.current) {
                gsap.to(textRef1.current, {
                    xPercent: -20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: document.body,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                    },
                });
            }
            if (textRef2.current) {
                gsap.to(textRef2.current, {
                    xPercent: 20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: document.body,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                    },
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden flex flex-col justify-center opacity-10 select-none">
            <div ref={textRef1} className="text-[20vh] font-black whitespace-nowrap text-white/5 leading-none">
                SKILLFORGE AI UPSKILLING DOJO CYBERPUNK FUTURE
            </div>
            <div ref={textRef2} className="text-[20vh] font-black whitespace-nowrap text-white/5 leading-none ml-[-50vw]">
                NEURAL MAP ANALYSIS CAREER PATH OPTIMIZATION DECIPHER
            </div>
        </div>
    );
}
