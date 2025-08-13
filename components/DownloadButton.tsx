'use client';
import React from 'react';

interface Props {
  blob: Blob;
  filename: string;
}

export default function DownloadButton({ blob, filename }: Props) {
  const url = React.useMemo(() => URL.createObjectURL(blob), [blob]);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <a
      href={url}
      download={filename}
      className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded"
    >
      Download
    </a>
  );
}
