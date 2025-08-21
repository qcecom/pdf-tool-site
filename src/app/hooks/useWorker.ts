import { useEffect, useRef, useState } from "react";

type WorkerEvent =
  | { type: "progress"; value: number; stage?: string }
  | { type: "result"; data: any }
  | { type: "ok"; blob: any; meta?: any }
  | { type: "error"; message: string };

const DBG = import.meta.env.VITE_DEBUG === "true";

export function useWorker(WorkerCtor: new () => Worker, label = "worker") {
  const ref = useRef<Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const init = () => {
      const w = new WorkerCtor();
      ref.current = w;
      w.onmessage = (e: MessageEvent<WorkerEvent>) => {
        const m = e.data;
        if (m.type === 'progress') {
          DBG && console.log(`[${label}] progress`, m.value);
          setProgress(m.value);
          setNote(m.stage);
        }
        if (m.type === 'result') {
          DBG && console.log(`[${label}] done`);
          setResult(m.data);
          setStatus('done');
        }
        if (m.type === 'ok') {
          DBG && console.log(`[${label}] done`);
          setResult({ blob: m.blob, meta: m.meta });
          setStatus('done');
        }
        if (m.type === 'error') {
          DBG && console.log(`[${label}] error`, m.message);
          setError(m.message);
          setStatus('error');
        }
      };
    };
    init();
    return () => ref.current?.terminate();
  }, [WorkerCtor]);

  const run = (payload: unknown, transfer?: Transferable[]) => {
    DBG && console.log(`[${label}] start`, payload);
    setStatus("working");
    setProgress(0);
    setNote(undefined);
    setError(null);
    setResult(null);
    ref.current?.postMessage(payload, transfer || []);
  };

  const cancel = () => {
    ref.current?.terminate();
    const w = new WorkerCtor();
    ref.current = w;
    w.onmessage = (e: MessageEvent<WorkerEvent>) => {
      const m = e.data as any;
      if (m.type === 'progress') {
        setProgress(m.value);
        setNote(m.stage);
      }
      if (m.type === 'result') {
        setResult(m.data);
        setStatus('done');
      }
      if (m.type === 'ok') {
        setResult({ blob: m.blob, meta: m.meta });
        setStatus('done');
      }
      if (m.type === 'error') {
        setError(m.message);
        setStatus('error');
      }
    };
    setStatus('idle');
  };

  return { run, cancel, progress, note, status, error, result };
}

