import { useEffect, useRef, useState } from "react";

export type WorkerEvent =
  | { type: "progress"; value: number; note?: string }
  | { type: "result"; data: ArrayBuffer | ArrayBuffer[] }
  | { type: "error"; message: string };

export function useWorker(WorkerCtor: new () => Worker) {
  const workerRef = useRef<Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArrayBuffer | ArrayBuffer[] | null>(null);

  useEffect(() => {
    const w = new WorkerCtor();
    workerRef.current = w;
    w.onmessage = (e: MessageEvent<WorkerEvent>) => {
      const msg = e.data;
      if (msg.type === "progress") setProgress(msg.value);
      else if (msg.type === "result") {
        setResult(msg.data);
        setStatus("done");
      } else if (msg.type === "error") {
        setError(msg.message);
        setStatus("error");
      }
    };
    return () => w.terminate();
  }, [WorkerCtor]);

  const run = (payload: unknown) => {
    setStatus("working");
    setError(null);
    setProgress(0);
    setResult(null);
    workerRef.current?.postMessage(payload);
  };

  return { run, progress, status, error, result };
}
