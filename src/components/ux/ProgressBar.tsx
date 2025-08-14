'use client';
import React from 'react';

interface Props {
  percent: number;
  eta?: number; // seconds
}

export default function ProgressBar({ percent, eta }: Props) {
  const pct = Math.min(100, Math.max(0, percent));
  return (
    <div className="w-full" aria-live="polite" role="status">
      <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-blue-500 animate-pulse"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-600">
        {pct.toFixed(0)}%{eta !== undefined && !isNaN(eta) ? ` • ETA ${Math.ceil(eta)}s` : ''}
      </div>
    </div>
  );
}
