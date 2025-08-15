import Dropzone from "../../components/Dropzone";
import { useWorker } from "../../hooks/useWorker";
import CompressWorker from "@/pdf/workers/compressCv.worker.ts?worker";

const DBG = import.meta.env.VITE_DEBUG === "true";

export default function CompressPage() {
  const { run, progress, status, error, result } = useWorker(CompressWorker, "compress");

  const onPick = async (file: File) => {
    const buf = await file.arrayBuffer();
    DBG && console.log("[compress] picked", file.name, file.size);
    DBG && console.log("[compress] buffer", buf.byteLength);
    run({ file: buf, target: "2mb" }, [buf]);
  };

  // auto-download when done (guard to trigger once)
  if (status === "done" && result instanceof ArrayBuffer) {
    const blob = new Blob([result], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed.pdf";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (DBG && status === "working") console.log("[compress] progress", progress);
  if (DBG && status === "done") console.log("[compress] done");
  if (DBG && error) console.error("[compress] error", error);

  return (
    <div className="container">
      <h2>Compress</h2>
      <Dropzone onFile={onPick} maxMB={100} />
      {status === "working" && (
        <div className="mono" style={{ marginTop: 8 }}>
          <progress max={100} value={progress} /> {progress}%
        </div>
      )}
      {error && <p className="mono" style={{ color: "salmon" }}>{error}</p>}
    </div>
  );
}
