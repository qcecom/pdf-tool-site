export function createSampleJDText(): string {
  return `We seek a Software Engineer with experience in React, TypeScript, and cloud deployments.
Must know AWS and CI/CD. Nice to have: Docker, Python.`;
}

export function createSampleResumeText(): string {
  return `Jane Doe\nExperience\n- Built React apps improving conversion by 20%\n- Managed AWS infrastructure\nSkills: TypeScript, Docker, Python`; 
}

export async function createSampleResumePDF(): Promise<Blob> {
  const text = createSampleResumeText();
  try {
    const { PDFDocument, StandardFonts } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    const page = doc.addPage();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const size = 12;
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      page.drawText(line, { x: 40, y: page.getHeight() - 40 - i * (size + 4), size, font });
    });
    const bytes = await doc.save();
    return new Blob([bytes], { type: 'application/pdf' });
  } catch {
    return new Blob([text], { type: 'text/plain' });
  }
}

export async function createSampleScanJPG(): Promise<Blob> {
  const text = 'Sample Scan Text';
  const canvas = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(400, 200)
    : document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 200;
  const ctx = (canvas as any).getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 400, 200);
  ctx.fillStyle = '#000';
  ctx.font = '20px sans-serif';
  ctx.fillText(text, 10, 100);
  const blob: Blob = await new Promise((res) => {
    (canvas as HTMLCanvasElement).toBlob((b) => res(b || new Blob()), 'image/jpeg', 0.9);
  });
  return blob;
}

export function blobUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}
