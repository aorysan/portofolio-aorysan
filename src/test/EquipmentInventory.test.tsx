import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EquipmentInventory from '../components/gamified/EquipmentInventory';
import EquipmentCard from '../components/gamified/EquipmentCard';
import { SoundProvider } from '../components/gamified/SoundManager';
import { EquipmentItem } from '../lib/constants';

describe('EquipmentInventory Component', () => {
  it('should render equipment tabs and inventory items', () => {
    render(
      <SoundProvider>
        <EquipmentInventory onClose={vi.fn()} />
      </SoundProvider>
    );
    expect(screen.getByText(/TECH ARSENAL/i)).toBeInTheDocument();
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
    expect(screen.getByText('React & Next.js')).toBeInTheDocument();
  });

  it('should call onClose when clicking return button', () => {
    const handleClose = vi.fn();
    render(
      <SoundProvider>
        <EquipmentInventory onClose={handleClose} />
      </SoundProvider>
    );
    const returnBtn = screen.getByRole('button', { name: /RETURN TO HUD/i });
    fireEvent.click(returnBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should switch categories and display matching items when tabs are clicked', () => {
    render(
      <SoundProvider>
        <EquipmentInventory onClose={vi.fn()} />
      </SoundProvider>
    );

    // Initially in Frontend Development
    expect(screen.getByText('React & Next.js')).toBeInTheDocument();
    expect(screen.queryByText('Node.js & Express')).not.toBeInTheDocument();

    // Click Backend & Database
    const backendTab = screen.getByRole('button', { name: 'Backend & Database' });
    fireEvent.click(backendTab);

    expect(screen.getByText('Node.js & Express')).toBeInTheDocument();
    expect(screen.queryByText('React & Next.js')).not.toBeInTheDocument();

    // Click Tools & Infrastructure
    const toolsTab = screen.getByRole('button', { name: 'Tools & Infrastructure' });
    fireEvent.click(toolsTab);

    expect(screen.getByText('Git & GitHub')).toBeInTheDocument();
    expect(screen.queryByText('Node.js & Express')).not.toBeInTheDocument();
  });

  it('should render EquipmentCard with correct rarity styling and content', () => {
    const legendaryItem: EquipmentItem = {
      name: 'Legendary Weapon',
      rarity: 'Legendary',
      description: 'Supreme weapon',
    };

    const epicItem: EquipmentItem = {
      name: 'Epic Armor',
      rarity: 'Epic',
      description: 'Resilient armor',
    };

    const rareItem: EquipmentItem = {
      name: 'Rare Relic',
      rarity: 'Rare',
      description: 'Mysterious artifact',
    };

    const commonItem: EquipmentItem = {
      name: 'Common Boots',
      rarity: 'Common',
      description: 'Standard footwear',
    };

    const { rerender, container } = render(
      <SoundProvider>
        <EquipmentCard item={legendaryItem} />
      </SoundProvider>
    );

    expect(screen.getByText('Legendary Weapon')).toBeInTheDocument();
    expect(screen.getByText('Legendary')).toBeInTheDocument();
    expect(screen.getByText('Supreme weapon')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('glow-gold');

    rerender(
      <SoundProvider>
        <EquipmentCard item={epicItem} />
      </SoundProvider>
    );
    expect(screen.getByText('Epic Armor')).toBeInTheDocument();
    expect(screen.getByText('Epic')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('glow-magenta');

    rerender(
      <SoundProvider>
        <EquipmentCard item={rareItem} />
      </SoundProvider>
    );
    expect(screen.getByText('Rare Relic')).toBeInTheDocument();
    expect(screen.getByText('Rare')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('glow-cyan');

    rerender(
      <SoundProvider>
        <EquipmentCard item={commonItem} />
      </SoundProvider>
    );
    expect(screen.getByText('Common Boots')).toBeInTheDocument();
    expect(screen.getByText('Common')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('border-[#2A2A3A]');
  });
});
