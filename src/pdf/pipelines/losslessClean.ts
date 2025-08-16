import { PDFDocument } from 'pdf-lib';

export async function losslessClean(data:ArrayBuffer): Promise<Blob> {
  const pdf = await PDFDocument.load(data, { updateMetadata: false });
  pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject(''); pdf.setKeywords([]);
  // Remove XMP metadata if present
  (pdf as any).catalog?.set(PDFDocument, undefined);
  const bytes = await pdf.save({ useObjectStreams: true });
  return new Blob([bytes as any], { type: 'application/pdf' });
}
