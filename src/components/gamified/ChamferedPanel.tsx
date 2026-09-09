import React from 'react';

export interface ChamferedPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'button' | 'section' | React.ElementType;
  size?: 'sm' | 'md';
  glow?: 'green' | 'cyan' | 'magenta' | 'gold' | 'none';
  borderVariant?: 'default' | 'highlight' | 'none';
  children: React.ReactNode;
}

const ChamferedPanel: React.FC<ChamferedPanelProps> = ({
  as: Component = 'div',
  size = 'md',
  glow = 'none',
  borderVariant = 'default',
  className = '',
  children,
  ...props
}) => {
  const chamferClass = size === 'sm' ? 'chamfer-sm' : 'chamfer';
  const glowClass = glow !== 'none' ? `glow-${glow}` : '';
  const borderClass =
    borderVariant === 'highlight'
      ? 'border border-[#00FF88]/60'
      : borderVariant === 'default'
      ? 'border border-[#2A2A3A]'
      : '';

  return (
    <Component
      className={`bg-[#12121A] text-[#E0E0E0] ${chamferClass} ${borderClass} ${glowClass} ${className}`}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Component>
  );
};

export default ChamferedPanel;
