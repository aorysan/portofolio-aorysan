import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StatBarProps {
  label: string;
  value: number;
  color?: '#00D4FF' | '#FF00FF' | '#00FF88';
}

const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  color = '#00D4FF',
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      const tween = gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'expo.out', transformOrigin: 'left' }
      );
      return () => {
        tween.kill();
      };
    }
  }, [value]);

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs font-mono tracking-widest text-[#94A3B8]">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-1 w-full bg-[#1C1C2E] overflow-hidden">
        <div
          ref={barRef}
          className="h-full"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default StatBar;
