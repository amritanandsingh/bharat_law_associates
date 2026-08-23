import React from 'react';
import { renderWithProviders, screen } from '../../test-utils/renderWithProviders';

jest.mock('../../lib/courts', () => ({
  resolveCourtImageUrl: jest.fn(),
}));

// eslint-disable-next-line import/first
import { resolveCourtImageUrl } from '../../lib/courts';
// eslint-disable-next-line import/first
import CourtCard from './CourtCard';

const court = {
  id: 'supreme-court',
  name: 'Supreme Court of India',
  address: 'Tilak Marg, New Delhi, Delhi 110001',
  imageKey: 'media/courts/supreme-court.jpg',
};

describe('CourtCard', () => {
  it('displays the court name, address, and resolved image', async () => {
    resolveCourtImageUrl.mockResolvedValue('https://example.test/supreme-court.jpg');
    renderWithProviders(<CourtCard court={court} />);

    expect(screen.getByRole('heading', { level: 3, name: court.name })).toBeInTheDocument();
    expect(screen.getByText(court.address)).toBeInTheDocument();
    expect(await screen.findByRole('img', { name: court.name })).toHaveAttribute(
      'src',
      'https://example.test/supreme-court.jpg',
    );
    expect(resolveCourtImageUrl).toHaveBeenCalledWith(court.imageKey);
  });
});
