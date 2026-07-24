import React from 'react';
import { renderWithProviders, screen, within } from '../../test-utils/renderWithProviders';
import QuickActions from './QuickActions';
import { SITE } from '../../config/site';

// The component builds this greeting inline; mirror it to check encoded payloads.
const intro = `Hello ${SITE.name}, I would like to discuss a legal matter.`;
const encodedIntro = encodeURIComponent(intro);

const getNavs = () => {
  const navs = screen.getAllByRole('navigation', { name: 'Quick contact' });
  // Mobile action-bar is rendered first, desktop rail second.
  return { bar: navs[0], rail: navs[1] };
};

describe('QuickActions', () => {
  it('renders two labelled contact navs (mobile bar + desktop rail)', () => {
    renderWithProviders(<QuickActions />);
    const navs = screen.getAllByRole('navigation', { name: 'Quick contact' });
    expect(navs).toHaveLength(2);
    expect(navs[0]).toHaveClass('action-bar');
    expect(navs[1]).toHaveClass('action-rail');
  });

  it('renders exactly five actions in each nav', () => {
    renderWithProviders(<QuickActions />);
    const { bar, rail } = getNavs();
    expect(within(bar).getAllByRole('link')).toHaveLength(5);
    expect(within(rail).getAllByRole('link')).toHaveLength(5);
  });

  describe('action bar hrefs', () => {
    it('wires call / sms / mail / services to the right targets from SITE', () => {
      renderWithProviders(<QuickActions />);
      const { bar } = getNavs();

      expect(within(bar).getByRole('link', { name: 'Call' })).toHaveAttribute(
        'href',
        `tel:${SITE.phones[0].e164}`
      );

      const sms = within(bar).getByRole('link', { name: 'SMS' });
      expect(sms).toHaveAttribute('href', `sms:${SITE.phones[0].e164}?&body=${encodedIntro}`);

      const mail = within(bar).getByRole('link', { name: 'Mail' });
      expect(mail.getAttribute('href')).toContain(`mailto:${SITE.emails.general}`);
      expect(mail.getAttribute('href')).toContain(`body=${encodedIntro}`);

      expect(within(bar).getByRole('link', { name: 'Services' })).toHaveAttribute(
        'href',
        '/practice-areas'
      );
    });
  });

  describe('WhatsApp link', () => {
    it('points at wa.me with the intro payload and opens safely in a new tab', () => {
      renderWithProviders(<QuickActions />);
      const { bar } = getNavs();
      const wa = within(bar).getByRole('link', { name: 'WhatsApp' });
      expect(wa).toHaveAttribute(
        'href',
        `https://wa.me/${SITE.whatsapp.number}?text=${encodedIntro}`
      );
      expect(wa).toHaveAttribute('target', '_blank');
      expect(wa).toHaveAttribute('rel', 'noreferrer');
      expect(wa).toHaveClass('action-whatsapp');
    });

    it('applies the brand class and safe-tab attributes on the desktop rail too', () => {
      renderWithProviders(<QuickActions />);
      const { rail } = getNavs();
      const wa = within(rail).getByRole('link', { name: 'WhatsApp' });
      expect(wa).toHaveClass('rail-whatsapp');
      expect(wa).toHaveAttribute('target', '_blank');
      expect(wa).toHaveAttribute('rel', 'noreferrer');
    });
  });

  it('exposes an accessible name (aria-label) on every desktop rail control', () => {
    renderWithProviders(<QuickActions />);
    const { rail } = getNavs();
    ['Call', 'WhatsApp', 'SMS', 'Mail', 'Services'].forEach((label) => {
      expect(within(rail).getByRole('link', { name: label })).toBeInTheDocument();
    });
  });

  it('routes the Services action to the in-app practice-areas page', () => {
    renderWithProviders(<QuickActions />);
    const { bar } = getNavs();
    expect(within(bar).getByRole('link', { name: 'Services' })).toHaveAttribute(
      'href',
      '/practice-areas'
    );
  });
});
