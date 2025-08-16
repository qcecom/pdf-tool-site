import Dropzone from "../../components/Dropzone";
import ResultDownloadCard from "../../components/ResultDownloadCard";
import { useWorker } from "../../hooks/useWorker";
import { deriveOutputName } from "@/pdf/utils";
import SmartWorker from "@/pdf/workers/smartCompress.worker.ts?worker";
import { useState } from "react";

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function CompressPage() {
  const { run, progress, status, error, result } = useWorker(SmartWorker, "smart-compress");
  const [srcFile, setSrcFile] = useState<File | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outName, setOutName] = useState<string>("");
  const [preset, setPreset] = useState<'SMART' | 'ATS_SAFE' | 'EMAIL' | 'SMALLEST'>('SMART');

  const onPick = async (file: File) => {
    setSrcFile(file);
    setOutBlob(null);
    setOutName("");
    DBG && console.log("[compress] picked", file.name, file.size);
    run({ file, preset });
  };

  // Convert worker result to Blob and prepare names
  if (status === "done" && result instanceof Blob && !outBlob) {
    setOutBlob(result);
    setOutName(deriveOutputName(srcFile?.name || "document", "-compressed", ".pdf"));
  }

  const reset = () => { setSrcFile(null); setOutBlob(null); setOutName(""); };

  return (
    <div className="container">
      <h2>Compress</h2>
      <div style={{ marginBottom: 8 }}>
        {[
          { id: "SMART", label: "Smart" },
          { id: "ATS_SAFE", label: "ATS-safe" },
          { id: "EMAIL", label: "Email <2MB" },
          { id: "SMALLEST", label: "Smallest" },
        ].map((p) => (
          <label key={p.id} style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="preset"
              value={p.id}
              checked={preset === p.id}
              onChange={() => setPreset(p.id as any)}
            />{" "}
            {p.label}
          </label>
        ))}
      </div>
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
