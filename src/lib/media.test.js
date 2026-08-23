jest.mock('aws-amplify/storage', () => ({
  uploadData: jest.fn(),
}));

// eslint-disable-next-line import/first
import { uploadData } from 'aws-amplify/storage';
// eslint-disable-next-line import/first
import { uploadPublicMedia } from './media';

describe('uploadPublicMedia', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses the requested existing media prefix and preserves the content type', async () => {
    uploadData.mockReturnValue({ result: Promise.resolve() });
    jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
    const file = new File(['image'], 'Supreme Court photo.jpg', { type: 'image/jpeg' });

    await expect(uploadPublicMedia(file, 'courts')).resolves.toBe(
      'media/courts/1700000000000-Supreme-Court-photo.jpg',
    );
    expect(uploadData).toHaveBeenCalledWith({
      path: 'media/courts/1700000000000-Supreme-Court-photo.jpg',
      data: file,
      options: { contentType: 'image/jpeg' },
    });
  });
});
