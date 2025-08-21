import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

export type Profile = "fast" | "balanced" | "max";

const profileCfg: Record<Profile, { maxW: number; jpegQ: number; dpi: number }> = {
  fast: { maxW: 1280, jpegQ: 0.6, dpi: 110 },
  balanced: { maxW: 1920, jpegQ: 0.5, dpi: 100 },
  max: { maxW: 2560, jpegQ: 0.4, dpi: 96 },
};

// Required for pdfjs in Vite
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function dataURLToUint8(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function compressPdf(file: File, profile: Profile = "balanced"): Promise<Blob> {
  const cfg = profileCfg[profile];
  const input = await file.arrayBuffer();

  const task = pdfjsLib.getDocument({ data: input });
  const srcPdf = await task.promise;
  const outPdf = await PDFDocument.create();

  for (let i = 1; i <= srcPdf.numPages; i++) {
    const page = await srcPdf.getPage(i);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = cfg.dpi / 72;
    const renderViewport = page.getViewport({ scale });

    // Canvas size capped by maxW while preserving aspect
    const targetW = Math.min(renderViewport.width, cfg.maxW);
    const targetH = (targetW / renderViewport.width) * renderViewport.height;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(targetW);
    canvas.height = Math.round(targetH);

    const ctx = canvas.getContext("2d")!;
    // Render at original renderViewport then draw scaled to target
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = Math.round(renderViewport.width);
    tmpCanvas.height = Math.round(renderViewport.height);
    const tmpCtx = tmpCanvas.getContext("2d")!;

    await page.render({ canvasContext: tmpCtx as any, viewport: renderViewport }).promise;
    ctx.drawImage(tmpCanvas, 0, 0, tmpCanvas.width, tmpCanvas.height, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", cfg.jpegQ);
    const jpg = dataURLToUint8(dataUrl);
    const img = await outPdf.embedJpg(jpg);
    const outPage = outPdf.addPage([img.width, img.height]);
    outPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const bytes = await outPdf.save({ useObjectStreams: true });
  return new Blob([bytes], { type: "application/pdf" });
}
