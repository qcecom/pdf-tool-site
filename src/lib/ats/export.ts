export async function extractATSSafeText(input: File | ArrayBuffer | string): Promise<string> {
  const normalize = (txt: string) =>
    txt
      .replace(/\r\n?/g, '\n')
      .replace(/[\t\f]+/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .trim();

  if (typeof input === 'string') return normalize(input);

  const name = (input as File).name || '';
  const ext = name.split('.').pop()?.toLowerCase();

  async function readAsText(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onerror = () => rej(fr.error);
      fr.onload = () => res(fr.result as string);
      fr.readAsText(file);
    });
  }

  async function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onerror = () => rej(fr.error);
      fr.onload = () => res(fr.result as ArrayBuffer);
      fr.readAsArrayBuffer(file);
    });
  }

  try {
    if (ext === 'txt' || ext === 'md') {
      const text = await readAsText(input as File);
      return normalize(text);
    }
    if (ext === 'docx') {
      const buf = await readAsArrayBuffer(input as File);
      try {
        const decoder = new TextDecoder();
        return normalize(decoder.decode(buf));
      } catch {
        return 'DOCX parsing unavailable; install a docx parser.';
      }
    }
    if (ext === 'pdf' || input instanceof ArrayBuffer) {
      const data = input instanceof ArrayBuffer ? input : await readAsArrayBuffer(input as File);
      try {
        const pdfjs = await import('pdfjs-dist/build/pdf');
        const pdf = await pdfjs.getDocument({ data }).promise;
        let out = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const txt = await page.getTextContent();
          out +=
            txt.items
              .map((it: any) => ('str' in it ? (it.str as string) : ''))
              .join(' ') + '\n';
        }
        const result = normalize(out);
        return result || 'No extractable text—try OCR.';
      } catch {
        return 'No extractable text—try OCR.';
      }
    }
    if (input instanceof ArrayBuffer) {
      const decoder = new TextDecoder();
      return normalize(decoder.decode(input));
    }
    return 'Unsupported file type.';
  } catch (err: any) {
    return `Error: ${err.message || err}`;
  }
}
