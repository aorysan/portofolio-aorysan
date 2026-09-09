import React, { useState } from 'react';
import { SoundProvider } from '@/components/gamified/SoundManager';
import GridBackground from '@/components/gamified/GridBackground';
import BootSequence from '@/components/gamified/BootSequence';
import HUDDashboard from '@/components/gamified/HUDDashboard';

const Index: React.FC = () => {
  const [bootCompleted, setBootCompleted] = useState(false);

  return (
    <SoundProvider>
      <div className="relative min-h-screen bg-[#0A0A0F] text-[#E0E0E0] overflow-x-hidden selection:bg-[#00FF88] selection:text-[#0A0A0F]">
        <GridBackground />
        {!bootCompleted ? (
          <BootSequence onComplete={() => setBootCompleted(true)} />
        ) : (
          <HUDDashboard />
        )}
      </div>
    </SoundProvider>
  );
};

export default Index;
