import { useEffect, useRef } from 'react';
import type { JobProgress } from '@/types/job';

interface Handlers {
  onProgress: (p: JobProgress) => void;
  onDone: (d: JobProgress) => void;
  onError: (e: JobProgress) => void;
}

export default function useSSE(jobId: string | undefined, handlers: Handlers) {
  const sourceRef = useRef<EventSource | null>(null);
  useEffect(() => {
    if (!jobId) return;
    let stopped = false;
    let backoff = 1000;
    const connect = () => {
      const src = new EventSource(`/api/status?jobId=${jobId}`);
      sourceRef.current = src;
      src.addEventListener('progress', (e) => {
        handlers.onProgress(JSON.parse((e as MessageEvent<string>).data) as JobProgress);
      });
      src.addEventListener('done', (e) => {
        handlers.onDone(JSON.parse((e as MessageEvent<string>).data) as JobProgress);
      });
      src.addEventListener('error', (e) => {
        const data = (e as MessageEvent<string>).data;
        if (data) handlers.onError(JSON.parse(data) as JobProgress);
      });
      src.onerror = () => {
        src.close();
        if (!stopped) {
          setTimeout(() => {
            backoff = Math.min(backoff * 2, 10000);
            connect();
          }, backoff);
        }
      };
    };
    connect();
    return () => {
      stopped = true;
      sourceRef.current?.close();
    };
  }, [jobId]);
  return sourceRef;
}
