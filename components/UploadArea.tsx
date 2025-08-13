'use client';
import React, { useRef } from 'react';

interface UploadAreaProps {
  onFiles: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

export default function UploadArea({ onFiles, accept, multiple }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFiles(files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-400 rounded p-10 text-center cursor-pointer"
      onClick={handleClick}
    >
      <p className="mb-2">Drag and drop files here or click to upload.</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Select Files</button>
    </div>
  );
}
