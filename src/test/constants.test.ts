import { describe, it, expect } from 'vitest';
import {
  PILOT_DOSSIER,
  MISSIONS_DATA,
  TECH_ARSENAL,
  APTITUDES,
  SERVICE_RECORDS,
} from '../lib/constants';

describe('Gamified Constants', () => {
  it('should have complete PILOT_DOSSIER data matching stop-slop rules', () => {
    expect(PILOT_DOSSIER.callsign).toBe('ARYO ADI PUTRO');
    expect(PILOT_DOSSIER.role).toBe('FULL STACK DEVELOPER');
    expect(PILOT_DOSSIER.location).toBe('MALANG, JAWA TIMUR');
    expect(PILOT_DOSSIER.status).toBe('AVAILABLE');
  });

  it('should define all missions with mapped difficulty ratings', () => {
    expect(MISSIONS_DATA.length).toBeGreaterThanOrEqual(6);
    const kampungku = MISSIONS_DATA.find((m) => m.title === 'KampungKu');
    expect(kampungku).toBeDefined();
    expect(kampungku?.difficulty).toBe(4);
    expect(kampungku?.status).toBe('COMPLETED');
  });

  it('should define tech items with assigned rarities', () => {
    const reactTech = TECH_ARSENAL.flatMap((cat) => cat.items).find((i) => i.name === 'React & Next.js');
    expect(reactTech).toBeDefined();
    expect(reactTech?.rarity).toBe('Legendary');
  });

  it('should define aptitudes with alternating cyan and magenta colors', () => {
    expect(APTITUDES.length).toBe(4);
    expect(APTITUDES[0].color).toBe('#00D4FF');
    expect(APTITUDES[1].color).toBe('#FF00FF');
  });
});
