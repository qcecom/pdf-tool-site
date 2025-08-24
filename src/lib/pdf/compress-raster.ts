import * as pdfjs from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';

(pdfjs as any).GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';

export type RasterOptions = { targetDPI?: number; jpegQuality?: number };
const DEFAULTS: RasterOptions = { targetDPI: 110, jpegQuality: 0.72 };

export async function rasterizePdf(
  bytes: Uint8Array,
  opts: RasterOptions = {}
): Promise<Uint8Array> {
  const { targetDPI, jpegQuality } = { ...DEFAULTS, ...opts };
  const loadingTask = (pdfjs as any).getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const out = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const scale = (targetDPI! / 96);
    const v2 = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(v2.width));
    canvas.height = Math.max(1, Math.floor(v2.height));
    const ctx = canvas.getContext('2d', { alpha: false })!;
    await page.render({ canvasContext: ctx, viewport: v2 }).promise;

    const blob: Blob = await new Promise((r) =>
      canvas.toBlob((b) => r(b!), 'image/jpeg', jpegQuality)
    );
    const jpgBytes = new Uint8Array(await blob.arrayBuffer());
    const embedded = await out.embedJpg(jpgBytes);
    const p = out.addPage([embedded.width, embedded.height]);
    p.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
  }
  return await out.save({ useObjectStreams: true });
}
