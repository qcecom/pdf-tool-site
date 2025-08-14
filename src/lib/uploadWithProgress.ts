export async function uploadWithProgress(
  file: File,
  onProgress: (info: { percent: number; bytesDone: number; bytesTotal: number; etaSeconds: number }) => void,
  signal?: AbortSignal
) {
  const start = Date.now();
  return new Promise<{ jobId: string; filename: string; size: number }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.responseType = 'json';
    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const percent = (e.loaded / e.total) * 100;
      const elapsed = (Date.now() - start) / 1000;
      const rate = e.loaded / elapsed;
      const etaSeconds = rate ? (e.total - e.loaded) / rate : 0;
      onProgress({ percent, bytesDone: e.loaded, bytesTotal: e.total, etaSeconds });
    };
    xhr.onerror = () => reject(new Error('upload'));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
      else reject(new Error('upload'));
    };
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
    const form = new FormData();
    form.append('file', file);
    xhr.send(form);
  });
}
