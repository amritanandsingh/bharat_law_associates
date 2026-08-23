import React from 'react';
import { renderWithProviders, screen } from '../test-utils/renderWithProviders';

jest.mock('../lib/courts', () => ({
  listCourts: jest.fn(),
  resolveCourtImageUrl: jest.fn(),
}));

// eslint-disable-next-line import/first
import { listCourts, resolveCourtImageUrl } from '../lib/courts';
// eslint-disable-next-line import/first
import CourtsPage from './CourtsPage';

const court = (id, name) => ({
  id,
  name,
  address: `Address for ${name}`,
  imageKey: `media/courts/${id}.jpg`,
});

const render = () => renderWithProviders(<CourtsPage />, { route: '/courts-we-practice-in' });

describe('CourtsPage', () => {
  beforeEach(() => {
    resolveCourtImageUrl.mockResolvedValue('');
  });

  it('shows a loading state before the fetch resolves', () => {
    listCourts.mockReturnValue(new Promise(() => {}));
    render();
    expect(screen.getByText('Loading courts…')).toBeInTheDocument();
  });

  it('renders every court returned by the data layer', async () => {
    listCourts.mockResolvedValue([
      court('high-court', 'Calcutta High Court'),
      court('supreme-court', 'Supreme Court of India'),
    ]);
    render();

    await screen.findByRole('heading', { level: 3, name: 'Calcutta High Court' });
    expect(
      screen.getByRole('heading', { level: 3, name: 'Supreme Court of India' }),
    ).toBeInTheDocument();
  });

  it('shows the empty state when no courts exist', async () => {
    listCourts.mockResolvedValue([]);
    render();
    await screen.findByText('No courts listed yet. Please check back soon.');
  });

  it('falls back to the empty state when loading fails', async () => {
    listCourts.mockRejectedValue(new Error('network down'));
    render();
    await screen.findByText('No courts listed yet. Please check back soon.');
  });
});
