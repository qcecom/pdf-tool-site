/// <reference lib="webworker" />

self.onmessage = async (e: MessageEvent) => {
  const { blob } = e.data || {};
  try {
    const { createWorker } = await import('tesseract.js');
    const worker = await (createWorker as any)('eng');
    await worker.setParameters({ preserve_interword_spaces: '1' });
    const { data } = await worker.recognize(blob, undefined, {
      progress: (p: any) => postMessage({ progress: p.progress, textChunk: p.status }),
    });
    await worker.terminate();
    postMessage({ text: data.text, meanConfidence: data.confidence });
  } catch (err) {
    postMessage({ error: 'OCR unavailable', details: String(err) });
  }
};
