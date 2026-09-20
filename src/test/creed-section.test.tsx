import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreedSection } from '../components/dark-fantasy/CreedSection';

describe('CreedSection Component', () => {
  it('renders section heading and semantic section with aria-labelledby', () => {
    render(<CreedSection />);
    const section = document.getElementById('creed');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'creed-heading');
    // NOTE (Task 6 deviation): brief verbatim `getByLabelText('01 — THE CREED')`
    // matches TWICE once the linkage is correct — the <section> (via
    // aria-labelledby resolution) and the <span id="creed-heading"> (via
    // aria-label). Disambiguate with selector; asserts the same heading node.
    expect(
      screen.getByLabelText('01 — THE CREED', { selector: '#creed-heading' })
    ).toBeInTheDocument();
  });
});
