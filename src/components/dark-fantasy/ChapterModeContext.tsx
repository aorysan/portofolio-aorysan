import { createContext, useContext } from 'react';

export interface ChapterModeContextType {
  mode: 'fluid' | 'chapter';
  scrollFXEnabled: boolean;
}

export const ChapterModeContext = createContext<ChapterModeContextType>({
  mode: 'fluid',
  scrollFXEnabled: true,
});

export const useChapterMode = () => useContext(ChapterModeContext);
