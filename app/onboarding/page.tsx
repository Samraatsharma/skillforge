'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AvatarCard from '@/components/identity/AvatarCard';
import { AVATARS } from '@/utils/careerEngine';
import { sfx } from '@/utils/soundFX';
import { ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

    const handleNext = () => {
        sfx.play('click');
        if (step === 1 && name.trim()) setStep(2);
        else if (step === 2 && selectedAvatar) completeOnboarding();
    };

    const completeOnboarding = () => {
        if (!selectedAvatar) return;
        localStorage.setItem('skillforge_identity', JSON.stringify({
            name,
            avatar: selectedAvatar,
            joined: new Date().toISOString()
        }));

        // Auto-select career based on Avatar
        const role = AVATARS[selectedAvatar].roleId;
        localStorage.setItem('skillforge_role', role); // Link to Career Engine

        sfx.play('success');
        router.push('/map'); // Redirect to OS (Map)
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-50 pointer-events-none" />

            <div className="z-10 w-full max-w-4xl text-center">
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 animate-pulse">
                    IDENTITY UPLOAD
                </h1>
                <p className="text-gray-400 font-mono mb-12">ESTABLISH YOUR DIGITAL PRESENCE</p>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <input
                            type="text"
                            placeholder="ENTER CODENAME"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-black/50 border-b-2 border-white/20 text-center text-3xl font-bold text-white outline-none focus:border-neon-cyan py-4 w-full max-w-md placeholder:text-gray-700 font-mono"
                            autoFocus
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {Object.keys(AVATARS).map(key => (
                            <AvatarCard
                                key={key}
                                type={key}
                                selected={selectedAvatar === key}
                                onSelect={() => {
                                    setSelectedAvatar(key);
                                    sfx.play('hover');
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-12">
                    <button
                        onClick={handleNext}
                        disabled={step === 1 ? !name : !selectedAvatar}
                        className="bg-white text-black font-bold px-8 py-4 rounded-full flex items-center gap-2 mx-auto hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-cyan"
                    >
                        {step === 1 ? "INITIALIZE AVATAR" : "UPLOAD TO NEURAL NET"}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
