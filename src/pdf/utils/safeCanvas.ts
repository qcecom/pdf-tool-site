import { isBrowser, isWorker } from "../../utils/env";

export type Canvas2D = HTMLCanvasElement | OffscreenCanvas;

export function createSafeCanvas(width = 1, height = 1): Canvas2D {
  if (isWorker && typeof OffscreenCanvas !== "undefined") {
    // @ts-ignore
    return new OffscreenCanvas(width, height);
  }
  if (isBrowser && typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    return c;
  }
  if (typeof OffscreenCanvas !== "undefined") {
    // @ts-ignore
    return new OffscreenCanvas(width, height);
  }
  throw new Error("No canvas API available in this environment");
}

export function get2d(c: Canvas2D): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D {
  // @ts-ignore
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D context unavailable");
  return ctx as any;
}

export async function canvasToBlob(
  c: Canvas2D,
  type = "image/png",
  quality?: number,
): Promise<Blob> {
  // @ts-ignore
  if (typeof c.convertToBlob === "function") {
    // @ts-ignore
    return c.convertToBlob({ type, quality });
  }
  if ("toBlob" in (c as HTMLCanvasElement)) {
    return new Promise<Blob>((res, rej) => {
      (c as HTMLCanvasElement).toBlob(
        (b) => (b ? res(b) : rej(new Error("toBlob failed"))),
        type,
        quality,
      );
    });
  }
  // @ts-ignore
  const dataUrl = (c as HTMLCanvasElement).toDataURL(type, quality);
  const bin = atob(dataUrl.split(",")[1] || "");
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type });
}
