import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  className?: string;
  glitchOnHover?: boolean;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  as: Component = 'span',
  className = '',
  glitchOnHover = true,
}) => {
  return (
    <Component
      data-text={text}
      className={`font-display tracking-wider ${
        glitchOnHover ? 'hover:animate-glitch' : ''
      } ${className}`}
    >
      {text}
    </Component>
  );
};

export default GlitchText;
