import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js';

self.onmessage = async (e: MessageEvent) => {
  const { pdfBytes, quality } = e.data as { pdfBytes: ArrayBuffer; quality: number };
  const pdf = await getDocument({ data: pdfBytes }).promise;
  const images: Uint8Array[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
    const buf = await blob.arrayBuffer();
    images.push(new Uint8Array(buf));
    (self as any).postMessage({ progress: Math.round((i / pdf.numPages) * 100) });
  }
  (self as any).postMessage({ images }, images.map((i) => i.buffer));
};
