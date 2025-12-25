import { useRef, useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { getStats } from '@/lib/gamification';

export default function SFAchievementCard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [downloading, setDownloading] = useState(false);

    const generateImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const stats = getStats();

        // Background
        const grad = ctx.createLinearGradient(0, 0, 600, 400);
        grad.addColorStop(0, '#000000');
        grad.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 400);

        // Border
        ctx.strokeStyle = '#bc13fe'; // Neon Purple
        ctx.lineWidth = 10;
        ctx.strokeRect(0, 0, 600, 400);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px monospace';
        ctx.fillText('SKILLFORGE PROTOCOL', 40, 60);

        // Rank
        ctx.fillStyle = '#bc13fe';
        ctx.font = 'bold 50px sans-serif';
        ctx.fillText(stats.rank.toUpperCase(), 40, 140);

        ctx.fillStyle = '#666';
        ctx.font = '20px monospace';
        ctx.fillText(`LEVEL ${Math.floor(stats.xp / 50) + 1} OPERATIVE`, 40, 170);

        // Stats Box
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(40, 220, 520, 140);

        ctx.fillStyle = '#00f3ff'; // Neon Cyan
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`${stats.xp}`, 80, 280);
        ctx.fillStyle = '#aaa';
        ctx.font = '16px monospace';
        ctx.fillText('TOTAL XP', 80, 310);

        ctx.fillStyle = '#ff0080'; // Neon Pink
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`${stats.streak}`, 280, 280);
        ctx.fillStyle = '#aaa';
        ctx.font = '16px monospace';
        ctx.fillText('DAY STREAK', 280, 310);

        ctx.fillStyle = '#ffff00'; // Yellow
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`${stats.careerScore}%`, 480, 280);
        ctx.fillStyle = '#aaa';
        ctx.font = '16px monospace';
        ctx.fillText('READY', 480, 310);

        // Download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `skillforge-achievement-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <h3 className="flex items-center gap-2 font-bold text-white mb-4">
                <Share2 className="w-5 h-5" /> SHARE PROGRESS
            </h3>

            <div className="flex flex-col items-center gap-4">
                {/* Hidden Canvas for generation */}
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="w-full max-w-[300px] h-auto border border-white/20 rounded shadow-lg opacity-50 hover:opacity-100 transition-opacity"
                />

                <button
                    onClick={generateImage}
                    className="w-full py-3 bg-neon-purple text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    DOWNLOAD CARD
                </button>
            </div>
        </div>
    );
}
