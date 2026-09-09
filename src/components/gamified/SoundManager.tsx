import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { playSyntheticSound, SoundKey } from '@/lib/sounds';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (key: SoundKey) => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: () => {},
  playSound: () => {},
});

const STORAGE_KEY = 'valkyrie_terminal_muted';

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playSound = useCallback((key: SoundKey) => {
    if (isMuted) return;
    playSyntheticSound(key);
  }, [isMuted]);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
