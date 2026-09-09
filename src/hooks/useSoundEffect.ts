import { useCallback } from 'react';
import { useSound } from '@/components/gamified/SoundManager';
import { SoundKey } from '@/lib/sounds';

export function useSoundEffect(key: SoundKey) {
  const { playSound, isMuted } = useSound();
  
  const play = useCallback(() => {
    playSound(key);
  }, [playSound, key]);

  return { play, isMuted };
}
