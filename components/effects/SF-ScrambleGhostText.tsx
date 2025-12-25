'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface SFScrambleGhostTextProps {
    text: string;
    className?: string;
    trigger?: boolean;
}

export default function SFScrambleGhostText({ text, className, trigger = true }: SFScrambleGhostTextProps) {
    const elementRef = useRef<HTMLSpanElement>(null);
    const chars = '*&@#$#@#$@*&$(@#^)ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    useEffect(() => {
        if (!trigger || !elementRef.current) return;

        const tl = gsap.timeline();
        const duration = 1.5;
        const obj = { value: 0 };

        tl.to(obj, {
            value: 1,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                const progress = obj.value;
                const revealedLength = Math.floor(text.length * progress);

                let output = text.substring(0, revealedLength);
                const remainingLength = text.length - revealedLength;

                for (let i = 0; i < remainingLength; i++) {
                    output += chars[Math.floor(Math.random() * chars.length)];
                }

                if (elementRef.current) {
                    elementRef.current.innerText = output;
                }
            },
            onComplete: () => {
                if (elementRef.current) {
                    elementRef.current.innerText = text;
                }
            }
        });

        return () => {
            tl.kill();
        };
    }, [text, trigger]);

    return (
        <span ref={elementRef} className={cn("inline-block font-mono", className)}>
            {'*&@#$#@#$@*&$(@#^)'}
        </span>
    );
}
