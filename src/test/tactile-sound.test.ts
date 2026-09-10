import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import {
  TactileSoundProvider,
  useTactileSound,
  playTactileSound,
  getAudioContext,
} from '../components/dossier/TactileSoundManager';

describe('TactileSoundManager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should toggle mute and persist state in localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(TactileSoundProvider, null, children);

    const { result } = renderHook(() => useTactileSound(), { wrapper });
    expect(result.current.isMuted).toBe(false);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(true);
    expect(localStorage.getItem('dossier_sound_muted')).toBe('true');

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(false);
    expect(localStorage.getItem('dossier_sound_muted')).toBe('false');
  });

  it('should initialize with muted state from localStorage if previously set', () => {
    localStorage.setItem('dossier_sound_muted', 'true');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(TactileSoundProvider, null, children);

    const { result } = renderHook(() => useTactileSound(), { wrapper });
    expect(result.current.isMuted).toBe(true);
  });

  it('should safely play tactile sounds without throwing in headless environment', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(TactileSoundProvider, null, children);

    const { result } = renderHook(() => useTactileSound(), { wrapper });
    expect(() => {
      result.current.playSound('paperSlide');
      result.current.playSound('stampThud');
      result.current.playSound('tapePeel');
      result.current.playSound('penClick');
    }).not.toThrow();
  });

  it('should provide a safe fallback when used outside TactileSoundProvider', () => {
    const { result } = renderHook(() => useTactileSound());
    expect(result.current.isMuted).toBe(false);
    expect(typeof result.current.toggleMute).toBe('function');
    expect(typeof result.current.playSound).toBe('function');
    expect(() => result.current.playSound('penClick')).not.toThrow();
  });

  it('should synthesize audio when AudioContext is provided', () => {
    const mockChannelData = new Float32Array(1024);
    const mockBuffer = {
      getChannelData: vi.fn(() => mockChannelData),
    };

    const mockBufferSource = {
      buffer: null as unknown,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    const mockFilter = {
      type: '',
      Q: { setValueAtTime: vi.fn() },
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

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
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    const createOscillatorMock = vi.fn(() => ({ ...mockOscillator }));
    const createGainMock = vi.fn(() => ({ ...mockGain }));
    const createBufferSourceMock = vi.fn(() => ({ ...mockBufferSource }));
    const createBiquadFilterMock = vi.fn(() => ({ ...mockFilter }));
    const createBufferMock = vi.fn(() => mockBuffer);
    const resumeMock = vi.fn().mockResolvedValue(undefined);

    const mockCtx = {
      currentTime: 2.0,
      sampleRate: 44100,
      state: 'suspended',
      destination: {},
      createOscillator: createOscillatorMock,
      createGain: createGainMock,
      createBufferSource: createBufferSourceMock,
      createBiquadFilter: createBiquadFilterMock,
      createBuffer: createBufferMock,
      resume: resumeMock,
    };

    const originalAudioContext = window.AudioContext;
    (window as unknown as { AudioContext: unknown }).AudioContext = vi.fn(() => mockCtx);

    try {
      // Direct call tests
      playTactileSound('paperSlide');
      expect(createBufferMock).toHaveBeenCalled();
      expect(createBufferSourceMock).toHaveBeenCalled();
      expect(createBiquadFilterMock).toHaveBeenCalled();

      playTactileSound('stampThud');
      expect(createOscillatorMock).toHaveBeenCalled();

      playTactileSound('tapePeel');
      expect(createBiquadFilterMock).toHaveBeenCalled();

      playTactileSound('penClick');
      expect(createOscillatorMock).toHaveBeenCalled();

      // Hook integration test
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(TactileSoundProvider, null, children);
      const { result } = renderHook(() => useTactileSound(), { wrapper });

      // When unmuted
      act(() => {
        result.current.playSound('penClick');
      });

      // When muted, playSound should not invoke playTactileSound
      act(() => {
        result.current.toggleMute();
      });
      expect(result.current.isMuted).toBe(true);

      const oscCallCountBefore = createOscillatorMock.mock.calls.length;
      act(() => {
        result.current.playSound('penClick');
      });
      expect(createOscillatorMock.mock.calls.length).toBe(oscCallCountBefore);

      // Direct playTactileSound call should also respect localStorage muted flag
      localStorage.setItem('dossier_sound_muted', 'true');
      playTactileSound('penClick');
      expect(createOscillatorMock.mock.calls.length).toBe(oscCallCountBefore);
    } finally {
      (window as unknown as { AudioContext: unknown }).AudioContext = originalAudioContext;
    }
  });
});
