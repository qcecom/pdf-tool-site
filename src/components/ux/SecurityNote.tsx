'use client';
import React from 'react';

export default function SecurityNote() {
  return (
    <p className="mt-4 text-xs text-gray-600 flex items-center gap-2" aria-live="polite" role="status">
      <span>🔒</span>
      <span>
        Files are processed securely over HTTPS. We never train on your data. Files are auto-deleted after processing.
      </span>
    </p>
  );
}
