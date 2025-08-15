import { useEffect } from "react";
import Dropzone from "@/app/components/Dropzone";
import { useWorker } from "@/app/hooks/useWorker";
import CompressWorker from "@/pdf/workers/compressCv.worker.ts?worker";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function CompressPage() {
  useMeta({ title: "Compress PDF - nouploadpdf.com", description: "Shrink your CV without uploading." });
  const { run, progress, status, error, result } = useWorker(CompressWorker);

  const onPick = async (file: File) => {
    const buf = await file.arrayBuffer();
    if (import.meta.env.VITE_DEBUG) console.log("arrayBuffer", buf.byteLength);
    run({ file: buf, target: "2mb" }, [buf]);
  };

  useEffect(() => {
    if (status === "done" && result instanceof ArrayBuffer) {
      const blob = new Blob([result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, [status, result]);

  return (
    <>
      <Header />
      <main className="container">
        <h2>Compress</h2>
        <Dropzone onFile={onPick} maxMB={100} />
        {status === "working" && <progress max={100} value={progress} />}
        {error && <p className="mono" style={{ color: "salmon" }}>{error}</p>}
      </main>
      <Footer />
    </>
  );
}
