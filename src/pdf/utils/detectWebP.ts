import { createCanvas, canvasToBlob } from './safeCanvas';

export async function supportsWebP(): Promise<boolean> {
  try {
    const { canvas } = createCanvas(1, 1);
    if ('toDataURL' in canvas) {
      return (canvas as HTMLCanvasElement).toDataURL('image/webp').startsWith('data:image/webp');
    }
    const blob = await canvasToBlob(canvas, 'image/webp');
    return blob.type === 'image/webp';
  } catch {
    return false;
  }
}
