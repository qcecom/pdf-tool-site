'use client';
import React from 'react';

interface Props {
  current: number; // 0-based index
}

const steps = ['Upload', 'Convert', 'Ready'];

export default function StepIndicator({ current }: Props) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((label, idx) => (
        <li
          key={label}
          className={`flex-1 text-center text-sm ${
            idx === current
              ? 'font-semibold text-blue-600'
              : idx < current
              ? 'text-green-600'
              : 'text-gray-400'
          }`}
        >
          <span
            className="block w-full rounded-full border p-1"
            aria-current={idx === current ? 'step' : undefined}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
