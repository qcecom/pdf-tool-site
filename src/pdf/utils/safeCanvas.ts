/**
 * Create a canvas safely in both environments:
 * - In Web Workers: use OffscreenCanvas
 * - In Window (main thread): fallback to document.createElement('canvas')
 */
export function createSafeCanvas(width: number, height: number) {
  // OffscreenCanvas in worker (or supported window)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const OSC: any = (globalThis as unknown as { OffscreenCanvas?: unknown }).OffscreenCanvas;
  if (typeof OSC !== 'undefined') {
    const c = new (OSC as { new(w:number,h:number): OffscreenCanvas })(width, height);
    // Provide a minimal 2D context API guard
    return c;
  }
  // Main thread fallback
  // @ts-ignore document may be undefined in some envs; guarded above
  const doc = (globalThis as unknown as { document?: Document }).document;
  if (!doc || !doc.createElement) {
    throw new Error('No canvas available: OffscreenCanvas & document are unavailable');
  }
  const canvas = doc.createElement('canvas') as HTMLCanvasElement;
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
    // OffscreenCanvas path
    // @ts-ignore
    return await canvas.convertToBlob({ type, quality });
  }
  // HTMLCanvasElement path
  return await new Promise<Blob>((resolve) =>
    (canvas as HTMLCanvasElement).toBlob((b) => resolve(b as Blob), type, quality)
  );
}
