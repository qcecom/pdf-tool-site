/// <reference lib="webworker" />

self.onmessage = async (e: MessageEvent) => {
  const { pdfBytes, dpi = 120, quality = 0.7 } = e.data || {};
  try {
    const pdfjs = await import('pdfjs-dist/build/pdf');
    const pdfLib = await import('pdf-lib');
    const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
    const pdfDoc = await pdfLib.PDFDocument.create();
    let beforeSize = pdfBytes.byteLength;
    let afterSize = 0;
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: dpi / 72 });
      const canvas = new OffscreenCanvas(viewport.width, viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d') as any, viewport }).promise;
      const blob: Blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
      const imgBytes = await blob.arrayBuffer();
      const img = await pdfDoc.embedJpg(imgBytes);
      const p = pdfDoc.addPage([viewport.width, viewport.height]);
      p.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
      postMessage({ progress: i / doc.numPages });
    }
    const outBytes = await pdfDoc.save();
    afterSize = outBytes.byteLength;
    postMessage({ bytes: outBytes, beforeSize, afterSize, progress: 1 });
  } catch (err) {
    postMessage({ error: 'compression unavailable', details: String(err) });
  }
};
