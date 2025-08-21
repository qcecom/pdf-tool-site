import { useState } from "react";
import Dropzone from "../../components/Dropzone";
import ResultDownloadCard from "../../components/ResultDownloadCard";
import { deriveOutputName } from "@/pdf/utils";
import { compressPdf, type Profile } from "@/lib/pdf/compress";

export default function CompressPage() {
  const [profile, setProfile] = useState<Profile>("balanced");
  const [srcFile, setSrcFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ blob: Blob; before: number; after: number } | null>(null);

  async function onCompress(file: File, p: Profile) {
    const before = file.size;
    const outBlob = await compressPdf(file, p);
    const after = outBlob.size;
    return { blob: outBlob, before, after };
  }

  const onPick = async (file: File) => {
    setSrcFile(file);
    const res = await onCompress(file, profile);
    setResult(res);
  };

  const reset = () => {
    setSrcFile(null);
    setResult(null);
  };

  return (
    <div className="container">
      <h2>Compress</h2>
      <div style={{ marginBottom: 8 }}>
        {(["fast", "balanced", "max"] as Profile[]).map((p) => (
          <label key={p} style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="profile"
              value={p}
              checked={profile === p}
              onChange={() => setProfile(p)}
            /> {p}
          </label>
        ))}
      </div>
      {!srcFile && <Dropzone onFile={onPick} maxMB={100} />}
      {srcFile && result && (
        <ResultDownloadCard
          srcName={srcFile.name}
          srcSize={result.before}
          outName={deriveOutputName(srcFile.name, "-compressed", ".pdf")}
          outBlob={result.blob}
          onReset={reset}
        />
      )}
    </div>
  );
}
