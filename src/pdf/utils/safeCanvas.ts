export type Canvas2D = HTMLCanvasElement | OffscreenCanvas;
export type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export function createCanvas(width: number, height: number) {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    return { canvas, ctx } as { canvas: Canvas2D; ctx: Ctx2D };
  }
  const d: any = (globalThis as any).document;
  if (!d?.createElement) throw new Error('No DOM canvas available');
  const canvas = d.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context unavailable');
  return { canvas, ctx } as { canvas: Canvas2D; ctx: Ctx2D };
}

export function get2d(canvas: Canvas2D): Ctx2D {
  const ctx = (canvas as any).getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D context unavailable');
  return ctx as Ctx2D;
}

export async function canvasToBlob(
  canvas: Canvas2D,
  type = 'image/png',
  quality?: number,
): Promise<Blob> {
  if (typeof (canvas as any).convertToBlob === 'function') {
    return (canvas as any).convertToBlob({ type, quality });
  }
  if ('toBlob' in (canvas as any)) {
    return new Promise<Blob>((res, rej) => {
      (canvas as HTMLCanvasElement).toBlob(
        (b) => (b ? res(b) : rej(new Error('toBlob failed'))),
        type,
        quality,
      );
    });
  }
  const dataUrl = (canvas as HTMLCanvasElement).toDataURL(type, quality);
  const bin = atob(dataUrl.split(',')[1] || '');
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type });
}
