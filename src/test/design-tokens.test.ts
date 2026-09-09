import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens and Styling Setup', () => {
  it('should include Orbitron font in index.html', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8');
    expect(html).toContain('Orbitron:wght@400;500;600;700;800;900');
  });

  it('should define the 3-accent sci-fi palette variables in index.css', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf-8');
    expect(css).toContain('--void: #0A0A0F');
    expect(css).toContain('--green: #00FF88');
    expect(css).toContain('--cyan: #00D4FF');
    expect(css).toContain('--magenta: #FF00FF');
    expect(css).toContain('--gold: #FFD700');
  });

  it('should define chamfer and glow utilities in gamified.css', () => {
    const gamifiedCss = fs.readFileSync(path.resolve(__dirname, '../styles/gamified.css'), 'utf-8');
    expect(gamifiedCss).toContain('.chamfer');
    expect(gamifiedCss).toContain('.chamfer-sm');
    expect(gamifiedCss).toContain('.glow-green');
    expect(gamifiedCss).toContain('.void-grid');
  });
});
