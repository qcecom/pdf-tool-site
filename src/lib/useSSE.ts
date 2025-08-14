import { useEffect, useRef } from 'react';
import { ProgressInfo, DoneInfo, ErrorInfo } from './jobTypes';

interface Handlers {
  onProgress: (p: ProgressInfo) => void;
  onDone: (d: DoneInfo) => void;
  onError: (e: ErrorInfo) => void;
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
        handlers.onProgress(JSON.parse((e as MessageEvent).data));
      });
      src.addEventListener('done', (e) => {
        handlers.onDone(JSON.parse((e as MessageEvent).data));
      });
      src.addEventListener('error', (e) => {
        const data = (e as MessageEvent).data;
        if (data) handlers.onError(JSON.parse(data));
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
