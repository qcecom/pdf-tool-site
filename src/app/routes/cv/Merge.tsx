import { useEffect, useState } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import FileList from "@/app/components/FileList";
import { useWorker } from "@/app/hooks/useWorker";
import { downloadBuffer } from "@/pdf/utils";
import MergeWorker from "@/pdf/workers/mergeCv.worker?worker";

export default function Merge() {
  const { run, progress, status, error, result } = useWorker(MergeWorker);
  const [files, setFiles] = useState<File[]>([]);

  const handleFile = (file: File) => {
    setFiles((prev) => [...prev, file]);
  };

  const startMerge = async () => {
    const bufs = await Promise.all(files.map((f) => f.arrayBuffer()));
    run({ files: bufs });
  };

  useEffect(() => {
    if (status === "done" && result instanceof ArrayBuffer) {
      downloadBuffer(result, "merged.pdf");
    }
  }, [status, result]);

  return (
    <div>
      <h2>Merge PDFs</h2>
      <Dropzone onFile={handleFile} />
      {files.length > 0 && <FileList files={files} onReorder={setFiles} />}
      {files.length > 1 && <button onClick={startMerge}>Merge</button>}
      {status === "working" && <ProgressBar progress={progress} />}
      {error && <Toast message={error} onClose={() => {}} />}
      <aside>Tip: Merge CV and portfolio then reorder.</aside>
    </div>
  );
}
