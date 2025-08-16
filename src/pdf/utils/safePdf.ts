import { ensurePdfWorker } from './ensurePdfWorker';

/** Open a pdfjs document safely from a buffer (clones to avoid detaching caller). */
export async function getPdfFromData(data: ArrayBuffer) {
  await ensurePdfWorker();
  const { getDocument } = await import('pdfjs-dist');
  return getDocument({ data: data.slice(0) }).promise;
}
