import { PDFDocument, StandardFonts } from "pdf-lib";
import { mkdtempSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export async function makeSamplePdf(text = "Hello CV") {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText(text, { x: 72, y: 760, size: 24, font });
  const bytes = await pdf.save();
  const dir = mkdtempSync(join(tmpdir(), "cvpdf-"));
  const file = join(dir, "sample.pdf");
  writeFileSync(file, bytes);
  return file;
}
