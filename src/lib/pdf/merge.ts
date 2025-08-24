import { PDFDocument } from 'pdf-lib';

export async function mergeFiles(files: File[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const f of files) {
    const bytes = new Uint8Array(await f.arrayBuffer());
    const pdf = await PDFDocument.load(bytes);
    const pages = await out.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return await out.save({ useObjectStreams: true });
}
