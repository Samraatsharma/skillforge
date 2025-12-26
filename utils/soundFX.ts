import { Howl } from 'howler';

const SOUNDS = {
    hover: '/sounds/hover.mp3',
    click: '/sounds/click.mp3',
    open: '/sounds/open.mp3',
    success: '/sounds/success.wav',
    rankup: '/sounds/rankup.wav',
    mentor: '/sounds/mentor.mp3',
};

class SoundFX {
    private sounds: Record<string, Howl> = {};
    private muted: boolean = true; // Default to muted
    private ctx: AudioContext | null = null; // Fallback Synth Context

    constructor() {
        // Sound System Disabled by User Request
    }

    private playSynth(type: 'hover' | 'click' | 'success' | 'alert') {
        // SILENCED
        return;
    }

    public play(key: keyof typeof SOUNDS) {
        // SILENCED
        return;
    }

    public toggleMute() {
        return true; // Always muted
    }

    public isMuted() {
        return true;
    }
}

export const sfx = new SoundFX();
