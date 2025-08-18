import { getPdfFromData } from '../utils/safePdf';
import { jsPDF } from 'jspdf';
import { renderPageBlob } from '../utils/pdfCanvas';
import { ensurePdfWorker } from '../utils/ensurePdfWorker';

export type RasterCfg = { dpi:number; quality:number; format:'jpeg'|'webp'; onProgress?:(p:any)=>void };

export async function rasterAll(data:ArrayBuffer, cfg:RasterCfg, chunkSize = 10): Promise<Blob> {
  await ensurePdfWorker();
  const pdf = await getPdfFromData(data);
  let out: jsPDF | null = null;

  const total = pdf.numPages;
  for (let i = 1; i <= total; i += chunkSize) {
    const end = Math.min(i + chunkSize - 1, total);
    const renders: Promise<{ blob: Blob; width: number; height: number }>[] = [];
    for (let p = i; p <= end; p++) {
      cfg.onProgress?.({ stage: 'render', page: p, total });
      renders.push(
        renderPageBlob({ data, page: p, dpi: cfg.dpi, format: cfg.format, quality: cfg.quality }),
      );
    }
    const results = await Promise.all(renders);
    let pageNo = i;
    for (const { blob, width, height } of results) {
      const dataUrl = await blobToDataURL(blob);
      if (!out) out = new jsPDF({ unit: 'pt', compress: true, format: [width, height] });
      else out.addPage([width, height]);
      out.addImage(dataUrl, cfg.format === 'webp' ? 'WEBP' : 'JPEG', 0, 0, width, height);
      cfg.onProgress?.({ stage: 'compose', page: pageNo, total });
      pageNo++;
    }
  }
  return out!.output('blob');
}

async function blobToDataURL(b: Blob){
  const buf = await b.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x8000; // avoid stack overflow for large pages
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const base64 = typeof btoa === 'function'
    ? btoa(binary)
    : Buffer.from(buf).toString('base64');
  return `data:${b.type};base64,${base64}`;
}
