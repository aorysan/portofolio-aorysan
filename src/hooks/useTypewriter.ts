import { useState, useEffect } from 'react';

export function useTypewriter(
  lines: string[],
  charSpeed: number = 30,
  lineDelay: number = 250,
  onComplete?: () => void
) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsFinished(true);
      onComplete?.();
      return;
    }

    const currentTargetLine = lines[currentLineIndex];

    if (currentCharIndex < currentTargetLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex] = currentTargetLine.slice(0, currentCharIndex + 1);
          return updated;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, charSpeed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, lineDelay);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, lines, charSpeed, lineDelay, onComplete]);

  const skip = () => {
    setDisplayedLines(lines);
    setCurrentLineIndex(lines.length);
    setIsFinished(true);
    onComplete?.();
  };

  return { displayedLines, isFinished, skip };
}
