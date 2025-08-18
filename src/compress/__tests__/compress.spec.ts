// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { compressPdf } from '@/compress';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

async function makeTextPdf(text = 'Hello world'): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([300, 300]);
  page.drawText(text, { x: 10, y: 280 });
  const bytes = await pdf.save();
  return new Blob([bytes as any], { type: 'application/pdf' });
}

describe('compressPdf', () => {
  it('size guard triggers', async () => {
    const src = await makeTextPdf();
    const first = await compressPdf(src, { profile: 'lossless' });
    const second = await compressPdf(first.blob, { profile: 'lossless' });
    expect(second.noGain).toBe(true);
    expect(second.afterBytes).toBe(second.beforeBytes);
  });

  it('image-only produces smaller output', async () => {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([300, 300]);
    for (let i = 0; i < 200; i++) {
      page.drawText('A lot of text to make file bigger ' + i, { x: 10, y: 280 - i });
    }
    const bytes = await pdf.save();
    const blob = new Blob([bytes as any], { type: 'application/pdf' });
    const res = await compressPdf(blob, { profile: 'smallest' });
    expect(res.afterBytes).toBeLessThan(res.beforeBytes);
  });

  it('lossless keeps text layer', async () => {
    const src = await makeTextPdf('Maintain text');
    const res = await compressPdf(src, { profile: 'lossless' });
    const buf = new Uint8Array(await res.blob.arrayBuffer());
    const doc = await getDocument({ data: buf }).promise;
    const page = await doc.getPage(1);
    const tc = await page.getTextContent();
    const text = tc.items.map((it: any) => it.str).join(' ');
    expect(text).toContain('Maintain');
  });
});
