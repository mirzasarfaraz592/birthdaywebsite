/**
 * Web Audio API Sound Engine
 * Plays local audio (birthday-song.webm / light-song.webm) and synthesized effects.
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isPlayingMusic = false;
        this.musicTimeout = null;
        this.volume = 0.7;
        this.isMuted = false;
        
        // Local Custom Audio
        this.customAudio = null;
        this.customAudioUrl = 'birthday-song.webm'; // Default is dark mode song
        
        this.setupAudioElement();
    }

    setupAudioElement() {
        if (typeof document !== 'undefined') {
            this.customAudio = new Audio(this.customAudioUrl);
            this.customAudio.loop = true;
            this.customAudio.volume = this.volume;
            this.customAudio.preload = "auto";
            this.customAudio.load();
        }
    }

    setMode(mode) {
        this.customAudioUrl = mode === 'dark' ? 'birthday-song.webm' : 'light-song.webm';
        if (this.customAudio) {
            const wasPlaying = !this.customAudio.paused && this.isPlayingMusic;
            this.customAudio.src = this.customAudioUrl;
            this.customAudio.preload = "auto";
            this.customAudio.load();
            if (wasPlaying) {
                this.customAudio.play().catch(e => console.log(e));
            }
        }
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMute(mute) {
        this.isMuted = mute;
        if (this.customAudio) {
            this.customAudio.muted = mute;
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.customAudio) {
            this.customAudio.volume = this.volume;
        }
    }

    playTone(freq, type = 'sine', duration = 0.4, startTime = 0, gainLevel = 0.25) {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime + startTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 3, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(gainLevel * this.volume, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.05);
    }

    playPop() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

        gain.gain.setValueAtTime(0.4 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);

        this.playNoise(0.05, 1200, 0.25);
    }

    playNoise(duration = 0.3, filterFreq = 1000, maxGain = 0.2) {
        if (this.isMuted) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);
        filter.Q.setValueAtTime(3, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(maxGain * this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start();
    }

    playBlow() {
        this.init();
        if (this.isMuted) return;
        this.playNoise(0.6, 600, 0.35);
    }

    playSparkle() {
        this.init();
        if (this.isMuted) return;

        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        freqs.forEach((f, i) => {
            this.playTone(f, 'sine', 0.5, i * 0.08, 0.2);
        });
    }

    playHorn() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(420, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.4);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2 * this.volume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
    }

    playCheer() {
        this.init();
        if (this.isMuted) return;

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.playNoise(0.4 + Math.random() * 0.3, 1400 + Math.random() * 800, 0.15);
            }, i * 90);
        }

        setTimeout(() => {
            this.playTone(880, 'sine', 0.3, 0, 0.15);
            this.playTone(1174.66, 'sine', 0.4, 0.1, 0.18);
            this.playTone(1760, 'sine', 0.6, 0.25, 0.2);
        }, 200);
    }

    playHappyBirthdaySong(onFinish) {
        this.init();
        this.stopMusic();
        this.isPlayingMusic = true;

        if (this.customAudio) {
            this.customAudio.currentTime = 0;
            this.customAudio.play().catch(e => {
                console.log("Local audio playback blocked/failed, using synth fallback.", e);
                this.playSynthMelody(onFinish);
            });
            return;
        }

        this.playSynthMelody(onFinish);
    }

    playSynthMelody(onFinish) {
        const notes = {
            C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
            A4: 440.00, Bb4: 466.16, B4: 493.88, C5: 523.25, D5: 587.33,
            E5: 659.25, F5: 698.46, G5: 783.99
        };

        const melody = [
            ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
            ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
            ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1.5],
            ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2.5]
        ];

        const beatDuration = 0.42;
        let currentTimeOffset = 0;

        melody.forEach(([noteName, beats]) => {
            const freq = notes[noteName];
            const dur = beats * beatDuration;

            if (freq) {
                this.playTone(freq, 'triangle', dur * 0.9, currentTimeOffset, 0.22);
                this.playTone(freq * 0.5, 'sine', dur * 0.8, currentTimeOffset, 0.12);
                this.playTone(freq * 2, 'sine', dur * 0.4, currentTimeOffset, 0.08);
            }

            currentTimeOffset += dur;
        });

        this.musicTimeout = setTimeout(() => {
            if (this.isPlayingMusic) {
                if (typeof onFinish === 'function') {
                    onFinish();
                } else {
                    this.playSynthMelody();
                }
            }
        }, currentTimeOffset * 1000 + 1200);
    }

    stopMusic() {
        this.isPlayingMusic = false;
        if (this.customAudio) {
            this.customAudio.pause();
        }
        if (this.musicTimeout) {
            clearTimeout(this.musicTimeout);
            this.musicTimeout = null;
        }
    }

    toggleMusic() {
        if (this.isPlayingMusic) {
            this.stopMusic();
            return false;
        } else {
            this.playHappyBirthdaySong();
            return true;
        }
    }
}

// Global instance
window.soundEngine = new SoundEngine();
