import { useEffect, useRef, useState } from "react";

interface Props {
  progress: number; // 0-100
}

export default function ProgressBar({ progress }: Props) {
  const startRef = useRef<number>(Date.now());
  const [eta, setEta] = useState<string>("");

  useEffect(() => {
    const elapsed = Date.now() - startRef.current;
    if (progress > 0) {
      const total = (elapsed / progress) * 100;
      const remaining = Math.max(total - elapsed, 0);
      setEta(`${Math.round(remaining / 1000)}s`);
    }
  }, [progress]);

  return (
    <div>
      <div style={{ width: "100%", background: "#eee", height: 8 }}>
        <div
          style={{
            width: `${progress}%`,
            background: "#3b82f6",
            height: "100%"
          }}
        />
      </div>
      <div style={{ fontSize: 12 }}>{progress}% {eta && `ETA ${eta}`}</div>
    </div>
  );
}
