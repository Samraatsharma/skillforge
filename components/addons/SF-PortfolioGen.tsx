import { useState } from 'react';
import { Lightbulb, Code, Copy, Check } from 'lucide-react';

interface SFPortfolioGenProps {
    role: string;
}

export default function SFPortfolioGen({ role }: SFPortfolioGenProps) {
    const [generated, setGenerated] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const generateProject = () => {
        // Pseudo-AI Logic
        const project = {
            title: `Pro ${role} Dashboard`,
            problem: "Existing solutions lack real-time data visualization and user-friendly metrics.",
            features: [
                "Real-time WebSocket updates",
                "Dark/Light mode toggle",
                "Role-based access control",
                "Export data to CSV/PDF"
            ],
            stack: ["Next.js", "Tailwind", "Supabase", "Recharts"],
            steps: [
                "Initialize Next.js app",
                "Setup Database Schema",
                "Build Auth Flow",
                "Develop Dashboard Layout"
            ]
        };

        if (role.toLowerCase().includes('writer')) {
            project.title = "Tech Blog SaaS Platform";
            project.problem = "Developers need a markdown-first blogging platform with built-in SEO tools.";
            project.features = ["Markdown Editor", "SEO Auto-Score", "RSS Feed Gen", "Newsletter Integration"];
            project.stack = ["Next.js", "MDX", "Vercel Blob", "Postgres"];
        }

        setGenerated(project);
    };

    const copyToClipboard = () => {
        if (!generated) return;
        const text = `Project: ${generated.title}\nProblem: ${generated.problem}\nTech Stack: ${generated.stack.join(', ')}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="flex items-center gap-2 font-bold text-neon-pink">
                    <Lightbulb className="w-5 h-5" /> PROJECT GENERATOR
                </h3>
                <button
                    onClick={generateProject}
                    className="px-4 py-2 bg-neon-pink text-black text-xs font-bold rounded hover:bg-pink-400 transition-colors"
                >
                    GENERATE NEW
                </button>
            </div>

            {generated ? (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <div>
                        <h4 className="text-xl font-bold mb-1">{generated.title}</h4>
                        <p className="text-sm text-gray-400 italic">{generated.problem}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-3 rounded-lg">
                            <h5 className="text-xs font-mono text-gray-500 mb-2">FEATURES</h5>
                            <ul className="text-xs text-gray-300 list-disc pl-4 space-y-1">
                                {generated.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                            <h5 className="text-xs font-mono text-gray-500 mb-2">TECH STACK</h5>
                            <div className="flex flex-wrap gap-1">
                                {generated.stack.map((s: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-black rounded text-[10px] text-neon-cyan border border-neon-cyan/30">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className="w-full py-2 border border-white/20 rounded hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-mono text-gray-400"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "COPIED TO CLIPBOARD" : "COPY BLUEPRINT"}
                    </button>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-600 font-mono text-xs border-2 border-dashed border-gray-800 rounded-lg">
                    AWAITING INPUT... GENERATE A PROJECT TO START BUILDING.
                </div>
            )}
        </div>
    );
}
