import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens & CSS Configuration', () => {
  it('defines all required Dark Fantasy color variables in index.css without overwriting HSL channels with hex', () => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf-8');
    expect(cssContent).toContain('--color-ash: #0a0908');
    expect(cssContent).toContain('--color-soot: #12100e');
    expect(cssContent).toContain('--color-iron: #1c1a17');
    expect(cssContent).toContain('--color-stone: #2a2723');
    expect(cssContent).toContain('--color-bone: #d6cfc2');
    expect(cssContent).toContain('--color-parchment: #b7ad99');
    expect(cssContent).toContain('--color-blood: #7c1f1a');
    expect(cssContent).toContain('--color-ember: #b4442e');
    expect(cssContent).toContain('--color-rust: #8a4b2b');
    expect(cssContent).toContain('--color-verdigris: #4d6155');

    // index.css:392-393 bug fix: ensure --background is not overwritten with hex in :root
    expect(cssContent).not.toContain('--background: var(--color-ash);');
    expect(cssContent).not.toContain('--foreground: var(--color-bone);');
  });

  it('verifies tailwind.config.ts exposes dark fantasy colors mapped to CSS variables', () => {
    const tailwindConfig = fs.readFileSync(path.resolve(__dirname, '../../tailwind.config.ts'), 'utf-8');
    expect(tailwindConfig).toContain("ash: 'var(--color-ash)'");
    expect(tailwindConfig).toContain("soot: 'var(--color-soot)'");
    expect(tailwindConfig).toContain("stone: 'var(--color-stone)'");
    expect(tailwindConfig).toContain("bone: 'var(--color-bone)'");
    expect(tailwindConfig).toContain("ember: 'var(--color-ember)'");
    expect(tailwindConfig).toContain("verdigris: 'var(--color-verdigris)'");
  });
});
