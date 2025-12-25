'use client';

import React from 'react';
import Link from 'next/link';
import SFScrollDrift from '@/components/effects/SF-Scroll-Drift';
import SFDockMagnify from '@/components/effects/SF-Dock-Magnify';
import SFScrollTextMotion from '@/components/effects/SF-Scroll-Text-Motion';

export default function Home() {
  return (
    <main className="relative w-full bg-background no-scrollbar">
      {/* Background Effect (Sticky or Fixed) */}
      <SFScrollDrift />

      {/* HERO SECTION: Scroll Text Motion - Now the first thing user sees */}
      <SFScrollTextMotion />

      {/* Secondary CTA Section (After Scroll) */}
      <section className="min-h-screen flex flex-col items-center justify-center relative z-10 bg-black/80 backdrop-blur-sm">
        <div className="text-center space-y-8 p-4">
          <h2 className="text-4xl md:text-6xl font-mono text-neon-cyan mb-4 font-bold tracking-tighter">
            READY TO UPGRADE?
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8 text-lg">
            Analyze your resume, identify gaps, and master the neural grid of modern tech skills.
          </p>

          <Link
            href="/resume"
            className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-neon-purple/20 border border-neon-purple px-12 font-bold text-neon-purple transition-all duration-300 hover:bg-neon-purple hover:text-black hover:shadow-[0_0_40px_rgba(188,19,254,0.6)] focus:outline-none"
          >
            <span className="text-xl mr-2">INITIATE SEQUENCE</span>
            <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
          </Link>
        </div>
      </section>

      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0" />

      {/* Bottom Dock */}
      <SFDockMagnify />
    </main>
  );
}
