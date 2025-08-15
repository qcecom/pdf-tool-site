import { useEffect } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import { useWorker } from "@/app/hooks/useWorker";
import { downloadBuffer } from "@/pdf/utils";
import CompressWorker from "@/pdf/workers/compressCv.worker?worker";

export default function Compress() {
  const { run, progress, status, error, result } = useWorker(CompressWorker);

  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    run({ file: buf });
  };

  useEffect(() => {
    if (status === "done" && result instanceof ArrayBuffer) {
      downloadBuffer(result, "compressed.pdf");
    }
  }, [status, result]);

  return (
    <div>
      <h2>Compress PDF</h2>
      <Dropzone onFile={handleFile} />
      {status === "working" && <ProgressBar progress={progress} />}
      {error && <Toast message={error} onClose={() => {}} />}
      <aside>Tip: Keep under 2MB for LinkedIn.</aside>
    </div>
  );
}
