'use client';
import React from 'react';

interface Props {
  value: number; // 0-100
}

export default function ProgressBar({ value }: Props) {
  return (
    <div className="w-full bg-gray-200 rounded">
      <div
        className="bg-blue-600 text-xs leading-none py-1 text-center text-white rounded"
        style={{ width: `${value}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        role="progressbar"
      >
        {value}%
      </div>
    </div>
  );
}
