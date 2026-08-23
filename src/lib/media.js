import { uploadData } from 'aws-amplify/storage';

// Shared upload path for public, admin-managed media. Storage access remains
// controlled by the matching prefixes in amplify/storage/resource.ts.
export async function uploadPublicMedia(file, folder) {
  const safeName = file.name.replace(/[^\w.-]+/g, '-');
  const key = `media/${folder}/${Date.now()}-${safeName}`;
  await uploadData({
    path: key,
    data: file,
    options: { contentType: file.type },
  }).result;
  return key;
}
