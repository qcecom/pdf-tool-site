import Tesseract from 'tesseract.js';

export async function ocrBlob(
  blob: Blob,
  lang = 'eng',
  logger?: (m: any) => void
): Promise<string> {
  const { data } = await Tesseract.recognize(blob, lang, { logger });
  return data.text ?? '';
}
