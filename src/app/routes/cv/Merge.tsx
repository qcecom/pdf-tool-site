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

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function Merge() {
  useMeta({ title: "Merge PDFs - nouploadpdf.com", description: "Combine CV and portfolio on-device" });
  const { run, progress, status, error, result } = useWorker(MergeWorker, "merge");
  const [files, setFiles] = useState<File[]>([]);

  const handleFile = (file: File) => {
    DBG && console.log("[merge] picked", file.name, file.size);
    setFiles((prev) => [...prev, file]);
  };

  const startMerge = async () => {
    DBG && console.log("[merge] start", files.length);
    const bufs = await Promise.all(files.map((f) => f.arrayBuffer()));
    run({ files: bufs }, bufs);
  };

  useEffect(() => {
    if (status === "done" && result instanceof ArrayBuffer) {
      DBG && console.log("[merge] finished", result.byteLength);
      downloadBuffer(result, "merged.pdf");
    }
  }, [status, result]);

  useEffect(() => {
    if (status === "error" && error) DBG && console.log("[merge] error", error);
  }, [status, error]);

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
