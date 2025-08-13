'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  accept?: string;
  onFiles: (files: File[]) => void;
  onText?: (text: string) => void;
}

export default function DropZone({ accept, onFiles, onText }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      onFiles(Array.from(files));
    },
    [onFiles]
  );

  useEffect(() => {
    const zone = ref.current;
    if (!zone) return;
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      if (e.type === 'dragenter') setOver(true);
      if (e.type === 'dragleave') setOver(false);
    };
    const drop = (e: DragEvent) => {
      e.preventDefault();
      setOver(false);
      handleFiles(e.dataTransfer?.files || null);
    };
    zone.addEventListener('dragenter', prevent);
    zone.addEventListener('dragover', prevent);
    zone.addEventListener('dragleave', prevent);
    zone.addEventListener('drop', drop);
    return () => {
      zone.removeEventListener('dragenter', prevent);
      zone.removeEventListener('dragover', prevent);
      zone.removeEventListener('dragleave', prevent);
      zone.removeEventListener('drop', drop);
    };
  }, [handleFiles]);

  useEffect(() => {
    const paste = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files;
      if (files && files.length) handleFiles(files);
      const text = e.clipboardData?.getData('text');
      if (text && onText) onText(text);
    };
    window.addEventListener('paste', paste);
    return () => window.removeEventListener('paste', paste);
  }, [handleFiles, onText]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={`border-2 border-dashed rounded p-10 text-center cursor-pointer focus:outline-none focus:ring ${
        over ? 'bg-blue-50' : ''
      }`}
      onClick={() => {
        const inp = document.createElement('input');
        inp.type = 'file';
        if (accept) inp.accept = accept;
        inp.onchange = () => handleFiles(inp.files);
        inp.click();
      }}
      role="button"
      aria-label="Upload file"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') (e.target as HTMLElement).click();
      }}
    >
      Drop file here or click to upload
    </div>
  );
}
