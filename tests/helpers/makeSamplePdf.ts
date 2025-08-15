import { PDFDocument, StandardFonts } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

/** Generate a small temporary PDF and return its file path. */
export async function makeSamplePdf(): Promise<string> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();
  const text = 'Sample PDF';
  const size = 24;
  page.drawText(text, { x: 50, y: height - 50 - size, size, font });
  const bytes = await pdf.save();

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-'));
  const filePath = path.join(dir, 'sample.pdf');
  await fs.writeFile(filePath, bytes);
  return filePath;
}
