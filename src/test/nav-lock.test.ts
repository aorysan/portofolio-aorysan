import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { shouldSuppressSpy, useNavLock, NAV_LOCK_MS } from '../hooks/useNavLock';

describe('NavRail navigation lock (spy suppression)', () => {
  it('suppresses a stale spy update for a different index while lock is fresh', () => {
    const now = 1_000_000;
    const lock = { index: 4, until: now + NAV_LOCK_MS };
    expect(shouldSuppressSpy(lock, 5, now)).toBe(true);
  });

  it('does not suppress the locked index itself (idempotent re-confirm)', () => {
    const now = 1_000_000;
    const lock = { index: 4, until: now + NAV_LOCK_MS };
    expect(shouldSuppressSpy(lock, 4, now)).toBe(false);
  });

  it('does not suppress anything after the lock expires', () => {
    const now = 1_000_000;
    const lock = { index: 4, until: now + NAV_LOCK_MS };
    expect(shouldSuppressSpy(lock, 5, now + NAV_LOCK_MS + 1)).toBe(false);
  });

  it('does not suppress anything without a lock (free manual scroll)', () => {
    expect(shouldSuppressSpy(null, 5, 1_000_000)).toBe(false);
  });

  it('useNavLock ignores stale spy index right after lock(), accepts the locked index', () => {
    const seen: number[] = [];
    const { result } = renderHook(() => useNavLock((i) => seen.push(i)));
    act(() => {
      result.current.lock(4);
    });
    act(() => {
      result.current.handleSpy(5);
    });
    expect(seen).toEqual([]);
    act(() => {
      result.current.handleSpy(4);
    });
    expect(seen).toEqual([4]);
  });
});
