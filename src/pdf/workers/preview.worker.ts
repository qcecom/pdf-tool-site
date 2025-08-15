import * as pdfjsLib from "pdfjs-dist";

self.onmessage = async (e: MessageEvent<ArrayBuffer>) => {
  try {
    const pdf = await pdfjsLib.getDocument({ data: e.data }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await canvas.convertToBlob();
    const buf = await blob.arrayBuffer();
    (self as any).postMessage({ type: "result", data: buf }, [buf]);
  } catch (err: any) {
    (self as any).postMessage({ type: "error", message: err?.message ?? "Preview failed" });
  }
};
