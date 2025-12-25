import { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SFATSAnalyzer() {
    const [score, setScore] = useState(0);
    const [issues, setIssues] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);

    useEffect(() => {
        const rawData = typeof window !== 'undefined' ? localStorage.getItem('skillforge_user_data') || '' : '';
        let text = '';

        try {
            if (rawData.startsWith('{')) {
                text = JSON.parse(rawData).text || '';
            } else {
                text = rawData;
            }
        } catch (e) { }

        if (text) analyze(text);
    }, []);

    const analyze = (text: string) => {
        let s = 100;
        const tempIssues: string[] = [];
        const foundKeywords: string[] = [];

        // 1. Length Check
        if (text.length < 500) {
            s -= 20;
            tempIssues.push("Resume is too short (< 500 characters).");
        } else if (text.length > 5000) {
            s -= 10;
            tempIssues.push("Resume is quite long (> 5000 characters).");
        }

        // 2. Section Headings (Heuristic)
        const commonSections = ['experience', 'education', 'skills', 'projects', 'summary'];
        const missingSections = commonSections.filter(sec => !text.toLowerCase().includes(sec));

        if (missingSections.length > 0) {
            s -= (missingSections.length * 5);
            tempIssues.push(`Missing standard sections: ${missingSections.join(', ')}`);
        }

        // 3. Buzzwords
        const buzzwords = ['team player', 'hard worker', 'motivated'];
        const foundBuzz = buzzwords.filter(b => text.toLowerCase().includes(b));
        if (foundBuzz.length > 0) {
            s -= 5;
            tempIssues.push(`Avoid clichés like: ${foundBuzz.join(', ')}`);
        }

        // 4. Measurable Results (Numbers)
        const numberCount = (text.match(/\d+/g) || []).length;
        if (numberCount < 5) {
            s -= 10;
            tempIssues.push("Add more quantifiable results (metrics, %, $).");
        }

        setScore(Math.max(0, s));
        setIssues(tempIssues);
    };

    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-start mb-6">
                <h3 className="flex items-center gap-2 font-bold text-neon-green">
                    <FileText className="w-5 h-5" /> ATS SIMULATOR
                </h3>
                <div className="text-right">
                    <span className={cn(
                        "text-3xl font-black",
                        score >= 80 ? "text-neon-green" : score >= 60 ? "text-yellow-400" : "text-red-500"
                    )}>
                        {score}/100
                    </span>
                    <p className="text-[10px] text-gray-500 font-mono">RESUME HEALTH</p>
                </div>
            </div>

            <div className="space-y-3">
                {issues.length === 0 ? (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3 text-sm text-green-300">
                        <CheckCircle className="w-5 h-5 shrink-0" />
                        <div>
                            <p className="font-bold">Excellent Format!</p>
                            <p className="text-xs opacity-70">Your resume follows standard ATS guidelines.</p>
                        </div>
                    </div>
                ) : (
                    issues.map((issue, i) => (
                        <div key={i} className="flex gap-3 text-xs text-gray-400 p-2 bg-white/5 rounded hover:bg-white/10 transition-colors">
                            <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                            <span>{issue}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
