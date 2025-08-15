import { useEffect, useState } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import FileList from "@/app/components/FileList";
import { useWorker } from "@/app/hooks/useWorker";
import { downloadBuffer } from "@/pdf/utils";
import MergeWorker from "@/pdf/workers/mergeCv.worker?worker";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function Merge() {
  useMeta({ title: "Merge PDFs - ATS CV Toolkit", description: "Combine CV and portfolio on-device" });
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
    <>
      <Header />
      <main className="container">
        <h2>Merge PDFs</h2>
        <Dropzone onFile={handleFile} />
        {files.length > 0 && <FileList files={files} onReorder={setFiles} />}
        {files.length > 1 && (
          <button className="btn" onClick={startMerge}>Merge</button>
        )}
        {status === "working" && <ProgressBar progress={progress} />}
        {error && <Toast message={error} onClose={() => {}} />}
        <aside style={{marginTop:12,color:"var(--muted)"}}>Tip: Merge CV and portfolio then reorder.</aside>
      </main>
      <Footer />
    </>
  );
}
