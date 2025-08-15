import Dropzone from "../../components/Dropzone";
import ResultDownloadCard from "../../components/ResultDownloadCard";
import { useWorker } from "../../hooks/useWorker";
import { deriveOutputName } from "@/pdf/utils";
import CompressWorker from "@/pdf/workers/compressCv.worker.ts?worker";
import { useState } from "react";

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function CompressPage() {
  const { run, progress, status, error, result } = useWorker(CompressWorker);
  const [srcFile, setSrcFile] = useState<File | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outName, setOutName] = useState<string>("");

  const onPick = async (file: File) => {
    setSrcFile(file);
    setOutBlob(null);
    setOutName("");
    const buf = await file.arrayBuffer();
    DBG && console.log("[compress] picked", file.name, file.size);
    run({ file: buf, target: "2mb" }); // could be "1mb" or custom via UI later
  };

  // Convert worker result to Blob and prepare names
  if (status === "done" && result instanceof ArrayBuffer && !outBlob) {
    const blob = new Blob([result], { type: "application/pdf" });
    setOutBlob(blob);
    setOutName(deriveOutputName(srcFile?.name || "document", "-compressed", ".pdf"));
  }

  const reset = () => { setSrcFile(null); setOutBlob(null); setOutName(""); };

  return (
    <div className="container">
      <h2>Compress</h2>
      {!srcFile && <Dropzone onFile={onPick} maxMB={100} />}

      {srcFile && status === "working" && (
        <div className="mono" style={{ marginTop: 8 }}>
          <progress max={100} value={progress} /> {progress}%
        </div>
      )}
      {error && <p className="mono" style={{ color: "salmon" }}>{error}</p>}

      {outBlob && srcFile && (
        <ResultDownloadCard
          srcName={srcFile.name}
          srcSize={srcFile.size}
          outName={outName}
          outBlob={outBlob}
          onReset={reset}
        />
      )}
    </div>
  );
}
