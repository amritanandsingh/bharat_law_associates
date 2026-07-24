import React from 'react';
import { renderWithProviders, screen, fireEvent } from '../../test-utils/renderWithProviders';
import LawyerCard from './LawyerCard';

// Fixture modeled on the real src/data/lawyers.js shape.
const baseLawyer = {
  id: 'prem-prakash',
  name: 'Prem Prakash',
  qualification: 'B.A. LL.B, LL.M — University of Calcutta',
  founder: true,
  roleKey: 'about.founderRole',
  phone: '+919354456326',
  email: 'prem1249@gmail.com',
  photo: '/lawyers/prem-prakash.jpg',
  objectPosition: 'center 30%',
};

const make = (overrides = {}) => ({ ...baseLawyer, ...overrides });

// Renders the initials avatar (no photo) and returns its text content.
const avatarText = (lawyer) => {
  const { container } = renderWithProviders(<LawyerCard lawyer={lawyer} />);
  return container.querySelector('.lawyer-avatar')?.textContent;
};

describe('LawyerCard', () => {
  it('renders the name, qualification and translated role', () => {
    renderWithProviders(<LawyerCard lawyer={make()} />);
    expect(screen.getByRole('heading', { level: 4, name: 'Prem Prakash' })).toBeInTheDocument();
    expect(
      screen.getByText('B.A. LL.B, LL.M — University of Calcutta')
    ).toBeInTheDocument();
    // about.founderRole in en/common.json
    expect(screen.getByText('Founder & Managing Advocate')).toBeInTheDocument();
  });

  it('falls back to founder/advocate role when no roleKey is given', () => {
    const { rerender } = renderWithProviders(
      <LawyerCard lawyer={make({ roleKey: undefined, founder: true })} />
    );
    expect(screen.getByText('Founder & Managing Advocate')).toBeInTheDocument();

    rerender(<LawyerCard lawyer={make({ roleKey: undefined, founder: false })} />);
    expect(screen.getByText('Advocate')).toBeInTheDocument();
  });

  describe('photo', () => {
    it('renders a lazy image with alt text equal to the name when a photo exists', () => {
      renderWithProviders(<LawyerCard lawyer={make()} />);
      const img = screen.getByRole('img', { name: 'Prem Prakash' });
      expect(img).toHaveAttribute('src', '/lawyers/prem-prakash.jpg');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('shows an initials avatar (no image) when there is no photo', () => {
      const { container } = renderWithProviders(
        <LawyerCard lawyer={make({ photo: '' })} />
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(container.querySelector('.lawyer-avatar')).toBeInTheDocument();
    });

    it('falls back to the initials avatar if the photo fails to load', () => {
      const { container } = renderWithProviders(<LawyerCard lawyer={make()} />);
      const img = screen.getByRole('img', { name: 'Prem Prakash' });
      fireEvent.error(img);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(container.querySelector('.lawyer-avatar')).toHaveTextContent('PP');
    });
  });

  describe('contact links', () => {
    it('renders the phone link with a tel href and a name-scoped aria-label', () => {
      renderWithProviders(<LawyerCard lawyer={make()} />);
      const phone = screen.getByRole('link', { name: 'Call Prem Prakash' });
      expect(phone).toHaveAttribute('href', 'tel:+919354456326');
    });

    it('renders the email link with a mailto href', () => {
      const { container } = renderWithProviders(<LawyerCard lawyer={make()} />);
      const email = container.querySelector('a[href^="mailto:"]');
      expect(email).toHaveAttribute(
        'href',
        expect.stringContaining('mailto:prem1249@gmail.com')
      );
    });

    it('gives the email link a name-scoped accessible name (a11y parity with phone)', () => {
      renderWithProviders(<LawyerCard lawyer={make()} />);
      // Should be distinguishable per-lawyer, like the phone link.
      expect(
        screen.getByRole('link', { name: 'Mail Prem Prakash' })
      ).toBeInTheDocument();
    });

    it('hides the contact block entirely when there is no phone or email', () => {
      const { container } = renderWithProviders(
        <LawyerCard lawyer={make({ phone: '', email: '' })} />
      );
      expect(container.querySelector('.lawyer-contact')).not.toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders the phone link but no email link when email is empty (shruti-jain case)', () => {
      const { container } = renderWithProviders(
        <LawyerCard lawyer={make({ email: '' })} />
      );
      expect(screen.getByRole('link', { name: 'Call Prem Prakash' })).toBeInTheDocument();
      expect(container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    });
  });

  describe('initials generation', () => {
    it('uses the first letters of the first two words', () => {
      expect(avatarText(make({ photo: '', name: 'Prem Prakash' }))).toBe('PP');
    });

    it('ignores extra internal whitespace', () => {
      expect(avatarText(make({ photo: '', name: 'Prem  Prakash' }))).toBe('PP');
    });

    it('ignores leading/trailing whitespace', () => {
      expect(avatarText(make({ photo: '', name: ' Shruti Jain ' }))).toBe('SJ');
    });

    it('upper-cases the initials regardless of input casing', () => {
      expect(avatarText(make({ photo: '', name: 'prem prakash' }))).toBe('PP');
    });

    it('caps initials at two letters', () => {
      expect(avatarText(make({ photo: '', name: 'Ram Kumar Sharma' }))).toBe('RK');
    });

    it('renders without throwing for an empty name', () => {
      expect(() =>
        renderWithProviders(<LawyerCard lawyer={make({ photo: '', name: '' })} />)
      ).not.toThrow();
    });
  });

  it('renders without throwing when the lawyer prop is missing', () => {
    expect(() => renderWithProviders(<LawyerCard />)).not.toThrow();
  });
});
