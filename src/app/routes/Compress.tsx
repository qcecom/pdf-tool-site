import { useEffect, useState } from "react";
import Dropzone from "../components/Dropzone";
import ProgressBar from "../components/ProgressBar";
import Toast from "../components/Toast";
import { useWorker } from "@/hooks/useWorker";
import { downloadBuffer } from "@/pdf/utils";

export default function CompressRoute() {
  const [WorkerCtor, setWorkerCtor] = useState<null | (new () => Worker)>(null);
  const worker = WorkerCtor ? useWorker(WorkerCtor) : null;

  useEffect(() => {
    import("@/pdf/workers/compress.worker.ts?worker").then((m) => setWorkerCtor(() => m.default));
  }, []);

  const handleFile = async (file: File) => {
    if (!worker) return;
    const buf = await file.arrayBuffer();
    worker.run({ file: buf });
  };

  useEffect(() => {
    if (worker?.status === "done" && worker.result instanceof ArrayBuffer) {
      downloadBuffer(worker.result, "compressed.pdf");
    }
  }, [worker?.status, worker?.result]);

  return (
    <div>
      <Dropzone onFile={handleFile} />
      {worker && worker.status === "working" && <ProgressBar progress={worker.progress} />}
      {worker?.error && <Toast message={worker.error} onClose={() => {}} />}
    </div>
  );
}
