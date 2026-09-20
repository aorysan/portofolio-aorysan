import { describe, it, expect } from 'vitest';
import {
  HERO_DATA,
  CREED_DATA,
  ARSENAL_DATA,
  CAMPAIGNS_DATA,
  VISION_DATA,
  SUMMON_DATA,
} from '../lib/dark-fantasy-data';

describe('Dark Fantasy Data Module', () => {
  it('exports valid hero data with callsign Aryo A.P', () => {
    expect(HERO_DATA.callsign).toBe('Aryo A.P');
    expect(HERO_DATA.headlineTop).toBe('BEYOND');
    expect(HERO_DATA.headlineBottom).toBe('THE WALLS');
  });

  it('includes all 6 campaigns mapped to wall sectors with optional wallZone and era', () => {
    expect(CAMPAIGNS_DATA.length).toBe(6);
    const titles = CAMPAIGNS_DATA.map((c) => c.title);
    expect(titles).toContain('KampungKu');
    expect(titles).toContain('Rest Area Business - Idle Tycoon Game');
    expect(titles).toContain('TrasMart');
    expect(titles).toContain('SarPras');
    expect(titles).toContain('FrameWork');
    expect(titles).toContain('Jawara');

    const sinaCampaigns = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'sina');
    const roseCampaigns = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'rose');
    const mariaCampaigns = CAMPAIGNS_DATA.filter((c) => c.wallZone === 'maria');

    expect(sinaCampaigns.length).toBe(2);
    expect(roseCampaigns.length).toBe(3);
    expect(mariaCampaigns.length).toBe(1);
  });

  it('exports 4 arsenal quadrants', () => {
    expect(ARSENAL_DATA.length).toBe(4);
  });
});
