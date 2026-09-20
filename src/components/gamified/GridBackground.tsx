import React from 'react';

const GridBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 void-grid"
      aria-hidden="true"
    />
  );
};

export default GridBackground;
