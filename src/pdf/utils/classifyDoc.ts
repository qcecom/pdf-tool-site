import { getPdfFromData } from './safePdf';
import { ensurePdfWorker } from './ensurePdfWorker';

export async function classifyDoc(ab: ArrayBuffer, pagesToProbe = 2) {
  await ensurePdfWorker();
  const pdf = await getPdfFromData(ab);
  let textGlyphs = 0, items = 0;
  const probe = Math.min(pdf.numPages, pagesToProbe);
  for (let p = 1; p <= probe; p++) {
    const page = await pdf.getPage(p);
    const tc = await page.getTextContent();
    textGlyphs += tc.items.length;
    items += 1;
  }
  const ratio = textGlyphs / Math.max(1, items * 500); // heuristic 500 glyphs/page
  if (textGlyphs < 10) return { kind: 'SCAN' as const, textGlyphRatio: 0 };
  if (ratio > 0.8) return { kind: 'TEXT_HEAVY' as const, textGlyphRatio: ratio };
  return { kind: 'IMAGE_HEAVY' as const, textGlyphRatio: ratio };
}
