import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type TactileSoundType = 'paperSlide' | 'stampThud' | 'tapePeel' | 'penClick';

export interface TactileSoundContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: TactileSoundType) => void;
}

const STORAGE_KEY = 'dossier_sound_muted';

let sharedAudioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioContext) {
    try {
      sharedAudioContext = new AudioCtx();
    } catch {
      return null;
    }
  }
  if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer | null {
  try {
    if (typeof ctx.createBuffer !== 'function') return null;
    const sampleRate = ctx.sampleRate || 44100;
    const bufferSize = Math.max(1, Math.floor(sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  } catch {
    return null;
  }
}

function playPaperSlide(ctx: AudioContext) {
  const duration = 0.25;
  const now = ctx.currentTime;
  const noiseBuffer = createNoiseBuffer(ctx, duration);
  if (!noiseBuffer) return;

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(1.5, now);
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(350, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
  source.stop(now + duration);
}

function playStampThud(ctx: AudioContext) {
  const duration = 0.18;
  const now = ctx.currentTime;

  // Sine sweep for low thud impact
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(90, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + duration);

  oscGain.gain.setValueAtTime(0.25, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);

  // Small noise burst for wooden stamp texture
  const noiseDuration = 0.04;
  const noiseBuffer = createNoiseBuffer(ctx, noiseDuration);
  if (noiseBuffer) {
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(600, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDuration);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + noiseDuration);
  }
}

function playTapePeel(ctx: AudioContext) {
  const duration = 0.12;
  const now = ctx.currentTime;
  const noiseBuffer = createNoiseBuffer(ctx, duration);
  if (!noiseBuffer) return;

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(2200, now);
  filter.frequency.linearRampToValueAtTime(3400, now + 0.04);
  filter.frequency.linearRampToValueAtTime(1800, now + 0.08);
  filter.frequency.linearRampToValueAtTime(2800, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
  source.stop(now + duration);
}

function playPenClick(ctx: AudioContext) {
  const duration = 0.03;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

export function playTactileSound(type: TactileSoundType) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    switch (type) {
      case 'paperSlide':
        playPaperSlide(ctx);
        break;
      case 'stampThud':
        playStampThud(ctx);
        break;
      case 'tapePeel':
        playTapePeel(ctx);
        break;
      case 'penClick':
        playPenClick(ctx);
        break;
    }
  } catch {
    // Gracefully ignore audio execution errors
  }
}

const TactileSoundContext = createContext<TactileSoundContextValue>({
  isMuted: false,
  toggleMute: () => {},
  playSound: () => {},
});

export const TactileSoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isMuted));
    } catch {
      // In case localStorage is blocked
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playSound = useCallback(
    (type: TactileSoundType) => {
      if (isMuted) return;
      playTactileSound(type);
    },
    [isMuted]
  );

  return (
    <TactileSoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </TactileSoundContext.Provider>
  );
};

export const useTactileSound = () => useContext(TactileSoundContext);
