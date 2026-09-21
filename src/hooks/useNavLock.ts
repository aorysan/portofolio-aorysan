import { useCallback, useRef } from 'react';

// How long after a rail/ADVANCE click the scroll-spy stays muted for
// foreign indices. Must exceed the Lenis scrollTo duration (1.4s) so the
// highlight can't flicker to a stale trigger mid-flight.
export const NAV_LOCK_MS = 1700;

export interface NavLock {
  index: number;
  until: number;
}

// Pure predicate (unit-tested): a spy update is stale when a fresh
// navigation lock exists for a DIFFERENT index.
export function shouldSuppressSpy(lock: NavLock | null, index: number, now: number): boolean {
  return !!lock && now < lock.until && index !== lock.index;
}

export function useNavLock(onActive: (index: number) => void) {
  const lockRef = useRef<NavLock | null>(null);

  const lock = useCallback((index: number, now: number = Date.now()) => {
    lockRef.current = { index, until: now + NAV_LOCK_MS };
  }, []);

  const handleSpy = useCallback(
    (index: number) => {
      if (shouldSuppressSpy(lockRef.current, index, Date.now())) return;
      lockRef.current = null;
      onActive(index);
    },
    [onActive]
  );

  return { lock, handleSpy };
}
