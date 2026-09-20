import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { SOUNDS, playSyntheticSound } from '../lib/sounds';
import { SoundProvider, useSound } from '../components/gamified/SoundManager';
import { useSoundEffect } from '../hooks/useSoundEffect';

describe('Sound Registry and Synthetic Audio Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should define all 7 required sound keys', () => {
    expect(SOUNDS.BOOT_TYPE).toBe('/audio/boot-type.mp3');
    expect(SOUNDS.BOOT_COMPLETE).toBe('/audio/boot-done.mp3');
    expect(SOUNDS.UI_HOVER).toBe('/audio/ui-hover.mp3');
    expect(SOUNDS.UI_CLICK).toBe('/audio/ui-click.mp3');
    expect(SOUNDS.PANEL_OPEN).toBe('/audio/panel-open.mp3');
    expect(SOUNDS.PANEL_CLOSE).toBe('/audio/panel-close.mp3');
    expect(SOUNDS.AMBIENT).toBe('/audio/ambient-loop.mp3');
  });

  it('should safely execute playSyntheticSound without crashing in headless environment', () => {
    expect(() => playSyntheticSound('UI_CLICK')).not.toThrow();
    expect(() => playSyntheticSound('UI_HOVER')).not.toThrow();
    expect(() => playSyntheticSound('PANEL_OPEN')).not.toThrow();
    expect(() => playSyntheticSound('PANEL_CLOSE')).not.toThrow();
    expect(() => playSyntheticSound('BOOT_TYPE')).not.toThrow();
    expect(() => playSyntheticSound('BOOT_COMPLETE')).not.toThrow();
    expect(() => playSyntheticSound('AMBIENT')).not.toThrow();
  });

  it('should synthesize audio when AudioContext is available', () => {
    const mockOscillator = {
      type: '',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    const mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    const mockCtx = {
      currentTime: 1.0,
      state: 'running',
      destination: {},
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGain),
      resume: vi.fn().mockResolvedValue(undefined),
    };

    const originalAudioContext = window.AudioContext;
    (window as unknown as { AudioContext: unknown }).AudioContext = vi.fn(() => mockCtx);

    try {
      playSyntheticSound('UI_HOVER');
      playSyntheticSound('UI_CLICK');
      playSyntheticSound('PANEL_OPEN');
      playSyntheticSound('PANEL_CLOSE');
      playSyntheticSound('BOOT_TYPE');
      playSyntheticSound('BOOT_COMPLETE');
    } finally {
      (window as unknown as { AudioContext: unknown }).AudioContext = originalAudioContext;
    }
  });

  it('should not allocate audio nodes for unhandled keys like AMBIENT', () => {
    const createOscillatorMock = vi.fn();
    const createGainMock = vi.fn();
    const mockCtx = {
      currentTime: 1.0,
      state: 'running',
      destination: {},
      createOscillator: createOscillatorMock,
      createGain: createGainMock,
      resume: vi.fn().mockResolvedValue(undefined),
    };

    const originalAudioContext = window.AudioContext;
    (window as unknown as { AudioContext: unknown }).AudioContext = vi.fn(() => mockCtx);

    try {
      playSyntheticSound('AMBIENT');
      expect(createOscillatorMock).not.toHaveBeenCalled();
      expect(createGainMock).not.toHaveBeenCalled();
    } finally {
      (window as unknown as { AudioContext: unknown }).AudioContext = originalAudioContext;
    }
  });
});

describe('SoundManager and SoundProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with muted state by default and write to localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundProvider, null, children);

    const { result } = renderHook(() => useSound(), { wrapper });

    expect(result.current.isMuted).toBe(true);
    expect(localStorage.getItem('valkyrie_terminal_muted')).toBe('true');
  });

  it('should initialize with saved state from localStorage if false', () => {
    localStorage.setItem('valkyrie_terminal_muted', 'false');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundProvider, null, children);

    const { result } = renderHook(() => useSound(), { wrapper });

    expect(result.current.isMuted).toBe(false);
  });

  it('should toggle mute state and update localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundProvider, null, children);

    const { result } = renderHook(() => useSound(), { wrapper });

    expect(result.current.isMuted).toBe(true);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(false);
    expect(localStorage.getItem('valkyrie_terminal_muted')).toBe('false');

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(true);
    expect(localStorage.getItem('valkyrie_terminal_muted')).toBe('true');
  });

  it('should not play sound when muted', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundProvider, null, children);

    const { result } = renderHook(() => useSound(), { wrapper });
    expect(result.current.isMuted).toBe(true);

    expect(() => {
      result.current.playSound('UI_CLICK');
    }).not.toThrow();
  });
});

describe('useSoundEffect hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return play function and isMuted flag', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundProvider, null, children);

    const { result } = renderHook(() => useSoundEffect('UI_CLICK'), { wrapper });

    expect(result.current.isMuted).toBe(true);
    expect(typeof result.current.play).toBe('function');

    expect(() => {
      act(() => {
        result.current.play();
      });
    }).not.toThrow();
  });

  it('should trigger playSound when play is called', () => {
    localStorage.setItem('valkyrie_terminal_muted', 'false');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundProvider, null, children);

    const { result } = renderHook(() => useSoundEffect('UI_HOVER'), { wrapper });

    expect(result.current.isMuted).toBe(false);

    act(() => {
      result.current.play();
    });
  });
});
