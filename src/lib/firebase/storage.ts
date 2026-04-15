import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadPhoto = async (
  userId: string,
  placeId: string,
  file: File
): Promise<string> => {
  const filename = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `users/${userId}/places/${placeId}/photos/${filename}`);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return downloadUrl;
};

export const deletePhoto = async (photoUrl: string): Promise<void> => {
  // Parse the URL to get the path
  const url = new URL(photoUrl);
  const decodedPath = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '');

  if (decodedPath) {
    const storageRef = ref(storage, decodedPath);
    // Note: deleteObject requires Firebase Admin SDK from server-side
    // This is a placeholder for client-side storage operations
  }
};
