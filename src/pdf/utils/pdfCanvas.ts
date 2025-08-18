import { getPdfFromData } from "./safePdf";
import { ensurePdfWorker } from "./ensurePdfWorker";
import { createCanvas, canvasToBlob } from "./safeCanvas";

export type RenderOpts = {
  data: ArrayBuffer;
  page: number;
  dpi: number;
  format: "jpeg" | "webp";
  quality: number;
};

export async function renderPageBlob(
  opts: RenderOpts,
): Promise<{ blob: Blob; width: number; height: number }> {
  await ensurePdfWorker();
  const pdf = await getPdfFromData(opts.data);
  const page = await pdf.getPage(opts.page);
  const vp = page.getViewport({ scale: opts.dpi / 72 });

  // Safe canvas creation for both worker and main thread
  const { canvas, ctx } = createCanvas(vp.width, vp.height);
  await page.render({ canvasContext: ctx as any, viewport: vp }).promise;

  const type = opts.format === "webp" ? "image/webp" : "image/jpeg";
  const blob: Blob = await canvasToBlob(canvas, type, opts.quality);
  return { blob, width: vp.width, height: vp.height };
}

export async function textItemsForPage(data: ArrayBuffer, pageNo: number) {
  await ensurePdfWorker();
  const pdf = await getPdfFromData(data);
  const page = await pdf.getPage(pageNo);
  return page.getTextContent();
}
