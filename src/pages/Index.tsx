import React from 'react';
import { TactileSoundProvider } from '@/components/dossier/TactileSoundManager';
import { DossierShell } from '@/components/dossier/DossierShell';

const Index: React.FC = () => {
  return (
    <TactileSoundProvider>
      <DossierShell />
    </TactileSoundProvider>
  );
};

export default Index;

