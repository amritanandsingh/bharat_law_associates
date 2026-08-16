import React from 'react';
import { renderWithProviders, screen, waitFor } from '../../test-utils/renderWithProviders';

// src/lib/documents.js calls generateClient() from aws-amplify at module scope,
// which cannot run in jsdom — mock the whole data-access seam.
jest.mock('../../lib/documents', () => ({
  resolvePreviewUrl: jest.fn(),
}));

const SAMPLE_URL = 'https://example.test/sample.png';

// eslint-disable-next-line import/first
import { resolvePreviewUrl } from '../../lib/documents';
// eslint-disable-next-line import/first
import DocumentCard from './DocumentCard';

const doc = (over = {}) => ({
  id: 'd1',
  title: 'Anticipatory Bail Application',
  description: 'A ready-to-file draft with the standard grounds and prayer.',
  priceInr: 1500,
  previewKey: 'media/documents/1700000000-sample.png',
  previewContentType: 'image/png',
  publishedAt: '2026-03-01T00:00:00.000Z',
  sortOrder: 0,
  ...over,
});

describe('DocumentCard', () => {
  // CRA's Jest config sets resetMocks:true, which strips implementations set in
  // the module factory — so the implementation has to be (re)applied per test.
  beforeEach(() => {
    resolvePreviewUrl.mockResolvedValue(SAMPLE_URL);
  });

  it('renders the title, description and formatted price', async () => {
    renderWithProviders(<DocumentCard document={doc()} />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Anticipatory Bail Application' })
    ).toBeInTheDocument();
    expect(screen.getByText(/ready-to-file draft/)).toBeInTheDocument();
    // Intl currency INR — assert on the digits, not the exact symbol spacing.
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });

  it('shows "Price on request" when there is no price', () => {
    renderWithProviders(<DocumentCard document={doc({ priceInr: null })} />);
    expect(screen.getByText('Price on request')).toBeInTheDocument();
    expect(screen.queryByText(/1,500/)).not.toBeInTheDocument();
  });

  it('treats a zero price as "Price on request"', () => {
    renderWithProviders(<DocumentCard document={doc({ priceInr: 0 })} />);
    expect(screen.getByText('Price on request')).toBeInTheDocument();
  });

  it('renders an image thumbnail for an image sample', async () => {
    renderWithProviders(<DocumentCard document={doc()} />);
    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', SAMPLE_URL);
    expect(resolvePreviewUrl).toHaveBeenCalledWith('media/documents/1700000000-sample.png');
  });

  it('does not fetch a thumbnail for a PDF sample', async () => {
    renderWithProviders(
      <DocumentCard document={doc({ previewContentType: 'application/pdf' })} />
    );
    await waitFor(() => expect(screen.queryByRole('img')).not.toBeInTheDocument());
    expect(resolvePreviewUrl).not.toHaveBeenCalled();
  });

  it('offers a sample link only when a sample page exists', () => {
    const { unmount } = renderWithProviders(<DocumentCard document={doc()} />);
    expect(screen.getByText('View sample page')).toBeInTheDocument();
    unmount();

    renderWithProviders(<DocumentCard document={doc({ previewKey: '' })} />);
    expect(screen.queryByText('View sample page')).not.toBeInTheDocument();
  });

  it('builds WhatsApp, SMS and email links carrying the document title', () => {
    renderWithProviders(<DocumentCard document={doc()} />);
    const hrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
      .filter(Boolean);

    const whatsapp = hrefs.find((h) => h.startsWith('https://wa.me/'));
    const sms = hrefs.find((h) => h.startsWith('sms:'));
    const mail = hrefs.find((h) => h.startsWith('mailto:'));

    // The title must survive URL-encoding into every channel.
    const encoded = encodeURIComponent('Anticipatory Bail Application');
    expect(whatsapp).toContain(encoded);
    expect(sms).toContain(encoded);
    expect(mail).toContain(encoded);
  });

  it('opens WhatsApp in a new tab with a safe rel', () => {
    renderWithProviders(<DocumentCard document={doc()} />);
    const whatsapp = screen
      .getAllByRole('link')
      .find((a) => (a.getAttribute('href') || '').startsWith('https://wa.me/'));
    expect(whatsapp).toHaveAttribute('target', '_blank');
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders nothing when the document prop is missing', () => {
    const { container } = renderWithProviders(<DocumentCard />);
    expect(container).toBeEmptyDOMElement();
  });
});
