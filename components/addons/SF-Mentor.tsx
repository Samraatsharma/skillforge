import { useState, useEffect, useRef } from 'react';
import { X, BookOpen, AlertTriangle, GraduationCap, Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SFMentorProps {
    skillName: string | null;
    onClose: () => void;
}

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export default function SFMentor({ skillName, onClose }: SFMentorProps) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    useEffect(() => {
        setMessages([]); // Reset on open
        setIsTyping(true);

        let greeting = "";
        if (skillName) {
            greeting = `Greetings. I detect you are focusing on the **${skillName}** module. Shall I provide a strategic overview, or do you have a specific query regarding its implementation?`;
        } else {
            greeting = "Neural Link Established. I am your Career Guidance Construct. Which skill or career protocol would you like to analyze today? State your objective.";
        }

        setTimeout(() => {
            setMessages([{ role: 'ai', content: greeting }]);
            setIsTyping(false);
        }, 800);

    }, [skillName]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        // Simulation Delay
        setTimeout(() => {
            const response = generateAIResponse(userMsg, skillName);
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-black border-l border-white/10 shadow-2xl z-50 p-4 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center border border-neon-purple overflow-hidden">
                        <GraduationCap className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">AI MENTOR</h2>
                        <span className="text-xs text-neon-purple font-mono animate-pulse">ONLINE</span>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                            msg.role === 'ai' ? "bg-neon-purple/10 border-neon-purple text-neon-purple" : "bg-white/10 border-white/30 text-white"
                        )}>
                            {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "p-3 rounded-2xl text-sm leading-relaxed max-w-[85%]",
                            msg.role === 'ai' ? "bg-white/5 border border-white/10 text-gray-300 rounded-tl-none" : "bg-neon-purple text-black font-medium rounded-tr-none"
                        )}>
                            {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-neon-cyan">{part}</strong> : part)}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-neon-purple/10 border border-neon-purple flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-neon-purple" />
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={skillName ? `Ask about ${skillName}...` : "Ask about a skill..."}
                    className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple placeholder:text-gray-600"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="bg-neon-purple text-black rounded-xl w-12 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

// Simple Heuristic Chatbot Logic
function generateAIResponse(input: string, contextSkill: string | null): string {
    const q = input.toLowerCase();

    // 1. Context Specific
    if (contextSkill) {
        if (q.includes('overview') || q.includes('what')) {
            return `**${contextSkill}** is a fundamental component of your selected protocol. It allows for efficient data processing and interface construction. Prioritize learning its core syntax before moving to frameworks.`;
        }
        if (q.includes('learn') || q.includes('start') || q.includes('begin')) {
            return `I recommend starting with **Official Documentation** and interactive sandboxes. Focus on building a small 'Hello World' project within 24 hours to cement the neural pathway.`;
        }
        if (q.includes('job') || q.includes('career') || q.includes('work')) {
            return `Proficiency in **${contextSkill}** is highly correlated with Senior Engineering roles. It is often paired with cloud infrastructure knowledge in high-value contracts.`;
        }
    }

    // 2. General Career Advice
    if (q.includes('salary') || q.includes('money')) {
        return "Market data indicates that **Specialized Roles** (AI, Security, Blockchain) currently command the highest value credits. However, foundational roles in Backend Systems remain the most stable.";
    }

    if (q.includes('roadmap') || q.includes('path')) {
        return "Your roadmap should be iterative. Master the **Core Principles** (Algorithms, System Design) first. Tools change; principles endure. Check your Dashboard for a generated path.";
    }

    if (q.includes('resume') || q.includes('cv')) {
        return "Ensure your resume quantified impact. Don't just list technologies; list **Outcomes**. Use the ATS Analyzer in the Dashboard to verify your optimization level.";
    }

    // 3. Fallback
    return `I analyze that you are asking about **${q.split(' ').slice(0, 3).join(' ')}**. To optimize your career trajectory, I suggest focusing on practical application. Build a portfolio project demonstrating this concept. Shall I generate a project idea?`;
}
