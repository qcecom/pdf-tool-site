import { createSafeCanvas, canvasToBlob } from './safeCanvas';

export async function supportsWebP(): Promise<boolean> {
  try {
    const c = createSafeCanvas(1, 1);
    if ('toDataURL' in c) {
      return (c as HTMLCanvasElement).toDataURL('image/webp').startsWith('data:image/webp');
    }
    const blob = await canvasToBlob(c, 'image/webp');
    return blob.type === 'image/webp';
  } catch {
    return false;
  }
}
