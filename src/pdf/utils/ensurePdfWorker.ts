let ready = false;

/**
 * Ensures pdfjs-dist has a worker configured.
 * Prefer workerPort with ?worker import; fall back to another path.
 */
export async function ensurePdfWorker() {
  if (ready) return;
  const pdf = await import('pdfjs-dist'); // { GlobalWorkerOptions }
  const { GlobalWorkerOptions } = pdf as any;

  try {
    // ESM worker (pdfjs v3)
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?worker&url')).default as string;
    GlobalWorkerOptions.workerPort = new Worker(workerUrl, { type: 'module' });
    ready = true;
    return;
  } catch (_) { /* continue */ }

  try {
    // Legacy fallback
    const workerUrl = (await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker&url')).default as string;
    GlobalWorkerOptions.workerPort = new Worker(workerUrl, { type: 'module' });
    ready = true;
    return;
  } catch (e) {
    // Last resort: throw a clear error
    throw new Error('Failed to load pdfjs worker. Ensure pdfjs-dist is installed.');
  }
}
