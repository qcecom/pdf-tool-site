import { useEffect, useRef, useState } from "react";

type WorkerEvent =
  | { type: "progress"; value: number; note?: string }
  | { type: "result"; data: any }
  | { type: "error"; message: string };

export function useWorker(WorkerCtor: new () => Worker) {
  const ref = useRef<Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const w = new WorkerCtor();
    ref.current = w;
    w.onmessage = (e: MessageEvent<WorkerEvent>) => {
      const m = e.data;
      if (m.type === "progress") setProgress(m.value);
      if (m.type === "result") {
        setResult(m.data);
        setStatus("done");
      }
      if (m.type === "error") {
        setError(m.message);
        setStatus("error");
      }
    };
    return () => w.terminate();
  }, [WorkerCtor]);

  const run = (payload: unknown) => {
    setStatus("working");
    setProgress(0);
    setError(null);
    setResult(null);
    ref.current?.postMessage(payload);
  };

  return { run, progress, status, error, result };
}

