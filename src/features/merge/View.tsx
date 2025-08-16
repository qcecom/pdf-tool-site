import { useState, useEffect } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import FileList from "@/app/components/FileList";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ResultDownloadCard from "@/app/components/ResultDownloadCard";
import { useWorker } from "@/app/hooks/useWorker";
import { deriveOutputName } from "@/pdf/utils";
import MergeWorker from "@/pdf/workers/mergeCv.worker?worker";
import { useMeta } from "@/app/hooks/useMeta";
import { COPY } from '@/ui/copy';
import { Row, Btn } from '@/ui/mini';

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function MergeView() {
  useMeta({ title: "Merge PDFs - nouploadpdf.com", description: "Combine CV and portfolio on-device" });
  const { run, progress, status, error, result } = useWorker(MergeWorker, "merge");
  const [files, setFiles] = useState<File[]>([]);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outName, setOutName] = useState("");

  const handleFile = (file: File) => {
    DBG && console.log("[merge] picked", file.name, file.size);
    setFiles((prev) => [...prev, file]);
  };

  const startMerge = async () => {
    DBG && console.log("[merge] start", files.length);
    const bufs = await Promise.all(files.map((f) => f.arrayBuffer()));
    setOutBlob(null);
    setOutName("");
    run({ files: bufs }, bufs);
  };

  useEffect(() => {
    if (status === "done" && result instanceof ArrayBuffer && !outBlob) {
      DBG && console.log("[merge] finished", result.byteLength);
      const blob = new Blob([result], { type: "application/pdf" });
      setOutBlob(blob);
      const first = files[0]?.name || "merged";
      setOutName(deriveOutputName(first, "-merged", ".pdf"));
    }
  }, [status, result, outBlob, files]);

  useEffect(() => {
    if (status === "error" && error) DBG && console.log("[merge] error", error);
  }, [status, error]);

  const reset = () => {
    setFiles([]);
    setOutBlob(null);
    setOutName("");
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const first = files[0];
  const srcName = files.length > 1 && first
    ? `${first.name} (+${files.length - 1} more)`
    : first?.name || "";

  return (
    <>
      <Header />
      <main className="container">
        <Row className="mb-3"><h2>{COPY.mergeTitle}</h2></Row>
        {!outBlob && <Dropzone onFile={handleFile} />}
        {!outBlob && files.length > 0 && <FileList files={files} onReorder={setFiles} />}
        {!outBlob && files.length > 1 && (
          <Row><Btn onClick={startMerge}>{COPY.run}</Btn></Row>
        )}
        {status === "working" && <ProgressBar progress={progress} />}
        {error && <Toast message={error} onClose={() => {}} />}
        {outBlob && (
          <ResultDownloadCard
            srcName={srcName}
            srcSize={totalSize}
            outName={outName}
            outBlob={outBlob}
            onReset={reset}
          />
        )}
        <aside style={{marginTop:12,color:"var(--muted)"}}>Tip: Merge CV and portfolio then reorder.</aside>
        <Row className="mt-4"><Btn onClick={reset}>{COPY.again}</Btn></Row>
      </main>
      <Footer />
    </>
  );
}
