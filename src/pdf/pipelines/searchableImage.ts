import { getPdfFromData } from "../utils/safePdf";
import { jsPDF } from "jspdf";
import { renderPageBlob } from "../utils/pdfCanvas";
import { ensurePdfWorker } from "../utils/ensurePdfWorker";
import { createCanvas } from "../utils/safeCanvas";

type Cfg = {
  dpi: number;
  quality: number;
  format: "jpeg" | "webp";
  lang?: string;
  onProgress?: (p: any) => void;
};

let tesseractWorker: any | null = null;
let ocrEngine: "tesseract.js" | "stub" | null = null;
async function getOcrWorker(lang = "eng") {
  if (tesseractWorker) return tesseractWorker;
  try {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker({ langPath: "https://tessdata.projectnaptha.com/4.0.0" });
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    ocrEngine = "tesseract.js";
    tesseractWorker = worker;
    return worker;
  } catch (e) {
    const { createWorker } = await import("../../stubs/tesseract");
    ocrEngine = "stub";
    tesseractWorker = await createWorker(lang);
    return tesseractWorker;
  }
}
export function getOcrEngine() {
  return ocrEngine;
}

export async function searchableImage(data: ArrayBuffer, cfg: Cfg): Promise<Blob> {
  ocrEngine = null;
  await ensurePdfWorker();
  const pdf = await getPdfFromData(data);
  const doc = new jsPDF({ unit: "pt", compress: true });

  for (let p = 1; p <= pdf.numPages; p++) {
    cfg.onProgress?.({ stage: "render", page: p, total: pdf.numPages });
    const page = await pdf.getPage(p);
    const vp = page.getViewport({ scale: cfg.dpi / 72 });
    const { blob } = await renderPageBlob({
      data,
      page: p,
      dpi: cfg.dpi,
      format: cfg.format,
      quality: cfg.quality,
    });
    const dataUrl = await blobToDataURL(blob);

    if (p > 1) doc.addPage([vp.width, vp.height]);
    else (doc as any).setPage(1);
    doc.addImage(dataUrl, cfg.format === "webp" ? "WEBP" : "JPEG", 0, 0, vp.width, vp.height);

    // Try native text first
    let items;
    try {
      items = await page.getTextContent();
    } catch {
      items = { items: [] };
    }
    if ((items.items?.length ?? 0) < 5) {
      // OCR fallback
      cfg.onProgress?.({ stage: "ocr", page: p, total: pdf.numPages });
      const worker = await getOcrWorker(cfg.lang || "eng");
      const { canvas, ctx } = createCanvas(vp.width, vp.height);
      await page.render({ canvasContext: ctx as any, viewport: vp }).promise;
      const { data: ocr } = await worker.recognize(canvas as any);
      overlayOcr(doc, vp.height, ocr);
    } else {
      overlayPdfjsItems(doc, vp.height, items);
    }
    cfg.onProgress?.({ stage: "compose", page: p, total: pdf.numPages });
  }
  return doc.output("blob");
}

function overlayPdfjsItems(doc: jsPDF, pageHeight: number, textContent: any) {
  (doc as any).setGState(new (doc as any).GState({ opacity: 0 }));
  doc.setTextColor(0, 0, 0);
  for (const it of textContent.items) {
    const [a, b, , , e, f] = it.transform; // pdfjs transform
    const x = e;
    const yTop = f;
    const fontSize = Math.hypot(a, b); // approx
    const yPdf = pageHeight - yTop;
    doc.setFontSize(fontSize || 10);
    doc.text(String(it.str || ""), x, yPdf, { baseline: "top" });
  }
}

function overlayOcr(doc: jsPDF, pageHeight: number, ocr: any) {
  (doc as any).setGState(new (doc as any).GState({ opacity: 0 }));
  doc.setTextColor(0, 0, 0);
  for (const block of ocr.blocks || []) {
    for (const para of block.paragraphs || []) {
      for (const line of para.lines || []) {
        const t = line.text || "";
        const { x0, y0, y1 } = line.bbox;
        const fs = Math.max(8, y1 - y0);
        doc.setFontSize(fs);
        const yPdf = pageHeight - y0;
        doc.text(t, x0, yPdf, { baseline: "bottom" });
      }
    }
  }
}

async function blobToDataURL(b: Blob) {
  const buf = await b.arrayBuffer();
  const base64 = typeof btoa === "function"
    ? btoa(String.fromCharCode(...new Uint8Array(buf)))
    : Buffer.from(buf).toString("base64");
  return `data:${b.type};base64,${base64}`;
}
