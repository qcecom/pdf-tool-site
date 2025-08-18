import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const outDir = path.join(__dirname, 'out');
fs.mkdirSync(outDir, { recursive: true });

async function createImgHeavy() {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= 4; i++) {
    const page = pdf.addPage([600, 800]);
    const img = await Jimp.create(2000, 2000, i % 2 === 0 ? 0xff0000ff : 0x00ff00ff);
    const buf = await img.getBufferAsync(Jimp.MIME_PNG);
    const embedded = await pdf.embedPng(buf);
    const { width, height } = embedded.scale(0.5);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
    page.drawText(`IMG_HEAVY_PAGE_${i}`, { x: 50, y: 760, size: 24, font, color: rgb(0, 0, 0) });
  }

  const bytes = await pdf.save();
  fs.writeFileSync(path.join(outDir, 'img-heavy.pdf'), bytes);
}

async function createVectorOnly() {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= 3; i++) {
    const page = pdf.addPage([600, 800]);
    page.drawRectangle({ x: 50, y: 650, width: 500, height: 100, color: rgb(0.2, 0.2, 0.7) });
    page.drawText(`VECTOR_ONLY_PAGE_${i}`, { x: 60, y: 700, size: 24, font, color: rgb(1, 1, 1) });
  }
  const bytes = await pdf.save();
  fs.writeFileSync(path.join(outDir, 'vector-only.pdf'), bytes);
}

async function createScannedLike() {
  const pdf = await PDFDocument.create();
  for (let i = 1; i <= 2; i++) {
    const img = await Jimp.create(1000, 1000, 0xffffffff);
    const fontJ = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    img.print(fontJ, 50, 450, 'THE QUICK BROWN FOX 12345');
    const buf = await img.getBufferAsync(Jimp.MIME_PNG);
    const page = pdf.addPage([600, 800]);
    const embedded = await pdf.embedPng(buf);
    const { width, height } = embedded.scale(0.5);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }
  const bytes = await pdf.save();
  fs.writeFileSync(path.join(outDir, 'scanned-like.pdf'), bytes);
}

async function createPortfolio(name: 'A' | 'B') {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= 2; i++) {
    const page = pdf.addPage([600, 800]);
    page.drawText(`FILE_${name}_P${i}`, { x: 100, y: 700, size: 48, font, color: rgb(0, 0, 0) });
  }
  const bytes = await pdf.save();
  fs.writeFileSync(path.join(outDir, `portfolio-${name}.pdf`), bytes);
}

async function createAtsTest() {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= 3; i++) {
    const page = pdf.addPage([600, 800]);
    page.drawText(`SeniorFitGuide — Page ${i}`, { x: 50, y: 760, size: 18, font });
    page.drawText('© 2025', { x: 50, y: 40, size: 14, font });
    const body = 'This guide covers marketing, analytics, Google Ads, CRM.';
    page.drawText(body, { x: 50, y: 600, size: 16, font, maxWidth: 500, lineHeight: 20 });
  }
  const bytes = await pdf.save();
  fs.writeFileSync(path.join(outDir, 'ats-test.pdf'), bytes);
}

function createNotPdf() {
  fs.writeFileSync(path.join(outDir, 'not-a-pdf.txt'), 'This is not a PDF');
}

async function main() {
  await Promise.all([
    createImgHeavy(),
    createVectorOnly(),
    createScannedLike(),
    createPortfolio('A'),
    createPortfolio('B'),
    createAtsTest()
  ]);
  createNotPdf();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

