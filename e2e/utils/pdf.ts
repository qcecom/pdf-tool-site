import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist';

export async function getPdfText(buffer: Buffer): Promise<string> {
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    for (const item of content.items as any[]) {
      if ('str' in item) text += item.str + ' ';
    }
  }
  return text.trim();
}

export function getFileSize(p: string): number {
  return fs.statSync(p).size;
}

export function assertContains(text: string, substring: string) {
  if (!text.includes(substring)) {
    throw new Error(`Expected text to contain "${substring}"`);
  }
}

export function hasNonAscii(str: string): boolean {
  return /[^\x00-\x7F]/.test(str);
}

export function percentDelta(a: number, b: number): number {
  return ((b - a) / a) * 100;
}

