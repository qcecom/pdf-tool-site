import { useState } from "react";
import Dropzone from "../../components/Dropzone";
import { compressPDF, type CompressResult } from "@/utils/compress";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressResult, setCompressResult] = useState<CompressResult | null>(null);
  const [targetSize, setTargetSize] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = (f: File) => {
    setFile(f);
    setCompressResult(null);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const result = await compressPDF(file, {
        targetSizeMB: targetSize,
        imageQuality: 0.7,
      });
      setCompressResult(result);
      const blob = new Blob([result.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`;
      a.click();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setCompressResult(null);
    setError(null);
  };

  return (
    <div className="container">
      <h2>Compress</h2>
      {!file && <Dropzone onFile={onPick} />}
      {file && (
        <div>
          <div className="mb-4">
            <label>Target size: {targetSize}MB</label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={targetSize}
              onChange={(e) => setTargetSize(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <button className="btn" onClick={handleCompress}>
            {loading ? "Compressing..." : "Compress PDF"}
          </button>
          <button className="btn" style={{ marginLeft: 8 }} onClick={reset}>
            Reset
          </button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          {compressResult && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="font-bold">Compression Results:</h3>
              <p>
                Original: {(compressResult.originalSize / 1024 / 1024).toFixed(2)} MB
              </p>
              <p>
                Compressed: {(compressResult.compressedSize / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-green-600">
                Saved: {compressResult.compressionRatio}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
