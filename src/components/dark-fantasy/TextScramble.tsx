import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const RUNIC_GLYPHS = '᚛᚜⟐⟡⚡︎ᛟᚦᚨᚱᚲᚷᚹᚺᚻᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞ';

interface TextScrambleProps {
  text: string;
  className?: string;
  trigger?: boolean;
  duration?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  id?: string;
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  trigger = true,
  duration = 800,
  as: Component = 'span',
  id,
}) => {
  const reducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(reducedMotion ? text : '');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || !trigger) {
      setDisplayText(text);
      return;
    }

    const chars = text.split('');
    const length = chars.length;
    const startTime = Date.now();

    const updateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const resolvedCount = Math.floor(progress * length);

      const scrambled = chars
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < resolvedCount) return char;
          const randomGlyph = RUNIC_GLYPHS[Math.floor(Math.random() * RUNIC_GLYPHS.length)];
          return randomGlyph;
        })
        .join('');

      setDisplayText(scrambled);

      if (progress < 1) {
        timerRef.current = window.setTimeout(updateFrame, 40);
      } else {
        setDisplayText(text);
      }
    };

    timerRef.current = window.setTimeout(updateFrame, 40);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [text, trigger, duration, reducedMotion]);

  return (
    <Component id={id} className={className} aria-label={text}>
      {displayText || text}
    </Component>
  );
};
