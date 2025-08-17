/**
 * Create a canvas safely in both environments:
 * - In Web Workers: use OffscreenCanvas
 * - In Window (main thread): fallback to document.createElement('canvas')
 */
export function createSafeCanvas(width: number, height: number) {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(width, height);
  }

  const doc = (globalThis as { document?: Document }).document;
  if (!doc?.createElement) {
    throw new Error('No canvas available: OffscreenCanvas & document are unavailable');
  }

  const canvas = doc.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/** Convert either kind of canvas to Blob (PNG by default) */
export async function canvasToBlob(
  canvas: OffscreenCanvas | HTMLCanvasElement,
  type = 'image/png',
  quality?: number
): Promise<Blob> {
  if ('convertToBlob' in canvas) {
    return (canvas as OffscreenCanvas).convertToBlob({ type, quality });
  }

  return new Promise<Blob>((resolve) =>
    (canvas as HTMLCanvasElement).toBlob((b) => resolve(b as Blob), type, quality)
  );
}
