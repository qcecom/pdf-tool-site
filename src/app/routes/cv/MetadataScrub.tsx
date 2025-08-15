import { useEffect, useState } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import { useWorker } from "@/app/hooks/useWorker";
import ScrubWorker from "@/pdf/workers/metadataScrub.worker?worker";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";
import ResultDownloadCard from "@/app/components/ResultDownloadCard";
import { deriveOutputName } from "@/pdf/utils";

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function MetadataScrub() {
  useMeta({ title: "Metadata Scrub - nouploadpdf.com", description: "Remove hidden PDF metadata" });
  const { run, progress, status, error, result } = useWorker(ScrubWorker, "metadata-scrub");
  const [srcFile, setSrcFile] = useState<File | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outName, setOutName] = useState("");

  const handleFile = async (file: File) => {
    DBG && console.log("[metadata-scrub] picked", file.name, file.size);
    const buf = await file.arrayBuffer();
    setSrcFile(file);
    setOutBlob(null);
    setOutName("");
    run({ file: buf }, [buf]);
  };

  useEffect(() => {
    if (status === "done" && result instanceof ArrayBuffer && srcFile && !outBlob) {
      DBG && console.log("[metadata-scrub] finished", result.byteLength);
      const blob = new Blob([result], { type: "application/pdf" });
      setOutBlob(blob);
      setOutName(deriveOutputName(srcFile.name, "-clean", ".pdf"));
    }
  }, [status, result, srcFile, outBlob]);

  useEffect(() => {
    if (status === "error" && error && DBG) console.log("[metadata-scrub] error", error);
  }, [status, error]);

  const reset = () => {
    setSrcFile(null);
    setOutBlob(null);
    setOutName("");
  };

  return (
    <>
      <Header />
      <main className="container">
        <h2>Metadata Scrub</h2>
        {!srcFile && <Dropzone onFile={handleFile} />}
        {srcFile && status === "working" && <ProgressBar progress={progress} />}
        {error && <Toast message={error} onClose={() => {}} />}
        {outBlob && srcFile && (
          <ResultDownloadCard
            srcName={srcFile.name}
            srcSize={srcFile.size}
            outName={outName}
            outBlob={outBlob}
            onReset={reset}
          />
        )}
        <aside style={{marginTop:12,color:"var(--muted)"}}>Strips title, author, and other metadata.</aside>
      </main>
      <Footer />
    </>
  );
}
