import React from 'react';
import { TactileSoundProvider } from '@/components/dossier/TactileSoundManager';
import { DarkFantasyShell } from '@/components/dark-fantasy/DarkFantasyShell';

const Index: React.FC = () => {
  return (
    <TactileSoundProvider>
      <DarkFantasyShell />
    </TactileSoundProvider>
  );
};

export default Index;
