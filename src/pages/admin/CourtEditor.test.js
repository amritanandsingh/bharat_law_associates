import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  fireEvent,
  renderWithProviders,
  screen,
  waitFor,
} from '../../test-utils/renderWithProviders';

jest.mock('../../lib/courts', () => ({
  getCourtById: jest.fn(),
  resolveCourtImageUrl: jest.fn(),
  saveCourt: jest.fn(),
  uploadCourtImage: jest.fn(),
}));

// eslint-disable-next-line import/first
import {
  getCourtById,
  resolveCourtImageUrl,
  saveCourt,
  uploadCourtImage,
} from '../../lib/courts';
// eslint-disable-next-line import/first
import CourtEditor from './CourtEditor';

describe('CourtEditor', () => {
  beforeEach(() => {
    saveCourt.mockResolvedValue({ id: 'saved-court' });
    resolveCourtImageUrl.mockResolvedValue('');
  });

  it('uploads an image and saves a new court', async () => {
    uploadCourtImage.mockResolvedValue('media/courts/supreme-court.jpg');
    renderWithProviders(<CourtEditor />, { route: '/admin/courts/new' });

    fireEvent.change(screen.getByLabelText('Court Name'), {
      target: { value: 'Supreme Court of India' },
    });
    fireEvent.change(screen.getByLabelText('Court Address'), {
      target: { value: 'Tilak Marg, New Delhi, Delhi 110001' },
    });
    const image = new File(['court-image'], 'supreme-court.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText('Court Image'), { target: { files: [image] } });
    fireEvent.click(screen.getByRole('button', { name: 'Add court' }));

    await waitFor(() => {
      expect(uploadCourtImage).toHaveBeenCalledWith(image);
      expect(saveCourt).toHaveBeenCalledWith({
        id: undefined,
        name: 'Supreme Court of India',
        address: 'Tilak Marg, New Delhi, Delhi 110001',
        imageKey: 'media/courts/supreme-court.jpg',
      });
    });
  });

  it('loads and updates an existing court without replacing its image', async () => {
    getCourtById.mockResolvedValue({
      id: 'court-1',
      name: 'Existing Court',
      address: 'Existing address',
      imageKey: 'media/courts/existing.jpg',
    });
    renderWithProviders(
      <Routes>
        <Route path="/admin/courts/edit/:id" element={<CourtEditor />} />
      </Routes>,
      { route: '/admin/courts/edit/court-1' },
    );

    await screen.findByDisplayValue('Existing Court');
    fireEvent.change(screen.getByLabelText('Court Address'), {
      target: { value: 'Updated address' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(saveCourt).toHaveBeenCalledWith({
        id: 'court-1',
        name: 'Existing Court',
        address: 'Updated address',
        imageKey: 'media/courts/existing.jpg',
      }),
    );
    expect(uploadCourtImage).not.toHaveBeenCalled();
  });
});
