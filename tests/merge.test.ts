import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';

describe('merge pdfs', () => {
  it('produces file with combined page count', async () => {
    const pdf1 = await PDFDocument.create();
    pdf1.addPage();
    const pdf2 = await PDFDocument.create();
    pdf2.addPage();
    const merged = await PDFDocument.create();
    const [p1] = await merged.copyPages(pdf1, [0]);
    merged.addPage(p1);
    const [p2] = await merged.copyPages(pdf2, [0]);
    merged.addPage(p2);
    const bytes = await merged.save();
    const out = await PDFDocument.load(bytes);
    expect(out.getPageCount()).toBe(2);
  });
});
