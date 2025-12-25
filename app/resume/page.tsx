'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, ArrowRight, Keyboard, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import SFDockMagnify from '@/components/effects/SF-Dock-Magnify';

export default function ResumePage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [manualText, setManualText] = useState('');
    const [mode, setMode] = useState<'upload' | 'manual'>('upload');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [decryptText, setDecryptText] = useState('DECRYPTING...');

    // Cycling Status Text
    React.useEffect(() => {
        if (!isProcessing) return;
        const states = [
            "SCANNING BIOMETRICS...",
            "PARSING NEURAL SYNTAX...",
            "IDENTIFYING SKILL GAPS...",
            "MAPPING CAREER VECTORS...",
            "DECRYPTING..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            setDecryptText(states[i % states.length]);
            i++;
        }, 800);
        return () => clearInterval(interval);
    }, [isProcessing]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.[0]) {
            setFile(acceptedFiles[0]);
            setErrorMsg('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
        maxFiles: 1
    });

    const handleAnalyze = async () => {
        setIsProcessing(true);
        setErrorMsg('');

        try {
            let storageData: any = {};

            if (mode === 'upload' && file) {
                // Use Real Server API
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Server upload failed');
                }

                // Save the WHOLE response, including 'analysis' if it exists (Gemini)
                storageData = JSON.stringify(data);
            } else {
                // Manual Mode: Just save text as simple string
                storageData = manualText;
            }

            // Save for simulation/map logic
            if (typeof window !== 'undefined') {
                localStorage.setItem('skillforge_user_data', storageData);
            }

            router.push('/career');

        } catch (err: any) {
            console.error("Analysis Failed:", err);
            setErrorMsg(err.message || "Failed to analyze data. Please try manual entry.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neon-cyan/5 via-background to-background pointer-events-none" />

            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center text-glow z-10">UPLOAD NEURAL DATA</h1>
            <p className="text-gray-400 mb-8 font-mono z-10 text-center max-w-lg">
                {mode === 'upload'
                    ? "Sync your current skill matrix for gap analysis."
                    : "Manually input your known protocols and languages."}
            </p>

            <div className="w-full max-w-2xl z-10 space-y-6">

                {/* Toggle Buttons */}
                <div className="flex gap-4 mb-6 justify-center">
                    <button
                        onClick={() => setMode('upload')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300",
                            mode === 'upload'
                                ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                                : "bg-black/40 border-white/10 text-gray-500 hover:border-white/30"
                        )}
                    >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload PDF</span>
                    </button>
                    <button
                        onClick={() => setMode('manual')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300",
                            mode === 'manual'
                                ? "bg-neon-purple/10 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.3)]"
                                : "bg-black/40 border-white/10 text-gray-500 hover:border-white/30"
                        )}
                    >
                        <Keyboard className="w-4 h-4" />
                        <span>I don't have a resume</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative min-h-[300px] bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all duration-500">

                    {mode === 'upload' ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "h-full min-h-[250px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                                isDragActive ? "border-neon-cyan bg-neon-cyan/5" : "border-white/10 hover:border-neon-cyan/50 hover:bg-white/5"
                            )}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud className={cn("w-12 h-12 mb-4 transition-colors", isDragActive ? "text-neon-cyan" : "text-gray-400")} />
                            <p className="text-lg font-medium text-center px-4">
                                {file ? <span className="text-neon-cyan">{file.name}</span> : "Drop resume PDF here or click to browse"}
                            </p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <label className="text-xs font-mono text-neon-purple mb-2 block">MANUAL_SKILL_ENTRY_TERMINAL</label>
                            <textarea
                                value={manualText}
                                onChange={(e) => setManualText(e.target.value)}
                                placeholder="Ex: JavaScript, React, Node.js, Project Management..."
                                className="flex-1 w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all outline-none resize-none min-h-[220px]"
                                autoFocus
                            />
                            <div className="text-right text-xs text-gray-600 mt-2">
                                {manualText.length} chars
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="absolute inset-x-6 bottom-4 bg-red-900/50 border border-red-500/50 p-2 rounded flex items-center gap-2 text-red-200 text-sm animate-in fade-in slide-in-from-bottom-2">
                            <AlertCircle className="w-4 h-4" />
                            {errorMsg}
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={handleAnalyze}
                    disabled={isProcessing || (mode === 'upload' && !file) || (mode === 'manual' && !manualText)}
                    className="w-full h-16 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-[0.98]"
                >
                    {isProcessing ? (
                        <span className="animate-pulse flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            {decryptText}
                        </span>
                    ) : (
                        <>
                            <span>INITIATE GAP ANALYSIS</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>

            <SFDockMagnify />
        </div>
    );
}
