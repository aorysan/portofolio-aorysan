import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens & CSS Configuration', () => {
  it('defines all required Dark Fantasy color variables in index.css', () => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf-8');
    expect(cssContent).toContain('--color-ash: #0a0908');
    expect(cssContent).toContain('--color-bone: #d6cfc2');
    expect(cssContent).toContain('--color-blood: #7c1f1a');
    expect(cssContent).toContain('--color-ember: #b4442e');
    expect(cssContent).toContain('Cinzel');
    expect(cssContent).toContain('Oswald');
    expect(cssContent).toContain('Barlow');
  });
});
