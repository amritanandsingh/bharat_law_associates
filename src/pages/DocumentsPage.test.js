import React from 'react';
import { renderWithProviders, screen, waitFor } from '../test-utils/renderWithProviders';

jest.mock('../lib/documents', () => ({
  listDocuments: jest.fn(),
  resolvePreviewUrl: jest.fn(),
}));

// eslint-disable-next-line import/first
import { listDocuments, resolvePreviewUrl } from '../lib/documents';
// eslint-disable-next-line import/first
import DocumentsPage from './DocumentsPage';

const doc = (id, title, over = {}) => ({
  id,
  title,
  description: `About ${title}`,
  priceInr: 999,
  previewKey: `media/documents/${id}.pdf`,
  previewContentType: 'application/pdf',
  publishedAt: '2026-03-01T00:00:00.000Z',
  sortOrder: 0,
  ...over,
});

const render = () => renderWithProviders(<DocumentsPage />, { route: '/documents' });

describe('DocumentsPage', () => {
  // CRA sets resetMocks:true, so implementations must be reapplied per test.
  beforeEach(() => {
    resolvePreviewUrl.mockResolvedValue('');
  });

  it('shows a loading state before the fetch resolves', () => {
    listDocuments.mockReturnValue(new Promise(() => {})); // never settles
    render();
    expect(screen.getByText('Loading documents…')).toBeInTheDocument();
  });

  it('renders a card per document once loaded', async () => {
    listDocuments.mockResolvedValue([doc('a', 'Bail Application'), doc('b', 'Writ Petition')]);
    render();
    await screen.findByRole('heading', { level: 3, name: 'Bail Application' });
    expect(screen.getByRole('heading', { level: 3, name: 'Writ Petition' })).toBeInTheDocument();
  });

  it('shows the empty state when there are no documents', async () => {
    listDocuments.mockResolvedValue([]);
    render();
    await screen.findByText('No documents listed yet. Please check back soon.');
  });

  it('falls back to the empty state when the fetch fails', async () => {
    listDocuments.mockRejectedValue(new Error('network down'));
    render();
    await screen.findByText('No documents listed yet. Please check back soon.');
  });

  it('preserves the order returned by the data layer', async () => {
    listDocuments.mockResolvedValue([doc('a', 'First'), doc('b', 'Second'), doc('c', 'Third')]);
    render();
    await screen.findByRole('heading', { level: 3, name: 'First' });
    await waitFor(() => {
      const titles = screen
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent);
      expect(titles).toEqual(['First', 'Second', 'Third']);
    });
  });
});
