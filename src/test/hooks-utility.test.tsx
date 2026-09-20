import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { splitWords, splitChars } from '../hooks/useTextSplit';

describe('Core Animation & A11y Hooks', () => {
  it('useReducedMotion returns false by default when window.matchMedia does not match reduce', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(typeof result.current).toBe('boolean');
    expect(result.current).toBe(false);
  });

  it('splitWords splits text into clean words', () => {
    const words = splitWords('SURVEY CORPS OF SOFTWARE');
    expect(words).toEqual(['SURVEY', 'CORPS', 'OF', 'SOFTWARE']);
  });

  it('splitChars splits text into individual characters', () => {
    const chars = splitChars('BEYOND');
    expect(chars).toEqual(['B', 'E', 'Y', 'O', 'N', 'D']);
  });

  it('useScrollReveal provides a ref and revealed state', () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.revealed).toBe('boolean');
  });
});
