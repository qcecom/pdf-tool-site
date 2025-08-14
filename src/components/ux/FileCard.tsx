'use client';
import React from 'react';
import StepIndicator from './StepIndicator';
import ProgressBar from './ProgressBar';
import { FileJob } from '@/lib/jobTypes';

interface Props {
  job: FileJob;
  onCancel: () => void;
  onRetry: () => void;
}

export default function FileCard({ job, onCancel, onRetry }: Props) {
  const stepIndex =
    job.state === 'UPLOADING'
      ? 0
      : job.state === 'PROCESSING'
      ? 1
      : job.state === 'DONE'
      ? 2
      : 0;
  return (
    <div className="rounded border p-4 shadow mt-4" role="status">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{job.filename}</div>
          <div className="text-xs text-gray-500">{(job.size / 1024).toFixed(1)} kB</div>
        </div>
        {job.state === 'DONE' && job.downloadUrl && (
          <a
            href={job.downloadUrl}
            className="rounded bg-green-600 text-white px-3 py-1 text-sm focus:outline-none focus:ring"
          >
            Download
          </a>
        )}
        {job.state === 'ERROR' && (
          <button
            onClick={onRetry}
            className="rounded bg-yellow-500 text-white px-3 py-1 text-sm focus:outline-none focus:ring"
          >
            Retry
          </button>
        )}
        {(job.state === 'UPLOADING' || job.state === 'PROCESSING') && (
          <button
            onClick={onCancel}
            className="rounded bg-red-500 text-white px-3 py-1 text-sm focus:outline-none focus:ring"
          >
            Cancel
          </button>
        )}
      </div>
      <div className="mt-2">
        <StepIndicator current={stepIndex} />
      </div>
      {(job.state === 'UPLOADING' || job.state === 'PROCESSING') && (
        <div className="mt-2">
          <ProgressBar percent={job.progress} eta={job.eta} />
        </div>
      )}
      {job.state === 'ERROR' && job.error && (
        <div className="mt-2 text-sm text-red-600" role="alert">
          {job.error.message}
        </div>
      )}
    </div>
  );
}
