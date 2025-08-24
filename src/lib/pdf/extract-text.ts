import * as pdfjs from 'pdfjs-dist';
(pdfjs as any).GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';

export async function extractTextOrdered(bytes: Uint8Array): Promise<string> {
  const doc = (pdfjs as any).getDocument({ data: bytes });
  const pdf = await doc.promise;
  const out: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const line: string[] = [];
    let lastY: number | null = null;
    for (const item of content.items as any[]) {
      const tx = item.str as string;
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 4) {
        out.push(line.join(' '));
        line.length = 0;
      }
      line.push(tx);
      lastY = y;
    }
    if (line.length) out.push(line.join(' '));
    out.push('');
  }
  return out.join('\n');
}

export function cleanAtsText(raw: string): string {
  return raw
    .replace(/Page\s+\d+\s+of\s+\d+/gi, '')
    .replace(/\u00AD/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[•·●◦]/g, '-')
    .trim();
}
