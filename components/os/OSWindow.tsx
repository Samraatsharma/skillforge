'use client';
import { useRef, useState } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sfx } from '@/utils/soundFX';

interface OSWindowProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export default function OSWindow({ title, isOpen, onClose, children, className }: OSWindowProps) {
    const [isMaximized, setIsMaximized] = useState(false);

    if (!isOpen) return null;

    return (
        <div className={cn(
            "fixed bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in zoom-in-95",
            isMaximized ? "inset-0 z-50 rounded-none" : "top-20 left-20 right-20 bottom-24 z-40 border-neon-cyan/30",
            className
        )}>
            {/* Title Bar */}
            <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 shrink-0 select-none cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors" />
                    <span className="w-3 h-3 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors" />
                    <span className="ml-4 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">{title}</span>
                </div>
                <div className="flex gap-4 text-gray-400">
                    <button onClick={() => setIsMaximized(!isMaximized)} className="hover:text-white">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { sfx.play('click'); onClose(); }} className="hover:text-red-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-neon-cyan/20">
                {children}
            </div>
        </div>
    );
}
