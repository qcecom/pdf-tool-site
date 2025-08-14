'use client';
import React, { useEffect } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function StatusToast({ message, type, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      role="status"
      className={`fixed bottom-4 right-4 rounded p-4 shadow text-white ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-sm underline focus:outline-none focus:ring"
        >
          Close
        </button>
      </div>
    </div>
  );
}
