import '@testing-library/jest-dom';

// This environment's jsdom runs without localStorage support
// (node --localstorage-file not provided), so `localStorage` is undefined.
// Provide a minimal in-memory stub so providers and tests that rely on the
// Web Storage API behave the same as in a real browser.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  const stub = {
    getItem: (key: string): string | null =>
      store.has(key) ? (store.get(key) as string) : null,
    setItem: (key: string, value: string): void => {
      store.set(key, String(value));
    },
    removeItem: (key: string): void => {
      store.delete(key);
    },
    clear: (): void => {
      store.clear();
    },
    key: (index: number): string | null =>
      Array.from(store.keys())[index] ?? null,
    get length(): number {
      return store.size;
    },
  };
  Object.defineProperty(globalThis, 'localStorage', {
    value: stub,
    writable: true,
    configurable: true,
  });
}

