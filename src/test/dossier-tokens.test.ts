import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Dossier Design Tokens and Typography Setup', () => {
  const rootDir = path.resolve(__dirname, '../../');
  const indexHtmlPath = path.resolve(rootDir, 'index.html');
  const tailwindConfigPath = path.resolve(rootDir, 'tailwind.config.ts');
  const indexCssPath = path.resolve(rootDir, 'src/index.css');
  const packageJsonPath = path.resolve(rootDir, 'package.json');

  it('should have Google Fonts preconnect and links for Caveat, Cinzel, and EB Garamond in index.html', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf-8');
    expect(html).toContain('family=Caveat:wght@500;700');
    expect(html).toContain('family=Cinzel:wght@500;700;900');
    expect(html).toContain('family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600');
    expect(html).toContain('<title>Eren Vanguard | Pakar Rekayasa Antarmuka</title>');
    expect(html).toContain('"name": "Eren Vanguard"');
    expect(html).toContain('"jobTitle": "Pakar Rekayasa Antarmuka"');
  });

  it('should configure dossier font families in tailwind.config.ts', () => {
    const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
    expect(tailwindConfig).toMatch(/cinzel:\s*\[['"]Cinzel['"]/);
    expect(tailwindConfig).toMatch(/garamond:\s*\[['"]EB Garamond['"]/);
    expect(tailwindConfig).toMatch(/caveat:\s*\[['"]Caveat['"]/);
  });

  it('should configure dossier color tokens in tailwind.config.ts', () => {
    const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
    expect(tailwindConfig).toContain("parchment: '#E8DCC0'");
    expect(tailwindConfig).toContain("'parchment-light': '#F4EDE0'");
    expect(tailwindConfig).toContain("'parchment-dark': '#D8C7A5'");
    expect(tailwindConfig).toContain("iron: '#1C1B18'");
    expect(tailwindConfig).toContain("blood: '#8B3A2E'");
    expect(tailwindConfig).toContain("moss: '#3D4A34'");
    expect(tailwindConfig).toContain("desk: '#151412'");
    expect(tailwindConfig).toContain("marginalia: '#7A4B3A'");
    expect(tailwindConfig).toContain("rust: '#7A4B3A'");
  });

  it('should define dossier CSS custom properties and utility classes in src/index.css', () => {
    const css = fs.readFileSync(indexCssPath, 'utf-8');
    // CSS custom properties or color definitions
    expect(css).toContain('--parchment: #E8DCC0');
    expect(css).toContain('--iron: #1C1B18');
    expect(css).toContain('--blood: #8B3A2E');
    expect(css).toContain('--moss: #3D4A34');
    expect(css).toContain('--desk: #151412');
    expect(css).toContain('--marginalia: #7A4B3A');

    // Utility classes
    expect(css).toContain('.bg-parchment');
    expect(css).toContain('.text-iron');
    expect(css).toContain('.text-blood');
    expect(css).toContain('.font-cinzel');
    expect(css).toContain('.font-garamond');
    expect(css).toContain('.font-caveat');
    expect(css).toContain('.stamp-border');
    expect(css).toContain('.taped-edge');
    expect(css).toContain('.paper-texture');
    expect(css).toContain('.dossier-scrollbar');
  });

  it('should have animejs and its types installed in package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    expect(pkg.dependencies).toHaveProperty('animejs');
    expect(pkg.devDependencies).toHaveProperty('@types/animejs');
  });

  it('should import animejs runtime without error and expose core animation API', async () => {
    const animeModule = await import('animejs');
    const anime = animeModule.default;
    expect(typeof anime).toBe('function');
    expect(anime.timeline).toBeDefined();
    expect(anime.stagger).toBeDefined();
  });
});
