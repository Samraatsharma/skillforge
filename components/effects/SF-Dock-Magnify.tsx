'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, FileText, Cpu, Map as MapIcon, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Resume', icon: FileText, href: '/resume' },
    { label: 'Career', icon: Layers, href: '/career' },
    { label: 'Simulate', icon: Cpu, href: '/processing' },
    { label: 'Neural Map', icon: MapIcon, href: '/map' },
];

export default function SFDockMagnify() {
    const dockRef = useRef<HTMLDivElement>(null);
    const iconRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const pathname = usePathname();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const min = 50; // Base width
        const max = 100; // Max width on hover
        const bound = min * 2.5;

        const handleMouseMove = (event: MouseEvent) => {
            const rect = dock.getBoundingClientRect();
            const firstIcon = iconRefs.current[0];
            if (!firstIcon) return;

            // Calculate mouse position relative to the dock's left edge
            // but simpler: just use clientX relative to each icon's center

            iconRefs.current.forEach((icon, i) => {
                if (!icon) return;
                const iconRect = icon.getBoundingClientRect();
                const iconCenter = iconRect.left + iconRect.width / 2;
                const distance = event.clientX - iconCenter;

                let scale = 1;

                // Gaussian-like curve for magnification
                // We act on the distance. If close to 0, scale is max.
                if (Math.abs(distance) < bound) {
                    const strength = 1 - Math.abs(distance) / bound;
                    // Ease the curve
                    scale = 1 + (max / min - 1) * Math.pow(strength, 2);
                }

                gsap.to(icon, {
                    duration: 0.2,
                    width: min * scale,
                    height: min * scale,
                    // y: -1 * (scale - 1) * 10, // slight lift
                    ease: 'power2.out',
                });

                // Scale icon inside
                gsap.to(icon.querySelector('.dock-icon'), {
                    duration: 0.2,
                    scale: Math.min(1.5, scale), // Cap icon scale slightly
                });
            });
        };

        const handleMouseLeave = () => {
            iconRefs.current.forEach((icon) => {
                if (!icon) return;
                gsap.to(icon, {
                    duration: 0.3,
                    width: min,
                    height: min,
                    y: 0,
                    ease: 'power2.out',
                });
                gsap.to(icon.querySelector('.dock-icon'), {
                    scale: 1,
                    duration: 0.3
                });
            });
        };

        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div
                ref={dockRef}
                className="flex items-end h-20 px-4 pb-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl gap-2"
            >
                {NAV_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            ref={(el) => { iconRefs.current[index] = el; }}
                            className={cn(
                                "relative flex items-center justify-center rounded-xl transition-colors bg-white/5 border border-white/5",
                                "w-[50px] h-[50px]", // Initial size managed by GSAP, but set base here
                                isActive ? "bg-neon-cyan/20 border-neon-cyan/50" : "hover:bg-white/10"
                            )}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Icon className={cn("dock-icon w-6 h-6 text-gray-400 transition-colors", isActive && "text-neon-cyan")} />

                            {/* Tooltip */}
                            <div className={cn(
                                "absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 border border-white/10 rounded text-xs font-mono text-white opacity-0 transition-opacity pointer-events-none whitespace-nowrap",
                                hoveredIndex === index && "opacity-100"
                            )}>
                                {item.label}
                            </div>

                            {/* Active Dot */}
                            {isActive && (
                                <div className="absolute -bottom-2 w-1 h-1 bg-neon-cyan rounded-full box-glow" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
